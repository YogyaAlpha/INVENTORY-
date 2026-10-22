import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import multer from "multer";
import ExcelJS from "exceljs";
import { Readable } from "node:stream";
import { createHash, randomBytes, randomInt } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { copyFileSync, cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3001);
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32)
  throw new Error("Configure JWT_SECRET with at least 32 random characters in .env before starting GemFlow.");
const adminEmail = process.env.ADMIN_EMAIL || "admin@gemflow.local";
const adminPassword = process.env.ADMIN_PASSWORD;
if (!adminPassword || adminPassword.length < 12)
  throw new Error("Configure ADMIN_PASSWORD with at least 12 characters in .env before starting GemFlow.");
// Keep mutable application data outside the replaceable source/build folder.
// GEMFLOW_DATA_DIR can point at any backed-up location in production.
const configuredDataDir = process.env.GEMFLOW_DATA_DIR;
const dataDir = resolve(configuredDataDir || join(root, "..", "gemflow-data"));
mkdirSync(dataDir, { recursive: true });
const databasePath = join(dataDir, "gemflow.sqlite");
const legacyDatabasePath = join(root, "gemflow.sqlite");
if (!configuredDataDir && !existsSync(databasePath) && existsSync(legacyDatabasePath))
  copyFileSync(legacyDatabasePath, databasePath);
const uploadsDir = join(dataDir, "uploads");
const legacyUploadsDir = join(root, "uploads");
if (!configuredDataDir && !existsSync(uploadsDir) && existsSync(legacyUploadsDir))
  cpSync(legacyUploadsDir, uploadsDir, { recursive: true });
mkdirSync(uploadsDir, { recursive: true });
const db = new DatabaseSync(databasePath);

db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  phone TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_at TEXT,
  review_note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`);

const columns = db
  .prepare("PRAGMA table_info(users)")
  .all()
  .map((column) => column.name);
if (!columns.includes("status"))
  db.exec(
    "ALTER TABLE users ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'",
  );
if (!columns.includes("reviewed_at"))
  db.exec("ALTER TABLE users ADD COLUMN reviewed_at TEXT");
if (!columns.includes("review_note"))
  db.exec("ALTER TABLE users ADD COLUMN review_note TEXT");
if (!columns.includes("gst_number"))
  db.exec("ALTER TABLE users ADD COLUMN gst_number TEXT");
if (!columns.includes("profile_json"))
  db.exec("ALTER TABLE users ADD COLUMN profile_json TEXT");
if (!columns.includes("photo_path"))
  db.exec("ALTER TABLE users ADD COLUMN photo_path TEXT");
if (!columns.includes("business_id_path"))
  db.exec("ALTER TABLE users ADD COLUMN business_id_path TEXT");

db.exec(`CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT, stock_id TEXT NOT NULL UNIQUE COLLATE NOCASE,
  category TEXT NOT NULL DEFAULT 'natural_diamond', shape TEXT, carat REAL, color TEXT, clarity TEXT,
  cut TEXT, polish TEXT, symmetry TEXT, fluorescence TEXT, rap_price REAL, discount REAL,
  price_per_carat REAL, final_discount REAL, final_price_per_carat REAL, total_price REAL,
  lab TEXT, certificate_number TEXT, eye_clean TEXT, shade TEXT, measurement TEXT, depth REAL,
  table_pct REAL, ratio REAL, location TEXT, girdle TEXT, pavilion_angle REAL, pavilion_height REAL,
  crown_angle REAL, crown_height REAL, culet TEXT, star_length REAL, lower_half REAL, extra_facet TEXT,
  table_inclusion TEXT, table_side_inclusion TEXT, table_side_black TEXT, table_black TEXT, table_open TEXT,
  side_inclusion TEXT, side_black TEXT, side_open TEXT, hearts_arrows TEXT, luster TEXT, natural_comment TEXT,
  image_path TEXT, video_path TEXT, in_hand_video_path TEXT, certificate_path TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`);
db.exec(`CREATE TABLE IF NOT EXISTS cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, inventory_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(user_id, inventory_id)
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'placed',
  total_amount REAL NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL, inventory_id INTEGER NOT NULL,
  stone_snapshot TEXT NOT NULL
) ;
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, token_hash TEXT NOT NULL UNIQUE,
  expires_at INTEGER NOT NULL, used_at TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS favourites (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, inventory_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(user_id, inventory_id)
);
CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, inventory_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested', requested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT, admin_note TEXT
) ;
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY, user_id INTEGER NOT NULL, device_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, device_id)
);
CREATE TABLE IF NOT EXISTS user_notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  details_json TEXT,
  order_id INTEGER,
  inventory_id INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`);
const sessionColumns = db.prepare("PRAGMA table_info(user_sessions)").all().map(column => column.name);
if (!sessionColumns.includes("device_label")) db.exec("ALTER TABLE user_sessions ADD COLUMN device_label TEXT NOT NULL DEFAULT 'Previously registered device'");
db.exec(`CREATE TABLE IF NOT EXISTS device_login_challenges (
  id TEXT PRIMARY KEY, user_id INTEGER NOT NULL, device_id TEXT NOT NULL,
  device_label TEXT NOT NULL, expires_at INTEGER NOT NULL,
  otp_hash TEXT, otp_expires_at INTEGER, next_send_at INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0
)`);
const inventoryColumns = db
  .prepare("PRAGMA table_info(inventory)")
  .all()
  .map((column) => column.name);
if (!inventoryColumns.includes("is_visible"))
  db.exec(
    "ALTER TABLE inventory ADD COLUMN is_visible INTEGER NOT NULL DEFAULT 1",
  );
if (!inventoryColumns.includes("availability_status"))
  db.exec(
    "ALTER TABLE inventory ADD COLUMN availability_status TEXT NOT NULL DEFAULT 'available'",
  );
if (!inventoryColumns.includes("sold_at"))
  db.exec("ALTER TABLE inventory ADD COLUMN sold_at TEXT");
const advancedInventoryColumns = {
  milky: "TEXT",
  provenance: "TEXT",
  girdle_pct: "REAL",
  length: "REAL",
  width: "REAL",
  height: "REAL",
  diameter: "REAL",
  black_crown: "TEXT",
  white_table: "TEXT",
  white_crown: "TEXT",
  open_crown: "TEXT",
  open_pavilion: "TEXT",
  key_to_symbols: "TEXT",
  packet_number: "TEXT",
  show_id: "TEXT",
  memo_number: "TEXT",
  gemstone_type: "TEXT",
  treatment: "TEXT",
  origin: "TEXT",
  treatment_notes: "TEXT",
  supplier: "TEXT",
  is_pair: "INTEGER NOT NULL DEFAULT 0",
};
for (const [column, type] of Object.entries(advancedInventoryColumns)) {
  if (!inventoryColumns.includes(column))
    db.exec(`ALTER TABLE inventory ADD COLUMN ${column} ${type}`);
}
const orderColumns = db
  .prepare("PRAGMA table_info(orders)")
  .all()
  .map((column) => column.name);
if (!orderColumns.includes("reviewed_at"))
  db.exec("ALTER TABLE orders ADD COLUMN reviewed_at TEXT");
if (!orderColumns.includes("admin_note"))
  db.exec("ALTER TABLE orders ADD COLUMN admin_note TEXT");

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: "50kb" }));
app.use("/uploads", express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (_req, _file, done) => done(null, uploadsDir),
  filename: (_req, file, done) =>
    done(
      null,
      `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
    ),
});
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });
const spreadsheetUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

const cleanEmail = (value = "") => value.trim().toLowerCase();
const cleanPhone = (value = "") => value.replace(/[^\d+]/g, "");
db.exec(`CREATE TABLE IF NOT EXISTS password_sms_codes (
  user_id INTEGER PRIMARY KEY, phone TEXT NOT NULL, code_hash TEXT,
  expires_at INTEGER NOT NULL DEFAULT 0, next_send_at INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0
)`);
const loginOtps = new Map();
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_RESEND_MS = 45 * 1000;
const otpHash = (phone, otp) =>
  createHash("sha256")
    .update(`${phone}:${otp}:${jwtSecret}`)
    .digest("hex");

async function sendLoginOtp(phone, otp, purpose = "login") {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !from) {
    if (process.env.NODE_ENV !== "production" && purpose === "login") {
      console.info(`[GemFlow development OTP] ${phone}: ${otp}`);
      return { sent: true, development: true };
    }
    throw new Error("SMS delivery is not configured. Please contact the administrator or reset your password by email.");
  }
  const body = new URLSearchParams({
    To: e164Phone(phone),
    From: from,
    Body: `Your GemFlow ${purpose === "password-reset" ? "password reset" : "login"} OTP is ${otp}. It expires in 5 minutes. Do not share it.`,
  });
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok) {
    const detail = await response.text();
    console.error("Twilio OTP delivery failed:", response.status, detail);
    throw new Error("The OTP could not be sent. Please try again shortly.");
  }
  return { sent: true, development: false };
}
const publicUser = (row) => ({
  id: row.id,
  userId: `GF-${String(row.id).padStart(6, "0")}`,
  name: row.name,
  companyName: row.company_name,
  email: row.email,
  phone: row.phone,
  gstNumber: row.gst_number || "",
  status: row.status,
  createdAt: row.created_at,
  reviewedAt: row.reviewed_at,
  reviewNote: row.review_note,
  profile: (() => { try { return JSON.parse(row.profile_json || "{}"); } catch { return {}; } })(),
  photoPath: row.photo_path || "",
  businessIdPath: row.business_id_path || "",
});
const issueToken = (user, sessionId) =>
  jwt.sign({ sub: user.id, sid: sessionId }, jwtSecret, { expiresIn: "7d" });
const issueAdminToken = () =>
  jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "8h" });

async function completeUserLogin(user, rawDeviceId, res, deviceLabel = "Unknown browser") {
  if (user.status === "pending")
    return res.status(403).json({ message: "Your registration is awaiting administrator approval." });
  if (user.status === "rejected")
    return res.status(403).json({ message: "Your registration was not approved. Please apply again with complete credentials." });
  const deviceId = String(rawDeviceId || "").trim().slice(0, 200);
  if (!deviceId)
    return res.status(400).json({ message: "Device identification is required." });
  const existingSession = db.prepare("SELECT id FROM user_sessions WHERE user_id=? AND device_id=?").get(user.id, deviceId);
  if (!existingSession) {
    const activeCount = db.prepare("SELECT COUNT(*) count FROM user_sessions WHERE user_id=?").get(user.id).count;
    if (activeCount >= 3) {
      db.prepare("DELETE FROM device_login_challenges WHERE expires_at<?").run(Date.now());
      const challengeId = randomBytes(32).toString("hex");
      db.prepare("INSERT INTO device_login_challenges (id,user_id,device_id,device_label,expires_at) VALUES (?,?,?,?,?)")
        .run(challengeId, user.id, deviceId, deviceLabel, Date.now() + 10 * 60 * 1000);
      return res.json({ deviceLimit: true, challengeId, devices: deviceSessions(user.id), email: maskedEmail(user.email) });
    }
  }
  const sessionId = existingSession?.id || randomBytes(24).toString("hex");
  db.prepare(`INSERT INTO user_sessions (id,user_id,device_id,device_label) VALUES (?,?,?,?)
    ON CONFLICT(user_id,device_id) DO UPDATE SET last_seen_at=CURRENT_TIMESTAMP,device_label=excluded.device_label`).run(sessionId, user.id, deviceId, deviceLabel);
  return res.json({ token: issueToken(user, sessionId), user: publicUser(user) });
}
const inventoryFields = [
  "stock_id",
  "category",
  "shape",
  "carat",
  "color",
  "clarity",
  "cut",
  "polish",
  "symmetry",
  "fluorescence",
  "rap_price",
  "discount",
  "price_per_carat",
  "final_discount",
  "final_price_per_carat",
  "total_price",
  "lab",
  "certificate_number",
  "eye_clean",
  "shade",
  "measurement",
  "depth",
  "table_pct",
  "ratio",
  "location",
  "girdle",
  "pavilion_angle",
  "pavilion_height",
  "crown_angle",
  "crown_height",
  "culet",
  "star_length",
  "lower_half",
  "extra_facet",
  "table_inclusion",
  "table_side_inclusion",
  "table_side_black",
  "table_black",
  "table_open",
  "side_inclusion",
  "side_black",
  "side_open",
  "hearts_arrows",
  "luster",
  "natural_comment",
  "milky",
  "provenance",
  "girdle_pct",
  "length",
  "width",
  "height",
  "diameter",
  "black_crown",
  "white_table",
  "white_crown",
  "open_crown",
  "open_pavilion",
  "key_to_symbols",
  "packet_number",
  "show_id",
  "memo_number",
  "gemstone_type",
  "treatment",
  "origin",
  "treatment_notes",
  "supplier",
  "is_pair",
];
const numberFields = new Set([
  "carat",
  "rap_price",
  "discount",
  "price_per_carat",
  "final_discount",
  "final_price_per_carat",
  "total_price",
  "depth",
  "table_pct",
  "ratio",
  "pavilion_angle",
  "pavilion_height",
  "crown_angle",
  "crown_height",
  "star_length",
  "lower_half",
  "girdle_pct",
  "length",
  "width",
  "height",
  "diameter",
  "is_pair",
]);
const publicStone = (row) =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
      value,
    ]),
  );
const createUserNotification = ({ userId, type, title, message, details = null, orderId = null, inventoryId = null }) =>
  db.prepare(
    "INSERT INTO user_notifications (user_id,type,title,message,details_json,order_id,inventory_id) VALUES (?,?,?,?,?,?,?)",
  ).run(userId, type, title, message, details ? JSON.stringify(details) : null, orderId, inventoryId);
const allowedInventoryCategories = new Set(["natural_diamond", "lab_diamond", "color_stone"]);
const normalizeHeading = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
const headingAliases = {
  stockid: "stock_id",
  stone_id: "stock_id",
  stock_no: "stock_id",
  stock_number: "stock_id",
  wt: "carat",
  weight: "carat",
  carat_weight: "carat",
  fluo: "fluorescence",
  fluor: "fluorescence",
  rap: "rap_price",
  rap_price_usd: "rap_price",
  disc: "discount",
  price_ct: "price_per_carat",
  usd_ct: "price_per_carat",
  final_disc: "final_discount",
  final_price_ct: "final_price_per_carat",
  final_usd_ct: "final_price_per_carat",
  final_total: "total_price",
  total: "total_price",
  certificate: "certificate_number",
  cert_no: "certificate_number",
  cert_number: "certificate_number",
  table: "table_pct",
  table_percent: "table_pct",
  depth_percent: "depth",
  eye: "eye_clean",
  packet_no: "packet_number",
  packet: "packet_number",
  showid: "show_id",
  memo_no: "memo_number",
  key_symbols: "key_to_symbols",
  key_to_symbol: "key_to_symbols",
  image: "image_path",
  image_url: "image_path",
  image_link: "image_path",
  video: "video_path",
  video_url: "video_path",
  video_link: "video_path",
  in_hand_video: "in_hand_video_path",
  in_hand_video_url: "in_hand_video_path",
  certificate_url: "certificate_path",
  certificate_link: "certificate_path",
  certi_link: "certificate_path",
  cert_link: "certificate_path",
  stone_type: "gemstone_type",
  type: "gemstone_type",
  treatment_note: "treatment_notes",
  notes: "treatment_notes",
  vendor: "supplier",
  pair: "is_pair",
  pairs: "is_pair",
};
const canonicalField = (heading) => {
  const normalized = normalizeHeading(heading);
  return headingAliases[normalized] || normalized;
};
const parseInventoryNumber = (value) => {
  if (value === "" || value == null) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const cleaned = String(value)
    .trim()
    .replace(/,/g, "")
    .replace(/[^0-9+\-.]/g, "");
  if (!cleaned || cleaned === "." || cleaned === "-" || cleaned === "+")
    return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
};
function inventoryValues(source, category) {
  return inventoryFields.map((field) => {
    const raw = field === "category" ? category : source[field];
    if (numberFields.has(field)) return parseInventoryNumber(raw);
    return raw == null ? "" : String(raw).trim();
  });
}
const insertInventory = db.prepare(
  `INSERT INTO inventory (${inventoryFields.join(",")}) VALUES (${inventoryFields.map(() => "?").join(",")})`,
);
const updateInventoryFields = inventoryFields.filter(
  (field) => field !== "stock_id",
);
const upsertInventory = db.prepare(
  `INSERT INTO inventory (${inventoryFields.join(",")}) VALUES (${inventoryFields.map(() => "?").join(",")})
   ON CONFLICT(stock_id) DO UPDATE SET ${updateInventoryFields.map((field) => `${field}=excluded.${field}`).join(",")}`,
);
const spreadsheetMediaFields = ["image_path", "video_path", "in_hand_video_path", "certificate_path"];
const safeMediaUrl = (value) => {
  const text = String(value || "").trim();
  if (!text) return "";
  try {
    const url = new URL(text);
    return ["http:", "https:"].includes(url.protocol) ? text : "";
  } catch { return ""; }
};
const upsertInventoryWithMedia = db.prepare(
  `INSERT INTO inventory (${[...inventoryFields, ...spreadsheetMediaFields].join(",")}) VALUES (${[...inventoryFields, ...spreadsheetMediaFields].map(() => "?").join(",")})
   ON CONFLICT(stock_id) DO UPDATE SET ${[...updateInventoryFields, ...spreadsheetMediaFields].map((field) => `${field}=CASE WHEN excluded.${field}='' THEN ${field} ELSE excluded.${field} END`).join(",")}`,
);

function mailTransport() {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  )
    return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE) === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function sendDecisionEmail(user, decision) {
  const transport = mailTransport();
  if (!transport) return { sent: false, reason: "SMTP is not configured" };
  const approved = decision === "approved";
  const loginUrl = publicAppUrl();
  const subject = approved
    ? "Congratulations — your GemFlow account is approved"
    : "Update on your GemFlow registration";
  const html = approved
    ? `<h2>Welcome to GemFlow, ${user.name}!</h2><p>Your business registration has been approved.</p><p><strong>User ID:</strong> GF-${String(user.id).padStart(6, "0")}<br><strong>Registered email:</strong> ${user.email}</p><p>Use the password you created during registration to <a href="${loginUrl}">login to GemFlow</a>.</p><p>For your security, GemFlow will never send or display your password by email.</p>`
    : `<h2>Hello ${user.name},</h2><p>We could not approve your GemFlow registration at this time.</p><p>Please apply again using complete and verifiable personal and company credentials.</p><p>If you believe this decision was made in error, contact the GemFlow team.</p>`;
  await transport.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: user.email,
    subject,
    html,
  });
  return { sent: true };
}

function publicAppUrl() {
  const configured = process.env.APP_URL || process.env.RENDER_EXTERNAL_URL ||
    (process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN ? `https://${process.env.CODESPACE_NAME}-3001.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}` : "") ||
    (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : "") || process.env.CLIENT_ORIGIN;
  if (!configured && process.env.NODE_ENV === "production") throw new Error("Set APP_URL to the public website URL before sending password reset emails.");
  const url = new URL(configured || "http://localhost:5173");
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash)
    throw new Error("APP_URL must be a valid public website URL without query parameters.");
  if (process.env.NODE_ENV === "production" && (url.protocol !== "https:" || ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)))
    throw new Error("Set APP_URL to the public HTTPS website URL, not localhost.");
  return url.href.replace(/\/$/, "");
}

async function sendPasswordResetEmail(user, rawToken) {
  const transport = mailTransport();
  if (!transport) return { sent: false, reason: "SMTP is not configured" };
  const appUrl = publicAppUrl();
  const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;
  await transport.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: user.email,
    subject: "Reset your GemFlow password",
    text: `Reset your GemFlow password: ${resetUrl}\nThis link expires in one hour and works once.`,
    html: `<h2>Reset your GemFlow password</h2><p>Hello ${user.name},</p><p>Use the secure link below to set a new password. This link expires in one hour and can be used only once.</p><p><a href="${resetUrl}">Reset my password</a></p><p>If you did not request this change, you can ignore this email.</p>`,
  });
  return { sent: true };
}

const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
async function sendOrderDecisionEmail(order, user, stones, status) {
  const transport = mailTransport();
  if (!transport) return { sent: false, reason: "SMTP is not configured" };
  const accepted = status === "accepted";
  const subject = accepted
    ? `${order.orderNumber} accepted — GemFlow`
    : `${order.orderNumber} rejected — GemFlow`;
  const html = accepted
    ? `<h2>Your GemFlow order has been accepted</h2><p>Hello ${user.name}, your order <strong>${order.orderNumber}</strong> has been confirmed.</p><p>The ordered stone list is attached in an Excel-compatible CSV file.</p>`
    : `<h2>Your GemFlow order could not be accepted</h2><p>Hello ${user.name}, order <strong>${order.orderNumber}</strong> has been rejected due to unavailability of the requested stone.</p>`;
  const headers = [
    "Stone ID",
    "Category",
    "Shape",
    "Carat",
    "Color",
    "Clarity",
    "Cut",
    "Polish",
    "Symmetry",
    "Lab",
    "Certificate",
    "Location",
    "Final Total",
  ];
  const rows = stones.map((s) => [
    s.stockId,
    s.category,
    s.shape,
    s.carat,
    s.color,
    s.clarity,
    s.cut,
    s.polish,
    s.symmetry,
    s.lab,
    s.certificateNumber,
    s.location,
    s.totalPrice,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");
  await transport.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: user.email,
    subject,
    html,
    attachments: accepted
      ? [
          {
            filename: `${order.orderNumber}-stones.csv`,
            content: Buffer.from(csv, "utf8"),
            contentType: "text/csv",
          },
        ]
      : [],
  });
  return { sent: true };
}

app.post("/api/auth/register", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const companyName = String(req.body.companyName || "").trim();
    const email = cleanEmail(req.body.email);
    const phone = cleanPhone(req.body.phone);
    const gstNumber = String(req.body.gstNumber || "").trim().toUpperCase();
    const password = String(req.body.password || "");
    if (!name || !companyName || !email || !phone || !password)
      return res
        .status(400)
        .json({ message: "Please complete every registration field." });
    if (!/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ message: "Enter a valid email address." });
    if (!/^\+?\d{8,15}$/.test(phone))
      return res.status(400).json({
        message: "Enter a valid mobile number including country code.",
      });
    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    if (gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gstNumber))
      return res.status(400).json({ message: "Enter a valid 15-character GST number or leave it blank." });
    const duplicate = db
      .prepare("SELECT id FROM users WHERE email = ? OR phone = ?")
      .get(email, phone);
    if (duplicate)
      return res.status(409).json({
        message: "An account with this email or mobile number already exists.",
      });
    const hash = await bcrypt.hash(password, 12);
    const result = db
      .prepare(
        "INSERT INTO users (name, company_name, email, phone, password_hash, gst_number) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .run(name, companyName, email, phone, hash, gstNumber || null);
    const user = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(result.lastInsertRowid);
    res.status(201).json({
      pending: true,
      message:
        "Registration received. You can login after an administrator approves your account.",
      user: publicUser(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration could not be completed." });
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  const email = cleanEmail(req.body.email);
  const generic = "If this email is registered, a password-reset link has been sent.";
  if (!/^\S+@\S+\.\S+$/.test(email))
    return res.status(400).json({ message: "Enter a valid email address." });
  try { publicAppUrl(); } catch (error) { return res.status(503).json({ message: error.message }); }
  if (!mailTransport()) return res.status(503).json({ message: "Email delivery is not configured. Please contact the administrator or reset by SMS." });
  const user = db.prepare("SELECT * FROM users WHERE email=?").get(email);
  if (!user) return res.json({ message: generic });
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  db.prepare("DELETE FROM password_reset_tokens WHERE user_id=? OR expires_at<?").run(
    user.id,
    Date.now(),
  );
  db.prepare(
    "INSERT INTO password_reset_tokens (user_id,token_hash,expires_at) VALUES (?,?,?)",
  ).run(user.id, tokenHash, Date.now() + 60 * 60 * 1000);
  try {
    const emailResult = await sendPasswordResetEmail(user, rawToken);
    if (!emailResult.sent) throw new Error("Email delivery unavailable");
  } catch (error) {
    db.prepare("DELETE FROM password_reset_tokens WHERE token_hash=?").run(tokenHash);
    console.error("Password reset email failed:", error);
    return res.status(503).json({ message: "The reset email could not be delivered. Please try again or reset by SMS." });
  }
  res.json({ message: generic });
});

app.post("/api/auth/reset-password", async (req, res) => {
  const rawToken = String(req.body.token || "");
  const password = String(req.body.password || "");
  if (password.length < 8)
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  const reset = db
    .prepare("SELECT * FROM password_reset_tokens WHERE token_hash=? AND used_at IS NULL AND expires_at>?")
    .get(tokenHash, Date.now());
  if (!reset)
    return res.status(400).json({ message: "This reset link is invalid or has expired." });
  const hash = await bcrypt.hash(password, 12);
  try {
    db.exec("BEGIN IMMEDIATE");
    const consumed = db.prepare("UPDATE password_reset_tokens SET used_at=CURRENT_TIMESTAMP WHERE id=? AND used_at IS NULL AND expires_at>?").run(reset.id, Date.now());
    if (!consumed.changes) {
      db.exec("ROLLBACK");
      return res.status(400).json({ message: "This reset link is invalid or has expired." });
    }
    db.prepare("UPDATE users SET password_hash=? WHERE id=?").run(hash, reset.user_id);
    db.prepare("DELETE FROM user_sessions WHERE user_id=?").run(reset.user_id);
    db.prepare("DELETE FROM password_sms_codes WHERE user_id=?").run(reset.user_id);
    db.prepare("DELETE FROM device_login_challenges WHERE user_id=?").run(reset.user_id);
    loginOtps.delete(cleanPhone(db.prepare("SELECT phone FROM users WHERE id=?").get(reset.user_id).phone));
    db.exec("COMMIT");
    res.json({ message: "Password updated. You can now login with your new password." });
  } catch (error) {
    try { db.exec("ROLLBACK"); } catch {}
    res.status(500).json({ message: "Password could not be updated." });
  }
});

// Preserve previously stored phone formats while delivering SMS in E.164 format.
const resetPhoneVariants = raw => {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length === 10) return [digits, `91${digits}`, `+91${digits}`];
  if (digits.length === 12 && digits.startsWith("91")) return [digits.slice(2), digits, `+${digits}`];
  return [digits, `+${digits}`];
};
const userForResetPhone = raw => {
  const variants = resetPhoneVariants(raw);
  const users = db.prepare(`SELECT * FROM users WHERE phone IN (${variants.map(() => "?").join(",")})`).all(...variants);
  return users.length === 1 ? users[0] : null;
};
const e164Phone = raw => {
  const digits = String(raw).replace(/\D/g, "");
  return digits.length === 10 ? `+91${digits}` : `+${digits}`;
};
app.post("/api/auth/request-password-reset-otp", async (req, res) => {
  if (!/^\+?[\d\s()-]{8,24}$/.test(String(req.body.phone || "")))
    return res.status(400).json({ message: "Enter your registered mobile number with country code." });
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER)
    return res.status(503).json({ message: "SMS delivery is not configured. Please contact the administrator or reset by email." });
  const generic = { message: "If this mobile number is registered, a password reset OTP has been sent. It expires in 5 minutes." };
  const user = userForResetPhone(req.body.phone);
  if (!user) return res.json(generic);
  const previous = db.prepare("SELECT * FROM password_sms_codes WHERE user_id=?").get(user.id);
  if (previous?.next_send_at > Date.now()) return res.status(429).json({ message: "Please wait 45 seconds before requesting another OTP." });
  const phone = e164Phone(user.phone), otp = String(randomInt(100000, 1000000));
  db.prepare(`INSERT INTO password_sms_codes (user_id,phone,next_send_at) VALUES (?,?,?)
    ON CONFLICT(user_id) DO UPDATE SET next_send_at=excluded.next_send_at`).run(user.id, phone, Date.now() + OTP_RESEND_MS);
  try {
    await sendLoginOtp(phone, otp, "password-reset");
    db.prepare("UPDATE password_sms_codes SET code_hash=?,expires_at=?,attempts=0 WHERE user_id=?").run(otpHash(`reset:${user.id}`, otp), Date.now() + OTP_TTL_MS, user.id);
    return res.json(generic);
  } catch (error) {
    console.error("Password reset SMS delivery failed:", error.message);
    return res.status(503).json({ message: "The reset SMS could not be delivered. Please try again or reset by email." });
  }
});
app.post("/api/auth/reset-password-with-otp", async (req, res) => {
  const password = String(req.body.password || ""), otp = String(req.body.otp || "");
  if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });
  const user = userForResetPhone(req.body.phone);
  const record = user && db.prepare("SELECT * FROM password_sms_codes WHERE user_id=?").get(user.id);
  if (!record?.code_hash || record.expires_at <= Date.now()) return res.status(400).json({ message: "Invalid or expired OTP. Request a new code." });
  if (record.attempts >= 5) return res.status(429).json({ message: "Too many incorrect attempts. Request a new OTP." });
  db.prepare("UPDATE password_sms_codes SET attempts=attempts+1 WHERE user_id=?").run(user.id);
  if (!/^\d{6}$/.test(otp) || otpHash(`reset:${user.id}`, otp) !== record.code_hash) return res.status(401).json({ message: "Incorrect OTP." });
  const hash = await bcrypt.hash(password, 12);
  try {
    db.exec("BEGIN IMMEDIATE");
    const consumed = db.prepare("DELETE FROM password_sms_codes WHERE user_id=? AND code_hash=? AND expires_at>?").run(user.id, record.code_hash, Date.now());
    if (!consumed.changes) {
      db.exec("ROLLBACK");
      return res.status(400).json({ message: "Invalid or expired OTP. Request a new code." });
    }
    db.prepare("UPDATE users SET password_hash=? WHERE id=?").run(hash, user.id);
    db.prepare("DELETE FROM user_sessions WHERE user_id=?").run(user.id);
    db.prepare("DELETE FROM password_reset_tokens WHERE user_id=?").run(user.id);
    db.prepare("DELETE FROM device_login_challenges WHERE user_id=?").run(user.id);
    loginOtps.delete(cleanPhone(user.phone));
    db.exec("COMMIT");
    return res.json({ message: "Password updated. Log in with your new password." });
  } catch {
    try { db.exec("ROLLBACK"); } catch {}
    return res.status(500).json({ message: "Password could not be updated." });
  }
});

const describeDevice = (req) => {
  const ua = String(req.headers["user-agent"] || "");
  const browser = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Browser";
  const os = /iPhone/.test(ua) ? "iPhone" : /iPad/.test(ua) ? "iPad" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac/.test(ua) ? "Mac" : /Linux/.test(ua) ? "Linux" : "Unknown device";
  return `${browser} on ${os}`;
};
const maskedEmail = email => email.replace(/^(.)(.*)(@.*)$/, "$1•••$3");
const deviceSessions = userId => db.prepare("SELECT id,device_label label,created_at createdAt,last_seen_at lastSeenAt FROM user_sessions WHERE user_id=? ORDER BY created_at,id").all(userId);
const getDeviceChallenge = req => db.prepare("SELECT * FROM device_login_challenges WHERE id=? AND device_id=? AND expires_at>?").get(String(req.body.challengeId || ""), String(req.body.deviceId || ""), Date.now());

app.post("/api/auth/device-login/send-otp", async (req, res) => {
  const challenge = getDeviceChallenge(req);
  if (!challenge) return res.status(400).json({ message: "Login request expired. Please login again." });
  const user = db.prepare("SELECT * FROM users WHERE id=? AND status='approved'").get(challenge.user_id);
  if (!user) return res.status(403).json({ message: "Account is not approved." });
  // A user-wide cooldown also prevents a fresh password login bypassing the resend limit.
  const recent = db.prepare("SELECT MAX(next_send_at) nextSend FROM device_login_challenges WHERE user_id=?").get(user.id);
  if (recent.nextSend > Date.now()) return res.status(429).json({ message: "Please wait 45 seconds before requesting another code." });
  const transport = mailTransport();
  if (!transport) return res.status(503).json({ message: "Email delivery is not configured. Please contact the administrator." });
  const code = String(randomInt(100000, 1000000));
  const hash = otpHash(challenge.id, code);
  // Reserve the cooldown before awaiting mail delivery.
  db.prepare("UPDATE device_login_challenges SET next_send_at=? WHERE id=?").run(Date.now() + OTP_RESEND_MS, challenge.id);
  try {
    await transport.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to: user.email,
      subject: "GemFlow — verify your new device", text: `Your GemFlow new-device code is ${code}. It expires in 5 minutes. Only enter this code if you are replacing a logged-in device. Never share this code.` });
    db.prepare("UPDATE device_login_challenges SET otp_hash=?,otp_expires_at=?,attempts=0 WHERE id=?").run(hash, Date.now() + OTP_TTL_MS, challenge.id);
    res.json({ message: `Verification code sent to ${maskedEmail(user.email)}.` });
  } catch {
    res.status(503).json({ message: "The email could not be sent. Please try again shortly." });
  }
});

app.post("/api/auth/device-login/verify", (req, res) => {
  const challenge = getDeviceChallenge(req);
  if (!challenge || !challenge.otp_hash || challenge.otp_expires_at < Date.now()) return res.status(400).json({ message: "Code expired. Request a new code or login again." });
  if (challenge.attempts >= 5) return res.status(429).json({ message: "Too many attempts. Request a new code." });
  db.prepare("UPDATE device_login_challenges SET attempts=attempts+1 WHERE id=?").run(challenge.id);
  const code = String(req.body.otp || "");
  if (!/^\d{6}$/.test(code) || otpHash(challenge.id, code) !== challenge.otp_hash) return res.status(401).json({ message: "Incorrect verification code." });
  const user = db.prepare("SELECT * FROM users WHERE id=? AND status='approved'").get(challenge.user_id);
  if (!user) return res.status(403).json({ message: "Account is not approved." });
  try {
    db.exec("BEGIN IMMEDIATE");
    const chosen = db.prepare("SELECT id FROM user_sessions WHERE id=? AND user_id=?").get(String(req.body.sessionId || ""), user.id);
    const existing = db.prepare("SELECT id FROM user_sessions WHERE user_id=? AND device_id=?").get(user.id, challenge.device_id);
    const count = db.prepare("SELECT COUNT(*) count FROM user_sessions WHERE user_id=?").get(user.id).count;
    if (!existing && count >= 3 && !chosen) {
      db.exec("ROLLBACK");
      return res.status(409).json({ message: "Device list changed. Please select an active device.", devices: deviceSessions(user.id) });
    }
    if (chosen && !existing) db.prepare("DELETE FROM user_sessions WHERE id=? AND user_id=?").run(chosen.id, user.id);
    const sessionId = existing?.id || randomBytes(24).toString("hex");
    if (!existing) db.prepare("INSERT INTO user_sessions (id,user_id,device_id,device_label) VALUES (?,?,?,?)").run(sessionId, user.id, challenge.device_id, challenge.device_label);
    // Invalidate other outstanding challenges after successful replacement.
    db.prepare("DELETE FROM device_login_challenges WHERE user_id=?").run(user.id);
    db.exec("COMMIT");
    return res.json({ token: issueToken(user, sessionId), user: publicUser(user) });
  } catch {
    try { db.exec("ROLLBACK"); } catch {}
    return res.status(500).json({ message: "Unable to replace device. Please try again." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const identifier = String(req.body.identifier || "").trim();
  const password = String(req.body.password || "");
  const user = db
    .prepare("SELECT * FROM users WHERE email = ? OR phone = ?")
    .get(cleanEmail(identifier), cleanPhone(identifier));
  if (!user || !(await bcrypt.compare(password, user.password_hash)))
    return res
      .status(401)
      .json({ message: "Incorrect email/mobile number or password." });
  return completeUserLogin(user, req.body.deviceId, res, describeDevice(req));
});

app.post("/api/auth/request-login-otp", async (req, res) => {
  const enteredPhone = cleanPhone(req.body.phone);
  const matchedUser = userForResetPhone(enteredPhone);
  const phone = matchedUser?.phone || enteredPhone;
  if (!/^\+?\d{8,15}$/.test(phone))
    return res.status(400).json({ message: "Enter your registered mobile number including country code." });
  const user = matchedUser;
  if (!user)
    return res.status(404).json({ message: "No account uses this mobile number." });
  if (user.status !== "approved")
    return res.status(403).json({ message: user.status === "pending" ? "Your registration is awaiting administrator approval." : "This account is not approved for login." });
  const current = loginOtps.get(phone);
  if (current && current.nextSendAt > Date.now())
    return res.status(429).json({ message: `Please wait ${Math.ceil((current.nextSendAt - Date.now()) / 1000)} seconds before requesting another OTP.` });
  const otp = String(randomInt(100000, 1000000));
  try {
    const delivery = await sendLoginOtp(phone, otp);
    loginOtps.set(phone, {
      userId: user.id,
      hash: otpHash(phone, otp),
      expiresAt: Date.now() + OTP_TTL_MS,
      nextSendAt: Date.now() + OTP_RESEND_MS,
      attempts: 0,
    });
    res.json({
      message: `OTP sent to ${phone.replace(/.(?=.{4})/g, "•")}. It expires in 5 minutes.`,
      expiresIn: 300,
      ...(delivery.development ? { developmentOtp: otp } : {}),
    });
  } catch (error) {
    res.status(503).json({ message: error.message || "The OTP could not be sent." });
  }
});

app.post("/api/auth/login-with-otp", (req, res) => {
  const enteredPhone = cleanPhone(req.body.phone);
  const phone = userForResetPhone(enteredPhone)?.phone || enteredPhone;
  const otp = String(req.body.otp || "").replace(/\D/g, "").slice(0, 6);
  const record = loginOtps.get(phone);
  if (!record || record.expiresAt < Date.now()) {
    loginOtps.delete(phone);
    return res.status(400).json({ message: "This OTP has expired. Request a new one." });
  }
  if (record.attempts >= 5) {
    loginOtps.delete(phone);
    return res.status(429).json({ message: "Too many incorrect attempts. Request a new OTP." });
  }
  record.attempts += 1;
  if (otp.length !== 6 || otpHash(phone, otp) !== record.hash)
    return res.status(401).json({ message: "Incorrect OTP. Please check the code and try again." });
  loginOtps.delete(phone);
  const user = db.prepare("SELECT * FROM users WHERE id=?").get(record.userId);
  if (!user) return res.status(404).json({ message: "Account not found." });
  return completeUserLogin(user, req.body.deviceId, res, describeDevice(req));
});

function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    const payload = jwt.verify(token, jwtSecret);
    const user = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(payload.sub);
    if (!user) throw new Error("User missing");
    if (!payload.sid || !db.prepare("SELECT id FROM user_sessions WHERE id=? AND user_id=?").get(payload.sid, user.id))
      throw new Error("Session missing");
    db.prepare("UPDATE user_sessions SET last_seen_at=CURRENT_TIMESTAMP WHERE id=?").run(payload.sid);
    req.sessionId = payload.sid;
    req.user = user;
    next();
  } catch {
    res
      .status(401)
      .json({ message: "Your session has expired. Please login again." });
  }
}

app.get("/api/auth/me", requireAuth, (req, res) =>
  res.json({ user: publicUser(req.user) }),
);
app.get("/api/notifications", requireAuth, (req, res) => {
  db.prepare("DELETE FROM user_notifications WHERE created_at < datetime('now','-72 hours')").run();
  const rows = db
    .prepare(
      "SELECT * FROM user_notifications WHERE user_id=? AND created_at>=datetime('now','-72 hours') ORDER BY created_at DESC,id DESC",
    )
    .all(req.user.id);
  res.json({
    notifications: rows.map((row) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      message: row.message,
      details: row.details_json ? JSON.parse(row.details_json) : null,
      orderId: row.order_id,
      inventoryId: row.inventory_id,
      createdAt: row.created_at,
      expiresAt: new Date(`${row.created_at.replace(" ", "T")}Z`).getTime() + 72 * 60 * 60 * 1000,
    })),
  });
});
const profileFields = new Set(["firstName","lastName","designation","secondaryEmail","purchaseMode","gender","address","country","state","city","telephone","mobile","zipCode","faxNumber","businessType","howDidYouKnowUs","qqId","skypeId","wechatId","whatsappId"]);
app.patch("/api/account/profile", requireAuth, upload.fields([{ name: "photo", maxCount: 1 }, { name: "businessId", maxCount: 1 }]), (req, res) => {
  const current = publicUser(req.user).profile;
  const profile = { ...current };
  for (const field of profileFields) if (Object.prototype.hasOwnProperty.call(req.body, field)) profile[field] = String(req.body[field] || "").trim().slice(0, 300);
  const photoPath = req.files?.photo?.[0] ? `/uploads/${req.files.photo[0].filename}` : req.user.photo_path;
  const businessIdPath = req.files?.businessId?.[0] ? `/uploads/${req.files.businessId[0].filename}` : req.user.business_id_path;
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || req.user.name;
  db.prepare("UPDATE users SET name=?,profile_json=?,photo_path=?,business_id_path=? WHERE id=?").run(name, JSON.stringify(profile), photoPath || null, businessIdPath || null, req.user.id);
  res.json({ message: "Account profile updated.", user: publicUser(db.prepare("SELECT * FROM users WHERE id=?").get(req.user.id)) });
});
app.post("/api/auth/logout", requireAuth, (req, res) => {
  db.prepare("DELETE FROM user_sessions WHERE id=?").run(req.sessionId);
  res.json({ message: "Logged out." });
});
app.post("/api/admin/login", (req, res) => {
  if (
    String(req.body.email || "")
      .trim()
      .toLowerCase() !== adminEmail.toLowerCase() ||
    String(req.body.password || "") !== adminPassword
  )
    return res
      .status(401)
      .json({ message: "Incorrect administrator credentials." });
  res.json({ token: issueAdminToken(), admin: { email: adminEmail } });
});

function requireAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    const payload = jwt.verify(token, jwtSecret);
    if (payload.role !== "admin") throw new Error("Not admin");
    next();
  } catch {
    res.status(401).json({ message: "Administrator session expired." });
  }
}

app.get("/api/admin/users", requireAdmin, (req, res) => {
  const status = ["pending", "approved", "rejected"].includes(req.query.status)
    ? req.query.status
    : null;
  const users = status
    ? db
        .prepare(
          "SELECT * FROM users WHERE status = ? ORDER BY created_at DESC",
        )
        .all(status)
    : db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
  res.json({ users: users.map(publicUser) });
});

app.patch("/api/admin/users/:id/status", requireAdmin, async (req, res) => {
  const status = String(req.body.status || "");
  const note = String(req.body.note || "")
    .trim()
    .slice(0, 500);
  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ message: "Choose approved or rejected." });
  const user = db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(Number(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found." });
  db.prepare(
    "UPDATE users SET status = ?, reviewed_at = CURRENT_TIMESTAMP, review_note = ? WHERE id = ?",
  ).run(status, note, user.id);
  const updated = db.prepare("SELECT * FROM users WHERE id = ?").get(user.id);
  try {
    const email = await sendDecisionEmail(updated, status);
    res.json({ user: publicUser(updated), email });
  } catch (error) {
    console.error("Decision saved but email failed:", error);
    res.json({
      user: publicUser(updated),
      email: {
        sent: false,
        reason: "Email delivery failed. Check SMTP settings.",
      },
    });
  }
});

const normalizeIdList = (values) => [
  ...new Set((Array.isArray(values) ? values : []).map(Number).filter(Number.isInteger)),
].slice(0, 1000);

function deleteOrdersForUsers(userIds) {
  if (!userIds.length) return 0;
  const marks = userIds.map(() => "?").join(",");
  const orderIds = db
    .prepare(`SELECT id FROM orders WHERE user_id IN (${marks})`)
    .all(...userIds)
    .map((row) => row.id);
  if (orderIds.length) {
    const orderMarks = orderIds.map(() => "?").join(",");
    db.prepare(`DELETE FROM order_items WHERE order_id IN (${orderMarks})`).run(
      ...orderIds,
    );
    db.prepare(`DELETE FROM orders WHERE id IN (${orderMarks})`).run(...orderIds);
  }
  db.prepare(`DELETE FROM cart_items WHERE user_id IN (${marks})`).run(...userIds);
  return orderIds.length;
}

function deleteUsers(userIds) {
  if (!userIds.length) return { users: 0, orders: 0 };
  const marks = userIds.map(() => "?").join(",");
  const users = db
    .prepare(`SELECT id,status FROM users WHERE id IN (${marks})`)
    .all(...userIds);
  if (users.some((user) => user.status === "pending"))
    throw new Error("Pending users must be approved or rejected before deletion.");
  const foundIds = users.map((user) => user.id);
  if (!foundIds.length) return { users: 0, orders: 0 };
  const foundMarks = foundIds.map(() => "?").join(",");
  const orderCount = deleteOrdersForUsers(foundIds);
  db.prepare(`DELETE FROM favourites WHERE user_id IN (${foundMarks})`).run(...foundIds);
  db.prepare(
    `UPDATE inventory SET availability_status='available' WHERE availability_status='held' AND id IN (SELECT inventory_id FROM enquiries WHERE user_id IN (${foundMarks}) AND status='held')`,
  ).run(...foundIds);
  db.prepare(`DELETE FROM enquiries WHERE user_id IN (${foundMarks})`).run(...foundIds);
  db.prepare(`DELETE FROM password_reset_tokens WHERE user_id IN (${foundMarks})`).run(...foundIds);
  db.prepare(`DELETE FROM user_sessions WHERE user_id IN (${foundMarks})`).run(...foundIds);
  const result = db
    .prepare(`DELETE FROM users WHERE id IN (${foundMarks})`)
    .run(...foundIds);
  return { users: Number(result.changes), orders: orderCount };
}

app.delete("/api/admin/users/:id", requireAdmin, (req, res) => {
  try {
    db.exec("BEGIN");
    const result = deleteUsers([Number(req.params.id)]);
    if (!result.users) {
      db.exec("ROLLBACK");
      return res.status(404).json({ message: "User not found." });
    }
    db.exec("COMMIT");
    res.json({
      message: "User and related account records deleted. They can register again.",
      deleted: result.users,
    });
  } catch (error) {
    try { db.exec("ROLLBACK"); } catch {}
    res.status(409).json({ message: error.message });
  }
});

app.post("/api/admin/users/bulk-delete", requireAdmin, (req, res) => {
  const ids = normalizeIdList(req.body.ids);
  if (!ids.length)
    return res.status(400).json({ message: "Select at least one user." });
  try {
    db.exec("BEGIN");
    const result = deleteUsers(ids);
    db.exec("COMMIT");
    res.json({
      message: `${result.users} user(s) deleted. They can register again.`,
      deleted: result.users,
    });
  } catch (error) {
    try { db.exec("ROLLBACK"); } catch {}
    res.status(409).json({ message: error.message });
  }
});

app.get("/api/inventory", requireAuth, (req, res) => {
  const category = allowedInventoryCategories.has(String(req.query.category))
    ? String(req.query.category)
    : "natural_diamond";
  res.json({
    stones: db
      .prepare(
        "SELECT * FROM inventory WHERE category=? AND is_visible=1 AND availability_status IN ('available','held') ORDER BY created_at DESC",
      )
      .all(category)
      .map(publicStone),
  });
});
app.get("/api/inventory/:stockId", requireAuth, (req, res) => {
  const stone = db
    .prepare("SELECT * FROM inventory WHERE stock_id = ?")
    .get(req.params.stockId);
  if (!stone) return res.status(404).json({ message: "Stone not found." });
  res.json({ stone: publicStone(stone) });
});
app.get("/api/admin/inventory", requireAdmin, (req, res) => {
  const category = String(req.query.category || "");
  const stones = category
    ? db
        .prepare(
          "SELECT * FROM inventory WHERE category=? ORDER BY created_at DESC",
        )
        .all(category)
    : db.prepare("SELECT * FROM inventory ORDER BY created_at DESC").all();
  res.json({ stones: stones.map(publicStone) });
});
app.post(
  "/api/admin/inventory",
  requireAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "inHandVideo", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const stockId = String(req.body.stock_id || "").trim();
      if (!stockId || !req.body.shape || !req.body.carat || (req.body.category === "color_stone" && !req.body.gemstone_type))
        return res
          .status(400)
          .json({ message: req.body.category === "color_stone" ? "Stock ID, gemstone type, shape and carat are required." : "Stock ID, shape and carat are required." });
      const category = allowedInventoryCategories.has(req.body.category)
        ? req.body.category
        : "natural_diamond";
      const values = inventoryValues(
        { ...req.body, stock_id: stockId },
        category,
      );
      const media = ["image", "video", "inHandVideo", "certificate"].map(
        (name) =>
          req.files?.[name]?.[0]
            ? `/uploads/${req.files[name][0].filename}`
            : "",
      );
      const columns = [
        ...inventoryFields,
        "image_path",
        "video_path",
        "in_hand_video_path",
        "certificate_path",
      ];
      const result = db
        .prepare(
          `INSERT INTO inventory (${columns.join(",")}) VALUES (${columns.map(() => "?").join(",")})`,
        )
        .run(...values, ...media);
      res.status(201).json({
        stone: publicStone(
          db
            .prepare("SELECT * FROM inventory WHERE id = ?")
            .get(result.lastInsertRowid),
        ),
      });
    } catch (error) {
      console.error(error);
      if (String(error.message).includes("UNIQUE"))
        return res
          .status(409)
          .json({ message: "This Stock ID already exists." });
      res.status(500).json({ message: "Inventory item could not be saved." });
    }
  },
);
app.post(
  "/api/admin/inventory/import",
  requireAdmin,
  spreadsheetUpload.single("spreadsheet"),
  async (req, res) => {
    if (!req.file)
      return res.status(400).json({ message: "Choose an Excel or CSV file." });
    const category = allowedInventoryCategories.has(req.body.category)
      ? req.body.category
      : "natural_diamond";
    try {
      const workbook = new ExcelJS.Workbook();
      if (req.file.originalname.toLowerCase().endsWith(".csv"))
        await workbook.csv.read(Readable.from(req.file.buffer));
      else await workbook.xlsx.load(req.file.buffer);
      const sheet = workbook.worksheets[0];
      if (!sheet)
        return res
          .status(400)
          .json({ message: "The workbook has no worksheet." });
      const headers = [];
      sheet.getRow(1).eachCell({ includeEmpty: true }, (cell, column) => {
        headers[column] = canonicalField(cell.text);
      });
      const rawRows = [];
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const item = {};
        headers.forEach((field, column) => {
          if (field) item[field] = row.getCell(column).text.trim();
        });
        if (Object.values(item).some((value) => value !== ""))
          rawRows.push({ item, rowNumber });
      });
      if (!rawRows.length)
        return res
          .status(400)
          .json({ message: "The first worksheet has no product rows." });
      let imported = 0;
      let updated = 0;
      const errors = [];
      db.exec("BEGIN");
      rawRows.forEach(({ item: row, rowNumber }) => {
        row.stock_id = String(row.stock_id || "").trim();
        if (!row.stock_id || !row.shape || !row.carat || (category === "color_stone" && !row.gemstone_type)) {
          errors.push(
            `Row ${rowNumber}: ${category === "color_stone" ? "Stock ID, Gemstone Type, Shape and Carat" : "Stock ID, Shape and Carat"} are required.`,
          );
          return;
        }
        if (parseInventoryNumber(row.carat) == null) {
          errors.push(`Row ${rowNumber}: Carat must be a number.`);
          return;
        }
        try {
          const exists = db
            .prepare("SELECT id FROM inventory WHERE stock_id=?")
            .get(row.stock_id);
          const media = spreadsheetMediaFields.map((field) => safeMediaUrl(row[field]));
          upsertInventoryWithMedia.run(...inventoryValues(row, category), ...media);
          if (exists) updated++;
          else imported++;
        } catch (error) {
          errors.push(
            `Row ${rowNumber}: ${String(error.message).includes("UNIQUE") ? "Stock ID already exists." : "Could not import."}`,
          );
        }
      });
      db.exec("COMMIT");
      if (!imported && !updated)
        return res.status(400).json({
          message: "No products were imported.",
          errors: errors.slice(0, 20),
        });
      res.status(201).json({
        message: `${imported} products imported and ${updated} updated.`,
        imported,
        updated,
        skipped: errors.length,
        errors: errors.slice(0, 20),
      });
    } catch (error) {
      try {
        db.exec("ROLLBACK");
      } catch {}
      console.error(error);
      res.status(400).json({
        message: "The spreadsheet could not be read. Use .xlsx or .csv.",
      });
    }
  },
);
app.patch("/api/admin/inventory/:id/visibility", requireAdmin, (req, res) => {
  const visible = req.body.isVisible ? 1 : 0;
  const stone = db
    .prepare("SELECT * FROM inventory WHERE id=?")
    .get(Number(req.params.id));
  if (!stone) return res.status(404).json({ message: "Stone not found." });
  if (stone.availability_status === "sold" && visible)
    db.prepare(
      "UPDATE inventory SET is_visible=1,availability_status='available',sold_at=NULL WHERE id=?",
    ).run(stone.id);
  else
    db.prepare("UPDATE inventory SET is_visible=? WHERE id=?").run(
      visible,
      stone.id,
    );
  res.json({
    stone: publicStone(
      db.prepare("SELECT * FROM inventory WHERE id=?").get(stone.id),
    ),
  });
});
app.patch("/api/admin/inventory/:id", requireAdmin, (req, res) => {
  const stone = db.prepare("SELECT * FROM inventory WHERE id=?").get(Number(req.params.id));
  if (!stone) return res.status(404).json({ message: "Product not found." });
  const editable = inventoryFields.filter((field) => field !== "stock_id" && field !== "category");
  const updates = [];
  const values = [];
  for (const field of editable) {
    if (!Object.prototype.hasOwnProperty.call(req.body, field)) continue;
    updates.push(`${field}=?`);
    values.push(numberFields.has(field) ? parseInventoryNumber(req.body[field]) : String(req.body[field] ?? "").trim());
  }
  for (const field of spreadsheetMediaFields) {
    if (!Object.prototype.hasOwnProperty.call(req.body, field)) continue;
    updates.push(`${field}=?`);
    values.push(safeMediaUrl(req.body[field]));
  }
  if (!updates.length) return res.status(400).json({ message: "No editable fields supplied." });
  values.push(stone.id);
  db.prepare(`UPDATE inventory SET ${updates.join(",")} WHERE id=?`).run(...values);
  res.json({ message: `${stone.stock_id} updated.`, stone: publicStone(db.prepare("SELECT * FROM inventory WHERE id=?").get(stone.id)) });
});

app.get("/api/admin/notifications", requireAdmin, (_req, res) => {
  const scalar = (sql) => db.prepare(sql).get().count;
  res.json({
    users: scalar("SELECT COUNT(*) count FROM users WHERE status='pending'"),
    inventory: 0,
    orders: scalar("SELECT COUNT(*) count FROM orders WHERE status='placed'"),
    enquiries: scalar("SELECT COUNT(*) count FROM enquiries WHERE status='requested'"),
  });
});
app.patch(
  "/api/admin/inventory/:id/media",
  requireAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "inHandVideo", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
  ]),
  (req, res) => {
    const stone = db
      .prepare("SELECT * FROM inventory WHERE id=?")
      .get(Number(req.params.id));
    if (!stone) return res.status(404).json({ message: "Stone not found." });
    const mappings = [
      ["image", "image_path"],
      ["video", "video_path"],
      ["inHandVideo", "in_hand_video_path"],
      ["certificate", "certificate_path"],
    ];
    const updates = [];
    const values = [];
    for (const [field, column] of mappings) {
      const file = req.files?.[field]?.[0];
      if (file) {
        updates.push(`${column}=?`);
        values.push(`/uploads/${file.filename}`);
      }
    }
    if (!updates.length)
      return res
        .status(400)
        .json({ message: "Choose at least one media file." });
    values.push(stone.id);
    db.prepare(`UPDATE inventory SET ${updates.join(",")} WHERE id=?`).run(
      ...values,
    );
    res.json({
      message: `Media updated for ${stone.stock_id}.`,
      stone: publicStone(
        db.prepare("SELECT * FROM inventory WHERE id=?").get(stone.id),
      ),
    });
  },
);
app.post("/api/admin/inventory/bulk-delete", requireAdmin, (req, res) => {
  const ids = [
    ...new Set(
      (Array.isArray(req.body.ids) ? req.body.ids : [])
        .map(Number)
        .filter(Number.isInteger),
    ),
  ].slice(0, 1000);
  if (!ids.length)
    return res.status(400).json({ message: "Select at least one product." });
  const marks = ids.map(() => "?").join(",");
  try {
    db.exec("BEGIN");
    db.prepare(`DELETE FROM cart_items WHERE inventory_id IN (${marks})`).run(
      ...ids,
    );
    db.prepare(`DELETE FROM favourites WHERE inventory_id IN (${marks})`).run(...ids);
    db.prepare(`DELETE FROM enquiries WHERE inventory_id IN (${marks})`).run(...ids);
    const result = db
      .prepare(`DELETE FROM inventory WHERE id IN (${marks})`)
      .run(...ids);
    db.exec("COMMIT");
    res.json({
      deleted: result.changes,
      message: `${result.changes} products deleted.`,
    });
  } catch (error) {
    db.exec("ROLLBACK");
    console.error(error);
    res
      .status(500)
      .json({ message: "Selected products could not be deleted." });
  }
});
app.delete("/api/admin/inventory/:id", requireAdmin, (req, res) => {
  const inventoryId = Number(req.params.id);
  db.prepare("DELETE FROM cart_items WHERE inventory_id=?").run(inventoryId);
  db.prepare("DELETE FROM favourites WHERE inventory_id=?").run(inventoryId);
  db.prepare("DELETE FROM enquiries WHERE inventory_id=?").run(inventoryId);
  const result = db.prepare("DELETE FROM inventory WHERE id=?").run(inventoryId);
  if (!result.changes)
    return res.status(404).json({ message: "Stone not found." });
  res.json({ message: "Product deleted from inventory." });
});
app.get("/api/dashboard", requireAuth, (req, res) => {
  const newStones = db
    .prepare(
      "SELECT COUNT(*) count FROM inventory WHERE created_at>=datetime('now','-24 hours') AND category IN ('natural_diamond','lab_diamond') AND is_visible=1 AND availability_status='available'",
    )
    .get().count;
  const newColorStones = db
    .prepare(
      "SELECT COUNT(*) count FROM inventory WHERE created_at>=datetime('now','-24 hours') AND category='color_stone' AND is_visible=1 AND availability_status='available'",
    )
    .get().count;
  const basket = db
    .prepare(
      "SELECT COUNT(*) count,COALESCE(SUM(i.total_price),0) total FROM cart_items c JOIN inventory i ON i.id=c.inventory_id WHERE c.user_id=?",
    )
    .get(req.user.id);
  const orderCount = db
    .prepare("SELECT COUNT(*) count FROM orders WHERE user_id=?")
    .get(req.user.id).count;
  const holdCount = db
    .prepare("SELECT COUNT(*) count FROM enquiries WHERE user_id=? AND status='held'")
    .get(req.user.id).count;
  const favouriteCount = db
    .prepare("SELECT COUNT(*) count FROM favourites WHERE user_id=?")
    .get(req.user.id).count;
  res.json({
    newStones,
    newColorStones,
    basketCount: basket.count,
    basketTotal: basket.total,
    orderCount,
    holdCount,
    favouriteCount,
  });
});
app.get("/api/new-stones", requireAuth, (_req, res) =>
  res.json({
    stones: db
      .prepare(
        "SELECT * FROM inventory WHERE created_at>=datetime('now','-24 hours') AND category IN ('natural_diamond','lab_diamond') AND is_visible=1 AND availability_status='available' ORDER BY created_at DESC",
      )
      .all()
      .map(publicStone),
  }),
);
app.get("/api/new-color-stones", requireAuth, (_req, res) =>
  res.json({ stones: db.prepare("SELECT * FROM inventory WHERE created_at>=datetime('now','-24 hours') AND category='color_stone' AND is_visible=1 AND availability_status='available' ORDER BY created_at DESC").all().map(publicStone) }),
);

app.get("/api/favourites", requireAuth, (req, res) =>
  res.json({
    stones: db
      .prepare(
        "SELECT i.* FROM favourites f JOIN inventory i ON i.id=f.inventory_id WHERE f.user_id=? ORDER BY f.created_at DESC",
      )
      .all(req.user.id)
      .map(publicStone),
  }),
);
app.post("/api/favourites/:inventoryId", requireAuth, (req, res) => {
  const stone = db
    .prepare("SELECT id FROM inventory WHERE id=?")
    .get(Number(req.params.inventoryId));
  if (!stone) return res.status(404).json({ message: "Stone not found." });
  db.prepare("INSERT OR IGNORE INTO favourites (user_id,inventory_id) VALUES (?,?)").run(
    req.user.id,
    stone.id,
  );
  res.status(201).json({ message: "Stone added to favourites." });
});
app.delete("/api/favourites/:inventoryId", requireAuth, (req, res) => {
  db.prepare("DELETE FROM favourites WHERE user_id=? AND inventory_id=?").run(
    req.user.id,
    Number(req.params.inventoryId),
  );
  res.json({ message: "Stone removed from favourites." });
});

app.post("/api/enquiries/:inventoryId", requireAuth, (req, res) => {
  const stone = db
    .prepare(
      "SELECT * FROM inventory WHERE id=? AND is_visible=1 AND availability_status='available'",
    )
    .get(Number(req.params.inventoryId));
  if (!stone)
    return res.status(404).json({ message: "Stone is not currently available for a hold request." });
  const existing = db
    .prepare(
      "SELECT id,status FROM enquiries WHERE user_id=? AND inventory_id=? AND status IN ('requested','held') ORDER BY id DESC LIMIT 1",
    )
    .get(req.user.id, stone.id);
  if (existing)
    return res.status(409).json({
      message: existing.status === "held" ? "This stone is already on hold for you." : "Your hold enquiry is already pending.",
    });
  const result = db
    .prepare("INSERT INTO enquiries (user_id,inventory_id) VALUES (?,?)")
    .run(req.user.id, stone.id);
  res.status(201).json({
    enquiryId: Number(result.lastInsertRowid),
    message: "Hold enquiry sent to the administrator.",
  });
});
app.post("/api/enquiries-bulk", requireAuth, (req, res) => {
  const inventoryIds = [
    ...new Set(
      (Array.isArray(req.body.inventoryIds) ? req.body.inventoryIds : [])
        .map(Number)
        .filter(Number.isInteger),
    ),
  ].slice(0, 250);
  if (!inventoryIds.length)
    return res.status(400).json({ message: "Select at least one product." });

  const findStone = db.prepare(
    "SELECT id FROM inventory WHERE id=? AND is_visible=1 AND availability_status='available'",
  );
  const findExisting = db.prepare(
    "SELECT id FROM enquiries WHERE user_id=? AND inventory_id=? AND status IN ('requested','held') LIMIT 1",
  );
  const insertEnquiry = db.prepare(
    "INSERT INTO enquiries (user_id,inventory_id) VALUES (?,?)",
  );
  let created = 0;
  let skipped = 0;
  try {
    db.exec("BEGIN");
    for (const inventoryId of inventoryIds) {
      if (!findStone.get(inventoryId) || findExisting.get(req.user.id, inventoryId)) {
        skipped += 1;
        continue;
      }
      insertEnquiry.run(req.user.id, inventoryId);
      created += 1;
    }
    db.exec("COMMIT");
    if (!created)
      return res.status(409).json({ message: "All selected products already have an enquiry or are unavailable." });
    res.status(201).json({
      created,
      skipped,
      message: `${created} ${created === 1 ? "enquiry" : "enquiries"} sent to the administrator${skipped ? `; ${skipped} skipped` : ""}.`,
    });
  } catch (error) {
    try { db.exec("ROLLBACK"); } catch {}
    res.status(500).json({ message: error.message || "Unable to send enquiries." });
  }
});
app.get("/api/holds", requireAuth, (req, res) =>
  res.json({
    stones: db
      .prepare(
        "SELECT i.*,e.id enquiry_id,e.reviewed_at held_at FROM enquiries e JOIN inventory i ON i.id=e.inventory_id WHERE e.user_id=? AND e.status='held' ORDER BY e.reviewed_at DESC",
      )
      .all(req.user.id)
      .map(publicStone),
  }),
);

app.get("/api/admin/enquiries", requireAdmin, (_req, res) => {
  const rows = db
    .prepare(
      `SELECT e.*,u.name,u.company_name,u.email,u.phone,i.stock_id,i.shape,i.carat,i.color,i.clarity,i.lab,i.certificate_number,i.location,i.total_price,i.availability_status
       FROM enquiries e JOIN users u ON u.id=e.user_id JOIN inventory i ON i.id=e.inventory_id
       ORDER BY CASE e.status WHEN 'requested' THEN 0 WHEN 'held' THEN 1 ELSE 2 END,e.requested_at DESC`,
    )
    .all();
  res.json({
    enquiries: rows.map((row) => ({
      id: row.id,
      status: row.status,
      requestedAt: row.requested_at,
      reviewedAt: row.reviewed_at,
      adminNote: row.admin_note,
      user: {
        id: row.user_id,
        userId: `GF-${String(row.user_id).padStart(6, "0")}`,
        name: row.name,
        companyName: row.company_name,
        email: row.email,
        phone: row.phone,
      },
      stone: publicStone({
        id: row.inventory_id,
        stock_id: row.stock_id,
        shape: row.shape,
        carat: row.carat,
        color: row.color,
        clarity: row.clarity,
        lab: row.lab,
        certificate_number: row.certificate_number,
        location: row.location,
        total_price: row.total_price,
        availability_status: row.availability_status,
      }),
    })),
  });
});
app.patch("/api/admin/enquiries/:id/status", requireAdmin, (req, res) => {
  const status = String(req.body.status || "");
  if (!['held', 'released'].includes(status))
    return res.status(400).json({ message: "Choose hold or release." });
  const enquiry = db.prepare("SELECT * FROM enquiries WHERE id=?").get(Number(req.params.id));
  if (!enquiry) return res.status(404).json({ message: "Enquiry not found." });
  try {
    db.exec("BEGIN");
    if (status === "held") {
      const stone = db
        .prepare("SELECT availability_status FROM inventory WHERE id=?")
        .get(enquiry.inventory_id);
      if (!stone || !["available", "held"].includes(stone.availability_status))
        throw new Error("This stone is no longer available for hold.");
      const otherHeld = db
        .prepare("SELECT id FROM enquiries WHERE inventory_id=? AND status='held' AND id<>?")
        .get(enquiry.inventory_id, enquiry.id);
      if (otherHeld) throw new Error("This stone is already held for another user.");
      db.prepare("UPDATE inventory SET availability_status='held',is_visible=1 WHERE id=?").run(enquiry.inventory_id);
      db.prepare("DELETE FROM cart_items WHERE inventory_id=?").run(enquiry.inventory_id);
    } else if (enquiry.status === "held") {
      db.prepare("UPDATE inventory SET availability_status='available' WHERE id=? AND availability_status='held'").run(enquiry.inventory_id);
    }
    db.prepare(
      "UPDATE enquiries SET status=?,reviewed_at=CURRENT_TIMESTAMP,admin_note=? WHERE id=?",
    ).run(status, String(req.body.note || "").slice(0, 500), enquiry.id);
    const notificationStone = db.prepare("SELECT * FROM inventory WHERE id=?").get(enquiry.inventory_id);
    const stoneDetails = notificationStone ? publicStone(notificationStone) : { id: enquiry.inventory_id };
    createUserNotification({
      userId: enquiry.user_id,
      type: status === "held" ? "hold_accepted" : "hold_released",
      title: status === "held" ? "Item placed on hold" : "Item released",
      message: status === "held"
        ? `${stoneDetails.stockId || "Your item"} has been placed on hold.`
        : `${stoneDetails.stockId || "Your item"} has been released from hold.`,
      details: stoneDetails,
      inventoryId: enquiry.inventory_id,
    });
    db.exec("COMMIT");
    res.json({ message: status === "held" ? "Stone placed on hold for this user." : "Stone released back to inventory.", status });
  } catch (error) {
    try { db.exec("ROLLBACK"); } catch {}
    res.status(409).json({ message: error.message });
  }
});
app.delete("/api/admin/enquiries/:id", requireAdmin, (req, res) => {
  const enquiry = db.prepare("SELECT * FROM enquiries WHERE id=?").get(Number(req.params.id));
  if (!enquiry) return res.status(404).json({ message: "Enquiry not found." });
  if (enquiry.status === "held") db.prepare("UPDATE inventory SET availability_status='available' WHERE id=? AND availability_status='held'").run(enquiry.inventory_id);
  db.prepare("DELETE FROM enquiries WHERE id=?").run(enquiry.id);
  res.json({ message: "Enquiry deleted." });
});

app.get("/api/cart", requireAuth, (req, res) =>
  res.json({
    items: db
      .prepare(
        "SELECT c.id cart_item_id,i.* FROM cart_items c JOIN inventory i ON i.id=c.inventory_id WHERE c.user_id=? ORDER BY c.created_at DESC",
      )
      .all(req.user.id)
      .map(publicStone),
  }),
);
app.post("/api/cart/:inventoryId", requireAuth, (req, res) => {
  const stone = db
    .prepare(
      "SELECT id FROM inventory WHERE id=? AND is_visible=1 AND availability_status='available'",
    )
    .get(Number(req.params.inventoryId));
  if (!stone)
    return res
      .status(404)
      .json({ message: "Stone is not currently available." });
  db.prepare(
    "INSERT OR IGNORE INTO cart_items (user_id,inventory_id) VALUES (?,?)",
  ).run(req.user.id, stone.id);
  res.status(201).json({ message: "Stone added to your basket." });
});
app.delete("/api/cart/:inventoryId", requireAuth, (req, res) => {
  db.prepare("DELETE FROM cart_items WHERE user_id=? AND inventory_id=?").run(
    req.user.id,
    Number(req.params.inventoryId),
  );
  res.json({ message: "Stone removed from basket." });
});
app.post("/api/orders", requireAuth, (req, res) => {
  const ids = [
    ...new Set(
      (req.body.inventoryIds || []).map(Number).filter(Number.isInteger),
    ),
  ];
  if (!ids.length)
    return res
      .status(400)
      .json({ message: "Select at least one basket item." });
  const marks = ids.map(() => "?").join(",");
  const stones = db
    .prepare(
      `SELECT i.* FROM cart_items c JOIN inventory i ON i.id=c.inventory_id WHERE c.user_id=? AND i.availability_status='available' AND i.id IN (${marks})`,
    )
    .all(req.user.id, ...ids);
  if (stones.length !== ids.length)
    return res
      .status(400)
      .json({ message: "A selected stone is no longer available." });
  const total = stones.reduce((sum, s) => sum + Number(s.total_price || 0), 0);
  try {
    db.exec("BEGIN");
    const result = db
      .prepare("INSERT INTO orders (user_id,total_amount) VALUES (?,?)")
      .run(req.user.id, total);
    const add = db.prepare(
      "INSERT INTO order_items (order_id,inventory_id,stone_snapshot) VALUES (?,?,?)",
    );
    stones.forEach((s) =>
      add.run(result.lastInsertRowid, s.id, JSON.stringify(publicStone(s))),
    );
    db.prepare(
      `DELETE FROM cart_items WHERE user_id=? AND inventory_id IN (${marks})`,
    ).run(req.user.id, ...ids);
    db.exec("COMMIT");
    res.status(201).json({
      orderId: Number(result.lastInsertRowid),
      orderNumber: `GF-ORD-${String(result.lastInsertRowid).padStart(6, "0")}`,
    });
  } catch (error) {
    db.exec("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Order could not be placed." });
  }
});
app.get("/api/orders", requireAuth, (req, res) => {
  const rows = db
    .prepare("SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC")
    .all(req.user.id);
  const getItems = db.prepare(
    "SELECT stone_snapshot FROM order_items WHERE order_id=?",
  );
  res.json({
    orders: rows.map((o) => ({
      ...publicStone(o),
      orderNumber: `GF-ORD-${String(o.id).padStart(6, "0")}`,
      items: getItems.all(o.id).map((i) => JSON.parse(i.stone_snapshot)),
    })),
  });
});
app.get("/api/admin/orders", requireAdmin, (_req, res) => {
  const rows = db
    .prepare(
      "SELECT o.*,u.name user_name,u.company_name,u.email,u.phone FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC",
    )
    .all();
  const getItems = db.prepare(
    "SELECT stone_snapshot FROM order_items WHERE order_id=?",
  );
  res.json({
    orders: rows.map((o) => ({
      id: o.id,
      orderNumber: `GF-ORD-${String(o.id).padStart(6, "0")}`,
      status: o.status,
      totalAmount: o.total_amount,
      createdAt: o.created_at,
      user: {
        id: o.user_id,
        userId: `GF-${String(o.user_id).padStart(6, "0")}`,
        name: o.user_name,
        companyName: o.company_name,
        email: o.email,
        phone: o.phone,
      },
      items: getItems.all(o.id).map((i) => JSON.parse(i.stone_snapshot)),
    })),
  });
});

function deleteOrders(orderIds) {
  if (!orderIds.length) return 0;
  const marks = orderIds.map(() => "?").join(",");
  const foundIds = db
    .prepare(`SELECT id FROM orders WHERE id IN (${marks})`)
    .all(...orderIds)
    .map((row) => row.id);
  if (!foundIds.length) return 0;
  const foundMarks = foundIds.map(() => "?").join(",");
  db.prepare(`DELETE FROM order_items WHERE order_id IN (${foundMarks})`).run(
    ...foundIds,
  );
  return Number(
    db.prepare(`DELETE FROM orders WHERE id IN (${foundMarks})`).run(...foundIds)
      .changes,
  );
}

app.delete("/api/admin/orders/:id", requireAdmin, (req, res) => {
  try {
    db.exec("BEGIN");
    const deleted = deleteOrders([Number(req.params.id)]);
    if (!deleted) {
      db.exec("ROLLBACK");
      return res.status(404).json({ message: "Order not found." });
    }
    db.exec("COMMIT");
    res.json({ message: "Order deleted.", deleted });
  } catch (error) {
    try { db.exec("ROLLBACK"); } catch {}
    res.status(500).json({ message: "Order could not be deleted." });
  }
});

app.post("/api/admin/orders/bulk-delete", requireAdmin, (req, res) => {
  const ids = normalizeIdList(req.body.ids);
  if (!ids.length)
    return res.status(400).json({ message: "Select at least one order." });
  try {
    db.exec("BEGIN");
    const deleted = deleteOrders(ids);
    db.exec("COMMIT");
    res.json({ message: `${deleted} order(s) deleted.`, deleted });
  } catch (error) {
    try { db.exec("ROLLBACK"); } catch {}
    res.status(500).json({ message: "Orders could not be deleted." });
  }
});
app.patch("/api/admin/orders/:id/status", requireAdmin, async (req, res) => {
  const status = String(req.body.status || "");
  if (!["accepted", "rejected"].includes(status))
    return res.status(400).json({ message: "Choose accepted or rejected." });
  const order = db
    .prepare(
      "SELECT o.*,u.name,u.email FROM orders o JOIN users u ON u.id=o.user_id WHERE o.id=?",
    )
    .get(Number(req.params.id));
  if (!order) return res.status(404).json({ message: "Order not found." });
  if (order.status !== "placed")
    return res
      .status(409)
      .json({ message: `This order is already ${order.status}.` });
  const rows = db
    .prepare(
      "SELECT inventory_id,stone_snapshot FROM order_items WHERE order_id=?",
    )
    .all(order.id);
  const stones = rows.map((row) => JSON.parse(row.stone_snapshot));
  try {
    db.exec("BEGIN");
    if (status === "accepted") {
      for (const row of rows) {
        const releasedHolds = db
          .prepare("SELECT user_id FROM enquiries WHERE inventory_id=? AND status='held'")
          .all(row.inventory_id);
        const result = db
          .prepare(
            "UPDATE inventory SET availability_status='sold',is_visible=0,sold_at=CURRENT_TIMESTAMP WHERE id=? AND availability_status='available'",
          )
          .run(row.inventory_id);
        if (!result.changes)
          throw new Error(`Stone ${row.inventory_id} is no longer available.`);
        db.prepare("DELETE FROM cart_items WHERE inventory_id=?").run(
          row.inventory_id,
        );
        db.prepare(
          "UPDATE enquiries SET status='released',reviewed_at=CURRENT_TIMESTAMP,admin_note='Stone sold through an accepted order' WHERE inventory_id=? AND status IN ('requested','held')",
        ).run(row.inventory_id);
        const releasedStone = stones.find((stone) => Number(stone.id) === Number(row.inventory_id)) || { id: row.inventory_id };
        for (const held of releasedHolds) {
          createUserNotification({
            userId: held.user_id,
            type: "hold_released",
            title: "Held item released",
            message: `${releasedStone.stockId || "Your held item"} was released because it was sold through an accepted order.`,
            details: releasedStone,
            inventoryId: row.inventory_id,
          });
        }
      }
    }
    db.prepare(
      "UPDATE orders SET status=?,reviewed_at=CURRENT_TIMESTAMP,admin_note=? WHERE id=?",
    ).run(status, String(req.body.note || "").slice(0, 500), order.id);
    const orderNumber = `GF-ORD-${String(order.id).padStart(6, "0")}`;
    const stockIds = stones.map((stone) => stone.stockId).filter(Boolean);
    createUserNotification({
      userId: order.user_id,
      type: status === "accepted" ? "order_accepted" : "order_rejected",
      title: status === "accepted" ? "Order accepted" : "Order rejected",
      message: `${orderNumber} has been ${status}${stockIds.length ? ` — ${stockIds.join(", ")}` : ""}.`,
      details: { orderNumber, status, items: stones },
      orderId: order.id,
    });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    return res.status(409).json({ message: error.message });
  }
  const orderView = {
    ...order,
    orderNumber: `GF-ORD-${String(order.id).padStart(6, "0")}`,
  };
  let email;
  try {
    email = await sendOrderDecisionEmail(
      orderView,
      { name: order.name, email: order.email },
      stones,
      status,
    );
  } catch (error) {
    console.error(error);
    email = {
      sent: false,
      reason: "Email delivery failed. Check SMTP settings.",
    };
  }
  res.json({ status, email, orderNumber: orderView.orderNumber });
});
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
const dist = join(root, "dist");
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.get("/{*path}", (_req, res) => res.sendFile(join(dist, "index.html")));
}
app.listen(port, () =>
  console.log(`GemFlow running at http://localhost:${port}`),
);

import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import ExcelJS from "exceljs";
import {
  Home,
  Search,
  Gem,
  ShoppingCart,
  Package,
  LockKeyhole,
  Star,
  ClipboardList,
  MessageSquare,
  UserRound,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ExternalLink,
  Percent,
  Truck,
  Diamond,
  ArrowUpRight,
  SlidersHorizontal,
  Plus,
  Menu,
  X,
  Sparkles,
  Eye,
  Clock3,
  Mail,
  Phone,
  Building2,
  User,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Users,
  Check,
  Ban,
  RefreshCw,
  Download,
  Image as ImageIcon,
  Video,
  FileText,
  ArrowLeft,
  UploadCloud,
  Database,
  EyeOff,
  Trash2,
  Moon,
  Sun,
  MessageCircle,
  FileSpreadsheet,
  Share2,
  Heart,
  MapPin,
} from "lucide-react";
import "./styles.css";
import "./desktop-fixes.css";

const categories = [
  ["Round", "1,761", "round"],
  ["Pear", "695", "pear"],
  ["Oval", "849", "oval"],
  ["Marquise", "292", "marquise"],
  ["Emerald", "384", "emerald"],
  ["Cushion", "342", "cushion"],
  ["Princess", "220", "princess"],
  ["Radiant", "176", "radiant"],
];

const stones = [
  {
    id: "GF-279044",
    shape: "Emerald",
    carat: "2.51",
    color: "B",
    grade: "GIA",
    price: "$13,239.45",
    type: "Natural Diamond",
    tone: "ice",
  },
  {
    id: "GF-183920",
    shape: "Round",
    carat: "1.08",
    color: "G",
    grade: "VS1",
    price: "$5,420.00",
    type: "Natural Diamond",
    tone: "blue",
  },
  {
    id: "GF-510284",
    shape: "Oval",
    carat: "2.02",
    color: "F",
    grade: "VS2",
    price: "$9,850.00",
    type: "Natural Diamond",
    tone: "navy",
  },
];

const diamondInventory = [
  {
    id: "GF-D1001",
    shape: "Round",
    carat: 1.01,
    color: "D",
    clarity: "VVS1",
    cut: "EX",
    polish: "EX",
    symmetry: "EX",
    fluor: "NON",
    lab: "GIA",
    eyeClean: "100%",
    shade: "None",
    location: "Mumbai",
    price: 8420,
  },
  {
    id: "GF-D1002",
    shape: "Oval",
    carat: 1.52,
    color: "F",
    clarity: "VS1",
    cut: "EX",
    polish: "VG",
    symmetry: "VG",
    fluor: "FNT",
    lab: "GIA",
    eyeClean: "100%",
    shade: "None",
    location: "Hong Kong",
    price: 9750,
  },
  {
    id: "GF-D1003",
    shape: "Pear",
    carat: 2.03,
    color: "G",
    clarity: "VS2",
    cut: "VG",
    polish: "EX",
    symmetry: "VG",
    fluor: "NON",
    lab: "IGI",
    eyeClean: "100%",
    shade: "Brown",
    location: "Surat",
    price: 11890,
  },
  {
    id: "GF-D1004",
    shape: "Emerald",
    carat: 2.51,
    color: "E",
    clarity: "VVS2",
    cut: "EX",
    polish: "EX",
    symmetry: "EX",
    fluor: "VSL",
    lab: "GIA",
    eyeClean: "100%",
    shade: "None",
    location: "New York",
    price: 17450,
  },
  {
    id: "GF-D1005",
    shape: "Cushion",
    carat: 1.2,
    color: "H",
    clarity: "SI1",
    cut: "VG",
    polish: "VG",
    symmetry: "VG",
    fluor: "MED",
    lab: "IGI",
    eyeClean: "75%",
    shade: "Yellow",
    location: "Mumbai",
    price: 4380,
  },
  {
    id: "GF-D1006",
    shape: "Princess",
    carat: 0.9,
    color: "D",
    clarity: "IF",
    cut: "EX",
    polish: "EX",
    symmetry: "EX",
    fluor: "NON",
    lab: "HRD",
    eyeClean: "100%",
    shade: "None",
    location: "Antwerp",
    price: 6240,
  },
  {
    id: "GF-D1007",
    shape: "Marquise",
    carat: 1.75,
    color: "I",
    clarity: "SI2",
    cut: "GD",
    polish: "VG",
    symmetry: "GD",
    fluor: "STG",
    lab: "IGI",
    eyeClean: "75%",
    shade: "Brown",
    location: "Surat",
    price: 5120,
  },
  {
    id: "GF-D1008",
    shape: "Radiant",
    carat: 3.08,
    color: "F",
    clarity: "VS1",
    cut: "EX",
    polish: "EX",
    symmetry: "VG",
    fluor: "NON",
    lab: "GIA",
    eyeClean: "100%",
    shade: "None",
    location: "Dubai",
    price: 23600,
  },
  {
    id: "GF-D1009",
    shape: "Heart",
    carat: 1.1,
    color: "G",
    clarity: "VVS2",
    cut: "VG",
    polish: "EX",
    symmetry: "VG",
    fluor: "FNT",
    lab: "GIA",
    eyeClean: "100%",
    shade: "None",
    location: "Hong Kong",
    price: 7950,
  },
  {
    id: "GF-D1010",
    shape: "SQ. Emerald",
    carat: 2.0,
    color: "J",
    clarity: "VS2",
    cut: "VG",
    polish: "VG",
    symmetry: "VG",
    fluor: "VSL",
    lab: "IGI",
    eyeClean: "100%",
    shade: "Yellow",
    location: "Mumbai",
    price: 7860,
  },
];

const navItems = [
  ["Dashboard", Home],
  ["Diamonds", Diamond],
  ["Gemstones", Gem],
  ["Lab Diamonds", Sparkles],
  ["My Basket", ShoppingCart],
  ["My Orders", Package],
  ["My Holds", LockKeyhole],
  ["Favorites", Star],
  ["Saved Searches", ClipboardList],
  ["Account", UserRound],
];

const API_URL = import.meta.env.VITE_API_URL || "";
document.documentElement.dataset.theme =
  localStorage.getItem("gemflow_theme") || "light";

function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("gemflow_theme") || "light",
  );
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("gemflow_theme", next);
    document.documentElement.dataset.theme = next;
  };
  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      title={`Use ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}

const shapeArtwork = Object.fromEntries(
  [
    ["Round", 0, 0],
    ["Oval", 1, 0],
    ["Pear", 2, 0],
    ["Cush Mod", 3, 0],
    ["Cush Brill", 4, 0],
    ["Emerald", 5, 0],
    ["Radiant", 6, 0],
    ["Princess", 7, 0],
    ["Asscher", 8, 0],
    ["Square", 9, 0],
    ["Marquise", 10, 0],
    ["Heart", 11, 0],
    ["Trilliant", 12, 0],
    ["Euro Cut", 13, 0],
    ["Old Miner", 0, 1],
    ["Briolette", 1, 1],
    ["Rose Cut", 2, 1],
    ["Lozenge", 3, 1],
    ["Baguette", 4, 1],
    ["Tap Bag", 5, 1],
    ["Half Moon", 6, 1],
    ["Flanders", 7, 1],
    ["Trapezoid", 8, 1],
    ["Bullets", 9, 1],
    ["Kite", 10, 1],
    ["Shield", 11, 1],
    ["Star", 12, 1],
    ["Pentagonal", 13, 1],
    ["Hexagonal", 0, 2],
    ["Octagonal", 1, 2],
    ["Portuguese Cut", 2, 2],
    ["Moval Cut", 3, 2],
    ["Cushion", 3, 0],
    ["Cushion B", 4, 0],
    ["Sq.emerald", 8, 0],
    ["L Radiant", 6, 0],
  ].map(([name, column, row]) => [
    name,
    `/assets/shapes/shape-${column}-${row}.png`,
  ]),
);

function ShapeIcon({ shape }) {
  const artwork = shapeArtwork[shape];
  if (!artwork) return <span className="shape-sprite-other">OTHER</span>;
  return (
    <img
      className="shape-sprite-icon"
      src={artwork}
      alt=""
      aria-hidden="true"
    />
  );
}

async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(body.message || "Something went wrong"); error.details = body; if (response.status === 401 && options.headers?.Authorization === `Bearer ${localStorage.getItem("gemflow_token")}`) window.dispatchEvent(new Event("gemflow-session-ended")); throw error; }
  return body;
}
const authApi = (path, options = {}) =>
  api(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("gemflow_token")}`,
      ...(options.headers || {}),
    },
  });
const refreshCommerce = () =>
window.dispatchEvent(new Event("gemflow-commerce-change"));
const deviceId = (() => {
  let id = localStorage.getItem("gemflow_device_id");
  if (!id) {
    id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    localStorage.setItem("gemflow_device_id", id);
  }
  return id;
})();
const inventoryRowClass = (stone) => {
  if (stone.availabilityStatus === "held") return "inventory-row-held";
  if (
    stone.createdAt &&
    Date.now() - new Date(`${stone.createdAt}Z`).getTime() < 24 * 60 * 60 * 1000
  )
    return "inventory-row-new";
  return "";
};

function Root() {
  if (window.location.pathname === "/recover-password") return <SmsPasswordResetPage />;
  if (window.location.pathname.startsWith("/reset-password"))
    return <ResetPasswordPage />;
  if (window.location.pathname.startsWith("/admin")) return <AdminPanel />;
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("gemflow_token");
    if (!token) return setChecking(false);
    api("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(({ user }) => setSession({ token, user }))
      .catch(() => localStorage.removeItem("gemflow_token"))
      .finally(() => setChecking(false));
  }, []);
  useEffect(() => {
    const endSession = () => { localStorage.removeItem("gemflow_token"); setSession(null); };
    window.addEventListener("gemflow-session-ended", endSession);
    return () => window.removeEventListener("gemflow-session-ended", endSession);
  }, []);
  const onAuthenticated = ({ token, user }) => {
    localStorage.setItem("gemflow_token", token);
    setSession({ token, user });
  };
  const logout = async () => {
    try { await authApi("/api/auth/logout", { method: "POST" }); } catch {}
    localStorage.removeItem("gemflow_token");
    setSession(null);
  };
  if (checking)
    return (
      <div className="auth-loading">
        <div className="gem-loader">G</div>
        <span>Opening GemFlow…</span>
      </div>
    );
  return session ? (
    <Dashboard user={session.user} onLogout={logout} />
  ) : (
    <AuthPage onAuthenticated={onAuthenticated} />
  );
}

function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [deviceChallenge, setDeviceChallenge] = useState(null);
  const [replacementSession, setReplacementSession] = useState("");
  const [replacementOtp, setReplacementOtp] = useState("");
  const [replacementSent, setReplacementSent] = useState(false);
  const [replacementMessage, setReplacementMessage] = useState("");
  const handleLogin = result => {
    if (result.deviceLimit) {
      setDeviceChallenge(result); setReplacementSession(""); setReplacementOtp("");
      setReplacementSent(false); setReplacementMessage("");
    } else onAuthenticated(result);
  };
  const replaceDevice = async (sendOnly = false) => {
    setBusy(true); setReplacementMessage("");
    try {
      const result = await api(`/api/auth/device-login/${sendOnly ? "send-otp" : "verify"}`, {
        method: "POST", body: JSON.stringify({ challengeId: deviceChallenge.challengeId, deviceId, sessionId: replacementSession, otp: replacementOtp }),
      });
      if (sendOnly) { setReplacementSent(true); setReplacementMessage(result.message); }
      else onAuthenticated(result);
    } catch (error) {
      setReplacementMessage(error.message);
      if (error.details?.devices) { setDeviceChallenge(current => ({...current, devices: error.details.devices})); setReplacementSession(""); }
    } finally { setBusy(false); }
  };
  const [otpMode, setOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [identifierType, setIdentifierType] = useState("email");
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    gstNumber: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);
  const update = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const switchMode = (next) => {
    setMode(next);
    setForgotPassword(false);
    setOtpMode(false);
    setOtpSent(false);
    setOtp("");
    setMessage(null);
  };
  const submit = async (event) => {
    event.preventDefault();
    setMessage(null);
    if (otpMode) {
      setBusy(true);
      try {
        if (!otpSent) {
          const result = await api("/api/auth/request-login-otp", {
            method: "POST",
            body: JSON.stringify({ phone: form.phone }),
          });
          setOtpSent(true);
          setMessage({
            type: "success",
            text: result.developmentOtp
              ? `${result.message} Development OTP: ${result.developmentOtp}`
              : result.message,
          });
        } else {
          const result = await api("/api/auth/login-with-otp", {
            method: "POST",
            body: JSON.stringify({ phone: form.phone, otp, deviceId }),
          });
          handleLogin(result);
        }
      } catch (error) {
        setMessage({ type: "error", text: error.message });
      } finally {
        setBusy(false);
      }
      return;
    }
    if (forgotPassword) {
      setBusy(true);
      try {
        const result = await api("/api/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email: form.email }),
        });
        setMessage({ type: "success", text: result.message });
      } catch (error) {
        setMessage({ type: "error", text: error.message });
      } finally {
        setBusy(false);
      }
      return;
    }
    if (mode === "register" && form.password !== form.confirmPassword)
      return setMessage({ type: "error", text: "Passwords do not match." });
    setBusy(true);
    try {
      const path =
        mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const payload =
        mode === "register"
          ? {
              name: form.name,
              companyName: form.companyName,
              gstNumber: form.gstNumber,
              email: form.email,
              phone: form.phone,
              password: form.password,
            }
          : {
              identifier: identifierType === "email" ? form.email : form.phone,
              password: form.password,
              deviceId,
            };
      const result = await api(path, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (mode === "register" && result.pending) {
        setMessage({ type: "success", text: result.message });
        setForm({ ...form, password: "", confirmPassword: "" });
      } else handleLogin(result);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="auth-shell">
      {deviceChallenge && <div className="device-login-overlay"><section className="device-login-dialog" role="dialog" aria-modal="true" aria-labelledby="device-login-title">
        <h2 id="device-login-title">Three devices are already logged in</h2>
        <p>Select a device to log out, then verify the code sent to {deviceChallenge.email}. The selected device stays logged in until verification succeeds.</p>
        <div className="device-login-list">{deviceChallenge.devices.map((device, index) => <label key={device.id}>
          <input type="radio" name="replace-session" value={device.id} checked={replacementSession === device.id} onChange={() => setReplacementSession(device.id)} disabled={busy}/>
          <span><strong>{device.label} · Device {index + 1}</strong><small>Last active: {new Date(`${device.lastSeenAt.replace(" ", "T")}Z`).toLocaleString()}</small><small>First login: {new Date(`${device.createdAt.replace(" ", "T")}Z`).toLocaleString()}</small></span>
        </label>)}</div>
        {replacementSent && <label className="device-code-label">Email verification code<input autoFocus inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={replacementOtp} onChange={event => setReplacementOtp(event.target.value.replace(/\D/g, ""))}/></label>}
        {replacementMessage && <p role="status">{replacementMessage}</p>}
        <div className="device-login-actions"><button disabled={busy} onClick={() => setDeviceChallenge(null)}>Cancel</button>
          <button disabled={busy || !replacementSession} onClick={() => replaceDevice(true)}>{replacementSent ? "Resend email OTP" : "Send email OTP"}</button>
          {replacementSent && <button disabled={busy || !replacementSession || replacementOtp.length !== 6} onClick={() => replaceDevice(false)}>Verify & log in here</button>}
        </div>
      </section></div>}
      <div className="auth-orbit orbit-one"></div>
      <div className="auth-orbit orbit-two"></div>
      <header className="auth-header">
        <div className="auth-brand">
          <div className="auth-brand-gem">G</div>
          <div>
            GEM<span>FLOW</span>
          </div>
        </div>
        <span className="secure-label">
          <LockKeyhole size={15} /> Secure member access
        </span>
      </header>
      <section className="auth-hero">
        <div className="auth-intro">
          <span className="eyebrow">THE GLOBAL GEMSTONE MARKETPLACE</span>
          <h1>
            Source brilliance.
            <br />
            <em>Trade with confidence.</em>
          </h1>
          <p>
            One secure workspace for diamonds, colored gemstones, orders, bids,
            and trusted supplier relationships.
          </p>
          <div className="trust-row">
            <span>
              <CheckCircle2 /> Verified inventory
            </span>
            <span>
              <CheckCircle2 /> Protected accounts
            </span>
          </div>
          <div className="hero-gem">
            <span>GF</span>
          </div>
        </div>
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => switchMode("login")}
            >
              Login
            </button>
            <button
              className={mode === "register" ? "active" : ""}
              onClick={() => switchMode("register")}
            >
              Create account
            </button>
          </div>
          <div className="auth-card-copy">
            <small>{mode === "login" ? "WELCOME BACK" : "JOIN GEMFLOW"}</small>
            <h2>
              {mode === "login"
                ? "Access your marketplace"
                : "Register your business"}
            </h2>
            <p>
              {mode === "login"
                ? "Enter your registered email or mobile number."
                : "Add your details to create a secure buyer account."}
            </p>
          </div>
          <form onSubmit={submit} className="auth-form">
            {forgotPassword ? (
              <>
                <Field
                  icon={<Mail />}
                  label="Registered email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
                <a href="/recover-password">Reset password by SMS instead</a>
              </>
            ) : otpMode ? (
              <>
                <Field
                  icon={<Phone />}
                  label="Registered mobile number"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={update}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
                {otpSent && (
                  <Field
                    icon={<ShieldCheck />}
                    label="6-digit OTP"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(event) =>
                      setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter OTP"
                    autoComplete="one-time-code"
                    maxLength="6"
                  />
                )}
              </>
            ) : (
              <>
            {mode === "register" && (
              <>
                <Field
                  icon={<User />}
                  label="Your name"
                  name="name"
                  value={form.name}
                  onChange={update}
                  placeholder="Yogya Arora"
                  autoComplete="name"
                />
                <Field
                  icon={<Building2 />}
                  label="Company name"
                  name="companyName"
                  value={form.companyName}
                  onChange={update}
                  placeholder="OM Gems & Jewellers"
                  autoComplete="organization"
                />
                <Field
                  icon={<FileText />}
                  label="GST number (optional)"
                  name="gstNumber"
                  value={form.gstNumber}
                  onChange={update}
                  placeholder="15-character GSTIN"
                  maxLength="15"
                  required={false}
                  autoComplete="off"
                />
              </>
            )}
            {mode === "login" && (
              <div className="identifier-toggle">
                <button
                  type="button"
                  className={identifierType === "email" ? "active" : ""}
                  onClick={() => setIdentifierType("email")}
                >
                  <Mail /> Email
                </button>
                <button
                  type="button"
                  className={identifierType === "phone" ? "active" : ""}
                  onClick={() => setIdentifierType("phone")}
                >
                  <Phone /> Mobile
                </button>
              </div>
            )}
            {(mode === "register" || identifierType === "email") && (
              <Field
                icon={<Mail />}
                label="Email address"
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                placeholder="you@company.com"
                required={mode === "login"}
                autoComplete="email"
              />
            )}
            {(mode === "register" || identifierType === "phone") && (
              <Field
                icon={<Phone />}
                label="Mobile number"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={update}
                placeholder="+91 98765 43210"
                required={mode === "login"}
                autoComplete="tel"
              />
            )}
            <Field
              icon={<KeyRound />}
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={update}
              placeholder="Minimum 8 characters"
              minLength="8"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
            {mode === "register" && (
              <Field
                icon={<KeyRound />}
                label="Confirm password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={update}
                placeholder="Repeat your password"
                minLength="8"
                autoComplete="new-password"
              />
            )}
              </>
            )}
            {message && (
              <div className={`form-message ${message.type}`}>
                <AlertCircle />
                {message.text}
              </div>
            )}
            <button className="auth-submit" disabled={busy}>
              {busy
                ? "Please wait…"
                : forgotPassword
                  ? "Send reset link"
                : otpMode
                  ? otpSent
                    ? "Verify OTP & login"
                    : "Send login OTP"
                : mode === "login"
                  ? "Login to GemFlow"
                  : "Create my account"}
              <ArrowRight />
            </button>
            {mode === "login" && !forgotPassword && (
              <div className="auth-recovery-actions">
                {otpMode && otpSent && (
                  <button type="button" onClick={() => { setOtpSent(false); setOtp(""); setMessage(null); }}>
                    Resend OTP
                  </button>
                )}
                {!otpMode && (
                  <button type="button" onClick={() => { setForgotPassword(true); setMessage(null); }}>
                    Reset password by email
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setOtpMode((current) => !current);
                    setOtpSent(false);
                    setOtp("");
                    setMessage(null);
                  }}
                >
                  {otpMode ? "Use password instead" : "Login with mobile OTP"}
                </button>
              </div>
            )}
          </form>
          <p className="auth-switch">
            {forgotPassword || otpMode
              ? "Remember your password?"
              : mode === "login"
                ? "New to GemFlow?"
                : "Already registered?"}{" "}
            <button
              onClick={() => {
                if (forgotPassword || otpMode) {
                  setForgotPassword(false);
                  setOtpMode(false);
                  setOtpSent(false);
                  setOtp("");
                  setMessage(null);
                } else switchMode(mode === "login" ? "register" : "login");
              }}
            >
              {forgotPassword || otpMode
                ? "Return to login"
                : mode === "login"
                  ? "Create an account"
                  : "Login here"}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}

function SmsPasswordResetPage() {
  const [phone, setPhone] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const send = async () => {
    setBusy(true); setMessage("");
    try {
      const result = await api("/api/auth/request-password-reset-otp", { method: "POST", body: JSON.stringify({ phone }) });
      setSentTo(phone); setOtp(""); setMessage(result.message);
    } catch (error) { setMessage(error.message); } finally { setBusy(false); }
  };
  const submit = async event => {
    event.preventDefault();
    if (!sentTo) return send();
    if (password !== confirm) return setMessage("Passwords do not match.");
    setBusy(true); setMessage("");
    try {
      const result = await api("/api/auth/reset-password-with-otp", { method: "POST", body: JSON.stringify({phone: sentTo, otp, password}) });
      localStorage.removeItem("gemflow_token"); setDone(true); setMessage(result.message);
    } catch(error) { setMessage(error.message); } finally { setBusy(false); }
  };
  return <div className="admin-login-shell"><form className="admin-login-card auth-form" onSubmit={submit}>
    <h1>Reset password by SMS</h1>
    <p>Use your registered mobile number. Include the country code, such as +91.</p>
    {!done && <>
      <Field icon={<Phone/>} label="Registered mobile number" type="tel" required value={phone} disabled={busy || Boolean(sentTo)} onChange={event=>setPhone(event.target.value)} autoComplete="tel"/>
      {sentTo && <>
        <Field icon={<ShieldCheck/>} label="6-digit reset OTP" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={otp} onChange={event=>setOtp(event.target.value.replace(/\D/g, "").slice(0,6))}/>
        <Field icon={<KeyRound/>} label="New password" type="password" minLength={8} autoComplete="new-password" required value={password} onChange={event=>setPassword(event.target.value)}/>
        <Field icon={<KeyRound/>} label="Confirm new password" type="password" minLength={8} autoComplete="new-password" required value={confirm} onChange={event=>setConfirm(event.target.value)}/>
      </>}
      <button className="auth-submit" disabled={busy}>{busy ? "Please wait…" : sentTo ? "Verify OTP & reset password" : "Send reset OTP"}</button>
      {sentTo && <div className="auth-recovery-actions"><button type="button" disabled={busy} onClick={send}>Resend OTP</button><button type="button" disabled={busy} onClick={()=>{setSentTo("");setOtp("");setMessage("");}}>Change mobile number</button></div>}
    </>}
    {message && <p role="status">{message}</p>}
    <a href="/">Return to login</a>
  </form></div>;
}

function ResetPasswordPage() {
  const token = new URLSearchParams(window.location.search).get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword)
      return setMessage({ type: "error", text: "Passwords do not match." });
    setBusy(true);
    try {
      const result = await api("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setMessage({ type: "success", text: result.message });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="admin-login-shell">
      <form className="admin-login-card" onSubmit={submit}>
        <div className="admin-shield"><KeyRound /></div>
        <small>GEMFLOW ACCOUNT SECURITY</small>
        <h1>Set a new password</h1>
        <p>Create a password with at least eight characters.</p>
        <Field icon={<KeyRound />} label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength="8" />
        <Field icon={<KeyRound />} label="Confirm new password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength="8" />
        {message && <div className={`form-message ${message.type}`}><AlertCircle />{message.text}</div>}
        <button className="auth-submit" disabled={busy || !token}>{busy ? "Updating…" : "Update password"}<ArrowRight /></button>
        <a href="/">Return to GemFlow login</a>
      </form>
    </div>
  );
}

function Field({ icon, label, ...props }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = props.type === "password";
  return (
    <label className="auth-field">
      <span>{label}</span>
      <div>
        {icon}
        <input
          required
          {...props}
          type={isPassword && passwordVisible ? "text" : props.type}
        />
        {isPassword && (
          <button
            type="button"
            className="password-visibility"
            onClick={() => setPasswordVisible((visible) => !visible)}
            aria-label={passwordVisible ? "Hide password" : "Show password"}
            title={passwordVisible ? "Hide password" : "Show password"}
          >
            {passwordVisible ? <EyeOff /> : <Eye />}
          </button>
        )}
      </div>
    </label>
  );
}

function AdminPanel() {
  const [token, setToken] = useState(() =>
    sessionStorage.getItem("gemflow_admin_token"),
  );
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const loadUsers = async (activeToken = token, activeFilter = filter) => {
    setBusy(true);
    try {
      const data = await api(`/api/admin/users?status=${activeFilter}`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      setUsers(data.users);
    } catch (error) {
      if (error.message.includes("expired")) {
        sessionStorage.removeItem("gemflow_admin_token");
        setToken(null);
      }
      setMessage({ type: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    setSelectedUsers([]);
    if (token) loadUsers(token, filter);
  }, [token, filter]);

  const login = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const result = await api("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      sessionStorage.setItem("gemflow_admin_token", result.token);
      setToken(result.token);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  const decide = async (user, status) => {
    if (
      !window.confirm(
        `${status === "approved" ? "Approve" : "Reject"} ${user.name}?`,
      )
    )
      return;
    setBusy(true);
    setMessage(null);
    try {
      const result = await api(`/api/admin/users/${user.id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      setUsers((current) => current.filter((item) => item.id !== user.id));
      setMessage({
        type: result.email.sent ? "success" : "warning",
        text: result.email.sent
          ? `${user.name} was ${status} and the email was sent.`
          : `${user.name} was ${status}. ${result.email.reason}`,
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  const deleteUsers = async (ids, label) => {
    if (!ids.length || !window.confirm(`Delete ${label}? This cannot be undone.`))
      return;
    setBusy(true);
    setMessage(null);
    try {
      const result = await api(
        ids.length === 1
          ? `/api/admin/users/${ids[0]}`
          : "/api/admin/users/bulk-delete",
        {
          method: ids.length === 1 ? "DELETE" : "POST",
          headers: { Authorization: `Bearer ${token}` },
          ...(ids.length > 1 && { body: JSON.stringify({ ids }) }),
        },
      );
      setSelectedUsers([]);
      setMessage({ type: "success", text: result.message });
      await loadUsers(token, filter);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  const deletableUsers = filter !== "pending";
  const allUsersSelected =
    deletableUsers && users.length > 0 && users.every((user) => selectedUsers.includes(user.id));
  const toggleAllUsers = () =>
    setSelectedUsers(allUsersSelected ? [] : users.map((user) => user.id));
  const logout = () => {
    sessionStorage.removeItem("gemflow_admin_token");
    window.location.replace("/admin/");
  };

  if (!token)
    return (
      <div className="admin-login-shell">
        <form className="admin-login-card" onSubmit={login}>
          <div className="admin-shield">
            <ShieldCheck />
          </div>
          <small>GEMFLOW CONTROL CENTRE</small>
          <h1>Administrator login</h1>
          <p>Review and approve access to your private marketplace.</p>
          <Field
            icon={<Mail />}
            label="Admin email"
            name="email"
            type="email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />
          <Field
            icon={<KeyRound />}
            label="Admin password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
          {message && (
            <div className="form-message error">
              <AlertCircle />
              {message.text}
            </div>
          )}
          <button className="auth-submit" disabled={busy}>
            Open admin panel <ArrowRight />
          </button>
          <a href="/">Return to GemFlow login</a>
        </form>
      </div>
    );

  if (window.location.pathname.includes("/admin/inventory"))
    return <AdminInventoryPanel token={token} logout={logout} />;
  if (window.location.pathname.includes("/admin/orders"))
    return <AdminOrdersPanel token={token} logout={logout} />;
  if (window.location.pathname.includes("/admin/enquiries"))
    return <AdminEnquiriesPanel token={token} logout={logout} />;

  return (
    <div className="admin-app">
      <header className="admin-topbar">
        <div className="auth-brand">
          <div className="auth-brand-gem">G</div>
          <div>
            GEM<span>FLOW</span>
          </div>
        </div>
        <AdminNav token={token} logout={logout} />
      </header>
      <main className="admin-main">
        <div className="admin-heading">
          <div>
            <small>ACCESS MANAGEMENT</small>
            <h1>Registered users</h1>
            <p>Review every application before granting marketplace access.</p>
          </div>
          <button
            className="refresh-btn"
            onClick={() => loadUsers()}
            disabled={busy}
          >
            <RefreshCw /> Refresh
          </button>
        </div>
        <div className="admin-filters">
          {[
            ["pending", "Pending review"],
            ["approved", "Approved"],
            ["rejected", "Rejected"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={filter === value ? "active" : ""}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        {message && (
          <div className={`admin-message ${message.type}`}>
            <AlertCircle />
            {message.text}
          </div>
        )}
        {deletableUsers && (
          <div className="bulk-inventory-toolbar admin-bulk-toolbar">
            <span>{selectedUsers.length} user(s) selected</span>
            <button
              className="danger"
              disabled={!selectedUsers.length || busy}
              onClick={() =>
                deleteUsers(selectedUsers, `${selectedUsers.length} selected users`)
              }
            >
              <Trash2 /> Delete selected
            </button>
          </div>
        )}
        <div className="user-table-wrap">
          <table className="user-table">
            <thead>
              <tr>
                {deletableUsers && (
                  <th className="selection-cell">
                    <input
                      type="checkbox"
                      checked={allUsersSelected}
                      onChange={toggleAllUsers}
                      aria-label="Select all users"
                    />
                  </th>
                )}
                <th>User</th>
                <th>Company</th>
                <th>GST</th>
                <th>Contact</th>
                <th>Registered</th>
                <th>Status</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  {deletableUsers && (
                    <td className="selection-cell">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() =>
                          setSelectedUsers((current) =>
                            current.includes(user.id)
                              ? current.filter((id) => id !== user.id)
                              : [...current, user.id],
                          )
                        }
                        aria-label={`Select ${user.name}`}
                      />
                    </td>
                  )}
                  <td>
                    <div className="admin-user">
                      <span>
                        {user.name
                          .split(/\s+/)
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                      <div>
                        <strong>{user.name}</strong>
                        <small>{user.userId}</small>
                      </div>
                    </div>
                  </td>
                  <td>{user.companyName}</td>
                  <td>{user.gstNumber || "—"}</td>
                  <td>
                    <div className="contact-cell">
                      <span>{user.email}</span>
                      <small>{user.phone}</small>
                      <details className="admin-profile-details">
                        <summary>More profile details</summary>
                        <div>
                          {Object.entries(user.profile || {}).filter(([,value]) => value).map(([key,value]) => <p key={key}><b>{key.replace(/([A-Z])/g," $1")}</b><span>{value}</span></p>)}
                          {user.photoPath && <a href={user.photoPath} target="_blank" rel="noreferrer">Photo identity</a>}
                          {user.businessIdPath && <a href={user.businessIdPath} target="_blank" rel="noreferrer">Business identity</a>}
                          {!Object.values(user.profile || {}).some(Boolean) && !user.photoPath && !user.businessIdPath && <small>No additional profile information.</small>}
                        </div>
                      </details>
                    </div>
                  </td>
                  <td>{new Date(user.createdAt + "Z").toLocaleString()}</td>
                  <td>
                    <span className={`status-pill ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    {filter === "pending" ? (
                      <div className="decision-actions">
                        <button
                          className="approve"
                          onClick={() => decide(user, "approved")}
                          disabled={busy}
                        >
                          <Check /> Approve
                        </button>
                        <button
                          className="reject"
                          onClick={() => decide(user, "rejected")}
                          disabled={busy}
                        >
                          <Ban /> Reject
                        </button>
                      </div>
                    ) : (
                      <div className="decision-actions">
                        <span className="reviewed">
                          {user.reviewedAt
                            ? new Date(user.reviewedAt + "Z").toLocaleDateString()
                            : "—"}
                        </span>
                        <button
                          className="reject"
                          onClick={() => deleteUsers([user.id], user.name)}
                          disabled={busy}
                        >
                          <Trash2 /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!users.length && (
            <div className="empty-users">
              <Users />
              <h3>No {filter} users</h3>
              <p>New registrations will appear here automatically.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function AdminNav({ token, logout }) {
  const [counts,setCounts]=useState({users:0,inventory:0,orders:0,enquiries:0});
  useEffect(()=>{const load=()=>api('/api/admin/notifications',{headers:{Authorization:`Bearer ${token}`}}).then(setCounts).catch(()=>{});load();const timer=setInterval(load,10000);return()=>clearInterval(timer);},[token]);
  const item=(href,label,Icon,key)=><button onClick={()=>window.location.href=href}><Icon/>{label}{counts[key]>0&&<span className="admin-nav-count">{counts[key]}</span>}</button>;
  return <div className="admin-nav-actions">{item('/admin/','Users',Users,'users')}{item('/admin/inventory','Inventory',Database,'inventory')}{item('/admin/orders','Orders',Package,'orders')}{item('/admin/enquiries','Enquiries',MessageCircle,'enquiries')}<ThemeToggle/><button onClick={logout}><LogOut/>Logout</button></div>;
}

const adminDiamondFields = [
  ["stock_id", "Stock ID", "text", true],
  ["shape", "Shape", "text", true],
  ["carat", "Carat", "number", true],
  ["color", "Color"],
  ["clarity", "Clarity"],
  ["cut", "Cut"],
  ["polish", "Polish"],
  ["symmetry", "Symmetry"],
  ["fluorescence", "Fluorescence"],
  ["rap_price", "Rap $/ct", "number"],
  ["discount", "Discount %", "number"],
  ["price_per_carat", "$/ct", "number"],
  ["total_price", "Final total $", "number"],
  ["lab", "Laboratory"],
  ["certificate_number", "Certificate number"],
  ["eye_clean", "Eye clean %"],
  ["shade", "Shade"],
  ["measurement", "Measurement"],
  ["depth", "Depth %", "number"],
  ["table_pct", "Table %", "number"],
  ["ratio", "Ratio", "number"],
  ["location", "Location"],
  ["girdle", "Girdle"],
  ["pavilion_angle", "Pavilion angle", "number"],
  ["pavilion_height", "Pavilion height", "number"],
  ["crown_angle", "Crown angle", "number"],
  ["crown_height", "Crown height", "number"],
  ["culet", "Culet"],
  ["star_length", "Star length", "number"],
  ["lower_half", "Lower half", "number"],
  ["extra_facet", "Extra facet"],
  ["table_inclusion", "Table inclusion"],
  ["table_side_inclusion", "Table-side inclusion"],
  ["table_side_black", "Table-side black"],
  ["table_black", "Table black"],
  ["table_open", "Table open"],
  ["side_inclusion", "Side inclusion"],
  ["side_black", "Side black"],
  ["side_open", "Side open"],
  ["hearts_arrows", "H&A"],
  ["luster", "Luster"],
  ["natural_comment", "Natural / report comment"],
  ["milky", "Milky grade"],
  ["provenance", "Provenance / origin"],
  ["girdle_pct", "Girdle %", "number"],
  ["length", "Length", "number"],
  ["width", "Width", "number"],
  ["height", "Height", "number"],
  ["diameter", "Diameter", "number"],
  ["black_crown", "Black crown"],
  ["white_table", "White table"],
  ["white_crown", "White crown"],
  ["open_crown", "Open crown"],
  ["open_pavilion", "Open pavilion"],
  ["key_to_symbols", "Key to symbols"],
  ["packet_number", "Packet number"],
  ["show_id", "Show ID"],
  ["memo_number", "Memo number"],
  ["gemstone_type", "Gemstone type"],
  ["treatment", "Treatment"],
  ["origin", "Origin"],
  ["treatment_notes", "Treatment notes"],
  ["supplier", "Supplier"],
  ["is_pair", "Item kind", "number"],
];
const colorStoneFieldNames = new Set(["stock_id","gemstone_type","lab","color","certificate_number","shape","origin","carat","measurement","length","width","height","treatment","ratio","location","supplier","is_pair","treatment_notes","price_per_carat","total_price"]);
const adminFieldsFor = (category) => category === "color_stone"
  ? adminDiamondFields.filter(([name]) => colorStoneFieldNames.has(name)).map((field) => {
      if (field[0] === "certificate_number") return [field[0], "Report number", field[2], field[3]];
      if (field[0] === "is_pair") return [field[0], "Pair item (1 = pair, 0 = single)", "number"];
      if (field[0] === "gemstone_type") return [field[0], field[1], field[2], true];
      return field;
    })
  : adminDiamondFields;
const allowedAdminDiamondCategory = (category) =>
  ["natural_diamond", "lab_diamond", "color_stone"].includes(category);

function AdminInventoryPanel({ token, logout }) {
  const [category, setCategory] = useState("natural_diamond");
  const [form, setForm] = useState({});
  const [files, setFiles] = useState({});
  const [stones, setStones] = useState([]);
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [spreadsheet, setSpreadsheet] = useState(null);
  const load = () =>
    api("/api/admin/inventory", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => setStones(data.stones))
      .catch((error) => setMessage({ type: "error", text: error.message }));
  useEffect(load, []);
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const body = new FormData();
      body.append("category", category);
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      Object.entries(files).forEach(
        ([key, file]) => file && body.append(key, file),
      );
      const response = await fetch(`${API_URL}/api/admin/inventory`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Upload failed");
      setMessage({
        type: "success",
        text: `${result.stone.stockId} was added to GemFlow inventory.`,
      });
      setForm({});
      setFiles({});
      load();
      event.target.reset();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  const importSpreadsheet = async (event) => {
    event.preventDefault();
    if (!spreadsheet) return;
    setBusy(true);
    setMessage(null);
    try {
      const body = new FormData();
      body.append("category", category);
      body.append("spreadsheet", spreadsheet);
      const response = await fetch(`${API_URL}/api/admin/inventory/import`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const responseText = await response.text();
      let result;
      try { result = JSON.parse(responseText); } catch {
        const advice = response.status === 401 || response.status === 403
          ? "Access expired or was blocked by the trial host. Refresh the page and sign in again."
          : response.status === 413
            ? "The spreadsheet is too large. Use a file smaller than 15 MB."
            : "The server or trial host returned an empty or invalid response. Refresh the page and try again.";
        throw new Error(`Import could not be confirmed (HTTP ${response.status}). ${advice} Check Listed inventory before retrying.`);
      }
      if (!response.ok)
        throw new Error([result.message, ...(result.errors || [])].join(" "));
      if (!Number.isInteger(result.imported) || !Number.isInteger(result.updated))
        throw new Error("The server returned an unexpected import result. Check Listed inventory before retrying.");
      setMessage({
        type: result.skipped ? "warning" : "success",
        text: `${result.imported} products imported, ${result.updated || 0} existing products updated${result.skipped ? `; ${result.skipped} rows skipped.` : "."}`,
      });
      setSpreadsheet(null);
      event.target.reset();
      load();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="admin-app">
      <header className="admin-topbar">
        <div className="auth-brand">
          <div className="auth-brand-gem">G</div>
          <div>
            GEM<span>FLOW</span>
          </div>
        </div>
        <AdminNav token={token} logout={logout} />
      </header>
      <main className="admin-main inventory-admin-main">
        <div className="admin-heading">
          <div>
            <small>CATALOGUE MANAGEMENT</small>
            <h1>Inventory upload</h1>
            <p>Add product specifications and downloadable media.</p>
          </div>
          <span className="inventory-total">{stones.length} items</span>
        </div>
        <div className="inventory-categories">
          {[
            ["natural_diamond", "Natural Diamond", "Available"],
            ["color_stone", "Color Stone", "Available"],
            ["lab_diamond", "Lab-Grown Diamond", "Available"],
          ].map(([value, label, state]) => (
            <button
              key={value}
              className={category === value ? "active" : ""}
              onClick={() => setCategory(value)}
            >
              <Gem />
              <strong>{label}</strong>
              <small>{state}</small>
            </button>
          ))}
        </div>
        {!allowedAdminDiamondCategory(category) ? (
          <div className="coming-category">
            <Gem />
            <h2>{category.replaceAll("_", " ")}</h2>
            <p>
              This category is reserved and will be developed in the next phase.
            </p>
          </div>
        ) : (
          <>
            <form className="bulk-import-card" onSubmit={importSpreadsheet}>
              <div>
                <FileSpreadsheet />
                <span>
                  <strong>Bulk import with Excel</strong>
                  <small>
                    Upload .xlsx or .csv. Required columns: Stock ID,
                    {category === "color_stone" && " Gemstone Type,"} Shape, Carat.
                  </small>
                </span>
              </div>
              <input
                type="file"
                accept=".xlsx,.csv"
                required
                onChange={(e) => setSpreadsheet(e.target.files[0])}
              />
              <a
                href={
                  category === "color_stone"
                    ? "/GemFlow-Color-Stone-Inventory-Template.xlsx"
                    : category === "lab_diamond"
                      ? "/GemFlow-Lab-Grown-Diamond-Inventory-Template.xlsx"
                      : "/GemFlow-Natural-Diamond-Inventory-Template.xlsx"
                }
                download
              >
                Download {category === "color_stone" ? "color-stone" : category === "lab_diamond" ? "lab-grown diamond" : "natural diamond"} template
              </a>
              <button disabled={busy || !spreadsheet}>
                <UploadCloud /> Import products
              </button>
            </form>
            <form className="inventory-form" onSubmit={submit}>
              <div className="inventory-form-head">
                <div>
                  <h2>
                    {category === "lab_diamond" ? "Lab-grown diamond" : category === "color_stone" ? "Colored gemstone" : "Natural diamond"} details
                  </h2>
                  <p>
                    Fields correspond directly to the customer inventory and
                    stone-detail pages.
                  </p>
                </div>
                <button disabled={busy}>
                  <UploadCloud /> {busy ? "Uploading…" : "Add to inventory"}
                </button>
              </div>
              {message && (
                <div className={`admin-message ${message.type}`}>
                  <AlertCircle />
                  {message.text}
                </div>
              )}
              <div className="inventory-field-grid">
                {adminFieldsFor(category).map(
                  ([name, label, type = "text", required]) => (
                    <label key={name}>
                      <span>
                        {label}
                        {required && " *"}
                      </span>
                      <input
                        name={name}
                        type={type}
                        step={type === "number" ? "0.01" : undefined}
                        required={required}
                        value={form[name] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [name]: e.target.value })
                        }
                      />
                    </label>
                  ),
                )}
              </div>
              <div className="media-upload-grid">
                {[
                  ["image", "Image", "image/*"],
                  ["video", "Video", "video/*"],
                  ["inHandVideo", "In-hand video", "video/*"],
                  ["certificate", "Certificate", "application/pdf,image/*"],
                ].map(([name, label, accept]) => (
                  <label key={name}>
                    <span>
                      <UploadCloud /> {label}
                    </span>
                    <input
                      type="file"
                      accept={accept}
                      onChange={(e) =>
                        setFiles({ ...files, [name]: e.target.files[0] })
                      }
                    />
                    <small>
                      {files[name]?.name ||
                        "Choose a file (downloadable by users)"}
                    </small>
                  </label>
                ))}
              </div>
            </form>
          </>
        )}
        <AdminInventoryList
          stones={stones.filter((stone) => stone.category === category)}
          token={token}
          reload={load}
        />
      </main>
    </div>
  );
}

function AdminInventoryList({ stones, token, reload }) {
  const [stockSearch, setStockSearch] = useState("");
  const [mediaStone, setMediaStone] = useState(null);
  const [mediaFiles, setMediaFiles] = useState({});
  const [mediaBusy, setMediaBusy] = useState(false);
  const [selected, setSelected] = useState([]);
  const [editStone, setEditStone] = useState(null);
  const [editForm, setEditForm] = useState({});
  const visibleStones = stones.filter((stone) =>
    String(stone.stockId || "")
      .toLowerCase()
      .includes(stockSearch.trim().toLowerCase()),
  );
  const act = async (stone, type) => {
    if (
      type === "delete" &&
      !window.confirm(`Delete ${stone.stockId} permanently?`)
    )
      return;
    try {
      if (type === "delete")
        await api(`/api/admin/inventory/${stone.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      else
        await api(`/api/admin/inventory/${stone.id}/visibility`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ isVisible: !stone.isVisible }),
        });
      reload();
    } catch (error) {
      window.alert(error.message);
    }
  };
  const toggleSelected = (id) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  const allVisibleSelected =
    visibleStones.length > 0 &&
    visibleStones.every((stone) => selected.includes(stone.id));
  const toggleAll = () =>
    setSelected((current) =>
      allVisibleSelected
        ? current.filter(
            (id) => !visibleStones.some((stone) => stone.id === id),
          )
        : [...new Set([...current, ...visibleStones.map((stone) => stone.id)])],
    );
  const bulkDelete = async () => {
    if (!selected.length) return;
    if (
      !window.confirm(
        `Permanently delete ${selected.length} selected products?`,
      )
    )
      return;
    try {
      const result = await api("/api/admin/inventory/bulk-delete", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ids: selected }),
      });
      window.alert(result.message);
      setSelected([]);
      reload();
    } catch (error) {
      window.alert(error.message);
    }
  };
  const saveMedia = async (event) => {
    event.preventDefault();
    setMediaBusy(true);
    try {
      const body = new FormData();
      Object.entries(mediaFiles).forEach(
        ([key, file]) => file && body.append(key, file),
      );
      const response = await fetch(
        `${API_URL}/api/admin/inventory/${mediaStone.id}/media`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body,
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Media upload failed");
      window.alert(result.message);
      setMediaStone(null);
      setMediaFiles({});
      reload();
    } catch (error) {
      window.alert(error.message);
    } finally {
      setMediaBusy(false);
    }
  };
  const saveEdit = async (event) => {
    event.preventDefault();
    try {
      const result = await api(`/api/admin/inventory/${editStone.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      window.alert(result.message);
      setEditStone(null);
      reload();
    } catch (error) { window.alert(error.message); }
  };
  return (
    <section className="admin-listed-inventory">
      <div className="inventory-form-head">
        <div>
          <h2>Listed inventory</h2>
          <p>Control website visibility, sold status and deletion.</p>
        </div>
        <div className="inventory-heading-tools">
          <label className="stock-search">
            <Search />
            <input
              value={stockSearch}
              onChange={(e) => setStockSearch(e.target.value)}
              placeholder="Search Stock ID"
            />
          </label>
          <span className="inventory-total">
            {visibleStones.length} products
          </span>
        </div>
      </div>
      {mediaStone && (
        <form className="media-editor" onSubmit={saveMedia}>
          <div>
            <strong>Add media to {mediaStone.stockId}</strong>
            <small>Existing files are kept unless you replace them.</small>
          </div>
          {[
            ["image", "Image", "image/*"],
            ["video", "Video", "video/*"],
            ["inHandVideo", "In-hand video", "video/*"],
            ["certificate", "Certificate", "application/pdf,image/*"],
          ].map(([name, label, accept]) => (
            <label key={name}>
              <span>{label}</span>
              <input
                type="file"
                accept={accept}
                onChange={(e) =>
                  setMediaFiles({ ...mediaFiles, [name]: e.target.files[0] })
                }
              />
            </label>
          ))}
          <button disabled={mediaBusy}>
            <UploadCloud /> {mediaBusy ? "Uploading…" : "Save media"}
          </button>
          <button
            type="button"
            className="cancel"
            onClick={() => setMediaStone(null)}
          >
            Cancel
          </button>
        </form>
      )}
      {editStone && (
        <form className="inventory-edit-panel" onSubmit={saveEdit}>
          <div className="inventory-form-head"><div><h3>Edit {editStone.stockId}</h3><small>Update product data or spreadsheet media links.</small></div></div>
          <div className="inventory-field-grid">
            {adminFieldsFor(editStone.category).filter(([name]) => name !== "stock_id").map(([name, label, type = "text"]) => (
              <label key={name}><span>{label}</span><input type={type} step={type === "number" ? "0.01" : undefined} value={editForm[name] ?? ""} onChange={(e) => setEditForm({...editForm, [name]: e.target.value})} /></label>
            ))}
            {[['image_path','Image URL'],['video_path','Video URL'],['in_hand_video_path','In-hand video URL'],['certificate_path','Certificate URL']].map(([name,label]) => <label key={name}><span>{label}</span><input type="url" value={editForm[name] ?? ""} onChange={(e) => setEditForm({...editForm,[name]:e.target.value})}/></label>)}
          </div>
          <div className="inventory-row-actions"><button>Save changes</button><button type="button" className="cancel" onClick={() => setEditStone(null)}>Cancel</button></div>
        </form>
      )}
      <div className="bulk-inventory-toolbar">
        <span>{selected.length} selected</span>
        <button
          className="danger"
          disabled={!selected.length}
          onClick={bulkDelete}
        >
          <Trash2 /> Delete selected
        </button>
      </div>
      {visibleStones.length ? (
        <div className="commerce-table-wrap">
          <table className="commerce-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAll}
                    aria-label="Select all visible products"
                  />
                </th>
                <th>Stock ID</th>
                <th>Shape</th>
                <th>Carat</th>
                <th>Color</th>
                <th>Clarity</th>
                <th>Availability</th>
                <th>Website</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleStones.map((stone) => (
                <tr key={stone.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(stone.id)}
                      onChange={() => toggleSelected(stone.id)}
                      aria-label={`Select ${stone.stockId}`}
                    />
                  </td>
                  <td>
                    <strong>{stone.stockId}</strong>
                  </td>
                  <td>{stone.shape}</td>
                  <td>{stone.carat}</td>
                  <td>{stone.color}</td>
                  <td>{stone.clarity}</td>
                  <td>
                    <span
                      className={`status-pill ${stone.availabilityStatus === "sold" ? "rejected" : "approved"}`}
                    >
                      {stone.availabilityStatus}
                    </span>
                  </td>
                  <td>{stone.isVisible ? "Visible" : "Hidden"}</td>
                  <td>
                    <div className="inventory-row-actions">
                      <button onClick={() => { setEditStone(stone); setEditForm(Object.fromEntries(adminFieldsFor(stone.category).filter(([name]) => name !== 'stock_id').map(([name]) => [name, stone[name.replace(/_([a-z])/g, (_,l)=>l.toUpperCase())] ?? '']).concat([['image_path',stone.imagePath||''],['video_path',stone.videoPath||''],['in_hand_video_path',stone.inHandVideoPath||''],['certificate_path',stone.certificatePath||'']]))); }}><FileText /> Edit</button>
                      <button
                        onClick={() => {
                          setMediaStone(stone);
                          setMediaFiles({});
                        }}
                      >
                        <ImageIcon /> Media
                      </button>
                      <button
                        onClick={() => act(stone, "visibility")}
                      >
                        {stone.isVisible ? <Eye /> : <EyeOff />}
                        {stone.isVisible
                          ? "Hide"
                          : stone.availabilityStatus === "sold"
                            ? "Show / Relist"
                            : "Show"}
                      </button>
                      <button
                        className="danger"
                        onClick={() => act(stone, "delete")}
                      >
                        <Trash2 />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <CommerceEmpty
          icon={Database}
          title="No inventory in this category"
          text="Added products will be listed here."
        />
      )}
    </section>
  );
}

function AdminOrdersPanel({ token, logout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockSearch, setStockSearch] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const filteredOrders = orders.filter(
    (order) =>
      !stockSearch.trim() ||
      order.items.some((stone) =>
        String(stone.stockId || "")
          .toLowerCase()
          .includes(stockSearch.trim().toLowerCase()),
      ),
  );
  const load = () =>
    api("/api/admin/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((d) => setOrders(d.orders))
      .finally(() => setLoading(false));
  useEffect(load, []);
  const decide = async (order, status) => {
    if (!window.confirm(`${status} ${order.orderNumber}?`)) return;
    try {
      const result = await api(`/api/admin/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      window.alert(
        result.email.sent
          ? `Order ${status}; email sent.`
          : `Order ${status}; ${result.email.reason}`,
      );
      load();
    } catch (error) {
      window.alert(error.message);
    }
  };
  const deleteOrders = async (ids, label) => {
    if (!ids.length || !window.confirm(`Delete ${label}? This cannot be undone.`))
      return;
    try {
      const result = await api(
        ids.length === 1
          ? `/api/admin/orders/${ids[0]}`
          : "/api/admin/orders/bulk-delete",
        {
          method: ids.length === 1 ? "DELETE" : "POST",
          headers: { Authorization: `Bearer ${token}` },
          ...(ids.length > 1 && { body: JSON.stringify({ ids }) }),
        },
      );
      window.alert(result.message);
      setSelectedOrders([]);
      load();
    } catch (error) {
      window.alert(error.message);
    }
  };
  const allFilteredOrdersSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((order) => selectedOrders.includes(order.id));
  const toggleAllOrders = () =>
    setSelectedOrders((current) =>
      allFilteredOrdersSelected
        ? current.filter(
            (id) => !filteredOrders.some((order) => order.id === id),
          )
        : [
            ...new Set([
              ...current,
              ...filteredOrders.map((order) => order.id),
            ]),
          ],
    );
  return (
    <div className="admin-app">
      <header className="admin-topbar">
        <div className="auth-brand">
          <div className="auth-brand-gem">G</div>
          <div>
            GEM<span>FLOW</span>
          </div>
        </div>
        <AdminNav token={token} logout={logout} />
      </header>
      <main className="admin-main">
        <div className="admin-heading">
          <div>
            <small>SALES MANAGEMENT</small>
            <h1>Customer orders</h1>
            <p>Accept or reject orders after checking physical availability.</p>
          </div>
          <span className="inventory-total">{orders.length} orders</span>
        </div>
        <div className="global-order-search">
          <label className="stock-search">
            <Search />
            <input
              value={stockSearch}
              onChange={(event) => setStockSearch(event.target.value)}
              placeholder="Search all orders by Stock ID"
            />
            <span>{filteredOrders.length} matching order(s)</span>
          </label>
          <p>Enter a Stock ID to find the buyer and complete order details.</p>
        </div>
        <div className="bulk-inventory-toolbar admin-bulk-toolbar order-bulk-toolbar">
          <label>
            <input
              type="checkbox"
              checked={allFilteredOrdersSelected}
              onChange={toggleAllOrders}
              disabled={!filteredOrders.length}
            />
            Select all matching orders
          </label>
          <span>{selectedOrders.length} order(s) selected</span>
          <button
            className="danger"
            disabled={!selectedOrders.length}
            onClick={() =>
              deleteOrders(selectedOrders, `${selectedOrders.length} selected orders`)
            }
          >
            <Trash2 /> Delete selected
          </button>
        </div>
        {loading ? (
          <div className="commerce-empty">Loading orders…</div>
        ) : !filteredOrders.length ? (
          <CommerceEmpty
            icon={Package}
            title={
              stockSearch ? "No order contains this Stock ID" : "No orders yet"
            }
            text={
              stockSearch
                ? "Try a complete or partial Stock ID."
                : "Placed customer orders will appear here automatically."
            }
          />
        ) : (
          <div className="admin-order-list">
            {filteredOrders.map((order) => (
              <article key={order.id} className="admin-order-card">
                <div className="order-card-head">
                  <div>
                    <label className="order-select">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() =>
                          setSelectedOrders((current) =>
                            current.includes(order.id)
                              ? current.filter((id) => id !== order.id)
                              : [...current, order.id],
                          )
                        }
                        aria-label={`Select ${order.orderNumber}`}
                      />
                      <strong>{order.orderNumber}</strong>
                    </label>
                    <span>
                      {new Date(order.createdAt + "Z").toLocaleString()}
                    </span>
                  </div>
                  <div className="order-decision">
                    <b>${Number(order.totalAmount).toLocaleString()}</b>
                    <span
                      className={`status-pill ${order.status === "rejected" ? "rejected" : order.status === "accepted" ? "approved" : "pending"}`}
                    >
                      {order.status}
                    </span>
                    {order.status === "placed" && (
                      <>
                        <button
                          className="approve"
                          onClick={() => decide(order, "accepted")}
                        >
                          <Check /> Accept
                        </button>
                        <button
                          className="reject"
                          onClick={() => decide(order, "rejected")}
                        >
                          <Ban /> Reject
                        </button>
                      </>
                    )}
                    <button
                      className="reject"
                      onClick={() => deleteOrders([order.id], order.orderNumber)}
                    >
                      <Trash2 /> Delete
                    </button>
                  </div>
                </div>
                <div className="buyer-details">
                  <div>
                    <small>BUYER</small>
                    <strong>{order.user.name}</strong>
                    <span>
                      {order.user.userId} • {order.user.companyName}
                    </span>
                  </div>
                  <div>
                    <small>CONTACT</small>
                    <strong>{order.user.email}</strong>
                    <span>{order.user.phone}</span>
                  </div>
                  <span className="status-pill approved">
                    {order.items.length} stone(s)
                  </span>
                </div>
                <CommerceTable stones={order.items} showSearch={false} />
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function AdminEnquiriesPanel({ token, logout }) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockSearch, setStockSearch] = useState("");
  const load = () =>
    api("/api/admin/enquiries", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => setEnquiries(data.enquiries))
      .finally(() => setLoading(false));
  useEffect(load, []);
  const decide = async (enquiry, status) => {
    const verb = status === "held" ? "place this stone on hold" : "release this stone";
    if (!window.confirm(`Do you want to ${verb}?`)) return;
    try {
      const result = await api(`/api/admin/enquiries/${enquiry.id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      window.alert(result.message);
      load();
    } catch (error) {
      window.alert(error.message);
    }
  };
  const remove = async (enquiry) => {
    if (!window.confirm(`Delete the enquiry for ${enquiry.stone.stockId}?`)) return;
    try { const result = await api(`/api/admin/enquiries/${enquiry.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }); window.alert(result.message); load(); }
    catch (error) { window.alert(error.message); }
  };
  const shown = enquiries.filter((enquiry) =>
    String(enquiry.stone.stockId || "")
      .toLowerCase()
      .includes(stockSearch.trim().toLowerCase()),
  );
  return (
    <div className="admin-app">
      <header className="admin-topbar">
        <div className="auth-brand"><div className="auth-brand-gem">G</div><div>GEM<span>FLOW</span></div></div>
        <AdminNav token={token} logout={logout} />
      </header>
      <main className="admin-main">
        <div className="admin-heading">
          <div><small>CUSTOMER REQUESTS</small><h1>Hold enquiries</h1><p>Review the customer and stone before placing inventory on hold.</p></div>
          <span className="inventory-total">{enquiries.filter((item) => item.status === "requested").length} pending</span>
        </div>
        <div className="global-order-search">
          <label className="stock-search"><Search /><input value={stockSearch} onChange={(e) => setStockSearch(e.target.value)} placeholder="Search enquiries by Stock ID" /><span>{shown.length} found</span></label>
        </div>
        {loading ? <div className="commerce-empty">Loading enquiries…</div> : shown.length ? (
          <div className="admin-order-list">
            {shown.map((enquiry) => (
              <article className="admin-order-card enquiry-card" key={enquiry.id}>
                <div className="order-card-head">
                  <div><strong>{enquiry.stone.stockId}</strong><span>{new Date(enquiry.requestedAt + "Z").toLocaleString()}</span></div>
                  <div className="order-decision">
                    <span className={`status-pill ${enquiry.status === "released" ? "rejected" : enquiry.status === "held" ? "approved" : "pending"}`}>{enquiry.status}</span>
                    {enquiry.status !== "held" && <button className="approve" onClick={() => decide(enquiry, "held")}><LockKeyhole /> Hold</button>}
                    {enquiry.status !== "released" && <button className="reject" onClick={() => decide(enquiry, "released")}><EyeOff /> Release</button>}
                    <button className="danger enquiry-delete" onClick={() => remove(enquiry)} title="Delete enquiry"><Trash2 /> Delete enquiry</button>
                  </div>
                </div>
                <div className="buyer-details">
                  <div><small>BUYER</small><strong>{enquiry.user.name}</strong><span>{enquiry.user.userId} • {enquiry.user.companyName}</span></div>
                  <div><small>CONTACT</small><strong>{enquiry.user.email}</strong><span>{enquiry.user.phone}</span></div>
                  <span className="status-pill approved">1 stone</span>
                </div>
                <CommerceTable stones={[enquiry.stone]} showSearch={false} />
              </article>
            ))}
          </div>
        ) : <CommerceEmpty icon={MessageCircle} title="No matching enquiries" text="Customer hold requests will appear here." />}
      </main>
    </div>
  );
}

const accountFieldGroups = [
  ["PERSONAL DETAILS", [["firstName","First name"],["lastName","Last name"],["designation","Designation"],["secondaryEmail","Secondary email"],["purchaseMode","Purchase mode"],["gender","Gender"]]],
  ["CONTACT & BUSINESS", [["address","Address"],["country","Country"],["state","State"],["city","City"],["telephone","Telephone"],["mobile","Mobile"],["zipCode","Zip code"],["faxNumber","Fax number"],["businessType","Business type"],["howDidYouKnowUs","How did you know us?"],["qqId","QQ ID"],["skypeId","Skype ID"],["wechatId","WeChat ID"],["whatsappId","WhatsApp ID"]]],
];
function AccountPage() {
  const [user,setUser]=useState(null); const [form,setForm]=useState({}); const [files,setFiles]=useState({}); const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false); const [now,setNow]=useState(new Date());
  useEffect(()=>{authApi('/api/auth/me').then(({user})=>{setUser(user);setForm(user.profile||{});});const timer=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(timer);},[]);
  const submit=async(e)=>{e.preventDefault();setBusy(true);setMessage('');try{const body=new FormData();Object.entries(form).forEach(([k,v])=>body.append(k,v));if(files.photo)body.append('photo',files.photo);if(files.businessId)body.append('businessId',files.businessId);const response=await fetch(`${API_URL}/api/account/profile`,{method:'PATCH',headers:{Authorization:`Bearer ${localStorage.getItem('gemflow_token')}`},body});const result=await response.json();if(!response.ok)throw new Error(result.message);setUser(result.user);setForm(result.user.profile||{});setMessage(result.message);}catch(error){setMessage(error.message);}finally{setBusy(false);}};
  if(!user)return <CommercePage title="My Account" subtitle="Loading your profile…"/>;
  const mediaBox=(key,title,path,accept)=><label className="identity-upload"><strong>{title}</strong><div className="identity-preview">{path?<img src={path} alt={title}/>:<UserRound/>}</div><span><UploadCloud/> {files[key]?.name||`Upload ${title}`}</span><input type="file" accept={accept} onChange={e=>setFiles({...files,[key]:e.target.files[0]})}/></label>;
  return <section className="account-page"><div className="account-page-head"><div><small>GEMFLOW MEMBER PROFILE</small><h1>MY ACCOUNT</h1><p>Keep your contact and business information current.</p></div><div className="account-clock"><Clock3/><strong>{now.toLocaleDateString()}</strong><span>{now.toLocaleTimeString()}</span></div></div><form onSubmit={submit}><div className="account-layout"><div>{accountFieldGroups.map(([title,fields])=><section className="account-form-section" key={title}><h2>{title}</h2><div className="account-field-grid">{fields.map(([key,label])=><label key={key}><span>{label}</span>{key==='gender'?<select value={form[key]||''} onChange={e=>setForm({...form,[key]:e.target.value})}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select>:<input type={key.toLowerCase().includes('email')?'email':'text'} value={form[key]||''} onChange={e=>setForm({...form,[key]:e.target.value})}/>}</label>)}</div></section>)}</div><aside className="identity-column">{mediaBox('photo','Photo Identity',user.photoPath,'image/*')}{mediaBox('businessId','Business Identity',user.businessIdPath,'image/*,application/pdf')}</aside></div>{message&&<div className="commerce-message">{message}</div>}<button className="account-save" disabled={busy}><CheckCircle2/>{busy?'Saving…':'Update profile'}</button></form></section>;
}

function NewStonesPage({ colorStone = false }) {
  const [stones, setStones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStone, setSelectedStone] = useState(null);
  useEffect(() => {
    authApi(colorStone ? "/api/new-color-stones" : "/api/new-stones")
      .then((d) => setStones(d.stones))
      .finally(() => setLoading(false));
  }, [colorStone]);
  if (selectedStone)
    return (
      <StoneDetail
        stone={selectedStone}
        onBack={() => setSelectedStone(null)}
      />
    );
  return (
    <CommercePage
      title={colorStone ? "Today's New Color Stones" : "Today's New Diamonds"}
      subtitle="Visible, available inventory added during the last 24 hours."
    >
      {loading ? (
        <p>Loading…</p>
      ) : stones.length ? (
        <CommerceTable
          stones={stones}
          action="cartOrder"
          onView={setSelectedStone}
          onChanged={() => {}}
        />
      ) : (
        <CommerceEmpty
          icon={colorStone ? Gem : Diamond}
          title={colorStone ? "No new color stones today" : "No new diamonds today"}
          text={`${colorStone ? "Color stones" : "Diamonds"} uploaded during the last 24 hours will appear here.`}
        />
      )}
    </CommercePage>
  );
}

function CartPage() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const load = () => authApi("/api/cart").then((d) => setItems(d.items));
  useEffect(() => {
    load();
  }, []);
  const toggle = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  const remove = async (id) => {
    await authApi(`/api/cart/${id}`, { method: "DELETE" });
    setSelected((s) => s.filter((x) => x !== id));
    await load();
    refreshCommerce();
  };
  const order = async () => {
    try {
      const result = await authApi("/api/orders", {
        method: "POST",
        body: JSON.stringify({ inventoryIds: selected }),
      });
      setMessage(`${result.orderNumber} placed successfully.`);
      setSelected([]);
      await load();
      refreshCommerce();
    } catch (error) {
      setMessage(error.message);
    }
  };
  const total = items
    .filter((s) => selected.includes(s.id))
    .reduce((n, s) => n + Number(s.totalPrice || 0), 0);
  return (
    <CommercePage
      title="My Basket"
      subtitle="Select one or more stones and place your order."
    >
      <div className="cart-toolbar">
        <span>
          {selected.length} selected • ${total.toLocaleString()}
        </span>
        <button disabled={!selected.length} onClick={order}>
          <Package /> Place order
        </button>
      </div>
      {message && <div className="commerce-message">{message}</div>}
      {items.length ? (
        <CommerceTable
          stones={items}
          selection={selected}
          onSelect={toggle}
          action="remove"
          onAction={remove}
        />
      ) : (
        <CommerceEmpty
          icon={ShoppingCart}
          title="Your basket is empty"
          text="Add diamonds from inventory or the stone-detail page."
        />
      )}
    </CommercePage>
  );
}

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    authApi("/api/orders").then((d) => setOrders(d.orders));
  }, []);
  return (
    <CommercePage
      title="My Orders"
      subtitle="Every order placed from your basket."
    >
      {orders.length ? (
        <div className="my-order-list">
          {orders.map((order) => (
            <article className="my-order-card" key={order.id}>
              <div className="order-card-head">
                <div>
                  <strong>{order.orderNumber}</strong>
                  <span>
                    {new Date(order.createdAt + "Z").toLocaleString()}
                  </span>
                </div>
                <div>
                  <span
                    className={`status-pill ${order.status === "rejected" ? "rejected" : order.status === "accepted" ? "approved" : "pending"}`}
                  >
                    {order.status}
                  </span>
                  <b>${Number(order.totalAmount).toLocaleString()}</b>
                </div>
              </div>
              <CommerceTable stones={order.items} />
            </article>
          ))}
        </div>
      ) : (
        <CommerceEmpty
          icon={Package}
          title="No orders placed"
          text="Orders placed from your basket will appear here."
        />
      )}
    </CommercePage>
  );
}

function HoldsPage() {
  const [stones, setStones] = useState([]);
  const [selectedStone, setSelectedStone] = useState(null);
  const load = () => authApi("/api/holds").then((data) => setStones(data.stones));
  useEffect(() => { load(); }, []);
  if (selectedStone)
    return <StoneDetail stone={selectedStone} onBack={() => setSelectedStone(null)} />;
  return (
    <CommercePage title="My Holds" subtitle="Stones placed on hold for your account by the administrator.">
      {stones.length ? (
        <CommerceTable stones={stones} onView={setSelectedStone} />
      ) : (
        <CommerceEmpty icon={LockKeyhole} title="No stones on hold" text="Send a hold request from a stone-detail page. Approved holds appear here." />
      )}
    </CommercePage>
  );
}

function FavouritesPage() {
  const [stones, setStones] = useState([]);
  const [selectedStone, setSelectedStone] = useState(null);
  const load = () => authApi("/api/favourites").then((data) => setStones(data.stones));
  useEffect(() => { load(); }, []);
  const remove = async (id) => {
    await authApi(`/api/favourites/${id}`, { method: "DELETE" });
    await load();
    refreshCommerce();
  };
  if (selectedStone)
    return <StoneDetail stone={selectedStone} onBack={() => setSelectedStone(null)} />;
  return (
    <CommercePage title="Favorites" subtitle="Your saved stones in one place.">
      {stones.length ? (
        <CommerceTable stones={stones} action="remove" onAction={remove} onView={setSelectedStone} />
      ) : (
        <CommerceEmpty icon={Star} title="No favourite stones" text="Use Add to favourite on any stone-detail page." />
      )}
    </CommercePage>
  );
}

function CommercePage({ title, subtitle, children }) {
  return (
    <section className="commerce-page">
      <div className="commerce-heading">
        <small>GEMFLOW ACCOUNT</small>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
function CommerceEmpty({ icon: Icon, title, text }) {
  return (
    <div className="commerce-empty">
      <Icon />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
function CommerceTable({
  stones,
  selection = [],
  onSelect,
  action,
  onAction,
  onChanged,
  showSearch = true,
  onView,
}) {
  const [stockSearch, setStockSearch] = useState("");
  const shownStones = stones.filter((stone) =>
    String(stone.stockId || "")
      .toLowerCase()
      .includes(stockSearch.trim().toLowerCase()),
  );
  const add = async (stone) => {
    try {
      await authApi(`/api/cart/${stone.id}`, { method: "POST" });
      refreshCommerce();
      onChanged?.();
      window.alert("Stone added to your basket.");
    } catch (error) {
      window.alert(error.message);
    }
  };
  const orderNow = async (stone) => {
    try {
      await authApi(`/api/cart/${stone.id}`, { method: "POST" });
      const result = await authApi("/api/orders", {
        method: "POST",
        body: JSON.stringify({ inventoryIds: [stone.id] }),
      });
      refreshCommerce();
      onChanged?.();
      window.alert(`${result.orderNumber} placed and awaiting admin approval.`);
    } catch (error) {
      window.alert(error.message);
    }
  };
  return (
    <div className="commerce-table-shell">
      {showSearch && (
        <label className="stock-search commerce-stock-search">
          <Search />
          <input
            value={stockSearch}
            onChange={(e) => setStockSearch(e.target.value)}
            placeholder="Search by Stock ID"
          />
          <span>{shownStones.length} found</span>
        </label>
      )}
      <div className="commerce-table-wrap">
        <table className="commerce-table">
          <thead>
            <tr>
              {onSelect && <th>Select</th>}
              <th>Stock ID</th>
              <th>Shape</th>
              <th>Carat</th>
              <th>Color</th>
              <th>Clarity</th>
              <th>Lab</th>
              <th>Certificate</th>
              <th>Location</th>
              <th>Total</th>
              {action && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {shownStones.map((stone) => (
              <tr className={inventoryRowClass(stone)} key={`${stone.id}-${stone.stockId}`}>
                {onSelect && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selection.includes(stone.id)}
                      onChange={() => onSelect(stone.id)}
                    />
                  </td>
                )}
                <td>
                  {onView ? (
                    <button
                      className="stock-link"
                      onClick={() => onView(stone)}
                    >
                      {stone.stockId}
                    </button>
                  ) : (
                    <strong>{stone.stockId}</strong>
                  )}
                </td>
                <td>{stone.shape}</td>
                <td>{Number(stone.carat).toFixed(2)}</td>
                <td>{stone.color}</td>
                <td>{stone.clarity}</td>
                <td>{stone.lab}</td>
                <td>{stone.certificateNumber || "—"}</td>
                <td>{stone.location}</td>
                <td>
                  <b>${Number(stone.totalPrice || 0).toLocaleString()}</b>
                </td>
                {action && (
                  <td>
                    {action === "cart" || action === "cartOrder" ? (
                      <div className="table-commerce-actions">
                        <button
                          className="table-cart-btn"
                          onClick={() => add(stone)}
                        >
                          <ShoppingCart /> Add to cart
                        </button>
                        {action === "cartOrder" && (
                          <button
                            className="table-order-btn"
                            onClick={() => orderNow(stone)}
                          >
                            <Package /> Place order
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        className="table-remove-btn"
                        onClick={() => onAction(stone.id)}
                      >
                        <X /> Remove
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="commerce-mobile-list">
        {shownStones.map((stone) => (
          <article
            className={`mobile-stone-card ${inventoryRowClass(stone)}`}
            key={`mobile-${stone.id}-${stone.stockId}`}
            onClick={() => onView?.(stone)}
            role={onView ? "button" : undefined}
            tabIndex={onView ? 0 : undefined}
            onKeyDown={(event) => event.key === "Enter" && onView?.(stone)}
          >
            {onSelect && (
              <label className="mobile-stone-select" onClick={(event) => event.stopPropagation()}>
                <input type="checkbox" checked={selection.includes(stone.id)} onChange={() => onSelect(stone.id)} /> Select
              </label>
            )}
            <div className="mobile-stone-main">
              <div className="mobile-carat"><strong>{Number(stone.carat || 0).toFixed(2)}</strong><span>Carat</span></div>
              <div className="mobile-stone-data">
                <div className="mobile-stone-topline">
                  <strong>{stone.stockId}</strong>
                  <span>{stone.shape || "—"}</span>
                  <span>{stone.discount == null ? "—" : `${stone.discount}%`}</span>
                  <b>${Number(stone.pricePerCarat || 0).toLocaleString()} <small>/Ct</small></b>
                </div>
                <div className="mobile-stone-bottomline">
                  <strong>{[stone.color, stone.clarity, stone.cut, stone.polish, stone.symmetry, stone.fluorescence, stone.lab].filter(Boolean).join(" · ") || "Product details"}</strong>
                  <span>{stone.measurement || stone.certificateNumber || stone.location || "—"}</span>
                  <b>${Number(stone.totalPrice || 0).toLocaleString()}</b>
                </div>
              </div>
            </div>
            {action && (
              <div className="mobile-stone-actions" onClick={(event) => event.stopPropagation()}>
                {action === "cart" || action === "cartOrder" ? <>
                  <button className="table-cart-btn" onClick={() => add(stone)}><ShoppingCart /> Add to cart</button>
                  {action === "cartOrder" && <button className="table-order-btn" onClick={() => orderNow(stone)}><Package /> Place order</button>}
                </> : <button className="table-remove-btn" onClick={() => onAction(stone.id)}><X /> Remove</button>}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [active, setActive] = useState("Dashboard");
  const [sidebar, setSidebar] = useState(false);
  const [hero, setHero] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [liveStats, setLiveStats] = useState({
    newStones: 0,
    newColorStones: 0,
    basketCount: 0,
    basketTotal: 0,
    orderCount: 0,
    holdCount: 0,
    favouriteCount: 0,
  });
  const refreshStats = () =>
    authApi("/api/dashboard")
      .then(setLiveStats)
      .catch(() => {});
  useEffect(() => {
    refreshStats();
    const timer = setInterval(refreshStats, 5000);
    window.addEventListener("gemflow-commerce-change", refreshStats);
    window.addEventListener("focus", refreshStats);
    return () => {
      clearInterval(timer);
      window.removeEventListener("gemflow-commerce-change", refreshStats);
      window.removeEventListener("focus", refreshStats);
    };
  }, []);
  useEffect(() => {
    const loadNotifications = () =>
      authApi("/api/notifications")
        .then((data) => setNotifications(data.notifications || []))
        .catch(() => {});
    loadNotifications();
    const timer = setInterval(loadNotifications, 15000);
    window.addEventListener("focus", loadNotifications);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", loadNotifications);
    };
  }, []);

  const nextHero = () => setHero((hero + 1) % stones.length);
  const prevHero = () => setHero((hero - 1 + stones.length) % stones.length);
  const currentStone = stones[hero];

  return (
    <div className="app">
      <header className="topbar">
        <button
          className="mobile-menu"
          onClick={() => setSidebar(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <button className="brand brand-button" onClick={() => setActive("Dashboard")} aria-label="Go to dashboard">
          <div className="brand-mark">
            <span>G</span>
          </div>
          <div className="brand-title">
            GEM<span>FLOW</span>
          </div>
        </button>
        <div className="top-title">
          {active === "Diamonds"
            ? "SEARCH DIAMOND"
            : active === "Lab Diamonds"
              ? "SEARCH LAB-GROWN DIAMOND"
              : active === "Gemstones"
                ? "SEARCH GEMSTONES"
              : active.toUpperCase()}
        </div>
        <div className="top-actions">
          <button className="icon-btn" onClick={() => setNotificationOpen((open) => !open)} aria-label="Open notifications" aria-expanded={notificationOpen}>
            <Bell size={19} />
            {notifications.length > 0 && <span className="notification-count">{notifications.length > 99 ? "99+" : notifications.length}</span>}
          </button>
          {notificationOpen && <div className="user-notification-panel" role="dialog" aria-label="Recent notifications">
            <div className="user-notification-head"><div><strong>Notifications</strong><small>Automatically removed after 72 hours</small></div><button onClick={() => setNotificationOpen(false)} aria-label="Close notifications"><X /></button></div>
            <div className="user-notification-list">
              {notifications.length ? notifications.map((notification) => {
                const items = Array.isArray(notification.details?.items) ? notification.details.items : notification.details ? [notification.details] : [];
                return <article key={notification.id} className={`user-notification ${notification.type}`}>
                  <div className="user-notification-title"><Bell /><div><strong>{notification.title}</strong><time>{new Date(`${notification.createdAt.replace(" ", "T")}Z`).toLocaleString()}</time></div></div>
                  <p>{notification.message}</p>
                  {items.length > 0 && <div className="user-notification-items">{items.map((item, index) => <div key={`${notification.id}-${item.id || item.stockId || index}`}><b>{item.stockId || `Item ${index + 1}`}</b><span>{[item.gemstoneType, item.shape, item.carat ? `${Number(item.carat).toFixed(2)} ct` : "", item.color, item.clarity, item.lab].filter(Boolean).join(" · ")}</span>{item.totalPrice != null && <strong>${Number(item.totalPrice).toLocaleString()}</strong>}</div>)}</div>}
                </article>;
              }) : <div className="user-notification-empty"><Bell /><strong>No recent notifications</strong><span>Order and hold updates will appear here.</span></div>}
            </div>
          </div>}
          <div className="user-chip">
            <div className="avatar">
              {user.name
                .split(/\s+/)
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="user-info">
              <strong>{user.name}</strong>
              <small>{user.companyName}</small>
            </div>
          </div>
          <button className="logout" onClick={onLogout}>
            <LogOut size={17} /> Logout
          </button>
          <ThemeToggle />
        </div>
      </header>

      <aside className={`sidebar ${sidebar ? "open" : ""}`}>
        <button className="close-sidebar" onClick={() => setSidebar(false)}>
          <X size={22} />
        </button>
        <nav>
          {navItems.map(([label, Icon]) => (
            <button
              key={label}
              className={`nav-item ${active === label ? "active" : ""}`}
              onClick={() => {
                setActive(label);
                setSidebar(false);
              }}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <Sparkles size={18} />
            <div>
              <strong>Need help?</strong>
              <span>Ask your CRM</span>
            </div>
          </div>
        </div>
      </aside>
      {sidebar && <div className="overlay" onClick={() => setSidebar(false)} />}

      <main
        className={`main ${["Diamonds", "Lab Diamonds", "Gemstones"].includes(active) ? "diamond-main" : ""}`}
      >
        {active === "Diamonds" ? (
          <DiamondSearchPage category="natural_diamond" title="diamonds" />
        ) : active === "Lab Diamonds" ? (
          <DiamondSearchPage
            category="lab_diamond"
            title="lab-grown diamonds"
          />
        ) : active === "Gemstones" ? (
          <GemstoneSearchPage />
        ) : active === "My Basket" ? (
          <CartPage />
        ) : active === "My Orders" ? (
          <OrdersPage />
        ) : active === "My Holds" ? (
          <HoldsPage />
        ) : active === "Favorites" ? (
          <FavouritesPage />
        ) : active === "New Stones" ? (
          <NewStonesPage />
        ) : active === "New Color Stones" ? (
          <NewStonesPage colorStone />
        ) : active === "Account" ? (
          <AccountPage />
        ) : (
          <>
            <section className="stats-grid">
              <Stat
                title="NEW DIAMONDS"
                value={liveStats.newStones}
                icon={<Diamond />}
                onClick={() => setActive("New Stones")}
              />
              <Stat
                title="NEW COLOR STONE"
                value={liveStats.newColorStones}
                icon={<Gem />}
                onClick={() => setActive("New Color Stones")}
              />
              <Stat
                title="MY BASKET"
                value={liveStats.basketCount}
                icon={<ShoppingCart />}
                extra={
                  <em>${Number(liveStats.basketTotal).toLocaleString()}</em>
                }
                onClick={() => setActive("My Basket")}
              />
              <Stat
                title="FAVOURITES"
                value={liveStats.favouriteCount}
                icon={<Star />}
                onClick={() => setActive("Favorites")}
              />
              <Stat
                title="MY ORDERS"
                value={liveStats.orderCount}
                icon={<Truck />}
                extra={
                  <>
                    <b>{liveStats.orderCount}</b> PLACED
                  </>
                }
                onClick={() => setActive("My Orders")}
              />
              <Stat
                title="MY HOLDS"
                value={liveStats.holdCount}
                icon={<LockKeyhole />}
                onClick={() => setActive("My Holds")}
              />
            </section>

            <section className="category-strip">
              {categories.map(([name, count, shape]) => (
                <button className="category" key={name}>
                  <span className={`shape ${shape}`}></span>
                  <span>{name}</span>
                  <strong>/{count}</strong>
                </button>
              ))}
              <button className="strip-more">
                <ChevronRight size={18} />
              </button>
            </section>

            <section className="content-grid">
              <div className="hero-card">
                <div className="hero-image">
                  <div className={`diamond-art ${currentStone.tone}`}>
                    <div className="diamond-core"></div>
                  </div>
                  <button className="carousel left" onClick={prevHero}>
                    <ChevronLeft />
                  </button>
                  <button className="carousel right" onClick={nextHero}>
                    <ChevronRight />
                  </button>
                  <div className="hero-badge">FEATURED INVENTORY</div>
                </div>
                <div className="hero-meta">
                  <div>
                    <a className="stock-id">{currentStone.id}</a>
                    <strong>{currentStone.shape}</strong>
                    <span>{currentStone.carat} CT</span>
                    <span>{currentStone.color}</span>
                    <span>{currentStone.grade}</span>
                  </div>
                  <b>{currentStone.price}</b>
                </div>
              </div>

              <div className="promo-card">
                <div className="promo-image navy">
                  <div className="promo-wordmark">
                    GEM<span>FLOW</span>
                  </div>
                  <div className="promo-diamond"></div>
                  <small>Natural • Lab • Color</small>
                </div>
              </div>

              <div className="quick-stack">
                <Quick
                  title="DIAMONDS"
                  icon={<Diamond />}
                  onClick={() => setActive("Diamonds")}
                />
                <Quick
                  title="YOUR DISCOUNT ELIGIBILITY"
                  value="-1.5%"
                  icon={<Percent />}
                />
                <Quick title="NEW ARRIVALS" value="24" icon={<Sparkles />} />
              </div>
            </section>

            <section className="lower-grid">
              <div className="panel ask-panel">
                <div className="panel-title">
                  <h3>Ask Your CRM</h3>
                  <button>
                    <MoreVertical size={18} />
                  </button>
                </div>
                <div className="crm-row">
                  <div className="mini-gem">
                    <Gem size={18} />
                  </div>
                  <div>
                    <strong>Find me a 2ct oval sapphire</strong>
                    <span>Natural • Blue • Sri Lanka</span>
                  </div>
                  <button className="small-action">
                    <ArrowUpRight size={15} />
                  </button>
                </div>
                <div className="crm-row">
                  <div className="mini-gem">
                    <Diamond size={18} />
                  </div>
                  <div>
                    <strong>Best price for G VS1 round</strong>
                    <span>1.00–1.20 ct • Natural</span>
                  </div>
                  <button className="small-action">
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>

              <div className="panel">
                <PanelHeader title="MY VIEWED" action="View all" />
                <div className="table-head">
                  <span>STONE</span>
                  <span>CARAT</span>
                  <span>COLOR</span>
                  <span>CLARITY</span>
                  <span>PRICE</span>
                </div>
                {[
                  ["379889", "0.90 ct", "G", "IF", "$1,652"],
                  ["482117", "1.21 ct", "F", "VS1", "$3,980"],
                  ["902144", "2.03 ct", "H", "VS2", "$7,340"],
                ].map((r, i) => (
                  <div className="table-row" key={i}>
                    <div>
                      <span className="round-dot"></span>
                      <b>{r[0]}</b>
                    </div>
                    <span>{r[1]}</span>
                    <span>{r[2]}</span>
                    <span>{r[3]}</span>
                    <strong>{r[4]}</strong>
                  </div>
                ))}
              </div>

              <div className="panel">
                <PanelHeader title="MY SAVED SEARCHES" action="Manage" />
                <div className="saved-card">
                  <div>
                    <b>Round Natural G VS1</b>
                    <span>12,480 matches • Updated 2h ago</span>
                  </div>
                  <Eye size={17} />
                </div>
                <div className="saved-card">
                  <div>
                    <b>Sri Lankan Blue Sapphire</b>
                    <span>86 matches • Updated yesterday</span>
                  </div>
                  <Eye size={17} />
                </div>
              </div>

              <div className="panel">
                <PanelHeader title="MY APPOINTMENT" action="Calendar" />
                <div className="appointment">
                  <div className="date-box">
                    <strong>28</strong>
                    <span>AUG</span>
                  </div>
                  <div>
                    <b>Diamond buying review</b>
                    <span>12:00 PM • Online</span>
                  </div>
                  <button>
                    <ExternalLink size={16} />
                  </button>
                </div>
                <div className="appointment">
                  <div className="date-box">
                    <strong>02</strong>
                    <span>SEP</span>
                  </div>
                  <div>
                    <b>Supplier meeting</b>
                    <span>04:30 PM • Showroom</span>
                  </div>
                  <button>
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </section>

            <section className="inventory-preview">
              <div className="section-heading">
                <div>
                  <small>MARKETPLACE</small>
                  <h2>New & Recommended</h2>
                </div>
                <button className="outline-btn">
                  <SlidersHorizontal size={16} /> Filters
                </button>
              </div>
              <div className="stone-grid">
                {stones.map((stone) => (
                  <StoneCard stone={stone} key={stone.id} />
                ))}
                <div className="add-card">
                  <Plus size={30} />
                  <b>Browse all inventory</b>
                  <span>Open advanced search</span>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

const filterOptions = {
  shape: [
    "Round",
    "Oval",
    "Pear",
    "Marquise",
    "Heart",
    "Cushion",
    "Cushion B",
    "Emerald",
    "Sq.emerald",
    "Princess",
    "Square",
    "L Radiant",
    "Other Cuts",
    "Pair",
    "Cush Mod",
    "Cush Brill",
    "Radiant",
    "Asscher",
    "Trilliant",
    "Euro Cut",
    "Old Miner",
    "Briolette",
    "Rose Cut",
    "Lozenge",
    "Baguette",
    "Tap Bag",
    "Half Moon",
    "Flanders",
    "Trapezoid",
    "Bullets",
    "Kite",
    "Shield",
    "Star",
    "Pentagonal",
    "Hexagonal",
    "Octagonal",
    "Portuguese Cut",
    "Moval Cut",
    "Other",
  ],
  color: [
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ],
  clarity: [
    "FL",
    "IF",
    "VVS1",
    "VVS2",
    "VS1",
    "VS2",
    "SI1",
    "SI2",
    "SI3",
    "I1",
    "I2",
    "I3",
  ],
  cut: ["EXCELLENT", "VERY GOOD", "GOOD", "FAIR"],
  polish: ["EXCELLENT", "VERY GOOD", "GOOD"],
  symmetry: ["EXCELLENT", "VERY GOOD", "GOOD", "FAIR"],
  fluor: ["N", "F", "VSL", "M", "SL", "ST", "VS"],
  lab: ["GIA", "IGI", "HRD", "FAITH", "NONCERT"],
  eyeClean: ["100%", "75%", "NONE"],
  milky: ["M0", "NV", "M1", "M2", "M3"],
  shade: [
    "WH",
    "YL",
    "NV",
    "TYPE IIA",
    "BRN1",
    "BRN2",
    "BRN3",
    "GREY",
    "GRN",
    "PINK",
    "FANCY",
    "GRE",
    "TYPE II-E",
  ],
  heartsArrows: ["H&A VG", "H&A EX", "NV"],
  provenance: [
    "Code of Origin",
    "Canadian Mine",
    "Canadamark Eligible",
    "Forevermark Eligible",
    "Tracr",
    "iTraceiT",
  ],
  tableBlack: ["BT0", "NV", "BT1", "BT2", "BT3"],
  blackCrown: ["BC0", "NV", "BC1", "BC2", "BC3"],
  whiteTable: ["WT0", "NV", "WT1", "WT2", "WT3"],
  whiteCrown: ["WC0", "NV", "WC1", "WC2", "WC3"],
  tableOpen: ["TO0", "NV", "TO1", "TO2", "TO3"],
  openCrown: ["CO0", "NV", "CO1", "CO2", "CO3"],
  openPavilion: ["PO0", "NV", "PO1", "PO2", "PO3"],
  keySymbols: [
    "Natural",
    "Indented Natural",
    "Cavity",
    "Chip",
    "Needle",
    "Feather",
    "Crystal",
    "Knot",
    "Crystal Surface",
    "Bearding",
    "Bruise",
    "Cleavage",
    "Cloud",
    "Etch Channel",
    "Extra Facet",
    "Internal Graining",
    "Internal Inscription",
    "Internal Laser Drilling",
    "Laser Drill Hole",
    "Manufacturing Remnant",
    "No Inclusion",
    "Pinpoint",
    "Surface Graining",
    "Twinning Wisp",
    "Reflecting Surface Graining",
    "Minor Details of Polish",
  ],
};

function DiamondSearchPage({
  category = "natural_diamond",
  title = "diamonds",
}) {
  const empty = {
    shape: [],
    color: [],
    clarity: [],
    cut: [],
    polish: [],
    symmetry: [],
    fluor: [],
    lab: [],
    eyeClean: [],
    minCarat: "",
    maxCarat: "",
    minTotalPrice: "",
    maxTotalPrice: "",
    minDiscount: "",
    maxDiscount: "",
    minPricePerCarat: "",
    maxPricePerCarat: "",
    shade: "",
    location: "",
    stockId: "",
    keyword: "",
    milky: [],
    colorShade: [],
    heartsArrows: [],
    provenance: [],
    tableBlack: [],
    blackCrown: [],
    whiteTable: [],
    whiteCrown: [],
    tableOpen: [],
    openCrown: [],
    openPavilion: [],
    keySymbols: [],
    arrivalFrom: "",
    arrivalTo: "",
    minRatio: "",
    maxRatio: "",
    minDepth: "",
    maxDepth: "",
    minTablePct: "",
    maxTablePct: "",
    minGirdlePct: "",
    maxGirdlePct: "",
    minLength: "",
    maxLength: "",
    minWidth: "",
    maxWidth: "",
    minHeight: "",
    maxHeight: "",
    minDiameter: "",
    maxDiameter: "",
    minPavilionAngle: "",
    maxPavilionAngle: "",
    minCrownAngle: "",
    maxCrownAngle: "",
  };
  const [filters, setFilters] = useState(empty);
  const [appliedFilters, setAppliedFilters] = useState(empty);
  const [collapsed, setCollapsed] = useState(false);
  const [inventory, setInventory] = useState(diamondInventory);
  const [selectedStone, setSelectedStone] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [mobileActionOpen, setMobileActionOpen] = useState(false);
  const [selectedResultIds, setSelectedResultIds] = useState([]);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  useEffect(() => {
    setInventory([]);
    setSelectedStone(null);
    setSelectedResultIds([]);
    setFilters(empty);
    setAppliedFilters(empty);
    const token = localStorage.getItem("gemflow_token");
    api(`/api/inventory?category=${category}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => {
        setInventory(data.stones);
      })
      .catch(() => {});
  }, [category]);
  const toggle = (key, value) =>
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  const search = () => {
    setAppliedFilters({ ...filters });
    setCollapsed(true);
    setTimeout(
      () =>
        document
          .querySelector(".diamond-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      180,
    );
  };
  const reset = () => {
    setFilters(empty);
    setAppliedFilters(empty);
  };
  const matchesFilters = (stone, currentFilters) => {
    const fieldMap = {
      fluor: "fluorescence",
      colorShade: "shade",
      keySymbols: "keyToSymbols",
    };
    const listMatch = (key) => {
      if (!currentFilters[key].length) return true;
      const gradeNames = {
        ex: "excellent",
        vg: "very good",
        gd: "good",
        fr: "fair",
        id: "ideal",
      };
      let actual = String(stone[fieldMap[key] || key] || "").toLowerCase();
      if (["cut", "polish", "symmetry"].includes(key))
        actual = gradeNames[actual] || actual;
      if (key === "fluor") {
        const fluorNames = {
          non: "n",
          none: "n",
          fnt: "f",
          faint: "f",
          med: "m",
          medium: "m",
          stg: "st",
          strong: "st",
          vst: "vs",
          "very strong": "vs",
        };
        actual = fluorNames[actual] || actual;
      }
      if (key === "shape") {
        const shapeNames = {
          "cushion modified": "cush mod",
          cushion: "cush mod",
          "cushion brilliant": "cush brill",
          "tapered baguette": "tap bag",
          "sq emerald": "sq.emerald",
          "square emerald": "sq.emerald",
          "long radiant": "l radiant",
        };
        actual = shapeNames[actual] || actual;
      }
      return currentFilters[key].some((value) =>
        actual.includes(String(value).toLowerCase()),
      );
    };
    const inRange = (value, min, max) =>
      (!min || Number(value) >= Number(min)) &&
      (!max || Number(value) <= Number(max));
    const keyword = currentFilters.keyword.trim().toLowerCase();
    const date = stone.createdAt ? String(stone.createdAt).slice(0, 10) : "";
    return (
      [
        "shape",
        "color",
        "clarity",
        "cut",
        "polish",
        "symmetry",
        "fluor",
        "lab",
        "eyeClean",
        "milky",
        "colorShade",
        "heartsArrows",
        "provenance",
        "tableBlack",
        "blackCrown",
        "whiteTable",
        "whiteCrown",
        "tableOpen",
        "openCrown",
        "openPavilion",
        "keySymbols",
      ].every(listMatch) &&
      (!currentFilters.minCarat ||
        stone.carat >= Number(currentFilters.minCarat)) &&
      (!currentFilters.maxCarat ||
        stone.carat <= Number(currentFilters.maxCarat)) &&
      (!currentFilters.minTotalPrice ||
        Number(stone.totalPrice) >= Number(currentFilters.minTotalPrice)) &&
      (!currentFilters.maxTotalPrice ||
        Number(stone.totalPrice) <= Number(currentFilters.maxTotalPrice)) &&
      (!currentFilters.minDiscount ||
        Number(stone.discount) >= Number(currentFilters.minDiscount)) &&
      (!currentFilters.maxDiscount ||
        Number(stone.discount) <= Number(currentFilters.maxDiscount)) &&
      (!currentFilters.minPricePerCarat ||
        Number(stone.pricePerCarat) >=
          Number(currentFilters.minPricePerCarat)) &&
      (!currentFilters.maxPricePerCarat ||
        Number(stone.pricePerCarat) <=
          Number(currentFilters.maxPricePerCarat)) &&
      (!currentFilters.shade || stone.shade === currentFilters.shade) &&
      (!currentFilters.location ||
        stone.location === currentFilters.location) &&
      (!currentFilters.stockId ||
        String(stone.stockId || "")
          .toLowerCase()
          .includes(currentFilters.stockId.trim().toLowerCase())) &&
      (!keyword ||
        [
          stone.stockId,
          stone.certificateNumber,
          stone.packetNumber,
          stone.showId,
          stone.memoNumber,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(keyword),
        )) &&
      (!currentFilters.arrivalFrom || date >= currentFilters.arrivalFrom) &&
      (!currentFilters.arrivalTo || date <= currentFilters.arrivalTo) &&
      inRange(stone.ratio, currentFilters.minRatio, currentFilters.maxRatio) &&
      inRange(stone.depth, currentFilters.minDepth, currentFilters.maxDepth) &&
      inRange(
        stone.tablePct,
        currentFilters.minTablePct,
        currentFilters.maxTablePct,
      ) &&
      inRange(
        stone.girdlePct,
        currentFilters.minGirdlePct,
        currentFilters.maxGirdlePct,
      ) &&
      inRange(
        stone.length,
        currentFilters.minLength,
        currentFilters.maxLength,
      ) &&
      inRange(stone.width, currentFilters.minWidth, currentFilters.maxWidth) &&
      inRange(
        stone.height,
        currentFilters.minHeight,
        currentFilters.maxHeight,
      ) &&
      inRange(
        stone.diameter,
        currentFilters.minDiameter,
        currentFilters.maxDiameter,
      ) &&
      inRange(
        stone.pavilionAngle,
        currentFilters.minPavilionAngle,
        currentFilters.maxPavilionAngle,
      ) &&
      inRange(
        stone.crownAngle,
        currentFilters.minCrownAngle,
        currentFilters.maxCrownAngle,
      )
    );
  };
  const previewResults = inventory.filter((stone) =>
    matchesFilters(stone, filters),
  );
  const sorters = {
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    price_low: (a, b) => Number(a.totalPrice || 0) - Number(b.totalPrice || 0),
    price_high: (a, b) => Number(b.totalPrice || 0) - Number(a.totalPrice || 0),
    carat_low: (a, b) => Number(a.carat || 0) - Number(b.carat || 0),
    carat_high: (a, b) => Number(b.carat || 0) - Number(a.carat || 0),
    discount_low: (a, b) => Number(a.discount || 0) - Number(b.discount || 0),
    discount_high: (a, b) => Number(b.discount || 0) - Number(a.discount || 0),
    per_ct_low: (a, b) =>
      Number(a.pricePerCarat || 0) - Number(b.pricePerCarat || 0),
    per_ct_high: (a, b) =>
      Number(b.pricePerCarat || 0) - Number(a.pricePerCarat || 0),
    clarity_low: (a, b) => String(a.clarity || "").localeCompare(String(b.clarity || "")),
    clarity_high: (a, b) => String(b.clarity || "").localeCompare(String(a.clarity || "")),
    color_low: (a, b) => String(a.color || "").localeCompare(String(b.color || "")),
    color_high: (a, b) => String(b.color || "").localeCompare(String(a.color || "")),
  };
  const results = inventory
    .filter((stone) => matchesFilters(stone, appliedFilters))
    .sort(sorters[sortBy]);
  const resultKey = (stone) => String(stone.id ?? stone.stockId);
  const selectedResults = results.filter((stone) =>
    selectedResultIds.includes(resultKey(stone)),
  );
  const allResultsSelected =
    results.length > 0 && selectedResults.length === results.length;
  const toggleResultSelection = (stone) => {
    const key = resultKey(stone);
    setSelectedResultIds((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  };
  const toggleAllResults = () =>
    setSelectedResultIds(
      allResultsSelected ? [] : results.map((stone) => resultKey(stone)),
    );
  const openComparison = () => {
    if (selectedResults.length < 2) {
      window.alert("Select at least two products to compare.");
      return;
    }
    setMobileActionOpen(false);
    setComparisonOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const downloadSelectedResults = async () => {
    if (!selectedResults.length)
      return window.alert("Select at least one product using its carat circle.");
    const columns = [
      ["Stock ID", "stockId"], ["Category", "category"], ["Shape", "shape"],
      ["Carat", "carat"], ["Color", "color"], ["Clarity", "clarity"],
      ["Cut", "cut"], ["Polish", "polish"], ["Symmetry", "symmetry"],
      ["Fluorescence", "fluorescence"], ["Lab", "lab"],
      ["Certificate Number", "certificateNumber"], ["Measurement", "measurement"],
      ["Depth %", "depth"], ["Table %", "tablePct"], ["Ratio", "ratio"],
      ["Location", "location"], ["Discount %", "discount"],
      ["Price / Carat", "pricePerCarat"], ["Total Price", "totalPrice"],
    ];
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Selected inventory");
    sheet.columns = columns.map(([header, key]) => ({ header, key, width: Math.max(12, header.length + 3) }));
    selectedResults.forEach((stone) => sheet.addRow(stone));
    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF287F9D" } };
    sheet.views = [{ state: "frozen", ySplit: 1 }];
    sheet.autoFilter = { from: "A1", to: `${String.fromCharCode(64 + columns.length)}${selectedResults.length + 1}` };
    const buffer = await workbook.xlsx.writeBuffer();
    const url = URL.createObjectURL(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `gemflow-selected-${category}-${new Date().toISOString().slice(0, 10)}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const sendSelectedEnquiries = async () => {
    const inventoryIds = selectedResults.map((stone) => Number(stone.id)).filter(Number.isInteger);
    if (!inventoryIds.length)
      return window.alert("Select at least one product using its carat circle.");
    try {
      const result = await authApi("/api/enquiries-bulk", {
        method: "POST",
        body: JSON.stringify({ inventoryIds }),
      });
      window.alert(result.message);
      setSelectedResultIds([]);
      setMobileActionOpen(false);
    } catch (error) {
      window.alert(error.message);
    }
  };
  const selectedInventoryIds = () =>
    selectedResults.map((stone) => Number(stone.id)).filter(Number.isInteger);
  const requireSelectedInventoryIds = () => {
    const inventoryIds = selectedInventoryIds();
    if (!inventoryIds.length) {
      window.alert("Select at least one product using its carat circle.");
      return null;
    }
    return inventoryIds;
  };
  const addSelectedToCart = async () => {
    const inventoryIds = requireSelectedInventoryIds();
    if (!inventoryIds) return;
    try {
      await Promise.all(inventoryIds.map((id) => authApi(`/api/cart/${id}`, { method: "POST" })));
      refreshCommerce();
      setMobileActionOpen(false);
      window.alert(`${inventoryIds.length} selected ${inventoryIds.length === 1 ? "product" : "products"} added to your basket.`);
    } catch (error) {
      window.alert(error.message);
    }
  };
  const placeSelectedOrder = async () => {
    const inventoryIds = requireSelectedInventoryIds();
    if (!inventoryIds) return;
    try {
      await Promise.all(inventoryIds.map((id) => authApi(`/api/cart/${id}`, { method: "POST" })));
      const result = await authApi("/api/orders", {
        method: "POST",
        body: JSON.stringify({ inventoryIds }),
      });
      refreshCommerce();
      setSelectedResultIds([]);
      setMobileActionOpen(false);
      window.alert(`${result.orderNumber} placed and awaiting admin approval.`);
    } catch (error) {
      window.alert(error.message);
    }
  };
  const addSelectedToFavourites = async () => {
    const inventoryIds = requireSelectedInventoryIds();
    if (!inventoryIds) return;
    try {
      await Promise.all(inventoryIds.map((id) => authApi(`/api/favourites/${id}`, { method: "POST" })));
      refreshCommerce();
      setMobileActionOpen(false);
      window.alert(`${inventoryIds.length} selected ${inventoryIds.length === 1 ? "product" : "products"} added to Favourites.`);
    } catch (error) {
      window.alert(error.message);
    }
  };
  const shareSelected = async () => {
    if (!selectedResults.length)
      return window.alert("Select at least one product using its carat circle.");
    const text = selectedResults.map((stone) => stone.stockId || stone.id).join(", ");
    try {
      if (navigator.share) await navigator.share({ title: "GemFlow selected inventory", text });
      else {
        await navigator.clipboard.writeText(text);
        window.alert("Selected Stock IDs copied.");
      }
      setMobileActionOpen(false);
    } catch (error) {
      if (error.name !== "AbortError") window.alert("Unable to share the selected products.");
    }
  };
  const mobileResultTotals = results.reduce(
    (total, stone) => ({
      carat: total.carat + Number(stone.carat || 0),
      discount: total.discount + Number(stone.discount || 0),
      pricePerCarat: total.pricePerCarat + Number(stone.pricePerCarat || 0),
      amount: total.amount + Number(stone.totalPrice ?? stone.price ?? 0),
    }),
    { carat: 0, discount: 0, pricePerCarat: 0, amount: 0 },
  );
  const mobileAverageDiscount = results.length
    ? mobileResultTotals.discount / results.length
    : 0;
  const mobileAveragePrice = results.length
    ? mobileResultTotals.pricePerCarat / results.length
    : 0;
  if (selectedStone)
    return (
      <StoneDetail
        stone={selectedStone}
        onBack={() => setSelectedStone(null)}
      />
    );
  if (comparisonOpen)
    return (
      <DiamondComparisonPage
        stones={selectedResults}
        onBack={() => setComparisonOpen(false)}
        onOpenStone={(stone) => {
          setComparisonOpen(false);
          setSelectedStone(stone);
        }}
      />
    );
  return (
    <section className={`diamond-search-page ${collapsed ? "results-active" : ""}`}>
      <div className="search-panel">
        <div className="search-panel-head">
          <div>
            <Search /> <strong>SEARCH VIEW</strong>
          </div>
          <div className="search-actions">
            <span className="desktop-search-count">{previewResults.length} Stones Found</span>
            <button className="mobile-head-search" onClick={search}>
              <strong>Search Inventory</strong>
              <small>{previewResults.length} stones found</small>
            </button>
            <button onClick={reset}>
              <RefreshCw /> Reset
            </button>
            <button className="save-search">
              <ClipboardList /> Save Search
            </button>
            <button
              className="hide-search"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? "SHOW" : "HIDE"}
            </button>
          </div>
        </div>
        {!collapsed && (
          <div className="filter-body">
            <FilterRow label="STOCK ID">
              <label className="stock-search diamond-stock-search">
                <Search />
                <input
                  value={filters.stockId}
                  onChange={(e) =>
                    setFilters({ ...filters, stockId: e.target.value })
                  }
                  placeholder="Enter complete or partial Stock ID"
                />
              </label>
            </FilterRow>
            <FilterRow label="SHAPE" wide mobileSlider>
              <div
                className="shape-filter-scroll"
                onPointerDown={startFilterSliderDrag}
                onPointerMove={moveFilterSliderDrag}
                onPointerUp={endFilterSliderDrag}
                onPointerCancel={endFilterSliderDrag}
                onClickCapture={stopFilterSliderClickAfterDrag}
              >
                <button
                  className={!filters.shape.length ? "selected" : ""}
                  onClick={() => setFilters({ ...filters, shape: [] })}
                >
                  <span className="mini-shape all">ALL</span>All Shapes
                </button>
                {filterOptions.shape.map((value) => (
                  <button
                    key={value}
                    className={filters.shape.includes(value) ? "selected" : ""}
                    onClick={() => toggle("shape", value)}
                  >
                    <ShapeIcon shape={value} />
                    {value}
                  </button>
                ))}
              </div>
            </FilterRow>
            <FilterRow label="CARAT">
              <div className="carat-control-stack">
                <div className="carat-inputs">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Min carat"
                    value={filters.minCarat}
                    onChange={(e) =>
                      setFilters({ ...filters, minCarat: e.target.value })
                    }
                  />
                  <span>to</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Max carat"
                    value={filters.maxCarat}
                    onChange={(e) =>
                      setFilters({ ...filters, maxCarat: e.target.value })
                    }
                  />
                </div>
                <div className="carat-presets option-buttons">
                  {[
                    ["All", "", ""],
                    ["30s Down", "0", "0.39"],
                    ["30s", "0.30", "0.39"],
                    ["40s", "0.40", "0.49"],
                    ["50s - 60s", "0.50", "0.69"],
                    ["70s - 80s", "0.70", "0.89"],
                    ["90s", "0.90", "0.99"],
                    ["1ct", "1", "1.49"],
                    ["1.5ct", "1.5", "1.99"],
                    ["2ct", "2", "2.99"],
                    ["3ct - 4ct", "3", "4.99"],
                    ["5ct +", "5", ""],
                  ].map(([label, min, max]) => (
                    <button
                      key={label}
                      className={
                        filters.minCarat === min && filters.maxCarat === max
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        setFilters({ ...filters, minCarat: min, maxCarat: max })
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </FilterRow>
            <div className="commercial-filter-grid">
              {[
                [
                  "TOTAL PRICE",
                  "minTotalPrice",
                  "maxTotalPrice",
                  "$ Min",
                  "$ Max",
                ],
                ["DISCOUNT %", "minDiscount", "maxDiscount", "Min %", "Max %"],
                [
                  "PRICE / CT",
                  "minPricePerCarat",
                  "maxPricePerCarat",
                  "$/ct Min",
                  "$/ct Max",
                ],
              ].map(
                ([label, minKey, maxKey, minPlaceholder, maxPlaceholder]) => (
                  <label key={minKey}>
                    <strong>{label}</strong>
                    <div className="carat-inputs">
                      <input
                        type="number"
                        step="0.01"
                        placeholder={minPlaceholder}
                        value={filters[minKey]}
                        onChange={(e) =>
                          setFilters({ ...filters, [minKey]: e.target.value })
                        }
                      />
                      <span>to</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder={maxPlaceholder}
                        value={filters[maxKey]}
                        onChange={(e) =>
                          setFilters({ ...filters, [maxKey]: e.target.value })
                        }
                      />
                    </div>
                  </label>
                ),
              )}
            </div>
            <OptionFilter
              label="COLOR"
              mobileSlider
              filterKey="color"
              options={filterOptions.color}
              filters={filters}
              toggle={toggle}
            />
            <OptionFilter
              label="CLARITY"
              mobileSlider
              filterKey="clarity"
              options={filterOptions.clarity}
              filters={filters}
              toggle={toggle}
            />
            <OptionFilter
              label="MILKY"
              filterKey="milky"
              options={filterOptions.milky}
              filters={filters}
              toggle={toggle}
            />
            <OptionFilter
              label="COLOR SHADE"
              filterKey="colorShade"
              options={filterOptions.shade}
              filters={filters}
              toggle={toggle}
            />
            <div className="filter-columns">
              <div>
                <OptionFilter
                  label="CUT"
                  filterKey="cut"
                  options={filterOptions.cut}
                  filters={filters}
                  toggle={toggle}
                />
                <OptionFilter
                  label="POLISH"
                  filterKey="polish"
                  options={filterOptions.polish}
                  filters={filters}
                  toggle={toggle}
                />
                <OptionFilter
                  label="SYMMETRY"
                  filterKey="symmetry"
                  options={filterOptions.symmetry}
                  filters={filters}
                  toggle={toggle}
                />
              </div>
              <div>
                <OptionFilter
                  label="FLUOR"
                  mobileLabel="FLUORESCENCE"
                  filterKey="fluor"
                  options={filterOptions.fluor}
                  filters={filters}
                  toggle={toggle}
                />
                <OptionFilter
                  label="LAB"
                  filterKey="lab"
                  options={filterOptions.lab}
                  filters={filters}
                  toggle={toggle}
                />
                <OptionFilter
                  label="EYE CLEAN"
                  filterKey="eyeClean"
                  options={filterOptions.eyeClean}
                  filters={filters}
                  toggle={toggle}
                />
                <OptionFilter
                  label="H&A"
                  filterKey="heartsArrows"
                  options={filterOptions.heartsArrows}
                  filters={filters}
                  toggle={toggle}
                />
              </div>
            </div>
            <div className="mobile-hidden-filter">
              <OptionFilter
                label="PROVENANCE"
                filterKey="provenance"
                options={filterOptions.provenance}
                filters={filters}
                toggle={toggle}
              />
            </div>
            <div className="select-filter-row">
              <label>
                <strong>LOCATION</strong>
                <select
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                >
                  <option value="">Select location</option>
                  {["Mumbai", "Surat", "Delhi"].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </label>
            </div>
            <div className="reference-search-row">
              <label className="mobile-hidden-filter">
                <strong>ARRIVALS</strong>
                <input
                  type="date"
                  value={filters.arrivalFrom}
                  onChange={(e) =>
                    setFilters({ ...filters, arrivalFrom: e.target.value })
                  }
                />
                <span>to</span>
                <input
                  type="date"
                  value={filters.arrivalTo}
                  onChange={(e) =>
                    setFilters({ ...filters, arrivalTo: e.target.value })
                  }
                />
              </label>
              <label className="mobile-hidden-filter">
                <strong>RATIO</strong>
                <input
                  type="number"
                  step="0.01"
                  placeholder="From"
                  value={filters.minRatio}
                  onChange={(e) =>
                    setFilters({ ...filters, minRatio: e.target.value })
                  }
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="To"
                  value={filters.maxRatio}
                  onChange={(e) =>
                    setFilters({ ...filters, maxRatio: e.target.value })
                  }
                />
              </label>
              <label className="keyword-filter">
                <strong>PACKET / CERT / SHOW / MEMO</strong>
                <input
                  placeholder="Enter number or ID"
                  value={filters.keyword}
                  onChange={(e) =>
                    setFilters({ ...filters, keyword: e.target.value })
                  }
                />
              </label>
            </div>
            <button
              className="advanced-filter-toggle"
              onClick={() => setAdvancedOpen(!advancedOpen)}
            >
              <SlidersHorizontal /> Advanced filters {advancedOpen ? "−" : "+"}
            </button>
            {advancedOpen && (
              <div className="advanced-filter-panel">
                <h3>Price and parameters</h3>
                <div className="advanced-range-grid">
                  {[
                    ["Total Depth %", "minDepth", "maxDepth"],
                    ["Table %", "minTablePct", "maxTablePct"],
                    ["Girdle %", "minGirdlePct", "maxGirdlePct"],
                    ["Length", "minLength", "maxLength"],
                    ["Width", "minWidth", "maxWidth"],
                    ["Height", "minHeight", "maxHeight"],
                    ["Diameter", "minDiameter", "maxDiameter"],
                    ["Pavilion Angle", "minPavilionAngle", "maxPavilionAngle"],
                    ["Crown Angle", "minCrownAngle", "maxCrownAngle"],
                  ].map(([label, minKey, maxKey]) => (
                    <label key={minKey}>
                      <strong>{label}</strong>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="From"
                        value={filters[minKey]}
                        onChange={(e) =>
                          setFilters({ ...filters, [minKey]: e.target.value })
                        }
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="To"
                        value={filters[maxKey]}
                        onChange={(e) =>
                          setFilters({ ...filters, [maxKey]: e.target.value })
                        }
                      />
                    </label>
                  ))}
                </div>
                <h3>Inclusion filters</h3>
                <div className="inclusion-filter-grid">
                  <OptionFilter
                    label="BLACK TABLE"
                    filterKey="tableBlack"
                    options={filterOptions.tableBlack}
                    filters={filters}
                    toggle={toggle}
                  />
                  <OptionFilter
                    label="BLACK CROWN"
                    filterKey="blackCrown"
                    options={filterOptions.blackCrown}
                    filters={filters}
                    toggle={toggle}
                  />
                  <OptionFilter
                    label="WHITE TABLE"
                    filterKey="whiteTable"
                    options={filterOptions.whiteTable}
                    filters={filters}
                    toggle={toggle}
                  />
                  <OptionFilter
                    label="WHITE CROWN"
                    filterKey="whiteCrown"
                    options={filterOptions.whiteCrown}
                    filters={filters}
                    toggle={toggle}
                  />
                  <OptionFilter
                    label="OPEN TABLE"
                    filterKey="tableOpen"
                    options={filterOptions.tableOpen}
                    filters={filters}
                    toggle={toggle}
                  />
                  <OptionFilter
                    label="OPEN CROWN"
                    filterKey="openCrown"
                    options={filterOptions.openCrown}
                    filters={filters}
                    toggle={toggle}
                  />
                  <OptionFilter
                    label="OPEN PAVILION"
                    filterKey="openPavilion"
                    options={filterOptions.openPavilion}
                    filters={filters}
                    toggle={toggle}
                  />
                </div>
                <OptionFilter
                  label="KEY TO SYMBOL"
                  filterKey="keySymbols"
                  options={filterOptions.keySymbols}
                  filters={filters}
                  toggle={toggle}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="diamond-results">
        {collapsed && (
          <div className="mobile-result-chrome">
            <div className="mobile-result-toolbar">
              <button
                className="mobile-result-back"
                onClick={() => {
                  setCollapsed(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <ArrowLeft /> <strong>Result</strong>
              </button>
              <div className="mobile-result-tools">
                <button
                  className="mobile-modify-filters"
                  onClick={() => {
                    setCollapsed(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Modify
                </button>
                <button
                  className={allResultsSelected ? "selected" : ""}
                  aria-label={allResultsSelected ? "Clear selected results" : "Select all filtered results"}
                  onClick={toggleAllResults}
                ><CheckCircle2 /></button>
                <button aria-label="Grid view" className="mobile-grid-symbol">▦</button>
                <button aria-label="Sort results" onClick={() => setMobileSortOpen(true)}><SlidersHorizontal /></button>
                <button aria-label="Download selected results as Excel" onClick={downloadSelectedResults}><Download /></button>
              </div>
            </div>
            <div className="mobile-result-summary">
              <div><strong>{results.length}</strong><span>Pcs</span></div>
              <div><strong>{mobileResultTotals.carat.toFixed(2)}</strong><span>Cts</span></div>
              <div><strong>{mobileAverageDiscount.toFixed(2)}%</strong><span>Disc %</span></div>
              <div><strong>{Math.round(mobileAveragePrice).toLocaleString()}</strong><span>Price $</span></div>
              <div><strong>{Math.round(mobileResultTotals.amount).toLocaleString()}</strong><span>Amount $</span></div>
            </div>
          </div>
        )}
        <div className="results-heading">
          <div>
            <small>INVENTORY RESULTS</small>
            <h2>
              {results.length} matching {title}
            </h2>
          </div>
          <button
            className="desktop-compare-button"
            onClick={openComparison}
            disabled={selectedResults.length < 2}
          >
            <Diamond /> Compare selected ({selectedResults.length})
          </button>
          <label className="result-sort">
            Sort by
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="price_low">Price: low to high</option>
              <option value="price_high">Price: high to low</option>
              <option value="carat_low">Carat: low to high</option>
              <option value="carat_high">Carat: high to low</option>
              <option value="discount_low">Discount: low to high</option>
              <option value="discount_high">Discount: high to low</option>
              <option value="per_ct_low">Price/ct: low to high</option>
              <option value="per_ct_high">Price/ct: high to low</option>
            </select>
          </label>
        </div>
        <div className="diamond-table-wrap inventory-wide-table">
          <table className="diamond-table">
            <thead>
              <tr>
                <th>Stock ID</th>
                <th>Details</th>
                <th>Shape</th>
                <th>Carat</th>
                <th>Color</th>
                <th>Clarity</th>
                <th>Cut</th>
                <th>Pol</th>
                <th>Sym</th>
                <th>Fluor</th>
                <th>Rap</th>
                <th>Disc</th>
                <th>$/ct</th>
                <th>F.Total $</th>
                <th>Lab</th>
                <th>Eye</th>
                <th>Shade</th>
                <th>Measurement</th>
                <th>Depth</th>
                <th>Table</th>
                <th>Ratio</th>
                <th>Location</th>
                <th>Certificate</th>
              </tr>
            </thead>
            <tbody>
              {results.map((stone) => (
                <tr className={inventoryRowClass(stone)} key={stone.stockId || stone.id}>
                  <td>
                    <div className="desktop-stock-select">
                      <button
                        className={`desktop-result-select ${selectedResultIds.includes(resultKey(stone)) ? "selected" : ""}`}
                        aria-label={`Select ${stone.stockId || stone.id}`}
                        aria-pressed={selectedResultIds.includes(resultKey(stone))}
                        onClick={() => toggleResultSelection(stone)}
                      >
                        {selectedResultIds.includes(resultKey(stone)) && <Check />}
                      </button>
                      <button
                        className="stock-link"
                        onClick={() => setSelectedStone(stone)}
                      >
                        {stone.stockId || stone.id}
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      className="detail-chip"
                      onClick={() => setSelectedStone(stone)}
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <b>{stone.shape}</b>
                  </td>
                  <td>{Number(stone.carat).toFixed(2)}</td>
                  <td>{stone.color}</td>
                  <td>{stone.clarity}</td>
                  <td>{stone.cut}</td>
                  <td>{stone.polish}</td>
                  <td>{stone.symmetry}</td>
                  <td>{stone.fluorescence || stone.fluor}</td>
                  <td>{stone.rapPrice ?? "—"}</td>
                  <td>{stone.discount ?? "—"}</td>
                  <td>{stone.pricePerCarat ?? "—"}</td>
                  <td>
                    <strong>
                      $
                      {Number(
                        stone.totalPrice ?? stone.price ?? 0,
                      ).toLocaleString()}
                    </strong>
                  </td>
                  <td><button className="lab-badge lab-preview" onClick={() => setSelectedStone({...stone, openCertificate: true})}>{stone.lab || "Certi"}</button></td>
                  <td>{stone.eyeClean || "—"}</td>
                  <td>{stone.shade || "—"}</td>
                  <td>{stone.measurement || "—"}</td>
                  <td>{stone.depth ?? "—"}</td>
                  <td>{stone.tablePct ?? "—"}</td>
                  <td>{stone.ratio ?? "—"}</td>
                  <td>{stone.location}</td>
                  <td>{stone.certificateNumber || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!results.length && (
            <div className="no-diamonds">
              <Diamond />
              <h3>No {title} match these filters</h3>
              <button onClick={reset}>Reset all filters</button>
            </div>
          )}
        </div>
        <div className="diamond-mobile-results">
          {results.map((stone) => (
            <article
              className={`mobile-stone-card ${inventoryRowClass(stone)}`}
              key={`search-mobile-${stone.stockId || stone.id}`}
              onClick={() => setSelectedStone(stone)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => event.target === event.currentTarget && event.key === "Enter" && setSelectedStone(stone)}
            >
              <div className="mobile-stone-main">
                <button
                  className={`mobile-carat ${selectedResultIds.includes(resultKey(stone)) ? "selected" : ""}`}
                  aria-pressed={selectedResultIds.includes(resultKey(stone))}
                  aria-label={`Select ${stone.stockId || stone.id}`}
                  onClick={(event) => { event.stopPropagation(); toggleResultSelection(stone); }}
                  onKeyDown={(event) => event.stopPropagation()}
                ><strong>{Number(stone.carat || 0).toFixed(2)}</strong><span>Carat</span></button>
                <div className="mobile-stone-data">
                  <div className="mobile-stone-topline">
                    <strong>{stone.stockId || stone.id}</strong>
                    <span>{stone.shape || "—"}</span>
                    <span>{stone.discount == null ? "—" : `${stone.discount}%`}</span>
                    <b>${Number(stone.pricePerCarat || 0).toLocaleString()} <small>/Ct</small></b>
                  </div>
                  <div className="mobile-stone-bottomline">
                    <strong>{[stone.color, stone.clarity, stone.cut, stone.polish, stone.symmetry, stone.fluorescence || stone.fluor, stone.lab].filter(Boolean).join(" · ") || "Product details"}</strong>
                    <span>{stone.measurement || stone.certificateNumber || stone.location || "—"}</span>
                    <b>${Number(stone.totalPrice ?? stone.price ?? 0).toLocaleString()}</b>
                  </div>
                </div>
              </div>
            </article>
          ))}
          {!results.length && <div className="no-diamonds"><Diamond /><h3>No {title} match these filters</h3><button onClick={reset}>Reset all filters</button></div>}
        </div>
      </div>
      {collapsed && (
        <nav className="mobile-result-bottom-nav" aria-label="Inventory actions">
          <button onClick={sendSelectedEnquiries}><MessageCircle /><span>Enquiry</span></button>
          <button onClick={openComparison}><Diamond /><span>Compare</span></button>
          <button
            className={`mobile-result-plus ${mobileActionOpen ? "open" : ""}`}
            aria-label={mobileActionOpen ? "Close selection actions" : "Open selection actions"}
            aria-expanded={mobileActionOpen}
            onClick={() => setMobileActionOpen((open) => !open)}
          >{mobileActionOpen ? "×" : "+"}</button>
          <button onClick={placeSelectedOrder}><ShoppingCart /><span>Place Order</span></button>
          <button><Users /><span>Status</span></button>
        </nav>
      )}
      {collapsed && mobileActionOpen && (
        <div className="mobile-selection-overlay" onClick={() => setMobileActionOpen(false)}>
          <div className="mobile-selection-menu" role="dialog" aria-modal="true" aria-label="Selected product actions" onClick={(event) => event.stopPropagation()}>
            <button onClick={sendSelectedEnquiries}><MessageCircle /><span>Enquiry</span></button>
            <button onClick={placeSelectedOrder}><ShoppingCart /><span>Place Order</span></button>
            <button onClick={addSelectedToCart}><ShoppingCart /><span>Add to Cart</span></button>
            <button onClick={addSelectedToFavourites}><Star /><span>Favourites</span></button>
            <button onClick={openComparison}><Diamond /><span>Add to Compare</span></button>
            <button onClick={shareSelected}><Share2 /><span>Share</span></button>
            <button onClick={() => { setSelectedResultIds([]); setMobileActionOpen(false); }}><X /><span>Clear Selection</span></button>
            <button onClick={() => { downloadSelectedResults(); setMobileActionOpen(false); }}><Download /><span>Download</span></button>
          </div>
        </div>
      )}
      {mobileSortOpen && (
        <div className="mobile-sort-overlay" onClick={() => setMobileSortOpen(false)}>
          <div className="mobile-sort-sheet" role="dialog" aria-modal="true" aria-label="Sort inventory" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-sort-sheet-head"><strong>Sort inventory</strong><button onClick={() => setMobileSortOpen(false)}>×</button></div>
            {[
              ["price_low", "↑", "Low to High $"], ["price_high", "↓", "High to Low $"],
              ["discount_low", "↑", "Low to High %"], ["discount_high", "↓", "High to Low %"],
              ["newest", "↕", "Default"], ["carat_low", "↑", "Low to High Size"],
              ["carat_high", "↓", "High to Low Size"], ["clarity_low", "↑", "Low to High Clarity"],
              ["clarity_high", "↓", "High to Low Clarity"], ["color_low", "↑", "Low to High Color"],
              ["color_high", "↓", "High to Low Color"], ["per_ct_low", "↑", "Low to High $/Ct"],
              ["per_ct_high", "↓", "High to Low $/Ct"],
            ].map(([value, arrow, label]) => (
              <button key={value} className={sortBy === value ? "selected" : ""} onClick={() => { setSortBy(value); setMobileSortOpen(false); }}>
                <span>{arrow}</span><strong>{label}</strong>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function DiamondComparisonPage({ stones, onBack, onOpenStone }) {
  const [message, setMessage] = useState("");
  const [activeMedia, setActiveMedia] = useState({});
  const addToCart = async (stone) => {
    try {
      if (!Number.isInteger(Number(stone.id)))
        throw new Error("This product must first be added through Admin Inventory.");
      await authApi(`/api/cart/${stone.id}`, { method: "POST" });
      refreshCommerce();
      setMessage(`${stone.stockId || stone.id} added to your basket.`);
    } catch (error) {
      setMessage(error.message);
    }
  };
  const money = (value) =>
    Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  return (
    <section className="diamond-comparison-page">
      <button className="comparison-back" onClick={onBack}>
        <ArrowLeft /> Back to results
      </button>
      <h1 className="comparison-brand">GEMFLOW</h1>
      {message && <div className="comparison-message">{message}</div>}
      <div className="comparison-card-grid">
        {stones.map((stone) => {
          const stoneKey = String(stone.id ?? stone.stockId);
          const showingVideo = activeMedia[stoneKey] === "video" && Boolean(stone.videoPath);
          const videoIsEmbed = /player\.cloudinary\.com\/embed/i.test(String(stone.videoPath || ""));
          const videoPlaybackUrl = videoIsEmbed
            ? `${stone.videoPath}${String(stone.videoPath).includes("?") ? "&" : "?"}autoplay=true`
            : stone.videoPath;
          const status = String(stone.availabilityStatus || "available").toLowerCase();
          const descriptor = [
            String(stone.shape || "DI").slice(0, 2).toUpperCase(),
            Number(stone.carat || 0).toFixed(3),
            stone.color || "—",
            stone.clarity || "—",
            stone.cut || "—",
            stone.polish || "—",
            stone.symmetry || "—",
          ].join(" | ");
          return (
            <article className="comparison-card" key={`compare-${stoneKey}`}>
              <div className="comparison-media">
                <span className="comparison-selected"><Check /></span>
                <Heart className="comparison-heart" />
                {showingVideo ? (
                  videoIsEmbed ? (
                    <iframe
                      key={`${stoneKey}-video-embed`}
                      src={videoPlaybackUrl}
                      title={`${stone.stockId || "Diamond"} video`}
                      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      key={`${stoneKey}-video`}
                      src={videoPlaybackUrl}
                      controls
                      autoPlay
                      playsInline
                      aria-label={`${stone.stockId || "Diamond"} video`}
                    />
                  )
                ) : stone.imagePath ? (
                  <img src={stone.imagePath} alt={`${stone.stockId || "Diamond"} product`} />
                ) : (
                  <div className="comparison-image-placeholder">
                    <Diamond />
                    <span>{stone.shape || "Diamond"}</span>
                  </div>
                )}
                {stone.videoPath && (
                  <button
                    type="button"
                    className="comparison-play"
                    aria-label={showingVideo ? "Show product image" : "Play product video"}
                    title={showingVideo ? "Show image" : "Play video"}
                    onClick={() =>
                      setActiveMedia((current) => ({
                        ...current,
                        [stoneKey]: showingVideo ? "image" : "video",
                      }))
                    }
                  >
                    {showingVideo ? <ImageIcon /> : <Video />}
                  </button>
                )}
              </div>
              <div className="comparison-card-body">
                <h2>{descriptor}</h2>
                <div className="comparison-rule" />
                <div className="comparison-pair">
                  <span>Stone No. {stone.stockId || stone.id}</span>
                  <span>Report No. {stone.certificateNumber || "—"}</span>
                </div>
                <div className="comparison-pair comparison-measurement">
                  <span>Min - Max x H&nbsp; - &nbsp;{stone.measurement || "—"}</span>
                  <em className={`comparison-status ${status}`}>{status === "held" ? "On hold" : status === "sold" ? "Sold" : "Available"}</em>
                </div>
                <p>
                  TD% - {stone.depth ?? "—"}% &nbsp;|&nbsp; TBL - {stone.tablePct ?? "—"} &nbsp;|&nbsp; L:W - {stone.ratio ?? "—"}
                </p>
                <div className="comparison-rule" />
                <strong className="comparison-price">
                  ${money(stone.pricePerCarat)} P/C&nbsp;&nbsp; AMOUNT-${money(stone.totalPrice ?? stone.price)}
                </strong>
                <div className="comparison-links">
                  <button type="button" onClick={() => onOpenStone(stone)}>
                    <Eye /> DETAILS
                  </button>
                  {stone.certificatePath ? (
                    <a href={stone.certificatePath} target="_blank" rel="noreferrer">
                      {stone.lab || "CERTIFICATE"}
                    </a>
                  ) : (
                    <span>{stone.lab || "CERTIFICATE"}</span>
                  )}
                </div>
                <button
                  className="comparison-cart"
                  onClick={() => addToCart(stone)}
                  disabled={status === "held" || status === "sold"}
                >
                  <ShoppingCart /> Add to Cart
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

const gemstoneTypes = ["Sapphire","Emerald","Ruby","Opal","Coral","Cats Eye","Alexandrite","Peridot","Zircon","Iolite","Citrine","Amethyst","Aquamarine","Tanzanite","Spinel","Topaz"];
const gemstoneShapes = ["Round","Square","Emerald","Asscher","Radiant","Oval","Cushion","Heart","Pear","Marquise","Cabochon","Other"];
const gemstoneLabs = ["GIA","IGI","GRS","IIGJ","Other","None"];
const gemColors = {Sapphire:"#174be8",Ruby:"#d41424",Morganite:"#f39aaa",Tanzanite:"#5437d8",Emerald:"#078642",Aquamarine:"#42bce8",Alexandrite:"#0d9c7e",Peridot:"#8ebc42",Amethyst:"#9f24c8",Tourmaline:"#f052a0",Topaz:"#64bceb",Zircon:"#23bec8",Spinel:"#006b8c",Citrine:"#e5ad16",Opal:"#d8cce9",Garnet:"#a91020",Coral:"#ed6b61"};
const gemstoneColorOptions = {
  Sapphire: ["Blue","Yellow","Pink","White","Padparadscha","Green","Purple","Orange","Black","Chameleon","Teal Blue","Green Blue","Other"],
  Ruby: ["Red","Blood Red"],
  Morganite: ["Pink","Peach"],
  Aquamarine: ["Blue","Yellow","White"],
  Alexandrite: ["Color Changing","Not Color Changing"],
  Tourmaline: ["White","Blue","Red","Green","Yellow","Orange","Brown","Pink","Purple","Grey","Black"],
  Topaz: ["White","Blue","Red","Green","Yellow","Pink","Gold"],
  Zircon: ["Blue","Grey","Yellow","Orange","Brown","Red"],
  Spinel: ["White","Blue","Red","Green","Yellow","Pink","Orange","Brown","Purple","Black"],
  Garnet: ["Red","Green","Yellow","Orange","Brown","Pink","Purple","Grey","Black"],
};
const gemstoneColorSwatches = {Blue:"#174be8",Yellow:"#f1cf17",Pink:"#f06aab",White:"#e8edf0",Padparadscha:"#ed9a7d",Green:"#168c45",Purple:"#9a28c2",Orange:"#f47a20",Black:"#181a1c",Chameleon:"#8d8635","Teal Blue":"#27558a","Green Blue":"#42778a",Red:"#da1828","Blood Red":"#86000e",Peach:"#f0a684",Brown:"#87502e",Grey:"#7d8790",Gold:"#d5a11e","Color Changing":"linear-gradient(135deg,#237c9f,#8e38b7,#278b62)","Not Color Changing":"#7c8791",Other:"#aab0bb"};

const newGemstoneFilters = () => ({type:[],color:[],shape:[],minCarat:"",maxCarat:"",lab:[],location:"",minPrice:"",maxPrice:"",priceMode:"total",treatment:"all",origin:"",minLength:"",maxLength:"",minWidth:"",maxWidth:"",minDepth:"",maxDepth:"",minRatio:"",maxRatio:"",stockId:""});

function GemstoneSearchPage() {
  return <>
    <div className="gemstone-mobile-app"><MobileGemstoneSearch /></div>
    <div className="gemstone-desktop-app"><GemstoneDesktopSearch /></div>
  </>;
}

function MobileGemstoneSearch() {
  const [inventory,setInventory]=useState([]);
  const [filters,setFilters]=useState(newGemstoneFilters);
  const [screen,setScreen]=useState("filters");
  const [selectedStone,setSelectedStone]=useState(null);
  const [sort,setSort]=useState("default");
  const [selected,setSelected]=useState([]);
  const [message,setMessage]=useState("");
  const [sortOpen,setSortOpen]=useState(false);
  const [actionOpen,setActionOpen]=useState(false);
  const [comparisonOpen,setComparisonOpen]=useState(false);
  useEffect(()=>{authApi('/api/inventory?category=color_stone').then(d=>setInventory(d.stones)).catch(()=>setInventory([]));},[]);
  const toggle=(key,value)=>setFilters(current=>key==='type'
    ? {...current,type:current.type[0]===value?[]:[value],color:[]}
    : {...current,[key]:current[key].includes(value)?current[key].filter(item=>item!==value):[...current[key],value]});
  const within=(value,min,max)=>(!min||Number(value)>=Number(min))&&(!max||Number(value)<=Number(max));
  const filtered=inventory.filter(stone=>
    (!filters.stockId||String(stone.stockId||'').toLowerCase().includes(filters.stockId.toLowerCase()))&&
    (!filters.type.length||filters.type.includes(stone.gemstoneType))&&
    (!filters.color.length||filters.color.includes(stone.color))&&
    (!filters.shape.length||filters.shape.includes(stone.shape))&&
    within(stone.carat,filters.minCarat,filters.maxCarat)&&
    (!filters.lab.length||filters.lab.includes(stone.lab||'None'))&&
    (!filters.location||String(stone.location||'').toLowerCase().includes(filters.location.toLowerCase()))&&
    (!filters.origin||String(stone.origin||'').toLowerCase().includes(filters.origin.toLowerCase()))&&
    (filters.treatment==='all'||(filters.treatment==='yes'?Boolean(stone.treatment):!stone.treatment))&&
    within(filters.priceMode==='total'?stone.totalPrice:stone.pricePerCarat,filters.minPrice,filters.maxPrice)&&
    within(stone.length,filters.minLength,filters.maxLength)&&within(stone.width,filters.minWidth,filters.maxWidth)&&within(stone.height,filters.minDepth,filters.maxDepth)&&within(stone.ratio,filters.minRatio,filters.maxRatio));
  const results=[...filtered].sort((a,b)=>sort==='priceAsc'?Number(a.totalPrice||0)-Number(b.totalPrice||0):sort==='priceDesc'?Number(b.totalPrice||0)-Number(a.totalPrice||0):sort==='caratAsc'?Number(a.carat||0)-Number(b.carat||0):sort==='caratDesc'?Number(b.carat||0)-Number(a.carat||0):sort==='perCtAsc'?Number(a.pricePerCarat||0)-Number(b.pricePerCarat||0):sort==='perCtDesc'?Number(b.pricePerCarat||0)-Number(a.pricePerCarat||0):String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
  const resultKey=stone=>String(stone.id??stone.stockId);
  const selectedResults=results.filter(stone=>selected.includes(resultKey(stone)));
  const allSelected=results.length>0&&selectedResults.length===results.length;
  const toggleSelected=stone=>setSelected(current=>current.includes(resultKey(stone))?current.filter(item=>item!==resultKey(stone)):[...current,resultKey(stone)]);
  const requireSelected=()=>{const ids=selectedResults.map(stone=>Number(stone.id)).filter(Number.isInteger);if(!ids.length){setMessage('Select at least one product using its carat circle.');return null;}return ids;};
  const enquire=async()=>{const inventoryIds=requireSelected();if(!inventoryIds)return;try{const result=await authApi('/api/enquiries-bulk',{method:'POST',body:JSON.stringify({inventoryIds})});setMessage(result.message);setSelected([]);setActionOpen(false);}catch(error){setMessage(error.message);}};
  const addToCart=async()=>{const ids=requireSelected();if(!ids)return;try{await Promise.all(ids.map(id=>authApi(`/api/cart/${id}`,{method:'POST'})));refreshCommerce();setMessage(`${ids.length} selected product${ids.length===1?'':'s'} added to your basket.`);setActionOpen(false);}catch(error){setMessage(error.message);}};
  const placeOrder=async()=>{const inventoryIds=requireSelected();if(!inventoryIds)return;try{await Promise.all(inventoryIds.map(id=>authApi(`/api/cart/${id}`,{method:'POST'})));const result=await authApi('/api/orders',{method:'POST',body:JSON.stringify({inventoryIds})});refreshCommerce();setSelected([]);setActionOpen(false);setMessage(`${result.orderNumber} placed and awaiting admin approval.`);}catch(error){setMessage(error.message);}};
  const favourite=async()=>{const ids=requireSelected();if(!ids)return;try{await Promise.all(ids.map(id=>authApi(`/api/favourites/${id}`,{method:'POST'})));refreshCommerce();setMessage(`${ids.length} selected product${ids.length===1?'':'s'} added to Favourites.`);setActionOpen(false);}catch(error){setMessage(error.message);}};
  const compare=()=>{if(selectedResults.length<2)return setMessage('Select at least two products to compare.');setComparisonOpen(true);setActionOpen(false);};
  const share=async()=>{if(!selectedResults.length)return setMessage('Select at least one product first.');const text=selectedResults.map(stone=>stone.stockId||stone.id).join(', ');try{if(navigator.share)await navigator.share({title:'GemFlow selected gemstones',text});else{await navigator.clipboard.writeText(text);setMessage('Selected Stock IDs copied.');}setActionOpen(false);}catch(error){if(error.name!=='AbortError')setMessage('Unable to share the selected products.');}};
  const download=async()=>{if(!selectedResults.length)return setMessage('Select at least one product using its carat circle.');const workbook=new ExcelJS.Workbook();const sheet=workbook.addWorksheet('Selected gemstones');sheet.columns=[["Stock ID","stockId"],["Gemstone Type","gemstoneType"],["Shape","shape"],["Carat","carat"],["Color","color"],["Lab","lab"],["Report Number","certificateNumber"],["Origin","origin"],["Measurement","measurement"],["Treatment","treatment"],["Ratio","ratio"],["Location","location"],["Price / Carat","pricePerCarat"],["Total Price","totalPrice"]].map(([header,key])=>({header,key,width:Math.max(14,header.length+3)}));selectedResults.forEach(stone=>sheet.addRow(stone));sheet.getRow(1).font={bold:true,color:{argb:'FFFFFFFF'}};sheet.getRow(1).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF287F9D'}};const buffer=await workbook.xlsx.writeBuffer();const url=URL.createObjectURL(new Blob([buffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));const link=document.createElement('a');link.href=url;link.download=`gemflow-selected-color-stones-${new Date().toISOString().slice(0,10)}.xlsx`;link.click();URL.revokeObjectURL(url);};
  const totals=results.reduce((sum,stone)=>({carat:sum.carat+Number(stone.carat||0),price:sum.price+Number(stone.pricePerCarat||0),amount:sum.amount+Number(stone.totalPrice||0)}),{carat:0,price:0,amount:0});
  const averageDiscount=results.length
    ? results.reduce((sum,stone)=>sum+Number(stone.discountPct??stone.discount??0),0)/results.length
    : 0;
  if(selectedStone)return <StoneDetail stone={selectedStone} onBack={()=>setSelectedStone(null)}/>;
  if(comparisonOpen)return <DiamondComparisonPage stones={selectedResults} onBack={()=>setComparisonOpen(false)} onOpenStone={stone=>{setComparisonOpen(false);setSelectedStone(stone);}}/>;
  const range=(title,minKey,maxKey,unit='')=><div className="mobile-gem-range"><h3>{title}</h3><div><input type="number" placeholder={`Min${unit}`} value={filters[minKey]} onChange={event=>setFilters({...filters,[minKey]:event.target.value})}/><ChevronRight/><input type="number" placeholder={`Max${unit}`} value={filters[maxKey]} onChange={event=>setFilters({...filters,[maxKey]:event.target.value})}/></div></div>;
  const iconGrid=(items,key,gem=false)=><div className="mobile-gem-icon-grid">{items.map(value=><button type="button" key={value} className={filters[key].includes(value)?'selected':''} onClick={()=>toggle(key,value)}>{gem?<span className="gemstone-orb" style={{background:gemColors[value]||gemstoneColorSwatches[value]||'#aab0bb'}}/>:<ShapeIcon shape={value}/>}<span>{value}</span></button>)}</div>;
  if(screen==='results')return <section className="mobile-gem-results diamond-style-results diamond-search-page results-active">
    <div className="mobile-result-chrome color-result-chrome">
      <div className="mobile-result-toolbar">
        <button className="mobile-result-back" onClick={()=>setScreen('filters')}><ArrowLeft/><strong>Result</strong></button>
        <div className="mobile-result-tools">
          <button className="mobile-modify-filters" onClick={()=>setScreen('filters')}>Modify</button>
          <button className={allSelected?'selected':''} aria-label="Select all filtered gemstones" onClick={()=>setSelected(allSelected?[]:results.map(resultKey))}><CheckCircle2/></button>
          <button aria-label="Inventory card view" className="mobile-grid-symbol">▦</button>
          <button aria-label="Sort inventory" onClick={()=>setSortOpen(true)}><SlidersHorizontal/></button>
          <button aria-label="Download selected inventory" onClick={download}><Download/></button>
        </div>
      </div>
      <div className="mobile-result-summary">
        <div><strong>{results.length}</strong><span>Pcs</span></div>
        <div><strong>{totals.carat.toFixed(2)}</strong><span>Cts</span></div>
        <div><strong>{averageDiscount.toFixed(2)}%</strong><span>Disc %</span></div>
        <div><strong>{results.length?Math.round(totals.price/results.length).toLocaleString():0}</strong><span>Price $</span></div>
        <div><strong>{Math.round(totals.amount).toLocaleString()}</strong><span>Amount $</span></div>
      </div>
    </div>
    {message&&<div className="mobile-gem-message color-result-message">{message}</div>}
    <div className="diamond-mobile-results color-diamond-results">
      {results.map(stone=><article className={`mobile-stone-card ${inventoryRowClass(stone)}`} key={`color-mobile-${resultKey(stone)}`} onClick={()=>setSelectedStone(stone)} role="button" tabIndex={0}>
        <div className="mobile-stone-main">
          <button className={`mobile-carat ${selected.includes(resultKey(stone))?'selected':''}`} aria-pressed={selected.includes(resultKey(stone))} aria-label={`Select ${stone.stockId}`} onClick={event=>{event.stopPropagation();toggleSelected(stone);}}><strong>{Number(stone.carat||0).toFixed(2)}</strong><span>Carat</span></button>
          <div className="mobile-stone-data">
            <div className="mobile-stone-topline"><strong>{stone.stockId||stone.id}</strong><span>{stone.shape||'—'}</span><span>{stone.color||'—'}</span><b>${Number(stone.pricePerCarat||0).toLocaleString()} <small>/Ct</small></b></div>
            <div className="mobile-stone-bottomline"><strong>{[stone.gemstoneType,stone.treatment,stone.origin,stone.lab].filter(Boolean).join(' · ')||'Colored gemstone'}</strong><span>{stone.measurement||stone.location||'—'}</span><b>${Number(stone.totalPrice||0).toLocaleString()}</b></div>
          </div>
        </div>
      </article>)}
      {!results.length&&<div className="no-diamonds"><Gem/><h3>No colored gemstones match these filters</h3><button onClick={()=>setFilters(newGemstoneFilters())}>Reset all filters</button></div>}
    </div>
    <nav className="mobile-result-bottom-nav" aria-label="Inventory actions">
      <button onClick={enquire}><MessageCircle/><span>Enquiry</span></button>
      <button onClick={compare}><Diamond/><span>Compare</span></button>
      <button className={`mobile-result-plus ${actionOpen?'open':''}`} aria-label={actionOpen?'Close selection actions':'Open selection actions'} onClick={()=>setActionOpen(open=>!open)}>{actionOpen?'×':'+'}</button>
      <button onClick={placeOrder}><ShoppingCart/><span>Place Order</span></button>
      <button><Users/><span>Status</span></button>
    </nav>
    {actionOpen&&<div className="mobile-selection-overlay" onClick={()=>setActionOpen(false)}><div className="mobile-selection-menu" role="dialog" aria-modal="true" aria-label="Selected gemstone actions" onClick={event=>event.stopPropagation()}>
      <button onClick={enquire}><MessageCircle/><span>Enquiry</span></button>
      <button onClick={placeOrder}><ShoppingCart/><span>Place Order</span></button>
      <button onClick={addToCart}><ShoppingCart/><span>Add to Cart</span></button>
      <button onClick={favourite}><Star/><span>Favourites</span></button>
      <button onClick={compare}><Diamond/><span>Add to Compare</span></button>
      <button onClick={share}><Share2/><span>Share</span></button>
      <button onClick={()=>{setSelected([]);setActionOpen(false);}}><X/><span>Clear Selection</span></button>
      <button onClick={()=>{download();setActionOpen(false);}}><Download/><span>Download</span></button>
    </div></div>}
    {sortOpen&&<div className="mobile-sort-overlay" onClick={()=>setSortOpen(false)}><div className="mobile-sort-sheet" role="dialog" aria-modal="true" aria-label="Sort colored gemstone inventory" onClick={event=>event.stopPropagation()}>
      <div className="mobile-sort-sheet-head"><strong>Sort inventory</strong><button onClick={()=>setSortOpen(false)}>×</button></div>
      {[["priceAsc","↑","Low to High $"],["priceDesc","↓","High to Low $"],["default","↕","Default"],["caratAsc","↑","Low to High Size"],["caratDesc","↓","High to Low Size"],["perCtAsc","↑","Low to High $/Ct"],["perCtDesc","↓","High to Low $/Ct"]].map(([value,arrow,label])=><button key={value} className={sort===value?'selected':''} onClick={()=>{setSort(value);setSortOpen(false);}}><span>{arrow}</span><strong>{label}</strong></button>)}
    </div></div>}
  </section>;
  return <section className="mobile-gem-filters">
    <header><h1>Colored Gemstones Filters</h1></header>
    <div className="mobile-gem-scroll">
      <div className="mobile-gem-filter-card"><div className="mobile-gem-filter-title"><h3>Type</h3>{filters.type[0]&&<span>Selected: <b>{filters.type[0]}</b></span>}</div>{iconGrid(gemstoneTypes,'type',true)}</div>
      {gemstoneColorOptions[filters.type[0]]&&<div className="mobile-gem-filter-card"><h3>Colors</h3>{iconGrid(gemstoneColorOptions[filters.type[0]],'color',true,8)}</div>}
      <div className="mobile-gem-filter-card"><h3>Shape</h3>{iconGrid(gemstoneShapes,'shape',false)}</div>
      <div className="mobile-gem-filter-card mobile-gem-carat-card"><h3>Carat</h3><div className="carat-control-stack"><div className="carat-inputs"><input type="number" min="0" step="0.01" placeholder="Min carat" value={filters.minCarat} onChange={event=>setFilters({...filters,minCarat:event.target.value})}/><span>to</span><input type="number" min="0" step="0.01" placeholder="Max carat" value={filters.maxCarat} onChange={event=>setFilters({...filters,maxCarat:event.target.value})}/></div><div className="carat-presets option-buttons">{[["All","",""],["30s Down","0","0.39"],["30s","0.30","0.39"],["40s","0.40","0.49"],["50s - 60s","0.50","0.69"],["70s - 80s","0.70","0.89"],["90s","0.90","0.99"],["1ct","1","1.49"],["1.5ct","1.5","1.99"],["2ct","2","2.99"],["3ct - 4ct","3","4.99"],["5ct +","5",""]].map(([label,min,max])=><button key={label} className={filters.minCarat===min&&filters.maxCarat===max?'selected':''} onClick={()=>setFilters({...filters,minCarat:min,maxCarat:max})}>{label}</button>)}</div></div></div>
      <div className="mobile-gem-filter-card"><h3>Measurements</h3>{range('Length','minLength','maxLength')}{range('Width','minWidth','maxWidth')}{range('Depth','minDepth','maxDepth')}</div>
      <div className="mobile-gem-filter-card"><h3>Lab</h3><div className="mobile-gem-text-grid">{gemstoneLabs.map(value=><button className={filters.lab.includes(value)?'selected':''} onClick={()=>toggle('lab',value)}>{value}</button>)}</div></div>
      <div className="mobile-gem-filter-card mobile-gem-search-fields"><label><MapPin/><input placeholder="Search by Location" value={filters.location} onChange={event=>setFilters({...filters,location:event.target.value})}/></label></div>
      <div className="mobile-gem-filter-card"><div className="price-tabs"><button className={filters.priceMode==='total'?'selected':''} onClick={()=>setFilters({...filters,priceMode:'total'})}>Total Price</button><button className={filters.priceMode==='perct'?'selected':''} onClick={()=>setFilters({...filters,priceMode:'perct'})}>P/ct</button></div>{range('Price','minPrice','maxPrice',', $')}</div>
      <div className="mobile-gem-filter-card"><h3>Treatment</h3><div className="mobile-gem-text-grid">{['all','yes','no'].map(value=><button className={filters.treatment===value?'selected':''} onClick={()=>setFilters({...filters,treatment:value})}>{value==='all'?'All':value==='yes'?'Treated':'Untreated'}</button>)}</div></div>
    </div>
    <footer><button onClick={()=>setFilters(newGemstoneFilters())}>Reset All</button><button onClick={()=>setScreen('results')}>Apply Filters <span>{filtered.length}</span></button></footer>
  </section>;
}

function GemstoneDesktopSearch() {
  const [inventory,setInventory]=useState([]); const [selectedStone,setSelectedStone]=useState(null);
  const [searched,setSearched]=useState(false);
  const [f,setF]=useState({type:[],color:[],shape:[],minCarat:"",maxCarat:"",lab:[],location:"",minPrice:"",maxPrice:"",priceMode:"total",treatment:"all",origin:"",minLength:"",maxLength:"",minWidth:"",maxWidth:"",minDepth:"",maxDepth:"",minRatio:"",maxRatio:"",stockId:""});
  useEffect(()=>{authApi('/api/inventory?category=color_stone').then(d=>setInventory(d.stones)).catch(()=>setInventory([]));},[]);
  const toggle=(key,v)=>setF(current=>key==='type'
    ? {...current,type:current.type[0]===v?[]:[v],color:[]}
    : {...current,[key]:current[key].includes(v)?current[key].filter(x=>x!==v):[...current[key],v]});
  const within=(v,min,max)=> (!min||Number(v)>=Number(min))&&(!max||Number(v)<=Number(max));
  const results=inventory.filter(s=>(!f.stockId||String(s.stockId).toLowerCase().includes(f.stockId.toLowerCase()))&&(!f.type.length||f.type.includes(s.gemstoneType))&&(!f.color.length||f.color.includes(s.color))&&(!f.shape.length||f.shape.includes(s.shape))&&within(s.carat,f.minCarat,f.maxCarat)&&(!f.lab.length||f.lab.includes(s.lab||'None'))&&(!f.location||String(s.location||'').toLowerCase().includes(f.location.toLowerCase()))&&(!f.origin||String(s.origin||'').toLowerCase().includes(f.origin.toLowerCase()))&&(f.treatment==='all'||(f.treatment==='yes'?!!s.treatment:!s.treatment))&&within(f.priceMode==='total'?s.totalPrice:s.pricePerCarat,f.minPrice,f.maxPrice)&&within(s.length,f.minLength,f.maxLength)&&within(s.width,f.minWidth,f.maxWidth)&&within(s.height,f.minDepth,f.maxDepth)&&within(s.ratio,f.minRatio,f.maxRatio));
  if(selectedStone) return <StoneDetail stone={selectedStone} onBack={()=>setSelectedStone(null)}/>;
  if(searched) return <section className="gemstone-search-page gemstone-desktop-results-page">
    <div className="gemstone-search-head gemstone-results-head"><div><Gem/><span><strong>COLORED GEMSTONES INVENTORY</strong></span></div><div className="gemstone-desktop-search-actions"><span className="gemstone-result-count">{results.length} Stones Found</span><button className="gemstone-search-button gemstone-modify-button" onClick={()=>setSearched(false)}><SlidersHorizontal/> Modify</button></div></div>
    <div className="gemstone-desktop-results"><CommerceTable stones={results} action="cartOrder" onView={setSelectedStone}/></div>
  </section>;
  const chipGroup=(title,items,key,gem=false)=><div className="gem-filter-card"><h3>{title}</h3><div className="gem-chip-grid">{items.map(v=><button key={v} className={f[key].includes(v)?'selected':''} onClick={()=>toggle(key,v)}>{gem&&<span className="gemstone-orb" style={{background:gemColors[v]||'#aab0bb'}}/>}{!gem&&key==='shape'&&<ShapeIcon shape={v}/>}<span>{v}</span></button>)}</div></div>;
  return <section className="gemstone-search-page">
    <div className="gemstone-search-head"><div><Gem/><span><strong>COLORED GEMSTONES</strong></span></div><div className="gemstone-desktop-search-actions"><span className="gemstone-result-count">{results.length} Stones Found</span><button className="gemstone-search-button" onClick={()=>setSearched(true)}><Search/> Search Inventory</button></div></div>
    <label className="stock-search gemstone-stock-search"><Search/><input placeholder="Search complete or partial Stock ID" value={f.stockId} onChange={e=>setF({...f,stockId:e.target.value})}/></label>
    {chipGroup('TYPE',gemstoneTypes,'type',true)}
    {gemstoneColorOptions[f.type[0]] && <div className="gem-filter-card gemstone-color-card"><div className="gem-filter-title-row"><h3>COLORS</h3><span>Selected: <strong>{f.type[0]}</strong></span></div><div className="gem-chip-grid">{gemstoneColorOptions[f.type[0]].map(v=><button key={v} className={f.color.includes(v)?'selected':''} onClick={()=>toggle('color',v)}><span className="gemstone-orb" style={{background:gemstoneColorSwatches[v]}}/><span>{v}</span></button>)}</div></div>}
    {chipGroup('SHAPE',gemstoneShapes,'shape')}
    <div className="gem-filter-card"><h3>CARAT</h3><div className="gem-range"><input type="number" placeholder="Min, ct" value={f.minCarat} onChange={e=>setF({...f,minCarat:e.target.value})}/><span>to</span><input type="number" placeholder="Max, ct" value={f.maxCarat} onChange={e=>setF({...f,maxCarat:e.target.value})}/>{[[.3,.39],[.4,.49],[.5,.69],[.7,.89],[.9,.99],[1,1.49],[1.5,1.99],[2,2.99],[3,3.99],[4,4.99],[5,5.99],[6,7.99],[8,9.99],[10,'']].map(([a,b])=><button key={a} onClick={()=>setF({...f,minCarat:a,maxCarat:b})}>{a}{b?`-${b}`:'+'}</button>)}</div></div>
    {chipGroup('LAB',gemstoneLabs,'lab')}
    <div className="gem-filter-two"><div className="gem-filter-card"><h3>LOCATION</h3><select value={f.location} onChange={e=>setF({...f,location:e.target.value})}><option value="">Select location</option>{["Mumbai","Surat","Delhi"].map(v=><option key={v} value={v}>{v}</option>)}</select></div><div className="gem-filter-card"><h3>ORIGIN</h3><input placeholder="Search by Origin" value={f.origin} onChange={e=>setF({...f,origin:e.target.value})}/></div></div>
    <div className="gem-filter-card"><div className="price-tabs"><button className={f.priceMode==='total'?'selected':''} onClick={()=>setF({...f,priceMode:'total'})}>Total Price</button><button className={f.priceMode==='perct'?'selected':''} onClick={()=>setF({...f,priceMode:'perct'})}>P/ct</button></div><div className="gem-range"><input type="number" placeholder="Min, $" value={f.minPrice} onChange={e=>setF({...f,minPrice:e.target.value})}/><span>to</span><input type="number" placeholder="Max, $" value={f.maxPrice} onChange={e=>setF({...f,maxPrice:e.target.value})}/></div></div>
    <div className="gem-filter-two"><div className="gem-filter-card"><h3>TREATMENT</h3><div className="treatment-options">{['all','yes','no'].map(v=><button className={f.treatment===v?'selected':''} onClick={()=>setF({...f,treatment:v})}>{v.toUpperCase()}</button>)}</div></div><div className="gem-filter-card"><h3>MEASUREMENTS</h3><div className="measurement-grid">{[['Length','minLength','maxLength'],['Width','minWidth','maxWidth'],['Depth','minDepth','maxDepth'],['Ratio','minRatio','maxRatio']].map(([l,a,b])=><label><span>{l}</span><input placeholder="Min" value={f[a]} onChange={e=>setF({...f,[a]:e.target.value})}/><input placeholder="Max" value={f[b]} onChange={e=>setF({...f,[b]:e.target.value})}/></label>)}</div></div></div>
  </section>;
}

function StoneDetail({ stone, onBack }) {
  const [media, setMedia] = useState(stone.openCertificate ? "certificate" : "image");
  const [cartMessage, setCartMessage] = useState("");
  const addToBasket = async () => {
    try {
      if (!Number.isInteger(Number(stone.id)))
        throw new Error(
          "This demonstration stone must first be added through Admin Inventory.",
        );
      await authApi(`/api/cart/${stone.id}`, { method: "POST" });
      setCartMessage("Added to your basket.");
      refreshCommerce();
    } catch (error) {
      setCartMessage(error.message);
    }
  };
  const orderNow = async () => {
    try {
      if (!Number.isInteger(Number(stone.id)))
        throw new Error(
          "This demonstration stone must first be added through Admin Inventory.",
        );
      await authApi(`/api/cart/${stone.id}`, { method: "POST" });
      const result = await authApi("/api/orders", {
        method: "POST",
        body: JSON.stringify({ inventoryIds: [stone.id] }),
      });
      setCartMessage(
        `${result.orderNumber} placed and awaiting admin approval.`,
      );
      refreshCommerce();
    } catch (error) {
      setCartMessage(error.message);
    }
  };
  const requestHold = async () => {
    try {
      const result = await authApi(`/api/enquiries/${stone.id}`, { method: "POST" });
      setCartMessage(result.message);
      refreshCommerce();
    } catch (error) {
      setCartMessage(error.message);
    }
  };
  const addFavourite = async () => {
    try {
      const result = await authApi(`/api/favourites/${stone.id}`, { method: "POST" });
      setCartMessage(result.message);
      refreshCommerce();
    } catch (error) {
      setCartMessage(error.message);
    }
  };
  const mediaItems = [
    { key: "image", label: "Image", icon: ImageIcon, path: stone.imagePath },
    { key: "video", label: "Video", icon: Video, path: stone.videoPath },
    {
      key: "inHandVideo",
      label: "In-hand Video",
      icon: Video,
      path: stone.inHandVideoPath,
    },
    {
      key: "certificate",
      label: "Certi",
      icon: FileText,
      path: stone.certificatePath,
    },
  ];
  const current = mediaItems.find((item) => item.key === media);
  const certificateIsPdf =
    media === "certificate" &&
    String(current.path || "")
      .split(/[?#]/)[0]
      .toLowerCase()
      .endsWith(".pdf");
  const offerText = `Hello GemFlow, I would like to make an offer for Stone ${stone.stockId || stone.id} (${stone.shape || ""}, ${stone.carat || ""} ct, ${stone.color || ""} ${stone.clarity || ""}, ${stone.lab || ""}, Certificate ${stone.certificateNumber || "N/A"}, listed total $${Number(stone.totalPrice || stone.price || 0).toLocaleString()}). Please share your best offer.`;
  const whatsappUrl = `https://wa.me/918447630530?text=${encodeURIComponent(offerText)}`;
  const value = (key, fallback = "—") => stone[key] ?? fallback;
  const isColorStone = stone.category === "color_stone";
  const colorStoneDetails = [
    ["TYPE", "gemstoneType"], ["LAB", "lab"], ["COLOR", "color"],
    ["REPORT", "certificateNumber"], ["SHAPE", "shape"], ["ORIGIN", "origin"],
    ["CARAT", "carat"], ["MEASUREMENT", "measurement"], ["TREATMENT", "treatment"],
    ["RATIO", "ratio"], ["LOCATION", "location"], ["SUPPLIER", "supplier"],
    ["ITEM KIND", "isPair"], ["TREATMENT NOTES", "treatmentNotes"],
  ];
  const specs1 = [
    ["CUT", "cut"],
    ["POLISH", "polish"],
    ["SYMMETRY", "symmetry"],
    ["FLUORESCENCE", "fluorescence"],
    ["SHADE", "shade"],
    ["EYE CLEAN (%)", "eyeClean"],
  ];
  const specs2 = [
    ["MEASUREMENT", "measurement"],
    ["TABLE (%)", "tablePct"],
    ["DEPTH (%)", "depth"],
    ["RATIO", "ratio"],
    ["GIRDLE", "girdle"],
    ["PV. ANGLE", "pavilionAngle"],
    ["PV. HEIGHT", "pavilionHeight"],
    ["CR. ANGLE", "crownAngle"],
    ["CR. HEIGHT", "crownHeight"],
    ["CULET", "culet"],
    ["STAR LENGTH", "starLength"],
    ["LOWER HALF", "lowerHalf"],
    ["EXTRA FACET", "extraFacet"],
  ];
  const specs3 = [
    ["LOCATION", "location"],
    ["TABLE INC", "tableInclusion"],
    ["TABLE SIDE INC", "tableSideInclusion"],
    ["TABLE SIDE BLACK", "tableSideBlack"],
    ["TABLE BLACK", "tableBlack"],
    ["TABLE OPEN", "tableOpen"],
    ["SIDE INC", "sideInclusion"],
    ["SIDE BLACK", "sideBlack"],
    ["SIDE OPEN", "sideOpen"],
    ["H&A", "heartsArrows"],
    ["LUSTER", "luster"],
    ["NATURAL", "naturalComment"],
  ];
  return (
    <section className="stone-detail-page">
      <button className="back-inventory" onClick={onBack}>
        <ArrowLeft /> Back to inventory
      </button>
      <div className="stone-detail-title">
        <Diamond />
        <h1>{isColorStone ? "COLOR STONE DETAIL" : "STONE DETAIL"}</h1>
        <div className="stone-detail-actions">
          <button className="add-basket-detail" onClick={addToBasket} disabled={stone.availabilityStatus === "held"}><ShoppingCart /> Add to basket</button>
          <button className="place-order-detail" onClick={orderNow} disabled={stone.availabilityStatus === "held"}><Package /> Place order now</button>
          <button className="hold-detail" onClick={requestHold} disabled={stone.availabilityStatus === "held"}><LockKeyhole /> {stone.availabilityStatus === "held" ? "On hold" : "Hold"}</button>
          <button className="favourite-detail" onClick={addFavourite}><Star /> Favourite</button>
          <a className="make-offer-detail" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle /> Make offer</a>
        </div>
      </div>
      {cartMessage && <div className="commerce-message">{cartMessage}</div>}
      {!isColorStone && <div className="mobile-stone-summary">
        <div className="mobile-carat"><strong>{Number(stone.carat || 0).toFixed(2)}</strong><span>Carat</span></div>
        <div className="mobile-stone-data">
          <div className="mobile-stone-topline"><strong>{stone.stockId}</strong><span>{stone.shape || "—"}</span><span>{stone.discount == null ? "—" : `${stone.discount}%`}</span><b>${Number(stone.pricePerCarat || 0).toLocaleString()} <small>/Ct</small></b></div>
          <div className="mobile-stone-bottomline"><strong>{[stone.color, stone.clarity, stone.cut, stone.polish, stone.symmetry, stone.fluorescence, stone.lab].filter(Boolean).join(" · ")}</strong><span>{stone.measurement || "—"}</span><b>${Number(stone.totalPrice || 0).toLocaleString()}</b></div>
        </div>
      </div>}
      <div className="stone-detail-layout">
        <div className="stone-spec-area">
          {isColorStone ? (
            <div className="color-product-details">
              <div className="color-product-heading"><Gem/><div><small>PRODUCT DETAILS</small><h2>{stone.gemstoneType || "Colored gemstone"}</h2><span>{stone.stockId}</span></div></div>
              <div className="color-product-grid">{colorStoneDetails.map(([label,key])=><Spec key={key} label={label} value={key === "isPair" ? (Number(stone.isPair) ? "Pair" : "Single stone") : value(key)} />)}</div>
            </div>
          ) : <><div className="stone-summary">
            <Summary
              label={stone.shape}
              value={`${Number(stone.carat).toFixed(2)} CT`}
            />
            <Summary label={stone.stockId || stone.id} value="STOCK ID" />
            <Summary label={stone.color} value={stone.clarity} />
            <Summary
              label={`$${Number(stone.pricePerCarat ?? 0).toLocaleString()} /CT`}
              value={`${stone.discount ?? 0}%`}
            />
            <Summary
              label={stone.lab}
              value={stone.certificateNumber || "NO CERTIFICATE"}
            />
          </div>
          <div className="spec-strip">
            {specs1.map(([label, key]) => (
              <Spec key={key} label={label} value={value(key)} />
            ))}
          </div>
          <div className="technical-specs">
            <div>
              {specs2.map(([label, key]) => (
                <Spec key={key} label={label} value={value(key)} />
              ))}
            </div>
            <div>
              {specs3.map(([label, key]) => (
                <Spec key={key} label={label} value={value(key)} />
              ))}
            </div>
          </div>
          </>}
        </div>
        <div className="stone-media-card">
          <div className="media-stage">
            {!current.path ? (
              <div className="media-placeholder">
                <current.icon />
                <h3>No {current.label.toLowerCase()} uploaded</h3>
                <p>The admin can add this file from Inventory Upload.</p>
              </div>
            ) : media === "image" ? (
              <img src={current.path} alt={`${stone.stockId} diamond`} />
            ) : media === "certificate" && certificateIsPdf ? (
              <iframe
                className="certificate-frame"
                src={`${current.path}#view=Fit&zoom=page-fit`}
                title="Certificate"
              ></iframe>
            ) : media === "certificate" ? (
              <img
                className="certificate-image"
                src={current.path}
                alt={`${stone.stockId} certificate`}
              />
            ) : (
              <video src={current.path} controls />
            )}
          </div>
          <div className="media-tabs">
            {mediaItems.map((item) => (
              <button
                key={item.key}
                className={media === item.key ? "active" : ""}
                onClick={() => setMedia(item.key)}
              >
                <item.icon />
                {item.label}
              </button>
            ))}
          </div>
          {current.path ? (
            <a className="download-media" href={current.path} download>
              <Download /> Download {current.label}
            </a>
          ) : (
            <button className="download-media disabled" disabled>
              <Download /> File unavailable
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
function Summary({ label, value }) {
  return (
    <div>
      <strong>{label || "—"}</strong>
      <span>{value || "—"}</span>
    </div>
  );
}
function Spec({ label, value }) {
  return (
    <div className="stone-spec">
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  );
}
function startFilterSliderDrag(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  const track = event.currentTarget;
  track.dataset.sliderStartX = String(event.clientX);
  track.dataset.sliderStartScroll = String(track.scrollLeft);
  track.dataset.sliderDragged = "false";
  track.setPointerCapture?.(event.pointerId);
}
function moveFilterSliderDrag(event) {
  const track = event.currentTarget;
  if (track.dataset.sliderStartX == null) return;
  const delta = event.clientX - Number(track.dataset.sliderStartX);
  if (Math.abs(delta) > 4) track.dataset.sliderDragged = "true";
  track.scrollLeft = Number(track.dataset.sliderStartScroll || 0) - delta;
}
function endFilterSliderDrag(event) {
  const track = event.currentTarget;
  delete track.dataset.sliderStartX;
  delete track.dataset.sliderStartScroll;
  if (track.hasPointerCapture?.(event.pointerId)) track.releasePointerCapture(event.pointerId);
}
function stopFilterSliderClickAfterDrag(event) {
  const track = event.currentTarget;
  if (track.dataset.sliderDragged !== "true") return;
  event.preventDefault();
  event.stopPropagation();
  track.dataset.sliderDragged = "false";
}
function FilterRow({ label, mobileLabel, mobileSlider, children, wide }) {
  const moveSlider = (event, direction) => {
    const track = event.currentTarget
      .closest(".diamond-filter-row")
      ?.querySelector(".shape-filter-scroll, .option-buttons");
    track?.scrollBy({ left: direction * Math.max(140, track.clientWidth * 0.72), behavior: "smooth" });
  };
  return (
    <div className={`diamond-filter-row ${wide ? "wide" : ""} ${mobileSlider ? "mobile-slider-filter" : ""}`}>
      <strong>
        <span className="desktop-filter-label">{label}</span>
        {mobileLabel && <span className="mobile-filter-label">{mobileLabel}</span>}
      </strong>
      {mobileSlider && <div className="mobile-slider-controls" aria-label={`${mobileLabel || label} slider controls`}>
        <button type="button" aria-label={`Previous ${mobileLabel || label} options`} onClick={(event) => moveSlider(event, -1)}>‹</button>
        <button type="button" aria-label={`Next ${mobileLabel || label} options`} onClick={(event) => moveSlider(event, 1)}>›</button>
      </div>}
      <div>{children}</div>
    </div>
  );
}
function OptionFilter({ label, mobileLabel, mobileSlider, filterKey, options, filters, toggle }) {
  return (
    <FilterRow label={label} mobileLabel={mobileLabel} mobileSlider={mobileSlider}>
      <div
        className="option-buttons"
        onPointerDown={mobileSlider ? startFilterSliderDrag : undefined}
        onPointerMove={mobileSlider ? moveFilterSliderDrag : undefined}
        onPointerUp={mobileSlider ? endFilterSliderDrag : undefined}
        onPointerCancel={mobileSlider ? endFilterSliderDrag : undefined}
        onClickCapture={mobileSlider ? stopFilterSliderClickAfterDrag : undefined}
      >
        <button
          className={!filters[filterKey].length ? "selected" : ""}
          onClick={() =>
            filters[filterKey].length &&
            options.forEach(
              (value) =>
                filters[filterKey].includes(value) && toggle(filterKey, value),
            )
          }
        >
          All
        </button>
        {options.map((value) => (
          <button
            key={value}
            className={filters[filterKey].includes(value) ? "selected" : ""}
            onClick={() => toggle(filterKey, value)}
          >
            {value}
          </button>
        ))}
      </div>
    </FilterRow>
  );
}

function Stat({ title, value, icon, extra, onClick }) {
  return (
    <button
      className={`stat-card ${onClick ? "clickable" : ""}`}
      onClick={onClick}
    >
      <div className="stat-copy">
        <small>{title}</small>
        <strong>{value}</strong>
        {extra && <div className="stat-extra">{extra}</div>}
      </div>
      <div className="stat-icon">{icon}</div>
    </button>
  );
}
function Quick({ title, value, icon, onClick }) {
  return (
    <button className="quick-card" onClick={onClick}>
      <div>
        <small>{title}</small>
        {value && <strong>{value}</strong>}
      </div>
      <span className="quick-icon">{icon}</span>
    </button>
  );
}
function PanelHeader({ title, action }) {
  return (
    <div className="panel-title">
      <h3>{title}</h3>
      <button>{action}</button>
    </div>
  );
}
function StoneCard({ stone }) {
  return (
    <div className="stone-card">
      <div className={`stone-photo ${stone.tone}`}>
        <div className="diamond-art small">
          <div className="diamond-core"></div>
        </div>
        <button className="heart">
          <Star size={16} />
        </button>
      </div>
      <div className="stone-info">
        <div>
          <a>{stone.id}</a>
          <b>
            {stone.shape} {stone.carat} CT
          </b>
          <span>
            {stone.color} • {stone.grade}
          </span>
        </div>
        <strong>{stone.price}</strong>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<Root />);

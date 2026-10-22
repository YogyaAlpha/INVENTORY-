# GemFlow Dashboard

## Revision 25 additions

- Mobile inventory results now use compact, tap-friendly stone cards showing carat, Stock ID, shape, discount, price per carat, grading details, measurement and total price without horizontal scrolling.
- Mobile diamond details now follow a media-first layout with a compact summary, tabbed media viewer and persistent action dock.
- Enquiry cards now expose a clearly styled Delete enquiry action, backed by the existing safe delete and held-stone release behavior.
- Added smooth card, media and page transitions while retaining the full desktop tables and technical layouts.

## Revision 24 additions

- Added a full responsive containment pass across the customer website and administrator panel.
- Rebuilt the Colored Gemstones type, color, shape, carat, price, treatment and measurement controls into touch-friendly phone and tablet layouts.
- Wide inventory, user and order tables now remain inside independently scrollable containers instead of shrinking or widening the entire page.
- Improved mobile headers, navigation, product details, media panels, account forms, inventory uploads and administrator controls for 360px, phone, tablet and desktop widths.

## Revision 23 additions

- Added separate `.xlsx` bulk-import templates for Natural Diamonds and Lab-Grown Diamonds.
- Each workbook includes the complete supported diamond field set, category-specific examples and laboratory dropdowns, and Image, Video, In-Hand Video, and Certificate URL columns.
- Admin Inventory now downloads the correct workbook for the selected inventory category.

## Revision 22 addition

- Admin Inventory now downloads a dedicated `.xlsx` color-stone template whenever Color Stone is selected.
- The color-stone workbook contains only relevant product, pricing, and media URL fields, plus validation dropdowns and an Instructions sheet.

## Revision 21 additions

- Spacious, balanced colored-stone product detail layout with clearer information cards.
- Simplified colored-gemstone search header.
- Improved admin inventory category contrast in dark mode.
- Admin enquiry deletion, including automatic release when a held enquiry is deleted.
- NEW COLOR STONE opens its own rolling 24-hour inventory list.
- New customer Account page with live date/time, extended profile fields, Photo Identity, and Business Identity uploads.
- Extended customer profiles are available in compact dropdowns in Admin Users.
- Removed Messages navigation and the permanent inventory notification badge.

## Revision 20 additions

- Colored-stone colors now change dynamically according to the selected gemstone type.
- Sapphire: Blue, Yellow, Pink, White, Padparadscha, Green, Purple, Orange, Black, Chameleon, Teal Blue, Green Blue, and Other.
- Ruby: Red and Blood Red.
- Morganite: Pink and Peach.
- Aquamarine: Blue, Yellow, and White.
- Alexandrite: Color Changing and Not Color Changing.
- Tourmaline, Topaz, Zircon, Spinel, and Garnet use their requested color palettes.
- Tanzanite, Emerald, Peridot, Amethyst, Opal, and Citrine have no redundant color section.
- Changing gemstone type clears incompatible color selections automatically.

## Revision 19 additions

- Redesigned the Search Color Stone header and improved responsive presentation.
- Improved colored-stone shape visibility in dark mode.
- Colored-stone labs now use GIA, IGI, GRS, IIGJ, Other, and None.
- Diamond, lab-diamond, and colored-stone location searches use Mumbai, Surat, and Delhi dropdowns.
- Colored-stone admin forms now contain only relevant product fields, including Treatment Notes.
- Colored-stone product pages use a dedicated Product Details layout.

## Revision 18 additions

- Colored-gemstone search and admin inventory, including Citrine and no supplier filter.
- Excel/CSV bulk import supports `Image URL`, `Video URL`, `In Hand Video URL`, and `Certificate URL`.
- Admin product editing, live notification badges, and three-device-per-user login enforcement.
- Click the LAB badge in search results to open the certificate preview.
- Held inventory remains visible to every approved user with a light-red row.
- Legacy final-discount and final-price-per-carat controls were removed from the customer and admin interfaces.

A full-stack React + Node dashboard with secure registration and login.

## Run
1. Install Node.js 22.13+ (Node.js 24 LTS recommended; the backend uses node:sqlite).
2. Open this folder in VS Code.
3. Run `npm install`. Copy `.env.example` to `.env` and configure a random JWT_SECRET (at least 32 characters) and ADMIN_PASSWORD (at least 12 characters).
4. In terminal 1 run `npm run server`.
5. In terminal 2 run `npm run dev`.
6. Open `http://localhost:5173`.

Registered users are stored in `gemflow.sqlite`. Passwords are hashed and never stored as plain text. Login accepts either the registered email address or mobile number. The dashboard is only shown after authentication.

For production, copy `.env.example` to `.env`, replace `JWT_SECRET` with a long random value, then run `npm run build` and `npm start`. The backend will serve the built site from `dist`.

## Authentication API

- `POST /api/auth/register` — saves name, company, email, mobile number, and a bcrypt password hash.
- `POST /api/auth/login` — accepts either email or mobile number plus password.
- `POST /api/auth/request-login-otp` — sends a six-digit login OTP to an approved user's registered mobile number.
- `POST /api/auth/login-with-otp` — validates the OTP and creates the same device-limited session as password login.
- `GET /api/auth/me` — validates the session token and returns the signed-in user.

Production OTP delivery uses Twilio. Set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` in `.env`. During local development, when those values are absent, the OTP is printed in the server terminal and returned to the development login screen for testing. It is never returned in production.

The included SQLite database is created automatically on first server start. For a multi-server production deployment, the same API can later be migrated to PostgreSQL without changing the frontend forms.

## Admin approval panel

Open `http://localhost:5173/admin` and sign in with the credentials configured as `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`. New registrations are pending by default. The admin can approve or reject each user and view all three status lists.

Approved users receive their GemFlow user ID, registered email, login link, and a reminder to use the password they created. Passwords are never emailed or stored in readable form. Rejected users receive instructions to apply again with complete, verifiable credentials.

Email delivery uses the SMTP settings in `.env`. For Gmail, `SMTP_PASS` must be a Google App Password rather than the normal Gmail password. If SMTP is not configured, the decision is still saved and the admin panel clearly reports that the email was not sent.

## Diamond inventory search

Approved users can select **Diamonds** or **Lab Diamonds** from the dashboard sidebar to open the responsive search workspace. Both categories support shape, carat range, color, clarity, cut, polish, symmetry, fluorescence, laboratory, eye-clean grade, shade, and location. Search results can be sorted by price, carat, or final discount in either direction.

## Admin-managed inventory and stone details

The admin panel links to `/admin/inventory` and presents four catalogue categories: Natural Diamond, Color Stone, Lab-Grown Diamond, and Pearl. Natural and Lab-Grown Diamond are fully implemented and kept in separate inventory lists. Their shared form stores commercial, grading, proportion, inclusion, location, laboratory, and certificate information in SQLite.

Admins can continue adding one product manually or bulk-import `.xlsx` and `.csv` spreadsheets. Select the destination category first, download the included template, and upload the completed sheet. The colored-stone template includes gemstone type, single/pair status, supplier, dimensions, grading, pricing, and media fields. Stock ID, Gemstone Type, Shape, and Carat are required for colored stones. The importer reports new, updated, and skipped row counts.

Spreadsheet numeric cells may include common presentation symbols such as `$`, `%`, commas, and degree marks; the importer safely normalizes these before storing numeric values. Re-importing an existing Stock ID updates its spreadsheet fields in place while preserving uploaded media, visibility, availability, and sold state.

After importing, use the Stock ID search under **Listed inventory**, click **Media** beside the product, and upload its Image, Video, In-hand Video, and Certificate. Existing media stays unchanged unless that specific file is replaced.

Admins can upload an image, standard video, in-hand video, and certificate for each stone. Files are stored in `uploads/`, intentionally excluded from Git, and displayed in four downloadable tabs on the customer Stone Detail page. Clicking a Stock ID opens that detail page. Its **Make Offer** action opens WhatsApp to `+91 84476 30530` with the stone details pre-filled. Color Stone and Pearl remain reserved for later phases.

## Basket, checkout and orders

Each approved user has a private persistent basket. Stones can be added from the Stone Detail page or Today's New Stones, removed from the basket, selected individually, and placed as one order. Checkout stores a snapshot of every ordered stone so order history remains accurate.

The dashboard refreshes basket, order, and new-stone counts immediately after user actions, on window focus, and every five seconds. Today's New Stones uses a rolling 24-hour window and the clicked list uses the exact same visibility and availability conditions as its counter. My Basket and My Orders cards open their corresponding product tables.

In Today's New Stones, each Stock ID opens the complete Stone Detail screen. Every row includes both Add to Cart and Place Order actions.

Admins can accept or reject pending orders after checking physical stock. Acceptance marks every ordered product as sold, hides it from all customer inventory and baskets, and prevents a second order from being accepted for the same stone. The buyer receives an approval email with an Excel-compatible CSV attachment containing the ordered stone list. Rejection sends an unavailability email.

The Admin Inventory area lists products under their own catalogue category and provides Show, Hide, and Delete controls. Sold products remain visible to the admin but cannot be shown to customers again. The Stone Detail page offers both Add to Basket and Place Order Now.

The customer and administrator interfaces share a persistent Light/Dark mode toggle. The selected theme is remembered in the browser.

Natural and lab diamond search supports numeric min/max filtering for total price, discount percentage, and price per carat, in addition to the existing sort controls. Certificate images use contained scaling, while certificate PDFs open with a page-fit viewer preference.

The search workspace now also includes price-per-carat sorting, carat presets, milky and color-shade grades, expanded labs and grading values, H&A, provenance, arrival dates, packet/certificate/show/memo lookup, ratio, advanced depth/table/girdle/dimension/angle ranges, black/white/open inclusion grades, and key-to-symbol filtering. The corresponding fields are included in manual admin entry, automatic SQLite migrations, and the downloadable CSV template.

Admin Listed Inventory supports multi-select, select-all within the current Stock ID search result, and confirmed bulk deletion. The responsive search controls collapse from three columns to two and then one, while result tables retain safe horizontal scrolling on smaller screens.

Every customer product table, natural/lab diamond search, and admin inventory table includes Stock ID search. Admin Orders has one global Stock ID search above the complete order list; it filters whole order cards so the buyer, contact information, order status, and matching stone context remain together.

The diamond shape selector uses the supplied high-detail faceted shape artwork as a sprite source and follows the reference order and labels for standard and fancy cuts.

Revision 26 fixes desktop viewport containment across the dashboard, diamond search, and stone-detail screens. The mobile natural/lab diamond search now uses an app-style responsive filter layout, compact result cards, a fixed-width-safe detail experience, and a touch-friendly sort sheet covering price, discount, size, clarity, color, and price-per-carat ordering. Natural and lab-grown inventory requests remain category-isolated and clear stale results whenever the section changes.

Revision 27 moves the authoritative desktop containment rules into a stylesheet loaded after all legacy styles. Desktop content now occupies exactly the viewport width remaining beside the 94-pixel sidebar, preserving the right gutter and keeping the My Holds card, search controls, media tabs, certificate control, and WhatsApp action fully on screen.

Revision 28 changes only the phone-sized natural/lab diamond results screen. After Search, it uses a reference-style blue Result header, one sort control, five inventory totals, dense two-line stone cards, and a fixed bottom action bar. Desktop, tablet, admin, gemstone, filtering, inventory, ordering, and backend behavior are unchanged.

Revision 29 refines only the phone-sized diamond search workflow. It removes the Basic/Advanced/Stock-Certi tab strip, keeps one sort control, adds an always-visible Search Inventory action and a results Modify action, wraps all filter values within the phone viewport, uses the full Fluorescence label, hides Provenance/Arrivals/Ratio on phones, restores a normal results background, improves the light-theme result count, and reduces result-card scale. Desktop behavior and styling remain unchanged.

Revision 30 changes only the phone-sized diamond interface: Search Inventory and its live count now occupy the Search View header, Shape/Color/Clarity use compact snap sliders, result-toolbar controls no longer overlap or carry grey button blocks, bottom navigation buttons use one coordinated surface, and dark-mode result cards use readable high-contrast text and pricing.

## Main areas
- Dashboard summary cards
- Inventory category strip
- Featured stone carousel
- Natural Diamond, Gemstones, and Lab Diamonds navigation
- Orders / holds / basket / bids
- Recently viewed
- Saved searches
- Appointments
- New & recommended inventory
- Responsive mobile sidebar

The visual language is intentionally similar to the reference image while using original GemFlow branding and components.


## Device replacement and gemstone update

When three devices are registered, a new device receives a device-selection dialog after successful password or mobile-OTP authentication. Choose one existing device, request an email code, and enter it to replace that session. The old session remains valid until verification succeeds. Email codes expire after five minutes, allow five incorrect attempts, and have a 45-second resend cooldown. Replacement requests expire after ten minutes. The code is sent to the account's registered email through the administrator-configured SMTP service; it is never returned to the browser. Configure SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS and MAIL_FROM in .env. If delivery is unavailable, replacement is blocked and existing sessions remain active.

Device names are inferred from the browser's User-Agent. Each browser profile counts as a device; legacy sessions display “Previously registered device” until they log in again. A revoked device returns to login on its next authenticated request (dashboard refresh is normally within five seconds).

Gemstone types now follow the requested sequence with uppercase labels and consistent typography: Sapphire, Emerald, Ruby, Opal, Coral, Cats Eye, Alexandrite, Peridot, Zircon, Iolite, Citrine, Amethyst, Aquamarine, Tanzanite, Spinel, Topaz. Peridot appears once; “SPINAL” is normalized to Spinel. Existing inventory records are preserved.

Run `node tests/device-login.mjs` for isolated device-login integration tests using a local test SMTP server and disposable database. No real email is sent by these tests.


## Password recovery and GitHub trial

Email reset now uses the configured public HTTPS APP_URL (with supported hosting environment fallbacks) and reports delivery/configuration errors. A separate SMS password-reset screen is available at `/recover-password`, with dedicated single-use reset OTPs, attempt limits and resend cooldowns. Successful password resets revoke previous sessions. See HOSTING.md for GitHub Codespaces trial steps, Docker hosting, and required SMTP/Twilio settings. The repository includes a GitHub Actions build/test workflow; GitHub Pages alone does not run the backend.

Server startup now requires configured JWT_SECRET and ADMIN_PASSWORD; there are no fallback credentials. Codespaces creates random values automatically on first startup.

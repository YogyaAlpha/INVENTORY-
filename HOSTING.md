# GemFlow trial on GitHub

GitHub stores the source code. GitHub Pages cannot run this Express/SQLite backend. For a full working trial from GitHub, open the repository in GitHub Codespaces; the included devcontainer builds the frontend, starts the backend, and forwards port 3001. Codespaces use is subject to your GitHub account's allowance and billing settings.

## GitHub Codespaces trial

1. Create a private repository and upload the contents of `gemflow-dashboard-main` at the repository root (package.json and server.js at the top level).
2. Choose Code → Codespaces → Create codespace on main.
3. Wait for the build. Open forwarded port 3001. Keep the codespace running during the trial.
4. In the Codespaces editor, open `.env`. A random JWT secret and admin password are created automatically. Use its admin email and password at `/admin`.
5. Configure your SMTP and Twilio values in `.env` using `.env.example` as the key reference. Do not commit `.env`. Restart the Node server after changing configuration. Existing data remains outside the source folder.
6. Set APP_URL to the exact forwarded HTTPS URL if needed. When APP_URL is absent, the server derives the Codespaces URL automatically. Do not copy a localhost APP_URL into a hosted environment.

Forwarded ports normally require your GitHub login. A person opening a reset email must also have access to the forwarded app. For external testers, intentionally adjust the port's visibility in GitHub. This is a temporary development trial rather than persistent production hosting. Keep a backup of the sibling `gemflow-data` folder before deleting a codespace.

## Email reset

Set SMTP_HOST, SMTP_PORT (usually 587), SMTP_SECURE=false for STARTTLS on 587 or true for implicit TLS on 465, SMTP_USER, SMTP_PASS, and MAIL_FROM. With Gmail, use an App Password. APP_URL must be the real public HTTPS website address. The server refuses production reset mail with a localhost address and reports mail failures instead of claiming success. The link opens `/reset-password?token=...`, expires in one hour and works once. A successful reset signs out existing sessions.

## SMS reset

Choose Reset password by email → Reset password by SMS instead. Enter the registered number, request the dedicated reset OTP, and enter a new password and confirmation. Login OTP and reset OTP are separate flows and cannot substitute for each other.

Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER. Use an SMS-capable sender with permissions to send to the recipient country. Provider account restrictions and Indian delivery requirements can block messages even with correct app code; check delivery errors in your provider console. Ten-digit Indian numbers are sent as +91 followed by the number. International users should enter the full country code. Reset OTPs expire after five minutes, permit five incorrect guesses, and enforce a 45-second resend delay. They are never sent back to the browser or printed as development reset codes.

## Persistent full-stack host

The Dockerfile builds and serves the frontend and backend together on port 3001. Mount a persistent volume at `/data`, configure NODE_ENV=production, APP_URL, JWT_SECRET, ADMIN_EMAIL and ADMIN_PASSWORD, then add SMTP and Twilio settings. Use a single application instance because SQLite is a local database. Do not deploy the frontend alone and expect the account APIs to work.

## Checks

`npm ci`, `npm run build`, `npm test`.

The integration tests run with a disposable SQLite database, a local SMTP server, and a mocked Twilio endpoint. They do not send real messages and cannot verify a real provider account's delivery configuration.

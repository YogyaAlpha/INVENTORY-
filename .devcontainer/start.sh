#!/usr/bin/env bash
set -euo pipefail
if curl -fsS http://localhost:3001/api/health >/dev/null 2>&1; then exit 0; fi
if [ ! -f .env ]; then
  umask 077
  node --input-type=module -e 'import {randomBytes} from "node:crypto";import {writeFileSync} from "node:fs";writeFileSync(".env",`JWT_SECRET=${randomBytes(48).toString("hex")}\nADMIN_EMAIL=official.gemflow@gmail.com\nSMTP_HOST=smtp.gmail.com\nSMTP_PORT=587\nSMTP_SECURE=false\nSMTP_USER=official.gemflow@gmail.com\nMAIL_FROM=GemFlow <official.gemflow@gmail.com>\nADMIN_PASSWORD=${randomBytes(18).toString("hex")}\n`,{mode:0o600});'
fi
nohup env NODE_ENV=production npm start > /tmp/gemflow-server.log 2>&1 &

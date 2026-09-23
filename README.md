# 🌌 Finalca

> 💡 Created by **Agam Mehar**  
> ✨ **Vibe coded** with curiosity, iteration, and care.

Finalca is a premium, dark-first AI CFO workspace for understanding net worth, investments, goals, and next steps — without presenting itself as a licensed financial adviser.

## 🔐 Demo access

Use these preset local credentials to unlock the development app:

```text
Username: admin
Password: finalca123
```

> ⚠️ These credentials are for the local demo only. Replace the authentication flow before using Finalca in production.

## 🚀 Product architecture

### 🧭 Core modules

- **📊 Overview**: net worth, investments, cash position, savings rate, allocation, goals, and recent activity.
- **💼 Portfolio**: accounts, holdings, liabilities, cash flow, performance, and allocation drift.
- **🎯 Growth planner**: milestone-based goals with contribution assumptions, target dates, and scenario projections.
- **🔔 Alerts**: risk, opportunity, data freshness, and goal milestone notifications.
- **📚 Education**: plain-language explainers with actionable examples and “learn more” pathways.
- **🤖 AI CFO**: contextual chat grounded in the user's normalized financial snapshot and goal context.

### 🧩 Suggested service boundaries

| Service | Responsibility | Example API |
| --- | --- | --- |
| Identity | Session, MFA, consent, workspace access | `POST /v1/auth/session` |
| Connections | Tokenized account linking and provider sync | `POST /v1/connections`, `POST /v1/sync` |
| Wealth | Positions, liabilities, transactions, calculated metrics | `GET /v1/wealth/snapshot` |
| Planning | Goals, scenarios, contributions, projections | `POST /v1/plans/{id}/scenarios` |
| Alerts | Rules, preferences, and delivery state | `GET /v1/alerts` |
| CFO | Retrieval-grounded AI responses and chat history | `POST /v1/cfo/chat` |

🔐 The browser should only receive a short-lived session token. Provider credentials and AI provider keys stay server-side in a secrets manager. Financial records should be encrypted at rest, redacted from application logs, and versioned with an audit event for imports, edits, exports, and deletion.

## 🤖 AI CFO workflow

1. 🏷️ Classify the question (performance, planning, education, account data, or unsupported advice).
2. 🔎 Fetch the minimum permitted context: normalized snapshot, relevant time series, goals, and prior conversation summary.
3. 🛡️ Apply a safety layer: do not make specific security picks, guarantee outcomes, or represent the response as licensed advice.
4. 🧠 Generate a structured response with a concise answer, assumptions, suggested next step, and dashboard deep link.
5. 🧾 Store the conversation summary and referenced data timestamp, never raw provider credentials.

The UI already includes the chat surface and can be wired to `POST /v1/cfo/chat` with:

```json
{
  "message": "Am I on track for my home goal?",
  "conversationId": "optional-existing-id",
  "context": { "surface": "overview" }
}
```

The response contract should include `message`, optional `actions` (`label`, `href`), `disclaimer`, and `dataAsOf`. Voice input can use browser speech recognition or a provider transcription endpoint, then reuse the same chat contract.

## 🛠️ Local development

### Requirements

- Node.js 18 or newer
- npm
- Git (only needed for source control and publishing)

### First-time setup

From the project folder:

```bash
npm install
npm run dev
```

Open the URL shown by Vite, normally `http://localhost:5173`.

The local demo login is:

```text
Username: admin
Password: finalca123
```

### Reliable Windows PowerShell commands

Use these commands when running Finalca from Windows PowerShell:

```powershell
Set-Location "C:\Users\agamm\OneDrive\Desktop\Finalca"
npm install
npx vite --host 0.0.0.0
```

If port `5173` is already in use, find and stop only the process listening on that port:

```powershell
$connection = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($connection) { Stop-Process -Id $connection.OwningProcess -Force }
npx vite --host 0.0.0.0
```

If the browser shows a blank page or `404`, confirm that the terminal is in the project root and start Vite with the project root explicitly:

```powershell
Set-Location "C:\Users\agamm\OneDrive\Desktop\Finalca"
npx vite --root . --host 0.0.0.0
```

Do not run `vite 0.0.0.0`; `0.0.0.0` is a host value and must follow the `--host` option.

Build a production bundle with:

```bash
npm run build
```

Preview the production bundle locally:

```bash
npm run build
npm run preview
```

### Common run issues

| Symptom | Fix |
| --- | --- |
| `npm` or `node` is not recognized | Install Node.js 18+ and reopen PowerShell. |
| Port `5173` is busy | Use the PowerShell port cleanup command above, or run `npx vite --host 0.0.0.0 --port 5174`. |
| Browser shows `404` at `/` | Start Vite from the project root with `npx vite --root . --host 0.0.0.0`. |
| Browser shows a blank page after code changes | Hard-refresh the page (`Ctrl+Shift+R`) and check the Vite terminal for compile errors. |
| Dependencies are missing | Run `npm install`, then restart Vite. |
| CFO chat reports a provider error | Check `.env`, confirm `GEMINI_API_KEY` is set, and restart the dev server. |
| Changes are not visible | Stop the running server, start it again, and reload `http://localhost:5173`. |

### Stop the development server

Press `Ctrl+C` in the terminal running Vite. If that terminal is unavailable, stop the specific listener:

```powershell
$connection = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($connection) { Stop-Process -Id $connection.OwningProcess -Force }
```

### Useful source-control commands

```powershell
git status
git add README.md
git commit -m "Document local run troubleshooting"
git push origin main
```

## 🔑 Enable CFO chat

1. Copy `.env.example` to `.env`.
2. Set `GEMINI_API_KEY` to your Gemini API key.
3. Restart `npm run dev`.

The key is read only by the Vite server middleware and is never bundled into the browser. Do not commit `.env`.

## ✨ Project note

Finalca is a **vibe-coded finance workspace**: an experimental, visual-first project shaped through rapid iteration, product exploration, and hands-on refinement.

> ⚠️ Educational guidance only. Finalca is not licensed financial advice.

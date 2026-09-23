# Run Finalca

## Requirements

- Node.js 18 or newer
- npm
- A Gemini API key for live AI CFO responses

## 1. Open the project

Open PowerShell and run:

```powershell
cd C:\Users\agamm\OneDrive\Desktop\Finalca
```

## 2. Install dependencies

Run this once, or whenever dependencies change:

```powershell
npm install
```

## 3. Configure the CFO API

Open the local environment file:

```powershell
notepad .env
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_key_here
```

Finalca uses Gemini for CFO responses.

Do not share or commit `.env`. It is ignored by Git.

## 4. Start the development app

```powershell
npm run dev
```

Open the URL printed by Vite, normally:

```text
http://localhost:5173
```

Open the Overview page directly:

```text
http://localhost:5173/#/Overview
```

## 5. Use the app

- Use the top-right three-line menu to switch between Overview, Income, Expenses, Loans, SIPs, Investments, Assets, Liabilities, and Goals.
- Use the Back button or the browser Back button to return to the previous page.
- Edit spreadsheet cells directly.
- Use Add row to create records.
- Use the delete icon to remove records.
- Use Download CSV to export a page.
- Click Ask your CFO to use the private CFO assistant.

## 6. Create a production build

```powershell
npm run build
```

Preview the production build locally:

```powershell
npm run preview
```

## Troubleshooting

### Port 5173 is already in use

Find the process:

```powershell
Get-NetTCPConnection -LocalPort 5173
```

Stop only the process using that port:

```powershell
Stop-Process -Id PROCESS_ID
```

Then run:

```powershell
npm run dev
```

### CFO is not responding

1. Confirm `.env` exists in the project root.
2. Confirm it contains a non-empty `GEMINI_API_KEY`.
3. Stop and restart `npm run dev`.
4. Refresh Chrome.

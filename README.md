# Finalca

> Created by Agam Mehar

Finalca is a premium, dark-first AI CFO workspace for understanding net worth, investments, goals, and next steps without presenting itself as a licensed financial adviser.

## Product architecture

### Core modules

- **Overview**: net worth, investments, cash position, savings rate, allocation, goals, and recent activity.
- **Portfolio**: accounts, holdings, liabilities, cash flow, performance, and allocation drift.
- **Growth planner**: milestone-based goals with contribution assumptions, target dates, and scenario projections.
- **Alerts**: risk, opportunity, data freshness, and goal milestone notifications.
- **Education**: plain-language explainers with actionable examples and “learn more” pathways.
- **AI CFO**: contextual chat grounded in the user's normalized financial snapshot and goal context.

### Suggested service boundaries

| Service | Responsibility | Example API |
| --- | --- | --- |
| Identity | Session, MFA, consent, workspace access | `POST /v1/auth/session` |
| Connections | Tokenized account linking and provider sync | `POST /v1/connections`, `POST /v1/sync` |
| Wealth | Positions, liabilities, transactions, calculated metrics | `GET /v1/wealth/snapshot` |
| Planning | Goals, scenarios, contributions, projections | `POST /v1/plans/{id}/scenarios` |
| Alerts | Rules, preferences, and delivery state | `GET /v1/alerts` |
| CFO | Retrieval-grounded AI responses and chat history | `POST /v1/cfo/chat` |

The browser should only receive a short-lived session token. Provider credentials and AI provider keys stay server-side in a secrets manager. Financial records should be encrypted at rest, redacted from application logs, and versioned with an audit event for imports, edits, exports, and deletion.

## AI CFO workflow

1. Classify the question (performance, planning, education, account data, or unsupported advice).
2. Fetch the minimum permitted context: normalized snapshot, relevant time series, goals, and prior conversation summary.
3. Apply a safety layer: do not make specific security picks, guarantee outcomes, or represent the response as licensed advice.
4. Generate a structured response with a concise answer, assumptions, suggested next step, and dashboard deep link.
5. Store the conversation summary and referenced data timestamp, never raw provider credentials.

The UI already includes the chat surface and can be wired to `POST /v1/cfo/chat` with:

```json
{
  "message": "Am I on track for my home goal?",
  "conversationId": "optional-existing-id",
  "context": { "surface": "overview" }
}
```

The response contract should include `message`, optional `actions` (`label`, `href`), `disclaimer`, and `dataAsOf`. Voice input can use browser speech recognition or a provider transcription endpoint, then reuse the same chat contract.

## Local development

```bash
npm install
npm run dev
```

Build a production bundle with `npm run build`.

## Enable CFO chat

1. Copy `.env.example` to `.env`.
2. Set `GEMINI_API_KEY` to your Gemini API key.
3. Restart `npm run dev`.

The key is read only by the Vite server middleware and is never bundled into the browser. Do not commit `.env`.

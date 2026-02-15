# Google Forms Export

## What It Does

Exports the quiz built in the form builder to a real Google Form. Teachers click Export, authenticate with Google (if not already), and get a link to their new Google Form with quiz mode enabled, correct answers, and point values.

## OAuth Flow

1. Teacher clicks the Export button
2. If not authenticated, they're redirected to `GET /api/google/auth`
3. This redirects to Google's OAuth consent screen requesting `forms.body` scope
4. Teacher grants permission, Google redirects to `GET /api/google/callback`
5. Callback exchanges the authorization code for tokens via Google's token endpoint
6. Tokens are encrypted (AES-256-GCM) and stored in an httpOnly cookie (`qf_google_tokens`)
7. Teacher is redirected back to `/dashboard?google=connected`
8. On subsequent exports, tokens are read from the cookie (refreshed if expired)

## Google Forms API

Export is a two-step process:

1. **`forms.create()`** — Creates an empty form with just the title
2. **`forms.batchUpdate()`** — Adds all questions, enables quiz mode, sets grading

### Question Type Mapping

| App Type | Google Forms API |
|----------|-----------------|
| `multiple_choice` | `choiceQuestion` type `RADIO` |
| `checkboxes` | `choiceQuestion` type `CHECKBOX` |
| `dropdown` | `choiceQuestion` type `DROP_DOWN` |
| `short_answer` | `textQuestion` paragraph `false` |
| `long_answer` | `textQuestion` paragraph `true` |

### Batch Update Structure

Each question becomes a `createItem` request with:
- `item.title` — Question text
- `item.questionItem.question.required` — Required flag
- `item.questionItem.question.grading` — Points, correct answers, feedback
- `item.questionItem.question.choiceQuestion` or `textQuestion` — Type-specific config

Quiz mode is enabled via `updateSettings` with `quizSettings.isQuiz: true`.

## Token Management

- **Encryption**: AES-256-GCM using first 32 chars of `COOKIE_SECRET`
- **Storage**: httpOnly cookie, 30-day expiry
- **Refresh**: Access tokens are refreshed automatically when expired (within 5min buffer)
- **Failure**: If refresh fails, user is redirected back to OAuth

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | Callback URL (e.g., `http://localhost:3000/api/google/callback`) |
| `COOKIE_SECRET` | 32+ character string for token encryption |

## Files

| File | Purpose |
|------|---------|
| `src/lib/google.js` | Token encrypt/decrypt, cookie helpers, token refresh |
| `src/app/api/google/auth/route.js` | Redirects to Google OAuth consent screen |
| `src/app/api/google/callback/route.js` | Exchanges code for tokens, stores in cookie |
| `src/app/api/google/export/route.js` | Creates Google Form via API |
| `src/components/ExportButton.js` | Export button with OAuth check and status states |
| `src/middleware.js` | Updated to allow `/api/google/callback` without access cookie |

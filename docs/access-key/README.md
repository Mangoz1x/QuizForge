# Access Key

## What It Does

Gates the entire app behind an access key check. Teachers must enter a valid access key to use QuizForge. There is no user account system — just a shared-secret key model.

## How It Works

### Flow

1. Unauthenticated user visits any route → middleware redirects to `/`
2. `/` renders a centered card with a key input and "Continue" button
3. User submits key → POST `/api/auth/validate` with `{ key }`
4. Valid key → API sets `qf_access=valid` cookie (httpOnly, 7 days), returns `{ success: true }` → client redirects to `/dashboard`
5. Invalid key → API returns 401 `{ success: false, error: "Invalid access key" }` → error shown below input
6. Returning user with valid cookie hits `/` → server component detects cookie, redirects to `/dashboard`

### Key Validation

Keys are stored in the `ACCESS_KEYS` environment variable as a comma-separated list:

```
ACCESS_KEYS=key1,key2,key3
```

The API route splits this string, trims whitespace, and checks if the submitted key matches any entry.

### Cookie

| Property   | Value                                |
|------------|--------------------------------------|
| Name       | `qf_access`                         |
| Value      | `"valid"`                            |
| httpOnly   | `true`                               |
| secure     | `true` in production                 |
| sameSite   | `lax`                                |
| maxAge     | 7 days (604800 seconds)              |
| path       | `/`                                  |

### Middleware

The middleware (`src/middleware.js`) runs on every request and:

- **Allows**: `/`, `/api/auth/*`, `/_next/*`, static files (paths containing `.`)
- **Redirects to `/`**: Everything else, if the `qf_access` cookie is missing or invalid

## Files

| File | Purpose |
|------|---------|
| `src/lib/auth.js` | Shared constants (`COOKIE_NAME`, `COOKIE_MAX_AGE`) and `validateKey()` |
| `src/app/api/auth/validate/route.js` | POST endpoint — validates key, sets cookie |
| `src/middleware.js` | Protects routes, redirects unauthenticated users |
| `src/components/AccessKeyForm.js` | Client component — input, submit, loading/error states |
| `src/app/page.js` | Access key entry page (redirects if already authenticated) |

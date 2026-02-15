# QuizForge

QuizForge is a tool that helps teachers create Google Forms quizzes from class content. Paste notes, textbook material, or any content into the chat, describe the quiz you want, and AI generates a complete quiz with questions, answer keys, and feedback. Export directly to Google Forms with one click.

## How It Works

1. **Access** -- Enter an access key to get into the app
2. **Create a quiz** -- Click "New Quiz" on the dashboard
3. **Paste content & describe your quiz** -- Paste class material into the chat bar and tell the AI what you need (e.g. "Create 10 multiple choice questions about photosynthesis")
4. **AI generates questions** -- The AI creates questions with answer options, correct answers, point values, and student feedback
5. **Review & edit** -- Modify questions manually or ask the AI to make changes ("Make question 3 harder", "Add 2 more about chapter 5")
6. **Export to Google Forms** -- Click Export to create a Google Form in your Drive. A "QuizForge" folder is created automatically to keep forms organized
7. **Auto-sync** -- After the first export, any changes you make (including AI edits) automatically sync to the linked Google Form

## Supported Question Types

- Multiple choice (radio)
- Checkboxes (multi-select)
- Dropdown
- Short answer (with answer key)
- Long answer / paragraph (with feedback)

Each question supports point values, required/optional toggle, correct answers, and student-facing feedback.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **AI**: Anthropic Claude API (via `@anthropic-ai/sdk`)
- **Icons**: Lucide React
- **Google Integration**: Google Forms API v1 + Google Drive API v3
- **Storage**: Browser localStorage (no database)
- **Language**: JavaScript (no TypeScript)

## Setup

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)
- A Google Cloud project with the **Google Forms API** and **Google Drive API** enabled
- Google OAuth 2.0 credentials (Web application type)

### 1. Clone & install

```bash
git clone <repo-url>
cd google-form-creator
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `ACCESS_KEYS` | Comma-separated list of valid access keys (e.g. `key1,key2,key3`). Users must enter one of these to access the app. |
| `ANTHROPIC_API_KEY` | Your Anthropic API key for Claude |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 client secret |
| `GOOGLE_REDIRECT_URI` | OAuth redirect URI (e.g. `http://localhost:3000/api/google/callback` for local dev, or your production URL) |
| `COOKIE_SECRET` | A random string of at least 32 characters, used to encrypt the Google auth token cookie |
| `NEXT_PUBLIC_IS_DEV` | Set to `true` to show a floating "Clear State" button for development (optional) |

### 3. Set up Google Cloud

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or use an existing one)
3. Enable the **Google Forms API** and **Google Drive API**
4. Go to **APIs & Services > Credentials**
5. Create an **OAuth 2.0 Client ID** (Web application)
6. Add your redirect URI: `http://localhost:3000/api/google/callback` (and your production URL if deploying)
7. Copy the client ID and secret into your `.env.local`

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter an access key to get started.

## Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in [Vercel](https://vercel.com/new)
3. Add all environment variables from your `.env.local` to Vercel's project settings (Settings > Environment Variables)
4. Update `GOOGLE_REDIRECT_URI` to your production URL: `https://your-domain.vercel.app/api/google/callback`
5. Add the same production redirect URI in your Google Cloud OAuth credentials
6. Set `NEXT_PUBLIC_IS_DEV` to `false` (or remove it) for production
7. Deploy

## Project Structure

```
src/
  app/
    page.js                    # Access key entry page
    layout.js                  # Root layout
    dashboard/
      page.js                  # Quiz list dashboard
      [id]/page.js             # Quiz editor page
    api/
      auth/validate/route.js   # Access key validation
      chat/route.js            # AI chat endpoint (Claude)
      google/
        auth/route.js          # Google OAuth initiation
        callback/route.js      # Google OAuth callback
        export/route.js        # Google Forms create/update + Drive folder
  components/
    FormBuilder.js             # Main quiz editor layout
    FormPreview.js             # Live quiz preview
    ChatBar.js                 # AI chat input with attachment support
    QuestionCard.js            # Individual question editor
    QuestionOptions.js         # Answer options for choice questions
    ExportButton.js            # Export to Google Forms button
    SyncIndicator.js           # Auto-sync status display
    HistoryPanel.js            # Version history dropdown
    EmptyState.js              # Empty quiz placeholder
    TutorialDialog.js          # Dashboard onboarding tutorial
    EditorTutorialDialog.js    # Quiz editor onboarding tutorial
    ExportTutorialDialog.js    # First export explainer
    ArtifactTip.js             # Pasted content tooltip
    ArtifactSidebar.js         # Attachment viewer/editor sidebar
    DevClearButton.js          # Dev-only state reset button
    ui/                        # Reusable UI primitives (Button, Input, etc.)
  lib/
    form-context.js            # React context for form state + auto-sync
    form-schema.js             # Question types, validation, AI schema
    storage.js                 # localStorage helpers
    google.js                  # Google OAuth token management
    auth.js                    # Access key validation
  middleware.js                # Route protection (access key check)
docs/                          # Feature documentation
```

## Data Storage

All quiz data is stored in the browser's localStorage. There is no database or server-side persistence. Each quiz is stored under a `quiz_<id>` key containing the form structure, chat history, and export metadata.

Google OAuth tokens are stored in an encrypted httpOnly cookie (`qf_google_tokens`), not in localStorage.

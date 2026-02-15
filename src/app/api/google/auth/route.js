export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const quizId = searchParams.get("quizId") || "";

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/forms.body https://www.googleapis.com/auth/drive.file",
    access_type: "offline",
    prompt: "consent",
    state: quizId,
  });

  return Response.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: `Privacy Policy`,
  description: `Privacy Policy for ${process.env.NEXT_PUBLIC_APP_NAME}. Learn how we handle your data, Google OAuth integration, and comply with Canadian privacy law (PIPEDA, FIPPA).`,
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/privacy`,
  },
};

export default function PrivacyPage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 lg:px-12 py-12 max-w-xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-8"
        >
          <ChevronLeft size={14} />
          Back to home
        </Link>

        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Effective date: March 5, 2026
        </p>

        <div className="space-y-8 text-sm text-slate-600 leading-relaxed">

          {/* Intro */}
          <section className="space-y-2">
            <p>
              This Privacy Policy describes how {appName} (&ldquo;the Service,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, and protects information when you use our web application. By using the Service, you agree to the practices described in this policy.
            </p>
            <p>
              {appName} is designed with a privacy-first architecture. We do not maintain user accounts, do not operate a user database, and minimize data collection to what is strictly necessary to provide the Service.
            </p>
          </section>

          {/* 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-slate-900">1. Information We Collect</h2>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-800">1.1 Information You Provide Directly</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <span className="font-medium text-slate-700">Class content and source material</span> — text you paste or type into the Service for quiz generation, including notes, textbook passages, study guides, and any other educational material. This content is processed in real time and is not stored on our servers after processing is complete.
                </li>
                <li>
                  <span className="font-medium text-slate-700">Chat messages</span> — instructions and prompts you send to the AI assistant to generate or modify quizzes. These are held in your browser&apos;s memory during your session and stored locally on your device (see Section 3).
                </li>
                <li>
                  <span className="font-medium text-slate-700">Access keys</span> — credentials used to authenticate your access to the Service. We validate keys server-side but do not log or track which key is used or when.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-800">1.2 Information Collected Through Google OAuth</h3>
              <p>
                When you connect your Google account to export quizzes, we receive:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <span className="font-medium text-slate-700">OAuth access token</span> — a temporary credential that allows us to create Google Forms and manage files in your Google Drive on your behalf.
                </li>
                <li>
                  <span className="font-medium text-slate-700">OAuth refresh token</span> — used to obtain new access tokens when the current one expires, so you do not need to re-authenticate each session.
                </li>
                <li>
                  <span className="font-medium text-slate-700">Token expiration time</span> — used to determine when to refresh your access token.
                </li>
              </ul>
              <p>
                We do <span className="font-medium text-slate-700">not</span> receive or store your Google email address, name, profile picture, contact list, or any other personal information from your Google account. We only request the minimum scopes necessary:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><code className="text-xs bg-slate-100 px-1 rounded">forms.body</code> — to create and edit Google Forms</li>
                <li><code className="text-xs bg-slate-100 px-1 rounded">drive.file</code> — to create files and folders in your Google Drive</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-800">1.3 Information We Do Not Collect</h3>
              <p>
                We do not collect:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Names, email addresses, or personal identifiers</li>
                <li>IP addresses or geolocation data</li>
                <li>Device fingerprints or browser characteristics</li>
                <li>Usage analytics or behavioral tracking data</li>
                <li>Student information of any kind</li>
              </ul>
            </div>
          </section>

          {/* 2 */}
          <section className="space-y-2">
            <h2 className="text-lg font-medium text-slate-900">2. How We Use Your Information</h2>
            <p>
              We use the information described above solely to operate the Service:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <span className="font-medium text-slate-700">Content and chat messages</span> are sent to the Anthropic API to generate quiz questions, answer keys, point values, and feedback. This is the core function of the Service.
              </li>
              <li>
                <span className="font-medium text-slate-700">Google OAuth tokens</span> are used exclusively to create Google Forms in your Drive, organize them in a designated folder, and sync edits you make within the Service to the corresponding Google Form.
              </li>
              <li>
                <span className="font-medium text-slate-700">Access keys</span> are validated to grant or deny access to the Service.
              </li>
            </ul>
            <p>
              We do not use your information for:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Advertising, marketing, or retargeting</li>
              <li>Analytics, profiling, or behavioral tracking</li>
              <li>Training AI models</li>
              <li>Selling, renting, or sharing with data brokers</li>
              <li>Any purpose other than providing the Service as described</li>
            </ul>
          </section>

          {/* 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-slate-900">3. Data Storage and Retention</h2>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-800">3.1 Server-Side (Our Infrastructure)</h3>
              <p>
                {appName} does not operate a database. No user content, quiz data, chat history, or personal information is stored on our servers. All content processing happens in memory and is discarded immediately after the response is sent.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-800">3.2 Client-Side (Your Browser)</h3>
              <p>
                Quiz data — including quiz titles, questions, answer keys, point values, feedback, and chat history — is stored in your browser&apos;s local storage. This data:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Remains entirely on your device</li>
                <li>Is not persistently stored on our servers. Content is transmitted to Anthropic for processing and to Google for export, but is not retained after the operation completes</li>
                <li>Is not encrypted at rest in the browser</li>
                <li>Persists until you manually delete it or clear your browser data</li>
                <li>Is not accessible to us or any third party through the Service</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-800">3.3 Cookies</h3>
              <p>
                {appName} uses two essential cookies. We do not use any tracking, analytics, or advertising cookies.
              </p>
              <div className="border border-slate-200 rounded-lg overflow-hidden mt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-3 py-2 font-medium text-slate-700">Cookie</th>
                      <th className="text-left px-3 py-2 font-medium text-slate-700">Purpose</th>
                      <th className="text-left px-3 py-2 font-medium text-slate-700">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="px-3 py-2"><code className="text-xs bg-slate-100 px-1 rounded">qf_access</code></td>
                      <td className="px-3 py-2">Stores your authenticated status after entering a valid access key</td>
                      <td className="px-3 py-2">7 days</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2"><code className="text-xs bg-slate-100 px-1 rounded">qf_google_tokens</code></td>
                      <td className="px-3 py-2">Stores encrypted Google OAuth tokens for quiz export</td>
                      <td className="px-3 py-2">30 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2">
                Both cookies are HTTP-only (not accessible to JavaScript), encrypted where applicable (AES-256-GCM for Google tokens), and marked Secure in production (transmitted only over HTTPS).
              </p>
            </div>
          </section>

          {/* 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-slate-900">4. Third-Party Services and Data Sharing</h2>
            <p>
              We do not sell, rent, or share your data with third parties for their own purposes. However, the Service relies on the following third-party services to function, and data is transmitted to them as described below:
            </p>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-800">4.1 Anthropic (AI Processing)</h3>
              <p>
                Your content and chat messages are sent to{" "}
                <a
                  href="https://www.anthropic.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 underline underline-offset-2 hover:text-slate-900"
                >
                  Anthropic&apos;s API
                </a>{" "}
                for quiz generation. Specifically, each request includes:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>The text content you provide for quiz generation</li>
                <li>Your chat history with the AI assistant (up to 20 recent messages)</li>
                <li>The current state of your quiz (titles, questions, answers)</li>
              </ul>
              <p>
                Per Anthropic&apos;s current API terms, data submitted through their API is not used for model training. See{" "}
                <a
                  href="https://www.anthropic.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 underline underline-offset-2 hover:text-slate-900"
                >
                  Anthropic&apos;s Privacy Policy
                </a>{" "}
                for current details on their data retention practices.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-800">4.2 Google APIs (Quiz Export)</h3>
              <p>
                When you export a quiz, the following data is sent to Google&apos;s APIs:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Quiz title, description, and all questions with answer keys, point values, and feedback</li>
                <li>Your OAuth access token (for authentication)</li>
              </ul>
              <p>
                This data is used to create a Google Form in your Drive and, if auto-sync is active, to update it when you make changes. Google processes this data in accordance with{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 underline underline-offset-2 hover:text-slate-900"
                >
                  Google&apos;s Privacy Policy
                </a>.
              </p>
              <p>
                {appName}&apos;s use and transfer of information received from Google APIs adheres to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 underline underline-offset-2 hover:text-slate-900"
                >
                  Google API Services User Data Policy
                </a>, including the Limited Use requirements. We do not use Google user data for advertising, do not transfer it to third parties, and do not use it for purposes unrelated to quiz export.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-800">4.3 Vercel (Hosting)</h3>
              <p>
                The Service is hosted on{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 underline underline-offset-2 hover:text-slate-900"
                >
                  Vercel
                </a>. All HTTP requests pass through Vercel&apos;s infrastructure. Vercel may collect standard server logs (IP addresses, request timestamps) as part of their hosting service. We do not access or use these logs. See Vercel&apos;s privacy policy for details on their data practices.
              </p>
            </div>
          </section>

          {/* 5 */}
          <section className="space-y-2">
            <h2 className="text-lg font-medium text-slate-900">5. Data Security</h2>
            <p>
              We implement the following security measures:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <span className="font-medium text-slate-700">Encryption in transit</span> — all communication between your browser and our servers uses HTTPS/TLS encryption.
              </li>
              <li>
                <span className="font-medium text-slate-700">Encrypted tokens</span> — Google OAuth tokens stored in cookies are encrypted using AES-256-GCM before being set in the browser.
              </li>
              <li>
                <span className="font-medium text-slate-700">HTTP-only cookies</span> — authentication cookies cannot be accessed by client-side JavaScript, reducing the risk of cross-site scripting (XSS) attacks.
              </li>
              <li>
                <span className="font-medium text-slate-700">Secure cookie flag</span> — in production, cookies are transmitted only over HTTPS connections.
              </li>
              <li>
                <span className="font-medium text-slate-700">No server-side data persistence</span> — by not storing user content or personal data on our servers, we eliminate the primary vector for data breaches.
              </li>
              <li>
                <span className="font-medium text-slate-700">Minimal scope</span> — Google OAuth integration requests only the minimum permissions required to create and manage forms.
              </li>
            </ul>
            <p>
              Please note that quiz data stored in your browser&apos;s local storage is not encrypted. Anyone with access to your device and browser can view this data. You are responsible for securing your device.
            </p>
          </section>

          {/* 6 */}
          <section className="space-y-2">
            <h2 className="text-lg font-medium text-slate-900">6. Children&apos;s Privacy</h2>
            <p>
              {appName} is designed for use by educators and is not directed at minors. The Service does not require students to create accounts, interact with the application, or provide any personal information.
            </p>
            <p>
              We do not knowingly collect personal information from minors. If you are an educator, do not input student-identifiable information (names, IDs, grades, etc.) into the Service. If you believe that a minor&apos;s personal information has been inadvertently submitted, please contact us so we can take appropriate action.
            </p>
          </section>

          {/* 7 */}
          <section className="space-y-2">
            <h2 className="text-lg font-medium text-slate-900">7. Student Data and Ontario Privacy Law</h2>
            <p>
              {appName} is not designed to process, store, or manage student records as defined under the Municipal Freedom of Information and Protection of Privacy Act (MFIPPA), the Freedom of Information and Protection of Privacy Act (FIPPA), or the Personal Information Protection and Electronic Documents Act (PIPEDA).
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>The Service does not collect, receive, or store any student data.</li>
              <li>Students do not interact with the Service directly.</li>
              <li>No student names, grades, Ontario Education Numbers (OENs), or other personally identifiable information should be included in content you provide.</li>
              <li>If you are a public sector institution subject to FIPPA or MFIPPA, or a private sector organization subject to PIPEDA, you are responsible for ensuring that your use of the Service complies with your institution&apos;s policies and applicable privacy legislation.</li>
              <li>School boards and publicly funded educational institutions should consult with their privacy officer before using third-party services that process educational content.</li>
            </ul>
          </section>

          {/* 8 */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-slate-900">8. Your Rights</h2>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-800">8.1 General Rights</h3>
              <p>
                Because {appName} does not maintain user accounts or store personal data on our servers, traditional data subject rights (access, correction, deletion, portability) apply in a limited way:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <span className="font-medium text-slate-700">Access and deletion of quiz data</span> — your quiz data is stored in your browser. You can view it at any time and delete it by clearing your browser&apos;s local storage or using the delete function within the app.
                </li>
                <li>
                  <span className="font-medium text-slate-700">Revoking Google access</span> — you can disconnect {appName} from your Google account at any time through your{" "}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-700 underline underline-offset-2 hover:text-slate-900"
                  >
                    Google account permissions
                  </a>. This immediately revokes our ability to create or modify Google Forms on your behalf.
                </li>
                <li>
                  <span className="font-medium text-slate-700">Clearing cookies</span> — you can delete your authentication cookies at any time through your browser settings, which will sign you out of the Service and remove stored Google tokens.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-800">8.2 Rights Under PIPEDA (Canada)</h3>
              <p>
                Under the Personal Information Protection and Electronic Documents Act (PIPEDA), you have the right to access personal information an organization holds about you, to challenge its accuracy, and to request its correction or deletion. PIPEDA&apos;s ten fair information principles — including accountability, consent, limiting collection, and safeguards — guide our data practices.
              </p>
              <p>
                Because {appName} does not store personal information on our servers, these rights primarily apply to data held locally in your browser (which you control) and data processed by our third-party sub-processors (Anthropic, Google, Vercel), whose own privacy policies govern their retention.
              </p>
              <p>
                If you believe your privacy rights have been violated, you have the right to file a complaint with the{" "}
                <a
                  href="https://www.priv.gc.ca/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 underline underline-offset-2 hover:text-slate-900"
                >
                  Office of the Privacy Commissioner of Canada
                </a>{" "}
                or the{" "}
                <a
                  href="https://www.ipc.on.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 underline underline-offset-2 hover:text-slate-900"
                >
                  Information and Privacy Commissioner of Ontario
                </a>.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-800">8.3 Rights Under FIPPA/MFIPPA (Ontario Public Sector)</h3>
              <p>
                If you are an employee of an Ontario public sector institution (such as a university, college, hospital, or provincial agency) governed by the Freedom of Information and Protection of Privacy Act (FIPPA), or of a municipal institution (such as a school board) governed by the Municipal Freedom of Information and Protection of Privacy Act (MFIPPA), you should be aware that:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>{appName} does not store personal information on its servers, which limits the applicability of access and correction rights under these acts.</li>
                <li>Your institution may have policies governing the use of third-party cloud services. You are responsible for ensuring your use of {appName} complies with those policies.</li>
                <li>Content you submit may be processed by servers located outside of Canada (see Section 10). Some institutional policies restrict the storage or processing of personal information outside of Canada.</li>
              </ul>
            </div>
          </section>

          {/* 9 */}
          <section className="space-y-2">
            <h2 className="text-lg font-medium text-slate-900">9. Google API Services Disclosure</h2>
            <p>
              {appName}&apos;s use of information received from Google APIs adheres to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 underline underline-offset-2 hover:text-slate-900"
              >
                Google API Services User Data Policy
              </a>, including the Limited Use requirements. Specifically:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>We only use Google user data to provide the quiz export functionality you request.</li>
              <li>We do not transfer Google user data to third parties except as necessary to provide the Service (i.e., sending form data to Google&apos;s own APIs).</li>
              <li>We do not use Google user data for advertising or marketing purposes.</li>
              <li>We do not allow humans to read Google user data except where necessary to comply with applicable law, or with the user&apos;s affirmative consent for specific messages.</li>
            </ul>
          </section>

          {/* 10 */}
          <section className="space-y-2">
            <h2 className="text-lg font-medium text-slate-900">10. Cross-Border Data Transfers</h2>
            <p>
              {appName} is operated from Ontario, Canada. However, the Service is hosted on Vercel, whose infrastructure is located in the United States. Additionally, content you provide is transmitted to Anthropic (United States) for AI processing and to Google (United States) for quiz export.
            </p>
            <p>
              As a result, your content may be processed outside of Canada in jurisdictions that may have different privacy laws. Under PIPEDA, organizations may transfer personal information to a third party for processing, but the transferring organization remains responsible for the information. We take reasonable steps to ensure that our third-party service providers maintain comparable privacy protections.
            </p>
            <p>
              By using the Service, you acknowledge and consent to the transfer and processing of your data outside of Canada as described above. If you are subject to FIPPA, MFIPPA, or institutional policies that restrict cross-border data transfers, you should consult with your institution&apos;s privacy officer before using the Service.
            </p>
          </section>

          {/* 11 */}
          <section className="space-y-2">
            <h2 className="text-lg font-medium text-slate-900">11. Data Breach Notification</h2>
            <p>
              Because {appName} does not store personal data on its servers, the risk of a data breach affecting your personal information is minimal. In the unlikely event that a security incident affects encrypted tokens stored in cookies or our service infrastructure, we will:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Investigate the incident promptly</li>
              <li>Notify affected users through the Service if feasible</li>
              <li>Report the breach to the Office of the Privacy Commissioner of Canada as required under PIPEDA&apos;s mandatory breach reporting provisions, and to the Information and Privacy Commissioner of Ontario if applicable under FIPPA</li>
              <li>Take immediate steps to mitigate the impact, including revoking compromised tokens</li>
            </ul>
          </section>

          {/* 12 */}
          <section className="space-y-2">
            <h2 className="text-lg font-medium text-slate-900">12. Do Not Track</h2>
            <p>
              {appName} does not track users across websites or over time. We honor Do Not Track (DNT) browser signals by default because we do not engage in any tracking. We also recognize the Global Privacy Control (GPC) signal, though our data practices already align with the opt-out it requests.
            </p>
          </section>

          {/* 13 */}
          <section className="space-y-2">
            <h2 className="text-lg font-medium text-slate-900">13. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make changes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>The updated policy will be posted on this page with a revised effective date.</li>
              <li>For material changes, we will make reasonable efforts to provide notice through the Service.</li>
              <li>Your continued use of the Service after changes are posted constitutes acceptance of the revised policy.</li>
            </ul>
            <p>
              We encourage you to review this policy periodically.
            </p>
          </section>

          {/* 14 */}
          <section className="space-y-2">
            <h2 className="text-lg font-medium text-slate-900">14. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, your data, or your rights, you can reach us at{" "}
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                className="text-slate-700 underline underline-offset-2 hover:text-slate-900"
              >
                {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
              </a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

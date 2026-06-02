import { useNavigate } from "react-router-dom";

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="font-clash font-bold text-lg tracking-tight text-white mb-3">
      {title}
    </h2>
    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
      {children}
    </div>
  </div>
);

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700,800&display=swap'); .font-clash { font-family: 'Clash Display', sans-serif; } .font-cabinet { font-family: 'Cabinet Grotesk', sans-serif; }`}</style>

      <div className="min-h-screen bg-linear-to-br from-slate-950 via-black to-slate-900 text-white font-cabinet">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate("/")}
            className="text-slate-400 hover:text-white text-sm mb-10 flex items-center gap-2 transition-colors cursor-pointer"
          >
            ← Back to Home
          </button>

          <div className="mb-12 pb-8 border-b border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-5 h-px bg-indigo-500" />
              <span className="font-clash font-bold text-[10px] tracking-[3px] uppercase text-indigo-400">
                Legal
              </span>
            </div>
            <h1 className="font-clash font-bold text-4xl tracking-[-1.5px] text-white mb-2">
              Privacy Policy
            </h1>
            <p className="text-slate-500 text-sm">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-PH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* ── Sections ── */}
          <Section title="1. Overview">
            <p>
              Stud IQ ("we", "us", or "our") operates the website{" "}
              <span className="text-indigo-400">
                student-tool-app.vercel.app
              </span>{" "}
              (the "Service"). This page informs you of our policies regarding
              the collection, use, and disclosure of personal data when you use
              our Service and the choices you have associated with that data.
            </p>
            <p>
              We are committed to protecting your privacy. By using Stud IQ, you
              agree to the collection and use of information in accordance with
              this policy.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>
              We collect the following information to provide and improve our
              Service:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white">Email address:</strong> Required
                to create an account and log in. Your email is used solely for
                authentication and account recovery purposes.
              </li>
              <li>
                <strong className="text-white">Password:</strong> Stored
                securely using industry-standard encryption by Supabase Auth. We
                never store your password in plain text and do not have access
                to it.
              </li>
              <li>
                <strong className="text-white">Display name (optional):</strong>{" "}
                A name or nickname you provide during onboarding to personalize
                your dashboard experience.
              </li>
              <li>
                <strong className="text-white">Study data:</strong> Content you
                create within the Service — to-do items, deadlines, notes,
                materials, and flashcard decks. Sensitive fields (titles,
                content) are encrypted client-side using AES-256-GCM before
                being stored.
              </li>
              <li>
                <strong className="text-white">Usage data:</strong> We may
                collect information on how the Service is accessed and used,
                including your browser type, pages visited, time and date of
                visit, and other diagnostic data.
              </li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Data">
            <p>We use the collected data for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To create and manage your account</li>
              <li>To authenticate you securely when you log in</li>
              <li>To save and sync your personal study data across devices</li>
              <li>To personalize your dashboard experience</li>
              <li>To send account-related emails (e.g. password reset)</li>
              <li>To detect, prevent, and address technical issues</li>
              <li>
                To improve the overall functionality and user experience of our
                Service
              </li>
            </ul>
          </Section>

          <Section title="4. Client-Side Encryption">
            <p>
              Sensitive study data (note titles and content, todo titles,
              deadline titles, material URLs) is encrypted on your device before
              being sent to our servers, using AES-256-GCM via the Web Crypto
              API.
            </p>
            <p>
              The encryption key is derived from your account's unique
              identifier using PBKDF2 (100,000 iterations). This means only you
              — with your authenticated session — can decrypt your own data.
              Even Stud IQ cannot read the content of your encrypted notes or
              tasks.
            </p>
          </Section>

          <Section title="5. Google AdSense & Cookies">
            <p>
              Stud IQ uses Google AdSense to display advertisements. Google
              AdSense uses cookies and similar tracking technologies to serve
              ads based on your prior visits to our website or other websites on
              the internet.
            </p>
            <p>
              You may opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                Google Ads Settings
              </a>
              .
            </p>
            <p>
              For more information on how Google uses data when you use our
              site, please visit{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                Google's Privacy & Terms
              </a>
              .
            </p>
          </Section>

          <Section title="6. Data Storage & Security">
            <p>
              Your account credentials and study data are stored in Supabase, a
              secure cloud database provider. Authentication is handled by
              Supabase Auth, which uses industry-standard encryption and
              security practices.
            </p>
            <p>
              Your data is protected by Row Level Security (RLS) policies —
              meaning your data is only accessible to your authenticated account
              and cannot be read by other users.
            </p>
            <p>
              We retain your data for as long as your account is active. You may
              request deletion of your account and all associated data at any
              time by contacting us.
            </p>
          </Section>

          <Section title="7. Third-Party Services">
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white">Supabase</strong> — database and
                authentication.{" "}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <strong className="text-white">Google AdSense</strong> —
                advertising.{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <strong className="text-white">
                  Open Trivia Database (OpenTDB)
                </strong>{" "}
                — quiz questions.{" "}
                <a
                  href="https://opentdb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  Website
                </a>
              </li>
              <li>
                <strong className="text-white">Formspree</strong> — contact form
                submissions.{" "}
                <a
                  href="https://formspree.io/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <strong className="text-white">Vercel</strong> — hosting.{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              Our Service is intended for use by students. We do not knowingly
              collect personally identifiable information from anyone under the
              age of 13. If you are a parent or guardian and you are aware that
              your child has provided us with personal data, please contact us
              so we can take the necessary steps to remove that information.
            </p>
          </Section>

          <Section title="9. Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and all associated data</li>
              <li>
                Opt out of personalized advertising via Google Ads Settings
              </li>
              <li>Request a copy of your data in a portable format</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us via our{" "}
              <a
                href="/contact"
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                contact page
              </a>
              .
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last updated" date.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a
                href="/contact"
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                our contact page
              </a>
              .
            </p>
          </Section>

          <div className="pt-8 border-t border-white/10 flex flex-wrap gap-4 text-xs text-slate-500">
            {[
              { label: "Terms of Service", to: "/terms-of-service" },
              { label: "Contact", to: "/contact" },
              { label: "Back to Home", to: "/" },
            ].map(({ label, to }) => (
              <button
                key={to}
                onClick={() => navigate(to)}
                className="hover:text-slate-300 cursor-pointer transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;

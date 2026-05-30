import Link from "next/link";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

const sections = [
  { id: "data-collection", title: "1. Data Collection" },
  { id: "usage", title: "2. How We Use Your Data" },
  { id: "sharing", title: "3. Data Sharing" },
  { id: "security", title: "4. Security" },
  { id: "rights", title: "5. Your Rights" },
  { id: "cookies", title: "6. Cookies and Tracking" },
  { id: "retention", title: "7. Data Retention" },
  { id: "children", title: "8. Children's Privacy" },
  { id: "changes", title: "9. Changes to This Policy" },
  { id: "contact", title: "10. Contact" },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        <ScrollReveal>
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-soft-white font-playfair sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Last updated: January 2025
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Your privacy matters to us. This policy explains how Khmer Store
              collects, uses, and protects your personal information when you
              use our platform.
            </p>
          </div>
        </ScrollReveal>

        <div className="flex gap-10">
          {/* Table of Contents - Desktop Sidebar */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-24">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                On this page
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-xs text-muted-foreground hover:text-accent-gold transition-colors py-1 border-l-2 border-white/[0.06] pl-3 hover:border-accent-gold"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-10 text-muted-foreground leading-relaxed">
            <section id="data-collection">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                1. Data Collection
              </h2>
              <p className="mb-3">
                We collect information you provide directly when using Khmer Store,
                as well as information generated through your use of the platform:
              </p>
              <h3 className="text-sm font-medium text-soft-white mt-4 mb-2">
                Information You Provide
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-sm ml-2">
                <li>Account information: name, email address, phone number</li>
                <li>Profile data: avatar, display name, location, bio</li>
                <li>
                  Listing content: photos, descriptions, prices, locations
                </li>
                <li>Messages exchanged with other users</li>
                <li>Support requests and feedback</li>
              </ul>
              <h3 className="text-sm font-medium text-soft-white mt-4 mb-2">
                Information Collected Automatically
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-sm ml-2">
                <li>Device information: browser type, operating system</li>
                <li>Usage data: pages visited, features used, search queries</li>
                <li>IP address and approximate location</li>
                <li>Session duration and interaction patterns</li>
              </ul>
            </section>

            <section id="usage">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                2. How We Use Your Data
              </h2>
              <p className="mb-3">Your information is used to:</p>
              <ul className="list-disc list-inside space-y-1.5 text-sm ml-2">
                <li>Provide and maintain our marketplace services</li>
                <li>Facilitate communication between buyers and sellers</li>
                <li>
                  Send notifications about your listings, messages, and account
                </li>
                <li>Prevent fraud, abuse, and unauthorized access</li>
                <li>Improve and personalize your experience</li>
                <li>Analyze platform usage to develop new features</li>
                <li>Comply with legal obligations</li>
                <li>
                  Enforce our Terms of Service and protect user safety
                </li>
              </ul>
            </section>

            <section id="sharing">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                3. Data Sharing
              </h2>
              <p className="mb-3">
                We do not sell your personal information to third parties. We may
                share limited data in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-sm ml-2">
                <li>
                  <span className="text-soft-white">Service providers:</span>{" "}
                  Companies that help us operate the platform (hosting,
                  authentication, email delivery)
                </li>
                <li>
                  <span className="text-soft-white">Other users:</span> Your
                  public profile information and listings are visible to other
                  users
                </li>
                <li>
                  <span className="text-soft-white">Legal requirements:</span>{" "}
                  When required by law, regulation, or legal process
                </li>
                <li>
                  <span className="text-soft-white">Safety:</span> To protect
                  the rights, property, or safety of our users and the public
                </li>
              </ul>
            </section>

            <section id="security">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                4. Security
              </h2>
              <p className="mb-3">
                We take the security of your data seriously and implement
                industry-standard measures to protect it:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-sm ml-2">
                <li>Encryption of data in transit (TLS/SSL) and at rest</li>
                <li>Secure authentication with hashed passwords</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls limiting employee data access</li>
                <li>Automated monitoring for suspicious activity</li>
              </ul>
              <p className="mt-3">
                However, no method of transmission over the internet is completely
                secure. We encourage you to use strong, unique passwords and be
                cautious when sharing personal information publicly.
              </p>
            </section>

            <section id="rights">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                5. Your Rights
              </h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1.5 text-sm ml-2">
                <li>
                  <span className="text-soft-white">Access</span> your personal
                  data we hold about you
                </li>
                <li>
                  <span className="text-soft-white">Correct</span> inaccurate or
                  incomplete information
                </li>
                <li>
                  <span className="text-soft-white">Delete</span> your account
                  and associated data
                </li>
                <li>
                  <span className="text-soft-white">Export</span> your data in a
                  portable format
                </li>
                <li>
                  <span className="text-soft-white">Opt out</span> of
                  non-essential communications
                </li>
                <li>
                  <span className="text-soft-white">Restrict</span> processing
                  of your data in certain circumstances
                </li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, visit your account settings or
                contact us at support@khmerstore.com. We will respond to your
                request within 30 days.
              </p>
            </section>

            <section id="cookies">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                6. Cookies and Tracking
              </h2>
              <p className="mb-3">We use the following types of cookies:</p>
              <ul className="list-disc list-inside space-y-1.5 text-sm ml-2">
                <li>
                  <span className="text-soft-white">Essential cookies:</span>{" "}
                  Required for authentication and basic platform functionality
                </li>
                <li>
                  <span className="text-soft-white">Preference cookies:</span>{" "}
                  Remember your settings and preferences (e.g., language, theme)
                </li>
                <li>
                  <span className="text-soft-white">Analytics cookies:</span>{" "}
                  Aggregate data about platform usage to improve our services
                </li>
              </ul>
              <p className="mt-3">
                We do not use third-party tracking cookies for advertising
                purposes. You can manage cookie preferences through your browser
                settings.
              </p>
            </section>

            <section id="retention">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                7. Data Retention
              </h2>
              <p>
                We retain your personal data for as long as your account is active
                or as needed to provide you with our services. When you delete your
                account, we will delete or anonymize your personal data within 30
                days, except where retention is required by law (e.g., for tax,
                legal, or fraud prevention purposes). Listing data and messages may
                be retained in anonymized form for analytics.
              </p>
            </section>

            <section id="children">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                8. Children&apos;s Privacy
              </h2>
              <p>
                Khmer Store is not intended for users under the age of 18. We do
                not knowingly collect personal information from children. If we
                discover that we have collected information from a child under 18,
                we will delete it promptly. If you believe a child has provided us
                with personal information, please contact us immediately.
              </p>
            </section>

            <section id="changes">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                9. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices, technology, or legal requirements. We
                will notify you of significant changes via email or a prominent
                notice on the platform at least 14 days before they take effect.
                We encourage you to review this policy periodically.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                10. Contact
              </h2>
              <p>
                If you have questions about this Privacy Policy, wish to exercise
                your data rights, or have concerns about how we handle your
                information, please contact us at support@khmerstore.com or visit
                our{" "}
                <Link
                  href="/contact"
                  className="text-accent-gold hover:underline"
                >
                  Contact page
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-soft-white font-playfair">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: January 2025
        </p>

        <div className="mt-8 space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              1. Information We Collect
            </h2>
            <p className="mb-3">
              We collect information you provide directly when using Khmer Store:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Account information: name, email address, phone number</li>
              <li>Profile data: avatar, display name, bio</li>
              <li>Listing content: photos, descriptions, prices, locations</li>
              <li>Messages exchanged with other users</li>
              <li>Usage data: pages visited, features used, search queries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              2. How We Use Your Information
            </h2>
            <p className="mb-3">
              Your information is used to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Provide and maintain our marketplace services</li>
              <li>Facilitate communication between buyers and sellers</li>
              <li>Send notifications about your listings and messages</li>
              <li>Prevent fraud, abuse, and unauthorized access</li>
              <li>Improve and personalize your experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              3. Information Sharing
            </h2>
            <p>
              We do not sell your personal information. We may share limited data
              with service providers who help us operate the platform (such as
              hosting and authentication services). Your public profile
              information and listings are visible to other users of the
              platform. We may disclose information if required by law or to
              protect the rights and safety of our users.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              4. Data Storage and Security
            </h2>
            <p>
              Your data is stored securely using industry-standard encryption and
              security practices. We use Supabase for data storage, which
              provides enterprise-grade security including encryption at rest and
              in transit. However, no method of transmission over the internet is
              completely secure. We encourage you to use strong passwords and be
              cautious when sharing personal information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              5. Your Rights
            </h2>
            <p className="mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Export your data</li>
              <li>Opt out of non-essential communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              6. Cookies and Tracking
            </h2>
            <p>
              We use essential cookies to maintain your session and
              authentication state. We do not use third-party tracking cookies
              for advertising purposes. Analytics data is collected in aggregate
              to improve the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              7. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify
              you of significant changes via email or a prominent notice on the
              platform. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              8. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or wish to exercise
              your data rights, please contact us at support@khmerstore.com or
              visit our{" "}
              <a href="/contact" className="text-accent-gold hover:underline">
                Contact page
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

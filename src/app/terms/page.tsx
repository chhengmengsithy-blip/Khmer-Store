export default function TermsPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-soft-white font-playfair">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: January 2025
        </p>

        <div className="mt-8 space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              1. Introduction
            </h2>
            <p>
              Welcome to Khmer Store. By accessing or using our platform, you
              agree to be bound by these Terms of Service. Khmer Store provides
              an online marketplace where users in Cambodia can post and browse
              classified listings for goods and services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              2. User Accounts
            </h2>
            <p>
              You must create an account to post listings or send messages. You
              are responsible for maintaining the security of your account
              credentials and for all activities that occur under your account.
              You must provide accurate and complete information when creating
              your account and keep it updated.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              3. Listings and Content
            </h2>
            <p>
              Users may post listings for items and services they wish to sell or
              offer. All listings must be accurate, truthful, and not misleading.
              You retain ownership of the content you post but grant Khmer Store
              a non-exclusive license to display it on the platform. We reserve
              the right to remove any listing that violates these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              4. Prohibited Items and Conduct
            </h2>
            <p className="mb-3">
              You may not list items that are illegal, stolen, counterfeit, or
              otherwise prohibited by Cambodian law. Prohibited items include but
              are not limited to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Weapons and ammunition</li>
              <li>Controlled substances and drugs</li>
              <li>Counterfeit or stolen goods</li>
              <li>Items that infringe intellectual property rights</li>
              <li>Hazardous materials</li>
              <li>Adult content or services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              5. Transactions
            </h2>
            <p>
              Khmer Store is a platform that facilitates connections between
              buyers and sellers. We do not participate in, guarantee, or insure
              any transaction. Users are solely responsible for evaluating the
              quality, safety, legality, and suitability of items before
              purchasing. We recommend meeting in safe, public locations for
              in-person transactions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              6. Account Termination
            </h2>
            <p>
              We may suspend or terminate your account at our discretion if you
              violate these terms, engage in fraudulent activity, or behave in a
              manner that is harmful to other users or the platform. You may
              delete your account at any time through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              Khmer Store is provided &quot;as is&quot; without warranties of any
              kind. We are not liable for any damages arising from your use of
              the platform, including but not limited to direct, indirect,
              incidental, or consequential damages. Our total liability shall not
              exceed the amount you have paid us in the preceding 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              8. Changes to Terms
            </h2>
            <p>
              We may update these Terms of Service from time to time. We will
              notify users of significant changes via email or a notice on the
              platform. Continued use of Khmer Store after changes take effect
              constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              9. Contact
            </h2>
            <p>
              If you have questions about these Terms of Service, please contact
              us at support@khmerstore.com or visit our{" "}
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

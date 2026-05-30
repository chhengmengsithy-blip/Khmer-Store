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
              Welcome to Khmer Store. By using our platform, you agree to these
              Terms of Service. Khmer Store provides a marketplace where users
              can post and browse classified listings for goods and services in
              Cambodia.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              2. User Accounts
            </h2>
            <p>
              You must create an account to post listings or send messages. You
              are responsible for maintaining the security of your account and
              for all activities that occur under your account. You must provide
              accurate information when creating your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              3. Listings
            </h2>
            <p>
              Users may post listings for items and services they wish to sell.
              Listings must be accurate and not misleading. Khmer Store does not
              guarantee any transaction between buyers and sellers. Users are
              responsible for their own transactions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              4. Prohibited Items
            </h2>
            <p>
              You may not list items that are illegal, stolen, counterfeit, or
              otherwise prohibited by Cambodian law. This includes but is not
              limited to weapons, controlled substances, and items that infringe
              on intellectual property rights.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              5. Limitation of Liability
            </h2>
            <p>
              Khmer Store is a platform that connects buyers and sellers. We do
              not participate in transactions and are not responsible for the
              quality, safety, or legality of items listed. We are not liable for
              any damages arising from your use of the platform or transactions
              with other users.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

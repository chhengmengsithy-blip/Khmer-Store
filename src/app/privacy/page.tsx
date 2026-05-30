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
              Information We Collect
            </h2>
            <p>
              We collect information you provide when creating an account (name,
              email, phone number), posting listings (listing content, photos,
              location), and communicating with other users through our platform.
              We also collect basic usage data to improve our service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              How We Use It
            </h2>
            <p>
              Your information is used to provide and improve our marketplace
              services, facilitate communication between buyers and sellers,
              prevent fraud and abuse, and send you relevant notifications about
              your account and listings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              Data Security
            </h2>
            <p>
              We implement appropriate security measures to protect your personal
              information. However, no method of transmission over the internet
              is completely secure. We encourage you to use strong passwords and
              be cautious when sharing personal information with other users.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-soft-white mb-3">
              Contact
            </h2>
            <p>
              If you have questions about this Privacy Policy or wish to exercise
              your data rights, please contact us at support@khmerstore.com or
              visit our Contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

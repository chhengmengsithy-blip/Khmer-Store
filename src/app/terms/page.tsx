import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

export const metadata: Metadata = {
  title: "Terms of Service | Khmer Store",
  description:
    "Read the terms and conditions for using Khmer Store marketplace.",
};

const sections = [
  { id: "introduction", title: "1. Introduction" },
  { id: "user-accounts", title: "2. User Accounts" },
  { id: "listings-content", title: "3. Listings and Content" },
  { id: "prohibited-items", title: "4. Prohibited Items and Conduct" },
  { id: "transactions", title: "5. Transactions" },
  { id: "messaging", title: "6. Messaging" },
  { id: "intellectual-property", title: "7. Intellectual Property" },
  { id: "termination", title: "8. Account Termination" },
  { id: "liability", title: "9. Limitation of Liability" },
  { id: "changes", title: "10. Changes to Terms" },
  { id: "contact", title: "11. Contact" },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        <ScrollReveal>
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-soft-white font-playfair sm:text-4xl">
              Terms of Service
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Last updated: January 2025
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Please read these Terms of Service carefully before using Khmer
              Store. By accessing or using our platform, you agree to be bound
              by these terms.
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
            <section id="introduction">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                1. Introduction
              </h2>
              <p>
                Welcome to Khmer Store. By accessing or using our platform, you
                agree to be bound by these Terms of Service. Khmer Store provides
                an online marketplace where users in Cambodia can post and browse
                classified listings for goods and services. These terms govern
                your use of our website, mobile applications, and all related
                services.
              </p>
            </section>

            <section id="user-accounts">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                2. User Accounts
              </h2>
              <p className="mb-3">
                You must create an account to post listings or send messages. When
                creating an account, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-sm ml-2">
                <li>
                  Provide accurate, current, and complete information
                </li>
                <li>
                  Maintain and update your information to keep it accurate
                </li>
                <li>
                  Maintain the security of your account credentials
                </li>
                <li>
                  Accept responsibility for all activities under your account
                </li>
                <li>
                  Notify us immediately of any unauthorized use
                </li>
              </ul>
              <p className="mt-3">
                You must be at least 18 years of age to create an account and use
                our services.
              </p>
            </section>

            <section id="listings-content">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                3. Listings and Content
              </h2>
              <p className="mb-3">
                Users may post listings for items and services they wish to sell or
                offer. All listings must be:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-sm ml-2">
                <li>Accurate, truthful, and not misleading</li>
                <li>For items you legally own or have authority to sell</li>
                <li>In the appropriate category</li>
                <li>Free of offensive, obscene, or harmful content</li>
              </ul>
              <p className="mt-3">
                You retain ownership of the content you post but grant Khmer Store
                a non-exclusive, worldwide license to display, distribute, and
                promote it on the platform. We reserve the right to remove any
                listing that violates these terms without prior notice.
              </p>
            </section>

            <section id="prohibited-items">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                4. Prohibited Items and Conduct
              </h2>
              <p className="mb-3">
                You may not list items that are illegal, stolen, counterfeit, or
                otherwise prohibited by Cambodian law. Prohibited items include
                but are not limited to:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-sm ml-2">
                <li>Weapons, ammunition, and explosives</li>
                <li>Controlled substances and illegal drugs</li>
                <li>Counterfeit or stolen goods</li>
                <li>Items that infringe intellectual property rights</li>
                <li>Hazardous materials and toxic substances</li>
                <li>Adult content or services</li>
                <li>Wildlife, endangered species, or their products</li>
                <li>Human remains or body parts</li>
              </ul>
              <p className="mt-3">
                Prohibited conduct includes spamming, scamming, price
                manipulation, harassment of other users, and creating multiple
                accounts to circumvent bans or restrictions.
              </p>
            </section>

            <section id="transactions">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                5. Transactions
              </h2>
              <p>
                Khmer Store is a platform that facilitates connections between
                buyers and sellers. We do not participate in, guarantee, or insure
                any transaction between users. Users are solely responsible for
                evaluating the quality, safety, legality, and suitability of items
                before purchasing. We strongly recommend meeting in safe, public
                locations for in-person transactions and never sending payment
                before receiving an item.
              </p>
            </section>

            <section id="messaging">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                6. Messaging
              </h2>
              <p>
                Our messaging system is provided for legitimate communication
                between buyers and sellers regarding listings on the platform. You
                may not use messaging to send unsolicited advertisements, spam,
                phishing attempts, or any form of harassment. We reserve the right
                to monitor messages for safety purposes and may suspend accounts
                that violate messaging policies.
              </p>
            </section>

            <section id="intellectual-property">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                7. Intellectual Property
              </h2>
              <p>
                The Khmer Store name, logo, website design, and all related
                content are protected by intellectual property laws. You may not
                copy, modify, distribute, or create derivative works from our
                platform without written permission. User-generated content
                remains the property of the respective users, subject to the
                license granted in Section 3.
              </p>
            </section>

            <section id="termination">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                8. Account Termination
              </h2>
              <p>
                We may suspend or terminate your account at our discretion if you
                violate these terms, engage in fraudulent activity, or behave in a
                manner harmful to other users or the platform. Upon termination,
                your right to access the platform ceases immediately, and we may
                delete your content and data. You may delete your account at any
                time through your account settings.
              </p>
            </section>

            <section id="liability">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                9. Limitation of Liability
              </h2>
              <p>
                Khmer Store is provided &quot;as is&quot; without warranties of
                any kind, express or implied. We are not liable for any damages
                arising from your use of the platform, including but not limited
                to direct, indirect, incidental, consequential, or punitive
                damages. Our total aggregate liability shall not exceed the amount
                you have paid us in the preceding 12 months, if any.
              </p>
            </section>

            <section id="changes">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                10. Changes to Terms
              </h2>
              <p>
                We may update these Terms of Service from time to time to reflect
                changes in our practices or for legal, regulatory, or operational
                reasons. We will notify users of significant changes via email or
                a prominent notice on the platform at least 14 days before the
                changes take effect. Continued use of Khmer Store after changes
                become effective constitutes acceptance of the revised terms.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-lg font-semibold text-soft-white mb-3">
                11. Contact
              </h2>
              <p>
                If you have questions about these Terms of Service, please contact
                us at support@khmerstore.com or visit our{" "}
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

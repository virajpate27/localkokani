// src/app/terms/page.js
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata = {
  title: "Terms of Service | Local Kokani",
  description: "The terms and conditions governing your use of Local Kokani.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <div className="bg-white">
        <Breadcrumbs items={[{ name: "Terms of Service", url: "/terms" }]} />
      </div>

      <section className="py-16 bg-white">
        <div className="container-custom max-w-3xl">
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-primary mb-2">
            Terms of Service
          </h1>
          <p className="text-gray-400 text-sm mb-10">Last updated: August 2026</p>

          <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-primary prose-a:text-secondary">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Local Kokani ("the Platform"), you agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use the Platform.
            </p>

            <h2>2. What Local Kokani Is</h2>
            <p>
              Local Kokani is a discovery and connection platform that helps travelers find hotels and
              restaurants, and facilitates enquiries between travelers and property owners via WhatsApp.
              Local Kokani does not process payments for bookings, does not act as a booking agent, and is
              not a party to any agreement between a traveler and a hotel or restaurant. All booking
              confirmations, pricing, and terms of stay are determined directly between the traveler and
              the property.
            </p>

            <h2>3. Accuracy of Listings</h2>
            <p>
              While we make reasonable efforts to verify listing information, Local Kokani does not
              guarantee the accuracy, completeness, or current availability of any hotel or restaurant
              listing. Prices, amenities, and availability are subject to change without notice and
              should be confirmed directly with the property.
            </p>

            <h2>4. User Conduct</h2>
            <p>When using Local Kokani, you agree not to:</p>
            <ul>
              <li>Submit false, misleading, or fraudulent information in any form, enquiry, or review</li>
              <li>Use the Platform for any unlawful purpose</li>
              <li>Attempt to interfere with the security or proper functioning of the Platform</li>
              <li>Scrape, copy, or republish content from the Platform without permission</li>
            </ul>

            <h2>5. Reviews</h2>
            <p>
              Reviews submitted on Local Kokani are moderated before publication and should reflect a
              genuine experience with the listed property. We reserve the right to remove any review that
              violates these terms or is found to be inauthentic.
            </p>

            <h2>6. Partner Listings & Promotions</h2>
            <p>
              Property owners who register as partners agree to provide accurate listing information and
              to honor enquiries and bookings made through the Platform in good faith. Featured and
              Sponsored placements are paid promotional services governed by the pricing and duration
              selected at the time of purchase; Local Kokani reserves the right to approve, reject, or end
              a promotion at its discretion, including in cases of policy violations.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              Local Kokani is not liable for any disputes, losses, or damages arising from a booking,
              reservation, or interaction between a traveler and a property listed on the Platform.
              Travelers are responsible for verifying details directly with the property before making
              travel arrangements.
            </p>

            <h2>8. Intellectual Property</h2>
            <p>
              All content on Local Kokani, including text, graphics, logos, and design, is the property of
              Local Kokani or its content partners and may not be reproduced without permission.
            </p>

            <h2>9. Changes to These Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Continued use of the Platform after
              changes are posted constitutes acceptance of the revised terms.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              Questions about these Terms? Reach out via our <a href="/contact">Contact page</a> or email{" "}
              <a href="mailto:hello@Local Kokani.com">hello@Local Kokani.com</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
// src/app/privacy-policy/page.js
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata = {
  title: "Privacy Policy | StayFinder",
  description: "How StayFinder collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="bg-white">
        <Breadcrumbs items={[{ name: "Privacy Policy", url: "/privacy-policy" }]} />
      </div>

      <section className="py-16 bg-white">
        <div className="container-custom max-w-3xl">
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-primary mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-sm mb-10">Last updated: August 2026</p>

          <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-primary prose-a:text-secondary">
            <h2>1. Information We Collect</h2>
            <p>
              When you use StayFinder, we may collect information you provide directly to us, such as
              your name, phone number, email address, and travel preferences when you submit an enquiry,
              write a review, or register as a partner. We also automatically collect certain technical
              information, including your IP address and browsing behavior on our site, to help us
              improve our services and detect fraudulent activity.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Connect you with hotels and restaurants via WhatsApp for enquiries and reservations</li>
              <li>Process and manage partner registration applications</li>
              <li>Respond to your questions and provide customer support</li>
              <li>Improve our website, search functionality, and overall user experience</li>
              <li>Send you relevant updates, if you've opted in to receive them</li>
              <li>Detect, prevent, and address technical issues or fraudulent activity</li>
            </ul>

            <h2>3. Sharing Your Information</h2>
            <p>
              We share the information you submit through an enquiry or reservation form directly with
              the relevant hotel or restaurant, since this is necessary to fulfill your request. We do
              not sell your personal information to third parties. We may share information with service
              providers who help us operate our platform (such as our hosting and cloud storage providers),
              solely for the purpose of running StayFinder.
            </p>

            <h2>4. Data Storage & Security</h2>
            <p>
              Your data is stored securely using industry-standard cloud infrastructure. While we take
              reasonable steps to protect your information, no method of electronic storage or
              transmission is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2>5. Cookies & Tracking</h2>
            <p>
              We use browser storage (such as local storage) to remember your preferences, like items
              saved to your wishlist, without requiring you to create an account. This data stays on
              your device and is not shared with third parties.
            </p>

            <h2>6. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal information at any
              time by contacting us at{" "}
              <a href="mailto:hello@StayFinder.com">hello@StayFinder.com</a>. If you registered as a
              partner or created an owner account, you can update your details directly through your
              dashboard.
            </p>

            <h2>7. Children's Privacy</h2>
            <p>
              StayFinder is not directed at individuals under the age of 18. We do not knowingly collect
              personal information from children.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this
              page with an updated "Last updated" date.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please reach out via our{" "}
              <a href="/contact">Contact page</a> or email us at{" "}
              <a href="mailto:hello@StayFinder.com">hello@StayFinder.com</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
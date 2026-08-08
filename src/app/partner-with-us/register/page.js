// src/app/partner-with-us/register/page.js
import PartnerRegistrationForm from "@/components/partner/PartnerRegistrationForm";

export const metadata = {
  title: "Partner Registration | StayFinder",
  robots: { index: false, follow: true },
};

export default function PartnerRegisterPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container-custom">
        <PartnerRegistrationForm />
      </div>
    </div>
  );
}
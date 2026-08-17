// src/app/contact/page.js
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ContactForm from "@/components/contact/ContactForm";


export const metadata = {
  title: "Contact Us | StayFinder",
  description: "Get in touch with the StayFinder team — questions, feedback, or partnership enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <>
      <div className="bg-white">
        <Breadcrumbs items={[{ name: "Contact", url: "/contact" }]} />
      </div>

      <section className="bg-hero-gradient py-14">
        <div className="container-custom text-center">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white">Get in Touch</h1>
          <p className="text-white/80 mt-4 max-w-xl mx-auto">
            Questions about a booking, a partnership, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10">
          {/* Contact Info */}
          <div className="space-y-5">
            <div className="card p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <FaWhatsapp className="text-accent-dark text-xl" />
              </div>
              <div>
                <p className="font-medium text-primary">WhatsApp</p>
                <p className="text-gray-500 text-sm mt-1">Fastest way to reach us for booking help</p>
                {whatsappNumber && (
                  
                  <a  href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary text-sm font-medium hover:underline mt-1 inline-block"
                  >
                    Chat with us →
                  </a>
                )}
              </div>
            </div>

            <div className="card p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                <FiMail className="text-secondary text-xl" />
              </div>
              <div>
                <p className="font-medium text-primary">Email</p>
                <p className="text-gray-500 text-sm mt-1">For general enquiries and partnerships</p>
                <a href="mailto:hello@stayfinder.com" className="text-secondary text-sm font-medium hover:underline mt-1 inline-block">
                  hello@stayfinder.com
                </a>
              </div>
            </div>

            <div className="card p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FiMapPin className="text-primary text-xl" />
              </div>
              <div>
                <p className="font-medium text-primary">Response Time</p>
                <p className="text-gray-500 text-sm mt-1">
                  We typically respond within 24-48 hours. WhatsApp is fastest for urgent booking questions.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <ContactForm />
        </div>
      </section>
    </>
  );
}
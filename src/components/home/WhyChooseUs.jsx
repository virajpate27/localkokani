// src/components/home/WhyChooseUs.jsx
import { FiCheckCircle, FiPhoneCall, FiDollarSign, FiShield } from "react-icons/fi";
import { FaIndianRupeeSign } from "react-icons/fa6";


const features = [
  {
    icon: FiCheckCircle,
    title: "Verified Stays",
    desc: "Every hotel & restaurant is personally vetted for quality and cleanliness.",
  },
  {
    icon: FaIndianRupeeSign,
    title: "Best Price Promise",
    desc: "Transparent pricing with zero hidden charges, ever.",
  },
  {
    icon: FiPhoneCall,
    title: "Instant Support",
    desc: "Message us directly on WhatsApp — real replies, real fast.",
  },
  {
    icon: FiShield,
    title: "Safe & Secure",
    desc: "Your data and enquiries are handled with full privacy.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-14 bg-blue-50 dark:bg-gray-900">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Why StayFinder
          </span>
          <h2 className="section-title mt-2">
            Booking Made Simple & Trustworthy
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4  gap-4 sm:gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="card p-4 sm:p-7 text-center hover:-translate-y-1"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <f.icon className="text-primary dark:text-white text-base sm:text-2xl" />
              </div>
              <h3 className="font-display font-semibold text-lg text-primary dark:text-white">
                {f.title}
              </h3>
              <p className="dark:text-gray-500 text-sm mt-2 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
// src/components/contact/ContactForm.jsx
"use client";

import { useState } from "react";
import { FiUser, FiMail, FiMessageSquare, FiSend, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { createContactMessage } from "@/lib/services/contactService";
import { useMathCaptcha } from "@/hooks/useMathCaptcha"; // ⬅️ ADD
import MathCaptcha from "@/components/ui/MathCaptcha"; // ⬅️ ADD


const initialFormState = { name: "", email: "", subject: "", message: "" };

export default function ContactForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const captcha = useMathCaptcha(); 

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) e.email = "Enter a valid email";
    if (!formData.message.trim()) e.message = "Please write a message";
    else if (formData.message.trim().length < 10) e.message = "Please write a bit more";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    if (!captcha.validate()) { // ⬅️ ADD
      return;
    }

    setIsSubmitting(true);
    try {
      await createContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || "General Enquiry",
        message: formData.message.trim(),
      });
      setSubmitted(true);
      setFormData(initialFormState);
      captcha.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="card p-8 text-center">
        <FiCheckCircle className="text-accent-dark text-3xl mx-auto mb-3" />
        <h3 className="font-display font-semibold text-lg text-primary">Message Sent!</h3>
        <p className="text-gray-500 text-sm mt-2">
          Thanks for reaching out — we'll get back to you within 24-48 hours.
        </p>
        <button onClick={() => setSubmitted(false)} className="text-secondary text-sm font-medium mt-4 hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-4">
      <div>
        <label htmlFor="contact-name" className="sr-only">Full Name</label>
        <div className="relative">
          <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="contact-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
              errors.name ? "border-red-300" : "border-gray-200 focus:border-secondary"
            }`}
          />
        </div>
        {errors.name && <p className="text-red-500 text-xs mt-1" role="alert">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="contact-email" className="sr-only">Email Address</label>
        <div className="relative">
          <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="contact-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
              errors.email ? "border-red-300" : "border-gray-200 focus:border-secondary"
            }`}
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1" role="alert">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="contact-subject" className="sr-only">Subject</label>
        <input
          id="contact-subject"
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject (optional)"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none transition-colors"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="sr-only">Message</label>
        <div className="relative">
          <FiMessageSquare className="absolute left-3.5 top-3.5 text-gray-400" />
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            placeholder="How can we help?"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none ${
              errors.message ? "border-red-300" : "border-gray-200 focus:border-secondary"
            }`}
          />
        </div>
        {errors.message && <p className="text-red-500 text-xs mt-1" role="alert">{errors.message}</p>}
      </div>

       <MathCaptcha captcha={captcha} />

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
        <FiSend className="text-sm" />
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
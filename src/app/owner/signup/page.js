// src/app/owner/signup/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { useOwnerAuth } from "@/context/OwnerAuthContext";

export default function OwnerSignupPage() {
  const router = useRouter();
  const { signup } = useOwnerAuth();
  const [formData, setFormData] = useState({
    fullName: "", email: "", mobile: "", whatsapp: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) e.email = "Enter a valid email";
    if (!/^\d{10}$/.test(formData.mobile.trim())) e.mobile = "Enter a valid 10-digit number";
    if (!/^\d{10}$/.test(formData.whatsapp.trim())) e.whatsapp = "Enter a valid 10-digit number";
    if (formData.password.length < 6) e.password = "Minimum 6 characters";
    if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await signup({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        whatsapp: formData.whatsapp.trim(),
        password: formData.password,
      });
      toast.success("Account created!");
      router.push("/owner/dashboard");
    } catch (error) {
      console.error("Signup error:", error.code);
      if (error.code === "auth/email-already-in-use") {
        setErrors({ email: "This email is already registered" });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none transition-colors";
  const errorClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-red-300 text-sm outline-none transition-colors";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display font-bold text-2xl text-primary">
            Stay<span className="text-accent-dark">Finder</span>
          </Link>
          <p className="text-gray-400 text-sm mt-2">Partner Portal</p>
        </div>

        <div className="card p-8">
          <h1 className="font-display font-bold text-2xl text-primary text-center">Create Owner Account</h1>
          <p className="text-gray-400 text-sm text-center mt-2 mb-8">
            Register properties and track applications from your dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className={errors.fullName ? errorClass : inputClass} />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email address" className={errors.email ? errorClass : inputClass} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile" className={errors.mobile ? errorClass : inputClass} />
                </div>
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>
              <div>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="WhatsApp" className={errors.whatsapp ? errorClass : inputClass} />
                </div>
                {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
              </div>
            </div>

            <div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password (min. 6 characters)"
                  className={errors.password ? errorClass.replace("pr-4", "pr-10") : inputClass.replace("pr-4", "pr-10")}
                />
                <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={errors.confirmPassword ? errorClass : inputClass}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account? <Link href="/owner/login" className="text-secondary font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
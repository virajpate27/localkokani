// src/components/partner/PartnerRegistrationForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FiArrowLeft, FiArrowRight, FiLoader, FiUpload, FiCheckCircle, FiExternalLink,
} from "react-icons/fi";
import PartnerProgressBar from "./PartnerProgressBar";
import PartnerRoomTypesEditor from "./PartnerRoomTypesEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import { createPartnerApplication } from "@/lib/services/partnerService";
import { useOwnerAuth } from "@/context/OwnerAuthContext";

import { useMathCaptcha } from "@/hooks/useMathCaptcha"; // ⬅️ ADD
import MathCaptcha from "@/components/ui/MathCaptcha"; // ⬅️ ADD



const initialFormData = {
  ownerFullName: "", ownerMobile: "", ownerWhatsapp: "", ownerEmail: "", ownerAltContact: "",
  propertyName: "", propertyType: "hotel", propertyDescription: "",
  totalRooms: "", maxGuestCapacity: "", seatingCapacity: "", cuisineTypes: "",
  address: "", village: "", taluka: "", district: "", state: "Maharashtra", pincode: "",
  googleBusinessLink: "", nearbyAttractions: "",
  roomTypes: [],
  photosLink: "",
  checkInTime: "12:00", checkOutTime: "10:00",
  cancellationPolicy: "", childPolicy: "", petPolicy: "",
  idRequired: "yes", couplesAllowed: "yes",
  plan: "basic",
  declarationAccepted: false,
  acceptOwnerAuthorized: false, acceptInfoAccurate: false, acceptPartnerAgreement: false,
  acceptTerms: false, acceptPrivacyPolicy: false, acceptCommission: false,
};

const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none transition-colors";
const errorInputClass = "w-full px-4 py-3 rounded-xl border border-red-300 text-sm outline-none transition-colors";
const labelClass = "block text-sm font-medium text-gray-700 mb-2";


export default function PartnerRegistrationForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { owner, ownerProfile } = useOwnerAuth();
  const [formData, setFormData] = useState({
    ownerFullName: ownerProfile?.fullName || "",
    ownerMobile: ownerProfile?.mobile || "",
    ownerWhatsapp: ownerProfile?.whatsapp || "",
    ownerEmail: ownerProfile?.email || "",
    ownerAltContact: "",
    ...initialFormData,
  });
  const [idProof, setIdProof] = useState(null);
  const [ownershipProof, setOwnershipProof] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const captcha = useMathCaptcha();

  const isHotel = formData.propertyType === "hotel";
  const hiddenSteps = isHotel ? [] : [4]; // restaurants skip the "Accommodation" step
  const totalSteps = 10;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const nextVisibleStep = (current, direction) => {
    let next = current + direction;
    while (hiddenSteps.includes(next) && next >= 1 && next <= totalSteps) {
      next += direction;
    }
    return next;
  };

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!formData.ownerFullName.trim()) e.ownerFullName = "Required";
      if (!/^\d{10}$/.test(formData.ownerMobile.trim())) e.ownerMobile = "Enter a valid 10-digit number";
      if (!/^\d{10}$/.test(formData.ownerWhatsapp.trim())) e.ownerWhatsapp = "Enter a valid 10-digit number";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail.trim())) e.ownerEmail = "Enter a valid email";
    }
    if (step === 2) {
      if (!formData.propertyName.trim()) e.propertyName = "Required";
      if (!formData.propertyDescription.trim()) e.propertyDescription = "Required";
      if (isHotel) {
        if (!formData.totalRooms) e.totalRooms = "Required";
        if (!formData.maxGuestCapacity) e.maxGuestCapacity = "Required";
      }
    }
    if (step === 3) {
      if (!formData.address.trim()) e.address = "Required";
      if (!formData.village.trim()) e.village = "Required";
      if (!formData.taluka.trim()) e.taluka = "Required";
      if (!formData.district.trim()) e.district = "Required";
      if (!formData.state.trim()) e.state = "Required";
      if (!/^\d{6}$/.test(formData.pincode.trim())) e.pincode = "Enter a valid 6-digit PIN code";
    }
    if (step === 4 && isHotel) {
      if (formData.roomTypes.length === 0) e.roomTypes = "Add at least one room type";
    }
    if (step === 5) {
      if (!formData.photosLink.trim()) e.photosLink = "Please share a Google Drive link";
      else if (!/^https?:\/\//.test(formData.photosLink.trim())) e.photosLink = "Enter a valid URL";
    }
    if (step === 6) {
      if (!formData.cancellationPolicy.trim()) e.cancellationPolicy = "Required";
    }
    if (step === 8) {
      if (!idProof) e.idProof = "Please upload your ID proof";
      if (!ownershipProof) e.ownershipProof = "Please upload ownership/authorization proof";
      if (!formData.declarationAccepted) e.declarationAccepted = "Please confirm the declaration";
    }
    if (step === 10) {
      ["acceptOwnerAuthorized", "acceptInfoAccurate", "acceptPartnerAgreement", "acceptTerms", "acceptPrivacyPolicy", "acceptCommission"].forEach((field) => {
        if (!formData[field]) e[field] = true;
      });
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validateStep()) {
      toast.error("Please complete all required fields");
      return;
    }
    setStep((prev) => nextVisibleStep(prev, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep((prev) => nextVisibleStep(prev, -1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      toast.error("Please accept all required agreements");
      return;
    }

    if (!captcha.validate()) { // ⬅️ ADD
      return;
    }

    setIsSubmitting(true);
    try {
      let ipAddress = "unknown";
      try {
        const ipRes = await fetch("/api/get-client-ip");
        const ipData = await ipRes.json();
        ipAddress = ipData.ip;
      } catch {
        // non-critical — continue submission even if IP lookup fails
      }

      const payload = {
        owner: {
          fullName: formData.ownerFullName.trim(),
          mobile: formData.ownerMobile.trim(),
          whatsapp: formData.ownerWhatsapp.trim(),
          email: formData.ownerEmail.trim(),
          altContact: formData.ownerAltContact.trim(),
        },
        property: {
          name: formData.propertyName.trim(),
          type: formData.propertyType,
          description: formData.propertyDescription.trim(),
          totalRooms: formData.totalRooms ? Number(formData.totalRooms) : null,
          maxGuestCapacity: formData.maxGuestCapacity ? Number(formData.maxGuestCapacity) : null,
          seatingCapacity: formData.seatingCapacity ? Number(formData.seatingCapacity) : null,
          cuisineTypes: formData.cuisineTypes.trim(),
        },
        location: {
          address: formData.address.trim(), village: formData.village.trim(),
          taluka: formData.taluka.trim(), district: formData.district.trim(),
          state: formData.state.trim(), pincode: formData.pincode.trim(),
          googleBusinessLink: formData.googleBusinessLink.trim(),
          nearbyAttractions: formData.nearbyAttractions.trim(),
        },
        roomTypes: isHotel
          ? formData.roomTypes.map((r) => ({
            name: r.name.trim(), numberOfRooms: Number(r.numberOfRooms) || 0,
            guestsPerRoom: Number(r.guestsPerRoom) || 0, startingPrice: Number(r.startingPrice) || 0,
            weekendPrice: Number(r.weekendPrice) || 0, amenities: r.amenities.trim(),
          }))
          : [],
        photosLink: formData.photosLink.trim(),
        policies: {
          checkInTime: formData.checkInTime, checkOutTime: formData.checkOutTime,
          cancellationPolicy: formData.cancellationPolicy.trim(),
          childPolicy: formData.childPolicy.trim(), petPolicy: formData.petPolicy.trim(),
          idRequired: formData.idRequired, couplesAllowed: formData.couplesAllowed,
        },
        plan: formData.plan,
        verification: {
          idProof, ownershipProof, declarationAccepted: formData.declarationAccepted,
        },
        agreementVersion: "v1.0",
        termsVersion: "v1.0",
        acceptance: {
          isOwnerOrAuthorized: formData.acceptOwnerAuthorized,
          infoAccurate: formData.acceptInfoAccurate,
          agreedPartnerAgreement: formData.acceptPartnerAgreement,
          agreedTerms: formData.acceptTerms,
          readPrivacyPolicy: formData.acceptPrivacyPolicy,
          agreedCommission: formData.acceptCommission,
        },
        ipAddress,
      };

      const { registrationId } = await createPartnerApplication(payload, owner.uid);
      router.push(`/partner-with-us/success?ref=${registrationId}`);
    } catch (error) {
      console.error("Partner registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <PartnerProgressBar currentStep={step} totalSteps={totalSteps} hiddenSteps={hiddenSteps} />

      <div className="card p-6 sm:p-8">
        {/* STEP 1 — Owner Details */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-display font-bold text-xl text-primary">Owner Details</h2>
            <div>
              <label className={labelClass}>Full Name *</label>
              <input name="ownerFullName" value={formData.ownerFullName} onChange={handleChange} placeholder="e.g. Rajesh Patil" className={errors.ownerFullName ? errorInputClass : inputClass} />
              {errors.ownerFullName && <p className="text-red-500 text-xs mt-1">{errors.ownerFullName}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Mobile Number *</label>
                <input name="ownerMobile" value={formData.ownerMobile} onChange={handleChange} placeholder="10-digit number" className={errors.ownerMobile ? errorInputClass : inputClass} />
                {errors.ownerMobile && <p className="text-red-500 text-xs mt-1">{errors.ownerMobile}</p>}
              </div>
              <div>
                <label className={labelClass}>WhatsApp Number *</label>
                <input name="ownerWhatsapp" value={formData.ownerWhatsapp} onChange={handleChange} placeholder="10-digit number" className={errors.ownerWhatsapp ? errorInputClass : inputClass} />
                {errors.ownerWhatsapp && <p className="text-red-500 text-xs mt-1">{errors.ownerWhatsapp}</p>}
              </div>
            </div>
            <div>
              <label className={labelClass}>Email Address *</label>
              <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} placeholder="e.g. rajesh@example.com" className={errors.ownerEmail ? errorInputClass : inputClass} />
              {errors.ownerEmail && <p className="text-red-500 text-xs mt-1">{errors.ownerEmail}</p>}
            </div>
            <div>
              <label className={labelClass}>Alternate Contact Number</label>
              <input name="ownerAltContact" value={formData.ownerAltContact} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        )}

        {/* STEP 2 — Property Details */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-display font-bold text-xl text-primary">Property Details</h2>
            <div>
              <label className={labelClass}>Property Name *</label>
              <input name="propertyName" value={formData.propertyName} onChange={handleChange} placeholder="e.g. Sunrise Beach Resort" className={errors.propertyName ? errorInputClass : inputClass} />
              {errors.propertyName && <p className="text-red-500 text-xs mt-1">{errors.propertyName}</p>}
            </div>
            <div>
              <label className={labelClass}>Property Type *</label>
              <div className="flex gap-3">
                {["hotel", "restaurant"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, propertyType: type }))}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium capitalize transition-colors ${formData.propertyType === type ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:border-primary"
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Property Description *</label>
              <textarea name="propertyDescription" value={formData.propertyDescription} onChange={handleChange} placeholder="Describe your property's highlights, atmosphere, and what makes it special..." rows={4} className={errors.propertyDescription ? errorInputClass : inputClass} />
              {errors.propertyDescription && <p className="text-red-500 text-xs mt-1">{errors.propertyDescription}</p>}
            </div>

            {isHotel ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Total Number of Rooms *</label>
                  <input type="number" name="totalRooms" value={formData.totalRooms} onChange={handleChange} placeholder="e.g. 12" className={errors.totalRooms ? errorInputClass : inputClass} />
                  {errors.totalRooms && <p className="text-red-500 text-xs mt-1">{errors.totalRooms}</p>}
                </div>
                <div>
                  <label className={labelClass}>Maximum Guest Capacity *</label>
                  <input type="number" name="maxGuestCapacity" value={formData.maxGuestCapacity} onChange={handleChange} placeholder="e.g. 40" className={errors.maxGuestCapacity ? errorInputClass : inputClass} />
                  {errors.maxGuestCapacity && <p className="text-red-500 text-xs mt-1">{errors.maxGuestCapacity}</p>}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Seating Capacity</label>
                  <input type="number" name="seatingCapacity" value={formData.seatingCapacity} onChange={handleChange} placeholder="e.g. 60" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Cuisine Types</label>
                  <input name="cuisineTypes" value={formData.cuisineTypes} onChange={handleChange} placeholder="e.g. Seafood, Goan" className={inputClass} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — Location */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-display font-bold text-xl text-primary">Property Location</h2>
            <div>
              <label className={labelClass}>Address *</label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows={2} placeholder="Street address, landmark, etc." className={errors.address ? errorInputClass : inputClass} />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Village / Town / City *</label>
                <input name="village" value={formData.village} onChange={handleChange} placeholder="e.g. Diveagar" className={errors.village ? errorInputClass : inputClass} />
                {errors.village && <p className="text-red-500 text-xs mt-1">{errors.village}</p>}
              </div>
              <div>
                <label className={labelClass}>Taluka *</label>
                <input name="taluka" value={formData.taluka} onChange={handleChange} placeholder="e.g. Shrivardhan" className={errors.taluka ? errorInputClass : inputClass} />
                {errors.taluka && <p className="text-red-500 text-xs mt-1">{errors.taluka}</p>}
              </div>
              <div>
                <label className={labelClass}>District *</label>
                <input name="district" value={formData.district} onChange={handleChange} placeholder="e.g. Raigad" className={errors.district ? errorInputClass : inputClass} />
                {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
              </div>
              <div>
                <label className={labelClass}>State *</label>
                <input name="state" value={formData.state} onChange={handleChange} placeholder="e.g. Maharashtra" className={errors.state ? errorInputClass : inputClass} />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>
              <div>
                <label className={labelClass}>PIN Code *</label>
                <input name="pincode" value={formData.pincode} onChange={handleChange} maxLength={6} placeholder="e.g. 402404" className={errors.pincode ? errorInputClass : inputClass} />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>
              <div>
                <label className={labelClass}>Google Business Link</label>
                <input name="googleBusinessLink" value={formData.googleBusinessLink} onChange={handleChange} placeholder="https://..." className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Nearby Attractions</label>
              <input name="nearbyAttractions" value={formData.nearbyAttractions} placeholder="e.g. Local markets, beaches, etc." onChange={handleChange} className={inputClass} />
            </div>
          </div>
        )}

        {/* STEP 4 — Accommodation (Hotel only) */}
        {step === 4 && isHotel && (
          <div className="space-y-5">
            <h2 className="font-display font-bold text-xl text-primary">Accommodation Details</h2>
            <PartnerRoomTypesEditor
              value={formData.roomTypes}
              onChange={(rooms) => setFormData((prev) => ({ ...prev, roomTypes: rooms }))}
            />
            {errors.roomTypes && <p className="text-red-500 text-xs">{errors.roomTypes}</p>}
          </div>
        )}

        {/* STEP 5 — Photos */}
        {step === 5 && (
          <div className="space-y-5">
            <h2 className="font-display font-bold text-xl text-primary">Property Photos</h2>
            <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4 flex items-start gap-3">
              <FiUpload className="text-secondary shrink-0 mt-0.5" />
              <p className="text-gray-600 text-sm">
                Upload your property photos to a Google Drive folder, set sharing to
                <strong> "Anyone with the link can view"</strong>, and paste the link below.
                Our team will review and select photos to publish on your listing.
              </p>
            </div>
            <div>
              <label className={labelClass}>Google Drive Photos Link *</label>
              <input
                name="photosLink"
                value={formData.photosLink}
                onChange={handleChange}
                placeholder="https://drive.google.com/drive/folders/..."
                className={errors.photosLink ? errorInputClass : inputClass}
              />
              {errors.photosLink && <p className="text-red-500 text-xs mt-1">{errors.photosLink}</p>}
            </div>
          </div>
        )}

        {/* STEP 6 — Policies */}
        {step === 6 && (
          <div className="space-y-5">
            <h2 className="font-display font-bold text-xl text-primary">
              {isHotel ? "Policies & Guest Information" : "Operating Hours & Guest Information"}
            </h2>

            {isHotel ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Check-in Time *</label>
                    <input type="time" name="checkInTime" value={formData.checkInTime} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Check-out Time *</label>
                    <input type="time" name="checkOutTime" value={formData.checkOutTime} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Cancellation Policy *</label>
                  <textarea name="cancellationPolicy" value={formData.cancellationPolicy} onChange={handleChange} rows={3} placeholder="e.g. Free cancellation up to 24 hours before check-in" className={errors.cancellationPolicy ? errorInputClass : inputClass} />
                  {errors.cancellationPolicy && <p className="text-red-500 text-xs mt-1">{errors.cancellationPolicy}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Child Policy</label>
                    <input name="childPolicy" value={formData.childPolicy} onChange={handleChange} placeholder="e.g. Children under 5 stay free" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Pet Policy</label>
                    <input name="petPolicy" value={formData.petPolicy} onChange={handleChange} placeholder="e.g. Pets not allowed" className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>ID Required at Check-in?</label>
                    <select name="idRequired" value={formData.idRequired} onChange={handleChange} className={inputClass + " bg-white"}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Couples Allowed?</label>
                    <select name="couplesAllowed" value={formData.couplesAllowed} onChange={handleChange} className={inputClass + " bg-white"}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Opening Time *</label>
                    <input type="time" name="checkInTime" value={formData.checkInTime} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Closing Time *</label>
                    <input type="time" name="checkOutTime" value={formData.checkOutTime} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Reservation / Cancellation Policy *</label>
                  <textarea
                    name="cancellationPolicy"
                    value={formData.cancellationPolicy}
                    onChange={handleChange}
                    rows={3}
                    placeholder="e.g. Table held for 15 minutes past reservation time; cancellations accepted up to 2 hours before"
                    className={errors.cancellationPolicy ? errorInputClass : inputClass}
                  />
                  {errors.cancellationPolicy && <p className="text-red-500 text-xs mt-1">{errors.cancellationPolicy}</p>}
                </div>
                <div>
                  <label className={labelClass}>Dress Code / Child Policy</label>
                  <input
                    name="childPolicy"
                    value={formData.childPolicy}
                    onChange={handleChange}
                    placeholder="e.g. Smart casual dress code; kids menu available"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Pet Policy</label>
                  <input name="petPolicy" value={formData.petPolicy} onChange={handleChange} placeholder="e.g. Pets allowed in outdoor seating only" className={inputClass} />
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 7 — Plan */}
        {step === 7 && (
          <div className="space-y-5">
            <h2 className="font-display font-bold text-xl text-primary">Choose Your Partner Plan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, plan: "basic" }))}
                className={`text-left p-5 rounded-xl border-2 transition-colors ${formData.plan === "basic" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <p className="font-display font-bold text-lg text-primary">Basic Listing</p>
                <p className="text-2xl font-bold text-primary mt-1">Free</p>
                <ul className="text-gray-500 text-sm mt-3 space-y-1">
                  <li>• Standard listing page</li>
                  <li>• Basic visibility</li>
                  <li>• Enquiries routed through StayFinder's WhatsApp</li>
                  <li className="text-gray-400 text-xs pt-1">Commission applies per confirmed booking</li>
                </ul>
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, plan: "premium" }))}
                className={`text-left p-5 rounded-xl border-2 transition-colors ${formData.plan === "premium" ? "border-accent bg-accent/5" : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <p className="font-display font-bold text-lg text-primary">Premium Plan</p>
                <p className="text-2xl font-bold text-primary mt-1">Contact us</p>
                <ul className="text-gray-500 text-sm mt-3 space-y-1">
                  <li>• Verified badge</li>
                  <li>• Custom badge</li>
                  <li>• Direct WhatsApp enquiries to your number</li>
                  <li>• Google Maps location on your listing</li>
                  <li>• Priority support</li>
                </ul>
              </button>
            </div>
          </div>
        )}

        {/* STEP 8 — Verification */}
        {step === 8 && (
          <div className="space-y-5">
            <h2 className="font-display font-bold text-xl text-primary">Verification</h2>
            <div>
              <label className={labelClass}>Owner/Authorized Representative ID *</label>
              <ImageUploader value={idProof} onChange={setIdProof} folder="partner-verification" label="" />
              {errors.idProof && <p className="text-red-500 text-xs mt-1">{errors.idProof}</p>}
            </div>
            <div>
              <label className={labelClass}>Property Ownership / Authorization Proof *</label>
              <ImageUploader value={ownershipProof} onChange={setOwnershipProof} folder="partner-verification" label="" />
              {errors.ownershipProof && <p className="text-red-500 text-xs mt-1">{errors.ownershipProof}</p>}
            </div>
            <label className="flex items-start gap-2.5 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={formData.declarationAccepted}
                onChange={(e) => setFormData((prev) => ({ ...prev, declarationAccepted: e.target.checked }))}
                className="w-4 h-4 accent-secondary rounded mt-0.5"
              />
              <span className="text-sm text-gray-700">
                I confirm that the documents submitted are genuine and belong to me/the property, or that I am authorized to submit them.
              </span>
            </label>
            {errors.declarationAccepted && <p className="text-red-500 text-xs">{errors.declarationAccepted}</p>}
          </div>
        )}

        {/* STEP 9 — Agreement */}
        {step === 9 && (
          <div className="space-y-5">
            <h2 className="font-display font-bold text-xl text-primary">Hotel/Restaurant Partner Agreement</h2>
            <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-600 leading-relaxed">
              By becoming a StayFinder partner, you agree to list accurate property information,
              honor bookings confirmed through our platform, respond to guest enquiries promptly,
              and maintain the standards described in this agreement. Commission or subscription
              terms apply based on your selected plan.
            </div>
            <button
              type="button"
              onClick={() => setShowAgreementModal(true)}
              className="flex items-center gap-2 text-secondary font-medium text-sm hover:underline"
            >
              <FiExternalLink /> Read Full Agreement
            </button>
          </div>
        )}

        {/* STEP 10 — Legal Acceptance */}
        {step === 10 && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-xl text-primary">Confirm & Submit</h2>
            {[
              { key: "acceptOwnerAuthorized", label: "I confirm that I am the property owner or an authorized representative of the property." },
              { key: "acceptInfoAccurate", label: "I confirm that all information submitted in this registration is accurate and up to date." },
              { key: "acceptPartnerAgreement", label: "I have read and agree to the Hotel Partner Agreement." },
              { key: "acceptTerms", label: "I agree to the Terms for Hotel Owners." },
              { key: "acceptPrivacyPolicy", label: "I have read the Privacy Policy." },
              { key: "acceptCommission", label: "I agree to the applicable commission or subscription fee for my selected plan." },
            ].map((item) => (
              <label key={item.key} className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData[item.key]}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [item.key]: e.target.checked }))}
                  className={`w-4 h-4 rounded mt-0.5 accent-secondary ${errors[item.key] ? "outline outline-1 outline-red-400" : ""}`}
                />
                <span className="text-sm text-gray-700">{item.label}</span>
              </label>
            ))}

            <div className="pt-2">
              <MathCaptcha captcha={captcha} />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="flex items-center gap-2 text-gray-500 font-medium text-sm hover:text-primary disabled:opacity-0"
          >
            <FiArrowLeft /> Back
          </button>

          {step < totalSteps ? (
            <button type="button" onClick={goNext} className="btn-primary flex items-center gap-2">
              Next <FiArrowRight />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          )}
        </div>
      </div>

      {/* Agreement Modal */}
      {showAgreementModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="font-display font-bold text-lg text-primary mb-4">Full Partner Agreement</h3>
            <div className="text-gray-600 text-sm space-y-3">
              <p>1. The Partner agrees to provide accurate, up-to-date information about the property...</p>
              <p>2. StayFinder facilitates enquiries between guests and partners via WhatsApp...</p>
              <p>3. Partners are responsible for honoring confirmed bookings and maintaining listed rates...</p>
              <p>[Replace this section with your actual legal agreement text.]</p>
            </div>
            <button onClick={() => setShowAgreementModal(false)} className="btn-primary w-full mt-6">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
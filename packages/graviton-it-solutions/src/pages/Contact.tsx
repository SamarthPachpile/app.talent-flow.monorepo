import Header from "@graviton/components/Header";
import Footer from "@graviton/components/Footer";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CTASection from "@graviton/components/CTASection";

const WEBHOOK_URL = import.meta.env.VITE_CONTACT_WEBHOOK_URL as string;

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  industry: string;
  country: string;
  message: string;
  consent: boolean;
};

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  position: "",
  industry: "",
  country: "",
  message: "",
  consent: false,
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.company ||
      !form.industry ||
      !form.country ||
      !form.message
    ) {
      return "Please fill all required fields.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return "Invalid email address.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!WEBHOOK_URL) {
      setError("Webhook URL missing.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...form,
        subject: `New Contact from ${form.firstName} ${form.lastName}`,
      };

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      setSuccess(true);
      setForm(emptyForm);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <Header />

      {/* HERO + FORM */}
      <section
        id="contact-form"
        data-section="contact-form"
        data-label="Contact Form"
        className="relative w-full min-h-800px flex items-start py-24"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/assets/contact-banner-1024x734.webp')",
          }}
        />

        <div className="relative z-10 w-full px-4 sm:px-6">
          <div className="max-w-[900px] mx-auto lg:ml-auto lg:mr-12 xl:mr-24">
            {/* FORM CARD */}
            <div className="clip-path-nav-sm bg-white p-5 sm:p-8 lg:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)]">
              <h1 className="text-3xl font-semibold text-[#2c3e50] mb-6">Get in touch</h1>

              {/* Tabs */}
              <div className="flex gap-6 text-sm mb-6 border-b pb-2">
                <button className="text-[#ff5f2d] border-b-2 border-[#ff5f2d] pb-1">
                  Request for services
                </button>
                <button className="text-gray-500 hover:text-black">Join our team</button>
                <button className="text-gray-500 hover:text-black">General inquiries</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    placeholder="First Name*"
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    className="bg-[#f3f5f7] px-4 py-3 rounded-md text-sm outline-none"
                  />

                  <input
                    placeholder="Last Name*"
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    className="bg-[#f3f5f7] px-4 py-3 rounded-md text-sm outline-none"
                  />

                  <input
                    placeholder="Business Email Address*"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="bg-[#f3f5f7] px-4 py-3 rounded-md text-sm outline-none"
                  />

                  <input
                    placeholder="Phone (include country code)"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="bg-[#f3f5f7] px-4 py-3 rounded-md text-sm outline-none"
                  />

                  <input
                    placeholder="Company*"
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    className="bg-[#f3f5f7] px-4 py-3 rounded-md text-sm outline-none"
                  />

                  <input
                    placeholder="Position"
                    value={form.position}
                    onChange={(e) => update("position", e.target.value)}
                    className="bg-[#f3f5f7] px-4 py-3 rounded-md text-sm outline-none"
                  />

                  <select
                    value={form.industry}
                    onChange={(e) => update("industry", e.target.value)}
                    className="bg-[#f3f5f7] px-4 py-3 rounded-md text-sm outline-none"
                  >
                    <option value="">Industry*</option>
                    <option>Technology</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                  </select>

                  <select
                    value={form.country}
                    onChange={(e) => update("country", e.target.value)}
                    className="bg-[#f3f5f7] px-4 py-3 rounded-md text-sm outline-none"
                  >
                    <option value="">Select Country*</option>
                    <option>India</option>
                    <option>USA</option>
                  </select>
                </div>

                {/* Message */}
                <textarea
                  placeholder="Message*"
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="bg-[#f3f5f7] px-4 py-3 rounded-md text-sm outline-none w-full h-28"
                />

                {/* Consent */}
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => update("consent", e.target.checked)}
                    className="mt-1"
                  />
                  <p>
                    Send me occasional information about Graviton - A Tapasys group company, e.g.,
                    company news and events.
                  </p>
                </div>

                {/* Legal */}
                <p className="text-xs text-gray-500 leading-relaxed">
                  You may withdraw your consent at any time. Read our{" "}
                  <span className="text-[#ff5f2d] underline cursor-pointer">Privacy Policy</span>.
                </p>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-3 bg-[#ff5f2d] text-white px-6 py-3 rounded-full text-sm font-medium"
                >
                  Submit
                  <span className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center">
                    {submitting ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <ArrowRight size={16} />
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
      <section
        id="contact-info"
        data-section="contact-info"
        data-label="Office Info"
        className="bg-[#f1f3f6] py-20"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 items-start">
          {/* LEFT TITLE */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#2c3e50] leading-snug">
              Graviton <br /> Corporate <br /> Headquarters
            </h2>
          </div>

          {/* ADDRESS */}
          <div className="space-y-2">
            <p className="text-xl font-semibold text-[#2c3e50]">Address</p>
            <p className="text-[#5c6b7a] text-sm leading-relaxed">
              Nyati Hermitage, Dr. Homi Bhabha Rd, <br />
              Ram Nagar, Bavdhan, Pune, Maharashtra <br />
              411021
            </p>
            <button className="flex items-center gap-2 text-sm font-medium text-[#ff5f2d] mt-2">
              View on map
              <span className="text-lg">→</span>
            </button>
          </div>

          {/* PHONE */}
          <div className="space-y-2">
            <p className="text-xl font-semibold text-[#2c3e50]">Phone</p>
            <p className="text-[#5c6b7a] text-sm">+91-91561-93205</p>
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <p className="text-xl font-semibold text-[#2c3e50]">E-mail</p>
            <p className="text-[#5c6b7a] text-sm">info@graviton.com</p>
            <p className="text-[#5c6b7a] text-sm">sales@graviton.com</p>
          </div>
        </div>
      </section>
      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="bg-white p-8 rounded-lg text-center">
              <CheckCircle2 className="mx-auto text-green-500 mb-4" size={40} />
              <h2 className="text-xl font-semibold mb-2">Message Sent!</h2>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 bg-[#ff5f2d] text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

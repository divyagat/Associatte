"use client";

import { useState } from "react";
import { Phone, Mail, User, MessageSquare, CheckCircle } from "lucide-react";
<<<<<<< HEAD
import { toast } from "sonner";
import { cn } from "@/lib/utils";

=======
import { cn } from "@/lib/utils";

// ✅ Simple toast replacement - no external dependency needed
const toast = {
  success: (message: string) => {
    console.log("✓", message);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("toast", { detail: { type: "success", message } }));
    }
  },
  error: (message: string) => {
    console.error("✗", message);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("toast", { detail: { type: "error", message } }));
    }
  },
};

>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
interface ContactFormProps {
  propertyId?: string;
  propertyTitle?: string;
  compact?: boolean;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactForm({
  propertyId,
  propertyTitle,
  compact = false,
}: ContactFormProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: propertyTitle
      ? `I am interested in "${propertyTitle}". Please share more details.`
      : "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};

    if (!form.name.trim()) e.name = "Name is required";

    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Valid email required";

    if (!form.phone.match(/^[6-9]\d{9}$/))
      e.phone = "Valid 10-digit mobile number required";

    if (!form.message.trim()) e.message = "Message is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    // Mock API call
    await new Promise((r) => setTimeout(r, 1200));

    // Store lead locally
    const leads = JSON.parse(localStorage.getItem("propfinder_leads") || "[]");

    leads.push({
      ...form,
      propertyId,
      propertyTitle,
      createdAt: new Date().toISOString(),
    });

    localStorage.setItem("propfinder_leads", JSON.stringify(leads));

    setSubmitting(false);
    setSubmitted(true);

    toast.success("Enquiry submitted! We'll contact you within 2 hours.");
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle className="w-12 h-12 text-primary-600 mb-3" />
        <h3 className="font-bold text-gray-900 text-lg mb-1">
          Enquiry Received!
        </h3>
        <p className="text-sm text-gray-500">
          Our expert will call you within 2 hours.
        </p>

        <button
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", email: "", phone: "", message: "" });
          }}
          className="mt-4 text-sm text-primary-600 hover:underline"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* NAME */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              setErrors({ ...errors, name: "" });
            }}
            className={cn(
              "input-field pl-10",
              errors.name && "border-red-400 focus:ring-red-400"
            )}
          />
        </div>
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      {/* EMAIL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              setErrors({ ...errors, email: "" });
            }}
            className={cn(
              "input-field pl-10",
              errors.email && "border-red-400 focus:ring-red-400"
            )}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      {/* PHONE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Mobile Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            +91
          </span>
          <input
            type="tel"
            placeholder="10-digit mobile"
            value={form.phone}
            onChange={(e) => {
              setForm({
                ...form,
                phone: e.target.value.replace(/\D/g, "").slice(0, 10),
              });
              setErrors({ ...errors, phone: "" });
            }}
            className={cn(
              "input-field pl-[4.5rem]",
              errors.phone && "border-red-400 focus:ring-red-400"
            )}
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
        )}
      </div>

      {/* MESSAGE */}
      {!compact && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Message
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              rows={3}
              placeholder="Your message..."
              value={form.message}
              onChange={(e) => {
                setForm({ ...form, message: e.target.value });
                setErrors({ ...errors, message: "" });
              }}
              className={cn(
                "input-field pl-10 resize-none",
                errors.message && "border-red-400 focus:ring-red-400"
              )}
            />
          </div>
          {errors.message && (
            <p className="mt-1 text-xs text-red-500">{errors.message}</p>
          )}
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Enquiry"
        )}
      </button>

      <p className="text-center text-[11px] text-gray-400">
        🔒 Your data is safe. No spam, ever.
      </p>
    </form>
  );
}
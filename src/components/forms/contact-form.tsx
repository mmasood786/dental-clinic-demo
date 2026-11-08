"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import {
  errorClass,
  inputClass,
  labelClass,
} from "@/components/forms/field-styles";
import { buttonStyles } from "@/components/ui/button";
import type { ContactFormContent } from "@/config/site.config";
import { cn } from "@/lib/cn";
import { trackEvent } from "@/lib/track";

type Option = {
  value: string;
  label: string;
};

type ContactFormProps = {
  copy: ContactFormContent;
  serviceOptions: Option[];
  locationOptions: Option[];
};

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm({
  copy,
  serviceOptions,
  locationOptions,
}: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus();
    }
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      service: String(formData.get("service") ?? ""),
      location: String(formData.get("location") ?? ""),
      message: String(formData.get("message") ?? "").trim(),
      website: String(formData.get("website") ?? ""),
    };

    setStatus("submitting");
    setFieldErrors({});
    setFormError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
      };

      if (!response.ok || !result.ok) {
        setStatus("error");
        setFieldErrors(result.fieldErrors ?? {});
        setFormError(
          result.error ??
            "Something went wrong. Please try again or call the clinic.",
        );
        return;
      }

      trackEvent("submit_contact_form", {
        service: payload.service || undefined,
        location: payload.location || undefined,
        placement: "contact-form",
      });

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
      setFormError(
        "We could not reach the server. Please check your connection or call the clinic.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-brand/20 bg-brand-light p-6 focus:outline-none"
      >
        <h2 className="font-display text-xl font-semibold text-ink">
          {copy.successTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/75">
          {copy.successMessage}
        </p>
      </div>
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {formError ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {formError}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name{" "}
            <span aria-hidden="true" className="text-red-700">
              *
            </span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            className={cn(inputClass, fieldErrors.name && "border-red-500")}
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
          />
          {fieldErrors.name ? (
            <p id="name-error" className={errorClass}>
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email{" "}
            <span aria-hidden="true" className="text-red-700">
              *
            </span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={160}
            autoComplete="email"
            className={cn(inputClass, fieldErrors.email && "border-red-500")}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
          />
          {fieldErrors.email ? (
            <p id="email-error" className={errorClass}>
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone{" "}
            <span className="text-xs font-normal text-muted">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={30}
            autoComplete="tel"
            className={cn(inputClass, fieldErrors.phone && "border-red-500")}
            aria-invalid={fieldErrors.phone ? true : undefined}
            aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
          />
          {fieldErrors.phone ? (
            <p id="phone-error" className={errorClass}>
              {fieldErrors.phone}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="service" className={labelClass}>
            Treatment{" "}
            <span className="text-xs font-normal text-muted">(optional)</span>
          </label>
          <select
            id="service"
            name="service"
            defaultValue=""
            className={cn(inputClass, fieldErrors.service && "border-red-500")}
            aria-invalid={fieldErrors.service ? true : undefined}
            aria-describedby={
              fieldErrors.service ? "service-error" : undefined
            }
          >
            <option value="">No preference</option>
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldErrors.service ? (
            <p id="service-error" className={errorClass}>
              {fieldErrors.service}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="location" className={labelClass}>
            Preferred studio{" "}
            <span className="text-xs font-normal text-muted">(optional)</span>
          </label>
          <select
            id="location"
            name="location"
            defaultValue=""
            className={cn(inputClass, fieldErrors.location && "border-red-500")}
            aria-invalid={fieldErrors.location ? true : undefined}
            aria-describedby={
              fieldErrors.location ? "location-error" : undefined
            }
          >
            <option value="">Either studio</option>
            {locationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldErrors.location ? (
            <p id="location-error" className={errorClass}>
              {fieldErrors.location}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          How can we help?{" "}
          <span aria-hidden="true" className="text-red-700">
            *
          </span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          minLength={10}
          maxLength={2000}
          placeholder="Tell us what you need, and any times that suit you."
          className={cn(
            inputClass,
            "resize-y",
            fieldErrors.message && "border-red-500",
          )}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
        />
        {fieldErrors.message ? (
          <p id="message-error" className={errorClass}>
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      <div
        aria-hidden="true"
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className={buttonStyles({ size: "lg" })}
        >
          {isSubmitting ? "Sending…" : copy.submitLabel}
        </button>
        <p className="max-w-sm text-xs leading-relaxed text-muted">
          {copy.privacyNote}
        </p>
      </div>
    </form>
  );
}

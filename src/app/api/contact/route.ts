import { NextResponse } from "next/server";
import { Resend } from "resend";

import { siteConfig } from "@/config/site.config";
import { contactSchema } from "@/lib/validation/contact";

export const runtime = "nodejs";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const result = contactSchema.safeParse(payload);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};

    for (const issue of result.error.issues) {
      const key = issue.path[0];

      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }

    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = result.data;

  // Bots fill the hidden field; accept silently so they do not retry.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY is not set.");
    return NextResponse.json(
      {
        error:
          "Email is not configured yet. Please call the clinic and we will help directly.",
      },
      { status: 503 },
    );
  }

  const service = siteConfig.services.find(
    (item) => item.slug === data.service,
  );
  const location = siteConfig.locations.find(
    (item) => item.slug === data.location,
  );
  const from =
    process.env.EMAIL_FROM ??
    `${siteConfig.name} <onboarding@resend.dev>`;

  const textLines = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    service ? `Treatment: ${service.title}` : null,
    location ? `Preferred studio: ${location.area}, ${location.city}` : null,
    "",
    data.message,
  ].filter((line): line is string => line !== null);

  const htmlDetails = [
    `<p><strong>Name:</strong> ${escapeHtml(data.name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(data.email)}</p>`,
    data.phone
      ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>`
      : "",
    service ? `<p><strong>Treatment:</strong> ${escapeHtml(service.title)}</p>` : "",
    location
      ? `<p><strong>Preferred studio:</strong> ${escapeHtml(
          `${location.area}, ${location.city}`,
        )}</p>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#0F1F22;line-height:1.6">
  <h1 style="font-size:20px">New website enquiry</h1>
  ${htmlDetails}
  <p><strong>Message:</strong></p>
  <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
  <hr style="border:none;border-top:1px solid #E2E8E8;margin:20px 0"/>
  <p style="font-size:12px;color:#5C7376">Sent from the contact form at ${escapeHtml(
    siteConfig.url,
  )}</p>
</div>`;

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from,
      to: siteConfig.email,
      replyTo: data.email,
      subject: `New website enquiry from ${data.name}`,
      text: textLines.join("\n"),
      html,
    });

    if (error) {
      console.error("Contact form: Resend returned an error.", error);
      return NextResponse.json(
        {
          error:
            "We could not send your message. Please call the clinic and we will help directly.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form: failed to send email.", error);
    return NextResponse.json(
      {
        error:
          "We could not send your message. Please call the clinic and we will help directly.",
      },
      { status: 500 },
    );
  }
}

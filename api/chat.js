import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function clean(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function buildSystemPrompt({ storeName, phone, email }) {
  const contactLines = [
    phone && `- Phone: ${phone}`,
    email && `- Email: ${email}`,
  ].filter(Boolean).join("\n");

  return `You are the friendly virtual concierge for ${storeName || "our med spa"}.

Your #1 goal is to turn website visitors into booked clients by getting them to CALL or EMAIL the spa.

How to help:
- Answer general questions about treatments (e.g. injectables, facials, laser, body contouring, skincare) warmly and briefly.
- Never give medical advice, diagnoses, exact pricing, or guarantees of results. For anything personal (candidacy, pricing, downtime, medical history), say a specialist will answer that during a consultation.
- In almost every reply, end with a clear, friendly call to action to call or email the spa to book a consultation.
- When a visitor shows interest (asks about a treatment, price, availability, or booking), invite them to reach out right away and give the contact details below.
- If they share their name, mention they can include it plus the treatment they're interested in when they call or email, so the team can help faster.

Contact details (always share these exactly as written):
${contactLines || "- Contact details are not configured. Suggest they use the contact page on the website."}

Keep responses short (2-4 sentences), warm, and conversational. Don't make up specific details about the spa that you weren't given.`;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages, storeName, phone, email } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: buildSystemPrompt({
        storeName: clean(storeName, 100),
        phone: clean(phone, 40),
        email: clean(email, 120),
      }),
      messages: messages.slice(-10),
    });

    res.status(200).json({ reply: response.content[0].text });
  } catch (error) {
    console.error("Claude API error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

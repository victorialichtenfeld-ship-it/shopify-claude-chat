import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages, storeName } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: `You are a friendly and helpful shopping assistant for ${storeName || "this store"}.
Help customers find products, answer questions about shipping and returns, and provide excellent customer service.
Keep responses concise and conversational. If you don't know specific store details, be honest and suggest they contact support.`,
      messages: messages.slice(-10),
    });

    res.status(200).json({ reply: response.content[0].text });
  } catch (error) {
    console.error("Claude API error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}c

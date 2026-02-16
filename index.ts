/**
 * Plazbot SDK v2.0 - Examples
 *
 * This file demonstrates all SDK features using the unified Plazbot class.
 * You can also import Agent, Portal, Message, Template, Contact individually.
 *
 * Usage:
 *   npm start
 *
 * Docs: https://docs.plazbot.com
 */

import { Plazbot } from 'plazbot';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Initialize SDK ─────────────────────────────────────────────────────────
// One instance, all modules: agent, portal, message, template, contact

const plazbot = new Plazbot({
  workspaceId: "[YOUR_WORKSPACE_ID]",
  apiKey: "[YOUR_API_KEY]",
  zone: "LA" // "EU" for Europe
});

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

async function agentExamples() {
  console.log("\n--- AGENT ---\n");

  // ── Create Agent from JSON config ──────────────────────────────────────────
  const configPath = path.join(__dirname, 'agent.basic.config.json');
  const promptPath = path.join(__dirname, 'prompt.txt');

  const configFile = await fs.readFile(configPath, 'utf-8');
  const promptContent = await fs.readFile(promptPath, 'utf-8');

  const config = JSON.parse(configFile);
  config.prompt = promptContent;

  const created = await plazbot.agent.addAgent(config);
  const agentId = created.agentId;
  console.log("Agent created:", agentId);

  // ── Update Agent ───────────────────────────────────────────────────────────
  await plazbot.agent.updateAgent(agentId, {
    ...config,
    name: "Sales Plazbot Updated",
    buffer: 8
  });
  console.log("Agent updated");

  // ── Get All Agents ─────────────────────────────────────────────────────────
  const agents = await plazbot.agent.getAgents();
  console.log("Agents found:", agents.length);

  // ── Get Agent By ID ────────────────────────────────────────────────────────
  const agentData = await plazbot.agent.getAgentById({ id: agentId });
  console.log("Agent name:", agentData.name);

  // ── Copy Agent ─────────────────────────────────────────────────────────────
  const copy = await plazbot.agent.copyAgent({ id: agentId });
  console.log("Agent copied:", copy.id);

  // ── Chat with Agent ────────────────────────────────────────────────────────
  const sessionId = crypto.randomUUID();
  const response = await plazbot.agent.onMessage({
    agentId: agentId,
    question: "What features does Plazbot have?",
    sessionId: sessionId,
  });
  console.log("AI Response:", response.answer);

  // ── Chat with File (OCR) ───────────────────────────────────────────────────
  const responseWithFile = await plazbot.agent.onMessage({
    agentId: agentId,
    question: "Summarize this document",
    sessionId: sessionId,
    file: "https://example.com/docs/report.pdf",
  });
  console.log("AI Response (with file):", responseWithFile.answer);

  // ── Enable Widget ──────────────────────────────────────────────────────────
  const widget = await plazbot.agent.enableWidget({ id: agentId, enable: true });
  console.log("Widget script:", widget.script);

  // ── Quick Config Methods ───────────────────────────────────────────────────
  await plazbot.agent.setInstructions(agentId, {
    tone: "professional",
    style: "short answers",
    language: "es-419",
    emojis: false,
    maxWords: 100
  });

  await plazbot.agent.setPersona(agentId, {
    name: "Maximo",
    role: "Virtual customer service assistant",
    speaksInFirstPerson: true,
    isHuman: false
  });

  await plazbot.agent.setFallbacks(agentId, {
    noAnswer: "Sorry, I don't have information on that topic.",
    serviceError: "There was a problem. Please try again later.",
    doNotUnderstand: "Could you please rephrase that?"
  });

  await plazbot.agent.setRules(agentId, {
    doNotMentionPrices: false,
    doNotDiagnose: true,
    doNotRespondOutsideHours: "Monday to Friday 9am to 6pm."
  });

  await plazbot.agent.setTags(agentId, ["sales", "plazbot", "ai"]);
  console.log("Quick config applied");

  // ── AI Utilities ───────────────────────────────────────────────────────────
  const improved = await plazbot.agent.improvePrompt(
    "you are a bot that helps people"
  );
  console.log("Improved prompt:", improved.result);

  // ── Knowledge Base (Files) ─────────────────────────────────────────────────
  const file = await plazbot.agent.addFile({
    fileUrl: "https://example.com/docs/pricing.pdf",
    reference: "Document with product pricing and plan details for 2025.",
    tags: ["pricing", "plans"],
    agentId: agentId
  });
  console.log("File added:", file.fileId);

  const validated = await plazbot.agent.validateFile({ fileId: file.fileId! });
  console.log("File status:", validated.status);

  await plazbot.agent.deleteFile({ fileId: file.fileId!, agentId: agentId });
  console.log("File deleted");

  // ── Delete Agent ───────────────────────────────────────────────────────────
  await plazbot.agent.deleteAgent({ id: copy.id });
  await plazbot.agent.deleteAgent({ id: agentId });
  console.log("Agents deleted");
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT WITH TOOL CALLING (Services + Actions)
// ═══════════════════════════════════════════════════════════════════════════════

async function toolCallingExample() {
  console.log("\n--- TOOL CALLING ---\n");

  const configPath = path.join(__dirname, 'agent.config.json');
  const configFile = await fs.readFile(configPath, 'utf-8');
  const config = JSON.parse(configFile);

  // Create agent with services and actions from the full config
  const created = await plazbot.agent.addAgent(config);
  console.log("Agent with Tool Calling created:", created.agentId);

  // The agent now can:
  // - Call external APIs (services) when user intent is detected
  // - Execute internal actions (assign, tag, stage changes)
  // See agent.config.json for the full configuration

  await plazbot.agent.deleteAgent({ id: created.agentId });
  console.log("Agent deleted");
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT WITH CUSTOM AI PROVIDER
// ═══════════════════════════════════════════════════════════════════════════════

async function customAIExample() {
  console.log("\n--- CUSTOM AI CONFIG ---\n");

  const created = await plazbot.agent.addAgent({
    name: "Custom AI Agent",
    prompt: "You are a helpful assistant.",
    zone: "LA",
    buffer: 5,
    useToolCalling: true,
    customAIConfig: true,
    aiProviders: [
      {
        provider: "openai",
        model: "gpt-4o",
        apiToken: "sk-your-openai-key",
        temperature: 0.7,
        maxTokens: 1000,
        isDefault: true
      }
    ]
  });

  console.log("Custom AI Agent created:", created.agentId);
  await plazbot.agent.deleteAgent({ id: created.agentId });
}

// ═══════════════════════════════════════════════════════════════════════════════
// PORTAL EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

async function portalExamples() {
  console.log("\n--- PORTAL ---\n");

  // ── Create Agent for the Portal ────────────────────────────────────────────
  const agent = await plazbot.agent.addAgent({
    name: "Portal Agent",
    prompt: "You are a helpful assistant for the company portal.",
    zone: "LA",
    buffer: 5,
    enable: true,
    question: "How can I help you?",
    examples: [
      { value: "What services do you offer?", color: "blue" },
      { value: "How can I contact support?", color: "green" }
    ]
  });

  // ── Create Portal ──────────────────────────────────────────────────────────
  const portal = await plazbot.portal.addPortal({
    name: "Company Portal",
    zone: "LA",
    title: "AI Search Portal",
    subtitle: "Ask anything about our products",
    logo: "https://storage-files-plz-latam.s3.sa-east-1.amazonaws.com/master/logo-plazbot.png",
    logodark: "https://storage-files-plz-latam.s3.sa-east-1.amazonaws.com/master/logo-plazbot.png",
    access: "direct",
    theme: "light",
    disabled: false,
    brandOff: false,
  });

  console.log("Portal created:", portal.id);
  console.log("Portal URL:", portal.url);

  // ── Associate Agent ────────────────────────────────────────────────────────
  await plazbot.portal.addAgentToPortal({
    portalId: portal.id,
    id: agent.agentId
  });
  console.log("Agent linked to portal");

  // ── Add Links ──────────────────────────────────────────────────────────────
  await plazbot.portal.addLinkToPortal({
    portalId: portal.id,
    value: "Documentation",
    url: "https://docs.plazbot.com"
  });

  await plazbot.portal.addLinkToPortal({
    portalId: portal.id,
    value: "Blog",
    url: "https://www.plazbot.com/blog"
  });

  await plazbot.portal.addLinkToPortal({
    portalId: portal.id,
    value: "Discord Community",
    url: "https://discord.gg/SgyAtrwzp7"
  });
  console.log("Links added");

  // ── Get Portal Info ────────────────────────────────────────────────────────
  const info = await plazbot.portal.getPortal(portal.id);
  console.log("Portal info:", info.portal.name);

  // ── Update Portal ──────────────────────────────────────────────────────────
  await plazbot.portal.updatePortal({
    id: portal.id,
    name: "Company Portal v2",
    theme: "dark"
  });
  console.log("Portal updated");

  // ── Remove Agent from Portal ───────────────────────────────────────────────
  await plazbot.portal.removeAgentFromPortal({
    portalId: portal.id,
    id: agent.agentId
  });
  console.log("Agent removed from portal");

  // ── Clear Links ────────────────────────────────────────────────────────────
  await plazbot.portal.clearLinks(portal.id);
  console.log("Links cleared");

  // ── Delete Portal and Agent ────────────────────────────────────────────────
  await plazbot.portal.deletePortal(portal.id);
  await plazbot.agent.deleteAgent({ id: agent.agentId });
  console.log("Portal and agent deleted");
}

// ═══════════════════════════════════════════════════════════════════════════════
// WHATSAPP / MESSAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

async function whatsappExamples() {
  console.log("\n--- WHATSAPP ---\n");

  // ── Send Simple Message ────────────────────────────────────────────────────
  // Only works if a conversation is already active (24h window)
  const result = await plazbot.message.onWhatsappMessage({
    message: "Hello! Thanks for contacting us.",
    to: "51912345678"
  });
  console.log("Message sent:", result.success);

  // ── Send Template Message ──────────────────────────────────────────────────
  // Works anytime - uses pre-approved WhatsApp templates
  await plazbot.message.onConversation({
    to: "51912345678",
    template: "welcome_plazbot"
  });
  console.log("Template sent");

  // ── Send Template with Variables ───────────────────────────────────────────
  await plazbot.message.onConversation({
    to: "51912345678",
    template: "order_confirmation",
    variablesBody: [
      { variable: "1", value: "John" },
      { variable: "2", value: "ORD-12345" }
    ],
    variablesHeader: [
      { variable: "1", value: "Order Confirmed" }
    ]
  });
  console.log("Template with variables sent");

  // ── Send Template with File ────────────────────────────────────────────────
  await plazbot.message.onConversation({
    to: "51912345678",
    template: "invoice_template",
    file: {
      fileUrl: "https://example.com/invoices/INV-001.pdf",
      fileName: "invoice.pdf"
    }
  });
  console.log("Template with file sent");

  // ── Register Webhook ───────────────────────────────────────────────────────
  // Receive incoming WhatsApp messages on your endpoint
  await plazbot.message.registerWebhook({
    number: "51912345678",
    webhookUrl: "https://your-server.com/webhooks/whatsapp"
  });
  console.log("Webhook registered");

  // ── Message History ────────────────────────────────────────────────────────
  const messages = await plazbot.message.getMessages({ limit: 10 });
  console.log("Recent messages:", messages.length);

  const history = await plazbot.message.getConversationHistory({
    contactId: "contact-id-here"
  });
  console.log("Conversation messages:", history.length);

  const searchResults = await plazbot.message.searchMessages({
    query: "pricing"
  });
  console.log("Search results:", searchResults.length);

  // ── Delete Webhook ─────────────────────────────────────────────────────────
  await plazbot.message.deleteWebhook({
    number: "51912345678"
  });
  console.log("Webhook deleted");
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

async function templateExamples() {
  console.log("\n--- TEMPLATES ---\n");

  // ── Get All Templates ──────────────────────────────────────────────────────
  const templates = await plazbot.template.getTemplates();
  console.log("Total templates:", templates.length);

  // ── Get Active Templates Only ──────────────────────────────────────────────
  const active = await plazbot.template.getActiveTemplates();
  console.log("Active templates:", active.length);

  // ── Get Template by ID ─────────────────────────────────────────────────────
  if (templates.length > 0) {
    const template = await plazbot.template.getTemplate(templates[0].id);
    console.log("Template:", template.name, "-", template.status);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

async function contactExamples() {
  console.log("\n--- CONTACTS ---\n");

  // ── Create Contact ─────────────────────────────────────────────────────────
  const contact = await plazbot.contact.createContact({
    name: "John Doe",
    cellphone: "51912345678",
    email: "john@example.com",
    tags: ["lead", "website"]
  });
  console.log("Contact created:", contact.id);

  // ── Get All Contacts ───────────────────────────────────────────────────────
  const contacts = await plazbot.contact.getContacts();
  console.log("Total contacts:", contacts.length);

  // ── Get Contact by ID ──────────────────────────────────────────────────────
  const found = await plazbot.contact.getContact(contact.id);
  console.log("Contact:", found.name);

  // ── Search by Phone ────────────────────────────────────────────────────────
  const byPhone = await plazbot.contact.searchByPhone("51912345678");
  console.log("Found by phone:", byPhone.length);

  // ── Search by Email ────────────────────────────────────────────────────────
  const byEmail = await plazbot.contact.searchByEmail("john@example.com");
  console.log("Found by email:", byEmail.length);

  // ── Update Contact ─────────────────────────────────────────────────────────
  const updated = await plazbot.contact.updateContact({
    id: contact.id,
    name: "John Doe Updated",
    tags: ["lead", "website", "premium"]
  });
  console.log("Contact updated:", updated.name);

  // ── Delete Contacts ────────────────────────────────────────────────────────
  await plazbot.contact.deleteContacts([contact.id]);
  console.log("Contact deleted");
}

// ═══════════════════════════════════════════════════════════════════════════════
// RUN EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  try {
    // Uncomment the examples you want to run:

    await agentExamples();
    // await toolCallingExample();
    // await customAIExample();
    // await portalExamples();
    // await whatsappExamples();
    // await templateExamples();
    // await contactExamples();

    console.log("\nDone.");
  } catch (error) {
    console.error("Error:", error);
  }
}

main();

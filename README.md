<p align="center">
  <img src="https://storage-files-plz-latam.s3.sa-east-1.amazonaws.com/master/logo-plazbot.png" alt="Plazbot" width="200" />
</p>

<h1 align="center">Plazbot SDK Examples</h1>

<p align="center">
  <strong>AI Agents and WhatsApp for Developers.</strong><br/>
  Build, deploy, and manage AI agents in minutes.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/plazbot"><img src="https://img.shields.io/npm/v/plazbot?style=flat-square&color=blue" alt="npm" /></a>
  <a href="https://docs.plazbot.com"><img src="https://img.shields.io/badge/docs-plazbot.com-blue?style=flat-square" alt="docs" /></a>
  <a href="https://discord.gg/SgyAtrwzp7"><img src="https://img.shields.io/badge/Discord-Join-5865F2?style=flat-square&logo=discord&logoColor=white" alt="discord" /></a>
  <a href="https://twitter.com/plazbotia"><img src="https://img.shields.io/badge/Twitter-Follow-1DA1F2?style=flat-square&logo=twitter&logoColor=white" alt="twitter" /></a>
</p>

---

## What is Plazbot?

Plazbot is a platform that lets developers create **AI agents** and deploy them across multiple channels:

- **AI Search Portals** - ChatGPT-like search experience for your website
- **WhatsApp** - Automated AI conversations via the WhatsApp Business API
- **Web Widgets** - Embeddable chat widgets for any website
- **Your own software** - Full API access for custom integrations

This repository contains **working examples** for every feature in the [Plazbot SDK](https://www.npmjs.com/package/plazbot).

---

## Installation

```bash
npm install plazbot
```

---

## Quick Start

```ts
import { Plazbot } from 'plazbot';

const plazbot = new Plazbot({
  workspaceId: "YOUR_WORKSPACE_ID",
  apiKey: "YOUR_API_KEY",
  zone: "LA" // "EU" for Europe
});

// Create an agent
const agent = await plazbot.agent.addAgent({
  name: "My Agent",
  prompt: "You are a helpful assistant.",
  zone: "LA",
  buffer: 5
});

// Chat with the agent
const response = await plazbot.agent.onMessage({
  agentId: agent.agentId,
  question: "What can you do?",
  sessionId: crypto.randomUUID()
});

console.log(response.answer);
```

You can also import classes individually:

```ts
import { Agent, Portal, Message, Template, Contact } from 'plazbot';

const bot = new Agent({
  workspaceId: "YOUR_WORKSPACE_ID",
  apiKey: "YOUR_API_KEY",
  zone: "LA"
});
```

---

## Credentials

Get your **API Key** and **Workspace ID** from the [Plazbot Dashboard](https://www.plazbot.com):

1. Log in to your account
2. Go to **Settings** > **API KEY**
3. Copy your `API Key` and `Workspace ID`

Guides:
- [Create an Account](https://docs.plazbot.com/guides/primeros-pasos/creacion-cuenta)
- [Developer Documentation](https://docs.plazbot.com/sdk/introduccion)

---

## Examples

### Project Structure

```
plazbot-sdk-examples/
  index.ts                   # All examples in one file
  agent.basic.config.json    # Minimal agent configuration
  agent.config.json          # Full agent config (services, actions, channels)
  prompt.txt                 # Example prompt text
```

### Running the Examples

```bash
git clone https://github.com/plazbot/plazbot-sdk-examples.git
cd plazbot-sdk-examples
npm install
```

Edit `index.ts` and replace `[YOUR_WORKSPACE_ID]` and `[YOUR_API_KEY]` with your credentials. Then:

```bash
npm start
```

Uncomment the example functions you want to run in the `main()` function at the bottom of `index.ts`.

---

## Agent

### Create Agent

Create an agent from a JSON config file or inline:

```ts
// From config file
const config = JSON.parse(await fs.readFile('agent.basic.config.json', 'utf-8'));
config.prompt = "Your custom prompt here";

const agent = await plazbot.agent.addAgent(config);
console.log(agent.agentId);
```

```ts
// Inline
const agent = await plazbot.agent.addAgent({
  name: "Sales Agent",
  prompt: "You are a sales assistant for our company.",
  zone: "LA",
  buffer: 5,
  color: "blue",
  question: "How can I help you?",
  enable: true,
  examples: [
    { value: "What are your prices?", color: "blue" },
    { value: "Schedule a demo", color: "orange" }
  ]
});
```

### Update Agent

```ts
await plazbot.agent.updateAgent(agentId, {
  name: "Sales Agent Updated",
  buffer: 8
});
```

### Get Agents

```ts
const agents = await plazbot.agent.getAgents();
const agent = await plazbot.agent.getAgentById({ id: agentId });
```

### Copy Agent

```ts
const copy = await plazbot.agent.copyAgent({ id: agentId });
```

### Delete Agent

```ts
await plazbot.agent.deleteAgent({ id: agentId });
```

### Chat with Agent (onMessage)

```ts
const response = await plazbot.agent.onMessage({
  agentId: agentId,
  question: "What features does Plazbot have?",
  sessionId: "unique-session-id",
  file: "https://example.com/document.pdf",   // optional - OCR
  multipleAnswers: true                         // optional
});

console.log(response.answer);
```

**onMessage Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `agentId` | `string` | Yes | Agent identifier |
| `question` | `string` | Yes | User's message |
| `sessionId` | `string` | Yes | Unique session ID for conversation context |
| `file` | `string` | No | Public URL to a file (PDF, PNG, JPG) for OCR |
| `multipleAnswers` | `boolean` | No | Return response as multiple blocks |

**Supported file types for OCR:**

| Type | Supported |
|------|-----------|
| `.jpg`, `.png`, `.bmp`, `.gif`, `.tiff` | Yes |
| `.pdf` | Yes (embedded text or scanned images) |
| `.docx`, `.xlsx` | No |

### Widget

Enable the embeddable web widget for an agent:

```ts
const result = await plazbot.agent.enableWidget({ id: agentId, enable: true });
console.log(result.script); // HTML script to embed
```

Widget configuration is set in the agent config:

```json
{
  "enableWidget": true,
  "darkWidget": false,
  "nameWidget": "My Assistant",
  "initialShowWidget": false,
  "iconWidget": "robot"
}
```

### Quick Config Methods

Update specific sections of an agent without sending the full config:

```ts
await plazbot.agent.setInstructions(agentId, {
  tone: "professional",
  style: "short answers",
  language: "es-419",
  emojis: false,
  maxWords: 100
});

await plazbot.agent.setPersona(agentId, {
  name: "Maximo",
  role: "Virtual assistant",
  speaksInFirstPerson: true,
  isHuman: false
});

await plazbot.agent.setFallbacks(agentId, {
  noAnswer: "Sorry, I don't have information on that topic.",
  serviceError: "There was a problem. Please try again later.",
  doNotUnderstand: "Could you rephrase that?"
});

await plazbot.agent.setRules(agentId, {
  doNotMentionPrices: false,
  doNotDiagnose: true,
  doNotRespondOutsideHours: "Monday to Friday 9am to 6pm."
});

await plazbot.agent.setTags(agentId, ["sales", "ai"]);
```

### AI Utilities

Improve a prompt using AI:

```ts
const result = await plazbot.agent.improvePrompt("you are a bot that helps people");
console.log(result.result);
```

### Knowledge Base (Files)

Upload documents so the agent can use RAG to answer questions:

```ts
// Upload file
const file = await plazbot.agent.addFile({
  fileUrl: "https://example.com/docs/pricing.pdf",
  reference: "Product pricing and plan details for 2025.",
  tags: ["pricing", "plans"],
  agentId: agentId
});

// Check processing status
const status = await plazbot.agent.validateFile({ fileId: file.fileId });

// Remove file
await plazbot.agent.deleteFile({ fileId: file.fileId, agentId: agentId });
```

**Supported formats:** `.pdf`, `.doc`, `.docx`

---

## Agent Configuration Reference

The agent config JSON follows a strict schema. See `agent.config.json` for a full example. Here are the key fields:

### Core Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Agent name |
| `prompt` | `string` | Custom instructions that define agent behavior |
| `zone` | `"LA" \| "EU"` | Must match account zone |
| `buffer` | `number` | Message context window (3-10) |
| `color` | `string` | `blue`, `orange`, `green`, `gray`, `white` |
| `question` | `string` | Main question shown in portals/widgets |
| `enable` | `boolean` | Active/inactive |
| `timezone` | `string` | [TZ database format](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) |
| `examples` | `array` | Quick reply suggestions (max 5) |
| `tags` | `string[]` | Classification tags |

### Instructions

| Field | Description |
|-------|-------------|
| `instructions.tone` | `professional`, `friendly`, `serious`, etc. |
| `instructions.style` | `short answers`, `detailed`, `bulleted`, etc. |
| `instructions.personality` | `friendly`, `formal`, `curious`, etc. |
| `instructions.language` | Language code: `es-419`, `en-US`, `pt-BR`, etc. |
| `instructions.emojis` | `true` / `false` |
| `instructions.maxWords` | Max words per response |
| `instructions.avoidTopics` | Topics the agent should avoid |
| `instructions.respondOnlyIfKnows` | Only answer when confident |
| `instructions.greeting` | Initial greeting message |

### Persona

| Field | Description |
|-------|-------------|
| `person.name` | Agent's display name |
| `person.role` | Role description |
| `person.speaksInFirstPerson` | Uses "I" in responses |
| `person.isHuman` | Identifies as AI or human |

### Fallbacks

| Field | Description |
|-------|-------------|
| `fallbacks.noAnswer` | Response when agent has no information |
| `fallbacks.serviceError` | Response on external service failure |
| `fallbacks.doNotUnderstand` | Response when agent can't understand |

### Rules

| Field | Description |
|-------|-------------|
| `rules.doNotMentionPrices` | Prevents price discussion |
| `rules.doNotDiagnose` | Disables medical/technical diagnosis |
| `rules.doNotRespondOutsideHours` | Business hours text (works with `timezone`) |

---

## Tool Calling (Services + Actions)

Agents can call external APIs and execute internal actions based on user intent.

### Services (External API Calls)

```json
{
  "services": [
    {
      "intent": "schedule_date",
      "reference": "Service to schedule medical appointments",
      "enabled": true,
      "method": "POST",
      "endpoint": "https://api.clinic.com/v1/date/schedule",
      "requiredFields": [
        { "name": "nombre", "type": "string", "promptHint": "What's your name?" },
        { "name": "email", "type": "email", "promptHint": "What's your email?" },
        { "name": "fecha", "type": "date", "promptHint": "When would you like to schedule?" },
        {
          "name": "numeros_a_portar",
          "type": "arrayObject",
          "description": "List of phone numbers to port",
          "promptHint": "Which numbers do you want to port? I need: plan type, carrier, and number.",
          "properties": [
            { "name": "plan_type", "type": "string" },
            { "name": "carrier", "type": "string" },
            { "name": "number", "type": "string" }
          ]
        }
      ],
      "headers": {
        "Authorization": "Bearer {{apiKey}}",
        "Content-Type": "application/json"
      },
      "bodyTemplate": {
        "nombre": "{{nombre}}",
        "email": "{{email}}",
        "fecha": "{{fecha}}"
      },
      "responseMessage": "Your appointment is confirmed for {{date}}",
      "responseConditions": [
        { "condition": "$.response.status == 'success'", "message": "Confirmed for {{date}}!" },
        { "condition": "$.response.status == 'conflict'", "message": "That slot is taken." }
      ]
    }
  ]
}
```

| Field | Description |
|-------|-------------|
| `intent` | Unique identifier for the service |
| `reference` | Short description to help AI detect when to trigger |
| `method` | `GET` or `POST` |
| `endpoint` | External API URL |
| `requiredFields` | Fields the agent must collect from the user |
| `requiredFields[].properties` | Sub-properties for `arrayObject` type fields |
| `bodyTemplate` | Request body with `{{field}}` interpolation |
| `responseMapping` | Extract data from API response (JSONPath) |
| `responseConditions` | Conditional responses based on API result |

### Required Field Types

| Type | Description | Example Value |
|------|-------------|---------------|
| `string` | Free text | `"John Doe"` |
| `email` | Valid email address | `"user@email.com"` |
| `phone` | Phone number | `"+51987654321"` |
| `date` | Date (AI-normalized) | `"2024-03-15"` |
| `datetime` | Date and time | `"2024-03-15 14:30"` |
| `number` | Decimal number | `99.99` |
| `integer` | Whole number | `42` |
| `boolean` | True or false | `true` |
| `array` | Array of strings | `["value1", "value2"]` |
| `arrayObject` | Array of objects | `[{"field": "value"}]` |

#### `arrayObject` - Array of Objects

Use `arrayObject` when you need the user to provide a **list of items with multiple attributes**. Define sub-properties with `name` and `type`:

```json
{
  "name": "items_to_order",
  "type": "arrayObject",
  "description": "List of items the customer wants to order",
  "promptHint": "What items do you want to order? I need product name, quantity, and size.",
  "properties": [
    { "name": "product", "type": "string" },
    { "name": "quantity", "type": "integer" },
    { "name": "size", "type": "string" }
  ]
}
```

The AI will collect data and produce:
```json
[
  { "product": "T-Shirt", "quantity": 2, "size": "M" },
  { "product": "Hoodie", "quantity": 1, "size": "L" }
]
```

**Supported sub-property types:** `string`, `number`, `integer`, `boolean`

### Actions (Internal Operations)

```json
{
  "actions": [
    {
      "intent": "transfer_to_human",
      "reference": "Transfer conversation to human agent",
      "enabled": true,
      "responseMessage": "Transferring you to a specialist.",
      "action": [
        { "type": "action.asign", "value": "human-agent-id" },
        { "type": "action.tag", "value": "needs-human-support" }
      ]
    }
  ]
}
```

**Available action types:**

| Type | Description |
|------|-------------|
| `action.asign` | Assign conversation to a user |
| `action.tag` | Add a tag to the conversation |
| `action.stage` | Move conversation to a stage |
| `action.solved` | Mark conversation as resolved |
| `action.agentShutDown` | Deactivate AI agent for this conversation |
| `action.segmentation` | Add segmentation to the contact |
| `action.event.add` | Create a calendar event |
| `action.event.update` | Update a calendar event |
| `action.event.delete` | Delete a calendar event |
| `action.event.list` | List calendar events |

### Custom AI Provider

Use your own OpenAI, Claude, or Gemini API key:

```ts
const agent = await plazbot.agent.addAgent({
  name: "Custom AI Agent",
  prompt: "You are a helpful assistant.",
  zone: "LA",
  buffer: 5,
  useToolCalling: true,
  customAIConfig: true,
  aiProviders: [
    {
      provider: "openai",      // "openai" | "claude" | "gemini"
      model: "gpt-4o",
      apiToken: "sk-your-key",
      temperature: 0.7,
      maxTokens: 1000,
      isDefault: true
    }
  ]
});
```

---

## Portal

Portals are AI-powered search pages with a ChatGPT-like experience.

> A portal must have at least one associated agent to work.

### Create Portal

```ts
const portal = await plazbot.portal.addPortal({
  name: "Company Portal",
  zone: "LA",
  title: "AI Search Portal",
  subtitle: "Ask anything about our products",
  logo: "https://example.com/logo.png",
  logodark: "https://example.com/logo-dark.png",
  access: "direct",
  theme: "light",
  disabled: false,
  brandOff: false,
});

console.log(portal.url); // Public URL
```

| Field | Description |
|-------|-------------|
| `name` | Portal name |
| `title` | Heading shown at the top |
| `subtitle` | Description text |
| `logo` / `logodark` | Logo URLs (PNG/JPG) |
| `access` | `"direct"` or `"form"` |
| `theme` | `"light"` or `"dark"` |
| `disabled` | Activate/deactivate |
| `brandOff` | Hide Plazbot branding |

### Manage Portal

```ts
// Link agent to portal
await plazbot.portal.addAgentToPortal({ portalId, id: agentId });

// Remove agent from portal
await plazbot.portal.removeAgentFromPortal({ portalId, id: agentId });

// Add links (max 5)
await plazbot.portal.addLinkToPortal({
  portalId,
  value: "Documentation",
  url: "https://docs.plazbot.com"
});

// Clear all links
await plazbot.portal.clearLinks(portalId);

// Get portal info
const info = await plazbot.portal.getPortal(portalId);

// Update portal
await plazbot.portal.updatePortal({ id: portalId, name: "New Name", theme: "dark" });

// Delete portal
await plazbot.portal.deletePortal(portalId);
```

---

## WhatsApp

### Configuration

Before using WhatsApp features, connect your number in the Plazbot Dashboard.

Guide: [WhatsApp Configuration](https://docs.plazbot.com/guides/primeros-pasos/conectar-whatsapp)

### Send Messages

```ts
// Simple message (requires active 24h conversation window)
await plazbot.message.onWhatsappMessage({
  message: "Hello! Thanks for contacting us.",
  to: "51912345678"
});

// Template message (works anytime)
await plazbot.message.onConversation({
  to: "51912345678",
  template: "welcome_plazbot"
});

// Template with variables
await plazbot.message.onConversation({
  to: "51912345678",
  template: "order_confirmation",
  variablesBody: [
    { variable: "1", value: "John" },
    { variable: "2", value: "ORD-12345" }
  ]
});

// Template with file attachment
await plazbot.message.onConversation({
  to: "51912345678",
  template: "invoice_template",
  file: {
    fileUrl: "https://example.com/invoice.pdf",
    fileName: "invoice.pdf"
  }
});
```

### Webhooks

Receive incoming WhatsApp messages on your endpoint:

```ts
// Register
await plazbot.message.registerWebhook({
  number: "51912345678",
  webhookUrl: "https://your-server.com/webhooks/whatsapp"
});

// Remove
await plazbot.message.deleteWebhook({ number: "51912345678" });
```

### Message History

```ts
const messages = await plazbot.message.getMessages({ limit: 10 });
const history = await plazbot.message.getConversationHistory({ contactId: "id" });
const results = await plazbot.message.searchMessages({ query: "pricing" });
```

---

## Templates

Manage WhatsApp message templates:

```ts
// List all templates
const templates = await plazbot.template.getTemplates();

// List active templates only
const active = await plazbot.template.getActiveTemplates();

// Get template details
const template = await plazbot.template.getTemplate("template-id");
```

---

## Contacts

Manage your contact database:

```ts
// Create
const contact = await plazbot.contact.createContact({
  name: "John Doe",
  cellphone: "51912345678",
  email: "john@example.com",
  tags: ["lead", "website"]
});

// Read
const contacts = await plazbot.contact.getContacts();
const found = await plazbot.contact.getContact("contact-id");

// Search
const byPhone = await plazbot.contact.searchByPhone("51912345678");
const byEmail = await plazbot.contact.searchByEmail("john@example.com");

// Update
await plazbot.contact.updateContact({
  id: contact.id,
  name: "John Doe Updated",
  tags: ["lead", "premium"]
});

// Delete
await plazbot.contact.deleteContacts(["contact-id-1", "contact-id-2"]);
```

---

## Visual Reference

### Portal

![Portal](./assets/portal.png)

### Portal Light Mode
![Portal Light](./assets/portal-light.png)

### Portal Dark Mode
![Portal Dark](./assets/portal-dark.png)

### Widget
![Widget](./assets/widget-dark.png)

### Widget Messages
![Widget Messages](./assets/widget-ligth.png)

### WhatsApp
![WhatsApp](./assets/wsp.png)

---

## Language Codes

| Code | Language |
|------|----------|
| `es` | Spanish (General) |
| `es-419` | Spanish (Latin America) |
| `es-ES` | Spanish (Spain) |
| `en` | English (General) |
| `en-US` | English (United States) |
| `en-GB` | English (United Kingdom) |
| `fr` | French |
| `pt-BR` | Portuguese (Brazil) |
| `de` | German |

---

## TypeScript Support

The SDK exports all types for full IntelliSense support:

```ts
import type {
  AgentConfig,
  AgentData,
  AgentResponse,
  PortalConfig,
  PortalData,
  SendTemplateParams,
  TemplateVariable,
  WhatsAppTemplate,
  ContactData,
  CreateContactParams,
  PlazbotOptions
} from 'plazbot';
```

---

## Links

- [NPM Package](https://www.npmjs.com/package/plazbot)
- [Developer Documentation](https://docs.plazbot.com)
- [API Reference](https://docs.plazbot.com/api-reference/introduction)
- [Changelog](https://docs.plazbot.com/changelog/sdk)
- [Blog](https://www.plazbot.com/blog)

---

## Community

Join us to get updates, early access, and support:

[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/SgyAtrwzp7)
[![Twitter](https://img.shields.io/badge/Twitter-Follow-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/plazbotia)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/plazbotcrm)

**Support:** [support@plazbot.com](mailto:support@plazbot.com)
**Sales & Partnerships:** [sales@plazbot.com](mailto:sales@plazbot.com)

---

## License

MIT

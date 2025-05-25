import { Agent, Portal, Message } from 'plazbot';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bot = new Agent({
  workspaceId: "[YOUR_WORKSPACE_ID]",
  apiKey: "[API_KEY]",
  zone: "LA" // zone: "EU" // For Europe
});

const portal = new Portal({
  workspaceId: "[YOUR_WORKSPACE_ID]",
  apiKey: "[API_KEY]",
  zone: "LA" // zone: "EU" // For Europe
});

const message = new Message({
  workspaceId: "[YOUR_WORKSPACE_ID]",
  apiKey: "[API_KEY]",
  zone: "LA" // zone: "EU" // For Europe
});

async function main() {
  try {

    const configAgent = path.join(__dirname, 'agent.basic.config.json');
    const prompText = path.join(__dirname, 'prompt.txt');

    const configFile = await fs.readFile(configAgent, 'utf-8');
    const promptContent = await fs.readFile(prompText, 'utf-8');

    const config = JSON.parse(configFile);
    config.prompt = promptContent;

    //////////////////////// AGENT /////////////////////////////////

    const agent = await bot.addAgent(config);
    const agentId = agent.agentId;

    //update Agent
    const agentUpdated = await bot.updateAgent("agentId", config);
    console.log("✅ Agent Updated from agent.config.json:", config);

    // Delete Agent
    await bot.deleteAgent({
      id: agentId
    });
    
    const result = await bot.enableWidget({ id: agentId, enable: false });
    console.log("🔧 Widget State:", result);

    // // Get all agents
    const agents = await bot.getAgents();
    console.log("🧠 Agentes:", agents);

    // // Get a specific agent by ID
    const agentById = await bot.getAgentById({ id: agentId });
    console.log("📌 Agente por ID:", agentById);

    /////////////////////// PORTAL /////////////////////////

    const portalCreated = await portal.addPortal({
      name: "Portal Name",
      zone: "LA",
      title: "Help to Persons",
      subtitle: "Your trusted history source",
      logo: "https://storage-files-plz-latam.s3.sa-east-1.amazonaws.com/master/logo-plazbot.png",
      logodark: "https://storage-files-plz-latam.s3.sa-east-1.amazonaws.com/master/logo-plazbot.png",
      access: "direct", // or "form",
      disabled: false, // Disable the portal
      brandOff: false, // Disable the plazbot brand
    });

     const portalId = portalCreated.id;
     const portalUrl = portalCreated.url;
     
     console.log("🔗 Portal URL:", portalUrl);

    //Add a link to the portal
    await portal.addLinkToPortal({
      portalId: portalId,
      value: "Blog Plazbot",
      url: "https://www.plazbot.com/Blog"
    });

    //Add a link to the portal
    await portal.addLinkToPortal({
      portalId: portalId,
      value: "Developer Plazbot",
      url: "https://docs.plazbot.com/api-reference/introduction"
    });

    //Add a link to the portal
    await portal.addLinkToPortal({
      portalId: portalId,
      value: "Changelog Plazbot",
      url: "https://docs.plazbot.com/changelog/sdk"
    });

    //Add a link to the portal
    await portal.addLinkToPortal({
      portalId: portalId,
      value: "Documentacióm Plazbot",
      url: "https://docs.plazbot.com"
    });

     //Associate agent to the portal
    await portal.addAgentToPortal({
      portalId: portalId,
      id: agentId
    });
    // Clear links of the portal
    await portal.clearLinks(portalId);

    //Get information from the portal
    const portalInfo = await portal.getPortal(portalId);
    console.log("🔍 Portal:", portalInfo);

    //Update portal
    await portal.updatePortal({
      id: "portalId", 
      name: "Plazbot Portal Updated"
    });

     // Delete portal
    await portal.deletePortal(portalId);


    //////////////////////// WHATSAPP /////////////////////////////////

    const sessionId = crypto.randomUUID();
    const whatsapp = await message.onWhatsappMessage({
      message: "What features does Plazbot have?",
      to: "51912345678" 
    });

    const plantilla = await message.onConversation({
      to: "51912345678", 
      template: "plantila_plazbot_welcome"
    });


    await message.registerWebhook({
      number: '51912345678',
      webhookUrl: 'https://hook.us1.make.com/kkcbwaau8m9w5pedf6dcn26v5wockjv0'
    });


    await message.deleteWebhook({
      number: "51912345678"
    });

    ////////////////////////// ADD FILES ///////////////////////////////////


    const file = await bot.addFile({
      fileUrl: "",
      reference: "detailed reference about the file so that AI can understand its contents.",
      agentId: agentId
    });

    console.log("📁 File Added", file);


    const validated = await bot.validateFile({
      fileId: file.id
    });

    const deleted = await bot.deleteFile({
      fileId: file.id,
      agentId: agentId
    });

    
    console.log("✅ Success.");

  } catch (error) {
    console.error("❌ Error:", error);
  }

  
}

main();
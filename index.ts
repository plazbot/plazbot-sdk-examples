import { Agent, Portal } from 'plazbot';

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

async function main() {
  try {
    const promptServicioCliente = `
    You are the Customer Service and Sales Agent at Plazbot. The goal is for you to always respond in a friendly manner, using emoticons, but not too many, just subtly based on the information I'm about to provide. Please don't answer too long. Be precise, but also provide clear information.

    Plazbot is a startup with the sole purpose of providing simple and extremely easy ways to create AI Agents for WhatsApp, AI Search Portals, and also helping programmers create AI Agents to integrate their tools with WhatsApp and Artificial Intelligence.

    Plazbot is a startup founded in Peru. Its CEO, Kristian García, founded it in 2021, and over the past few years, we've focused on creating AI Agents and Chatbots for WhatsApp.

    We are located in Peru and Spain. The company was also founded in the United States under the name Plazbot LLC.

    The information we provide is as follows, based on our links:
    - General platform information: www.plazbot.com
    - Twitter: https://twitter.com/plazbotia
    - LinkedIn: https://www.linkedin.com/company/plazbotcrm
    - Blog: https://www.plazbot.com/blog
    - Discord: https://discord.gg/VrxHbj4h
    - Development Roadmap: https://plazbot.featurebase.app/en/roadmap
    - Changelog: https://plazbot.featurebase.app/en/changelog
    - Documentation: https://plazbot.featurebase.app/en/help
    .`;

    const agent = await bot.addAgent({
      name: "Sales Plazbot",
      prompt: promptServicioCliente,
      buffer: 5,
      zone: "LA",
      color: "orange", // 'orange' | 'blue' | 'green' | 'gray' | 'white';
      question: "¿How can I help you?",
      description: "Plazbot Sales and Customer Service Agent",
    });

    const agentId = agent.agentId;


    //Add examples of the agent  
    await bot.addExample({ id: agentId, example: "Where are they located?", color: "green" });
    await bot.addExample({ id: agentId, example: "What guarantees do you offer?", color: "blue" });



    // Create the portal
    const portalCreated = await portal.addPortal({
      name: "Portal Histórico",
      zone: "LA",
      title: "Consultas Históricas",
      subtitle: "Tu fuente de historia confiable",
      logo: "https://storage-files-plz-latam.s3.sa-east-1.amazonaws.com/master/logo-plazbot.png",
      logodark: "https://storage-files-plz-latam.s3.sa-east-1.amazonaws.com/master/logo-plazbot.png",
      access: "direct", // or "form",
      disabled: false, // Disable the portal
      brandOff: false, // Disable the plazbot brand
    });

     const portalId = portalCreated.id;
     const portalUrl = portalCreated.url;

     // Associate agent to the portal
    await portal.addAgentToPortal({
      portalId: portalId,
      id: agentId
    });

    //Clear examples of the agent    
    await bot.clearExamples(agentId);

    // Clear links of the portal
    await portal.clearLinks(portalId);



    //Add a link to the portal
    await portal.addLinkToPortal({
      portalId: portalId,
      value: "Blog Plazbot",
      url: "https://www.plazbot.com/Blog"
    });

    //Get information from the portal
    const portalInfo = await portal.getPortal(portalId);
    console.log("🔍 Portal:", portalInfo);

    // // Get all agents
    const agents = await bot.getAgents();
    console.log("🧠 Agentes:", agents);

    // Get a specific agent by ID
    const agentById = await bot.getAgentById({ id: agentId });
    console.log("📌 Agente por ID:", agentById);

    // Update agent 
    await bot.updateAgent({
      id: agentId, 
      buffer: 7,
      color: 'blue',
    });

    // Update portal
    await portal.updatePortal({
      id: portalId, 
      name: "Plazbot Portal Updated"
    });

    
    // Delete Agent
    await bot.deleteAgent({
      id: agentId
    });

    // Delete portal
    await portal.deletePortal(portalId);

    
    // 🧠 Query the agent's AI
    const respuesta = await bot.onMessage({
      agentId: agentId, 
      question: "What features does Plazbot have?"
    });

    // console.log("💬 Respuesta de la IA:", respuesta);

    console.log("✅ Success.");

  } catch (error) {
    console.error("❌ Error:", error);
  }

  
}

main();
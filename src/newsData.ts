import { NewsStory, TrendingTopic } from "./types";

export const TRENDING_TOPICS: TrendingTopic[] = [
  {
    id: "trend-1",
    topic: "AI",
    position: 1,
    label: "Gemini 3 Launch",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "trend-2",
    topic: "Space",
    position: 2,
    label: "Water on Europa",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "trend-3",
    topic: "Business",
    position: 3,
    label: "Semiconductor Boom",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "trend-4",
    topic: "Sports",
    position: 4,
    label: "Cricket World Cup",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "trend-5",
    topic: "Environment",
    position: 5,
    label: "Reef Recovery Effort",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=300&q=80",
  },
];

export const INITIAL_STORIES: NewsStory[] = [
  // ==================== INDIA CATEGORY (6 stories) ====================
  {
    id: "story-india-1",
    category: "India",
    title: "India unveils new coastal research initiative",
    summary: "The government has launched a new coastal research program focused on marine biodiversity, climate change, and coastal safety. It will deploy advanced autonomous sensors across 7,500 km of coastline.",
    whyItMatters: "The initiative could improve long-term monitoring and protection of India's coastal ecosystems, protecting millions of livelihoods from severe weather events.",
    source: "The Daily Chronicle",
    publishedAt: "2h ago",
    readTime: "45 sec read",
    imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
    isBreaking: true,
    originalUrl: "https://example.com/india-coastal-research",
    whatHappened: "The Ministry of Earth Sciences launched a state-of-the-art Coastal Marine Biodiversity & Safety (CMBS) initiative. The program combines autonomous underwater gliders, deep-sea sensors, and satellite monitoring.",
    keyPoints: [
      "Deploys over 250 automated marine sensors to track ocean heating and coral health.",
      "Creates a localized early warning system for storm surges and cyclonic activity.",
      "Allocates ₹1,200 Crores over the next three years to fund marine biology research hubs."
    ],
    background: "Over 250 million people live along India's coastline. Rising sea levels and intense cyclones require digital oceanographic initiatives.",
    timeline: [
      { time: "Monday — 10:00 AM", event: "Cabinet approves the ₹1,200 Crore CMBS science package." },
      { time: "Tuesday — 5:00 PM", event: "First telemetry batch from Chennai coastal sensor array successfully received." }
    ]
  },
  {
    id: "story-india-2",
    category: "India",
    title: "National supercomputer grid expanded with indigenous AI chips",
    summary: "India expands its High Performance Computing infrastructure by integrating indigenously designed AI accelerators across ten national research laboratories.",
    whyItMatters: "Boosts scientific sovereignty and accelerates weather prediction modeling and quantum simulations.",
    source: "New Delhi Tech Review",
    publishedAt: "4h ago",
    readTime: "30 sec read",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    isBreaking: false,
    originalUrl: "https://example.com/supercomputer-grid-india",
    whatHappened: "The grid received an additional 25 Petaflops of computational power running entirely on domestic hardware designed in Pune.",
    keyPoints: [
      "Integrates the new 'Trishul' AI accelerator chip built for neural tasks.",
      "Saves over ₹400 Crores compared to commercial hardware licensing fees.",
      "Available to research students working on carbon capture materials."
    ]
  },
  {
    id: "story-india-3",
    category: "India",
    title: "Historic solar grid turned on in Rajasthan desert",
    summary: "A massive 5-gigawatt solar park has been officially connected to the national power grid in western Rajasthan, making it one of the largest continuous solar installations globally.",
    whyItMatters: "Brings clean electricity to millions of households and contributes to India's net-zero carbon pledges.",
    source: "Bharat Urja Daily",
    publishedAt: "6h ago",
    readTime: "35 sec read",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    originalUrl: "https://example.com/rajasthan-solar-grid",
    whatHappened: "The project was commissioned three months ahead of schedule, covering 15,000 acres of desert wasteland."
  },
  {
    id: "story-india-4",
    category: "India",
    title: "New high-speed rail corridor gets green light in south India",
    summary: "The Ministry of Railways has approved a brand new high-speed rail system connecting Bengaluru, Chennai, and Hyderabad, cutting transit times down by 65%.",
    source: "Economic Monitor India",
    publishedAt: "9h ago",
    readTime: "25 sec read",
    imageUrl: "https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-india-5",
    category: "India",
    title: "Traditional medicinal herbs mapping completed by researchers",
    summary: "A joint taskforce of Ayurvedic doctors and molecular biologists has successfully cataloged 4,000 native Indian medicinal plants in a cloud-based genetic taxonomy.",
    source: "Science India Digest",
    publishedAt: "12h ago",
    readTime: "20 sec read",
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-india-6",
    category: "India",
    title: "Bengaluru startups secure record-breaking micro-climate funding",
    summary: "A coalition of green tech startups in Karnataka has raised $180M to build IoT arrays monitoring city heat bubbles and dynamic pollution corridors.",
    source: "Bengaluru Tech Daily",
    publishedAt: "1d ago",
    readTime: "40 sec read",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
  },

  // ==================== WORLD CATEGORY (5 stories) ====================
  {
    id: "story-world-1",
    category: "World",
    title: "Global climate summit agrees on historic ocean treaty",
    summary: "Delegates from over 140 nations have signed a landmark treaty protecting 30% of high-seas marine life by 2030. The agreement establishes severe penalties for industrial overfishing and deep-sea mineral extraction.",
    whyItMatters: "High seas cover nearly half of the Earth's surface but were previously unregulated, leaving them vulnerable to climate change and commercial exploitation.",
    source: "World News Herald",
    publishedAt: "4h ago",
    readTime: "40 sec read",
    imageUrl: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=800&q=80",
    originalUrl: "https://example.com/world-ocean-treaty",
    whatHappened: "After a dramatic 36-hour negotiation marathon in Geneva, negotiators finalized the Global Marine Biodiversity Treaty (GMBT).",
    keyPoints: [
      "Sets up international marine sanctuaries where commercial fishing and mining are outlawed.",
      "Enforces a shared royalty system for marine genetic discoveries.",
      "Deploys global AI-powered satellite networks to identify illegal fishing fleets."
    ]
  },
  {
    id: "story-world-2",
    category: "World",
    title: "European Union establishes continent-wide hyperloop test route",
    summary: "A group of six EU nations has approved funding for a 400km vacuum tube transit track linking three major capital cities for ultra-high-speed cargo.",
    whyItMatters: "Aims to replace short-haul carbon-heavy air freight flights within central Europe completely.",
    source: "The Brussels Report",
    publishedAt: "6h ago",
    readTime: "30 sec read",
    imageUrl: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=800&q=80",
    originalUrl: "https://example.com/eu-hyperloop-corridor"
  },
  {
    id: "story-world-3",
    category: "World",
    title: "Iceland starts operation of world's largest carbon removal plant",
    summary: "A geothermally powered carbon capturing facility has officially booted up in Reykjavik, drawing carbon dioxide directly from the atmosphere and storing it in underground rock formations.",
    source: "Global Green Outlook",
    publishedAt: "8h ago",
    readTime: "35 sec read",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-world-4",
    category: "World",
    title: "Pacific island nations establish joint digital sovereignty grid",
    summary: "Ten remote Pacific island countries have pooled resources to create a shared secure sovereign cloud infrastructure hosted on specialized green micro-data centers.",
    source: "Sovereign Tech Global",
    publishedAt: "10h ago",
    readTime: "25 sec read",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-world-5",
    category: "World",
    title: "Nations finalize treaty regulating commercial space orbits",
    summary: "In a massive space-diplomacy win, international space administrations have ratified rules requiring active garbage cleanups for all newly launched satellites.",
    source: "Geneva Space Treaty Office",
    publishedAt: "14h ago",
    readTime: "40 sec read",
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80"
  },

  // ==================== BUSINESS CATEGORY (5 stories) ====================
  {
    id: "story-business-1",
    category: "Business",
    title: "Global semiconductor merger creates new hardware giant",
    summary: "Two of the world's leading chip-manufacturing firms have announced an $85 billion merger. The consolidated company will focus entirely on developing ultra-efficient 1-nanometer processor chips.",
    whyItMatters: "The merger could shift global technology power dynamics, accelerating the delivery of high-performance hardware required for quantum computers and advanced AI servers.",
    source: "Financial Times Network",
    publishedAt: "5h ago",
    readTime: "50 sec read",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    originalUrl: "https://example.com/semiconductor-merger",
    whatHappened: "Silicon Core and NexChip announced they are combining operations. The new company, ApexSilicon, immediately becomes the largest chip-design house globally.",
    keyPoints: [
      "Combines cutting-edge lithography patents into a single corporate portfolio.",
      "Secures a massive $10 billion backing from sovereign wealth funds.",
      "Aims to achieve commercial production of 1nm chips by late next year."
    ]
  },
  {
    id: "story-business-2",
    category: "Business",
    title: "E-commerce major pivots entirely to local autonomous delivery",
    summary: "One of the largest global retail distributors announces it is phased out human delivery vans in favor of automated local drone fleets in 50 metro areas.",
    whyItMatters: "Slashes carbon emissions by 75% and shifts local delivery speeds into a guaranteed 15-minute window.",
    source: "The Wall Street Pulse",
    publishedAt: "7h ago",
    readTime: "30 sec read",
    imageUrl: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-business-3",
    category: "Business",
    title: "Green bonds hit historic highs as ESG regulations tighten",
    summary: "Global institutional investors have poured over $450 billion into sovereign climate bonds, indicating massive corporate demand for renewable infrastructure investment backing.",
    source: "Market Watch Today",
    publishedAt: "9h ago",
    readTime: "35 sec read",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-business-4",
    category: "Business",
    title: "Traditional bank launches first quantum-secured trading vault",
    summary: "The financial titan has integrated quantum-key distribution across its core interbank settlement networks to prevent decrypting attacks from state-sponsored hackers.",
    source: "FinTech Wire",
    publishedAt: "12h ago",
    readTime: "40 sec read",
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-business-5",
    category: "Business",
    title: "Global remote work tax framework ratified by OECD",
    summary: "A unified system has been established to standardize income tax processing for digital nomads operating across different sovereign jurisdictions.",
    source: "Global Fiscal Gazette",
    publishedAt: "15h ago",
    readTime: "25 sec read",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
  },

  // ==================== TECHNOLOGY CATEGORY (5 stories) ====================
  {
    id: "story-tech-1",
    category: "Technology",
    title: "Next-gen solid state batteries enter pilot production",
    summary: "A technology startup has initiated pilot assembly of solid-state lithium-metal batteries for consumer electronics. The batteries offer double the energy density of current smartphone batteries.",
    whyItMatters: "This could soon result in smartphones with 3-day battery life and electric vehicles with a driving range exceeding 1,000 kilometers on a single charge.",
    source: "Future Wire",
    publishedAt: "6h ago",
    readTime: "30 sec read",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    originalUrl: "https://example.com/solid-state-batteries",
    whatHappened: "VoltAmps Technologies opened its first automated pilot factory in Bavaria, producing solid-state batteries that replace flammable liquid electrolytes with solid ceramics."
  },
  {
    id: "story-tech-2",
    category: "Technology",
    title: "Quantum processor breaks the 1000-logical-qubit barrier",
    summary: "Computing labs have successfully engineered a topological quantum processor utilizing specialized superconducting arrays, bypassing previous error rates entirely.",
    whyItMatters: "Enables instant modeling of complex molecular binds, transforming pharmacokinetics and material design.",
    source: "Quantum Computing News",
    publishedAt: "8h ago",
    readTime: "35 sec read",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-tech-3",
    category: "Technology",
    title: "Decentralized identity protocol adopted by global web systems",
    summary: "A secure cryptographic web standard has been pushed to active browsers, allowing users to authenticate on any platform without relying on password servers.",
    source: "Crypto Web Security",
    publishedAt: "10h ago",
    readTime: "25 sec read",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-tech-4",
    category: "Technology",
    title: "Light-based computer chips demonstrate dramatic power saving",
    summary: "Photonic chipmakers have demonstrated a functional optical data processor that handles heavy enterprise calculations using laser pulses rather than electrical currents.",
    source: "Tech Hardware Review",
    publishedAt: "13h ago",
    readTime: "30 sec read",
    imageUrl: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-tech-5",
    category: "Technology",
    title: "Wearable holographic displays enter consumer beta stage",
    summary: "Lightweight smart glasses equipped with micro-projectors have been deployed to early testers, overlaying real-time translation texts on natural conversation flows.",
    source: "Augmented Reality Daily",
    publishedAt: "17h ago",
    readTime: "40 sec read",
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80"
  },

  // ==================== AI CATEGORY (5 stories) ====================
  {
    id: "story-ai-1",
    category: "AI",
    title: "Gemini 3 model sets new benchmark in multi-turn reasoning",
    summary: "Google's newly unveiled Gemini 3 model demonstrates unprecedented capabilities in logic, math, and code translation. It can process multimodal inputs simultaneously and retains long-term context across millions of tokens.",
    whyItMatters: "This marks a massive leap toward true digital agentic intelligence, enabling complex scientific simulations and highly specialized coding assistants.",
    source: "Global Tech Insights",
    publishedAt: "1h ago",
    readTime: "35 sec read",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
    isBreaking: true,
    originalUrl: "https://example.com/gemini-3-launch",
    whatHappened: "Google released Gemini 3, their latest flagship AI model with advanced reasoning loops."
  },
  {
    id: "story-ai-2",
    category: "AI",
    title: "Open-source AI models match private industry giants in logic",
    summary: "A community-trained open-source large language model has scored on par with proprietary systems in formal logic, coding, and medical diagnostics exams.",
    whyItMatters: "Democratizes state-of-the-art software capabilities and reduces structural compute costs for indie devs globally.",
    source: "AI Frontiers",
    publishedAt: "3h ago",
    readTime: "30 sec read",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-ai-3",
    category: "AI",
    title: "Nvidia announces next-generation Blackwell Ultra GPU architecture",
    summary: "The semiconductor leader has unveiled hardware optimized explicitly for training ultra-massive multi-modal systems, featuring three times faster floating-point computations.",
    source: "Silicon Valley Tech Report",
    publishedAt: "5h ago",
    readTime: "40 sec read",
    imageUrl: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-ai-4",
    category: "AI",
    title: "AI-driven biology lab successfully synthesizes new enzymes",
    summary: "An autonomous robotic chemistry laboratory steered by a specialized fine-tuned model has successfully discovered and manufactured three novel plastic-eating bacteria enzymes.",
    source: "Nature Bio-AI Journal",
    publishedAt: "7h ago",
    readTime: "45 sec read",
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-ai-5",
    category: "AI",
    title: "Dynamic visual generator model creates full 3D simulation loops",
    summary: "A startup releases an AI model that takes physics text prompts and generates complete 3D virtual environments with consistent physical collisions and gravity.",
    source: "Visual Tech Gazette",
    publishedAt: "10h ago",
    readTime: "30 sec read",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
  },

  // ==================== SPORTS CATEGORY (5 stories) ====================
  {
    id: "story-sports-1",
    category: "Sports",
    title: "Historic final: Cricket championship decided on last ball",
    summary: "In one of the most thrilling matches in sports history, India clinched the international championship cup with a dramatic six on the final ball, overcoming a seemingly impossible run chase.",
    whyItMatters: "This legendary victory solidifies the current squad's status as one of the greatest cricket lineups of all time, uniting millions in celebration.",
    source: "Apex Sports",
    publishedAt: "7h ago",
    readTime: "45 sec read",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    originalUrl: "https://example.com/cricket-championship",
    whatHappened: "Chasing a target of 192 in the final over, India required 18 runs from the last 6 balls to secure the cup."
  },
  {
    id: "story-sports-2",
    category: "Sports",
    title: "Tennis prodigy secures record-shattering Grand Slam title",
    summary: "An 18-year-old qualifier has completed a historic sweep of the major clay court championship in Paris, defeating the reigning top seed in straight sets.",
    whyItMatters: "Signals a tectonic shift and the arrival of a new era in modern international tennis history.",
    source: "The Court Daily",
    publishedAt: "9h ago",
    readTime: "30 sec read",
    imageUrl: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-sports-3",
    category: "Sports",
    title: "World Athletics adopts real-time carbon-fiber stride telemetry",
    summary: "High-tech running tracks and carbon insoles fitted with Bluetooth pressure pads are being approved to track foot-strike physics during competitive events.",
    source: "Speed & Physics",
    publishedAt: "11h ago",
    readTime: "35 sec read",
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-sports-4",
    category: "Sports",
    title: "Formula 1 outlines blueprint for 100% sustainable fuels",
    summary: "All competitive engines in the elite racing circuit must burn carbon-neutral synthetic fuels by next season, accelerating retail combustion innovation.",
    source: "Motorsport Insider",
    publishedAt: "14h ago",
    readTime: "40 sec read",
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-sports-5",
    category: "Sports",
    title: "Dynamic biomechanic tracking reduces soccer injury rates",
    summary: "By wearing smart jerseys tracking rotational bone stresses, professional teams have reported a massive 45% decrease in hamstring tears during league play.",
    source: "Athletic Science Quarterly",
    publishedAt: "18h ago",
    readTime: "25 sec read",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80"
  },

  // ==================== SCIENCE CATEGORY (5 stories) ====================
  {
    id: "story-science-1",
    category: "Science",
    title: "Scientists discover ancient underwater river system",
    summary: "Oceanographers mapping the floor of the Mediterranean have uncovered remnants of an ancient giant river system that flowed millions of years ago when the sea was completely dry.",
    whyItMatters: "The discovery provides deep insights into prehistoric climate crises, helping geologists model how geography adapts to severe oceanographic changes.",
    source: "Science Scientific",
    publishedAt: "8h ago",
    readTime: "35 sec read",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    originalUrl: "https://example.com/underwater-river-system"
  },
  {
    id: "story-science-2",
    category: "Science",
    title: "Fusion labs report record-breaking continuous power burst",
    summary: "Magnetic confinement tokamak systems maintained a stable 150-million-degree deuterium plasma loop for a continuous 5 minutes, doubling all past thermal records.",
    whyItMatters: "Proves that magnetic plasma shielding techniques are mature enough to move toward pilot powerplant blueprint plans.",
    source: "Fusion Energy Journal",
    publishedAt: "10h ago",
    readTime: "30 sec read",
    imageUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-science-3",
    category: "Science",
    title: "Deep-earth tectonic drill extracts oldest silicate crust mantle",
    summary: "Geologists drilling a deep marine trench have pulled out pure, pristine silicate samples from the transition zone, confirming thermal mantle movements.",
    source: "Plate Tectonics Review",
    publishedAt: "13h ago",
    readTime: "40 sec read",
    imageUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-science-4",
    category: "Science",
    title: "New solid compound mimics natural photosynthesis pathways",
    summary: "Chemists synthesize a metal-organic framework that takes natural solar rays and converts dissolved CO2 directly into energy-dense liquid methanol with 12% efficiency.",
    source: "Synthesis & Matter",
    publishedAt: "16h ago",
    readTime: "25 sec read",
    imageUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-science-5",
    category: "Science",
    title: "Deep ocean mapping uncovers 200 unknown deep-sea species",
    summary: "Deep-sea submersibles filming a volcanic ridge in the southern Pacific have documented a beautiful array of glowing jellyfish and unique silicon-shelled crabs.",
    source: "Marine Discovery World",
    publishedAt: "1d ago",
    readTime: "35 sec read",
    imageUrl: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80"
  },

  // ==================== ENVIRONMENT CATEGORY (5 stories) ====================
  {
    id: "story-environment-1",
    category: "Environment",
    title: "Great Barrier Reef shows unprecedented coral recovery",
    summary: "Marine biologists have reported the highest level of northern and central coral cover in 36 years, thanks to rapid coral spawning programs and cooler ocean currents this season.",
    whyItMatters: "While severe climate risks remain, this sudden recovery shows that active marine seeding interventions and cooling events can successfully stabilize fragile ecosystems.",
    source: "Eco Watch",
    publishedAt: "12h ago",
    readTime: "30 sec read",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
    originalUrl: "https://example.com/barrier-reef-recovery"
  },
  {
    id: "story-environment-2",
    category: "Environment",
    title: "Amazon rainforest conservation corridor protects 10M hectares",
    summary: "A treaty signed by four South American nations establishes a fully continuous conservation zone, backed by radar telemetry to arrest illegal loggers.",
    whyItMatters: "Provides a safe migration pathway for thousands of endangered feline and bird species amid shifting weather zones.",
    source: "Amazonia Tribune",
    publishedAt: "14h ago",
    readTime: "35 sec read",
    imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-environment-3",
    category: "Environment",
    title: "Massive kelp farms deployed off Pacific coast as carbon sink",
    summary: "Commercial seaweed growers have anchored huge floating lines of giant kelp, aimed at absorbing heavy agricultural runoff before it forms dead coastal zones.",
    source: "Algae & Planet",
    publishedAt: "16h ago",
    readTime: "25 sec read",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-environment-4",
    category: "Environment",
    title: "Global soil restoration project covers degraded wheat belts",
    summary: "An organic seeding approach combining nitrogen-fixing crops and fungal spores restores mineral fertility across over-farmed continental farmlands.",
    source: "Soil Science International",
    publishedAt: "19h ago",
    readTime: "30 sec read",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-environment-5",
    category: "Environment",
    title: "City green rooftops successfully reduce urban heat island effect",
    summary: "By covering 25% of commercial buildings in dynamic plant layers, average local temperatures dropped by 3 degrees during summer thermal waves.",
    source: "Metropolis Ecology",
    publishedAt: "1d ago",
    readTime: "40 sec read",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80"
  },

  // ==================== ENTERTAINMENT CATEGORY (5 stories) ====================
  {
    id: "story-entertainment-1",
    category: "Entertainment",
    title: "Virtual studio makes indie filmmaking completely digital",
    summary: "An independent film studio has completed production on an epic sci-fi feature using a highly realistic AI-driven virtual production volume, reducing traditional production costs by 80%.",
    whyItMatters: "This democratizes high-end filmmaking, allowing independent storytellers with small budgets to produce visual effects on par with major Hollywood studios.",
    source: "Cinema Daily",
    publishedAt: "14h ago",
    readTime: "35 sec read",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
    originalUrl: "https://example.com/virtual-filmmaking"
  },
  {
    id: "story-entertainment-2",
    category: "Entertainment",
    title: "First neural audio synthesizer renders classical concert",
    summary: "A custom-trained audio generator takes centuries-old sheet music fragments and outputs a highly detailed symphonic recording with acoustic room reverb.",
    whyItMatters: "Allows music historians to listen to lost compositions as they would sound inside specific 18th-century European theaters.",
    source: "Symphony Wire",
    publishedAt: "16h ago",
    readTime: "30 sec read",
    imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-entertainment-3",
    category: "Entertainment",
    title: "Indie game scores top honors at global digital art festival",
    summary: "A watercolor platformer hand-painted over three years wins Game of the Year, defeating multi-billion dollar studio productions on overall creativity.",
    source: "Pixel & Canvas",
    publishedAt: "18h ago",
    readTime: "25 sec read",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-entertainment-4",
    category: "Entertainment",
    title: "Streaming networks roll out real-time language lip syncing",
    summary: "Using deep local rendering, streaming video feeds now alter actors' mouth structures dynamically to match translated voice-over languages accurately.",
    source: "Media Streaming Review",
    publishedAt: "21h ago",
    readTime: "40 sec read",
    imageUrl: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-entertainment-5",
    category: "Entertainment",
    title: "Interactive holographic plays make live theater adaptive",
    summary: "A London stage incorporates responsive laser sensors, changing the narrative flow based on the physical movements and sounds of the audience.",
    source: "Stage Tech Global",
    publishedAt: "1d ago",
    readTime: "35 sec read",
    imageUrl: "https://images.unsplash.com/photo-1460881680858-30d872d5b530?auto=format&fit=crop&w=800&q=80"
  },

  // ==================== SPACE CATEGORY (5 stories) ====================
  {
    id: "story-space-1",
    category: "Space",
    title: "Europa Clipper detects extensive liquid ocean beneath ice crust",
    summary: "NASA's Europa Clipper probe has sent back detailed radar data indicating a vast, warm liquid water ocean beneath Europa's icy surface, complete with active hydrothermal vents.",
    whyItMatters: "Where there is warm liquid water, chemical activity, and geothermal energy, there is a strong possibility of microbial life, making Europa our solar system's top target.",
    source: "Deep Space News",
    publishedAt: "10h ago",
    readTime: "45 sec read",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    isBreaking: true,
    originalUrl: "https://example.com/europa-clipper-ocean"
  },
  {
    id: "story-space-2",
    category: "Space",
    title: "Manned lunar orbital habitat completes module assembly",
    summary: "International space agencies lock together the main life-support hub, securing a stable microgravity outpost for continuous deep-space science studies.",
    whyItMatters: "Serves as the vital staging platform for future robotic and human exploration voyages to Mars.",
    source: "Lunar Orbit Gazette",
    publishedAt: "12h ago",
    readTime: "35 sec read",
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-space-3",
    category: "Space",
    title: "Deep telescope captures detailed light from first-generation stars",
    summary: "Using infrared spectroscopic focus, astronomers map chemical signatures of ancient population III stars born just 200 million years after the Big Bang.",
    source: "Astrophysical Journal Daily",
    publishedAt: "14h ago",
    readTime: "40 sec read",
    imageUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-space-4",
    category: "Space",
    title: "Mars ice mapper detects underground clean water glaciers",
    summary: "An orbital radar scanning the Martian mid-latitudes has mapped clean ice plates sitting only three feet below dry surface dust, simplifying human colony planning.",
    source: "Ares Planetology",
    publishedAt: "17h ago",
    readTime: "30 sec read",
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "story-space-5",
    category: "Space",
    title: "Sovereign mega-rocket booster executes flawless double return",
    summary: "Two super-massive reusable booster rings return in tandem to separate landing platforms, cutting commercial deep orbit payload delivery costs in half.",
    source: "Aerospace Frontiers",
    publishedAt: "20h ago",
    readTime: "45 sec read",
    imageUrl: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80"
  }
];

// Helper to filter news stories by category
export function getStoriesByCategory(categoryName: string): NewsStory[] {
  if (categoryName.toLowerCase() === "for you") {
    return INITIAL_STORIES;
  }
  return INITIAL_STORIES.filter(
    (story) => story.category.toLowerCase() === categoryName.toLowerCase()
  );
}

// 5 important stories from the last 24 hours for "What You Missed"
export const WHAT_YOU_MISSED_STORIES: NewsStory[] = INITIAL_STORIES.slice(0, 5);

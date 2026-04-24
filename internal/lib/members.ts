export type SectionType = 'Core Team' | 'Growth' | 'Product' | 'Operations' | 'Partnerships';

export interface Member {
  id: string;
  name: string;
  section: SectionType;
  personalityLine: string;
  imageUrl: string;
  hoverImageUrl: string;
  // Detailed Profile Content
  university: string;
  quote: string;
  representsMe: string;
  topic30Min: string;
  askMeAbout: string;
  currentlyBuilding: string;
  experience: string;
  obsessedWith: string;
  whenNoOneWatching: string;
  coreValues: string;
  links: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
}

export const mockMembers: Member[] = [
  // Core Team
  { 
    id: '1', 
    name: 'Nguyen Quang Anh', 
    section: 'Core Team', 
    personalityLine: 'Probably building something at 2AM', 
    imageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Felix&scale=130&translateY=10&backgroundColor=transparent',
    hoverImageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Felix&scale=140&translateY=10&backgroundColor=transparent',
    university: 'Hanoi University of Science and Technology',
    quote: '"Move fast and break things, then fix them silently before anyone notices."',
    representsMe: 'A mechanical keyboard with fully custom switches',
    topic30Min: 'Why monolithic architectures are sometimes better than microservices',
    askMeAbout: 'System design, React performance, Mechanical Keyboards',
    currentlyBuilding: 'A next-gen state management library for React',
    experience: 'Ex-Shopee Senior Engineer, 5+ years building high-scale e-commerce systems',
    obsessedWith: 'Optimizing terminal workflows and custom vim setups',
    whenNoOneWatching: 'Writing overly complex typescript types for fun',
    coreValues: 'Curiosity, Resilience, Craftsmanship',
    links: { linkedin: '#', github: '#' }
  },
  { 
    id: '2', 
    name: 'Tran Minh Duc', 
    section: 'Core Team', 
    personalityLine: 'Turns chaos into systems (most of the time)', 
    imageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Oliver&scale=130&translateY=10&backgroundColor=transparent',
    hoverImageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Oliver&scale=140&translateY=10&backgroundColor=transparent',
    university: 'RMIT University Vietnam',
    quote: '"A system is only as good as the understanding of the people using it."',
    representsMe: 'A perfectly organized Notion workspace',
    topic30Min: 'The psychology behind habit-forming products',
    askMeAbout: 'Product strategy, Agile workflows, Espresso making',
    currentlyBuilding: 'Project X (xOS) - The next generation community platform',
    experience: 'Product Owner at VNG, led the core platform team for 3 years',
    obsessedWith: 'Dialing in the exact extraction time for a perfect espresso shot',
    whenNoOneWatching: 'Reorganizing my desktop folders for the 10th time',
    coreValues: 'Empathy, Clarity, Structure',
    links: { linkedin: '#' }
  },
  { 
    id: '3', 
    name: 'Le Bao Ngoc', 
    section: 'Core Team', 
    personalityLine: 'Says "just one more thing"… every time', 
    imageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Sophia&scale=130&translateY=10&backgroundColor=transparent',
    hoverImageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Sophia&scale=140&translateY=10&backgroundColor=transparent',
    university: 'Foreign Trade University',
    quote: '"Details matter, it\'s worth waiting to get it right."',
    representsMe: 'A sketchbook full of wireframes and doodles',
    topic30Min: 'Typography scales and grid systems in modern web design',
    askMeAbout: 'Figma prototypes, User research, Interior design',
    currentlyBuilding: 'An open-source UI component library based on brutalism',
    experience: 'Lead Designer at Momo, crafted mobile experiences for millions of users',
    obsessedWith: 'Collecting vintage design magazines from the 90s',
    whenNoOneWatching: 'Watching 4-hour video essays on architecture',
    coreValues: 'Aesthetics, User-Centricity, Perfectionism',
    links: { linkedin: '#', website: '#' }
  },
  { 
    id: '12', 
    name: 'Test User 1', 
    section: 'Core Team', 
    personalityLine: 'Just testing the scroll', 
    imageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Test1&scale=130&translateY=10&backgroundColor=transparent',
    hoverImageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Test1&scale=140&translateY=10&backgroundColor=transparent',
    university: 'Test University',
    quote: '"Scroll to the right to see more."',
    representsMe: 'A loading spinner',
    topic30Min: 'How to scroll horizontally',
    askMeAbout: 'Scrolling, Padding, Margin',
    currentlyBuilding: 'A test profile',
    experience: 'Professional Scroller',
    obsessedWith: 'CSS overflow properties',
    whenNoOneWatching: 'Scrolling infinitely',
    coreValues: 'Test, Debug, Scroll',
    links: {}
  },
  { 
    id: '13', 
    name: 'Test User 2', 
    section: 'Core Team', 
    personalityLine: 'Another scroll tester', 
    imageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Test2&scale=130&translateY=10&backgroundColor=transparent',
    hoverImageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Test2&scale=140&translateY=10&backgroundColor=transparent',
    university: 'Test University',
    quote: '"Keep scrolling, nothing to see here."',
    representsMe: 'A scrollbar',
    topic30Min: 'Advanced CSS masks',
    askMeAbout: 'Overflow-x, Snap-x, Transform',
    currentlyBuilding: 'Another test profile',
    experience: 'Senior Scroller',
    obsessedWith: 'Checking if cards get clipped',
    whenNoOneWatching: 'Zooming in on pixels',
    coreValues: 'Scroll, Test, Debug',
    links: {}
  },
  // Growth
  { 
    id: '4', 
    name: 'Pham Gia Huy', 
    section: 'Growth', 
    personalityLine: 'Makes things go viral (on purpose)', 
    imageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Noah&scale=130&translateY=10&backgroundColor=transparent',
    hoverImageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Noah&scale=140&translateY=10&backgroundColor=transparent',
    university: 'National Economics University',
    quote: '"Attention is the only currency that matters today."',
    representsMe: 'A trending TikTok audio',
    topic30Min: 'Reverse-engineering the YouTube algorithm',
    askMeAbout: 'Growth hacking, Short-form video strategy, Content distribution',
    currentlyBuilding: 'A network of niche media brands reaching 1M+ weekly',
    experience: 'Growth Lead at a top EdTech startup, 10x user acquisition in 6 months',
    obsessedWith: 'Analyzing click-through rates of YouTube thumbnails',
    whenNoOneWatching: 'Doomscrolling competitor feeds for inspiration',
    coreValues: 'Impact, Speed, Adaptability',
    links: { linkedin: '#', twitter: '#' }
  },
  { 
    id: '5', 
    name: 'Do Khanh Linh', 
    section: 'Growth', 
    personalityLine: 'Talks to strangers like it’s a skill (it is)', 
    imageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Isabella&scale=130&translateY=10&backgroundColor=transparent',
    hoverImageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Isabella&scale=140&translateY=10&backgroundColor=transparent',
    university: 'Diplomatic Academy of Vietnam',
    quote: '"Your network is your net worth, literally."',
    representsMe: 'A fully booked Google Calendar',
    topic30Min: 'How to build genuine relationships in 5 minutes',
    askMeAbout: 'Community building, Event operations, Networking',
    currentlyBuilding: 'The Project X ambassador program across 10 universities',
    experience: 'Community Manager for a Web3 DAO with 50k+ active members',
    obsessedWith: 'Finding the best underground coffee shops in the city',
    whenNoOneWatching: 'Practicing conversational icebreakers',
    coreValues: 'Authenticity, Energy, Connection',
    links: { linkedin: '#' }
  },
  // Product
  { 
    id: '6', 
    name: 'Nguyen Hoang Long', 
    section: 'Product', 
    personalityLine: 'Build first, figure it out later', 
    imageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Liam&scale=130&translateY=10&backgroundColor=transparent',
    hoverImageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Liam&scale=140&translateY=10&backgroundColor=transparent',
    university: 'VNU University of Engineering and Technology',
    quote: '"Done is better than perfect, unless it crashes production."',
    representsMe: 'A completely unreadable terminal output',
    topic30Min: 'Why we should rewrite everything in Rust (again)',
    askMeAbout: 'Backend architecture, Cloud infrastructure, Hackathons',
    currentlyBuilding: 'A decentralized computing platform for AI models',
    experience: 'Senior Backend Engineer at GHTK, maintaining 10k+ requests per second',
    obsessedWith: 'Benchmarking random programming languages',
    whenNoOneWatching: 'Leaving TODO comments I know I will never fix',
    coreValues: 'Execution, Logic, Innovation',
    links: { github: '#' }
  },
  { 
    id: '7', 
    name: 'Bui Thanh Ha', 
    section: 'Product', 
    personalityLine: 'Designs things people actually use', 
    imageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Mia&scale=130&translateY=10&backgroundColor=transparent',
    hoverImageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Mia&scale=140&translateY=10&backgroundColor=transparent',
    university: 'FPT University',
    quote: '"Design is how it works, not just how it looks."',
    representsMe: 'A perfectly aligned vector graphic',
    topic30Min: 'The evolution of affordances in mobile interfaces',
    askMeAbout: 'UX Research, Accessibility, Design Systems',
    currentlyBuilding: 'A standardized accessibility framework for internal tools',
    experience: 'Product Designer at Techcombank, redesigned the core banking app',
    obsessedWith: 'Finding the exact hex code for the perfect shade of blue',
    whenNoOneWatching: 'Judging the kerning on random street signs',
    coreValues: 'Usability, Empathy, Simplicity',
    links: { website: '#' }
  },
  // Operations
  { 
    id: '8', 
    name: 'Vo Minh Khoa', 
    section: 'Operations', 
    personalityLine: 'If it works smoothly, thank him', 
    imageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Jack&scale=130&translateY=10&backgroundColor=transparent',
    hoverImageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Jack&scale=140&translateY=10&backgroundColor=transparent',
    university: 'Ho Chi Minh City University of Technology',
    quote: '"Chaos is just undocumented order."',
    representsMe: 'An immensely complex but beautiful Excel spreadsheet',
    topic30Min: 'How to automate your entire life with Zapier',
    askMeAbout: 'Process optimization, DevOps, Financial modeling',
    currentlyBuilding: 'An automated internal dashboard for tracking project velocity',
    experience: 'Operations Lead at a logistics startup, scaled team from 10 to 100',
    obsessedWith: 'Zero-inbox email management',
    whenNoOneWatching: 'Writing python scripts to automate web games',
    coreValues: 'Efficiency, Reliability, Transparency',
    links: { linkedin: '#' }
  },
  { 
    id: '9', 
    name: 'Dang Thu Trang', 
    section: 'Operations', 
    personalityLine: 'Keeps everything from falling apart', 
    imageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Charlotte&scale=130&translateY=10&backgroundColor=transparent',
    hoverImageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Charlotte&scale=140&translateY=10&backgroundColor=transparent',
    university: 'VinUniversity',
    quote: '"A good plan today is better than a perfect plan tomorrow."',
    representsMe: 'A clipboard with exactly three pens',
    topic30Min: 'Crisis management and risk mitigation strategies',
    askMeAbout: 'Event planning, Resource allocation, Team dynamics',
    currentlyBuilding: 'A comprehensive onboarding playbook for new hires',
    experience: 'Chief of Staff at a Series A fintech, managed cross-functional operations',
    obsessedWith: 'Color-coding physical sticky notes',
    whenNoOneWatching: 'Listening to true crime podcasts while cooking',
    coreValues: 'Anticipation, Stability, Support',
    links: { linkedin: '#' }
  },
  // Partnerships
  { 
    id: '10', 
    name: 'Hoang Duc Anh', 
    section: 'Partnerships', 
    personalityLine: 'Knows who to call, and when', 
    imageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Elijah&scale=130&translateY=10&backgroundColor=transparent',
    hoverImageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Elijah&scale=140&translateY=10&backgroundColor=transparent',
    university: 'British University Vietnam',
    quote: '"Business is just relationships with contracts."',
    representsMe: 'A firm handshake',
    topic30Min: 'B2B sales strategy in emerging Asian markets',
    askMeAbout: 'Negotiation, Enterprise deals, Strategic alliances',
    currentlyBuilding: 'A partnership pipeline with top tier 1 universities in SEA',
    experience: 'Director of Partnerships at an agritech firm, drove $5M in contract value',
    obsessedWith: 'Reading negotiation tactics books from the 80s',
    whenNoOneWatching: 'Practicing pitches in front of the mirror',
    coreValues: 'Trust, Value-creation, Diligence',
    links: { linkedin: '#' }
  },
  { 
    id: '11', 
    name: 'Nguyen Phuong Thao', 
    section: 'Partnerships', 
    personalityLine: 'Turns conversations into opportunities', 
    imageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Amelia&scale=130&translateY=10&backgroundColor=transparent',
    hoverImageUrl: 'https://api.dicebear.com/9.x/micah/svg?seed=Amelia&scale=140&translateY=10&backgroundColor=transparent',
    university: 'Vietnam National University',
    quote: '"Every rejection is just a step closer to the right yes."',
    representsMe: 'A fresh deck of business cards',
    topic30Min: 'How to pitch a vision, not just a product',
    askMeAbout: 'Sponsorships, Brand activations, Public speaking',
    currentlyBuilding: 'An exclusive founders-only retreat event series',
    experience: 'Head of Sponsorships for a major tech conference, secured 20+ enterprise partners',
    obsessedWith: 'Analyzing body language in pitch meetings',
    whenNoOneWatching: 'Writing cold emails that never get sent',
    coreValues: 'Persuasion, Charm, Persistence',
    links: { linkedin: '#' }
  }
];

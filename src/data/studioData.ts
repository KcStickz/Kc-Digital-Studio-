/**
 * Official KC Digital Studio Data & Configuration
 */

// Image imports
import heroCompositionImg from '../assets/images/hero_composition_1791501518453.jpg';
import aboutWorkspaceImg from '../assets/images/about_workspace_1791501534742.jpg';
import portfolioBrandingImg from '../assets/images/portfolio_branding_1791501556017.jpg';
import portfolioWebImg from '../assets/images/portfolio_web_1791501577433.jpg';
import portfolioGraphicsImg from '../assets/images/portfolio_graphics_1791501596570.jpg';
import portfolioPhotoImg from '../assets/images/portfolio_photo_1791501620324.jpg';
import portfolioVideoImg from '../assets/images/portfolio_video_1791501648188.jpg';
import portfolioEditingImg from '../assets/images/portfolio_editing_1791501672282.jpg';
import portfolioSocialImg from '../assets/images/portfolio_social_1791501703279.jpg';

export {
  heroCompositionImg,
  aboutWorkspaceImg,
  portfolioBrandingImg,
  portfolioWebImg,
  portfolioGraphicsImg,
  portfolioPhotoImg,
  portfolioVideoImg,
  portfolioEditingImg,
  portfolioSocialImg,
};

export interface ServiceItem {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  icon: string;
}

export const STUDIO_SERVICES: ServiceItem[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    shortDesc: 'We design and develop modern, responsive websites that help businesses establish a professional online presence.',
    fullDesc: 'Custom high-performance websites engineered with modern web standards, ultra-responsive layouts, fast load times, and conversion-focused architectures.',
    features: [
      'Business Websites',
      'Responsive Web Design',
      'Website Development',
      'Website Redesign',
    ],
    icon: 'Globe',
  },
  {
    id: 'software-development',
    name: 'Software Development',
    shortDesc: 'We create practical software and digital solutions designed to address real user and business needs.',
    fullDesc: 'Tailored application development, robust system interfaces, and automated workflows built for stability, security, and seamless user interaction.',
    features: [
      'Software Development',
      'Application Interfaces',
      'Digital Solutions',
      'Technical Problem-Solving',
    ],
    icon: 'Terminal',
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    shortDesc: 'We create compelling visual designs that communicate ideas clearly and help brands stand out.',
    fullDesc: 'Distinctive visual communication encompassing logos, brand guideline identity systems, corporate stationery, and digital visual assets.',
    features: [
      'Logo Design',
      'Branding',
      'Flyers and Posters',
      'Social Media Graphics',
      'Promotional Materials',
    ],
    icon: 'PenTool',
  },
  {
    id: 'photography',
    name: 'Photography',
    shortDesc: 'We capture moments, people, products, and events through thoughtful photography and visual composition.',
    fullDesc: 'High-resolution commercial, editorial, and event photography crafted with meticulous lighting control and artful perspective.',
    features: [
      'Portrait Photography',
      'Event Photography',
      'Product Photography',
      'Creative Photography',
    ],
    icon: 'Camera',
  },
  {
    id: 'videography',
    name: 'Videography',
    shortDesc: 'We produce engaging video content for events, businesses, brands, and digital platforms.',
    fullDesc: 'Full-spectrum cinema-grade video production from pre-production storyboarding and shooting to multi-camera on-location coverage.',
    features: [
      'Event Videography',
      'Promotional Videos',
      'Brand Videos',
      'Visual Storytelling',
    ],
    icon: 'Video',
  },
  {
    id: 'video-editing',
    name: 'Video Editing',
    shortDesc: 'We transform raw footage into polished video content through editing, pacing, transitions, sound, and storytelling.',
    fullDesc: 'Professional post-production suite workflows including dynamic pacing, color grading, motion graphics, audio mastering, and social reel optimization.',
    features: [
      'Video Editing',
      'Social Media Reels',
      'Event Highlights',
      'Promotional Videos',
      'Post-Production',
    ],
    icon: 'Film',
  },
  {
    id: 'social-media',
    name: 'Social Media Management',
    shortDesc: 'We help businesses maintain a consistent online presence through organized content planning and social media management.',
    fullDesc: 'Strategic content calendar curation, graphic post production, audience community moderation, and brand consistency across key channels.',
    features: [
      'Content Planning',
      'Content Creation',
      'Content Scheduling',
      'Account Management',
      'Audience Engagement',
      'Brand Consistency',
    ],
    icon: 'Share2',
  },
  {
    id: 'it-support',
    name: 'IT Support',
    shortDesc: 'We provide practical technical support for computer systems, troubleshooting, maintenance, and basic networking needs.',
    fullDesc: 'Hands-on technical infrastructure assistance, hardware diagnostics, operating system maintenance, and dependable network configuration.',
    features: [
      'Computer Troubleshooting',
      'Hardware and Software Support',
      'Windows Installation',
      'System Maintenance',
      'Basic Network Configuration',
    ],
    icon: 'ShieldCheck',
  },
];

export type PortfolioCategory =
  | 'Graphic Design'
  | 'Video Editing'
  | 'Photography'
  | 'Videography'
  | 'Web Development'
  | 'Software Development'
  | 'Social Media Management'
  | 'IT Support';

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  filterCategory: PortfolioCategory;
  description: string;
  fullOverview: string;
  image?: string;
  videoUrl?: string;
  projectLink?: string;
  deliverables: string[];
  clientScope?: string;
  year?: string;
}

/**
 * ============================================================================
 * KC NEXUS — OFFICIAL PORTFOLIO PROJECTS LIST
 * ============================================================================
 * 
 * HOW TO ADD A NEW PROJECT MANUALLY (EASY 60-SECOND PROCESS):
 * 
 * 1. Open this file: src/data/studioData.ts
 * 2. Copy the template block below and paste it anywhere inside STUDIO_PROJECTS.
 * 3. Fill in your project title, description, category, and image/video links.
 * 4. Save the file. The portfolio updates immediately!
 * 
 * --- COPY-PASTE TEMPLATE ---
 * {
 *   id: 'my-project-slug',
 *   slug: 'my-project-slug',
 *   title: 'My Project Name',
 *   category: 'Web Development', // Pick from: 'Graphic Design' | 'Video Editing' | 'Photography' | 'Videography' | 'Web Development' | 'Software Development' | 'Social Media Management' | 'IT Support'
 *   filterCategory: 'Web Development',
 *   description: 'Short 1-sentence summary of the project.',
 *   fullOverview: 'Comprehensive overview explaining the project goals, process, and results.',
 *   image: 'https://i.ibb.co/.../image.jpg', // Paste ImgBB direct link or any image URL (optional)
 *   videoUrl: 'https://www.youtube.com/watch?v=...', // Paste YouTube, YouTube Shorts, or Vimeo URL (optional)
 *   projectLink: 'https://example.com', // Live demo link (optional)
 *   deliverables: ['Custom Feature 1', 'Custom Feature 2'],
 *   clientScope: 'Client Engagement or Creative Concept',
 *   year: '2026',
 * },
 * ============================================================================
 */
export const STUDIO_PROJECTS: ProjectItem[] = [
  {
    id: 'brand-identity-concept',
    slug: 'brand-identity-design',
    title: 'Brand Identity Design',
    category: 'Graphic Design',
    filterCategory: 'Graphic Design',
    description: 'Visual identity and branding concepts.',
    fullOverview: 'Comprehensive visual identity system showcasing typography guidelines, brand palette hierarchy, bespoke stationary mockups, and corporate brand guidelines.',
    image: portfolioBrandingImg,
    deliverables: ['Brand Guidelines', 'Logo System', 'Stationery Suite', 'Color Harmony'],
    clientScope: 'Conceptual Brand Identity System',
    year: '2026',
  },
  {
    id: 'business-website-concept',
    slug: 'business-website',
    title: 'Business Website',
    category: 'Web Development',
    filterCategory: 'Web Development',
    description: 'Responsive website design and development.',
    fullOverview: 'High-performance responsive corporate web platform engineered with rapid loading architecture, fluid responsive viewports, and clean UI/UX components.',
    image: portfolioWebImg,
    projectLink: 'https://ais-dev-hyeionh46ju7l53ss27ewp-97741256986.europe-west2.run.app',
    deliverables: ['Responsive Web App', 'Interactive UI Design', 'SEO Integration', 'Performance Tuning'],
    clientScope: 'Digital Presence Platform',
    year: '2026',
  },
  {
    id: 'social-media-graphics-concept',
    slug: 'social-media-graphics',
    title: 'Social Media Graphics',
    category: 'Graphic Design',
    filterCategory: 'Graphic Design',
    description: 'Promotional graphics and branded digital content.',
    fullOverview: 'Eye-catching promotional flyers, social banners, and event posters utilizing energetic visual typography, bold contrasts, and balanced negative space.',
    image: portfolioGraphicsImg,
    deliverables: ['Promotional Posters', 'Digital Ad Creatives', 'Flyer Distribution Sets', 'Vector Assets'],
    clientScope: 'Visual Communication Campaign',
    year: '2026',
  },
  {
    id: 'portrait-product-photo-concept',
    slug: 'portrait-product-photography',
    title: 'Portrait & Product Photography',
    category: 'Photography',
    filterCategory: 'Photography',
    description: 'Photography focused on composition and presentation.',
    fullOverview: 'Studio lighting showcase featuring portraiture with warm amber rim light alongside luxury still-life product photography emphasizing materials and form.',
    image: portfolioPhotoImg,
    deliverables: ['Studio Portraits', 'Commercial Still Life', 'Color Grading', 'High-Res Deliverables'],
    clientScope: 'Studio Photography Series',
    year: '2026',
  },
  {
    id: 'video-production-concept',
    slug: 'video-production',
    title: 'Video Production',
    category: 'Videography',
    filterCategory: 'Videography',
    description: 'Video content for events, brands, and digital platforms.',
    fullOverview: 'On-set cinematography and multi-angle camera configuration for commercial promotions, brand documentaries, and corporate highlights.',
    image: portfolioVideoImg,
    deliverables: ['4K Camera Operations', 'Lighting Direction', 'Audio Recording', 'On-Site Direction'],
    clientScope: 'Commercial Video Production',
    year: '2026',
  },
  {
    id: 'video-editing-concept',
    slug: 'promotional-video-editing',
    title: 'Promotional Video Editing',
    category: 'Video Editing',
    filterCategory: 'Video Editing',
    description: 'Edited video content for online communication.',
    fullOverview: 'Precision timeline post-production featuring sound design, color balance, visual rhythm, motion lower thirds, and social aspect ratio formatting.',
    image: portfolioEditingImg,
    deliverables: ['Multi-track Editing', 'Audio Mastering', 'Color Grading LUTs', 'Vertical Reels Cutdowns'],
    clientScope: 'Post-Production Suite Project',
    year: '2026',
  },
  {
    id: 'social-media-content-concept',
    slug: 'social-media-content',
    title: 'Social Media Content',
    category: 'Social Media Management',
    filterCategory: 'Social Media Management',
    description: 'Creative assets for digital platforms.',
    fullOverview: 'Unified digital content framework including carousel storytelling slides, reels cover templates, and strategic visual grids designed for engagement.',
    image: portfolioSocialImg,
    deliverables: ['Feed Architecture', 'Story & Reel Assets', 'Content Guidelines', 'Engagement Layouts'],
    clientScope: 'Digital Brand Management Sample',
    year: '2026',
  },
  {
    id: 'digital-workspace-concept',
    slug: 'digital-systems-architecture',
    title: 'Digital Systems & Architecture',
    category: 'Software Development',
    filterCategory: 'Software Development',
    description: 'Practical software solutions and digital workflows.',
    fullOverview: 'Integrated application interface and system optimization project designed for operational clarity, fast data entry, and dependable tech performance.',
    image: aboutWorkspaceImg,
    deliverables: ['Dashboard UI', 'Data Architecture', 'Responsive Layout', 'System Documentation'],
    clientScope: 'Interactive Systems Prototype',
    year: '2026',
  },
  {
    id: 'it-support-concept',
    slug: 'enterprise-it-support',
    title: 'Enterprise IT Maintenance & Support',
    category: 'IT Support',
    filterCategory: 'IT Support',
    description: 'Network infrastructure setup, hardware troubleshooting, and systems reliability.',
    fullOverview: 'Comprehensive workstation diagnostics, Windows environment configuration, safe system backup routines, and responsive hardware troubleshooting.',
    image: heroCompositionImg,
    deliverables: ['Hardware Support', 'Operating Systems', 'Network Routing', 'Preventive Maintenance'],
    clientScope: 'Technical Systems Maintenance',
    year: '2026',
  },
];

export const STUDIO_PRINCIPLES = [
  {
    id: 'creative-approach',
    title: 'Creative Approach',
    description: 'Thoughtful ideas and visual communication.',
    icon: 'Sparkles',
    detail: 'Every project begins with clarity of purpose. We craft distinctive ideas and clean visuals tailored to resonate with real audiences.',
  },
  {
    id: 'attention-to-detail',
    title: 'Attention to Detail',
    description: 'Careful execution across creative and technical work.',
    icon: 'Target',
    detail: 'From pixel-perfect typography to responsive breakpoints and color grading, precision is baked into every deliverable.',
  },
  {
    id: 'client-focused-service',
    title: 'Client-Focused Service',
    description: 'Clear communication and practical solutions.',
    icon: 'Users',
    detail: 'Reliable timelines, responsive discussions, and pragmatic solutions designed around your brand goals and real-world needs.',
  },
];

export const CONTACT_INFO = {
  brandName: 'KC NEXUS',
  founderName: 'OKO-OBENI KELECHI SALVATION',
  email: 'okoobenikelechisalvation@gmail.com',
  phone1: '+234 814 569 1772',
  phone2: '+234 902 998 6126',
  whatsappUrl: 'https://wa.me/2348145691772?text=Hello%20KC%20NEXUS%2C%20I%20would%20like%20to%20enquire%20about%20a%20project',
  location: 'Port Harcourt, Rivers State, Nigeria.',
  tagline: 'Creativity Meets Digital Excellence.',
  supportingTagline: 'Design. Develop. Create. Grow.',
  description: 'KC NEXUS is a multidisciplinary digital creative studio founded and led by OKO-OBENI KELECHI SALVATION, combining technology, design, and visual storytelling.',
};

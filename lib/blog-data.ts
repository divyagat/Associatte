// lib/blog-data.ts

export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  image2?: string; 
  category: string;
  city: string;
  location: string;
  date: string;
  readTime: string;
  tags: string[];
  author: Author;
  courtesy?: string;
  faqs?: FAQ[];
  relatedSlugs: string[];
  recentPostSlugs?: string[];
  overlayText?: string; 
}

export const BLOG_POSTS: Record<string, BlogPost> = {
 'factors-drive-property-appreciation': {
    id: '1',
    slug: 'factors-drive-property-appreciation',
    title: 'Factors That Drive Property Appreciation: A Complete Guide',
    category: 'Investment Guide',
    city: 'Pune',
    location: 'India',
    date: 'Jun 06, 2026',
    readTime: '7 min read',
    courtesy: 'Associatte PropTech',
    overlayText: 'Investment Insights', 
    author: {
      name: 'Pushkar Dake',
      role: 'Senior Real Estate Analyst',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      bio: 'Pushkar has over 10 years of experience analyzing real estate trends and investment opportunities across India.'
    },
    image: 'https://res.cloudinary.com/drdeqd8to/image/upload/f_auto,q_auto/Screenshot_2026-06-06_152737_brroni',
    image2: 'https://res.cloudinary.com/drdeqd8to/image/upload/f_auto,q_auto/Screenshot_2026-06-06_152737_brroni',
    excerpt: 'Property appreciation is one of the most important aspects of real estate investment. Discover the key factors that influence property values and maximize your long-term returns.',
    content: `
      <p>Property appreciation is one of the most important aspects of real estate investment. Understanding what influences property values can help buyers and investors make smarter decisions and maximize long-term returns.</p>
      <h2 id="strategic-location">1. Strategic Location</h2>
      <p>Location remains the most significant factor affecting property appreciation. Properties in prime and emerging locations often experience stronger demand and higher value growth over time.</p>
      <h3 id="location-considerations">Key Considerations:</h3>
      <ul>
        <li>Proximity to business districts and employment hubs</li>
        <li>Access to schools, colleges, and healthcare facilities</li>
        <li>Availability of shopping centers, restaurants, and recreational spaces</li>
        <li>Safe and well-developed neighborhoods</li>
      </ul>
      <h2 id="infrastructure-development">2. Infrastructure Development</h2>
      <p>Infrastructure projects can significantly boost the value of surrounding properties. Improved connectivity makes areas more accessible and attractive to both residents and businesses, driving appreciation.</p>
      <h3 id="infrastructure-examples">Examples Include:</h3>
      <ul>
        <li>Metro rail connectivity</li>
        <li>New highways and expressways</li>
        <li>Flyovers and road expansions</li>
        <li>Smart city initiatives</li>
      </ul>
      <blockquote>
        <p>"The best time to invest in real estate is before infrastructure development transforms a location. Early investors capture the maximum appreciation."</p>
        <cite>— Pushkar Dake, Senior Real Estate Analyst</cite>
      </blockquote>
      <h2 id="economic-growth">3. Economic Growth and Employment Opportunities</h2>
      <p>A thriving local economy creates demand for housing and commercial spaces. Regions experiencing economic growth often witness steady property value appreciation.</p>
      <h3 id="growth-drivers">Growth Drivers:</h3>
      <ul>
        <li>Expansion of IT parks and business centers</li>
        <li>New industrial developments</li>
        <li>Increasing job opportunities</li>
        <li>Rising population due to migration</li>
      </ul>
      <h2 id="demand-supply">4. Demand and Supply Dynamics</h2>
      <p>Real estate values are heavily influenced by market demand and available inventory. When demand exceeds supply, property prices generally rise, benefiting property owners.</p>
      <h3 id="demand-factors">Factors Affecting Demand:</h3>
      <ul>
        <li>Population growth</li>
        <li>Urbanization</li>
        <li>Changing lifestyle preferences</li>
        <li>Investor interest</li>
      </ul>
      <h2 id="construction-quality">5. Quality of Construction and Amenities</h2>
      <p>Well-designed properties with modern features tend to appreciate faster. Buyers are increasingly willing to pay more for properties that offer convenience and a better quality of life.</p>
      <h3 id="value-adding-features">Value-Adding Features:</h3>
      <ul>
        <li>Premium construction quality</li>
        <li>Security systems</li>
        <li>Clubhouses and fitness centers</li>
        <li>Green spaces and sustainable infrastructure</li>
        <li>Smart home technologies</li>
      </ul>
      <h2 id="future-development">6. Future Development Potential</h2>
      <p>Areas with planned developments often present excellent appreciation opportunities. Investing early in growth corridors can lead to substantial gains in the future.</p>
      <h3 id="what-to-look-for">Look For:</h3>
      <ul>
        <li>Upcoming commercial projects</li>
        <li>Proposed transportation networks</li>
        <li>Government-backed development plans</li>
        <li>Emerging residential corridors</li>
      </ul>
      <h2 id="conclusion">Conclusion</h2>
      <p>Property appreciation is driven by a combination of location, infrastructure, economic growth, demand, quality, and future development potential. By carefully evaluating these factors before making an investment, buyers can position themselves for long-term value creation and stronger returns. A well-chosen property is not just a place to live—it is an asset that can grow significantly in value over time.</p>
    `,
    tags: ['Property Appreciation', 'Real Estate Investment', 'Property Value', 'Investment Guide', 'Location'],
    relatedSlugs: ['mantra-codename-paradise-sus-pune', 'budget-homes-pune-under-75-lakhs'],
    recentPostSlugs: ['evolution-pune-mumbai-real-estate-decade', 'navi-mumbai-airport-impact-real-estate'],
    faqs: [
      { question: 'What is the most important factor for property appreciation?', answer: 'Location is the most significant factor affecting property appreciation. Properties in prime locations with good connectivity, proximity to business hubs, schools, and healthcare facilities tend to appreciate the fastest.' },
      { question: 'How does infrastructure development affect property values?', answer: 'Infrastructure projects like metro rail, new highways, flyovers, and smart city initiatives significantly boost property values by improving connectivity and making areas more attractive to residents and businesses.' },
      { question: 'When is the best time to invest for maximum appreciation?', answer: 'The best time to invest is before major infrastructure development transforms a location. Early investors in growth corridors with planned developments can capture the maximum appreciation over time.' },
      { question: 'Do amenities really impact property appreciation?', answer: 'Yes, properties with modern amenities like clubhouses, fitness centers, security systems, green spaces, and smart home technologies tend to appreciate faster as buyers are willing to pay more for better quality of life.' },
      { question: 'How does demand and supply affect property prices?', answer: 'When demand for properties exceeds the available supply in a market, prices generally rise. Factors like population growth, urbanization, and investor interest drive demand, leading to higher appreciation rates.' },
      { question: 'What should I look for in a location for long-term appreciation?', answer: 'Look for upcoming commercial projects, proposed transportation networks, government-backed development plans, and emerging residential corridors. These indicators suggest strong future growth potential.' }
    ]
  },

  // 👇 REPLACED ARTICLE
  'evolution-pune-mumbai-real-estate-decade': {
    id: '6',
    slug: 'evolution-pune-mumbai-real-estate-decade',
    title: "The Evolution of Pune and Mumbai's Real Estate Markets Over the Past Decade",
    category: 'Industry Insights',
    city: 'Pune', 
    location: 'Pune & Mumbai, Maharashtra',
    date: 'Dec 28, 2024',
    readTime: '6 min read',
    courtesy: 'Associatte PropTech',
    overlayText: 'Market Evolution',
    author: {
      name: 'Vikram Malik',
      role: 'Real Estate Industry Veteran',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
      bio: 'Vikram is a real estate industry veteran with 25 years of experience and the owner of a successful real estate business.'
    },
    image: 'https://res.cloudinary.com/drdeqd8to/image/upload/f_auto,q_auto/article_blog2_rdxqcy',
    image2: 'https://res.cloudinary.com/drdeqd8to/image/upload/f_auto,q_auto/article_blog2_rdxqcy',
    excerpt: 'A comprehensive analysis of how the real estate markets in Pune and Mumbai have transformed over the last decade, highlighting key trends, current scenarios, and future predictions.',
    content: `
      <p>The real estate markets in Pune and Mumbai have undergone significant transformations over the past decade. With economic growth, urbanization, and shifting consumer preferences, these cities have witnessed changes that reflect broader trends in India's real estate sector. As someone with 25 years of experience in this dynamic industry, I have had the privilege of observing these markets evolve and contributing to their growth.</p>

      <h2 id="snapshot-2013">A Snapshot of 2013: The Starting Point</h2>
      <p>Ten years ago, the real estate landscapes of Pune and Mumbai were markedly different.</p>
      <ul>
        <li><strong>Mumbai:</strong> The financial capital of India was already grappling with high property prices and limited land availability. Areas like South Mumbai, Bandra, and Andheri were established hubs, while suburbs like Thane and Navi Mumbai were gaining attention as affordable alternatives.</li>
        <li><strong>Pune:</strong> Known as the “Oxford of the East,” Pune's real estate market was primarily driven by its educational institutions and the burgeoning IT sector. Areas like Kothrud, Koregaon Park, and Viman Nagar were popular among homebuyers.</li>
      </ul>

      <h2 id="key-trends">Key Trends Over the Decade</h2>
      <ul>
        <li><strong>Rising Demand for Affordable Housing</strong></li>
        <li><strong>Growth of Suburban and Peripheral Areas</strong></li>
        <li><strong>Commercial Real Estate Boom</strong></li>
        <li><strong>Luxury Real Estate</strong></li>
        <li><strong>Technological Integration and Smart Cities</strong></li>
      </ul>

      <h2 id="current-trends-2024">Current Trends in 2024</h2>
      <p>As we step into 2024, the markets in Pune and Mumbai reflect resilience despite economic challenges and global uncertainties:</p>
      <ul>
        <li><strong>Sustainability:</strong> There is a growing demand for green buildings and sustainable living options.</li>
        <li><strong>Co-living and Rental Properties:</strong> Younger demographics, particularly in Pune’s IT sector, are driving demand for co-living spaces and rental properties.</li>
        <li><strong>Infrastructure Development:</strong> Key projects like the Pune Ring Road and Mumbai’s Coastal Road are expected to further enhance connectivity and boost real estate values.</li>
        <li><strong>Digital Transformation:</strong> Virtual property tours, AI-driven analytics, and online platforms have revolutionized how properties are bought and sold.</li>
      </ul>

      <blockquote>
        <p>"The past decade has been transformative for Pune and Mumbai’s real estate markets. From affordability and luxury to sustainability and technology, these cities continue to set benchmarks for the industry."</p>
        <cite>— Vikram Malik, Real Estate Industry Veteran</cite>
      </blockquote>

      <h2 id="future-outlook">The Future: What Lies Ahead</h2>
      <p>Looking forward, I foresee several trends shaping the real estate markets in Pune and Mumbai:</p>
      <ul>
        <li><strong>Increased Focus on Affordable Housing:</strong> Developers will continue to target the middle-income segment, especially in suburban areas.</li>
        <li><strong>Luxury Redefined:</strong> High-net-worth individuals will seek properties that blend luxury with sustainability and smart features.</li>
        <li><strong>Infrastructure-Driven Growth:</strong> Upcoming projects like the Pune Metro and Mumbai’s Bullet Train will unlock new growth corridors.</li>
        <li><strong>Technology as a Game-Changer:</strong> Proptech solutions will streamline transactions, enhance transparency, and improve the overall customer experience.</li>
      </ul>

      <h2 id="final-thoughts">Final Thoughts</h2>
      <p>The past decade has been transformative for Pune and Mumbai’s real estate markets. From affordability and luxury to sustainability and technology, these cities continue to set benchmarks for the industry. As an experienced professional and now the owner of a real estate business, I am excited to contribute to this ever-evolving landscape and help clients navigate these dynamic markets with confidence.</p>
    `,
    tags: ['Pune Real Estate', 'Mumbai Real Estate', 'Market Trends', 'Real Estate Evolution', 'Property Investment'],
    relatedSlugs: ['navi-mumbai-airport-impact-real-estate', 'mantra-codename-paradise-sus-pune'],
    recentPostSlugs: ['factors-drive-property-appreciation', 'budget-homes-pune-under-75-lakhs'],
    faqs: [
      {
        question: 'How has the Pune real estate market changed over the last decade?',
        answer: "Pune's market has shifted from being primarily driven by educational institutions to a major IT and commercial hub, leading to the rapid development of areas like Hinjewadi, Wakad, and the suburban peripheries."
      },
      {
        question: 'What are the current real estate trends in Mumbai and Pune for 2024?',
        answer: 'Key trends include a strong demand for sustainable and green buildings, the rise of co-living spaces, massive infrastructure development (like the Pune Ring Road and Mumbai Coastal Road), and the integration of PropTech for seamless transactions.'
      },
      {
        question: 'Which infrastructure projects will boost real estate in Pune and Mumbai?',
        answer: 'Upcoming projects like the Pune Metro, Mumbai’s Coastal Road, Pune Ring Road, and the Mumbai-Ahmedabad Bullet Train are expected to unlock new growth corridors and significantly boost property values.'
      },
      {
        question: 'Is it a good time to invest in luxury real estate in these cities?',
        answer: 'Yes, the luxury segment is evolving. High-net-worth individuals are increasingly seeking properties that blend premium luxury with sustainability and smart home features, making it a strong investment avenue.'
      }
    ]
  },

  'mantra-codename-paradise-sus-pune': {
    id: '3',
    slug: 'mantra-codename-paradise-sus-pune',
    title: 'Mantra Codename Paradise Sus Pune: Smart Investment Opportunity',
    category: 'Investment',
    city: 'Pune',
    location: 'Sus, Pune',
    date: 'Jun 03, 2026',
    readTime: '5 min read',
    courtesy: 'Associatte PropTech',
    overlayText: 'Smart Investment', 
    author: {
      name: 'Shruti B',
      role: 'Investment Advisor',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      bio: 'Shruti specializes in emerging Pune micro-markets.'
    },
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    image2: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80', 
    excerpt: 'Mantra Codename Paradise in Sus offers excellent investment potential with high appreciation and rental yield.',
    content: `
      <p>Sus is rapidly emerging as Pune's next premium residential destination, and Mantra Codename Paradise is at the forefront of this transformation.</p>
      <h2 id="why-sus">📈 Why Invest in Sus?</h2>
      <p>Sus offers excellent connectivity to major IT hubs like Hinjewadi and the upcoming metro line. The area is witnessing rapid infrastructure development, making it ideal for long-term investment.</p>
      <h2 id="details">🏠 Project Details</h2>
      <ul>
        <li><strong>Developer:</strong> Mantra Properties</li>
        <li><strong>Location:</strong> Sus, Pune</li>
        <li><strong>Configurations:</strong> 2 & 3 BHK</li>
        <li><strong>Possession:</strong> 2028</li>
        <li><strong>RERA:</strong> Registered</li>
      </ul>
      <h2 id="potential">💰 Investment Potential</h2>
      <p>Expected 15-20% appreciation by possession with excellent rental yield potential. The area is seeing increased demand from IT professionals working in nearby Hinjewadi.</p>
      <blockquote>
        <p>"Sus is the next Baner in terms of growth potential. Early investors will reap significant benefits."</p>
        <cite>— Shruti B, Investment Advisor</cite>
      </blockquote>
    `,
    tags: ['Mantra Codename Paradise', 'Sus Pune', 'Investment', 'Pune Real Estate'],
    relatedSlugs: ['mantra-1-residences-burgundy-review', 'budget-homes-pune-under-75-lakhs'],
    recentPostSlugs: ['evolution-pune-mumbai-real-estate-decade', 'navi-mumbai-airport-impact-real-estate'],
    faqs: [
      { question: 'What is the expected appreciation for Mantra Codename Paradise?', answer: "The project is expected to appreciate 15-20% by possession in 2028, driven by infrastructure development in Sus." },
      { question: 'Is Sus a good location for investment?', answer: "Yes, Sus is emerging as Pune's next premium residential destination with excellent connectivity to IT hubs." },
      { question: 'What configurations are available?', answer: 'The project offers 2 BHK and 3 BHK apartments suitable for both end-users and investors.' }
    ]
  },

  'budget-homes-pune-under-75-lakhs': {
    id: '4',
    slug: 'budget-homes-pune-under-75-lakhs',
    title: 'Best Budget Homes in Pune Under ₹75 Lakhs (2026)',
    category: 'Buying Guide',
    city: 'Pune',
    location: 'Pune, Maharashtra',
    date: 'Jun 02, 2026',
    readTime: '6 min read',
    courtesy: 'Associatte PropTech',
    overlayText: 'Budget Homes', 
    author: {
      name: 'Charmi Thakker',
      role: 'Budget Home Specialist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      bio: 'Charmi specializes in affordable housing solutions.'
    },
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
    image2: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80', 
    excerpt: 'Top budget-friendly residential projects in Pune under ₹75 lakhs with excellent amenities and connectivity.',
    content: `
      <p>Finding quality homes in Pune under ₹75 lakhs is challenging but not impossible. This guide explores the best budget-friendly options across key locations.</p>
      <h2 id="locations">📍 Best Locations for Budget Homes</h2>
      <ul>
        <li><strong>Wakad:</strong> Starting ₹65L for 2 BHK</li>
        <li><strong>Hinjewadi:</strong> Starting ₹60L for 2 BHK</li>
        <li><strong>Ravet:</strong> Starting ₹55L for 2 BHK</li>
        <li><strong>Chinchwad:</strong> Starting ₹50L for 2 BHK</li>
      </ul>
      <h2 id="projects">🏢 Top Projects</h2>
      <ul>
        <li>Project 1 - 2 BHK @ ₹68L in Wakad</li>
        <li>Project 2 - 2 BHK @ ₹72L in Hinjewadi</li>
        <li>Project 3 - 2 BHK @ ₹65L in Ravet</li>
      </ul>
      <blockquote>
        <p>"Budget homes in Pune offer excellent value for money with modern amenities and good connectivity."</p>
        <cite>— Charmi Thakker, Budget Home Specialist</cite>
      </blockquote>
      <h2 id="tips">💡 Tips for First-Time Buyers</h2>
      <ul>
        <li>Check RERA registration before booking</li>
        <li>Verify all approvals and NOCs</li>
        <li>Compare prices across similar projects</li>
        <li>Consider future infrastructure development</li>
      </ul>
    `,
    tags: ['Budget Homes', 'Pune', 'Affordable Housing', 'Under 75 Lakhs'],
    relatedSlugs: ['mantra-1-residences-burgundy-review', 'mantra-codename-paradise-sus-pune'],
    recentPostSlugs: ['evolution-pune-mumbai-real-estate-decade', 'mantra-codename-paradise-sus-pune'],
    faqs: [
      { question: 'Can I get a 2 BHK in Pune under ₹75 lakhs?', answer: 'Yes, you can find 2 BHK apartments under ₹75 lakhs in areas like Wakad, Hinjewadi, Ravet, and Chinchwad.' },
      { question: 'Which is the most affordable area in Pune?', answer: 'Chinchwad and Ravet offer the most affordable options starting from ₹50-55 lakhs for 2 BHK.' },
      { question: 'Are budget homes a good investment?', answer: 'Yes, budget homes in emerging areas offer good appreciation potential and rental yields.' }
    ]
  },

  'navi-mumbai-airport-impact-real-estate': {
    id: '5',
    slug: 'navi-mumbai-airport-impact-real-estate',
    title: 'How Navi Mumbai Airport is Transforming Real Estate (2026)',
    category: 'Market Trends',
    city: 'Mumbai',
    location: 'Navi Mumbai, Maharashtra',
    date: 'Jun 01, 2026',
    readTime: '8 min read',
    courtesy: 'Associatte PropTech',
    overlayText: 'Market Trends', 
    author: {
      name: 'Pushkar Dake',
      role: 'Senior Real Estate Analyst',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      bio: 'Pushkar tracks Mumbai real estate market with 12+ years experience.'
    },
    image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1200&q=80',
    image2: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80', 
    excerpt: 'Complete analysis of how Navi Mumbai International Airport is driving real estate prices and investment opportunities.',
    content: `
      <p>The Navi Mumbai International Airport is set to transform the real estate landscape of the region, creating unprecedented opportunities for investors and homebuyers.</p>
      <h2 id="price-impact">📈 Price Impact Analysis</h2>
      <ul>
        <li><strong>Panvel:</strong> 25% appreciation in last 2 years</li>
        <li><strong>Ulwe:</strong> 20% appreciation</li>
        <li><strong>Kharghar:</strong> 15% appreciation</li>
      </ul>
      <h2 id="infrastructure">🏗️ Infrastructure Development</h2>
      <ul>
        <li>Navi Mumbai International Airport (2025 operational)</li>
        <li>Metro connectivity to Mumbai</li>
        <li>Improved road infrastructure</li>
        <li>Proposed business districts</li>
      </ul>
      <blockquote>
        <p>"The airport will be a game-changer for Navi Mumbai's real estate, similar to how the Mumbai Airport transformed Andheri and Vile Parle."</p>
        <cite>— Pushkar Dake, Senior Real Estate Analyst</cite>
      </blockquote>
      <h2 id="recommendation">🎯 Investment Recommendation</h2>
      <p>Invest in Panvel and Ulwe for maximum appreciation potential over the next 3-5 years. These areas will benefit the most from the airport's operational status.</p>
    `,
    tags: ['Navi Mumbai Airport', 'Real Estate Impact', 'Investment', 'Market Trends'],
    relatedSlugs: ['evolution-pune-mumbai-real-estate-decade'],
    recentPostSlugs: ['mantra-1-residences-burgundy-review', 'mantra-codename-paradise-sus-pune'],
    faqs: [
      { question: 'When will Navi Mumbai Airport be operational?', answer: 'The Navi Mumbai International Airport is expected to be fully operational by 2025-2026.' },
      { question: 'Which areas will benefit most from the airport?', answer: 'Panvel, Ulwe, and Kharghar are expected to see the maximum appreciation due to their proximity to the airport.' },
      { question: 'Is it a good time to invest in Navi Mumbai?', answer: "Yes, with the airport becoming operational, now is an excellent time to invest in Navi Mumbai real estate." },
      { question: 'What appreciation can I expect?', answer: 'Areas near the airport have already seen 15-25% appreciation and are expected to grow further.' }
    ]
  }
};

// Helper functions
export function getAllBlogs(): BlogPost[] {
  return Object.values(BLOG_POSTS).sort((a, b) => parseInt(b.id) - parseInt(a.id));
}

export function getBlogBySlug(slug: string): BlogPost | null {
  return BLOG_POSTS[slug] || null;
}

export function getBlogsByCity(city: string): BlogPost[] {
  return Object.values(BLOG_POSTS)
    .filter(blog => blog.city === city)
    .sort((a, b) => parseInt(b.id) - parseInt(a.id));
}

export function getFeaturedBlogs(limit = 3): BlogPost[] {
  return getAllBlogs().slice(0, limit);
}

export function getRelatedPosts(relatedSlugs: string[], limit = 3): BlogPost[] {
  return relatedSlugs
    .map(slug => BLOG_POSTS[slug])
    .filter((post): post is BlogPost => post !== null && post !== undefined)
    .slice(0, limit);
}

export function getRecentPosts(currentSlug: string, limit = 4): BlogPost[] {
  return Object.values(BLOG_POSTS)
    .filter(blog => blog.slug !== currentSlug)
    .sort((a, b) => parseInt(b.id) - parseInt(a.id))
    .slice(0, limit);
}

export function getBlogsByCategory(category: string): BlogPost[] {
  return Object.values(BLOG_POSTS)
    .filter(blog => blog.category.toLowerCase() === category.toLowerCase())
    .sort((a, b) => parseInt(b.id) - parseInt(a.id));
}

export function searchBlogs(query: string): BlogPost[] {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(BLOG_POSTS).filter(blog =>
    blog.title.toLowerCase().includes(lowercaseQuery) ||
    blog.excerpt.toLowerCase().includes(lowercaseQuery) ||
    blog.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    blog.category.toLowerCase().includes(lowercaseQuery)
  );
}
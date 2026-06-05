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
  image2?: string; // 👈 ADDED: Secondary image property
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
}

export const BLOG_POSTS: Record<string, BlogPost> = {
  'mantra-1-residences-burgundy-review': {
    id: '1',
    slug: 'mantra-1-residences-burgundy-review',
    title: 'Mantra 1 Residences By Burgundy: Complete Project Review',
    category: 'Project Review',
    city: 'Pune',
    location: 'Pune, Maharashtra',
    date: 'Jun 05, 2026',
    readTime: '6 min read',
    courtesy: 'Associatte PropTech',
    author: {
      name: 'Pushkar Dake',
      role: 'Senior Real Estate Analyst',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      bio: 'Pushkar has over 10 years of experience analyzing Pune real estate trends.'
    },
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
    image2: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', // 👈 2nd Image (Modern Interior)
    excerpt: 'Detailed review of Mantra 1 Residences by Burgundy - pricing, amenities, location advantages, and investment potential.',
    content: `
      <p>In the competitive landscape of Pune's premium real estate, Mantra 1 Residences by Burgundy stands out as a beacon of modern living. This comprehensive review explores every aspect of this prestigious project.</p>

      <h2 id="overview">🏠 Project Overview</h2>
      <p>Mantra 1 Residences by Burgundy is a premium residential project offering spacious apartments with world-class amenities in a prime Pune location. The project combines contemporary architecture with sustainable living practices.</p>

      <h3 id="features">Key Features:</h3>
      <ul>
        <li><strong>Configuration:</strong> 2 & 3 BHK apartments</li>
        <li><strong>Size:</strong> Starting from 850 sq.ft carpet area</li>
        <li><strong>Amenities:</strong> Swimming pool, gym, clubhouse, landscaped gardens</li>
        <li><strong>Possession:</strong> Under construction - expected by 2028</li>
        <li><strong>RERA:</strong> Registered under MahaRERA</li>
      </ul>

      <h2 id="pricing">💰 Pricing Details</h2>
      <p>The project offers competitive pricing for the premium segment, making it an attractive option for both end-users and investors.</p>

      <table>
        <thead>
          <tr>
            <th>Configuration</th>
            <th>Carpet Area</th>
            <th>Price Range</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2 BHK</td>
            <td>850 - 950 sq.ft</td>
            <td>₹75L - ₹90L</td>
          </tr>
          <tr>
            <td>3 BHK</td>
            <td>1100 - 1350 sq.ft</td>
            <td>₹1Cr - ₹1.2Cr</td>
          </tr>
        </tbody>
      </table>

      <blockquote>
        <p>"Mantra 1 Residences represents the future of premium living in Pune with its thoughtful design and comprehensive amenities."</p>
        <cite>— Pushkar Dake, Senior Real Estate Analyst</cite>
      </blockquote>

      <h2 id="location">📍 Location Advantages</h2>
      <p>Strategically located in Pune, the project offers excellent connectivity to major IT hubs, educational institutions, and healthcare facilities.</p>
      <ul>
        <li>10 minutes from Hinjewadi IT Park</li>
        <li>15 minutes from Pune Railway Station</li>
        <li>20 minutes from Pune International Airport</li>
        <li>Near top schools and hospitals</li>
      </ul>

      <h2 id="amenities">🏊 World-Class Amenities</h2>
      <p>The project boasts over 40 amenities designed for holistic living:</p>
      <ul>
        <li>Olympic-size swimming pool</li>
        <li>State-of-the-art fitness center</li>
        <li>Clubhouse with indoor games</li>
        <li>Landscaped gardens and jogging track</li>
        <li>Kids play area and senior citizen sit-out</li>
        <li>24/7 security with CCTV surveillance</li>
      </ul>

      <h2 id="investment">🎯 Investment Verdict</h2>
      <p>With Pune's real estate market showing consistent growth, Mantra 1 Residences offers excellent investment potential. The project is expected to appreciate 12-15% by possession, making it a smart choice for long-term investors.</p>
    `,
    tags: ['Mantra 1 Residences', 'Burgundy', 'Pune', 'Premium Homes'],
    relatedSlugs: ['mantra-codename-paradise-sus-pune', 'budget-homes-pune-under-75-lakhs'],
    recentPostSlugs: ['paradise-sai-world-empire-kharghar', 'navi-mumbai-airport-impact-real-estate'],
    faqs: [
      {
        question: 'What is the RERA number of Mantra 1 Residences?',
        answer: 'The project is registered under MahaRERA. The registration number can be verified on the official MahaRERA website.'
      },
      {
        question: 'What are the BHK configurations available?',
        answer: 'Mantra 1 Residences offers 2 BHK and 3 BHK apartments with carpet areas starting from 850 sq.ft.'
      },
      {
        question: 'When is the expected possession date?',
        answer: 'The expected possession date is 2028. The project is currently under construction.'
      },
      {
        question: 'Is the project bank loan approved?',
        answer: 'Yes, the project is approved by leading banks and financial institutions for home loans.'
      },
      {
        question: 'What amenities are included in the project?',
        answer: 'The project offers 40+ amenities including swimming pool, gym, clubhouse, landscaped gardens, kids play area, and 24/7 security.'
      }
    ]
  },

  'paradise-sai-world-empire-kharghar': {
    id: '2',
    slug: 'paradise-sai-world-empire-kharghar',
    title: 'Paradise Sai World Empire Kharghar: Luxury Living Redefined',
    category: 'Project Review',
    city: 'Mumbai',
    location: 'Kharghar, Navi Mumbai',
    date: 'Jun 04, 2026',
    readTime: '7 min read',
    courtesy: 'Associatte PropTech',
    author: {
      name: 'Rajesh Kumar',
      role: 'Luxury Property Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      bio: 'Rajesh specializes in premium and luxury real estate.'
    },
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
    image2: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80', // 👈 2nd Image (Luxury Pool/Amenity)
    excerpt: 'Explore Paradise Sai World Empire in Kharghar - premium 3 BHK residences with world-class amenities and excellent connectivity.',
    content: `
      <p>Paradise Sai World Empire in Kharghar represents the pinnacle of luxury living in Navi Mumbai. This township-style development offers an unparalleled lifestyle with 50+ world-class amenities.</p>

      <h2 id="highlights">🌟 Project Highlights</h2>
      <ul>
        <li><strong>Location:</strong> Kharghar, Navi Mumbai</li>
        <li><strong>Configurations:</strong> 3 BHK premium apartments</li>
        <li><strong>Size:</strong> 1200 - 1500 sq.ft carpet area</li>
        <li><strong>Amenities:</strong> 50+ world-class amenities</li>
        <li><strong>Type:</strong> Township development</li>
      </ul>

      <h2 id="pricing">💰 Pricing</h2>
      <p>Starting from ₹1.2 Cr for 3 BHK configurations, Paradise Sai World Empire offers premium living at competitive prices in the Kharghar micro-market.</p>

      <h2 id="location-advantages">📍 Location Advantages</h2>
      <ul>
        <li>Near Kharghar Central Park</li>
        <li>Excellent connectivity to Mumbai via highway</li>
        <li>Premium schools and hospitals nearby</li>
        <li>Close to proposed Navi Mumbai Airport</li>
        <li>Walking distance from Kharghar railway station</li>
      </ul>

      <blockquote>
        <p>"Paradise Sai World Empire is redefining luxury living in Navi Mumbai with its comprehensive amenities and strategic location."</p>
        <cite>— Rajesh Kumar, Luxury Property Specialist</cite>
      </blockquote>

      <h2 id="amenities">🏊 50+ World-Class Amenities</h2>
      <p>The project offers an extensive range of amenities including:</p>
      <ul>
        <li>Multiple swimming pools</li>
        <li>Clubhouse with banquet hall</li>
        <li>Sports facilities (tennis, basketball, cricket)</li>
        <li>Yoga and meditation center</li>
        <li>Landscaped gardens with walking trails</li>
        <li>Kids play areas and senior citizen zones</li>
      </ul>
    `,
    tags: ['Paradise Sai World Empire', 'Kharghar', 'Luxury Homes', 'Navi Mumbai'],
    relatedSlugs: ['navi-mumbai-airport-impact-real-estate'],
    recentPostSlugs: ['mantra-1-residences-burgundy-review', 'budget-homes-pune-under-75-lakhs'],
    faqs: [
      {
        question: 'What is the total area of Paradise Sai World Empire?',
        answer: 'Paradise Sai World Empire is a sprawling township development spread across several acres in Kharghar, Navi Mumbai.'
      },
      {
        question: 'How many amenities does the project offer?',
        answer: 'The project offers 50+ world-class amenities including swimming pools, clubhouse, sports facilities, and more.'
      },
      {
        question: 'Is the project close to Navi Mumbai Airport?',
        answer: 'Yes, the project is strategically located and will benefit from the upcoming Navi Mumbai International Airport.'
      },
      {
        question: 'What BHK configurations are available?',
        answer: 'The project primarily offers premium 3 BHK apartments with carpet areas ranging from 1200 to 1500 sq.ft.'
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
    author: {
      name: 'Shruti B',
      role: 'Investment Advisor',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      bio: 'Shruti specializes in emerging Pune micro-markets.'
    },
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    image2: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80', // 👈 2nd Image (Modern Architecture)
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
    recentPostSlugs: ['paradise-sai-world-empire-kharghar', 'navi-mumbai-airport-impact-real-estate'],
    faqs: [
      {
        question: 'What is the expected appreciation for Mantra Codename Paradise?',
        answer: 'The project is expected to appreciate 15-20% by possession in 2028, driven by infrastructure development in Sus.'
      },
      {
        question: 'Is Sus a good location for investment?',
        answer: 'Yes, Sus is emerging as Pune\'s next premium residential destination with excellent connectivity to IT hubs.'
      },
      {
        question: 'What configurations are available?',
        answer: 'The project offers 2 BHK and 3 BHK apartments suitable for both end-users and investors.'
      }
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
    author: {
      name: 'Charmi Thakker',
      role: 'Budget Home Specialist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      bio: 'Charmi specializes in affordable housing solutions.'
    },
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
    image2: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80', // 👈 2nd Image (Cozy Apartment)
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
    recentPostSlugs: ['paradise-sai-world-empire-kharghar', 'mantra-codename-paradise-sus-pune'],
    faqs: [
      {
        question: 'Can I get a 2 BHK in Pune under ₹75 lakhs?',
        answer: 'Yes, you can find 2 BHK apartments under ₹75 lakhs in areas like Wakad, Hinjewadi, Ravet, and Chinchwad.'
      },
      {
        question: 'Which is the most affordable area in Pune?',
        answer: 'Chinchwad and Ravet offer the most affordable options starting from ₹50-55 lakhs for 2 BHK.'
      },
      {
        question: 'Are budget homes a good investment?',
        answer: 'Yes, budget homes in emerging areas offer good appreciation potential and rental yields.'
      }
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
    author: {
      name: 'Pushkar Dake',
      role: 'Senior Real Estate Analyst',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      bio: 'Pushkar tracks Mumbai real estate market with 12+ years experience.'
    },
    image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1200&q=80',
    image2: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80', // 👈 2nd Image (Airport/Aviation)
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
    relatedSlugs: ['paradise-sai-world-empire-kharghar'],
    recentPostSlugs: ['mantra-1-residences-burgundy-review', 'mantra-codename-paradise-sus-pune'],
    faqs: [
      {
        question: 'When will Navi Mumbai Airport be operational?',
        answer: 'The Navi Mumbai International Airport is expected to be fully operational by 2025-2026.'
      },
      {
        question: 'Which areas will benefit most from the airport?',
        answer: 'Panvel, Ulwe, and Kharghar are expected to see the maximum appreciation due to their proximity to the airport.'
      },
      {
        question: 'Is it a good time to invest in Navi Mumbai?',
        answer: 'Yes, with the airport becoming operational, now is an excellent time to invest in Navi Mumbai real estate.'
      },
      {
        question: 'What appreciation can I expect?',
        answer: 'Areas near the airport have already seen 15-25% appreciation and are expected to grow further.'
      }
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
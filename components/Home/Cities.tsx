// data/cities.tsx

export type City = {
  name: string;
  slug: string;
  image: string;
  propertyCount: number;
  state: string;
};

export const CITIES: City[] = [
  {
    name: "Mumbai",
    slug: "mumbai",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&h=350&fit=crop",
    propertyCount: 12450,
    state: "Maharashtra",
  },
  {
    name: "Pune",
    slug: "pune",
    image:
      "https://images.unsplash.com/photo-1623579822698-ba89ff0e3da9?w=500&h=350&fit=crop",
    propertyCount: 8920,
    state: "Maharashtra",
  },
  {
    name: "Bangalore",
    slug: "bangalore",
    image:
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=500&h=350&fit=crop",
    propertyCount: 15780,
    state: "Karnataka",
  },
  {
    name: "Hyderabad",
    slug: "hyderabad",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&h=350&fit=crop&sat=-80",
    propertyCount: 9340,
    state: "Telangana",
  },
  {
    name: "Chennai",
    slug: "chennai",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&h=350&fit=crop",
    propertyCount: 7650,
    state: "Tamil Nadu",
  },
  {
    name: "Delhi",
    slug: "delhi",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&h=350&fit=crop",
    propertyCount: 21000,
    state: "NCR",
  },
  {
    name: "Kolkata",
    slug: "kolkata",
    image:
      "https://images.unsplash.com/photo-1558431382-27e303142255?w=500&h=350&fit=crop",
    propertyCount: 6200,
    state: "West Bengal",
  },
  {
    name: "Lucknow",
    slug: "lucknow",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=500&h=350&fit=crop",
    propertyCount: 3400,
    state: "Uttar Pradesh",
  },
];
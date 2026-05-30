export interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  subcategories: SubCategory[];
}

export const categories: CategoryItem[] = [
  {
    id: "1",
    name: "Vehicles",
    slug: "vehicles",
    icon: "Car",
    description: "Cars, motorcycles, and bicycles",
    subcategories: [
      { id: "1-1", name: "Cars", slug: "cars" },
      { id: "1-2", name: "Motorcycles", slug: "motorcycles" },
      { id: "1-3", name: "Bicycles", slug: "bicycles" },
    ],
  },
  {
    id: "2",
    name: "Property",
    slug: "property",
    icon: "Home",
    description: "Houses, apartments, and land",
    subcategories: [
      { id: "2-1", name: "Houses", slug: "houses" },
      { id: "2-2", name: "Apartments", slug: "apartments" },
      { id: "2-3", name: "Land", slug: "land" },
    ],
  },
  {
    id: "3",
    name: "Electronics",
    slug: "electronics",
    icon: "Smartphone",
    description: "Phones, computers, and TVs",
    subcategories: [
      { id: "3-1", name: "Phones", slug: "phones" },
      { id: "3-2", name: "Computers", slug: "computers" },
      { id: "3-3", name: "TVs", slug: "tvs" },
    ],
  },
  {
    id: "4",
    name: "Jobs",
    slug: "jobs",
    icon: "Briefcase",
    description: "Full-time, part-time, and freelance",
    subcategories: [
      { id: "4-1", name: "Full-time", slug: "full-time" },
      { id: "4-2", name: "Part-time", slug: "part-time" },
      { id: "4-3", name: "Freelance", slug: "freelance" },
    ],
  },
  {
    id: "5",
    name: "Services",
    slug: "services",
    icon: "Wrench",
    description: "Repair, tutoring, and delivery",
    subcategories: [
      { id: "5-1", name: "Repair", slug: "repair" },
      { id: "5-2", name: "Tutoring", slug: "tutoring" },
      { id: "5-3", name: "Delivery", slug: "delivery" },
    ],
  },
  {
    id: "6",
    name: "Fashion",
    slug: "fashion",
    icon: "Shirt",
    description: "Clothing, shoes, and accessories",
    subcategories: [
      { id: "6-1", name: "Clothing", slug: "clothing" },
      { id: "6-2", name: "Shoes", slug: "shoes" },
      { id: "6-3", name: "Accessories", slug: "accessories" },
    ],
  },
  {
    id: "7",
    name: "Home & Garden",
    slug: "home-garden",
    icon: "Flower2",
    description: "Furniture, decor, and garden supplies",
    subcategories: [],
  },
  {
    id: "8",
    name: "Sports & Leisure",
    slug: "sports-leisure",
    icon: "Dumbbell",
    description: "Sports equipment and outdoor activities",
    subcategories: [],
  },
  {
    id: "9",
    name: "Digital Products",
    slug: "digital-products",
    icon: "Gamepad2",
    description: "Game accounts, software, and digital art",
    subcategories: [
      { id: "9-1", name: "Game Accounts", slug: "game-accounts" },
      { id: "9-2", name: "Software", slug: "software" },
      { id: "9-3", name: "Digital Art", slug: "digital-art" },
    ],
  },
];

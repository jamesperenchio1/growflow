export const plantImages: Record<string, { url: string; credit: string }> = {
  Tomato: {
    url: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=400&fit=crop",
    credit: "Unsplash",
  },
  Lettuce: {
    url: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=400&fit=crop",
    credit: "Unsplash",
  },
  Basil: {
    url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
    credit: "Unsplash",
  },
  "Bell Pepper": {
    url: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop",
    credit: "Unsplash",
  },
  Cucumber: {
    url: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=400&fit=crop",
    credit: "Unsplash",
  },
  Spinach: {
    url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
    credit: "Unsplash",
  },
  Kale: {
    url: "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=400&h=400&fit=crop",
    credit: "Unsplash",
  },
  Carrot: {
    url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop",
    credit: "Unsplash",
  },
  Onion: {
    url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop",
    credit: "Unsplash",
  },
  Broccoli: {
    url: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop",
    credit: "Unsplash",
  },
  "Thai Basil": {
    url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
    credit: "Unsplash",
  },
  "Bird Chili": {
    url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&h=400&fit=crop",
    credit: "Unsplash",
  },
  "Morning Glory": {
    url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=400&fit=crop",
    credit: "Unsplash",
  },
  "Long Bean": {
    url: "https://images.unsplash.com/photo-1567375683747-6f2e9abec852?w=400&h=400&fit=crop",
    credit: "Unsplash",
  },
  "Thai Eggplant": {
    url: "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=400&h=400&fit=crop",
    credit: "Unsplash",
  },
  "Bitter Melon": {
    url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop",
    credit: "Unsplash",
  },
  Marigold: {
    url: "https://images.unsplash.com/photo-1476990288523-338e1b739276?w=400&h=400&fit=crop",
    credit: "Unsplash",
  },
  Strawberry: {
    url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop",
    credit: "Unsplash",
  },
};

export function getPlantImage(name: string): { url: string; credit: string } | undefined {
  return plantImages[name] ?? undefined;
}

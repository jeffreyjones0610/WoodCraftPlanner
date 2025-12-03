// Curated material pricing database with Home Depot product references
// Prices are estimates and may vary by location

export interface MaterialProduct {
  id: string;
  name: string;
  material: string;
  dimensions: {
    length: number; // inches
    width: number;  // inches
    thickness: number; // inches
  };
  price: number; // USD
  priceUnit: "piece" | "linear_foot" | "board_foot";
  homeDepotSku?: string;
  homeDepotUrl?: string;
  description?: string;
  inStock?: boolean;
}

export interface MaterialCategory {
  name: string;
  products: MaterialProduct[];
}

export const materialDatabase: MaterialCategory[] = [
  {
    name: "Dimensional Lumber - Pine",
    products: [
      {
        id: "pine-2x4-8",
        name: '2" x 4" x 8\' Pine Stud',
        material: "Pine",
        dimensions: { length: 96, width: 3.5, thickness: 1.5 },
        price: 3.98,
        priceUnit: "piece",
        homeDepotSku: "161640",
        homeDepotUrl: "https://www.homedepot.com/p/2-in-x-4-in-x-96-in-Premium-Kiln-Dried-Whitewood-Stud-161640/202091220",
        description: "Premium kiln-dried whitewood stud",
        inStock: true
      },
      {
        id: "pine-2x4-10",
        name: '2" x 4" x 10\' Pine',
        material: "Pine",
        dimensions: { length: 120, width: 3.5, thickness: 1.5 },
        price: 5.48,
        priceUnit: "piece",
        homeDepotSku: "161641",
        homeDepotUrl: "https://www.homedepot.com/p/2-in-x-4-in-x-10-ft-2-Prime-or-BTR-KD-HT-SPF-Dimensional-Lumber-058449/312528752",
        inStock: true
      },
      {
        id: "pine-2x6-8",
        name: '2" x 6" x 8\' Pine',
        material: "Pine",
        dimensions: { length: 96, width: 5.5, thickness: 1.5 },
        price: 6.97,
        priceUnit: "piece",
        homeDepotSku: "161648",
        homeDepotUrl: "https://www.homedepot.com/p/2-in-x-6-in-x-8-ft-2-Prime-or-Better-Kiln-Dried-Heat-Treated-SPF-Dimensional-Lumber-058450/312528749",
        inStock: true
      },
      {
        id: "pine-2x6-10",
        name: '2" x 6" x 10\' Pine',
        material: "Pine",
        dimensions: { length: 120, width: 5.5, thickness: 1.5 },
        price: 8.97,
        priceUnit: "piece",
        homeDepotSku: "161650",
        homeDepotUrl: "https://www.homedepot.com/p/2-in-x-6-in-x-10-ft-2-Prime-or-Better-Kiln-Dried-Heat-Treated-SPF-Dimensional-Lumber-058451/312528748",
        inStock: true
      },
      {
        id: "pine-2x8-8",
        name: '2" x 8" x 8\' Pine',
        material: "Pine",
        dimensions: { length: 96, width: 7.25, thickness: 1.5 },
        price: 9.47,
        priceUnit: "piece",
        homeDepotSku: "161652",
        homeDepotUrl: "https://www.homedepot.com/p/2-in-x-8-in-x-8-ft-2-Prime-or-BTR-KD-HT-SPF-Dimensional-Lumber-058452/312528747",
        inStock: true
      },
      {
        id: "pine-2x10-8",
        name: '2" x 10" x 8\' Pine',
        material: "Pine",
        dimensions: { length: 96, width: 9.25, thickness: 1.5 },
        price: 12.47,
        priceUnit: "piece",
        homeDepotSku: "161656",
        homeDepotUrl: "https://www.homedepot.com/p/2-in-x-10-in-x-8-ft-2-Prime-or-BTR-KD-HT-SPF-Dimensional-Lumber-058454/312528745",
        inStock: true
      },
      {
        id: "pine-2x12-8",
        name: '2" x 12" x 8\' Pine',
        material: "Pine",
        dimensions: { length: 96, width: 11.25, thickness: 1.5 },
        price: 16.97,
        priceUnit: "piece",
        homeDepotSku: "161660",
        homeDepotUrl: "https://www.homedepot.com/p/2-in-x-12-in-x-8-ft-2-Prime-or-BTR-KD-HT-SPF-Dimensional-Lumber-058456/312528743",
        inStock: true
      },
      {
        id: "pine-1x4-8",
        name: '1" x 4" x 8\' Pine Board',
        material: "Pine",
        dimensions: { length: 96, width: 3.5, thickness: 0.75 },
        price: 5.98,
        priceUnit: "piece",
        homeDepotSku: "914770",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-4-in-x-8-ft-Select-Radiata-Pine-Board-914770/206004405",
        inStock: true
      },
      {
        id: "pine-1x6-8",
        name: '1" x 6" x 8\' Pine Board',
        material: "Pine",
        dimensions: { length: 96, width: 5.5, thickness: 0.75 },
        price: 8.98,
        priceUnit: "piece",
        homeDepotSku: "914786",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-6-in-x-8-ft-Select-Radiata-Pine-Board-914786/206004406",
        inStock: true
      },
      {
        id: "pine-1x8-8",
        name: '1" x 8" x 8\' Pine Board',
        material: "Pine",
        dimensions: { length: 96, width: 7.25, thickness: 0.75 },
        price: 12.48,
        priceUnit: "piece",
        homeDepotSku: "914802",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-8-in-x-8-ft-Select-Radiata-Pine-Board-914802/206004407",
        inStock: true
      },
      {
        id: "pine-1x12-8",
        name: '1" x 12" x 8\' Pine Board',
        material: "Pine",
        dimensions: { length: 96, width: 11.25, thickness: 0.75 },
        price: 18.98,
        priceUnit: "piece",
        homeDepotSku: "914834",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-12-in-x-8-ft-Select-Radiata-Pine-Board-914834/206004409",
        inStock: true
      },
    ]
  },
  {
    name: "Hardwood - Oak",
    products: [
      {
        id: "oak-1x2-4",
        name: '1" x 2" x 4\' Red Oak',
        material: "Oak",
        dimensions: { length: 48, width: 1.5, thickness: 0.75 },
        price: 7.98,
        priceUnit: "piece",
        homeDepotSku: "477463",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-2-in-x-4-ft-S4S-Red-Oak-Board-477463/203087098",
        inStock: true
      },
      {
        id: "oak-1x3-4",
        name: '1" x 3" x 4\' Red Oak',
        material: "Oak",
        dimensions: { length: 48, width: 2.5, thickness: 0.75 },
        price: 11.48,
        priceUnit: "piece",
        homeDepotSku: "477471",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-3-in-x-4-ft-S4S-Red-Oak-Board-477471/203087099",
        inStock: true
      },
      {
        id: "oak-1x4-4",
        name: '1" x 4" x 4\' Red Oak',
        material: "Oak",
        dimensions: { length: 48, width: 3.5, thickness: 0.75 },
        price: 14.98,
        priceUnit: "piece",
        homeDepotSku: "477489",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-4-in-x-4-ft-S4S-Red-Oak-Board-477489/203087100",
        inStock: true
      },
      {
        id: "oak-1x6-4",
        name: '1" x 6" x 4\' Red Oak',
        material: "Oak",
        dimensions: { length: 48, width: 5.5, thickness: 0.75 },
        price: 22.98,
        priceUnit: "piece",
        homeDepotSku: "477505",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-6-in-x-4-ft-S4S-Red-Oak-Board-477505/203087101",
        inStock: true
      },
      {
        id: "oak-1x8-4",
        name: '1" x 8" x 4\' Red Oak',
        material: "Oak",
        dimensions: { length: 48, width: 7.25, thickness: 0.75 },
        price: 32.98,
        priceUnit: "piece",
        homeDepotSku: "477513",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-8-in-x-4-ft-S4S-Red-Oak-Board-477513/203087102",
        inStock: true
      },
    ]
  },
  {
    name: "Hardwood - Maple",
    products: [
      {
        id: "maple-1x2-4",
        name: '1" x 2" x 4\' Hard Maple',
        material: "Maple",
        dimensions: { length: 48, width: 1.5, thickness: 0.75 },
        price: 8.98,
        priceUnit: "piece",
        homeDepotSku: "358775",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-2-in-x-4-ft-S4S-Hard-Maple-Board-358775/310847893",
        inStock: true
      },
      {
        id: "maple-1x4-4",
        name: '1" x 4" x 4\' Hard Maple',
        material: "Maple",
        dimensions: { length: 48, width: 3.5, thickness: 0.75 },
        price: 16.98,
        priceUnit: "piece",
        homeDepotSku: "358776",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-4-in-x-4-ft-S4S-Hard-Maple-Board-358776/310847894",
        inStock: true
      },
      {
        id: "maple-1x6-4",
        name: '1" x 6" x 4\' Hard Maple',
        material: "Maple",
        dimensions: { length: 48, width: 5.5, thickness: 0.75 },
        price: 26.98,
        priceUnit: "piece",
        homeDepotSku: "358777",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-6-in-x-4-ft-S4S-Hard-Maple-Board-358777/310847895",
        inStock: true
      },
    ]
  },
  {
    name: "Hardwood - Walnut",
    products: [
      {
        id: "walnut-1x4-4",
        name: '1" x 4" x 4\' Walnut',
        material: "Walnut",
        dimensions: { length: 48, width: 3.5, thickness: 0.75 },
        price: 32.98,
        priceUnit: "piece",
        homeDepotSku: "358780",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-4-in-x-4-ft-S4S-Walnut-Board-358780/310847899",
        inStock: true
      },
      {
        id: "walnut-1x6-4",
        name: '1" x 6" x 4\' Walnut',
        material: "Walnut",
        dimensions: { length: 48, width: 5.5, thickness: 0.75 },
        price: 48.98,
        priceUnit: "piece",
        homeDepotSku: "358781",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-6-in-x-4-ft-S4S-Walnut-Board-358781/310847900",
        inStock: true
      },
    ]
  },
  {
    name: "Hardwood - Cherry",
    products: [
      {
        id: "cherry-1x4-4",
        name: '1" x 4" x 4\' Cherry',
        material: "Cherry",
        dimensions: { length: 48, width: 3.5, thickness: 0.75 },
        price: 28.98,
        priceUnit: "piece",
        homeDepotSku: "358784",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-4-in-x-4-ft-S4S-Cherry-Board-358784/310847904",
        inStock: true
      },
      {
        id: "cherry-1x6-4",
        name: '1" x 6" x 4\' Cherry',
        material: "Cherry",
        dimensions: { length: 48, width: 5.5, thickness: 0.75 },
        price: 42.98,
        priceUnit: "piece",
        homeDepotSku: "358785",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-6-in-x-4-ft-S4S-Cherry-Board-358785/310847905",
        inStock: true
      },
    ]
  },
  {
    name: "Hardwood - Poplar",
    products: [
      {
        id: "poplar-1x2-4",
        name: '1" x 2" x 4\' Poplar',
        material: "Poplar",
        dimensions: { length: 48, width: 1.5, thickness: 0.75 },
        price: 4.98,
        priceUnit: "piece",
        homeDepotSku: "477421",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-2-in-x-4-ft-S4S-Poplar-Board-477421/203087088",
        inStock: true
      },
      {
        id: "poplar-1x4-4",
        name: '1" x 4" x 4\' Poplar',
        material: "Poplar",
        dimensions: { length: 48, width: 3.5, thickness: 0.75 },
        price: 7.48,
        priceUnit: "piece",
        homeDepotSku: "477447",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-4-in-x-4-ft-S4S-Poplar-Board-477447/203087090",
        inStock: true
      },
      {
        id: "poplar-1x6-4",
        name: '1" x 6" x 4\' Poplar',
        material: "Poplar",
        dimensions: { length: 48, width: 5.5, thickness: 0.75 },
        price: 10.98,
        priceUnit: "piece",
        homeDepotSku: "477455",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-6-in-x-4-ft-S4S-Poplar-Board-477455/203087091",
        inStock: true
      },
      {
        id: "poplar-1x8-4",
        name: '1" x 8" x 4\' Poplar',
        material: "Poplar",
        dimensions: { length: 48, width: 7.25, thickness: 0.75 },
        price: 14.98,
        priceUnit: "piece",
        homeDepotSku: "477456",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-8-in-x-4-ft-S4S-Poplar-Board-477456/203087092",
        inStock: true
      },
    ]
  },
  {
    name: "Plywood",
    products: [
      {
        id: "plywood-14-4x8-birch",
        name: '1/4" x 4\' x 8\' Birch Plywood',
        material: "Birch",
        dimensions: { length: 96, width: 48, thickness: 0.25 },
        price: 29.98,
        priceUnit: "piece",
        homeDepotSku: "833096",
        homeDepotUrl: "https://www.homedepot.com/p/Columbia-Forest-Products-1-4-in-x-4-ft-x-8-ft-PureBond-Birch-Plywood-833096/202936761",
        inStock: true
      },
      {
        id: "plywood-12-4x8-birch",
        name: '1/2" x 4\' x 8\' Birch Plywood',
        material: "Birch",
        dimensions: { length: 96, width: 48, thickness: 0.5 },
        price: 54.98,
        priceUnit: "piece",
        homeDepotSku: "833112",
        homeDepotUrl: "https://www.homedepot.com/p/Columbia-Forest-Products-1-2-in-x-4-ft-x-8-ft-PureBond-Birch-Plywood-833112/202936765",
        inStock: true
      },
      {
        id: "plywood-34-4x8-birch",
        name: '3/4" x 4\' x 8\' Birch Plywood',
        material: "Birch",
        dimensions: { length: 96, width: 48, thickness: 0.75 },
        price: 69.98,
        priceUnit: "piece",
        homeDepotSku: "833136",
        homeDepotUrl: "https://www.homedepot.com/p/Columbia-Forest-Products-3-4-in-x-4-ft-x-8-ft-PureBond-Birch-Plywood-833136/202936769",
        inStock: true
      },
      {
        id: "plywood-34-4x8-sanded",
        name: '3/4" x 4\' x 8\' Sanded Plywood',
        material: "Plywood",
        dimensions: { length: 96, width: 48, thickness: 0.75 },
        price: 47.98,
        priceUnit: "piece",
        homeDepotSku: "166081",
        homeDepotUrl: "https://www.homedepot.com/p/23-32-in-x-4-ft-x-8-ft-RTD-Sheathing-Syp-166081/100072941",
        inStock: true
      },
    ]
  },
  {
    name: "MDF",
    products: [
      {
        id: "mdf-12-4x8",
        name: '1/2" x 4\' x 8\' MDF Panel',
        material: "MDF",
        dimensions: { length: 96, width: 48, thickness: 0.5 },
        price: 28.97,
        priceUnit: "piece",
        homeDepotSku: "205050",
        homeDepotUrl: "https://www.homedepot.com/p/1-2-in-x-4-ft-x-8-ft-Medium-Density-Fiberboard-Panel-205050/100070339",
        inStock: true
      },
      {
        id: "mdf-34-4x8",
        name: '3/4" x 4\' x 8\' MDF Panel',
        material: "MDF",
        dimensions: { length: 96, width: 48, thickness: 0.75 },
        price: 39.97,
        priceUnit: "piece",
        homeDepotSku: "205066",
        homeDepotUrl: "https://www.homedepot.com/p/3-4-in-x-4-ft-x-8-ft-Medium-Density-Fiberboard-Panel-205066/100070340",
        inStock: true
      },
    ]
  },
  {
    name: "Cedar",
    products: [
      {
        id: "cedar-2x4-8",
        name: '2" x 4" x 8\' Western Red Cedar',
        material: "Cedar",
        dimensions: { length: 96, width: 3.5, thickness: 1.5 },
        price: 12.98,
        priceUnit: "piece",
        homeDepotSku: "200694",
        homeDepotUrl: "https://www.homedepot.com/p/2-in-x-4-in-x-8-ft-S4S-Rough-Green-Western-Red-Cedar-200694/100077279",
        inStock: true
      },
      {
        id: "cedar-2x6-8",
        name: '2" x 6" x 8\' Western Red Cedar',
        material: "Cedar",
        dimensions: { length: 96, width: 5.5, thickness: 1.5 },
        price: 19.98,
        priceUnit: "piece",
        homeDepotSku: "200695",
        homeDepotUrl: "https://www.homedepot.com/p/2-in-x-6-in-x-8-ft-S4S-Rough-Green-Western-Red-Cedar-200695/100077280",
        inStock: true
      },
      {
        id: "cedar-1x6-8",
        name: '1" x 6" x 8\' Cedar Fence Board',
        material: "Cedar",
        dimensions: { length: 96, width: 5.5, thickness: 0.75 },
        price: 5.98,
        priceUnit: "piece",
        homeDepotSku: "200661",
        homeDepotUrl: "https://www.homedepot.com/p/1-in-x-6-in-x-8-ft-Western-Red-Cedar-Fence-Board-200661/100052254",
        inStock: true
      },
    ]
  },
];

// Get all products as a flat array
export function getAllProducts(): MaterialProduct[] {
  return materialDatabase.flatMap(category => category.products);
}

// Find products by material type
export function getProductsByMaterial(material: string): MaterialProduct[] {
  return getAllProducts().filter(p => 
    p.material.toLowerCase() === material.toLowerCase()
  );
}

// Find the best matching product for given dimensions and material
export function findBestMatch(
  material: string,
  length: number,
  width: number,
  thickness: number
): MaterialProduct | null {
  const products = getProductsByMaterial(material);
  
  // Find products that can accommodate the required dimensions
  const matches = products.filter(p => 
    p.dimensions.length >= length &&
    p.dimensions.width >= width &&
    p.dimensions.thickness >= thickness
  );
  
  if (matches.length === 0) return null;
  
  // Sort by price to get the cheapest option
  matches.sort((a, b) => a.price - b.price);
  
  return matches[0];
}

// Calculate estimated price per piece based on dimensions
export function estimatePricePerPiece(
  product: MaterialProduct,
  length: number,
  width: number,
  thickness: number
): number {
  // For board foot pricing, calculate based on volume
  if (product.priceUnit === "board_foot") {
    const boardFeet = (length * width * thickness) / 144;
    return boardFeet * product.price;
  }
  
  // For linear foot pricing
  if (product.priceUnit === "linear_foot") {
    const linearFeet = length / 12;
    return linearFeet * product.price;
  }
  
  // For piece pricing, if the piece fits entirely, use full price
  // Otherwise estimate based on how many pieces needed
  const piecesNeeded = Math.ceil(length / product.dimensions.length) *
                       Math.ceil(width / product.dimensions.width);
  
  return product.price * piecesNeeded;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  color: string[];
  description: string;
  specifications: {
    voltage?: string;
    conductor?: string;
    insulation?: string;
    size?: string;
    [key: string]: string | undefined;
  };
  basePrice: number;
  unitType: 'metres' | 'coils';
  stockQuantity: number;
  imageUrl: string;
  brochureUrl?: string;
  isActive: boolean;
}

export const productsData: Product[] = [
  {
    id: '1',
    name: 'FR PVC Insulated Wire 1.5 sq mm',
    brand: 'Polycab',
    category: 'House Wires',
    color: ['Red', 'Blue', 'Yellow', 'Green', 'Black'],
    description: 'Flame retardant PVC insulated copper conductor wire suitable for domestic and commercial applications.',
    specifications: {
      voltage: '1100V',
      conductor: 'Annealed Copper',
      insulation: 'FR PVC',
      size: '1.5 sq mm',
      standard: 'IS 694:2010'
    },
    basePrice: 28.50,
    unitType: 'metres',
    stockQuantity: 5000,
    imageUrl: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg',
    brochureUrl: '/brochures/polycab-house-wire.pdf',
    isActive: true
  },
  {
    id: '2',
    name: 'FR PVC Insulated Wire 2.5 sq mm',
    brand: 'Polycab',
    category: 'House Wires',
    color: ['Red', 'Blue', 'Yellow', 'Black'],
    description: 'Heavy duty flame retardant wire for higher load applications.',
    specifications: {
      voltage: '1100V',
      conductor: 'Annealed Copper',
      insulation: 'FR PVC',
      size: '2.5 sq mm',
      standard: 'IS 694:2010'
    },
    basePrice: 45.00,
    unitType: 'metres',
    stockQuantity: 4000,
    imageUrl: 'https://images.pexels.com/photos/6419122/pexels-photo-6419122.jpeg',
    isActive: true
  },
  {
    id: '3',
    name: 'HRFR Cable 4 sq mm',
    brand: 'Havells',
    category: 'Building Wires',
    color: ['Red', 'Blue', 'Yellow', 'Green'],
    description: 'Heat resistant and flame retardant cable for industrial and residential use.',
    specifications: {
      voltage: '1100V',
      conductor: 'Electrolytic Copper',
      insulation: 'HRFR PVC',
      size: '4 sq mm',
      standard: 'IS 694:2010'
    },
    basePrice: 68.00,
    unitType: 'metres',
    stockQuantity: 3500,
    imageUrl: 'https://images.pexels.com/photos/163676/cannabis-hemp-plant-weed-163676.jpeg',
    isActive: true
  },
  {
    id: '4',
    name: 'Armoured LT Cable 3 Core 50 sq mm',
    brand: 'KEI',
    category: 'Power Cables',
    color: ['Black'],
    description: 'Armoured low tension cable for underground and outdoor power distribution.',
    specifications: {
      voltage: '1.1 kV',
      conductor: 'Aluminium',
      insulation: 'XLPE',
      size: '3 Core x 50 sq mm',
      armour: 'Galvanized Steel Wire'
    },
    basePrice: 425.00,
    unitType: 'metres',
    stockQuantity: 2000,
    imageUrl: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg',
    isActive: true
  },
  {
    id: '5',
    name: 'Flexible Cable 0.75 sq mm',
    brand: 'Finolex',
    category: 'Flexible Cables',
    color: ['Red', 'Blue', 'Yellow', 'White', 'Black'],
    description: 'Multi-strand flexible copper cable for appliances and electronics.',
    specifications: {
      voltage: '750V',
      conductor: 'Tinned Copper',
      insulation: 'PVC',
      size: '0.75 sq mm',
      strands: '24/0.20'
    },
    basePrice: 18.00,
    unitType: 'metres',
    stockQuantity: 6000,
    imageUrl: 'https://images.pexels.com/photos/6419122/pexels-photo-6419122.jpeg',
    isActive: true
  },
  {
    id: '6',
    name: 'FR Wire 6 sq mm',
    brand: 'V-Guard',
    category: 'House Wires',
    color: ['Red', 'Blue', 'Yellow', 'Green', 'Black'],
    description: 'High quality flame retardant wire for heavy duty applications.',
    specifications: {
      voltage: '1100V',
      conductor: 'Annealed Copper',
      insulation: 'FR PVC',
      size: '6 sq mm',
      standard: 'IS 694:2010'
    },
    basePrice: 95.00,
    unitType: 'metres',
    stockQuantity: 3000,
    imageUrl: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg',
    isActive: true
  },
  {
    id: '7',
    name: 'Submersible Cable 3 Core 4 sq mm',
    brand: 'RR Kabel',
    category: 'Submersible Cables',
    color: ['Black'],
    description: 'Water resistant cable designed for submersible pump applications.',
    specifications: {
      voltage: '1100V',
      conductor: 'Tinned Copper',
      insulation: 'PVC',
      size: '3 Core x 4 sq mm',
      sheath: 'PVC'
    },
    basePrice: 85.00,
    unitType: 'metres',
    stockQuantity: 2500,
    imageUrl: 'https://images.pexels.com/photos/163676/cannabis-hemp-plant-weed-163676.jpeg',
    isActive: true
  },
  {
    id: '8',
    name: 'Coaxial Cable RG6',
    brand: 'Anchor',
    category: 'Communication Cables',
    color: ['White', 'Black'],
    description: 'High quality coaxial cable for TV, CCTV and broadband applications.',
    specifications: {
      type: 'RG6',
      impedance: '75 Ohm',
      conductor: 'Copper Clad Steel',
      shielding: 'Braided + Foil',
      jacket: 'PVC'
    },
    basePrice: 22.00,
    unitType: 'metres',
    stockQuantity: 8000,
    imageUrl: 'https://images.pexels.com/photos/6419122/pexels-photo-6419122.jpeg',
    isActive: true
  },
  {
    id: '9',
    name: 'Control Cable 7 Core 1.5 sq mm',
    brand: 'L&T',
    category: 'Control Cables',
    color: ['Grey'],
    description: 'Multi-core control cable for industrial automation and control panels.',
    specifications: {
      voltage: '1100V',
      conductor: 'Annealed Copper',
      insulation: 'PVC',
      size: '7 Core x 1.5 sq mm',
      sheath: 'PVC'
    },
    basePrice: 72.00,
    unitType: 'metres',
    stockQuantity: 1500,
    imageUrl: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg',
    isActive: true
  },
  {
    id: '10',
    name: 'Solar DC Cable 4 sq mm',
    brand: 'Polycab',
    category: 'Solar Cables',
    color: ['Red', 'Black'],
    description: 'UV resistant cable specially designed for solar panel installations.',
    specifications: {
      voltage: '1500V DC',
      conductor: 'Tinned Copper',
      insulation: 'XLPO',
      size: '4 sq mm',
      temperature: '-40°C to +120°C'
    },
    basePrice: 58.00,
    unitType: 'metres',
    stockQuantity: 4500,
    imageUrl: 'https://images.pexels.com/photos/163676/cannabis-hemp-plant-weed-163676.jpeg',
    isActive: true
  }
];

export const brands = [
  'Polycab',
  'Havells',
  'KEI',
  'Finolex',
  'V-Guard',
  'RR Kabel',
  'Anchor',
  'L&T'
];

export const categories = [
  'House Wires',
  'Building Wires',
  'Power Cables',
  'Flexible Cables',
  'Submersible Cables',
  'Communication Cables',
  'Control Cables',
  'Solar Cables'
];

import { getAllProducts } from './firebase-services';

const PRODUCTS_STORAGE_KEY = 'wire_cable_products';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const firebaseProducts = await getAllProducts();
    if (firebaseProducts.length > 0) {
      return firebaseProducts;
    }
    return productsData;
  } catch (error) {
    console.error('Error fetching products from Firebase:', error);
    return productsData;
  }
};

export const getProductsSync = (): Product[] => {
  if (typeof window === 'undefined') return productsData;
  const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : productsData;
};

export const getProductById = (id: string): Product | undefined => {
  return getProductsSync().find(p => p.id === id);
};

export const getProductByIdAsync = async (id: string): Promise<Product | undefined> => {
  const products = await getProducts();
  return products.find(p => p.id === id);
};

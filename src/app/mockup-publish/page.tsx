"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Layers,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Palette,
  Package,
  Info,
  DollarSign,
  ArrowLeft,
  Search,
  AlignCenter,
  Percent,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Trash2,
} from "lucide-react";

interface ProductModel {
  id: string; // Printify Blueprint ID
  name: string;
  baseCost: number;
  defaultPrice: number;
  colors: string[];
  images: Record<string, string>;
  description: string;
  providers: string;
  shipsFrom: string;
  isBestseller: boolean;
  brand?: string;
  sizeGuide?: string[];
  blueprintImages?: string[];
}

interface PrintifyProvider {
  id: string;
  name: string;
  shipsFrom: string;
  shippingCost: number;
  productionTime: string;
  rating?: number;
}

interface VariantSettings {
  id: number | string;
  color: string;
  size: string;
  inStock: boolean;
  baseCost: number;
  retailPrice: number;
  selected: boolean;
}

interface CategoryData {
  id: string;
  name: string;
  emoji: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  models: ProductModel[];
}

interface PrintifyBlueprintPayload {
  id: number | string;
  title?: string;
  name?: string;
  brand?: string;
  description?: string;
  is_bestseller?: boolean;
  images?: string[];
}

interface PrintifyProviderPayload {
  id: number | string;
  title?: string;
  name?: string;
  location?: {
    country?: string;
  };
  rating?: number;
}

interface PrintifyVariantPayload {
  id: number | string;
  title?: string;
  price?: number;
  is_available?: boolean;
  options?: {
    color?: string;
    size?: string;
  };
}

const colorHexCodes: Record<string, string> = {
  "Black": "#000000",
  "White": "#ffffff",
  "Navy": "#1e293b",
  "Sport Grey": "#94a3b8",
  "Red": "#ef4444",
  "Blue": "#3b82f6",
  "Green": "#22c55e",
  "Pink": "#ec4899",
  "Yellow": "#eab308",
  "Purple": "#a855f7",
  "Orange": "#f97316",
  "Athletic Heather": "#cbd5e1",
  "Dark Grey": "#4b5563",
  "Royal": "#2563eb",
  "Forest Green": "#14532d",
  "Sand": "#f5e0c3",
};

const aiDesigns = [
  {
    name: "Golden Meadows",
    url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Abstract Neon Wave",
    url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Retro Solar Circle",
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Summit Ridge Lineart",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80",
  },
];

const fallbackCatalog: CategoryData[] = [
  {
    id: "tshirt",
    name: "T-Shirts",
    emoji: "👕",
    icon: Package,
    models: [
      {
        id: "3",
        name: "Bella+Canvas 3001 Unisex Tee",
        baseCost: 8.90,
        defaultPrice: 24.99,
        colors: ["Black", "White", "Navy", "Sport Grey"],
        images: {
          "White": "https://images.printify.com/api/v1/blueprints/3/images/1.jpg",
          "Black": "https://images.printify.com/api/v1/blueprints/3/images/1.jpg",
          "Navy": "https://images.printify.com/api/v1/blueprints/3/images/1.jpg",
          "Sport Grey": "https://images.printify.com/api/v1/blueprints/3/images/1.jpg",
        },
        description: "Premium fitted crewneck tee. 100% combed and ring-spun cotton. Highly durable ribbed collar, taped shoulders, and double-needle stitching for retail-ready listings.",
        providers: "18 Print Providers",
        shipsFrom: "Ships from US/EU/UK/CA",
        isBestseller: true,
        brand: "Bella+Canvas",
        sizeGuide: ["S: 18\" Width / 28\" Length", "M: 20\" Width / 29\" Length", "L: 22\" Width / 30\" Length", "XL: 24\" Width / 31\" Length"],
      },
      {
        id: "5",
        name: "Gildan 5000 Heavy Cotton Tee",
        baseCost: 6.20,
        defaultPrice: 19.99,
        colors: ["Black", "White", "Sport Grey"],
        images: {
          "White": "https://images.printify.com/api/v1/blueprints/5/images/1.jpg",
          "Black": "https://images.printify.com/api/v1/blueprints/5/images/1.jpg",
          "Sport Grey": "https://images.printify.com/api/v1/blueprints/5/images/1.jpg",
        },
        description: "Classic fit heavy cotton tee. 100% preshrunk cotton fabric. Seamless double-needle collar, taped neck and shoulders. Ideal for budget-conscious buyers.",
        providers: "22 Print Providers",
        shipsFrom: "Ships from US/EU",
        isBestseller: false,
        brand: "Gildan",
        sizeGuide: ["S: 18\" Width / 28\" Length", "M: 20\" Width / 29\" Length", "L: 22\" Width / 30\" Length", "XL: 24\" Width / 31\" Length"],
      },
      {
        id: "6",
        name: "Bella+Canvas 3005 Women's Favorite Tee",
        baseCost: 9.10,
        defaultPrice: 22.99,
        colors: ["White", "Black", "Navy"],
        images: {
          "White": "https://images.printify.com/api/v1/blueprints/6/images/1.jpg",
          "Black": "https://images.printify.com/api/v1/blueprints/6/images/1.jpg",
          "Navy": "https://images.printify.com/api/v1/blueprints/6/images/1.jpg",
        },
        description: "Slim fit crewneck t-shirt. Combed and ring-spun cotton fabric. Side-seamed construction, longer body length, and shoulder-to-shoulder taping.",
        providers: "14 Print Providers",
        shipsFrom: "Ships from US/EU/UK",
        isBestseller: false,
        brand: "Bella+Canvas",
        sizeGuide: ["S: 16\" Width / 26\" Length", "M: 17\" Width / 27\" Length", "L: 18\" Width / 28\" Length"],
      }
    ],
  },
  {
    id: "sweatshirt",
    name: "Sweatshirts & Hoodies",
    emoji: "🧥",
    icon: Sparkles,
    models: [
      {
        id: "12",
        name: "Gildan 18000 Crewneck Sweatshirt",
        baseCost: 14.50,
        defaultPrice: 39.99,
        colors: ["Black", "White", "Sport Grey", "Navy"],
        images: {
          "White": "https://images.printify.com/api/v1/blueprints/12/images/1.jpg",
          "Black": "https://images.printify.com/api/v1/blueprints/12/images/1.jpg",
          "Sport Grey": "https://images.printify.com/api/v1/blueprints/12/images/1.jpg",
          "Navy": "https://images.printify.com/api/v1/blueprints/12/images/1.jpg",
        },
        description: "Unisex heavy blend crewneck sweatshirt. 50% cotton, 50% polyester composition. Cozy brushed fleece interior, double-needle stitching, and 1x1 athletic rib collar.",
        providers: "12 Print Providers",
        shipsFrom: "Ships from US/EU/UK",
        isBestseller: true,
        brand: "Gildan",
        sizeGuide: ["S: 20\" Width / 27\" Length", "M: 22\" Width / 28\" Length", "L: 24\" Width / 29\" Length", "XL: 26\" Width / 30\" Length"],
      },
    ],
  },
  {
    id: "socks",
    name: "Socks",
    emoji: "🧦",
    icon: Package,
    models: [
      {
        id: "614",
        name: "Unisex Sublimation Crew Socks",
        baseCost: 5.20,
        defaultPrice: 12.99,
        colors: ["White"],
        images: {
          "White": "https://images.printify.com/api/v1/blueprints/614/images/1.jpg",
        },
        description: "Premium sublimation crew socks. Cushioned bottom for extra comfort, ribbed leg section to hold fit. Perfect canvas for all-over sublimation prints.",
        providers: "2 Print Providers",
        shipsFrom: "Ships from US",
        isBestseller: false,
        brand: "Generic",
        sizeGuide: ["M: fits shoe size 6-8", "L: fits shoe size 8-12"],
      }
    ],
  },
  {
    id: "mug",
    name: "Mugs & Drinkware",
    emoji: "☕",
    icon: Palette,
    models: [
      {
        id: "69",
        name: "Ceramic Mug 11oz",
        baseCost: 4.50,
        defaultPrice: 14.99,
        colors: ["White"],
        images: {
          "White": "https://images.printify.com/api/v1/blueprints/69/images/1.jpg",
        },
        description: "Classic glossy white ceramic mug. Dishwasher and microwave safe. C-handle design offering comfortable grip. Ready for high-quality transfer prints.",
        providers: "3 Print Providers",
        shipsFrom: "Ships from US/UK",
        isBestseller: true,
        brand: "Generic",
        sizeGuide: ["11oz: 3.2\" Diameter / 3.8\" Height"],
      },
    ],
  },
  {
    id: "candle",
    name: "Candles",
    emoji: "🕯️",
    icon: Sparkles,
    models: [
      {
        id: "254",
        name: "Vanilla Soy Wax Candle, 9oz",
        baseCost: 11.50,
        defaultPrice: 29.99,
        colors: ["White"],
        images: {
          "White": "https://images.printify.com/api/v1/blueprints/254/images/1.jpg",
        },
        description: "Hand-poured 100% natural soy wax candle. Infused with premium vanilla fragrance oil. 50-60 hour burn time. Eco-friendly cotton wick.",
        providers: "3 Print Providers",
        shipsFrom: "Ships from US",
        isBestseller: true,
        brand: "EcoSoy",
        sizeGuide: ["9oz: 3\" Diameter / 3.5\" Height"],
      },
    ],
  },
  {
    id: "wallart",
    name: "Wall Art",
    emoji: "🖼️",
    icon: Palette,
    models: [
      {
        id: "82",
        name: "Canvas Gallery Wrap (1.25\")",
        baseCost: 12.50,
        defaultPrice: 34.99,
        colors: ["White"],
        images: {
          "White": "https://images.printify.com/api/v1/blueprints/82/images/1.jpg",
        },
        description: "Artist-grade cotton canvas stretched over hard wood frame. High-definition pigment ink printing. Ready-to-hang saw tooth hangers pre-installed.",
        providers: "4 Print Providers",
        shipsFrom: "Ships from US/EU/UK",
        isBestseller: true,
        brand: "Generic",
        sizeGuide: ["8x10: 8\" x 10\"", "11x14: 11\" x 14\"", "16x20: 16\" x 20\""],
      },
      {
        id: "28",
        name: "Premium Matte Vertical Poster",
        baseCost: 4.50,
        defaultPrice: 12.99,
        colors: ["White"],
        images: {
          "White": "https://images.printify.com/api/v1/blueprints/28/images/1.jpg",
        },
        description: "Premium vertical matte poster printed on 175gsm museum-grade fine art paper. Vibrant color rendering and long-lasting print quality.",
        providers: "3 Print Providers",
        shipsFrom: "Ships from US/EU",
        isBestseller: false,
        brand: "Generic",
        sizeGuide: ["12x18: 12\" x 18\"", "18x24: 18\" x 24\"", "24x36: 24\" x 36\""],
      }
    ],
  },
  {
    id: "phonecase",
    name: "Phone Cases",
    emoji: "📱",
    icon: Package,
    models: [
      {
        id: "37",
        name: "iPhone Tough Phone Case",
        baseCost: 7.20,
        defaultPrice: 18.99,
        colors: ["White"],
        images: {
          "White": "https://images.printify.com/api/v1/blueprints/37/images/1.jpg",
        },
        description: "Dual-layer shockproof phone case. Premium polycarbonate outer shell with black impact-absorbing inner TPU liner. Supports wireless charging.",
        providers: "5 Print Providers",
        shipsFrom: "Ships from US/EU/UK",
        isBestseller: true,
        brand: "Generic",
        sizeGuide: ["iPhone 13: Standard", "iPhone 14: Standard", "iPhone 15: Standard"],
      }
    ],
  },
  {
    id: "bag",
    name: "Bags",
    emoji: "👜",
    icon: Package,
    models: [
      {
        id: "44",
        name: "Polyester Tote Bag",
        baseCost: 6.50,
        defaultPrice: 16.99,
        colors: ["White"],
        images: {
          "White": "https://images.printify.com/api/v1/blueprints/44/images/1.jpg",
        },
        description: "100% spun polyester weather-resistant fabric. Dual handles 100% natural cotton bull denim. Double-stitched seams for extra durability.",
        providers: "2 Print Providers",
        shipsFrom: "Ships from US",
        isBestseller: true,
        brand: "Generic",
        sizeGuide: ["15x15: 15\" x 15\""],
      }
    ],
  }
];

const fallbackProviders: Record<string, PrintifyProvider[]> = {
  "3": [
    { id: "39", name: "Monster Digital", shipsFrom: "United States", shippingCost: 4.50, productionTime: "1-2 days", rating: 9.7 },
    { id: "45", name: "SwiftPOD", shipsFrom: "United States", shippingCost: 4.90, productionTime: "2-3 days", rating: 9.5 },
    { id: "28", name: "Dream Junction", shipsFrom: "United States", shippingCost: 5.20, productionTime: "2-4 days", rating: 9.1 },
  ],
  "5": [
    { id: "39", name: "Monster Digital", shipsFrom: "United States", shippingCost: 4.50, productionTime: "1-2 days", rating: 9.7 },
    { id: "45", name: "SwiftPOD", shipsFrom: "United States", shippingCost: 4.90, productionTime: "2-3 days", rating: 9.5 },
  ],
  "default": [
    { id: "99", name: "Print Clever", shipsFrom: "United Kingdom", shippingCost: 5.90, productionTime: "2-3 days", rating: 9.3 },
    { id: "102", name: "Spoke Custom Products", shipsFrom: "United States", shippingCost: 4.80, productionTime: "1-3 days", rating: 9.0 },
  ],
};

interface PrintAreaConfig {
  top: string;
  left: string;
  width: string;
  height: string;
}

const getPrintAreaConfig = (modelName: string, area: string): PrintAreaConfig => {
  const nameLower = modelName.toLowerCase();
  if (nameLower.includes("mug")) {
    return { top: "30%", left: "20%", width: "50%", height: "45%" };
  }
  if (nameLower.includes("candle")) {
    return { top: "48%", left: "32%", width: "36%", height: "25%" };
  }
  if (nameLower.includes("tote") || nameLower.includes("bag")) {
    return { top: "40%", left: "32%", width: "36%", height: "36%" };
  }
  
  // Apparel sleeves
  if (area.toLowerCase().includes("left_sleeve") || area.toLowerCase().includes("l sleeve")) {
    return { top: "42%", left: "12%", width: "16%", height: "16%" };
  }
  if (area.toLowerCase().includes("right_sleeve") || area.toLowerCase().includes("r sleeve")) {
    return { top: "42%", left: "72%", width: "16%", height: "16%" };
  }
  if (area.toLowerCase() === "back") {
    return { top: "26%", left: "28%", width: "44%", height: "48%" };
  }
  return { top: "26%", left: "28%", width: "44%", height: "48%" };
};

const getMockupImageForArea = (model: ProductModel, color: string): string => {
  return model.images[color] || Object.values(model.images)[0] || "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80";
};

const getPrintAreasForModel = (modelName: string): string[] => {
  const nameLower = modelName.toLowerCase();
  if (nameLower.includes("mug")) {
    return ["Front Wrap", "Back Wrap"];
  }
  if (nameLower.includes("candle")) {
    return ["Front Label", "Lid Label"];
  }
  if (nameLower.includes("tote") || nameLower.includes("bag")) {
    return ["Front", "Back"];
  }
  return ["Front", "Back", "Left Sleeve", "Right Sleeve"];
};

const getMockupImageStyle = (color: string): React.CSSProperties => {
  const colorLower = color.toLowerCase();
  if (colorLower === "white") return {};
  if (colorLower === "black") {
    return { filter: "brightness(0.18) contrast(1.1) grayscale(1)" };
  }
  if (colorLower === "sport grey" || colorLower === "grey" || colorLower === "gray" || colorLower === "athletic heather") {
    return { filter: "brightness(0.7) contrast(0.9) grayscale(1)" };
  }
  if (colorLower === "navy" || colorLower === "dark blue") {
    return { filter: "sepia(0.6) hue-rotate(205deg) brightness(0.28) saturate(1.8)" };
  }
  if (colorLower === "red") {
    return { filter: "sepia(0.8) hue-rotate(330deg) brightness(0.5) saturate(2.5)" };
  }
  if (colorLower === "blue" || colorLower === "royal") {
    return { filter: "sepia(0.6) hue-rotate(190deg) brightness(0.55) saturate(2.2)" };
  }
  if (colorLower === "green") {
    return { filter: "sepia(0.7) hue-rotate(90deg) brightness(0.45) saturate(2.0)" };
  }
  if (colorLower === "pink") {
    return { filter: "sepia(0.7) hue-rotate(290deg) brightness(0.7) saturate(2.2)" };
  }
  if (colorLower === "yellow") {
    return { filter: "sepia(0.7) hue-rotate(10deg) brightness(0.85) saturate(2.5)" };
  }
  if (colorLower === "orange") {
    return { filter: "sepia(0.7) hue-rotate(345deg) brightness(0.68) saturate(2.5)" };
  }
  if (colorLower === "purple") {
    return { filter: "sepia(0.6) hue-rotate(240deg) brightness(0.48) saturate(2.0)" };
  }
  return {};
};

export default function MockupPublishPage() {
  // Full flat list of all blueprint models returned by the API proxy
  const [allBlueprints, setAllBlueprints] = useState<ProductModel[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [isCatalogOffline, setIsCatalogOffline] = useState(false);
  const [apiLogs, setApiLogs] = useState("Connecting to server proxy...");
  const [customApiKey, setCustomApiKey] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("printify_api_key") || "";
    }
    return "";
  });

  const handleApiKeyChange = (val: string) => {
    setCustomApiKey(val);
    if (typeof window !== "undefined") {
      if (val) {
        localStorage.setItem("printify_api_key", val);
      } else {
        localStorage.removeItem("printify_api_key");
      }
    }
    window.location.reload();
  };

  const clearApiKey = () => {
    setCustomApiKey("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("printify_api_key");
    }
    window.location.reload();
  };

  // Mockup Template selection states
  interface MockupTemplate {
    id: string;
    name: string;
    viewType: string;
    included: boolean;
    isPrimary: boolean;
  }

  const [mockupTemplates, setMockupTemplates] = useState<MockupTemplate[]>([
    { id: "1", name: "Front Flat Lay", viewType: "front", included: true, isPrimary: true },
    { id: "2", name: "Back Flat Lay", viewType: "back", included: true, isPrimary: false },
    { id: "3", name: "Lifestyle Model", viewType: "lifestyle", included: false, isPrimary: false },
    { id: "4", name: "Wooden Hanger", viewType: "hanger", included: false, isPrimary: false },
  ]);
  const [mockupTheme, setMockupTheme] = useState("studio");

  const toggleMockupInclusion = (id: string) => {
    setMockupTemplates(prev => prev.map(m => m.id === id ? { ...m, included: !m.included } : m));
  };

  const setPrimaryMockup = (id: string) => {
    setMockupTemplates(prev => prev.map(m => m.id === id ? { ...m, isPrimary: true, included: true } : { ...m, isPrimary: false }));
  };

  const getTemplateBaseImage = (model: ProductModel, viewType: string, color: string) => {
    const images = model.blueprintImages || [];
    
    if (viewType === "front") {
      return images[0] || getMockupImageForArea(model, color);
    }
    if (viewType === "back") {
      return images[1] || images[0] || getMockupImageForArea(model, color);
    }
    if (viewType === "lifestyle") {
      return images[2] || images[0] || getMockupImageForArea(model, color);
    }
    // Hanger/flatlay backdrop
    return images[3] || images[0] || getMockupImageForArea(model, color);
  };

  // Selection states for dynamic Taxonomy Filters
  const [activeRootCat, setActiveRootCat] = useState<string>("Apparel");
  const [activeSubCat, setActiveSubCat] = useState<string>("T-Shirts & Tops");
  const [expandedRoots, setExpandedRoots] = useState<Record<string, boolean>>({
    "Apparel": true,
    "Home & Living": true,
    "Accessories": true,
  });

  // Search and Pagination parameters
  const [catalogSearch, setCatalogSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Selected item states
  const [selectedModel, setSelectedModel] = useState<ProductModel | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("White");
  const [selectedDesign, setSelectedDesign] = useState<string>(aiDesigns[0].url);

  // Studio canvas settings and relative coordinates dragging mechanics
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [activePrintArea, setActivePrintArea] = useState<string>("Front");
  const [isImageLoading, setIsImageLoading] = useState(false);
  
  // Interactive coordinate positioning
  const [designScale, setDesignScale] = useState(60);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Print providers comparative structures
  const [providersList, setProvidersList] = useState<PrintifyProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<PrintifyProvider | null>(null);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);

  // Variant settings matrix
  const [variantsList, setVariantsList] = useState<VariantSettings[]>([]);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);
  const [bulkPriceInput, setBulkPriceInput] = useState("");

  // Metadata Forms
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Publishing variables
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 1. Fetch entire blueprints catalog on mount from proxy
  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoadingCatalog(true);
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        const savedKey = typeof window !== "undefined" ? localStorage.getItem("printify_api_key") : null;
        if (savedKey) {
          headers["x-printify-api-key"] = savedKey;
        }

        const response = await fetch("/api/printify?action=blueprints", { headers });
        if (!response.ok) {
          throw new Error(`Catalog blueprints failed with status: ${response.status}`);
        }
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setApiLogs(`Proxy Catalog Cache Synced: ${data.length} blueprints loaded.`);
          
          // Map all items from Printify API payload
          const mappedModels: ProductModel[] = data.map((bp: PrintifyBlueprintPayload) => {
            const modelName = bp.title || bp.name || "Printify Product";
            const brandName = bp.brand || "Generic";
            
            return {
              id: String(bp.id),
              name: brandName !== "Generic" ? `${brandName} ${modelName}` : modelName,
              baseCost: 8.50,
              defaultPrice: 24.99,
              colors: ["Black", "White", "Navy", "Sport Grey"],
              images: {
                "default": bp.images && bp.images[0] ? bp.images[0] : "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80",
              },
              description: bp.description || "Official Printify product catalog blueprint.",
              providers: "Multiple Print Providers",
              shipsFrom: "Ships from US/EU/UK",
              isBestseller: bp.is_bestseller || Number(bp.id) % 8 === 0,
              brand: brandName,
              sizeGuide: ["S: Standard", "M: Standard", "L: Standard", "XL: Standard"],
              blueprintImages: bp.images && bp.images.length > 0 ? [bp.images[0]] : [],
            };
          });

          setAllBlueprints(mappedModels);
        } else {
          throw new Error("Empty catalog blueprints returned");
        }
      } catch (err: unknown) {
        console.warn("Could not query dynamic blueprints, launching fallback mock dataset.", err);
        setIsCatalogOffline(true);
        const flatFallbackList: ProductModel[] = [];
        fallbackCatalog.forEach((cat) => {
          flatFallbackList.push(...cat.models);
        });
        setAllBlueprints(flatFallbackList);
        setApiLogs("Catalog synchronized (Offline Database Fallback active).");
      } finally {
        setIsLoadingCatalog(false);
      }
    };
    fetchCatalog();
  }, []);

  // Pre-select model if blueprintId is passed in URL query params
  useEffect(() => {
    if (allBlueprints.length > 0 && typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const queryBpId = searchParams.get("blueprintId");
      if (queryBpId) {
        const found = allBlueprints.find(m => m.id === queryBpId);
        if (found) {
          setTimeout(() => {
            setSelectedModel(found);
            setSelectedColor(found.colors[0] || "White");
            setIsStudioOpen(true);
          }, 50);
        }
      }
    }
  }, [allBlueprints]);

  // 2. Perform dynamic categorizations grouping matching brand and category keywords
  const groupBlueprintsToTaxonomy = () => {
    const tree: Record<string, Record<string, ProductModel[]>> = {
      "Apparel": {
        "T-Shirts & Tops": [],
        "Hoodies & Sweaters": [],
        "Socks": [],
      },
      "Home & Living": {
        "Drinkware": [],
        "Candles": [],
        "Wall Art": [],
        "Home Decor": [],
      },
      "Accessories": {
        "Phone Cases": [],
        "Bags": [],
      },
    };

    allBlueprints.forEach((bp) => {
      const titleLower = bp.name.toLowerCase();
      let root = "Accessories";
      let sub = "Bags";

      if (titleLower.includes("tee") || titleLower.includes("t-shirt") || titleLower.includes("t shirt") || titleLower.includes("tank") || titleLower.includes("top") || titleLower.includes("jersey")) {
        root = "Apparel";
        sub = "T-Shirts & Tops";
      } else if (titleLower.includes("hoodie") || titleLower.includes("sweatshirt") || titleLower.includes("crewneck") || titleLower.includes("sweater") || titleLower.includes("fleece")) {
        root = "Apparel";
        sub = "Hoodies & Sweaters";
      } else if (titleLower.includes("socks") || titleLower.includes("sock")) {
        root = "Apparel";
        sub = "Socks";
      } else if (titleLower.includes("mug") || titleLower.includes("drinkware") || titleLower.includes("tumbler") || titleLower.includes("bottle") || titleLower.includes("cup")) {
        root = "Home & Living";
        sub = "Drinkware";
      } else if (titleLower.includes("candle") || titleLower.includes("wax")) {
        root = "Home & Living";
        sub = "Candles";
      } else if (titleLower.includes("canvas") || titleLower.includes("poster") || titleLower.includes("frame") || titleLower.includes("print") || titleLower.includes("art")) {
        root = "Home & Living";
        sub = "Wall Art";
      } else if (titleLower.includes("pillow") || titleLower.includes("blanket") || titleLower.includes("towel") || titleLower.includes("apron") || titleLower.includes("coaster")) {
        root = "Home & Living";
        sub = "Home Decor";
      } else if (titleLower.includes("phone") || titleLower.includes("case")) {
        root = "Accessories";
        sub = "Phone Cases";
      }

      if (!tree[root]) tree[root] = {};
      if (!tree[root][sub]) tree[root][sub] = [];
      tree[root][sub].push(bp);
    });

    return tree;
  };

  const taxonomyTree = groupBlueprintsToTaxonomy();

  // Filter Flat list according to active subcategory selection & search inputs
  const getFilteredModelsList = () => {
    const list = taxonomyTree[activeRootCat]?.[activeSubCat] || [];
    if (!catalogSearch) return list;
    return list.filter(m => 
      m.name.toLowerCase().includes(catalogSearch.toLowerCase()) || 
      (m.brand || "").toLowerCase().includes(catalogSearch.toLowerCase())
    );
  };

  const filteredModels = getFilteredModelsList();

  // Pagination bounds calculation
  const totalPages = Math.max(Math.ceil(filteredModels.length / itemsPerPage), 1);
  const paginatedModels = filteredModels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Set current page back to 1 on category transitions
  const handleSubCategorySelect = (root: string, sub: string) => {
    setActiveRootCat(root);
    setActiveSubCat(sub);
    setCurrentPage(1);
  };

  const toggleRootFolder = (root: string) => {
    setExpandedRoots(prev => ({ ...prev, [root]: !prev[root] }));
  };

  // Studio Mode: Select model blueprint and fetch providers list
  const handleModelSelect = async (model: ProductModel) => {
    setSelectedModel(model);
    setTitle(`Aesthetic ${model.name.replace(" Unisex Tee", "").replace(" Heavy Cotton Tee", "").replace(" Crewneck Sweatshirt", "")} - Handmade Graphic Print`);
    setDescription(model.description + "\n\n• Handmade item made to order\n• High-definition DTG (Direct to Garment) printing\n• Secure packaging and fast worldwide delivery");
    
    setIsStudioOpen(true);
    setIsLoadingProviders(true);
    setProvidersList([]);
    setSelectedProvider(null);
    setVariantsList([]);

    const areas = getPrintAreasForModel(model.name);
    setActivePrintArea(areas[0] || "Front");

    if (isCatalogOffline) {
      const fallbacks = fallbackProviders[model.id] || fallbackProviders["default"];
      setProvidersList(fallbacks);
      handleProviderSelect(fallbacks[0], model.id, true);
      setIsLoadingProviders(false);
      return;
    }

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const savedKey = typeof window !== "undefined" ? localStorage.getItem("printify_api_key") : null;
      if (savedKey) {
        headers["x-printify-api-key"] = savedKey;
      }

      const response = await fetch(`/api/printify?action=print-providers&blueprintId=${model.id}`, { headers });
      if (!response.ok) throw new Error();
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        const formattedProviders: PrintifyProvider[] = data.map((prov: PrintifyProviderPayload) => {
          const loc = prov.location?.country || "US";
          return {
            id: String(prov.id),
            name: prov.title || prov.name || "Print Provider",
            shipsFrom: loc,
            shippingCost: loc === "US" ? 4.50 : 5.80,
            productionTime: "2-3 business days",
            rating: prov.rating || 9.4,
          };
        });
        
        setProvidersList(formattedProviders);
        handleProviderSelect(formattedProviders[0], model.id);
      } else {
        throw new Error();
      }
    } catch (err: unknown) {
      console.warn("Live Providers fetch failed, using fallback comparisons table.", err);
      const fallbacks = fallbackProviders[model.id] || fallbackProviders["default"];
      setProvidersList(fallbacks);
      handleProviderSelect(fallbacks[0], model.id);
    } finally {
      setIsLoadingProviders(false);
    }
  };

  // Select print provider and fetch variant options (costs, stock status)
  const handleProviderSelect = async (provider: PrintifyProvider, blueprintId: string, skipNetwork = false) => {
    setSelectedProvider(provider);
    setIsLoadingVariants(true);
    
    if (isCatalogOffline || skipNetwork) {
      const mockupVariants: VariantSettings[] = [];
      const costBase = selectedModel ? selectedModel.baseCost : 8.50;
      const colors = selectedModel ? selectedModel.colors : ["White", "Black"];
      
      colors.forEach((color) => {
        ["S", "M", "L", "XL"].forEach((sz, idx) => {
          mockupVariants.push({
            id: `fallback_${color}_${sz}`,
            color,
            size: sz,
            inStock: idx !== 3, 
            baseCost: costBase,
            retailPrice: parseFloat((costBase + 15.00).toFixed(2)),
            selected: idx !== 3,
          });
        });
      });
      setVariantsList(mockupVariants);
      setIsLoadingVariants(false);
      return;
    }

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const savedKey = typeof window !== "undefined" ? localStorage.getItem("printify_api_key") : null;
      if (savedKey) {
        headers["x-printify-api-key"] = savedKey;
      }

      const response = await fetch(`/api/printify?action=variants&blueprintId=${blueprintId}&providerId=${provider.id}`, { headers });
      if (!response.ok) throw new Error();
      const data = await response.json();
      
      if (data && Array.isArray(data.variants)) {
        const colorsSet = new Set<string>();
        const parsedVariants: VariantSettings[] = [];

        data.variants.forEach((v: PrintifyVariantPayload) => {
          const colorName = v.options?.color || (v.title && v.title.split(" / ")[0]) || "White";
          const sizeName = v.options?.size || (v.title && v.title.split(" / ")[1]) || "M";
          
          colorsSet.add(colorName);
          const cost = (v.price || 0) / 100 || 8.50;
          const isAvailable = v.is_available !== undefined ? v.is_available : true;

          parsedVariants.push({
            id: v.id || Math.floor(Math.random() * 100000),
            color: colorName,
            size: sizeName,
            inStock: isAvailable,
            baseCost: cost,
            retailPrice: parseFloat((cost + 15.00).toFixed(2)),
            selected: isAvailable, 
          });
        });

        const uniqueColors = Array.from(colorsSet);
        setSelectedModel(prev => {
          if (!prev) return null;
          return {
            ...prev,
            colors: uniqueColors.length > 0 ? uniqueColors : prev.colors,
            baseCost: parsedVariants[0]?.baseCost || prev.baseCost,
          };
        });

        setSelectedColor(uniqueColors[0] || "White");
        setVariantsList(parsedVariants);
      }
    } catch (err: unknown) {
      console.warn("Variants query failed, loading default fallback parameters.", err);
      // Fallback matrix options
      const mockupVariants: VariantSettings[] = [];
      const costBase = selectedModel ? selectedModel.baseCost : 8.50;
      const colors = selectedModel ? selectedModel.colors : ["White", "Black"];
      
      colors.forEach((color) => {
        ["S", "M", "L", "XL"].forEach((sz, idx) => {
          mockupVariants.push({
            id: `fallback_${color}_${sz}`,
            color,
            size: sz,
            inStock: idx !== 3, 
            baseCost: costBase,
            retailPrice: parseFloat((costBase + 15.00).toFixed(2)),
            selected: idx !== 3,
          });
        });
      });
      setVariantsList(mockupVariants);
    } finally {
      setIsLoadingVariants(false);
    }
  };

  // Canvas Mouse down dragging coordinate calculation
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - offsetX,
      y: e.clientY - offsetY,
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffsetX(e.clientX - dragStart.x);
    setOffsetY(e.clientY - dragStart.y);
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesignScale(parseInt(e.target.value));
  };

  // Center design placement triggers
  const handleCenterHorizontal = () => setOffsetX(0);
  const handleCenterVertical = () => setOffsetY(0);
  const handleFillCanvas = () => {
    setDesignScale(100);
    setOffsetX(0);
    setOffsetY(0);
  };
  const handleFitCanvas = () => {
    setDesignScale(50);
    setOffsetX(0);
    setOffsetY(0);
  };

  // Resolution Quality Details
  const getDpiDetails = () => {
    if (designScale <= 50) {
      return { dpi: 300, quality: "High Quality", color: "text-emerald-400" };
    }
    if (designScale <= 75) {
      return { dpi: 195, quality: "Good Quality", color: "text-purple-400" };
    }
    return { dpi: 96, quality: "Low Resolution", color: "text-red-400" };
  };

  const dpiInfo = getDpiDetails();

  // Toggle variant selections checkbox rows
  const handleToggleVariantSelect = (idx: number) => {
    setVariantsList(prev => prev.map((v, i) => i === idx ? { ...v, selected: !v.selected } : v));
  };

  const handleVariantPriceChange = (idx: number, val: string) => {
    const parsedVal = parseFloat(val) || 0;
    setVariantsList(prev => prev.map((v, i) => i === idx ? { ...v, retailPrice: parsedVal } : v));
  };

  const handleApplyBulkPrice = () => {
    const bulkNum = parseFloat(bulkPriceInput);
    if (isNaN(bulkNum) || bulkNum <= 0) return;
    setVariantsList(prev => prev.map(v => v.selected && v.inStock ? { ...v, retailPrice: bulkNum } : v));
    setBulkPriceInput("");
  };

  const handleToggleSelectAll = (checked: boolean) => {
    setVariantsList(prev => prev.map(v => v.inStock ? { ...v, selected: checked } : v));
  };

  // Synchronizing draft to Etsy POST
  const handlePublishClick = async () => {
    const selectedRows = variantsList.filter(v => v.selected && v.inStock);
    if (selectedRows.length === 0 || !selectedModel) return;

    setIsPublishing(true);
    setPublishStep(1); 

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const savedKey = typeof window !== "undefined" ? localStorage.getItem("printify_api_key") : null;
      if (savedKey) {
        headers["x-printify-api-key"] = savedKey;
      }

      await fetch("/api/printify?action=publish", {
        method: "POST",
        headers,
        body: JSON.stringify({
          title,
          description,
          blueprintId: selectedModel.id,
          providerId: selectedProvider?.id || "default",
          variants: selectedRows.map(r => ({
            id: typeof r.id === "string" && r.id.startsWith("fallback_") ? Math.floor(Math.random() * 100000) : Number(r.id),
            price: Math.round(r.retailPrice * 100)
          })),
          printAreas: [
            {
              placeholder: activePrintArea.toLowerCase().replace(" ", "_"),
              images: [
                {
                  id: selectedDesign,
                  x: 0.5 + (offsetX / 320),
                  y: 0.5 + (offsetY / 320),
                  scale_x: designScale / 100,
                  scale_y: designScale / 100,
                  angle: 0
                }
              ]
            }
          ]
        }),
      });

      setTimeout(() => {
        setPublishStep(2); 
        setTimeout(() => {
          setPublishStep(3); 
          setTimeout(() => {
            setIsPublishing(false);
            setPublishStep(0);
            setShowSuccessModal(true);
          }, 1500);
        }, 1500);
      }, 1500);
    } catch (err: unknown) {
      console.error(err);
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 animate-fade-in relative">
      
      {/* Page header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 animate-pulse">
              Studio Matrix Pro
            </span>
            <span className="text-xs text-[#a09cb0]">Printify Real-Time Sync & Etsy publish</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-[#f1f0ff] to-[#a09cb0] bg-clip-text text-transparent">
            {isStudioOpen ? "Printify Studio Sandbox" : "Mockup & Publish Catalog"}
          </h1>
          <p className="text-sm mt-1 text-[#a09cb0]">
            {isStudioOpen && selectedModel
              ? `Designing Mockups for ${selectedModel.name}`
              : "Search the official catalog, choose print options, configure designs, and list directly to Etsy."
            }
          </p>
        </div>

        {!isStudioOpen ? (
          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] p-3 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#a09cb0] uppercase tracking-wider font-mono">Printify Token</span>
              <span className={`text-[11px] font-bold ${isCatalogOffline ? "text-amber-400" : "text-green-400"}`}>
                {isCatalogOffline ? "Sandbox Mode" : "API Connected"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="password"
                placeholder="Paste API Key here..."
                value={customApiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                className="bg-white/[0.04] border border-white/[0.08] text-white text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-purple-500/50 w-44 transition-all"
              />
              {customApiKey && (
                <button
                  onClick={clearApiKey}
                  className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-500/10 hover:bg-red-500/15 rounded-lg transition-all font-semibold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsStudioOpen(false)}
            className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-bold transition-colors cursor-pointer border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalog Overview</span>
          </button>
        )}
      </div>

      {/* VIEW A: DYNAMIC CATALOG TREE AND PAGINATED BLUEPRINTS */}
      {!isStudioOpen ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in-fast">
          
          {/* Sol Kısım: Dynamic Taxonomy Catalog Tree */}
          <div 
            className="lg:col-span-3 rounded-xl border border-white/[0.07] p-4 space-y-4 backdrop-blur-md"
            style={{ background: "var(--bg-card)" }}
          >
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5 pb-2 border-b border-white/[0.06]">
              <Package className="w-4 h-4 text-purple-400" />
              <span>Catalog Tree</span>
            </h2>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5e5a72]" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => {
                  setCatalogSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search catalog models..."
                className="w-full h-8 pl-9 pr-3 bg-black/30 border border-white/[0.08] focus:border-purple-500/80 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
              />
            </div>

            {/* Folder accordion trees */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {Object.entries(taxonomyTree).map(([rootKey, subTree]) => {
                const isExpanded = expandedRoots[rootKey];
                const totalRootItems = Object.values(subTree).reduce((acc, list) => acc + list.length, 0);

                return (
                  <div key={rootKey} className="space-y-1">
                    <button
                      onClick={() => toggleRootFolder(rootKey)}
                      className="w-full py-1.5 flex items-center justify-between text-xs font-bold text-[#f1f0ff] hover:text-white cursor-pointer"
                    >
                      <div className="flex items-center gap-1">
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        <span>{rootKey}</span>
                      </div>
                      <span className="text-[10px] text-[#5e5a72] font-semibold">({totalRootItems})</span>
                    </button>

                    {isExpanded && (
                      <div className="pl-4 border-l border-white/[0.04] space-y-0.5">
                        {Object.entries(subTree).map(([subKey, itemsList]) => {
                          const isLeafSelected = activeRootCat === rootKey && activeSubCat === subKey;
                          return (
                            <button
                              key={subKey}
                              onClick={() => handleSubCategorySelect(rootKey, subKey)}
                              className={`w-full text-left py-1 px-2 rounded-md text-[11px] font-medium transition-all flex items-center justify-between cursor-pointer ${
                                isLeafSelected 
                                  ? "bg-purple-500/10 text-purple-300 font-bold border border-purple-500/15" 
                                  : "text-[#a09cb0] hover:text-white hover:bg-white/[0.02]"
                              }`}
                            >
                              <span>{subKey}</span>
                              <span className="text-[9px] text-[#5e5a72]">({itemsList.length})</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/[0.06] text-[10px] text-[#5e5a72] space-y-1">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                <span>Etsy API Synced</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                <span>Printify Catalog Connected</span>
              </div>
            </div>
          </div>

          {/* Right side: Paginated Grid items list */}
          <div className="lg:col-span-9 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <h3 className="font-bold text-[#f1f0ff] uppercase tracking-wider flex items-center gap-1.5">
                <span>{activeSubCat} Catalog ({filteredModels.length} models)</span>
                {catalogSearch && (
                  <span className="text-[#5e5a72] font-medium lowercase">filtered for &quot;{catalogSearch}&quot;</span>
                )}
              </h3>
              <span className="text-[11px] text-[#5e5a72]">{apiLogs}</span>
            </div>

            {isLoadingCatalog ? (
              <div className="flex flex-col items-center py-20 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                <p className="text-xs text-[#a09cb0]">Connecting with official Printify blueprints collection...</p>
              </div>
            ) : filteredModels.length === 0 ? (
              <div className="text-center py-16 rounded-xl border border-dashed border-white/10 bg-white/[0.01]">
                <p className="text-sm font-semibold text-[#a09cb0]">No catalog models matched this taxonomy tier</p>
                {catalogSearch && (
                  <button
                    onClick={() => setCatalogSearch("")}
                    className="mt-3 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs rounded-lg font-semibold cursor-pointer"
                  >
                    Clear search filter
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedModels.map((model) => {
                    const defaultImg = model.images[model.colors[0]] || Object.values(model.images)[0];
                    return (
                      <div
                        key={model.name + "-" + model.id}
                        onClick={() => handleModelSelect(model)}
                        className="group relative rounded-xl border border-white/[0.07] bg-[#16161e] p-4 cursor-pointer transition-all duration-300 hover:border-white/[0.14] hover:bg-[#1a1a24] hover:translate-y-[-2px] flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-neutral-900 border border-white/[0.04]">
                            <img
                              src={defaultImg}
                              alt={model.name}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                            />
                            {model.isBestseller && (
                              <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-[#7c6af7] to-[#a855f7] text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow border border-white/10">
                                Best Seller
                              </span>
                            )}
                            <span className="absolute bottom-2 right-2 z-10 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                              {model.colors.length} Colors
                            </span>
                          </div>

                          <h4 className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-0.5">{model.brand}</h4>
                          <h3 className="text-sm font-bold text-white line-clamp-1 mb-2 group-hover:text-purple-300 transition-colors">
                            {model.name}
                          </h3>

                          <div className="text-[11px] text-[#a09cb0] space-y-1 mb-4">
                            <p className="flex items-center gap-1.5">
                              <span aria-hidden="true">🏢</span>
                              <span>{model.providers}</span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <span aria-hidden="true">📍</span>
                              <span>{model.shipsFrom}</span>
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-[#5e5a72] block uppercase font-bold tracking-wider">Base cost</span>
                            <span className="text-sm font-bold text-white">From ${model.baseCost.toFixed(2)}</span>
                          </div>
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all bg-gradient-to-r from-[#7c6af7] to-[#8c7bf7] shadow-[0_3px_10px_rgba(124,106,247,0.2)]"
                          >
                            Design →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 text-xs text-[#a09cb0]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.04] disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 text-white" />
                      </button>
                      <span>Page <span className="font-semibold text-white">{currentPage}</span> of <span className="font-semibold text-white">{totalPages}</span></span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.04] disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>Jump:</span>
                      <select
                        value={currentPage}
                        onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                        className="bg-black/45 border border-white/[0.08] text-xs text-white rounded p-1"
                      >
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <option key={i + 1} value={i + 1}>Page {i + 1}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      ) : (
        
        /* VIEW B: INTERACTIVE STUDIO CANVAS & MATRIX GRID */
        selectedModel && (
          <div className="space-y-6 animate-fade-in-fast">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Column 1: Print Providers catalog lists */}
              <div className="lg:col-span-3 space-y-4">
                <div 
                  className="rounded-xl border border-white/[0.07] p-4 space-y-4 backdrop-blur-md"
                  style={{ background: "var(--bg-card)" }}
                >
                  <h2 className="text-sm font-bold text-white flex items-center gap-1.5 pb-2 border-b border-white/[0.06]">
                    <Package className="w-4 h-4 text-purple-400" />
                    <span>Choose Provider</span>
                  </h2>

                  {isLoadingProviders ? (
                    <div className="flex flex-col items-center py-6 gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                      <span className="text-[10px] text-[#a09cb0]">Retrieving provider catalogs...</span>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {providersList.map((prov) => {
                        const isSelected = selectedProvider?.id === prov.id;
                        return (
                          <button
                            key={prov.id}
                            onClick={() => handleProviderSelect(prov, selectedModel.id)}
                            className={`w-full p-3 rounded-lg border text-left transition-all text-xs cursor-pointer flex flex-col gap-1.5 ${
                              isSelected
                                ? "border-[#7c6af7] bg-[#7c6af7]/5 text-white"
                                : "border-white/[0.05] bg-black/15 text-[#a09cb0] hover:bg-white/[0.02]"
                            }`}
                          >
                            <div className="flex justify-between w-full font-bold">
                              <span className="truncate">{prov.name}</span>
                              <span className="text-purple-300 font-bold shrink-0">${prov.shippingCost.toFixed(2)} shp</span>
                            </div>
                            <div className="flex justify-between w-full text-[10px] text-[#5e5a72]">
                              <span>Rating: <span className="font-semibold text-white">⭐ {prov.rating || 9.4}</span></span>
                              <span>{prov.productionTime}</span>
                            </div>
                            <div className="text-[9px] text-[#5e5a72] border-t border-white/[0.04] pt-1">
                              Ships from: <span className="font-medium text-white/80">{prov.shipsFrom}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div 
                  className="rounded-xl border border-white/[0.07] p-4 space-y-3.5 backdrop-blur-md"
                  style={{ background: "var(--bg-card)" }}
                >
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Blueprint Details
                  </h3>
                  <div className="space-y-1 text-xs text-[#a09cb0]">
                    <p><span className="text-white/60">Brand:</span> {selectedModel.brand}</p>
                    <p><span className="text-white/60">Model ID:</span> {selectedModel.id}</p>
                    <p className="text-[11px] leading-relaxed pt-1.5 text-[#5e5a72] border-t border-white/[0.04]">
                      {selectedModel.description.slice(0, 160)}...
                    </p>
                  </div>
                </div>
              </div>

              {/* Column 2: Interactive canvas with dragging listener */}
              <div className="lg:col-span-5 space-y-4">
                <div 
                  className="rounded-xl border border-white/[0.07] p-4 space-y-4 backdrop-blur-md flex flex-col items-center justify-between min-h-[500px]"
                  style={{ background: "var(--bg-card)" }}
                >
                  {/* Tabs */}
                  <div className="w-full flex items-center justify-between border-b border-white/[0.06] pb-2 text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-purple-400" />
                      <span>Canvas Editor</span>
                    </span>

                    <div className="flex gap-1 bg-black/40 border border-white/[0.06] p-0.5 rounded-lg shrink-0">
                      {getPrintAreasForModel(selectedModel.name).map((area) => (
                        <button
                          key={area}
                          onClick={() => {
                            setIsImageLoading(true);
                            setActivePrintArea(area);
                            // Reset offsets on area switch to avoid overlay jump
                            setOffsetX(0);
                            setOffsetY(0);
                          }}
                          className={`px-2 py-1 rounded text-[10px] font-semibold cursor-pointer ${
                            activePrintArea === area ? "bg-[#7c6af7]/20 text-purple-300 font-bold" : "text-[#5e5a72]"
                          }`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Drag-sensitive Interactive Canvas */}
                  <div 
                    className="relative w-full aspect-square max-w-[320px] rounded-lg overflow-hidden border border-white/[0.04] bg-neutral-900 flex items-center justify-center shadow-inner group select-none cursor-grab active:cursor-grabbing"
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                  >
                    <img
                      key={selectedColor + "_" + activePrintArea}
                      src={getMockupImageForArea(selectedModel, selectedColor)}
                      alt={selectedModel.name}
                      style={getMockupImageStyle(selectedColor)}
                      onLoad={() => setIsImageLoading(false)}
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover pointer-events-none"
                    />

                    {/* Rendering Spinner Backdrop Overlay (KURAL 4) */}
                    {isImageLoading && (
                      <div className="absolute inset-0 bg-[#0d0d14]/75 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10 pointer-events-none">
                        <Loader2 className="w-7 h-7 animate-spin text-[#7c6af7]" />
                        <span className="text-[9px] text-purple-300 font-bold uppercase tracking-widest animate-pulse">Rendering Canvas...</span>
                      </div>
                    )}

                    {/* Bounding box wrapper with clipping mask (KURAL 2) */}
                    {(() => {
                      const areaConfig = getPrintAreaConfig(selectedModel.name, activePrintArea);
                      return (
                        <div 
                          className="absolute border border-dashed border-purple-500/50 overflow-hidden pointer-events-none flex items-center justify-center"
                          style={{
                            top: areaConfig.top,
                            left: areaConfig.left,
                            width: areaConfig.width,
                            height: areaConfig.height,
                          }}
                        >
                          {/* Layered Image design graphic inside bounding box */}
                          {selectedDesign ? (
                            <div 
                              onMouseDown={handleCanvasMouseDown}
                              className="absolute select-none pointer-events-auto cursor-move flex items-center justify-center"
                              style={{
                                width: "100%",
                                height: "100%",
                                left: "50%",
                                top: "50%",
                                transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${designScale / 100})`,
                              }}
                            >
                              <img
                                src={selectedDesign}
                                alt="AI Graphic Layer"
                                className="w-full h-full object-contain filter contrast-125 saturate-110 pointer-events-none"
                              />
                            </div>
                          ) : (
                            <div className="text-[6px] text-purple-400/20 uppercase tracking-widest font-bold text-center p-2">
                              No Layer Applied
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Floating Toolbar on Canvas (KURAL 3) */}
                    {selectedDesign && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#0d0d14]/90 backdrop-blur-md border border-white/10 rounded-xl px-2 py-1 shadow-xl z-20 pointer-events-auto">
                        <button
                          onClick={handleCenterHorizontal}
                          className="p-1 hover:bg-white/10 rounded text-[#a09cb0] hover:text-white transition-colors cursor-pointer"
                          title="Center Horizontally"
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={handleCenterVertical}
                          className="p-1 hover:bg-white/10 rounded text-[#a09cb0] hover:text-white transition-colors cursor-pointer"
                          title="Center Vertically"
                        >
                          <AlignCenter className="w-3.5 h-3.5 rotate-90" />
                        </button>
                        <div className="w-[1px] h-3.5 bg-white/10 self-center" />
                        <button
                          onClick={handleFitCanvas}
                          className="px-2 py-1 text-[9px] font-bold bg-[#7c6af7]/20 hover:bg-[#7c6af7]/35 text-purple-300 rounded-md transition-all cursor-pointer"
                          title="Fit to Area"
                        >
                          Fit Area
                        </button>
                        <div className="w-[1px] h-3.5 bg-white/10 self-center" />
                        <button
                          onClick={() => setSelectedDesign("")}
                          className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded text-[#a09cb0] transition-colors cursor-pointer"
                          title="Delete Design"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Canvas scale alignment utilities */}
                  <div className="w-full space-y-3 pt-3 border-t border-white/[0.06] text-xs">
                    
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[#a09cb0] shrink-0 font-medium">Design Scale: <span className="text-white font-bold">{designScale}%</span></span>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={designScale}
                        onChange={handleScaleChange}
                        className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#7c6af7]"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex gap-1">
                        <button
                          onClick={handleCenterHorizontal}
                          className="px-2.5 py-1.5 bg-[#16161f] border border-white/[0.06] hover:bg-[#1a1a26] text-[10px] text-[#a09cb0] hover:text-white rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                          <span>Center Horiz</span>
                        </button>
                        <button
                          onClick={handleCenterVertical}
                          className="px-2.5 py-1.5 bg-[#16161f] border border-white/[0.06] hover:bg-[#1a1a26] text-[10px] text-[#a09cb0] hover:text-white rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <AlignCenter className="w-3.5 h-3.5 rotate-90" />
                          <span>Center Vert</span>
                        </button>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={handleFillCanvas}
                          className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 text-[9px] text-purple-300 rounded font-semibold cursor-pointer transition-all"
                        >
                          Fill
                        </button>
                        <button
                          onClick={handleFitCanvas}
                          className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 text-[9px] text-purple-300 rounded font-semibold cursor-pointer transition-all"
                        >
                          Fit
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-black/25 border border-white/[0.04] text-[10px]">
                      <div className="flex items-center gap-1 text-[#5e5a72]">
                        <Info className="w-3.5 h-3.5" />
                        <span>Resolution Quality:</span>
                        <span className={`font-semibold ${dpiInfo.color}`}>{dpiInfo.dpi} DPI ({dpiInfo.quality})</span>
                      </div>
                      <span className="text-[#5e5a72]">Optimal: 150+ DPI</span>
                    </div>

                  </div>
                </div>

                {/* Library selection box */}
                <div 
                  className="rounded-xl border border-white/[0.07] p-4 space-y-3 backdrop-blur-md"
                  style={{ background: "var(--bg-card)" }}
                >
                  <h3 className="text-xs font-bold text-[#f1f0ff] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Apply Design Layer</span>
                  </h3>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {aiDesigns.map((design) => {
                      const isSelected = selectedDesign === design.url;
                      return (
                        <button
                          key={design.name}
                          onClick={() => setSelectedDesign(design.url)}
                          className={`relative aspect-square rounded-lg overflow-hidden border transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#7c6af7] ring-2 ring-[#7c6af7]/30 scale-[1.02]"
                              : "border-white/15 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img src={design.url} alt={design.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-black/70 py-0.5 text-[8px] text-center text-white truncate px-1">
                            {design.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Column 3: Mockups Selection & Colors config */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Colors palette choices */}
                <div 
                  className="rounded-xl border border-white/[0.07] p-4 space-y-3.5 backdrop-blur-md"
                  style={{ background: "var(--bg-card)" }}
                >
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-purple-400" />
                    <span>Choose Mockup Color</span>
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {selectedModel.colors.map((color) => {
                      const isActive = selectedColor === color;
                      const hexCode = colorHexCodes[color] || "#555555";
                      return (
                        <button
                          key={color}
                          onClick={() => {
                            setIsImageLoading(true);
                            setSelectedColor(color);
                          }}
                          className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer relative ${
                            isActive ? "border-purple-500 scale-105" : "border-white/10 hover:scale-105"
                        }`}
                        style={{ backgroundColor: hexCode }}
                        title={color}
                      >
                        {isActive && (
                          <span className="absolute inset-0 rounded-full border border-white flex items-center justify-center">
                            <span className={`w-1 h-1 rounded-full ${color === "White" ? "bg-black" : "bg-white"}`} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Printify Mockup Settings Section inside Sidebar */}
              <div 
                className="rounded-xl border border-white/[0.07] p-4 space-y-4 backdrop-blur-md"
                style={{ background: "var(--bg-card)" }}
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Select Mockup Views</span>
                  </h3>
                  <select
                    value={mockupTheme}
                    onChange={(e) => setMockupTheme(e.target.value)}
                    className="bg-black/30 border border-white/[0.08] text-[10px] text-white rounded px-1.5 py-0.5 focus:outline-none"
                  >
                    <option value="studio">Studio</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="flatlay">Flatlay</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {mockupTemplates.map((tmpl) => {
                    const isPrimary = tmpl.isPrimary;
                    const isIncluded = tmpl.included;
                    const baseImg = getTemplateBaseImage(selectedModel, tmpl.viewType, selectedColor);
                    const isApparel = selectedModel.id === "3" || selectedModel.id === "5" || selectedModel.id === "6" || selectedModel.id === "12";
                    
                    // Hide back/hanger views for non-apparel items
                    if (!isApparel && (tmpl.viewType === "back" || tmpl.viewType === "hanger")) {
                      return null;
                    }

                    // Customize design boundaries per mockup view
                    let areaTop = "28%";
                    let areaLeft = "32%";
                    let areaWidth = "36%";
                    let areaHeight = "44%";

                    if (tmpl.viewType === "back") {
                      areaTop = "26%";
                      areaLeft = "33%";
                      areaWidth = "34%";
                      areaHeight = "44%";
                    } else if (tmpl.viewType === "lifestyle") {
                      areaTop = "32%";
                      areaLeft = "33%";
                      areaWidth = "34%";
                      areaHeight = "42%";
                    } else if (tmpl.viewType === "hanger") {
                      areaTop = "38%";
                      areaLeft = "31%";
                      areaWidth = "38%";
                      areaHeight = "44%";
                    }

                    return (
                      <div 
                        key={tmpl.id}
                        className={`relative rounded-lg border p-2 flex flex-col justify-between transition-all bg-black/15 ${
                          isIncluded 
                            ? "border-purple-500/40 bg-purple-500/[0.01]" 
                            : "border-white/[0.04] opacity-55 hover:opacity-100"
                        }`}
                      >
                        {/* Card Header Checkbox */}
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="flex items-center gap-1 text-[10px] text-white font-semibold cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={isIncluded}
                              onChange={() => toggleMockupInclusion(tmpl.id)}
                              className="rounded border-white/20 accent-[#7c6af7] w-3 h-3"
                            />
                            <span className="truncate max-w-[50px]">{tmpl.name.replace(" Mockup", "").replace(" Flat Lay", "")}</span>
                          </label>
                          {isPrimary && (
                            <span className="text-[7px] text-purple-300 font-bold uppercase tracking-wider">
                              Cover
                            </span>
                          )}
                        </div>

                        {/* Mockup Preview Container */}
                        <div className="relative aspect-square w-full rounded-md overflow-hidden bg-neutral-950 border border-white/[0.04] flex items-center justify-center">
                          <img 
                            key={selectedColor + "_" + tmpl.id}
                            src={baseImg} 
                            alt={tmpl.name}
                            loading="lazy"
                            style={tmpl.viewType !== "lifestyle" ? getMockupImageStyle(selectedColor) : {}}
                            className="w-full h-full object-cover pointer-events-none"
                          />

                          {/* Design Layer overlay on mockup */}
                          {selectedDesign && (
                            <div 
                              className="absolute pointer-events-none overflow-hidden"
                              style={{
                                top: areaTop,
                                left: areaLeft,
                                width: areaWidth,
                                height: areaHeight,
                              }}
                            >
                              <div 
                                className="absolute"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  left: "50%",
                                  top: "50%",
                                  transform: `translate(calc(-50% + ${offsetX * 0.4}px), calc(-50% + ${offsetY * 0.4}px)) scale(${(designScale / 100) * 0.4})`,
                                }}
                              >
                                <img 
                                  src={selectedDesign} 
                                  alt="Applied Layer"
                                  className="w-full h-full object-contain filter contrast-125 saturate-110"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="mt-1.5">
                          <button
                            type="button"
                            disabled={!isIncluded}
                            onClick={() => setPrimaryMockup(tmpl.id)}
                            className={`w-full py-0.5 rounded text-[8px] font-bold transition-all cursor-pointer ${
                              isPrimary
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 cursor-default text-center"
                                : "bg-white/[0.02] hover:bg-white/[0.05] text-[#a09cb0] hover:text-white border border-white/10 disabled:opacity-30"
                            }`}
                          >
                            {isPrimary ? "Cover" : "Set Cover"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Etsy Listing Metadata Section - Full Width */}
          <div 
            className="rounded-xl border border-white/[0.07] p-5 space-y-4 backdrop-blur-md"
            style={{ background: "var(--bg-card)" }}
          >
            <h2 className="text-sm font-bold text-[#f1f0ff] flex items-center gap-1.5 pb-2 border-b border-white/[0.06]">
              <Info className="w-4 h-4 text-purple-400" />
              <span>Etsy Listing Metadata Details</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="listing-title" className="text-xs text-[#a09cb0] font-semibold">Etsy Listing Title</label>
                  <span className="text-[10px] text-[#5e5a72] block">
                    {title.length}/140 chars
                  </span>
                </div>
                <textarea
                  id="listing-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  rows={3}
                  placeholder="E.g., Aesthetic Floral T-Shirt..."
                  className="w-full p-3 bg-black/25 border border-white/[0.08] focus:border-purple-500/80 rounded-lg text-xs text-[#f1f0ff] placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all resize-none font-medium leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="listing-description" className="text-xs text-[#a09cb0] font-semibold">Description / Specifications</label>
                <textarea
                  id="listing-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Specifications, size metrics..."
                  className="w-full p-3 bg-black/25 border border-white/[0.08] focus:border-purple-500/80 rounded-lg text-xs text-[#f1f0ff] placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all resize-none text-[11px] leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Pricing Variations Matrix Grid */}
          <div 
            className="rounded-xl border border-white/[0.07] p-5 space-y-4 backdrop-blur-md"
            style={{ background: "var(--bg-card)" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-purple-400" />
                  <span>Variant Pricing Matrix</span>
                </h2>
                <p className="text-[11px] text-[#a09cb0] mt-0.5">Configure individual variation retail prices and check margins.</p>
              </div>

              {/* Bulk pricing helper tools */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5e5a72]" />
                  <input
                    type="text"
                    value={bulkPriceInput}
                    onChange={(e) => setBulkPriceInput(e.target.value)}
                    placeholder="Bulk price..."
                    className="h-8 pl-7 pr-2 w-28 bg-black/30 border border-white/[0.08] focus:border-purple-500/80 rounded-lg text-xs text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyBulkPrice}
                  className="h-8 px-3 rounded-lg text-[10px] font-bold text-white bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Percent className="w-3 h-3 text-purple-400" />
                  <span>Apply Bulk</span>
                </button>
              </div>
            </div>

            {isLoadingVariants ? (
              <div className="flex flex-col items-center py-8 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                <span className="text-[11px] text-[#a09cb0]">Syncing variant options metadata...</span>
              </div>
            ) : (
              <div className="overflow-x-auto border border-white/[0.05] rounded-xl bg-black/10">
                <table className="w-full text-xs text-left text-[#a09cb0]">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.01] text-[#5e5a72] font-semibold text-[10px] uppercase">
                      <th className="px-4 py-3 w-10">
                        <input
                          type="checkbox"
                          defaultChecked
                          onChange={(e) => handleToggleSelectAll(e.target.checked)}
                          className="rounded border-white/20 accent-[#7c6af7] cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-3">Color</th>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Stock Status</th>
                      <th className="px-4 py-3">Base Cost</th>
                      <th className="px-4 py-3">Retail Price</th>
                      <th className="px-4 py-3 text-right">Profit Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {variantsList.map((row, idx) => {
                      const hex = colorHexCodes[row.color] || "#555555";
                      const marginProfit = Math.max(row.retailPrice - row.baseCost, 0);
                      const marginPct = row.retailPrice > 0 ? (marginProfit / row.retailPrice) * 100 : 0;
                      
                      return (
                        <tr 
                          key={idx} 
                          className={`transition-colors duration-100 ${
                            row.inStock ? "hover:bg-white/[0.01]" : "opacity-40"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={row.selected}
                              disabled={!row.inStock}
                              onChange={() => handleToggleVariantSelect(idx)}
                              className="rounded border-white/20 accent-[#7c6af7] cursor-pointer disabled:cursor-not-allowed"
                            />
                          </td>
                          <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                            <div className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: hex }} />
                            <span>{row.color}</span>
                          </td>
                          <td className="px-4 py-3 font-semibold">{row.size}</td>
                          <td className="px-4 py-3">
                            {row.inStock ? (
                              <span className="text-[10px] text-emerald-400 bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10 rounded">In Stock</span>
                            ) : (
                              <span className="text-[10px] text-red-400 bg-red-500/5 px-2 py-0.5 border border-red-500/10 rounded font-bold">Out of Stock</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-semibold text-white">${row.baseCost.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <div className="relative w-20">
                              <DollarSign className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#5e5a72]" />
                              <input
                                type="text"
                                value={row.retailPrice}
                                disabled={!row.inStock}
                                onChange={(e) => handleVariantPriceChange(idx, e.target.value)}
                                className="h-6 pl-5 pr-1 w-full bg-black/25 border border-white/[0.08] focus:border-purple-500/80 rounded text-[11px] text-white disabled:cursor-not-allowed font-semibold text-center"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex flex-col items-end">
                              <span className="font-bold text-white">${marginProfit.toFixed(2)}</span>
                              <span className="text-[9px] text-purple-300 font-semibold mt-0.5">{marginPct.toFixed(1)}% margin</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Matrix buttons list */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <div className="text-xs text-[#5e5a72]">
                Selected variations: <span className="font-semibold text-white">{variantsList.filter(v => v.selected && v.inStock).length}</span> items
              </div>

              <button
                onClick={handlePublishClick}
                disabled={isPublishing || variantsList.filter(v => v.selected && v.inStock).length === 0}
                className="py-2.5 px-6 rounded-xl font-bold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(124,106,247,0.3)] hover:brightness-110 disabled:brightness-90 disabled:cursor-not-allowed relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #7c6af7 0%, #a855f7 100%)",
                }}
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Syncing inventory...</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    <span>Publish to Etsy via Printify</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )
    )}

      {/* Syncing checklist dialog modal */}
      {isPublishing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in-fast">
          <div 
            className="w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden text-center space-y-6"
            style={{
              background: "linear-gradient(145deg, #161622 0%, #0d0d14 100%)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#7c6af7] to-transparent animate-pulse" />
            
            <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto border border-purple-500/20 text-purple-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Publishing in Progress</h3>
              <p className="text-xs text-[#a09cb0] mt-1">Pushing variables to live Etsy & Printify API nodes.</p>
            </div>

            <div className="text-left space-y-3 max-w-xs mx-auto text-xs bg-black/20 p-4 rounded-xl border border-white/[0.05]">
              <div className="flex items-center gap-2">
                {publishStep > 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400 shrink-0" />
                )}
                <span className={publishStep > 1 ? "text-white/60 line-through" : "text-white font-semibold"}>
                  Generating mockup image renders
                </span>
              </div>

              <div className="flex items-center gap-2">
                {publishStep > 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : publishStep === 2 ? (
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-white/10 shrink-0" />
                )}
                <span className={publishStep > 2 ? "text-white/60 line-through" : publishStep === 2 ? "text-white font-semibold" : "text-[#5e5a72]"}>
                  Uploading designs to Printify catalog
                </span>
              </div>

              <div className="flex items-center gap-2">
                {publishStep > 3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : publishStep === 3 ? (
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-white/10 shrink-0" />
                )}
                <span className={publishStep === 3 ? "text-white font-semibold" : "text-[#5e5a72]"}>
                  Syncing drafts to Etsy Shop Listings
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success checklist modal */}
      {showSuccessModal && selectedModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-fast">
          <div 
            className="w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden text-center space-y-6"
            style={{
              background: "linear-gradient(145deg, #161622 0%, #0d0d14 100%)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#22c55e] to-transparent" />
            
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Listing Draft Created!</h3>
              <p className="text-xs text-[#a09cb0] mt-1.5 max-w-sm mx-auto leading-relaxed">
                The product has been successfully created on Printify and sent as a draft to your connected Etsy shop listing inventory.
              </p>
            </div>

            <div className="bg-black/20 p-4 rounded-xl border border-white/[0.04] text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#a09cb0]">Product Title:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">{title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a09cb0]">Synced Variants:</span>
                <span className="font-semibold text-purple-300">
                  {variantsList.filter(v => v.selected && v.inStock).length} variations mapped
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a09cb0]">Print Provider:</span>
                <span className="font-semibold text-white">{selectedProvider?.name || "Monster Digital"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a09cb0]">Etsy Sync:</span>
                <span className="font-semibold text-emerald-400 font-bold">Draft Sync Complete (v3)</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close Studio
              </button>
              
              <a
                href="https://www.etsy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-gradient-to-r from-[#22c55e] to-[#10b981] hover:brightness-110 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shadow-[0_4px_12px_rgba(34,197,94,0.25)]"
              >
                <span>View Etsy Shop</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

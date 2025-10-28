/**
 * @fileoverview Print-on-demand suite constants for FlashFusion
 * @description Contains constants for product design, marketplace integration, fulfillment, and order management
 */

/**
 * Supported product types for print-on-demand
 * @description Available product categories with specifications
 */
export const PRODUCT_TYPES = {
  APPAREL: {
    T_SHIRT: {
      id: 'tshirt',
      name: 'T-Shirt',
      category: 'apparel',
      basePrice: 12.99,
      printAreas: ['front', 'back'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['white', 'black', 'gray', 'navy', 'red', 'blue'],
      dimensions: { width: 4800, height: 6000, dpi: 300 },
      materials: ['cotton', 'polyester', 'blend']
    },
    HOODIE: {
      id: 'hoodie',
      name: 'Hoodie',
      category: 'apparel',
      basePrice: 24.99,
      printAreas: ['front', 'back'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['white', 'black', 'gray', 'navy', 'red'],
      dimensions: { width: 4800, height: 6000, dpi: 300 },
      materials: ['cotton', 'fleece']
    },
    TANK_TOP: {
      id: 'tank',
      name: 'Tank Top',
      category: 'apparel',
      basePrice: 9.99,
      printAreas: ['front', 'back'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['white', 'black', 'gray', 'navy'],
      dimensions: { width: 4800, height: 6000, dpi: 300 },
      materials: ['cotton', 'polyester']
    }
  },
  
  HOME_DECOR: {
    POSTER: {
      id: 'poster',
      name: 'Poster',
      category: 'home_decor',
      basePrice: 8.99,
      printAreas: ['full'],
      sizes: ['8x10', '11x14', '16x20', '18x24', '24x36'],
      colors: ['white', 'matte'],
      dimensions: { width: 7200, height: 10800, dpi: 300 },
      materials: ['paper', 'canvas']
    },
    MUG: {
      id: 'mug',
      name: 'Mug',
      category: 'home_decor',
      basePrice: 11.99,
      printAreas: ['wrap', 'front'],
      sizes: ['11oz', '15oz'],
      colors: ['white', 'black', 'color'],
      dimensions: { width: 2362, height: 1181, dpi: 300 },
      materials: ['ceramic', 'stainless_steel']
    },
    PILLOW: {
      id: 'pillow',
      name: 'Throw Pillow',
      category: 'home_decor',
      basePrice: 16.99,
      printAreas: ['front', 'back', 'all_over'],
      sizes: ['16x16', '18x18', '20x20'],
      colors: ['white', 'natural'],
      dimensions: { width: 4800, height: 4800, dpi: 300 },
      materials: ['polyester', 'canvas']
    }
  },
  
  STATIONERY: {
    STICKER: {
      id: 'sticker',
      name: 'Sticker',
      category: 'stationery',
      basePrice: 2.99,
      printAreas: ['full'],
      sizes: ['2x2', '3x3', '4x4', '5x5'],
      colors: ['white', 'clear', 'holographic'],
      dimensions: { width: 1200, height: 1200, dpi: 300 },
      materials: ['vinyl', 'paper', 'holographic']
    },
    NOTEBOOK: {
      id: 'notebook',
      name: 'Notebook',
      category: 'stationery',
      basePrice: 14.99,
      printAreas: ['cover', 'back'],
      sizes: ['5x7', '6x9', '8x10'],
      colors: ['white', 'cream'],
      dimensions: { width: 2400, height: 3000, dpi: 300 },
      materials: ['paper', 'hardcover', 'softcover']
    }
  },
  
  ACCESSORIES: {
    PHONE_CASE: {
      id: 'phone_case',
      name: 'Phone Case',
      category: 'accessories',
      basePrice: 13.99,
      printAreas: ['back', 'wrap'],
      sizes: ['iphone_14', 'iphone_14_pro', 'samsung_s23', 'universal'],
      colors: ['clear', 'white', 'black'],
      dimensions: { width: 1500, height: 3000, dpi: 300 },
      materials: ['tpu', 'hard_plastic', 'leather']
    },
    TOTE_BAG: {
      id: 'tote',
      name: 'Tote Bag',
      category: 'accessories',
      basePrice: 12.99,
      printAreas: ['front', 'back'],
      sizes: ['standard', 'large'],
      colors: ['natural', 'white', 'black'],
      dimensions: { width: 4800, height: 4800, dpi: 300 },
      materials: ['canvas', 'cotton']
    }
  }
} as const;

/**
 * Supported marketplace integrations
 * @description Available platforms for product listing and sales
 */
export const MARKETPLACES = {
  ETSY: {
    id: 'etsy',
    name: 'Etsy',
    logo: '/images/marketplaces/etsy.png',
    category: 'handmade',
    commission: 6.5,
    features: ['auto_listing', 'inventory_sync', 'order_import', 'seo_optimization'],
    requirements: ['api_key', 'shop_id'],
    supportedProducts: ['all'],
    maxImages: 10,
    maxTitleLength: 140,
    maxDescriptionLength: 13000
  },
  
  AMAZON: {
    id: 'amazon',
    name: 'Amazon',
    logo: '/images/marketplaces/amazon.png',
    category: 'marketplace',
    commission: 15,
    features: ['fba_integration', 'auto_listing', 'inventory_sync', 'advertising'],
    requirements: ['seller_id', 'mws_auth_token'],
    supportedProducts: ['apparel', 'home_decor', 'accessories'],
    maxImages: 9,
    maxTitleLength: 200,
    maxDescriptionLength: 2000
  },
  
  SHOPIFY: {
    id: 'shopify',
    name: 'Shopify',
    logo: '/images/marketplaces/shopify.png',
    category: 'ecommerce',
    commission: 2.9,
    features: ['storefront_sync', 'inventory_management', 'order_processing', 'abandoned_cart'],
    requirements: ['store_url', 'access_token'],
    supportedProducts: ['all'],
    maxImages: 250,
    maxTitleLength: 255,
    maxDescriptionLength: 'unlimited'
  },
  
  PRINTFUL: {
    id: 'printful',
    name: 'Printful',
    logo: '/images/marketplaces/printful.png',
    category: 'fulfillment',
    commission: 0,
    features: ['print_fulfillment', 'global_shipping', 'quality_control', 'branding'],
    requirements: ['api_key'],
    supportedProducts: ['apparel', 'home_decor', 'accessories'],
    maxImages: 20,
    maxTitleLength: 'unlimited',
    maxDescriptionLength: 'unlimited'
  },
  
  REDBUBBLE: {
    id: 'redbubble',
    name: 'RedBubble',
    logo: '/images/marketplaces/redbubble.png',
    category: 'print_on_demand',
    commission: 20,
    features: ['automatic_fulfillment', 'global_reach', 'artist_tools', 'promotion'],
    requirements: ['username', 'password'],
    supportedProducts: ['apparel', 'home_decor', 'stationery', 'accessories'],
    maxImages: 1,
    maxTitleLength: 50,
    maxDescriptionLength: 500
  },
  
  SOCIETY6: {
    id: 'society6',
    name: 'Society6',
    logo: '/images/marketplaces/society6.png',
    category: 'lifestyle',
    commission: 25,
    features: ['curated_marketplace', 'home_lifestyle', 'art_community', 'trending'],
    requirements: ['artist_profile'],
    supportedProducts: ['home_decor', 'apparel', 'accessories'],
    maxImages: 1,
    maxTitleLength: 40,
    maxDescriptionLength: 300
  }
} as const;

/**
 * Design tool configurations
 * @description Available design tools and their capabilities
 */
export const DESIGN_TOOLS = {
  CANVAS_EDITOR: {
    id: 'canvas_editor',
    name: 'Canvas Editor',
    features: ['layers', 'shapes', 'text', 'images', 'effects', 'templates'],
    supportedFormats: ['png', 'jpg', 'svg', 'pdf'],
    maxLayers: 50,
    maxCanvasSize: { width: 10000, height: 10000 }
  },
  
  AI_GENERATOR: {
    id: 'ai_generator',
    name: 'AI Design Generator',
    features: ['text_to_image', 'style_transfer', 'background_removal', 'upscaling'],
    models: ['stable_diffusion', 'dall_e', 'midjourney'],
    maxResolution: { width: 2048, height: 2048 },
    creditsPerGeneration: 1
  },
  
  TEMPLATE_BUILDER: {
    id: 'template_builder',
    name: 'Template Builder',
    features: ['drag_drop', 'smart_resize', 'brand_kit_integration', 'bulk_generation'],
    categories: ['minimalist', 'vintage', 'modern', 'playful', 'professional'],
    customizable: ['colors', 'fonts', 'layouts', 'elements']
  }
} as const;

/**
 * Print specifications and quality requirements
 * @description Technical requirements for print production
 */
export const PRINT_SPECS = {
  RESOLUTION: {
    MINIMUM: 150, // DPI
    RECOMMENDED: 300, // DPI
    HIGH_QUALITY: 600 // DPI
  },
  
  COLOR_MODES: {
    RGB: 'rgb',
    CMYK: 'cmyk',
    PANTONE: 'pantone'
  },
  
  FILE_FORMATS: {
    VECTOR: ['svg', 'ai', 'eps'],
    RASTER: ['png', 'jpg', 'tiff', 'psd'],
    PRINT_READY: ['pdf', 'eps', 'ai']
  },
  
  BLEED_AREAS: {
    STANDARD: 3, // mm
    LARGE_FORMAT: 5 // mm
  },
  
  SAFE_ZONES: {
    TEXT: 6, // mm from edge
    GRAPHICS: 3 // mm from edge
  }
} as const;

/**
 * Order status workflow
 * @description Order processing states and transitions
 */
export const ORDER_STATUSES = {
  DRAFT: {
    id: 'draft',
    name: 'Draft',
    description: 'Order being created',
    color: '#94A3B8',
    nextStates: ['pending', 'cancelled']
  },
  
  PENDING: {
    id: 'pending',
    name: 'Pending',
    description: 'Waiting for payment',
    color: '#F59E0B',
    nextStates: ['paid', 'cancelled']
  },
  
  PAID: {
    id: 'paid',
    name: 'Paid',
    description: 'Payment received',
    color: '#10B981',
    nextStates: ['processing', 'refunded']
  },
  
  PROCESSING: {
    id: 'processing',
    name: 'Processing',
    description: 'Being prepared for printing',
    color: '#3B82F6',
    nextStates: ['printing', 'cancelled']
  },
  
  PRINTING: {
    id: 'printing',
    name: 'Printing',
    description: 'Currently being printed',
    color: '#8B5CF6',
    nextStates: ['quality_check', 'failed']
  },
  
  QUALITY_CHECK: {
    id: 'quality_check',
    name: 'Quality Check',
    description: 'Undergoing quality inspection',
    color: '#06B6D4',
    nextStates: ['shipping', 'reprint', 'failed']
  },
  
  SHIPPING: {
    id: 'shipping',
    name: 'Shipping',
    description: 'Package shipped',
    color: '#84CC16',
    nextStates: ['delivered', 'returned']
  },
  
  DELIVERED: {
    id: 'delivered',
    name: 'Delivered',
    description: 'Successfully delivered',
    color: '#22C55E',
    nextStates: []
  },
  
  CANCELLED: {
    id: 'cancelled',
    name: 'Cancelled',
    description: 'Order cancelled',
    color: '#EF4444',
    nextStates: []
  },
  
  FAILED: {
    id: 'failed',
    name: 'Failed',
    description: 'Print or shipping failed',
    color: '#DC2626',
    nextStates: ['reprint', 'refunded']
  },
  
  REPRINT: {
    id: 'reprint',
    name: 'Reprint',
    description: 'Being reprinted',
    color: '#F97316',
    nextStates: ['printing', 'cancelled']
  },
  
  REFUNDED: {
    id: 'refunded',
    name: 'Refunded',
    description: 'Payment refunded',
    color: '#6B7280',
    nextStates: []
  },
  
  RETURNED: {
    id: 'returned',
    name: 'Returned',
    description: 'Package returned',
    color: '#9CA3AF',
    nextStates: ['refunded', 'reprint']
  }
} as const;

/**
 * Fulfillment provider configurations
 * @description Available print and fulfillment services
 */
export const FULFILLMENT_PROVIDERS = {
  PRINTFUL: {
    id: 'printful',
    name: 'Printful',
    regions: ['US', 'EU', 'UK', 'CA', 'AU'],
    features: ['white_label', 'custom_branding', 'express_shipping'],
    specialties: ['apparel', 'accessories'],
    avgFulfillmentTime: 5, // days
    apiEndpoint: 'https://api.printful.com'
  },
  
  PRINTIFY: {
    id: 'printify',
    name: 'Printify',
    regions: ['US', 'EU', 'UK'],
    features: ['multiple_suppliers', 'competitive_pricing', 'quality_guarantee'],
    specialties: ['home_decor', 'apparel'],
    avgFulfillmentTime: 7, // days
    apiEndpoint: 'https://api.printify.com'
  },
  
  GOOTEN: {
    id: 'gooten',
    name: 'Gooten',
    regions: ['US', 'EU'],
    features: ['fast_shipping', 'premium_quality', 'eco_friendly'],
    specialties: ['stationery', 'home_decor'],
    avgFulfillmentTime: 3, // days
    apiEndpoint: 'https://api.gooten.com'
  }
} as const;

/**
 * Design categories and templates
 * @description Predefined design categories and style templates
 */
export const DESIGN_CATEGORIES = {
  BUSINESS: {
    id: 'business',
    name: 'Business & Professional',
    subcategories: ['corporate', 'startup', 'consulting', 'finance'],
    colorPalettes: ['corporate_blue', 'professional_gray', 'minimal_black'],
    fonts: ['modern_sans', 'clean_serif', 'corporate']
  },
  
  LIFESTYLE: {
    id: 'lifestyle',
    name: 'Lifestyle & Fashion',
    subcategories: ['fashion', 'beauty', 'wellness', 'travel'],
    colorPalettes: ['pastel_dreams', 'earth_tones', 'bold_fashion'],
    fonts: ['elegant_script', 'modern_sans', 'fashion_display']
  },
  
  CREATIVE: {
    id: 'creative',
    name: 'Creative & Artistic',
    subcategories: ['art', 'design', 'photography', 'music'],
    colorPalettes: ['rainbow', 'artistic_bold', 'monochrome'],
    fonts: ['creative_display', 'artistic_script', 'modern_geometric']
  },
  
  TECH: {
    id: 'tech',
    name: 'Technology & Gaming',
    subcategories: ['software', 'gaming', 'AI', 'crypto'],
    colorPalettes: ['neon_cyber', 'tech_blue', 'dark_theme'],
    fonts: ['futuristic', 'code_mono', 'tech_sans']
  },
  
  EDUCATION: {
    id: 'education',
    name: 'Education & Learning',
    subcategories: ['academic', 'kids', 'online_courses', 'tutorials'],
    colorPalettes: ['friendly_warm', 'academic_traditional', 'playful_kids'],
    fonts: ['readable_sans', 'friendly_rounded', 'academic_serif']
  }
} as const;

/**
 * Pricing tiers for print-on-demand
 * @description Different pricing models and profit margins
 */
export const PRICING_TIERS = {
  ECONOMY: {
    id: 'economy',
    name: 'Economy',
    margin: 20, // %
    features: ['basic_materials', 'standard_shipping'],
    targetMarket: 'budget_conscious'
  },
  
  STANDARD: {
    id: 'standard',
    name: 'Standard',
    margin: 35, // %
    features: ['quality_materials', 'fast_shipping', 'basic_customization'],
    targetMarket: 'general_market'
  },
  
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    margin: 50, // %
    features: ['premium_materials', 'express_shipping', 'custom_packaging', 'quality_guarantee'],
    targetMarket: 'premium_buyers'
  },
  
  LUXURY: {
    id: 'luxury',
    name: 'Luxury',
    margin: 75, // %
    features: ['luxury_materials', 'white_glove_service', 'custom_branding', 'personal_consultation'],
    targetMarket: 'luxury_market'
  }
} as const;
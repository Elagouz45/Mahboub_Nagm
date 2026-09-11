export interface SiteImageAsset {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}

const IMAGE_BASE_PATH = '/assets/images/mahboub-nagm';

function img(path: string, width: number, height: number, alt: string): SiteImageAsset {
  return {
    src: `${IMAGE_BASE_PATH}/${path}`,
    width,
    height,
    alt,
  };
}

export const SITE_IMAGE_ASSETS = {
  banners: {
    mainHero: img(
      'banners/hero-appliance-collection.webp',
      1600,
      900,
      'مجموعة متكاملة من الأجهزة الكهربائية الحديثة',
    ),
    laundryCare: img(
      'banners/hero-laundry-care.webp',
      1600,
      900,
      'عروض العناية بالغسيل والغسالات المنزلية',
    ),
    homeEntertainment: img(
      'banners/hero-home-entertainment.webp',
      1600,
      900,
      'تليفزيونات وأنظمة ترفيه منزلي حديثة',
    ),
    summerCooling: img(
      'banners/hero-summer-cooling.webp',
      1600,
      900,
      'عروض التكييف والتبريد لفصل الصيف',
    ),
    kitchenAppliances: img(
      'banners/hero-kitchen-appliances.webp',
      1600,
      900,
      'أجهزة مطبخ صغيرة لتجهيز المنزل',
    ),
    homeBundleShowcase: img(
      'banners/home-bundle-showcase.webp',
      1600,
      900,
      'باقة متكاملة لتجهيز المنزل بالأجهزة الكهربائية',
    ),
    shop: img(
      'banners/shop-banner.png',
      1024,
      384,
      'أجهزة كهربائية منزلية من ثلاجات وغسالات وتليفزيونات',
    ),
  },
  brand: {
    logo: img(
      'brand/store-logo.jpg',
      1024,
      1024,
      'شعار مؤسسة فتحي محبوب نجم للأدوات المنزلية والكهربائية',
    ),
  },
  categories: {
    refrigerators: img(
      'categories/category-refrigerators.webp',
      1000,
      1000,
      'ثلاجات منزلية',
    ),
    washingMachines: img(
      'categories/category-washing-machines.webp',
      1000,
      1000,
      'غسالات ملابس',
    ),
    televisions: img('categories/category-televisions.webp', 1000, 1000, 'تليفزيونات'),
    airConditioners: img(
      'categories/category-air-conditioners.webp',
      1000,
      1000,
      'تكييفات',
    ),
    cookers: img('categories/category-cookers.webp', 1000, 1000, 'بوتاجازات'),
    ovens: img('categories/category-ovens.webp', 1000, 1000, 'أفران وميكروويف'),
    waterHeaters: img('categories/category-water-heaters.webp', 1000, 1000, 'سخانات مياه'),
    fans: img('categories/category-fans.webp', 1000, 1000, 'مراوح'),
    smallAppliances: img(
      'categories/category-small-appliances.webp',
      1000,
      1000,
      'أجهزة صغيرة',
    ),
    vacuumCleaners: img(
      'categories/category-vacuum-cleaners.webp',
      1000,
      1000,
      'مكانس كهربائية',
    ),
  },
  products: {
    refrigeratorFrenchDoorSilver: img(
      'products/refrigerator-french-door-silver.webp',
      1000,
      1000,
      'ثلاجة فرنسية ستيل',
    ),
    refrigeratorTopFreezerWhite: img(
      'products/refrigerator-top-freezer-white.webp',
      1000,
      1000,
      'ثلاجة بيضاء بفريزر علوي',
    ),
    refrigeratorSideBySideBlack: img(
      'products/refrigerator-side-by-side-black.webp',
      1000,
      1000,
      'ثلاجة سوداء بابين متقابلين',
    ),
    washingMachineFrontLoadSilver: img(
      'products/washing-machine-front-load-silver.webp',
      1000,
      1000,
      'غسالة تعبئة أمامية فضية',
    ),
    washingMachineTopLoadWhite: img(
      'products/washing-machine-top-load-white.webp',
      1000,
      1000,
      'غسالة تعبئة علوية بيضاء',
    ),
    washerDryerGraphite: img(
      'products/washer-dryer-graphite.webp',
      1000,
      1000,
      'غسالة مجفف جرافيت',
    ),
    smartTv55Inch: img('products/smart-tv-55-inch.webp', 1000, 1000, 'تليفزيون ذكي 55 بوصة'),
    smartTv65Inch: img('products/smart-tv-65-inch.webp', 1000, 1000, 'تليفزيون ذكي 65 بوصة'),
    smartTv43Inch: img('products/smart-tv-43-inch.webp', 1000, 1000, 'تليفزيون ذكي 43 بوصة'),
    airConditionerSplitWhite: img(
      'products/air-conditioner-split-white.webp',
      1000,
      1000,
      'تكييف سبليت أبيض',
    ),
    airConditionerInverterSilver: img(
      'products/air-conditioner-inverter-silver.webp',
      1000,
      1000,
      'تكييف إنفرتر فضي',
    ),
    airConditionerPremiumBlack: img(
      'products/air-conditioner-premium-black.webp',
      1000,
      1000,
      'تكييف فاخر بلمسات داكنة',
    ),
    gasCookerStainlessSteel: img(
      'products/gas-cooker-stainless-steel.webp',
      1000,
      1000,
      'بوتاجاز غاز استانلس',
    ),
    gasCookerBlackGlass: img(
      'products/gas-cooker-black-glass.webp',
      1000,
      1000,
      'بوتاجاز غاز بسطح زجاج أسود',
    ),
    builtInGasHob: img('products/built-in-gas-hob.webp', 1000, 1000, 'مسطح غاز مدمج'),
    builtInElectricOven: img(
      'products/built-in-electric-oven.webp',
      1000,
      1000,
      'فرن كهربائي مدمج',
    ),
    airFryerBlack: img('products/air-fryer-black.webp', 1000, 1000, 'قلاية هوائية سوداء'),
    countertopBlender: img('products/countertop-blender.webp', 1000, 1000, 'خلاط سطح المطبخ'),
    microwaveBlack: img('products/microwave-black.webp', 1000, 1000, 'ميكروويف أسود'),
    coffeeMaker: img('products/coffee-maker.webp', 1000, 1000, 'صانعة قهوة'),
    foodProcessor: img('products/food-processor.webp', 1000, 1000, 'محضرة طعام'),
    cordlessVacuumCleaner: img(
      'products/cordless-vacuum-cleaner.webp',
      1000,
      1000,
      'مكنسة لاسلكية',
    ),
    electricWaterHeater: img(
      'products/electric-water-heater.webp',
      1000,
      1000,
      'سخان مياه كهربائي',
    ),
    pedestalFan: img('products/pedestal-fan.webp', 1000, 1000, 'مروحة عمودية'),
  },
  lifestyle: {
    modernFamilyKitchen: img(
      'lifestyle/modern-family-kitchen.webp',
      1600,
      900,
      'مطبخ عائلي حديث مجهز بأجهزة كهربائية',
    ),
    organizedLaundryRoom: img(
      'lifestyle/organized-laundry-room.webp',
      1600,
      900,
      'غرفة غسيل منظمة',
    ),
    homeEntertainmentRoom: img(
      'lifestyle/home-entertainment-room.webp',
      1600,
      900,
      'غرفة ترفيه منزلي بتليفزيون حديث',
    ),
    kitchenCounterAppliances: img(
      'lifestyle/kitchen-counter-appliances.webp',
      1600,
      900,
      'أجهزة صغيرة على سطح المطبخ',
    ),
    applianceShoppingFamily: img(
      'lifestyle/appliance-shopping-family.webp',
      1600,
      900,
      'عائلة تختار أجهزة كهربائية منزلية',
    ),
    homeDeliveryInstallation: img(
      'lifestyle/home-delivery-installation.webp',
      1600,
      900,
      'توصيل وتركيب الأجهزة في المنزل',
    ),
  },
  services: {
    originalProducts: img(
      'services/original-products.webp',
      1000,
      1000,
      'منتجات أصلية من ماركات معتمدة',
    ),
    authorizedWarranty: img(
      'services/authorized-warranty.webp',
      1000,
      1000,
      'ضمان معتمد وخدمة ما بعد البيع',
    ),
    fastDelivery: img('services/fast-delivery.webp', 1000, 1000, 'توصيل سريع للأجهزة'),
    whatsappSupport: img(
      'services/whatsapp-support.webp',
      1000,
      1000,
      'دعم العملاء عبر واتساب',
    ),
  },
  brands: {
    hero: img(
      'banners/home-bundle-showcase.webp',
      1600,
      900,
      'مجموعة أجهزة كهربائية من علامات تجارية موثوقة',
    ),
  },
  offers: {
    hero: img(
      'banners/hero-appliance-collection.webp',
      1600,
      900,
      'أجهزة كهربائية بأسعار مخفضة داخل المنزل',
    ),
  },
  about: {
    hero: img(
      'lifestyle/appliance-shopping-family.webp',
      1600,
      900,
      'أسرة تختار أجهزة كهربائية بمساعدة مختص',
    ),
    service: img(
      'lifestyle/home-delivery-installation.webp',
      1600,
      900,
      'خدمة ما بعد البيع وتركيب الأجهزة في المنزل',
    ),
    cta: img(
      'lifestyle/modern-family-kitchen.webp',
      1600,
      900,
      'مطبخ منزلي هادئ بأجهزة متناسقة',
    ),
  },
  contact: {
    hero: img(
      'services/whatsapp-support.webp',
      1000,
      1000,
      'موظف خدمة عملاء يساعد المتسوقين',
    ),
  },
  afterSales: {
    hero: img(
      'lifestyle/organized-laundry-room.webp',
      1600,
      900,
      'فني يعتني بغسالة داخل منزل هادئ',
    ),
    cta: img(
      'lifestyle/home-delivery-installation.webp',
      1600,
      900,
      'تركيب جهاز كهربائي في المنزل',
    ),
  },
  returnPolicy: {
    hero: img(
      'services/fast-delivery.webp',
      1000,
      1000,
      'صندوق أجهزة جاهز للشحن أو الاسترجاع',
    ),
  },
} as const;

export const SITE_IMAGE_FALLBACK: SiteImageAsset =
  SITE_IMAGE_ASSETS.products.refrigeratorTopFreezerWhite;

export function countSiteImageAssets(): number {
  return Object.values(SITE_IMAGE_ASSETS).reduce(
    (total, group) => total + Object.keys(group).length,
    0,
  );
}

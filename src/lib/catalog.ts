import type { CatalogCategory, CatalogProduct } from "@/types/catalog";

/**
 * Sample catalog from the approved design (ecommerce.pen). It is shown only
 * while no POS token is configured or the POS returns no products — real
 * items come from erxes POS, see useCatalog.
 */
export const SAMPLE_CATEGORIES: CatalogCategory[] = [
  { _id: "headphones", name: { mn: "Чихэвч", en: "Headphones" }, imageUrl: "/images/cat-headphones.jpg" },
  { _id: "speakers", name: { mn: "Чанга яригч", en: "Speakers" }, imageUrl: "/images/cat-speakers.jpg" },
  { _id: "home", name: { mn: "Гэр ахуй", en: "Home audio" }, imageUrl: "/images/cat-turntables.jpg" },
  { _id: "earphones", name: { mn: "Утасгүй чихэвч", en: "Earphones" }, imageUrl: "/images/cat-earphones.jpg" },
  { _id: "accessories", name: { mn: "Дагалдах хэрэгсэл", en: "Accessories" }, imageUrl: "/images/cat-accessories.jpg" },
  { _id: "wearables", name: { mn: "Ухаалаг цаг", en: "Wearables" } },
  { _id: "gaming", name: { mn: "Тоглоом", en: "Gaming" } },
  { _id: "bags", name: { mn: "Цүнх", en: "Bags" } },
];

const cat = (id: string) => SAMPLE_CATEGORIES.find((c) => c._id === id)!.name;

type SampleInput = Omit<CatalogProduct, "categoryName" | "sample" | "imageUrl"> & { img: number };

const p = ({ img, ...rest }: SampleInput): CatalogProduct => ({
  ...rest,
  categoryName: rest.categoryId ? cat(rest.categoryId) : undefined,
  imageUrl: `/images/product-${img}.jpg`,
  sample: true,
});

export const SAMPLE_PRODUCTS: CatalogProduct[] = [
  p({
    _id: "sample-1", img: 1, categoryId: "headphones", unitPrice: 849000, oldPrice: 1099000, rating: 4, flash: true,
    name: { mn: "Утасгүй чихэвч Over-Ear", en: "Wireless Over-Ear Headphones" },
    description: {
      mn: "Идэвхтэй дуу чимээ дарагч, 40 цагийн батарей, зөөлөн жийргэвчтэй өдөр тутмын чихэвч.",
      en: "Active noise cancelling, 40-hour battery and plush cushions for all-day listening.",
    },
  }),
  p({
    _id: "sample-2", img: 2, categoryId: "earphones", unitPrice: 519000, oldPrice: 689000, rating: 5, flash: true,
    name: { mn: "True Wireless чихэвч", en: "True Wireless Earbuds" },
    description: {
      mn: "Жижиг, хөнгөн, цэнэглэгч хайрцагтай. Нийт 30 цаг ажиллана.",
      en: "Compact and light with a charging case — 30 hours of total playback.",
    },
  }),
  p({
    _id: "sample-3", img: 3, categoryId: "speakers", unitPrice: 409000, oldPrice: 549000, rating: 4, flash: true,
    name: { mn: "Ухаалаг гэрийн чанга яригч", en: "Smart Home Speaker" },
    description: {
      mn: "Дуут туслахтай, өрөө дүүргэх 360° дуугаралттай ухаалаг яригч.",
      en: "Voice-assistant speaker with room-filling 360° sound.",
    },
  }),
  p({
    _id: "sample-4", img: 4, categoryId: "earphones", unitPrice: 619000, oldPrice: 759000, rating: 4, flash: true,
    name: { mn: "Шаргал өнгийн утасгүй чихэвч", en: "Beige Wireless Earbuds" },
    description: {
      mn: "Тав тухтай суулт, тод дуугаралт, усанд тэсвэртэй.",
      en: "Comfortable fit, crisp sound and water resistance.",
    },
  }),
  p({
    _id: "sample-5", img: 5, categoryId: "speakers", unitPrice: 1290000, rating: 5,
    name: { mn: "Геометр тавиурын чанга яригч", en: "Geometric Bookshelf Speaker" },
    description: {
      mn: "Модон их биетэй, гүн басстай тавиурын хос яригч.",
      en: "Wooden-cabinet bookshelf pair with deep, warm bass.",
    },
  }),
  p({
    _id: "sample-6", img: 6, categoryId: "speakers", unitPrice: 1890000, oldPrice: 2190000, rating: 4,
    name: { mn: "Орчин үеийн яригчийн багц", en: "Modern Speaker Set" },
    description: {
      mn: "Зочны өрөөнд зориулсан стерео багц, Bluetooth болон оптик оролттой.",
      en: "Living-room stereo set with Bluetooth and optical input.",
    },
  }),
  p({
    _id: "sample-7", img: 7, categoryId: "speakers", unitPrice: 289000, rating: 4,
    name: { mn: "Зөөврийн Bluetooth яригч", en: "Portable Bluetooth Speaker" },
    description: {
      mn: "Аялалд авч явахад тохиромжтой, 12 цаг ажиллах жижиг яригч.",
      en: "Travel-ready mini speaker with 12 hours of playtime.",
    },
  }),
  p({
    _id: "sample-8", img: 8, categoryId: "accessories", unitPrice: 79000, rating: 4,
    name: { mn: "Чихэвчний сэлбэг жийргэвч", en: "Replacement Earpad Cushion" },
    description: {
      mn: "Санах ойтой хөөсөн жийргэвч — хуучин чихэвчээ шинэ мэт болго.",
      en: "Memory-foam earpads that make old headphones feel new.",
    },
  }),
  p({
    _id: "sample-9", img: 9, categoryId: "bags", unitPrice: 359000, oldPrice: 449000, rating: 5,
    name: { mn: "Аяллын орчин үеийн цүнх", en: "Modern Travel Bag" },
    description: {
      mn: "Зөөврийн компьютерийн тасалгаатай, ус нэвтрэхгүй даавуун цүнх.",
      en: "Water-resistant bag with a padded laptop sleeve.",
    },
  }),
  p({
    _id: "sample-10", img: 10, categoryId: "wearables", unitPrice: 699000, rating: 4,
    name: { mn: "Ягаан оосортой ухаалаг цаг", en: "Smartwatch with Pink Strap" },
    description: {
      mn: "Зүрхний цохилт, нойр, алхам хэмжинэ. 7 хоног цэнэг барина.",
      en: "Tracks heart rate, sleep and steps — a week on one charge.",
    },
  }),
  p({
    _id: "sample-11", img: 11, categoryId: "home", unitPrice: 149000, rating: 4,
    name: { mn: "Анхилуун үнэрт диффузор", en: "Aroma Diffuser" },
    description: {
      mn: "Чимээгүй ажиллагаатай, зөөлөн гэрэлтэй үнэрт тос цацагч.",
      en: "Whisper-quiet diffuser with a soft ambient light.",
    },
  }),
  p({
    _id: "sample-12", img: 12, categoryId: "gaming", unitPrice: 229000, oldPrice: 259000, rating: 5,
    name: { mn: "Утасгүй тоглоомын удирдлага", en: "Wireless Game Controller" },
    description: {
      mn: "Чичиргээт хариу үйлдэлтэй, PC болон утсанд холбогдоно.",
      en: "Haptic feedback controller for PC and mobile.",
    },
  }),
  p({
    _id: "sample-13", img: 13, categoryId: "wearables", unitPrice: 529000, oldPrice: 689000, rating: 4, isNew: true,
    name: { mn: "Хосын ухаалаг цаг", en: "His & Hers Smartwatches" },
    description: {
      mn: "Хос ухаалаг цаг — бэлэгт хамгийн тохиромжтой сонголт.",
      en: "A matching pair of smartwatches — the perfect gift.",
    },
  }),
  p({
    _id: "sample-14", img: 14, categoryId: "speakers", unitPrice: 379000, oldPrice: 479000, rating: 4, isNew: true,
    name: { mn: "JBL зөөврийн яригч", en: "JBL Portable Speaker" },
    description: {
      mn: "Хүчирхэг дуугаралттай, ус тоосны хамгаалалттай зөөврийн яригч.",
      en: "Big-sound portable speaker with dust and water protection.",
    },
  }),
  p({
    _id: "sample-15", img: 15, categoryId: "gaming", unitPrice: 629000, oldPrice: 759000, rating: 4, isNew: true,
    name: { mn: "Ретро тоглоомын консол", en: "Retro Game Console" },
    description: {
      mn: "Сонгодог 100+ тоглоомтой, ТВ-д шууд холбогддог ретро консол.",
      en: "Retro console with 100+ classic games that plugs straight into your TV.",
    },
  }),
];

/** Sample own products, shown until erxes POS is connected. */
export const SAMPLE_OWN_PRODUCTS: CatalogProduct[] = [
  {
    _id: "own-1", unitPrice: 189000, imageUrl: "/images/product-11.jpg", own: true, sample: true, isNew: true,
    name: { mn: "Сарнай гар хийцийн үнэрт лаа", en: "Sarnai Handmade Scented Candle" },
    description: {
      mn: "Байгалийн шар лаа, сарнайн тосоор гараар цутгасан. 40 цаг асна.",
      en: "Hand-poured natural beeswax with rose oil. Burns for 40 hours.",
    },
  },
  {
    _id: "own-2", unitPrice: 359000, imageUrl: "/images/product-9.jpg", own: true, sample: true,
    name: { mn: "Сарнай арьсан цүнх", en: "Sarnai Leather Tote" },
    description: {
      mn: "Монгол үхрийн арьсаар хийсэн, өдөр тутмын том цүнх.",
      en: "An everyday tote made from Mongolian cowhide.",
    },
  },
  {
    _id: "own-3", unitPrice: 79000, imageUrl: "/images/product-8.jpg", own: true, sample: true,
    name: { mn: "Сарнай ноолуур бээлий", en: "Sarnai Cashmere Gloves" },
    description: {
      mn: "100% монгол ноолуур, зөөлөн бөгөөд дулаахан.",
      en: "100% Mongolian cashmere — soft and warm.",
    },
  },
  {
    _id: "own-4", unitPrice: 129000, imageUrl: "/images/product-10.jpg", own: true, sample: true,
    name: { mn: "Сарнай бэлгийн багц", en: "Sarnai Gift Set" },
    description: {
      mn: "Манай брэндийн шилдэг бүтээгдэхүүнүүдийг багтаасан бэлгийн хайрцаг.",
      en: "A gift box with the best of our own brand.",
    },
  },
];

/* =========================================================
   BLOOMIE — Product & flower data
   ========================================================= */

// Flower types available for custom bouquet builder
const FLOWERS = [
  { id:'rose',       name:'Rose',       img:'flower-rose.svg',       pricePerStem:15000 },
  { id:'tulip',      name:'Tulip',      img:'flower-tulip.svg',      pricePerStem:18000 },
  { id:'sunflower',  name:'Sunflower',  img:'flower-sunflower.svg',  pricePerStem:20000 },
  { id:'lily',       name:'Lily',       img:'flower-lily.svg',       pricePerStem:22000 },
  { id:'daisy',      name:'Daisy',      img:'flower-daisy.svg',      pricePerStem:12000 },
  { id:'anyelir',    name:'Anyelir',    img:'flower-anyelir.svg',    pricePerStem:10000 },
  { id:'gerbera',    name:'Gerbera',    img:'flower-gerbera.svg',    pricePerStem:14000 },
  { id:'hydrangea',  name:'Hydrangea',  img:'flower-hydrangea.svg',  pricePerStem:25000 },
  { id:'eucalyptus', name:'Eucalyptus', img:'flower-eucalyptus.svg', pricePerStem:8000  },
];

function getFlower(id){ return FLOWERS.find(f => f.id === id); }

// Bouquet sizes
const SIZES = [
  { id:'small',  label:'Small',  multiplier:1 },
  { id:'medium', label:'Medium', multiplier:1.4 },
  { id:'large',  label:'Large',  multiplier:1.9 },
];

// Product categories
const CATEGORIES = [
  { id:'all',         name:'Semua',       icon:'icon-pixel-flower.svg' },
  { id:'romance',      name:'Romance',     icon:'flower-rose.svg' },
  { id:'birthday',     name:'Ulang Tahun', icon:'flower-gerbera.svg' },
  { id:'graduation',   name:'Wisuda',      icon:'flower-sunflower.svg' },
  { id:'wedding',      name:'Pernikahan',  icon:'flower-lily.svg' },
  { id:'anniversary',  name:'Anniversary', icon:'flower-anyelir.svg' },
];

// Product catalog
const PRODUCTS = [
  {
    id:'p1', name:'Ruby Rose Bliss', category:'romance',
    img:'bouquet-rose-red.jpg', price:185000,
    desc:'Buket mawar merah premium, simbol cinta yang berani. Dibungkus kertas krep lembut dan pita satin pink.',
    flowers:['rose','eucalyptus'], badge:'Best Seller'
  },
  {
    id:'p2', name:'Blush Petal Dream', category:'romance',
    img:'bouquet-rose-pink.jpg', price:165000,
    desc:'Rangkaian mawar pink lembut dipadu eucalyptus, cocok untuk hadiah romantis maupun self-love.',
    flowers:['rose','eucalyptus','daisy'], badge:null
  },
  {
    id:'p3', name:'Tulip Cloud Charm', category:'birthday',
    img:'bouquet-tulip.jpg', price:175000,
    desc:'Tulip warna-warni yang ceria, sempurna untuk merayakan momen bahagia si dia.',
    flowers:['tulip','daisy'], badge:'New'
  },
  {
    id:'p4', name:'Sunny Golden Hug', category:'graduation',
    img:'bouquet-sunflower.jpg', price:150000,
    desc:'Sunflower cerah penuh semangat, cocok untuk hadiah wisuda atau ucapan semangat.',
    flowers:['sunflower','gerbera'], badge:null
  },
  {
    id:'p5', name:'Pastel Whimsy Mix', category:'birthday',
    img:'bouquet-mixed-pastel.svg', price:195000,
    desc:'Kombinasi bunga pastel: hydrangea, mawar, gerbera dan daisy — manis & girly banget.',
    flowers:['hydrangea','rose','gerbera','daisy'], badge:'Best Seller'
  },
  {
    id:'p6', name:'Ivory Lily Grace', category:'wedding',
    img:'bouquet-lily-white.jpg', price:210000,
    desc:'Lily putih elegan dengan sentuhan mawar pink, cocok untuk acara pernikahan atau ucapan duka cita penuh hormat.',
    flowers:['lily','rose','eucalyptus'], badge:null
  },
  {
    id:'p7', name:'Daisy Sunshine Pop', category:'birthday',
    img:'bouquet-daisy.jpg', price:120000,
    desc:'Buket daisy putih segar, simpel tapi manis, cocok untuk hadiah harian.',
    flowers:['daisy','gerbera'], badge:null
  },
  {
    id:'p8', name:'Anniversary Deep Love', category:'anniversary',
    img:'bouquet-anniversary.jpg', price:225000,
    desc:'Mawar merah dalam jumlah banyak dengan aksen putih, buket klasik untuk anniversary spesial.',
    flowers:['rose','daisy'], badge:'Best Seller'
  },
  {
    id:'p9', name:'Grad Sunflower Cheer', category:'graduation',
    img:'bouquet-graduation.jpg', price:160000,
    desc:'Sunflower & gerbera oranye cerah dengan lily putih, ucapan selamat wisuda yang meriah.',
    flowers:['sunflower','gerbera','lily'], badge:null
  },
  {
    id:'p10', name:'Lilac Wedding Charm', category:'wedding',
    img:'bouquet-wedding.jpg', price:230000,
    desc:'Lily putih & hydrangea lilac lembut, buket pengantin yang syahdu dan elegan.',
    flowers:['lily','hydrangea','eucalyptus'], badge:'New'
  },
  {
    id:'p11', name:'Anyelir Sweetheart', category:'anniversary',
    img:'bouquet-rose-pink.jpg', price:135000,
    desc:'Anyelir pink ruffled yang manis, tahan lama dan cocok untuk hadiah harian penuh kasih.',
    flowers:['anyelir','daisy'], badge:null
  },
  {
    id:'p12', name:'Tulip Romance Duo', category:'romance',
    img:'bouquet-tulip.jpg', price:180000,
    desc:'Tulip merah muda dipadu mawar, perpaduan romantis yang jarang ditemukan.',
    flowers:['tulip','rose'], badge:null
  },
];

// Special product representing a fully custom, build-your-own bouquet
const CUSTOM_PRODUCT = {
  id:'custom', name:'Buket Custom Kamu', category:'custom',
  img:'bouquet-mixed-pastel.svg', price:35000,
  desc:'Rangkaian bunga yang kamu susun sendiri, lengkap dengan kartu ucapan personal.',
  flowers:[], badge:'Custom'
};

function getProduct(id){
  if(id === 'custom') return CUSTOM_PRODUCT;
  return PRODUCTS.find(p => p.id === id);
}
function formatIDR(n){ return 'Rp' + n.toLocaleString('id-ID'); }

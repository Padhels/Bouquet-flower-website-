/* =========================================================
   BLOOMIE — shared app logic (cart, wishlist, auth, orders,
   navbar/footer rendering, toast, decorative animations)
   Everything is stored in localStorage — this is a front-end
   demo. Wire up a real backend + payment gateway (Midtrans /
   Xendit) for production QRIS & Virtual Account payments.
   ========================================================= */

const WA_NUMBER = '6285601854064';
const LS = {
  cart:'bloomie_cart', wishlist:'bloomie_wishlist',
  users:'bloomie_users', session:'bloomie_session', orders:'bloomie_orders'
};

/* ---------------- storage helpers ---------------- */
function readLS(key, fallback){
  try{ const v = JSON.parse(localStorage.getItem(key)); return v === null ? fallback : v; }
  catch(e){ return fallback; }
}
function writeLS(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

/* ---------------- CART ---------------- */
function getCart(){ return readLS(LS.cart, []); }
function saveCart(cart){ writeLS(LS.cart, cart); updateNavBadges(); }

function addToCart(item){
  // item: {productId, sizeId, flowerSelections:[{id,qty}], cardMessage, qty}
  const cart = getCart();
  item.cartId = 'ci_' + Date.now() + '_' + Math.floor(Math.random()*9999);
  cart.push(item);
  saveCart(cart);
  toast('Ditambahkan ke keranjang \u2713');
}
function removeFromCart(cartId){
  saveCart(getCart().filter(i => i.cartId !== cartId));
}
function updateCartItemQty(cartId, qty){
  const cart = getCart();
  const it = cart.find(i => i.cartId === cartId);
  if(it){ it.qty = Math.max(1, qty); saveCart(cart); }
}
function cartItemUnitPrice(item){
  const product = getProduct(item.productId);
  const size = SIZES.find(s => s.id === item.sizeId) || SIZES[0];
  let base = product ? product.price : 0;
  let flowersCost = 0;
  (item.flowerSelections||[]).forEach(sel => {
    const f = getFlower(sel.id);
    if(f) flowersCost += f.pricePerStem * sel.qty;
  });
  return Math.round((base + flowersCost) * size.multiplier);
}
function cartTotal(){
  return getCart().reduce((sum,i) => sum + cartItemUnitPrice(i) * i.qty, 0);
}
function cartCount(){
  return getCart().reduce((sum,i) => sum + i.qty, 0);
}

/* ---------------- WISHLIST ---------------- */
function getWishlist(){ return readLS(LS.wishlist, []); }
function isWished(productId){ return getWishlist().includes(productId); }
function toggleWishlist(productId){
  let list = getWishlist();
  if(list.includes(productId)){ list = list.filter(id => id !== productId); toast('Dihapus dari wishlist'); }
  else { list.push(productId); toast('Ditambahkan ke wishlist \u2661'); }
  writeLS(LS.wishlist, list);
  updateNavBadges();
  return list.includes(productId);
}

/* ---------------- AUTH ---------------- */
function getUsers(){ return readLS(LS.users, []); }
function saveUsers(u){ writeLS(LS.users, u); }
function getSession(){ return readLS(LS.session, null); }
function setSession(email){ writeLS(LS.session, email); }
function clearSession(){ localStorage.removeItem(LS.session); }
function getCurrentUser(){
  const email = getSession();
  if(!email) return null;
  return getUsers().find(u => u.email === email) || null;
}
function registerUser({name,email,password,phone}){
  const users = getUsers();
  if(users.some(u => u.email === email)) return {ok:false, msg:'Email sudah terdaftar. Coba masuk ya.'};
  users.push({ name, email, password, phone: phone||'', address:{ recipient:name, phone:phone||'', full:'', city:'', postal:'', notes:'' } });
  saveUsers(users);
  setSession(email);
  return {ok:true};
}
function loginUser(email, password){
  const user = getUsers().find(u => u.email === email && u.password === password);
  if(!user) return {ok:false, msg:'Email atau password salah.'};
  setSession(email);
  return {ok:true};
}
function logoutUser(){ clearSession(); location.href = 'index.html'; }
function updateProfile(fields){
  const users = getUsers();
  const user = users.find(u => u.email === getSession());
  if(!user) return false;
  Object.assign(user, fields);
  saveUsers(users);
  return true;
}
function updateAddress(address){
  const users = getUsers();
  const user = users.find(u => u.email === getSession());
  if(!user) return false;
  user.address = Object.assign({}, user.address, address);
  saveUsers(users);
  return true;
}
function requireAuth(redirectMsg){
  if(!getCurrentUser()){
    sessionStorage.setItem('bloomie_redirect_after_login', location.pathname.split('/').pop());
    location.href = 'login.html';
    return false;
  }
  return true;
}

/* ---------------- PAYMENT (mock) ----------------
   In production, replace this with a real call to a payment
   gateway (Midtrans / Xendit) that returns a genuine QRIS
   string or Virtual Account number from BRI / Mandiri / BNI. */
const BANKS = {
  bri:     { name:'BRI',     prefix:'26215' },
  mandiri: { name:'Mandiri', prefix:'88608' },
  bni:     { name:'BNI',     prefix:'8808'  },
};
function generateVaNumber(bankId){
  const bank = BANKS[bankId];
  let digits = '';
  for(let i=0;i<8;i++) digits += Math.floor(Math.random()*10);
  return bank.prefix + digits;
}

/* ---------------- ORDERS ---------------- */
function getOrders(){ return readLS(LS.orders, []); }
function getMyOrders(){
  const user = getCurrentUser();
  if(!user) return [];
  return getOrders().filter(o => o.userEmail === user.email).sort((a,b)=> b.createdAt - a.createdAt);
}
function placeOrder({items, address, payment, total}){
  const user = getCurrentUser();
  const orders = getOrders();
  const order = {
    id:'BLM' + Date.now().toString().slice(-8),
    userEmail: user ? user.email : 'guest',
    items, address, payment, total,
    status: payment.method === 'qris' ? 'pending' : 'pending',
    createdAt: Date.now()
  };
  orders.push(order);
  writeLS(LS.orders, orders);
  saveCart([]);
  return order;
}

/* ---------------- TOAST ---------------- */
function toast(msg){
  let el = document.querySelector('.toast');
  if(!el){
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(()=> el.classList.remove('show'), 2200);
}

/* ---------------- NAVBAR / FOOTER ---------------- */
function navHTML(active){
  const user = getCurrentUser();
  return `
  <div class="announce">Gratis ongkir untuk pemesanan di atas Rp300.000 \u2022 Antar hari ini kalau order sebelum jam 14.00</div>
  <nav class="navbar">
    <div class="nav-inner container">
      <a href="index.html" class="logo"><img src="assets/icons/pixel-flower.svg" class="logo-pixel" alt=""> Bloomie</a>
      <button class="hamburger" id="hamburgerBtn" aria-label="Menu"><img src="assets/icons/menu.svg" width="26" height="26" alt=""></button>
      <ul class="nav-links" id="navLinks">
        <li><a href="index.html" class="${active==='home'?'active':''}">Beranda</a></li>
        <li><a href="catalog.html" class="${active==='catalog'?'active':''}">Katalog</a></li>
        <li><a href="wishlist.html" class="${active==='wishlist'?'active':''}">Wishlist</a></li>
        <li><a href="orders.html" class="${active==='orders'?'active':''}">Pesanan Saya</a></li>
      </ul>
      <div class="nav-actions">
        <form class="search-box" id="navSearchForm" role="search">
          <img src="assets/icons/search.svg" width="18" height="18" alt="">
          <input type="text" id="navSearchInput" placeholder="Cari buket bunga..." aria-label="Cari">
        </form>
        <a href="wishlist.html" class="icon-btn" aria-label="Wishlist">
          <img src="assets/icons/heart-outline.svg" width="20" height="20" alt="">
          <span class="badge hidden" id="wishBadge">0</span>
        </a>
        <a href="cart.html" class="icon-btn" aria-label="Keranjang">
          <img src="assets/icons/cart.svg" width="20" height="20" alt="">
          <span class="badge hidden" id="cartBadge">0</span>
        </a>
        <a href="${user? 'profile.html':'login.html'}" class="icon-btn" aria-label="${user?'Profil':'Masuk'}">
          <img src="assets/icons/user.svg" width="20" height="20" alt="">
        </a>
      </div>
    </div>
  </nav>`;
}

function footerHTML(){
  return `
  <footer class="footer">
    <div class="container footer-grid">
      <div>
        <a href="index.html" class="logo"><img src="assets/icons/pixel-flower.svg" class="logo-pixel" alt=""> Bloomie</a>
        <p style="margin-top:10px;max-width:280px;color:var(--ink-soft)">Buket bunga segar untuk setiap momen manis kamu — dirangkai dengan cinta, diantar dengan cepat.</p>
      </div>
      <div>
        <h4>Belanja</h4>
        <ul><li><a href="catalog.html">Katalog</a></li><li><a href="wishlist.html">Wishlist</a></li><li><a href="cart.html">Keranjang</a></li></ul>
      </div>
      <div>
        <h4>Akun</h4>
        <ul><li><a href="profile.html">Profil</a></li><li><a href="orders.html">Riwayat Pesanan</a></li><li><a href="login.html">Masuk</a></li></ul>
      </div>
      <div>
        <h4>Hubungi Kami</h4>
        <ul><li><a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener">Chat WhatsApp</a></li><li>Senin\u2013Minggu, 08.00\u201320.00</li></ul>
      </div>
    </div>
    <p class="footer-bottom">\u00A9 ${new Date().getFullYear()} Bloomie. Dibuat dengan sepenuh hati untuk para pecinta bunga.</p>
  </footer>
  <a href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo Bloomie! Saya mau tanya soal buket bunga.')}" target="_blank" rel="noopener" class="wa-float" aria-label="Chat WhatsApp">
    <img src="assets/icons/whatsapp.svg" width="30" height="30" alt="">
  </a>`;
}

function updateNavBadges(){
  const cartBadge = document.getElementById('cartBadge');
  const wishBadge = document.getElementById('wishBadge');
  if(cartBadge){
    const c = cartCount();
    cartBadge.textContent = c;
    cartBadge.classList.toggle('hidden', c === 0);
  }
  if(wishBadge){
    const w = getWishlist().length;
    wishBadge.textContent = w;
    wishBadge.classList.toggle('hidden', w === 0);
  }
}

function renderChrome(active){
  const navPlaceholder = document.getElementById('navbar-placeholder');
  const footPlaceholder = document.getElementById('footer-placeholder');
  if(navPlaceholder) navPlaceholder.innerHTML = navHTML(active);
  if(footPlaceholder) footPlaceholder.innerHTML = footerHTML();

  const hamburger = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  if(hamburger && navLinks){
    hamburger.addEventListener('click', ()=> navLinks.classList.toggle('open'));
  }
  const searchForm = document.getElementById('navSearchForm');
  if(searchForm){
    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      const q = document.getElementById('navSearchInput').value.trim();
      location.href = 'catalog.html' + (q ? ('?q=' + encodeURIComponent(q)) : '');
    });
  }
  updateNavBadges();
}

/* ---------------- decorative petal fall ---------------- */
function initPetals(container, count){
  const colors = ['#FFC4DD','#D9C6F0','#FF8FBE','#FFF1DF'];
  container.classList.add('petal-fall');
  for(let i=0;i<count;i++){
    const p = document.createElement('span');
    p.className = 'petal';
    p.style.left = Math.random()*100 + '%';
    p.style.background = colors[i % colors.length];
    p.style.borderRadius = '0 60% 0 60%';
    p.style.animationDuration = (8 + Math.random()*8) + 's';
    p.style.animationDelay = (Math.random()*8) + 's';
    p.style.setProperty('--drift', (Math.random()*80-40) + 'px');
    container.appendChild(p);
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  updateNavBadges();
});

const whatsappNumber = "9647510615254";

const uiTranslations = {
  en: { 
    branch: "World of Chocolate", menuTitle: "Menu", foodTitle: "Food Menu", sweetsTitle: "Sweets", beverageTitle: "Beverages", hookahTitle: "Hookah", dir: "ltr",
    addBtn: "+ Add", selectedTitle: "Selected Items", totalLabel: "Total:", clearBtn: "Clear Selection", emptyCart: "No items selected yet.",
    feedbackBtn: "Feedback", feedbackTitle: "Customer Feedback", staff: "Staff", service: "Service", hygiene: "Cleanliness & Hygiene",
    overall: "Overall Experience", table: "Table Number", phone: "Contact Number", comments: "Additional Comments", sendBtn: "Send via WhatsApp"
  },
  ku: { 
    branch: "جیهانی چوکلێت", menuTitle: "مینۆ", foodTitle: "مینۆی خواردن", sweetsTitle: "شیرینییەکان", beverageTitle: "خواردنەوەکان", hookahTitle: "نێرگەلە", dir: "rtl",
    addBtn: "+ ئیزافە بکه", selectedTitle: "بڕگە هەڵبژێردراوەکان", totalLabel: "کۆی گشتی:", clearBtn: "سڕینەوەی هەمووی", emptyCart: "هیچ بڕگەیەک دیاری نەکراوە.",
    feedbackBtn: "ڕاوبۆچوون", feedbackTitle: "تێبینی و هەڵسەنگاندن", staff: "کارمەندان", service: "خزمەتگوزاری", hygiene: "پاکوخاوێنی",
    overall: "ئەزموونی گشتی", table: "ژمارەی مێز", phone: "ژمارەی پەیوەندی", comments: "تێبینی زیاتر", sendBtn: "ناردن لە ڕێگەی واتسئاپ"
  },
  ar: { 
    branch: "عالم الشوكولاتة", menuTitle: "القائمة", foodTitle: "قائمة الطعام", sweetsTitle: "الحلويات", beverageTitle: "المشروبات", hookahTitle: "الشيشة", dir: "rtl",
    addBtn: "+ إضـافة", selectedTitle: "العناصر المختارة", totalLabel: "المجموع:", clearBtn: "مسح الكل", emptyCart: "لم يتم اختيار أي عنصر.",
    feedbackBtn: "التقييم", feedbackTitle: "التقييم واللاحظات", staff: "الموظفين", service: "الخدمة", hygiene: "النظافة",
    overall: "التقييم العام", table: "رقم الطاولة", phone: "رقم التواصل", comments: "ملاحظات إضافية", sendBtn: "إرسال عبر الواتساب"
  }
};

const languageFileMap = {
  en: { food: 'cleaned_menu.json', sweets: 'sweets_cleaned.json', beverages: 'beverages.json', hookah: 'hookah.json' },
  ku: { food: 'Ku_food_menu.json', sweets: 'Ku_sweets_menu.json', beverages: 'Ku_beverage_menu.json', hookah: 'Ku_hookah.json' },
  ar: { food: 'Ar_food_menu.json', sweets: 'Ar_sweets_menu.json', beverages: 'Ar_beverage_menu.json', hookah: 'Ar_hookah.json' }
};

const categoryFaIcons = {
  'breakfast': 'fa-solid fa-egg',
  'meals': 'fa-solid fa-utensils',
  'salty crepe & sandwich': 'fa-solid fa-burger',
  'crepe': 'fa-solid fa-stroopwafel',
  'pancake': 'fa-solid fa-layer-group',
  'waffle': 'fa-solid fa-border-all',
  'profiterole': 'fa-solid fa-cookie-bite',
  'brownies and cookies': 'fa-solid fa-cookie',
  'brownies & cookies': 'fa-solid fa-cookie',
  'cheesecake': 'fa-solid fa-cheese',
  'fondant': 'fa-solid fa-fire-burner',
  'fruits & ice cream': 'fa-solid fa-ice-cream',
  'chocolate dubai item': 'fa-solid fa-gem',
  'sarayi dish': 'fa-solid fa-concierge-bell',
  'sarayi plate': 'fa-solid fa-concierge-bell',
  'latte': 'fa-solid fa-mug-saucer',
  'hot drinks': 'fa-solid fa-mug-hot',
  'hot chocolate': 'fa-solid fa-mug-hot',
  'espresso': 'fa-solid fa-cup-taster',
  'cold coffee': 'fa-solid fa-glass-water-droplet',
  'frappe': 'fa-solid fa-blender',
  'milkshake': 'fa-solid fa-whiskey-glass',
  'smoothies': 'fa-solid fa-faucet-drip',
  'frozen': 'fa-solid fa-snowflake',
  'fresh juice': 'fa-solid fa-lemon',
  'soft drinks': 'fa-solid fa-bottle-droplet',
  'iced teas': 'fa-solid fa-glass-water',
  'hookah': 'fa-solid fa-smoking',
  'normal hookah': 'fa-solid fa-smoking',
  'نێرگەلەی ئاسای': 'fa-solid fa-smoking',
  'الشيشة العادية': 'fa-solid fa-smoking'
};

let foodMenuCategories = [];
let sweetsMenuCategories = [];
let beverageMenuCategories = [];
let hookahMenuCategories = [];

let currentLang = localStorage.getItem('site_lang') || 'ku';
let currentPageType = 'MAIN';
let cart = JSON.parse(localStorage.getItem('site_cart') || '{}');

let ratings = { staff: 0, service: 0, hygiene: 0, overall: '' };

function safeDecode(val) {
  if (!val) return '';
  try { return decodeURIComponent(String(val)); } catch (e) { return String(val); }
}

function parseNumericPrice(price) {
  if (!price) return 0;
  if (typeof price === 'number') return price;
  const cleaned = String(price).replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

function getItemUniqueKey(item) {
  return item.id || item._id || item.name || item.title || safeDecode(item.name);
}

function saveCartToStorage() {
  localStorage.setItem('site_cart', JSON.stringify(cart));
}

function openFeedbackModal() {
  document.getElementById('feedback-modal-overlay').classList.add('active');
}

function closeFeedbackModal(e) {
  if (!e || e.target.id === 'feedback-modal-overlay' || e.currentTarget.classList.contains('close-modal-btn')) {
    document.getElementById('feedback-modal-overlay').classList.remove('active');
  }
}

function setRating(category, stars) {
  ratings[category] = stars;
  const container = document.getElementById(`stars-${category}`);
  if (!container) return;
  const btnList = container.querySelectorAll('.star-btn');
  btnList.forEach((btn, index) => {
    if (index < stars) btn.classList.add('active');
    else btn.classList.remove('active');
  });
}

function setEmoji(emojiVal) {
  ratings.overall = emojiVal;
  const container = document.getElementById('emojis-overall');
  if (!container) return;
  const btnList = container.querySelectorAll('.emoji-btn');
  btnList.forEach(btn => {
    if (btn.innerText.includes(emojiVal.split(' ')[0])) btn.classList.add('active');
    else btn.classList.remove('active');
  });
}

function sendFeedbackToWhatsApp() {
  const table = document.getElementById('feedback-table').value.trim();
  const phone = document.getElementById('feedback-phone').value.trim();
  const comments = document.getElementById('feedback-comments').value.trim();

  let msg = `*— Customer Feedback —*\n`;
  if (table) msg += `📍 *Table:* ${table}\n`;
  if (phone) msg += `📞 *Contact:* ${phone}\n`;
  msg += `\n`;
  msg += `⭐ *Staff:* ${ratings.staff ? ratings.staff + '/5' : 'N/A'}\n`;
  msg += `⭐ *Service:* ${ratings.service ? ratings.service + '/5' : 'N/A'}\n`;
  msg += `⭐ *Cleanliness & Hygiene:* ${ratings.hygiene ? ratings.hygiene + '/5' : 'N/A'}\n`;
  msg += `😊 *Overall:* ${ratings.overall || 'N/A'}\n`;
  if (comments) msg += `\n💬 *Comments:* ${comments}`;

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  closeFeedbackModal();
}

function addToCart(item) {
  const key = getItemUniqueKey(item);
  const rawName = item.name || item.title || '';
  const name = safeDecode(rawName);
  const priceNum = parseNumericPrice(item.price);

  if (!cart[key]) {
    cart[key] = { key: key, name: name, price: priceNum, qty: 1 };
  } else {
    cart[key].qty += 1;
  }
  saveCartToStorage();
  updateCartUI();
}

function removeFromCart(key) {
  if (cart[key]) {
    cart[key].qty -= 1;
    if (cart[key].qty <= 0) delete cart[key];
  }
  saveCartToStorage();
  updateCartUI();
}

function clearCart() {
  cart = {};
  saveCartToStorage();
  updateCartUI();
  closeCartModal();
}

function updateCartUI() {
  const cartKeys = Object.keys(cart);
  let totalQty = 0;
  let totalPrice = 0;

  cartKeys.forEach(k => {
    totalQty += cart[k].qty;
    totalPrice += cart[k].price * cart[k].qty;
  });

  const cartBar = document.getElementById('cart-bar');
  const t = uiTranslations[currentLang];

  if (cartBar) {
    if (totalQty > 0) {
      cartBar.style.display = 'flex';
      document.getElementById('cart-count').innerText = totalQty;
      document.getElementById('cart-total-price').innerText = totalPrice > 0 ? `${totalPrice.toLocaleString()} IQD` : '';
      document.getElementById('cart-bar-label').innerText = t.selectedTitle;
    } else {
      cartBar.style.display = 'none';
      closeCartModal();
    }
  }

  if (['FOOD_MENU', 'SWEETS_MENU', 'BEVERAGE_MENU', 'HOOKAH_MENU'].includes(currentPageType)) {
    renderMenuPageContent(currentPageType);
  }

  renderCartModalList();
}

function openCartModal() {
  if (Object.keys(cart).length === 0) return;
  renderCartModalList();
  document.getElementById('cart-modal-overlay').classList.add('active');
}

function closeCartModal(e) {
  if (!e || e.target.id === 'cart-modal-overlay' || e.currentTarget.classList.contains('close-modal-btn')) {
    document.getElementById('cart-modal-overlay').classList.remove('active');
  }
}

function renderCartModalList() {
  const container = document.getElementById('cart-items-list');
  if (!container) return;
  const t = uiTranslations[currentLang];

  document.getElementById('modal-title').innerText = t.selectedTitle;
  document.getElementById('modal-total-label').innerText = t.totalLabel;
  document.getElementById('modal-clear-btn').innerText = t.clearBtn;

  const keys = Object.keys(cart);
  if (keys.length === 0) {
    container.innerHTML = `<p style="color: #64748b; text-align: center; padding: 20px 0;">${t.emptyCart}</p>`;
    document.getElementById('modal-total-price').innerText = '0 IQD';
    return;
  }

  let totalPrice = 0;
  let html = '';

  keys.forEach(k => {
    const item = cart[k];
    const itemTotal = item.price * item.qty;
    totalPrice += itemTotal;

    html += `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-single-price">${item.price > 0 ? `${item.price.toLocaleString()} IQD` : ''}</div>
        </div>
        <div class="cart-item-actions">
          <div class="qty-controls">
            <button class="qty-btn" onclick="removeFromCart('${k}')">-</button>
            <span class="qty-count">${item.qty}</span>
            <button class="qty-btn" onclick="addToCart({ id: '${k}', name: '${encodeURIComponent(item.name)}', price: ${item.price} })">+</button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  document.getElementById('modal-total-price').innerText = `${totalPrice.toLocaleString()} IQD`;
}

function getBeverageIconByName(catName) {
  const name = String(catName).toLowerCase();
  if (name.includes('espresso') || name.includes('shot')) return 'fa-solid fa-cup-taster';
  if (name.includes('latte') || name.includes('cappuccino')) return 'fa-solid fa-mug-saucer';
  if (name.includes('hot chocolate')) return 'fa-solid fa-mug-hot';
  if (name.includes('hot')) return 'fa-solid fa-mug-hot';
  if (name.includes('shake')) return 'fa-solid fa-wine-glass';
  if (name.includes('smoothie') || name.includes('frappe')) return 'fa-solid fa-blender';
  if (name.includes('juice')) return 'fa-solid fa-lemon';
  if (name.includes('frozen')) return 'fa-solid fa-snowflake';
  if (name.includes('cold') || name.includes('iced')) return 'fa-solid fa-glass-water-droplet';
  if (name.includes('tea')) return 'fa-solid fa-glass-water';
  return 'fa-solid fa-bottle-droplet';
}

function parseMenuResponse(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.result && Array.isArray(data.result.categories)) return data.result.categories;
  if (Array.isArray(data.categories)) return data.categories;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.items)) return data.items;
  return Object.values(data).find(val => Array.isArray(val)) || [];
}

async function fetchJsonFile(filename) {
  try {
    const res = await fetch(filename);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

async function loadMenuData() {
  const files = languageFileMap[currentLang];
  const [foodRes, sweetsRes, beverageRes, hookahRes] = await Promise.all([
    fetchJsonFile(files.food),
    fetchJsonFile(files.sweets),
    fetchJsonFile(files.beverages),
    fetchJsonFile(files.hookah)
  ]);

  foodMenuCategories = parseMenuResponse(foodRes);
  sweetsMenuCategories = parseMenuResponse(sweetsRes);
  beverageMenuCategories = parseMenuResponse(beverageRes);
  hookahMenuCategories = parseMenuResponse(hookahRes);

  if (currentPageType !== 'MAIN') {
    renderMenuPageContent(currentPageType);
  }
}

function toggleLangMenu() {
  document.getElementById('lang-dropdown').classList.toggle('active');
}

window.addEventListener('click', function(e) {
  if (!e.target.closest('.lang-dropdown-wrapper')) {
    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) dropdown.classList.remove('active');
  }
});

async function changeLanguage(lang) {
  if (currentLang === lang) return;
  currentLang = lang;
  localStorage.setItem('site_lang', lang);
  applyTranslations();
  document.getElementById('lang-dropdown').classList.remove('active');
  await loadMenuData();
  updateCartUI();
}

function applyTranslations() {
  const t = uiTranslations[currentLang];
  const htmlRoot = document.getElementById('html-root');
  if (htmlRoot) htmlRoot.setAttribute('dir', t.dir);

  const setText = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };

  setText('current-lang-text', currentLang.toUpperCase());
  setText('branch-subtitle', t.branch);
  setText('feedback-btn-label', t.feedbackBtn);
  setText('feedback-modal-title', t.feedbackTitle);
  setText('lbl-staff', t.staff);
  setText('lbl-service', t.service);
  setText('lbl-hygiene', t.hygiene);
  setText('lbl-overall', t.overall);
  setText('lbl-table', t.table);
  setText('lbl-phone', t.phone);
  setText('lbl-comments', t.comments);
  setText('lbl-send-btn', t.sendBtn);
  setText('food-title', t.foodTitle);
  setText('sweets-title', t.sweetsTitle);
  setText('beverage-title', t.beverageTitle);
  setText('hookah-title', t.hookahTitle);
  
  if (currentPageType === 'FOOD_MENU') setText('nav-title', t.foodTitle);
  if (currentPageType === 'SWEETS_MENU') setText('nav-title', t.sweetsTitle);
  if (currentPageType === 'BEVERAGE_MENU') setText('nav-title', t.beverageTitle);
  if (currentPageType === 'HOOKAH_MENU') setText('nav-title', t.hookahTitle);
}

function scrollToSection(catName) {
  const decodedName = safeDecode(catName).trim();
  const sections = document.querySelectorAll('.section-title');
  for (let sec of sections) {
    if (sec.innerText.trim() === decodedName) {
      sec.scrollIntoView({ behavior: 'smooth' });
      return;
    }
  }
}

function getCategoryName(catObj) {
  if (!catObj) return '';
  if (typeof catObj === 'string') return safeDecode(catObj);
  const name = catObj.name || catObj.category_name || catObj.title || '';
  return safeDecode(name);
}

function renderCategoryIconMarkup(catObjOrName) {
  let catName = getCategoryName(catObjOrName);
  let imgUrl = null;
  if (typeof catObjOrName === 'object' && catObjOrName !== null) {
    imgUrl = catObjOrName.image_sm || catObjOrName.image_big || catObjOrName.category_icon || null;
  }
  const key = String(catName).trim().toLowerCase();
  const faIconClass = categoryFaIcons[key] || getBeverageIconByName(catName);

  if (imgUrl && imgUrl.trim() !== '') {
    return `<img src="${imgUrl}" alt="${catName}" onerror="this.outerHTML='<i class=\\'${faIconClass}\\'></i>'" />`;
  }
  return `<i class="${faIconClass}"></i>`;
}

async function initPage(pageType) {
  currentPageType = pageType;
  applyTranslations();
  await loadMenuData();
  updateCartUI();
}

function renderMenuPageContent(type) {
  const subTabsWrapper = document.getElementById('sub-tabs-wrapper');
  const container = document.getElementById('view-container');
  if (!container) return;

  let categories = [];
  if (type === 'FOOD_MENU') categories = foodMenuCategories;
  else if (type === 'SWEETS_MENU') categories = sweetsMenuCategories;
  else if (type === 'BEVERAGE_MENU') categories = beverageMenuCategories;
  else if (type === 'HOOKAH_MENU') categories = hookahMenuCategories;

  const sortedCategories = [...categories].sort((a, b) => (a.position || 0) - (b.position || 0));

  if (subTabsWrapper) {
    subTabsWrapper.innerHTML = sortedCategories.map(c => {
      const catName = getCategoryName(c);
      return `
        <button class="sub-tab-card" onclick="scrollToSection('${catName}')">
          <div class="icon-holder">${renderCategoryIconMarkup(c)}</div>
          <span>${catName}</span>
        </button>
      `;
    }).join('');
  }

  let sectionsHtml = '';
  sortedCategories.forEach(category => {
    const catName = getCategoryName(category);
    const rawItems = category.items || category.products || category.item_list || category.foods || [];
    const items = rawItems.filter(i => i.isActive !== false && i.isActive !== 0 && i.isActive !== "false");
    const sectionId = 'sec-' + catName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

    sectionsHtml += `
      <div id="${sectionId}">
        <h3 class="section-title">${catName}</h3>
        ${items.length === 0 ? '<p style="color: #64748b; padding: 10px 0; text-align: center;">هیچ بڕگەیەک بەردەست نییە.</p>' : ''}
        ${items.map(item => renderItemCard(item)).join('')}
      </div>
    `;
  });

  container.innerHTML = sectionsHtml;
}

function renderItemCard(item) {
  const priceVal = item.price ? (typeof item.price === 'number' ? `${item.price.toLocaleString()} IQD` : item.price) : '';
  let img = '';
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    img = item.images[0].thumbnail || item.images[0].url || '';
  }
  if (!img) img = item.image_url || item.image_sm || item.image_big || '';

  const name = safeDecode(item.name || item.title || '');
  const desc = safeDecode(item.description || item.desc || '');
  const key = getItemUniqueKey(item);
  const cartItem = cart[key];
  const t = uiTranslations[currentLang];

  const itemDataEscaped = JSON.stringify({
    id: key,
    name: encodeURIComponent(name),
    price: parseNumericPrice(item.price)
  }).replace(/"/g, '&quot;');

  let actionMarkup = '';
  if (cartItem && cartItem.qty > 0) {
    actionMarkup = `
      <div class="qty-controls">
        <button class="qty-btn" onclick="removeFromCart('${key}')">-</button>
        <span class="qty-count">${cartItem.qty}</span>
        <button class="qty-btn" onclick="addToCart(${itemDataEscaped})">+</button>
      </div>
    `;
  } else {
    actionMarkup = `<button class="add-btn" onclick="addToCart(${itemDataEscaped})">${t.addBtn}</button>`;
  }

  return `
    <div class="item-card">
      ${img ? `<img src="${img}" class="item-img" alt="${name}" onerror="this.style.display='none'" />` : ''}
      <div class="item-info">
        <div>
          <div class="item-name">${name}</div>
          ${desc ? `<div class="item-desc">${desc}</div>` : ''}
        </div>
        <div class="item-bottom-row">
          <div class="item-price">${priceVal}</div>
          ${actionMarkup}
        </div>
      </div>
    </div>
  `;
}
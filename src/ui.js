// src/ui.js — rendering & event handling
import {
  formatRupiah, filterProducts, computeSummary, cartAdd, cartSetQty, cartRemove,
  cartTotal, cartItemCount, validateCartStock, buildReceipt, buildWaUrl, validateProduct,
  hasErrors, generateId, CATEGORIES, CATEGORY_FILTERS,
} from './products.js';
import {
  state, subscribe, notify, loadProducts, saveProducts, resetProducts, addProduct,
  updateProduct, deleteProduct, createReceiptAndDeduct, clearCart, STORAGE_KEY,
} from './store.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

let root, toastTimer = null, cartSheetOpen = false, receiptOpen = false, formOpen = false, editingId = null, confirmCallback = null;

export function initUI(container) {
  root = container;
  root.innerHTML = `
    <a class="skip-link" href="#katalog">Lewati ke katalog</a>
    <header class="navbar">
      <div class="navbar-inner">
        <div class="logo">♨ KasirLokal</div>
        <nav class="nav-links">
          <button class="nav-link active" data-action="setView" data-view="catalog">Katalog</button>
          <button class="nav-link" data-action="setView" data-view="dashboard">Dashboard</button>
        </nav>
        <div class="nav-right">
          <button class="btn btn-manage" data-action="goDashboard">Kelola Produk</button>
          <button class="cart-nav-btn" id="cartNavBtn" data-action="openCartSheet" aria-label="Keranjang">🛒 <span class="cart-badge" id="cartBadge">0</span></button>
        </div>
      </div>
    </header>
    <div id="bannerSlot"></div>
    <main id="view" class="view"></main>
    <footer class="footer">KasirLokal · Data contoh, tanpa backend · 2026</footer>
    <div id="toastSlot"></div>
    <div id="modalSlot"></div>
  `;

  // events
  root.addEventListener('click', onClick);
  root.addEventListener('input', onInput);
  root.addEventListener('change', onChange);
  root.addEventListener('submit', onSubmit);
  root.addEventListener('keydown', onKeydown);

  subscribe(() => render());
  loadProducts();
  // storage warning banner
  if (state.storageWarning === 'parse') {
    showBanner('Data tersimpan tidak dapat dibaca. Data contoh dimuat; perubahan terakhir tidak tersimpan.');
  }
  render();
}

function showBanner(msg) {
  const slot = $('#bannerSlot', root);
  if (!slot) return;
  slot.innerHTML = `<div class="banner" role="alert"><span>${escapeHtml(msg)}</span><button class="banner-close" aria-label="Tutup banner" data-action="closeBanner">×</button></div>`;
}

function closeBanner() {
  const slot = $('#bannerSlot', root);
  if (slot) slot.innerHTML = '';
}

function showToast(msg) {
  const slot = $('#toastSlot', root);
  if (!slot) return;
  slot.innerHTML = `<div class="toast" role="status" aria-live="polite">${escapeHtml(msg)}</div>`;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { if (slot) slot.innerHTML = ''; }, 4000);
}

let currentView = 'catalog';
function setView(v) {
  currentView = v;
  $$('.nav-link', root).forEach((b) => b.classList.toggle('active', b.dataset.view === v));
  render();
}

function render() {
  const view = $('#view', root);
  if (!view) return;
  // cart badge
  const badge = $('#cartBadge', root);
  if (badge) badge.textContent = cartItemCount(state.cart);
  const btn = $('#cartNavBtn', root);
  if (btn) btn.setAttribute('aria-label', 'Keranjang, ' + cartItemCount(state.cart) + ' item');

  if (currentView === 'catalog') view.innerHTML = renderCatalogHtml();
  else view.innerHTML = renderDashboardHtml();
}

function renderCatalogHtml() {
  const filtered = filterProducts(state.products, state.query, state.category, state.sort);
  const summary = computeSummary(state.products);
  const totalProd = state.products.length;
  const totalStok = state.products.reduce((s, p) => s + (Number(p.stok) || 0), 0);
  let html = '';
  html += `<section class="hero">
    <div class="hero-text">
      <span class="hero-badge">POS & Pembukuan UMKM</span>
      <h1>Catat Cepat, Usaha Makin Hebat.</h1>
      <p>Kelola pesanan harian, pantau stok otomatis, dan cetak struk WhatsApp dalam satu layar.</p>
      <div class="hero-cta">
        <a class="btn btn-hero-solid" href="#katalog">Lihat menu</a>
        <button class="btn btn-hero-ghost" data-action="goDashboard">Kelola produk</button>
      </div>
    </div>
    <div class="hero-glass">
      <div class="hero-glass-title">Status toko hari ini</div>
      <div class="hero-glass-row"><span>Produk aktif</span><strong>${totalProd}</strong></div>
      <div class="hero-glass-row"><span>Stok tersedia</span><strong>${totalStok}</strong></div>
    </div>
  </section>`;

  html += `<section id="katalog" class="catalog-section">
    <div class="section-head">
      <h2>Katalog</h2>
      <span class="result-count" aria-live="polite" id="resultCount">${filtered.length} produk</span>
    </div>
    <div class="filter-bar">
      <div class="search-wrap">
        <span class="search-icon" aria-hidden="true"></span>
        <input type="search" id="searchInput" class="search-input" placeholder="Cari nama atau deskripsi…" value="${escapeHtml(state.query)}" aria-label="Pencarian produk" />
        ${state.query ? '<button class="search-clear" data-action="clearSearch" aria-label="Hapus kata kunci">×</button>' : ''}
      </div>
      <div class="chip-row">
        ${CATEGORY_FILTERS.map((c) => `<button class="chip ${state.category === c ? 'active' : ''}" data-action="setCategory" data-cat="${escapeHtml(c)}" aria-pressed="${state.category === c}">${escapeHtml(c)}</button>`).join('')}
      </div>
      <div class="sort-wrap">
        <label for="sortSelect" class="sort-label">Urutkan</label>
        <select id="sortSelect" class="sort-select" data-action="sortChange">
          <option value="unggulan" ${state.sort === 'unggulan' ? 'selected' : ''}>Unggulan dulu</option>
          <option value="nama" ${state.sort === 'nama' ? 'selected' : ''}>Nama A–Z</option>
          <option value="harga-asc" ${state.sort === 'harga-asc' ? 'selected' : ''}>Harga terendah</option>
          <option value="harga-desc" ${state.sort === 'harga-desc' ? 'selected' : ''}>Harga tertinggi</option>
        </select>
      </div>
    </div>`;

  if (filtered.length === 0) {
    html += `<div class="empty-state">
      <div class="empty-illu" aria-hidden="true">🔍</div>
      <h3>Produk tidak ditemukan</h3>
      <p>"${escapeHtml(state.query)}" tidak cocok dengan produk mana pun.</p>
      <button class="btn btn-secondary" data-action="resetSearch">Reset pencarian</button>
    </div>`;
  } else {
    html += `<div class="product-grid">`;
    for (const p of filtered) {
      html += renderProductCard(p);
    }
    html += `</div>`;
  }
  html += `</section>`;

  // cart aside (desktop) rendered separately; bottom bar
  html += renderCartAside();
  html += renderCartBottomBar();
  if (cartSheetOpen) html += renderCartSheet();
  if (receiptOpen) html += ''; // modal handled separately

  return html;
}

function renderProductCard(p) {
  const outOfStock = p.stok <= 0;
  const img = p.imageUrl ? p.imageUrl : '';
  return `<article class="product-card">
    <div class="product-img-wrap">
      ${p.unggulan ? '<span class="badge badge-unggulan">Unggulan</span>' : ''}
      ${outOfStock ? '<span class="badge badge-habis">Habis</span>' : ''}
      <img class="product-img" src="${escapeHtml(img || '/img/placeholder.svg')}" alt="${escapeHtml(p.nama)}" loading="lazy" onerror="this.onerror=null;this.src='/img/placeholder.svg';" />
    </div>
    <div class="product-body">
      <div class="product-cat">${escapeHtml(p.kategori)}</div>
      <h3 class="product-name">${escapeHtml(p.nama)}</h3>
      <div class="product-stock ${outOfStock ? 'stock-out' : ''}">
        <span class="stock-dot"></span>
        ${outOfStock ? 'Stok habis' : 'Stok: ' + p.stok}
      </div>
      <div class="product-footer">
        <div class="product-price">${formatRupiah(p.harga)}</div>
        <button class="btn btn-add ${outOfStock ? 'disabled' : ''}" ${outOfStock ? 'disabled aria-disabled="true"' : ''} data-action="addToCart" data-id="${escapeHtml(p.id)}">
          ${outOfStock ? 'Habis' : '+ Tambah'}
        </button>
      </div>
    </div>
  </article>`;
}

function renderCartAside() {
  return `<aside class="cart-aside">
    <div class="cart-header">Keranjang <span class="cart-count">${cartItemCount(state.cart)} item</span></div>
    <div class="cart-items">
      ${state.cart.length === 0 ? `<div class="cart-empty"><p>Keranjang masih kosong</p><p class="muted">Pilih produk untuk mulai pesanan.</p></div>` : state.cart.map((c) => renderCartItem(c)).join('')}
    </div>
    <div class="cart-footer">
      <div class="cart-total">Total <span>${formatRupiah(cartTotal(state.cart, state.products))}</span></div>
      <button class="btn btn-primary btn-block" data-action="openReceipt" ${state.cart.length === 0 ? 'disabled' : ''}>Buat struk</button>
      ${state.cart.length ? '<button class="link-btn" data-action="clearCart">Kosongkan</button>' : ''}
      <p class="disclaimer">Keranjang tidak tersimpan saat halaman dimuat ulang.</p>
    </div>
  </aside>`;
}

function renderCartItem(c) {
  const p = state.products.find((x) => x.id === c.productId);
  if (!p) return '';
  return `<div class="cart-item">
    <div class="cart-item-name">${escapeHtml(p.nama)}</div>
    <div class="cart-item-price">${formatRupiah(p.harga)}</div>
    <div class="stepper">
      <button class="step-btn" data-action="decQty" data-id="${escapeHtml(p.id)}" aria-label="Kurangi">−</button>
      <span class="step-qty">${c.qty}</span>
      <button class="step-btn" data-action="incQty" data-id="${escapeHtml(p.id)}" ${c.qty >= p.stok ? 'disabled' : ''} aria-label="Tambah">+</button>
    </div>
    <div class="cart-item-sub">${formatRupiah(p.harga * c.qty)}</div>
    <button class="icon-btn" data-action="removeItem" data-id="${escapeHtml(p.id)}" aria-label="Hapus ${escapeHtml(p.nama)} dari keranjang">🗑</button>
  </div>`;
}

function renderCartBottomBar() {
  if (state.cart.length === 0) return '';
  return `<div class="cart-bottom-bar">
    <div>${cartItemCount(state.cart)} item · ${formatRupiah(cartTotal(state.cart, state.products))}</div>
    <button class="btn btn-primary" data-action="openCartSheet">Lihat keranjang</button>
  </div>`;
}

function renderCartSheet() {
  return `<div class="sheet-overlay" data-action="closeCartSheet"></div>
  <div class="bottom-sheet" role="dialog" aria-modal="true" aria-label="Keranjang">
    <div class="sheet-grabber" aria-hidden="true"></div>
    <div class="sheet-header">Keranjang <span>${cartItemCount(state.cart)} item</span><button class="icon-btn" data-action="closeCartSheet" aria-label="Tutup">×</button></div>
    <div class="sheet-body">
      ${state.cart.length === 0 ? `<div class="cart-empty"><p>Keranjang masih kosong</p><p class="muted">Pilih produk untuk mulai pesanan.</p></div>` : state.cart.map((c) => renderCartItem(c)).join('')}
    </div>
    <div class="sheet-footer">
      <div class="cart-total">Total <span>${formatRupiah(cartTotal(state.cart, state.products))}</span></div>
      <button class="btn btn-primary btn-block" data-action="openReceipt" ${state.cart.length === 0 ? 'disabled' : ''}>Buat struk</button>
      <p class="disclaimer">Keranjang tidak tersimpan saat halaman dimuat ulang.</p>
    </div>
  </div>`;
}

function renderDashboardHtml() {
  const s = computeSummary(state.products);
  let html = '';
  html += `<section class="dash-header">
    <div>
      <h1>Dashboard katalog</h1>
      <p class="muted">Kelola ${state.products.length} produk contoh. Perubahan langsung tersimpan di perangkat ini.</p>
    </div>
    <div class="dash-actions">
      <button class="btn btn-danger-ghost" data-action="confirmReset">Reset data contoh</button>
      <button class="btn btn-primary" data-action="openForm" data-id="">+ Tambah produk</button>
    </div>
  </section>`;

  html += `<section class="summary-grid">
    <div class="summary-card"><div class="summary-num">${s.totalProduk}</div><div class="summary-label">Total produk</div></div>
    <div class="summary-card"><div class="summary-num">${s.totalStok}</div><div class="summary-label">Total stok</div></div>
    <div class="summary-card"><div class="summary-num ${s.produkHabis > 0 ? 'danger' : ''}">${s.produkHabis}</div><div class="summary-label">Produk habis</div></div>
    <div class="summary-card"><div class="summary-num">${formatRupiah(s.nilaiStok)}</div><div class="summary-label">Nilai stok</div></div>
  </section>`;

  // table / list
  if (state.products.length === 0) {
    html += `<div class="empty-state"><h3>Belum ada produk</h3><button class="btn btn-primary" data-action="openForm" data-id="">Tambah produk</button></div>`;
  } else {
    html += `<div class="table-wrap">
      <table class="product-table">
        <thead><tr><th>Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Unggulan</th><th>Aksi</th></tr></thead>
        <tbody>`;
    for (const p of state.products) {
      html += `<tr>
        <td class="td-prod"><img src="${escapeHtml(p.imageUrl || '/img/placeholder.svg')}" alt="" class="thumb" onerror="this.onerror=null;this.src='/img/placeholder.svg';" /> ${escapeHtml(p.nama)}</td>
        <td><span class="cat-chip">${escapeHtml(p.kategori)}</span></td>
        <td>${formatRupiah(p.harga)}</td>
        <td>${p.stok === 0 ? '<span class="badge badge-habis">Habis</span>' : p.stok}</td>
        <td>${p.unggulan ? '● ya' : '—'}</td>
        <td class="td-actions">
          <button class="link-btn" data-action="openForm" data-id="${escapeHtml(p.id)}">Edit</button>
          <button class="link-btn danger" data-action="confirmDelete" data-id="${escapeHtml(p.id)}">Hapus</button>
        </td>
      </tr>`;
    }
    html += `</tbody></table></div>`;

    // mobile cards
    html += `<div class="prod-cards">`;
    for (const p of state.products) {
      html += `<div class="prod-card">
        <img src="${escapeHtml(p.imageUrl || '/img/placeholder.svg')}" alt="" class="thumb-lg" onerror="this.onerror=null;this.src='/img/placeholder.svg';" />
        <div class="prod-card-body">
          <div class="prod-card-name">${escapeHtml(p.nama)}</div>
          <div class="prod-card-meta">${escapeHtml(p.kategori)} · ${formatRupiah(p.harga)} · ${p.stok === 0 ? 'Habis' : 'Stok: ' + p.stok}</div>
          ${p.unggulan ? '<div class="prod-card-badge">● Unggulan</div>' : ''}
        </div>
        <div class="prod-card-actions">
          <button class="link-btn" data-action="openForm" data-id="${escapeHtml(p.id)}">Edit</button>
          <button class="link-btn danger" data-action="confirmDelete" data-id="${escapeHtml(p.id)}">Hapus</button>
        </div>
      </div>`;
    }
    html += `</div>`;
  }

  if (formOpen) html += renderForm();
  if (confirmCallback) html += renderConfirmDialog();

  return html;
}

function renderForm() {
  const p = editingId ? state.products.find((x) => x.id === editingId) : null;
  const vals = p || { nama: '', kategori: 'Makanan', harga: '', stok: '', deskripsi: '', imageUrl: '', unggulan: false };
  // store form values in data attributes? We'll read from DOM on submit. Keep current values via state.formDraft? Simpler: render with values.
  const errors = state._formErrors || {};
  const showError = (k) => errors[k] ? `<div class="field-error">${escapeHtml(errors[k])}</div>` : '';
  return `<div class="drawer-overlay" data-action="closeForm"></div>
  <div class="drawer" role="dialog" aria-modal="true" aria-label="${editingId ? 'Edit produk' : 'Tambah produk'}">
    <div class="drawer-header">${editingId ? 'Edit produk' : 'Tambah produk'} <button class="icon-btn" data-action="closeForm" aria-label="Tutup">×</button></div>
    <div class="drawer-body">
      ${Object.keys(errors).length ? `<div class="form-summary-error">Periksa field yang ditandai.</div>` : ''}
      <form id="productForm" novalidate>
        <div class="field">
          <label>Nama <span class="req">Wajib</span></label>
          <input name="nama" type="text" value="${escapeHtml(vals.nama)}" maxlength="60" />
          ${showError('nama')}
        </div>
        <div class="field">
          <label>Kategori <span class="req">Wajib</span></label>
          <select name="kategori">
            ${CATEGORIES.map((c) => `<option value="${escapeHtml(c)}" ${vals.kategori === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
          </select>
          ${showError('kategori')}
        </div>
        <div class="field">
          <label>Harga <span class="req">Wajib</span></label>
          <div class="input-prefix"><span>Rp</span><input name="harga" type="text" inputmode="numeric" value="${escapeHtml(vals.harga === '' ? '' : vals.harga)}" /></div>
          <div class="helper">Tanpa titik atau desimal.</div>
          ${showError('harga')}
        </div>
        <div class="field">
          <label>Stok <span class="req">Wajib</span></label>
          <input name="stok" type="text" inputmode="numeric" value="${escapeHtml(vals.stok === '' ? '' : vals.stok)}" />
          <div class="helper">0–9999</div>
          ${showError('stok')}
        </div>
        <div class="field">
          <label>Deskripsi</label>
          <textarea name="deskripsi" rows="3" maxlength="160">${escapeHtml(vals.deskripsi)}</textarea>
          <div class="helper"><span id="descCount">${String(vals.deskripsi || '').length}</span>/160</div>
          ${showError('deskripsi')}
        </div>
        <div class="field">
          <label>Gambar</label>
          <input name="imageUrl" type="text" value="${escapeHtml(vals.imageUrl)}" placeholder="/img/produk/..." />
          <div class="helper">Kosongkan untuk memakai placeholder.</div>
          ${showError('imageUrl')}
        </div>
        <div class="field field-switch">
          <label>Unggulan</label>
          <label class="switch"><input type="checkbox" name="unggulan" ${vals.unggulan ? 'checked' : ''} /> <span>Tampilkan sebagai unggulan</span></label>
        </div>
      </form>
    </div>
    <div class="drawer-footer">
      <button class="btn btn-secondary" data-action="closeForm">Batal</button>
      <button class="btn btn-primary" data-action="submitForm">Simpan produk</button>
    </div>
  </div>`;
}

function renderConfirmDialog() {
  const info = state._confirmInfo || {};
  return `<div class="modal-overlay" data-action="closeConfirm"></div>
  <div class="modal" role="dialog" aria-modal="true">
    <h3>${escapeHtml(info.title || 'Konfirmasi')}</h3>
    <p>${escapeHtml(info.message || '')}</p>
    <div class="modal-actions">
      <button class="btn btn-secondary" data-action="closeConfirm">Batal</button>
      <button class="btn btn-danger" data-action="confirmAction">${escapeHtml(info.actionLabel || 'Ya')}</button>
    </div>
  </div>`;
}

function renderReceiptModal() {
  const cart = state._receiptCart || [];
  const { text } = buildReceipt(cart, state.products, 'KasirLokal');
  state._receiptText = text;
  const url = buildWaUrl(text);
  return `<div class="modal-overlay" data-action="closeReceipt"></div>
  <div class="modal modal-receipt" role="dialog" aria-modal="true" aria-label="Pratinjau struk">
    <div class="modal-header">Pratinjau struk <button class="icon-btn" data-action="closeReceipt" aria-label="Tutup">×</button></div>
    <div class="receipt-body">${escapeHtml(text).replace(/\n/g, '<br/>')}</div>
    <div class="modal-actions">
      <a class="btn btn-primary btn-block" href="${escapeHtml(url)}" target="_blank" rel="noopener" data-action="sendWa">Kirim via WhatsApp</a>
      <button class="btn btn-secondary btn-block" data-action="copyReceipt">Salin teks</button>
    </div>
    <p class="disclaimer">WhatsApp terbuka di tab baru. Nomor tujuan dipilih di aplikasi WhatsApp.</p>
    <div id="popupAlert" class="inline-alert" style="display:none">Tab WhatsApp tidak terbuka. Gunakan "Salin teks" lalu tempel di WhatsApp.</div>
  </div>`;
}

// ---------- Event handling ----------
function onClick(e) {
  const t = e.target.closest('[data-action]');
  if (!t) return;
  const action = t.dataset.action;
  switch (action) {
    case 'goDashboard': setView('dashboard'); break;
    case 'setView': setView(t.dataset.view); break;
    case 'closeBanner': closeBanner(); break;
    case 'clearSearch': state.query = ''; notify(); break;
    case 'setCategory': state.category = t.dataset.cat; notify(); break;
    case 'resetSearch':
      state.query = ''; state.category = 'Semua'; state.sort = 'unggulan'; notify(); break;
    case 'addToCart': {
      const id = t.dataset.id;
      const before = cartItemCount(state.cart);
      state.cart = cartAdd(state.cart, id, state.products);
      // validate stock adjust
      const { adjusted, warnings } = validateCartStock(state.cart, state.products);
      state.cart = adjusted;
      if (warnings.length) showToast(warnings.join(' '));
      notify();
      break;
    }
    case 'decQty': {
      const id = t.dataset.id;
      const item = state.cart.find((c) => c.productId === id);
      if (!item) break;
      if (item.qty <= 1) {
        state.cart = cartRemove(state.cart, id);
        showToast('Item dihapus dari keranjang.');
      } else {
        state.cart = cartSetQty(state.cart, id, item.qty - 1, state.products);
      }
      notify();
      break;
    }
    case 'incQty': {
      const id = t.dataset.id;
      const item = state.cart.find((c) => c.productId === id);
      if (!item) break;
      const p = state.products.find((x) => x.id === id);
      if (item.qty >= p.stok) { showToast('Stok tidak cukup'); break; }
      state.cart = cartSetQty(state.cart, id, item.qty + 1, state.products);
      notify();
      break;
    }
    case 'removeItem': {
      state.cart = cartRemove(state.cart, t.dataset.id);
      showToast('Item dihapus dari keranjang.');
      notify();
      break;
    }
    case 'clearCart': state.cart = []; notify(); break;
    case 'openCartSheet': cartSheetOpen = true; render(); break;
    case 'closeCartSheet': cartSheetOpen = false; render(); break;
    case 'openReceipt': {
      if (state.cart.length === 0) break;
      const { adjusted, warnings } = validateCartStock(state.cart, state.products);
      if (warnings.length) { state.cart = adjusted; showToast(warnings.join(' ')); notify(); }
      if (state.cart.length === 0) break;
      // snapshot for receipt
      state._receiptCart = state.cart.map((c) => ({ ...c }));
      state._receiptText = null;
      // deduct stock
      const res = createReceiptAndDeduct(state._receiptCart);
      if (!res.ok) { showToast('Stok tidak cukup.'); break; }
      // clear cart
      state.cart = [];
      receiptOpen = true;
      renderReceipt();
      notify();
      break;
    }
    case 'closeReceipt': receiptOpen = false; removeModal(); showToast('Struk dibuat. Stok diperbarui.'); notify(); break;
    case 'copyReceipt': copyReceiptText(); break;
    case 'sendWa': {
      // open already via href; check if popup blocked not detectable; show alert after delay
      setTimeout(() => {
        // if window still focused maybe blocked; best effort
      }, 500);
      break;
    }
    case 'openForm': {
      editingId = t.dataset.id || null;
      state._formErrors = {};
      formOpen = true;
      render();
      break;
    }
    case 'closeForm': {
      formOpen = false; editingId = null; state._formErrors = {};
      render();
      break;
    }
    case 'submitForm': {
      submitForm();
      break;
    }
    case 'confirmDelete': {
      const id = t.dataset.id;
      const p = state.products.find((x) => x.id === id);
      state._confirmInfo = {
        title: 'Hapus produk?',
        message: (p ? p.nama : 'Produk') + ' akan dihapus dari katalog. Bila ada di keranjang, item ikut dikeluarkan.',
        actionLabel: 'Hapus',
        onConfirm: () => {
          const res = deleteProduct(id);
          if (res && res.wasInCart) showToast('Produk dihapus. Item dikeluarkan dari keranjang.');
          else showToast('Produk dihapus.');
          formOpen = false; editingId = null;
          closeConfirm();
        },
      };
      confirmCallback = true;
      render();
      break;
    }
    case 'confirmReset': {
      state._confirmInfo = {
        title: 'Reset ke data contoh?',
        message: 'Semua perubahan akan diganti dengan 8 produk awal. Tindakan ini tidak dapat dibatalkan.',
        actionLabel: 'Reset',
        onConfirm: () => {
          resetProducts();
          showToast('Data direset.');
          closeConfirm();
        },
      };
      confirmCallback = true;
      render();
      break;
    }
    case 'confirmAction': {
      const info = state._confirmInfo;
      if (info && typeof info.onConfirm === 'function') info.onConfirm();
      break;
    }
    case 'closeConfirm': closeConfirm(); break;
  }
}

function closeConfirm() {
  state._confirmInfo = null;
  confirmCallback = null;
  render();
}

function onInput(e) {
  if (e.target && e.target.id === 'searchInput') {
    const pos = e.target.selectionStart;
    state.query = e.target.value;
    notify();
    const inp = $('#searchInput', root);
    if (inp) { inp.focus(); try { inp.setSelectionRange(pos, pos); } catch (err) {} }
  }
  if (e.target && e.target.name === 'deskripsi') {
    const c = $('#descCount', root);
    if (c) c.textContent = String(e.target.value.length);
  }
}

function onChange(e) {
  if (e.target && e.target.id === 'sortSelect') {
    state.sort = e.target.value;
    notify();
  }
}

function onSubmit(e) {
  e.preventDefault();
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    if (receiptOpen) { receiptOpen = false; removeModal(); }
    else if (formOpen) { formOpen = false; editingId = null; state._formErrors = {}; render(); }
    else if (cartSheetOpen) { cartSheetOpen = false; render(); }
    else if (confirmCallback) { closeConfirm(); }
  }
}

function submitForm() {
  const form = $('#productForm', root);
  if (!form) return;
  const fd = new FormData(form);
  const nama = String(fd.get('nama') || '').trim();
  const kategori = String(fd.get('kategori') || '');
  const hargaRaw = String(fd.get('harga') || '').trim();
  const stokRaw = String(fd.get('stok') || '').trim();
  const deskripsi = String(fd.get('deskripsi') || '');
  const imageUrl = String(fd.get('imageUrl') || '').trim();
  const unggulan = fd.get('unggulan') === 'on';

  // parse numbers
  const harga = hargaRaw === '' ? NaN : Number(hargaRaw);
  const stok = stokRaw === '' ? NaN : Number(stokRaw);

  const product = {
    id: editingId || '',
    nama,
    kategori,
    harga: Number.isFinite(harga) ? harga : hargaRaw,
    stok: Number.isFinite(stok) ? stok : stokRaw,
    deskripsi,
    imageUrl,
    unggulan,
  };

  // validate with numeric check: validateProduct expects numbers
  const existing = state.products;
  const errors = validateProduct(
    { ...product, harga: Number.isFinite(harga) ? harga : NaN, stok: Number.isFinite(stok) ? stok : NaN },
    existing,
    editingId
  );
  // extra: if hargaRaw not integer number
  if (!Number.isFinite(harga) || !Number.isInteger(harga)) errors.harga = 'Harga harus angka bulat 0–10.000.000.';
  if (!Number.isFinite(stok) || !Number.isInteger(stok)) errors.stok = 'Stok harus angka bulat 0–9999.';

  state._formErrors = errors;
  if (hasErrors(errors)) { render(); return; }

  // build final product
  const finalProduct = {
    nama,
    kategori,
    harga: Math.round(harga),
    stok: Math.round(stok),
    deskripsi,
    imageUrl,
    unggulan,
  };

  if (editingId) {
    const ok = updateProduct(editingId, finalProduct);
    if (ok) { showToast('Produk diperbarui.'); formOpen = false; editingId = null; state._formErrors = {}; render(); }
    else showToast('Penyimpanan gagal.');
  } else {
    const id = generateId(nama, state.products.map((p) => p.id));
    finalProduct.id = id;
    const ok = addProduct(finalProduct);
    if (ok) { showToast('Produk ditambahkan.'); formOpen = false; editingId = null; state._formErrors = {}; render(); }
    else showToast('Penyimpanan gagal.');
  }
}

function renderReceipt() {
  const slot = $('#modalSlot', root);
  if (!slot) return;
  slot.innerHTML = renderReceiptModal();
}

function removeModal() {
  const slot = $('#modalSlot', root);
  if (slot) slot.innerHTML = '';
}

async function copyReceiptText() {
  const text = state._receiptText || buildReceipt(state._receiptCart || [], state.products, 'KasirLokal').text;
  try {
    await navigator.clipboard.writeText(text);
    showToast('Teks disalin.');
  } catch (e) {
    showToast('Gagal menyalin. Silakan seleksi teks manual.');
  }
}


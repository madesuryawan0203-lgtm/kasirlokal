// src/store.js — penyimpanan localStorage + state aplikasi
import {
  SEED_PRODUCTS, parseStorage, makeEnvelope,
} from './products.js';

export const STORAGE_KEY = 'kasirlokal.products.v1';

export const state = {
  products: [],
  cart: [],
  query: '',
  category: 'Semua',
  sort: 'unggulan',
  storageWarning: null, // 'parse' | 'quota' | null
  lastError: null,
};

let listeners = [];
export function subscribe(fn) { listeners.push(fn); }
export function notify() { listeners.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } }); }

export function loadProducts() {
  let raw = null;
  try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) { raw = null; }
  if (raw == null) {
    const seeded = makeEnvelope(SEED_PRODUCTS);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded)); } catch (e) { /* ignore */ }
    state.products = seeded.products.map((p) => ({ ...p }));
    state.storageWarning = null;
    return;
  }
  const res = parseStorage(raw);
  if (!res.ok) {
    state.products = SEED_PRODUCTS.map((p) => ({ ...p }));
    state.storageWarning = 'parse';
    // do not overwrite; keep warning
    return;
  }
  if (res.data === null) {
    // empty handled above
    state.products = SEED_PRODUCTS.map((p) => ({ ...p }));
    return;
  }
  state.products = res.data.products.map((p) => ({ ...p }));
  state.storageWarning = null;
}

export function saveProducts() {
  const env = makeEnvelope(state.products);
  const json = JSON.stringify(env);
  try {
    localStorage.setItem(STORAGE_KEY, json);
    state.storageWarning = null;
    return true;
  } catch (e) {
    state.storageWarning = 'quota';
    notify();
    return false;
  }
}

export function resetProducts() {
  state.products = SEED_PRODUCTS.map((p) => ({ ...p }));
  saveProducts();
  // remove cart items that no longer exist
  const ids = new Set(state.products.map((p) => p.id));
  state.cart = state.cart.filter((c) => ids.has(c.productId));
  notify();
}

export function addProduct(p) {
  state.products = [...state.products, { ...p }];
  const ok = saveProducts();
  if (!ok) {
    // rollback
    state.products = state.products.slice(0, -1);
    notify();
    return false;
  }
  notify();
  return true;
}

export function updateProduct(id, patch) {
  const idx = state.products.findIndex((x) => x.id === id);
  if (idx < 0) return false;
  const prev = state.products[idx];
  const next = { ...prev, ...patch };
  const arr = state.products.slice();
  arr[idx] = next;
  const prevArr = state.products;
  state.products = arr;
  const ok = saveProducts();
  if (!ok) {
    state.products = prevArr;
    notify();
    return false;
  }
  notify();
  return true;
}

export function deleteProduct(id) {
  const removed = state.products.find((x) => x.id === id);
  const arr = state.products.filter((x) => x.id !== id);
  const prev = state.products;
  state.products = arr;
  const ok = saveProducts();
  if (!ok) {
    state.products = prev;
    notify();
    return false;
  }
  // remove from cart
  const wasInCart = state.cart.some((c) => c.productId === id);
  state.cart = state.cart.filter((c) => c.productId !== id);
  notify();
  return { removed, wasInCart };
}

export function createReceiptAndDeduct(cartItems) {
  for (const c of cartItems) {
    const p = state.products.find((x) => x.id === c.productId);
    if (!p || p.stok < c.qty) return { ok: false, reason: 'stock' };
  }
  const arr = state.products.map((p) => ({ ...p }));
  for (const c of cartItems) {
    const p = arr.find((x) => x.id === c.productId);
    p.stok -= c.qty;
  }
  const prev = state.products;
  state.products = arr;
  const ok = saveProducts();
  if (!ok) {
    state.products = prev;
    notify();
    return { ok: false, reason: 'quota' };
  }
  notify();
  return { ok: true };
}

export function clearCart() { state.cart = []; notify(); }

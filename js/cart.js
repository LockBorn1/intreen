// js/cart.js
const KEY = 'intreen_cart_v1';

function load(){ try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch(e){ return []; } }
function save(items){ localStorage.setItem(KEY, JSON.stringify(items)); }

export function getCart(){ return load(); }
export function clearCart(){ save([]); updateCartUI(); }
export function addToCart(item){
  const items = load();
  const existing = items.find(i => i.id === item.id);
  if (existing){ existing.qty += 1; } else { items.push({...item, qty: 1}); }
  save(items);
  showToast(`Added “${item.title}” to cart`);
  updateCartUI();
}
export function removeFromCart(id){
  let items = load().filter(i => i.id !== id);
  save(items); updateCartUI();
}
export function getCartCount(){ return load().reduce((a,b)=>a+b.qty,0); }
export function getCartTotal(){ return load().reduce((a,b)=>a + b.price*b.qty, 0); }

export function updateCartUI(){
  // Badge in navbar
  const badge = document.getElementById('cart-count-badge');
  if (badge){ badge.textContent = getCartCount(); badge.classList.toggle('hidden', getCartCount()===0); }
  // Total elements
  document.querySelectorAll('[data-cart-total]').forEach(el => el.textContent = `$${getCartTotal().toFixed(2)}`);
  // Line items on checkout
  const list = document.getElementById('checkout-items');
  if (list){
    const items = load();
    list.innerHTML = items.length ? '' : '<p class="text-slate-600">Your cart is empty.</p>';
    for (const it of items){
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between border-b border-slate-200 py-3';
      row.innerHTML = `<div><div class="font-medium">${it.title}</div><div class="text-sm text-slate-600">$${it.price.toFixed(2)} × ${it.qty}</div></div>
                       <button class="text-rose-700 underline" data-remove="${it.id}">Remove</button>`;
      list.appendChild(row);
    }
  }
}

export function wireRemoveButtons(){
  document.getElementById('checkout-items')?.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-remove]'); if(!btn) return;
    removeFromCart(btn.getAttribute('data-remove'));
  });
}

// Simple toast
let toastEl;
export function showToast(msg){
  if (!toastEl){
    toastEl = document.createElement('div');
    toastEl.className = 'fixed right-4 bottom-4 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-2xl opacity-0 translate-y-2 transition';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  requestAnimationFrame(()=>{ toastEl.classList.remove('opacity-0','translate-y-2'); });
  setTimeout(()=>{
    toastEl.classList.add('opacity-0','translate-y-2');
  }, 1600);
}

// Initialize navbar cart badge
document.addEventListener('DOMContentLoaded', updateCartUI);

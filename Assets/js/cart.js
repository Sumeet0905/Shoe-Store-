// cart.js - simple cart manager that stores normalized items in localStorage under 'cartProduct'
(function(window){
  const KEY = 'cartProduct';

  function normalizeItem(it){
    return {
      id: it.id,
      name: it.name || it.title || 'Product',
      price: Number(parseFloat(String(it.price).replace(/[^0-9.-]+/g,'')) || 0),
      qty: Number(it.qty || it.quantity || it.count || 1) || 1,
      img: it.img || it.imgSrc || it.image || './Assets/img/hero-image.png'
    };
  }

  function getCart(){
    try{ const raw = localStorage.getItem(KEY); if(!raw) return []; const parsed = JSON.parse(raw)||[]; return parsed.map(normalizeItem);}catch(e){return []}
  }

  function setCart(arr){ try{ localStorage.setItem(KEY, JSON.stringify(arr.map(normalizeItem))); }catch(e){console.error('setCart failed',e);} }

  function addItem(item){
    const cart = getCart();
    const found = cart.find(i=>String(i.id)===String(item.id));
    if(found){ found.qty = Number(found.qty || 1) + (Number(item.qty)||1); }
    else cart.push(normalizeItem(item));
    setCart(cart); return cart;
  }

  function updateQty(id, qty){ const cart = getCart(); const it = cart.find(i=>String(i.id)===String(id)); if(!it) return cart; it.qty = Number(qty)||1; setCart(cart); return cart; }
  function removeItem(id){ let cart = getCart(); cart = cart.filter(i=>String(i.id)!==String(id)); setCart(cart); return cart; }
  function clearCart(){ try{ localStorage.removeItem(KEY); }catch(e){} }
  function getTotal(){ const cart = getCart(); return cart.reduce((s,i)=>s + (Number(i.price)||0)*(Number(i.qty)||1), 0); }

  window.cart = { getCart, setCart, addItem, updateQty, removeItem, clearCart, getTotal, KEY };
  if (typeof exports !== 'undefined') Object.assign(exports, window.cart);
})(window);

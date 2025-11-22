// checkout.js - reads cart, renders checkout summary, computes totals and places order
(function(window){
  const ORDER_KEY = 'kiks_order';

  function renderCheckout(orderItemsId='orderItems', summaryIds={itemsCount:'itemsCount', subTotal:'subTotal', totalPrice:'totalPrice'}){
    const items = window.cart ? window.cart.getCart() : [];
    const container = document.getElementById(orderItemsId);
    if(!container) return;
    if(!items.length){ container.innerHTML = '<p class="muted">Your cart is empty.</p>'; return; }
    const html = items.map(i=>{
      return `<div class="order-item"><div class="oi-thumb"><img src="${i.img}"/></div><div class="oi-body"><div class="oi-name">${i.name}</div><div class="oi-meta"><label>Size</label><select class="size-select" data-id="${i.id}"><option>7</option><option>8</option></select><div class="oi-price">${window.utils.formatPrice(i.price)} x ${i.qty} = ${window.utils.formatPrice(i.price * i.qty)}</div></div></div></div>`;
    }).join('');
    container.innerHTML = html;
    // totals
    const subtotal = items.reduce((s,i)=>s + (Number(i.price)||0)*(Number(i.qty)||1), 0);
    const itemsCount = items.reduce((s,i)=>s + (Number(i.qty)||1), 0);
    const delivery = 5;
    const total = Number((subtotal + delivery).toFixed(2));
    try{ document.getElementById(summaryIds.itemsCount).textContent = itemsCount; }catch(e){}
    try{ document.getElementById(summaryIds.subTotal).textContent = window.utils.formatPrice(subtotal); }catch(e){}
    try{ document.getElementById(summaryIds.totalPrice).textContent = window.utils.formatPrice(total); }catch(e){}
  }

  async function placeOrder({address, sizes={}, onSuccess=null}){
    const items = window.cart ? window.cart.getCart() : [];
    if(!items.length) throw new Error('Cart empty');
    const subtotal = items.reduce((s,i)=>s + (Number(i.price)||0)*(Number(i.qty)||1), 0);
    const delivery = 5;
    const total = Number((subtotal + delivery).toFixed(2));
    const order = { items, address, sizes, created: new Date().toISOString(), status:'pending', subtotal, delivery, total };
    // save local copy
    try{ localStorage.setItem(ORDER_KEY, JSON.stringify(order)); }catch(e){ console.warn('local save failed',e); }
    // attempt to save to Firestore if available
    if(window.saveOrderToFirestore){
      try{ await window.saveOrderToFirestore(order); }catch(e){ console.warn('remote save failed',e); }
    }
    // optionally clear cart
    if(window.cart && typeof window.cart.clearCart==='function') window.cart.clearCart();
    if(typeof onSuccess==='function') onSuccess(order);
    return order;
  }

  window.checkout = { renderCheckout, placeOrder, ORDER_KEY };
  if (typeof exports !== 'undefined') Object.assign(exports, window.checkout);
})(window);

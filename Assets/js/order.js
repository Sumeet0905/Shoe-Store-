// order.js - show order success / details from saved order
(function(window){
  const KEY = 'kiks_order';
  function getSavedOrder(){ try{ return JSON.parse(localStorage.getItem(KEY))||null; }catch(e){return null} }
  function renderOrderSuccess(containerId='orderSummary'){ const o = getSavedOrder(); const el = document.getElementById(containerId); if(!el) return; if(!o) { el.innerHTML = '<p class="muted">No order found.</p>'; return; } el.innerHTML = `<h3>Order Placed</h3><div>Order total: ${window.utils ? window.utils.formatPrice(o.total): ('$'+(o.total||0))}</div><div>Placed: ${new Date(o.created).toLocaleString()}</div><div>Order id: ${o.id || 'N/A'}</div>`; }

  window.orderPage = { getSavedOrder, renderOrderSuccess };
  if (typeof exports !== 'undefined') Object.assign(exports, window.orderPage);
})(window);

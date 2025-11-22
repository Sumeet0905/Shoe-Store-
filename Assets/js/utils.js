// utils.js - small helpers used across the site
(function(window){
  function formatPrice(n){ return '$' + (Number(n)||0).toFixed(2); }
  function el(sel){ return document.querySelector(sel); }
  function showToast(msg, type='info'){ try { console.log('[toast]', type, msg); } catch(e){} }

  window.utils = { formatPrice, el, showToast };
  if (typeof exports !== 'undefined') exports.formatPrice = formatPrice;
})(window);

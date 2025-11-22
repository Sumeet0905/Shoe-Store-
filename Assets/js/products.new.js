// products.new.js - render products and wire Add to Cart
(function(window){
  // Simple sample products. You can replace with your existing shoesData or fetch from JSON.
  const products = [
    { id: 1, name: 'Adidas Falcon', price: 120.5, img: './Assets/img/Shoes/Yellow.png' },
    { id: 2, name: 'Nike Runner', price: 160.99, img: './Assets/img/Shoes/Blue%20Jordan.png' }
  ];

  function renderProducts(containerId='productsGrid'){
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = products.map(p=>`
      <article class="product-card">
        <div class="prod-image"><img src="${p.img}" alt="${p.name}"></div>
        <div class="prod-body">
          <div>
            <div class="prod-title">${p.name}</div>
            <div class="prod-price">${window.utils ? window.utils.formatPrice(p.price) : ('$'+p.price.toFixed(2))}</div>
          </div>
          <div class="prod-actions">
            <button class="action-btn add-cart" data-id="${p.id}">Add to cart</button>
          </div>
        </div>
      </article>
    `).join('');
    container.querySelectorAll('.add-cart').forEach(btn=> btn.addEventListener('click', ()=>{
      const id = btn.dataset.id; const product = products.find(x=>String(x.id)===String(id));
      if(!product) return; window.cart.addItem({ ...product, qty: 1 });
      window.utils && window.utils.showToast(product.name + ' added to cart');
      // update any cart badges if present
      try{ const el = document.getElementById('cartCount'); if(el) el.innerText = window.cart.getCart().length; }catch(e){}
    }));
  }

  window.myProducts = { renderProducts, products };
  if (typeof exports !== 'undefined') Object.assign(exports, window.myProducts);
})(window);

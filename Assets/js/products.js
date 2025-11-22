// lightweight products page logic: render, sort, wishlist & cart using localStorage
(function () {
    const PRODUCTS_KEY = 'kiks_products_demo';
    const CART_KEY = 'kiks_cart';
    const WISH_KEY = 'kiks_wishlist';

    // store intervals so we can clear them on re-render
    const imageIntervals = new Map();

    // sample product list (use site images where available)
    const sampleProducts = [
        { id: 'p1', name: 'Adidas Falcon Pink', price: 120.5, imgs: [
            './Assets/img/Shoes/Yellow.png',
            './Assets/img/Shoes/Yellow.png',
            './Assets/img/Shoes/Yellow.png'
        ], popularity: 98, createdAt: '2023-08-01' },
        { id: 'p2', name: 'Nike Runner Blue', price: 89.99, imgs: [
            './Assets/img/Shoes/Blue%20Jordan.png',
            './Assets/img/Shoes/Blue%20Jordan.png'
        ], popularity: 87, createdAt: '2023-09-10' },
        { id: 'p3', name: 'Puma Classic', price: 75.00, imgs: [
            './Assets/img/Shoes/blue-2.png',
            './Assets/img/Shoes/blue-2.png',
            './Assets/img/Shoes/blue-2.png'
        ], popularity: 70, createdAt: '2023-06-20' },
        { id: 'p4', name: 'Reebok Air', price: 140.00, imgs: [
            './Assets/img/Shoes/blue.png',
            './Assets/img/Shoes/blue.png'
        ], popularity: 65, createdAt: '2023-11-01' },
        { id: 'p5', name: 'New Balance Elite', price: 99.50, imgs: [
            './Assets/img/Shoes/lemon%20green.png',
            './Assets/img/Shoes/lemon%20green.png'
        ], popularity: 80, createdAt: '2023-07-12' },
        { id: 'p6', name: 'Vans Casual', price: 64.20, imgs: [
            './Assets/img/Shoes/red.png',
            './Assets/img/Shoes/red.png'
        ], popularity: 60, createdAt: '2023-05-02' },
        { id: 'p7', name: 'Classic High Top', price: 110.00, imgs: [
            './Assets/img/Shoes/pink.png',
            './Assets/img/Shoes/pink.png'
        ], popularity: 72, createdAt: '2023-10-05' },
        { id: 'p8', name: 'Street Runner', price: 95.00, imgs: [
            './Assets/img/Shoes/Cyan.png',
            './Assets/img/Shoes/Cyan.png'
        ], popularity: 75, createdAt: '2023-09-20' }
    ];

    // initialise products (persisted option)
    function getProducts() {
        return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || sampleProducts;
    }
    // storage helpers
    function getCart() { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    function setCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartBadge(); }
    function getWishlist() { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; }
    function setWishlist(w) { localStorage.setItem(WISH_KEY, JSON.stringify(w)); updateWishBadge(); }

    // clear image intervals
    function clearImageIntervals(){
        imageIntervals.forEach(iv => {
            try { clearInterval(iv); clearTimeout(iv); } catch(e){}
        });
        imageIntervals.clear();
    }

    // render grid
    function renderProducts(list) {
        // clear previous intervals and grid
        clearImageIntervals();
        const grid = document.getElementById('productsGrid');
        if (!grid) return;
        grid.innerHTML = '';
        const columns = getGridColumns(); // responsive column count (approx)
        list.forEach((p, idx) => {
            const card = document.createElement('article');
            card.className = 'product-card';
            // use first image as initial
            const firstImg = (p.imgs && p.imgs.length) ? p.imgs[0] : (p.img || './Assets/img/hero-image.png');
            card.innerHTML = `
                <div class="prod-image"><img class="cycle-img" src="${firstImg}" alt="${p.name}"></div>
                <div class="prod-body">
                    <div>
                        <div class="prod-title">${p.name}</div>
                        <div class="prod-price">$${p.price.toFixed(2)}</div>
                    </div>
                    <div class="prod-actions">
                        <button class="action-btn add-cart" data-id="${p.id}"><span class="material-symbols-outlined">shopping_bag</span> Add to cart</button>
                        <button class="icon-btn wish-btn" data-id="${p.id}" title="Add to wishlist"><span class="material-symbols-outlined">favorite</span></button>
                    </div>
                </div>
            `;
            grid.appendChild(card);

            // setup image cycling if multiple images exist
            if (p.imgs && p.imgs.length > 1) {
                const imgEl = card.querySelector('.cycle-img');
                let current = 0;
                // row index (0-based). For grid with 'columns' columns
                const rowIndex = Math.floor(idx / columns);
                // interval: first row 3s, next 5s, then +2s each row
                const intervalMs = (3 + rowIndex * 2) * 1000;
                // start cycling but offset tiny random to avoid simultaneous flips
                const startDelay = 60 + (rowIndex * 30);
                const timeoutId = setTimeout(() => {
                    // set interval that rotates images
                    const intervalId = setInterval(() => {
                        current = (current + 1) % p.imgs.length;
                        imgEl.src = p.imgs[current];
                    }, intervalMs);
                    imageIntervals.set(p.id, intervalId);
                }, startDelay);
                // keep timeout id in Map to clear on re-render as well
                imageIntervals.set(p.id + '_timeout', timeoutId);
            }
        });
        attachProductListeners();
    }

    // attempt to detect number of columns from CSS grid or screen width
    function getGridColumns(){
        if (document.querySelector('.products-grid')) {
            // try to read computed gridTemplateColumns
            const grid = document.querySelector('.products-grid');
            const cols = window.getComputedStyle(grid).gridTemplateColumns;
            if (cols) return cols.split(' ').length;
        }
        // fallback
        if (window.matchMedia('(max-width:780px)').matches) return 1;
        if (window.matchMedia('(max-width:1199px)').matches) return 2;
        return 4;
    }

    // event listeners
    function attachProductListeners() {
        document.querySelectorAll('.add-cart').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                addToCart(id);
            };
        });
        document.querySelectorAll('.wish-btn').forEach(btn => {
            const id = btn.dataset.id;
            const isActive = getWishlist().some(i => i.id === id);
            btn.classList.toggle('active', isActive);
            btn.onclick = (e) => {
                const pid = e.currentTarget.dataset.id;
                toggleWish(pid, e.currentTarget);
            };
        });
    }

    function addToCart(productId) {
        const products = getProducts();
        const product = products.find(p => p.id === productId);
        if (!product) return;
        const cart = getCart();
        const found = cart.find(i => i.id === productId);
        if (found) {
            found.qty = (found.qty || 1) + 1;
        } else {
            // Ensure a singular `img` property is present for cart rendering
            const imgSrc = product.img || (product.imgs && product.imgs.length ? product.imgs[0] : './Assets/img/hero-image.png');
            const item = { ...product, img: imgSrc, qty: 1 };
            cart.push(item);
        }
        setCart(cart);
        showToast(`${product.name} added to cart`);
    }

    function toggleWish(productId, btnEl) {
        const products = getProducts();
        const product = products.find(p => p.id === productId);
        if (!product) return;
        let wish = getWishlist();
        const exists = wish.find(i => i.id === productId);
        if (exists) {
            wish = wish.filter(i => i.id !== productId);
            btnEl.classList.remove('active');
            showToast(`${product.name} removed from wishlist`);
        } else {
            wish.push(product);
            btnEl.classList.add('active');
            showToast(`${product.name} added to wishlist`);
        }
        setWishlist(wish);
    }

    // sort utilities
    function sortProducts(mode) {
        const list = [...getProducts()];
        if (mode === 'low') list.sort((a,b) => a.price - b.price);
        else if (mode === 'high') list.sort((a,b) => b.price - a.price);
        else if (mode === 'latest') list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        else list.sort((a,b) => b.popularity - a.popularity);
        return list;
    }

    // toast
    function showToast(message) {
        const toastEl = document.getElementById('actionToast');
        if (toastEl && window.bootstrap && bootstrap.Toast) {
            const t = new bootstrap.Toast(toastEl);
            document.getElementById('actionToastBody').textContent = message;
            t.show();
        } else {
            // fallback alert
            console.info(message);
        }
    }

    // badges
    function updateCartBadge() {
        const count = getCart().reduce((s,i) => s + (i.qty||1), 0);
        const el = document.getElementById('cartCountNav');
        if (el) { el.textContent = count ? count : ''; }
    }
    function updateWishBadge() {
        const count = getWishlist().length;
        const el = document.getElementById('wishCount');
        if (el) { el.textContent = count ? count : ''; }
    }

    // init
    document.addEventListener('DOMContentLoaded', () => {
        // render default (popularity)
        const initial = sortProducts('popular');
        renderProducts(initial);
        updateCartBadge();
        updateWishBadge();

        const sort = document.getElementById('sortSelect');
        if (sort) {
            sort.addEventListener('change', (e) => {
                const sorted = sortProducts(e.target.value);
                renderProducts(sorted);
            });
        }

        // re-render on resize to adapt row timing
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const sel = document.getElementById('sortSelect');
                const mode = sel ? sel.value : 'popular';
                const currentSorted = sortProducts(mode);
                renderProducts(currentSorted);
            }, 250);
        });
    });

})();
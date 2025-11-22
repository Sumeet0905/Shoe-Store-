// firebaseConfig.js
// Lightweight Firebase initializer. Call initFirebase(yourConfig) early on pages that need Firestore/Auth.
// This file uses dynamic imports of the modular Firebase SDK so pages can remain non-module.
(function(window){
  const STATE = { app: null, db: null, auth: null };

  async function initFirebase(config){
    if (!config) throw new Error('Firebase config required.');
    if (STATE.app) return STATE; // already initialized
    const [{ initializeApp }, { getFirestore }, { getAuth }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js'),
      import('https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js')
    ]);
    STATE.app = initializeApp(config);
    STATE.db = getFirestore(STATE.app);
    STATE.auth = getAuth(STATE.app);
    window.__firebase = STATE; // convenience
    return STATE;
  }

  // helper to save an order (uses addDoc internally if Firestore available)
  async function saveOrderToFirestore(order){
    if (!STATE.db) throw new Error('Firebase not initialized. Call initFirebase(config) first.');
    const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js');
    const ref = await addDoc(collection(STATE.db, 'orders'), order);
    return ref;
  }

  window.initFirebase = initFirebase;
  window.saveOrderToFirestore = saveOrderToFirestore;
  // also export for module consumers
  if (typeof exports !== 'undefined') {
    exports.initFirebase = initFirebase;
    exports.saveOrderToFirestore = saveOrderToFirestore;
  }
})(window);

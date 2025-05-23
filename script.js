document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cart-items');
  const totalPriceElement = document.getElementById('total-price');
  const proceedPaymentBtn = document.getElementById('proceed-payment-btn');
  const toggleCartBtn = document.getElementById('toggle-cart-btn');
  const cartContainer = document.getElementById('cart-container');

  function updateTotal() {
    let total = 0;
    const cartItems = cartItemsContainer.querySelectorAll('.cart-item');
    cartItems.forEach(item => {
      const price = parseFloat(item.getAttribute('data-price'));
      const quantity = parseInt(item.getAttribute('data-quantity'));
      if (!isNaN(price) && !isNaN(quantity)) {
        total += price * quantity;
      }
    });
    totalPriceElement.textContent = total.toFixed(2);
  }

  function createCartItem(productId, name, price) {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', productId);
    cartItem.setAttribute('data-price', price);
    cartItem.setAttribute('data-quantity', '1');
    cartItem.innerHTML = `
      <span>${name}</span> 
      <span>Precio: $${price.toFixed(2)} x 1</span>
      <button class="remove-item-btn">Eliminar</button>
    `;
    return cartItem;
  }

  function addToCart(productId, name, price) {
    const existingItem = cartItemsContainer.querySelector(`.cart-item[data-id="${productId}"]`);
    if (existingItem) {
      let quantity = parseInt(existingItem.getAttribute('data-quantity'));
      quantity++;
      existingItem.setAttribute('data-quantity', quantity);
      const priceSpan = existingItem.querySelector('span:nth-child(2)');
      priceSpan.textContent = `Precio: $${price.toFixed(2)} x ${quantity}`;
    } else {
      const newItem = createCartItem(productId, name, price);
      cartItemsContainer.appendChild(newItem);
    }
    updateTotal();
  }

  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const productCard = e.target.closest('.product-card');
      const productId = productCard.getAttribute('data-id');
      const name = productCard.getAttribute('data-name');
      const price = parseFloat(productCard.getAttribute('data-price'));
      addToCart(productId, name, price);
    });
  });

  cartItemsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-item-btn')) {
      const cartItem = event.target.closest('.cart-item');
      if (cartItem) {
        cartItem.remove();
        updateTotal();
      }
    }
  });

  // Proceder al pago
  proceedPaymentBtn.addEventListener('click', () => {
    const total = parseFloat(totalPriceElement.textContent);

    if (cartItemsContainer.children.length === 0 || isNaN(total) || total === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    alert(`Pago realizado con éxito.\nTotal: $${total.toFixed(2)}\nGracias por comprar en Papu Shops.`);

    // Vaciar carrito
    cartItemsContainer.innerHTML = '';
    updateTotal();
  });

  // Toggle carrito
  toggleCartBtn.addEventListener('click', () => {
    cartContainer.style.display = cartContainer.style.display === 'block' ? 'none' : 'block';
  });

  updateTotal();
});

// Toggle del formulario de contacto
const toggleContactBtn = document.getElementById('toggle-contact-btn');
const contactContainer = document.getElementById('contact-container');

toggleContactBtn.addEventListener('click', () => {
  contactContainer.style.display = contactContainer.style.display === 'block' ? 'none' : 'block';
});

// Envío con alerta
document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const form = this;

  fetch(form.action, {
    method: "POST",
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  }).then(response => {
    if (response.ok) {
      alert("✅ Su duda ha sido enviada. No tardaremos en atenderlo.");
      form.reset();
    } else {
      alert("❌ Ocurrió un error. Intente más tarde.");
    }
  });
});

// =========================
// THEME SWITCH
// =========================

const themeSwitch = document.querySelector('.theme-switch');

if (themeSwitch) {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  themeSwitch.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    const isDark = document.body.classList.contains('dark-theme');

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}


// =========================
// BURGER MENU
// =========================

const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('active');

    burger.classList.toggle('active', isOpen);
    document.body.classList.toggle('menu-open', isOpen);

    burger.setAttribute(
      'aria-label',
      isOpen ? 'Close menu' : 'Open menu'
    );
  });

  const navLinks = nav.querySelectorAll('a');

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('active');
      document.body.classList.remove('menu-open');

      burger.setAttribute('aria-label', 'Open menu');
    });
  });
}


// =========================
// FAVORITE COFFEE SLIDER
// =========================

const coffeeSlide = document.querySelector('.coffee-slide');
const prevButton = document.querySelector('.slider-arrow-left');
const nextButton = document.querySelector('.slider-arrow-right');

if (coffeeSlide && prevButton && nextButton) {

  const coffeeImage = coffeeSlide.querySelector('.coffee-image');
  const coffeeTitle = coffeeSlide.querySelector('h3');
  const coffeeDescription = coffeeSlide.querySelector('p');
  const coffeePrice = coffeeSlide.querySelector('.coffee-price');

  const sliderControls =
    coffeeSlide.querySelectorAll('.slider-control');


  // -------------------------
  // COFFEE DATA
  // -------------------------

  const coffees = [
    {
      image: './assets/images/coffee-slider-1.png',
      alt: "S'mores Frappuccino",
      title: "S'mores Frappuccino",
      description:
        'This new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.',
      price: '$5.50',
    },

    {
      image: './assets/images/coffee-slider-2.png',
      alt: 'Caramel Macchiato',
      title: 'Caramel Macchiato',
      description:
        'Fragrant and unique classic espresso with rich caramel-peanut syrup, with cream under whipped thick foam.',
      price: '$5.00',
    },

    {
      image: './assets/images/coffee-slider-3.png',
      alt: 'Ice coffee',
      title: 'Ice coffee',
      description:
        'A popular summer drink that tones and invigorates. Prepared from coffee, milk and ice.',
      price: '$4.50',
    },
  ];


  let currentSlide = 0;
  let isAnimating = false;

  const AUTO_SLIDE_DELAY = 5000;
let autoSlideTimer;


  // =========================
  // UPDATE SLIDE
  // =========================

  function updateSlide() {
    const coffee = coffees[currentSlide];

    coffeeImage.src = coffee.image;
    coffeeImage.alt = coffee.alt;

    coffeeTitle.textContent = coffee.title;
    coffeeDescription.textContent = coffee.description;
    coffeePrice.textContent = coffee.price;


    // Update indicators

    sliderControls.forEach((control, index) => {
      control.classList.toggle(
        'active',
        index === currentSlide
      );
    });
  }


  // =========================
  // ANIMATE SLIDE
  // =========================

  function changeSlide(newIndex, direction) {

    // Prevent multiple clicks during animation
    if (isAnimating) {
      return;
    }

    isAnimating = true;


    const moveOut =
      direction === 'next' ? '-30px' : '30px';

    const moveIn =
      direction === 'next' ? '30px' : '-30px';


    // First animation:
    // current slide disappears

    const hideAnimation = coffeeSlide.animate(
      [
        {
          opacity: 1,
          transform: 'translateX(0)',
        },
        {
          opacity: 0,
          transform: `translateX(${moveOut})`,
        },
      ],
      {
        duration: 250,
        easing: 'ease-in',
        fill: 'forwards',
      }
    );


    hideAnimation.onfinish = () => {

      currentSlide = newIndex;

      updateSlide();


      // Second animation:
      // new slide appears

      const showAnimation = coffeeSlide.animate(
        [
          {
            opacity: 0,
            transform: `translateX(${moveIn})`,
          },
          {
            opacity: 1,
            transform: 'translateX(0)',
          },
        ],
        {
          duration: 350,
          easing: 'ease-out',
          fill: 'forwards',
        }
      );


      showAnimation.onfinish = () => {
        isAnimating = false;
      };
    };
  }


  // =========================
  // NEXT BUTTON
  // =========================

  nextButton.addEventListener('click', () => {

    const nextSlide =
      (currentSlide + 1) % coffees.length;

    changeSlide(nextSlide, 'next');
  });


  // =========================
  // PREVIOUS BUTTON
  // =========================

  prevButton.addEventListener('click', () => {

    const previousSlide =
      (currentSlide - 1 + coffees.length)
      % coffees.length;

    changeSlide(previousSlide, 'prev');
  });


  // =========================
  // INITIAL SLIDE
  // =========================

 

// =========================
// MOBILE SWIPE
// =========================

let touchStartX = 0;
let touchEndX = 0;

coffeeSlide.addEventListener(
  'touchstart',
  (event) => {
    touchStartX = event.changedTouches[0].screenX;
  },
  { passive: true }
);

coffeeSlide.addEventListener(
  'touchend',
  (event) => {
    touchEndX = event.changedTouches[0].screenX;

    handleSwipe();
  },
  { passive: true }
);

function handleSwipe() {
  const swipeDistance = touchStartX - touchEndX;

  // Ignore small accidental movements
  if (Math.abs(swipeDistance) < 50) {
    return;
  }

  // Swipe left → next coffee
  if (swipeDistance > 0) {
    const nextSlide =
      (currentSlide + 1) % coffees.length;

    changeSlide(nextSlide, 'next');
  }

  // Swipe right → previous coffee
  else {
    const previousSlide =
      (currentSlide - 1 + coffees.length)
      % coffees.length;

    changeSlide(previousSlide, 'prev');
  }
}

 
// =========================
// AUTO SLIDER
// =========================

function startAutoSlide() {
  clearInterval(autoSlideTimer);

  autoSlideTimer = setInterval(() => {
    if (isAnimating) {
      return;
    }

    const nextSlide =
      (currentSlide + 1) % coffees.length;

    changeSlide(nextSlide, 'next');
  }, AUTO_SLIDE_DELAY);
}

startAutoSlide();
// =========================
// PAUSE ON HOVER
// =========================

coffeeSlide.addEventListener('mouseenter', () => {
  clearInterval(autoSlideTimer);

  sliderControls.forEach((control) => {
    control.style.animationPlayState = 'paused';
  });
});

coffeeSlide.addEventListener('mouseleave', () => {
  sliderControls.forEach((control) => {
    control.style.animationPlayState = 'running';
  });

  startAutoSlide();
});

coffeeSlide.addEventListener('mouseenter', () => {
  clearInterval(autoSlideTimer);
});

coffeeSlide.addEventListener('mouseleave', () => {
  startAutoSlide();
});
updateSlide();
}

// =========================
// MENU CATEGORIES
// =========================

const menuTabs = document.querySelectorAll('.menu-tab');
const menuGrid = document.querySelector('.menu-grid');

if (menuTabs.length > 0 && menuGrid) {

  

  function renderProducts(category) {
    if (category === 'coffee') {
  const coffeeProducts = products.filter(
    (product) => product.category === 'coffee'
  );

  menuGrid.innerHTML = coffeeProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
          </div>

          <div class="product-content">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <strong>$${product.price.toFixed(2)}</strong>
          </div>
        </article>
      `
    )
    .join('');

  return;
}
if (category === 'tea') {
  const teaProducts = products.filter(
    (product) => product.category === 'tea'
  );

  menuGrid.innerHTML = teaProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
          </div>

          <div class="product-content">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <strong>$${product.price.toFixed(2)}</strong>
          </div>
        </article>
      `
    )
    .join('');

  return;
}

if (category === 'dessert') {
  const dessertProducts = products.filter(
    (product) => product.category === 'dessert'
  );

  menuGrid.innerHTML = dessertProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
          </div>

          <div class="product-content">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <strong>$${product.price.toFixed(2)}</strong>
          </div>
        </article>
      `
    )
    .join('');

  return;
}
  }
    
  renderProducts('coffee');

  menuTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;

      menuGrid.classList.remove('show-all');

      if (refreshButton) {
        if (category === 'tea') {
          refreshButton.style.setProperty('display', 'none', 'important');
        } else {
          refreshButton.style.removeProperty('display');
        }
}
      menuTabs.forEach((item) => {
        item.classList.remove('active');
      });

      tab.classList.add('active');

      renderProducts(category);
      
    });
  });
}

// SHOW MORE PRODUCTS

const refreshButton = document.querySelector('.refresh-button');

if (refreshButton && menuGrid) {
  refreshButton.addEventListener('click', () => {
    menuGrid.classList.add('show-all');
    refreshButton.style.display = 'none';
  });
}
// =========================
// PRODUCT MODAL
// =========================

const productModal = document.querySelector('#product-modal');
const modalClose = document.querySelector('.modal-close');
const modalCloseButton = document.querySelector('.modal-close-button');

if (productModal && modalClose) {

  document.addEventListener('click', (event) => {
    const card = event.target.closest('.product-card');

    if (!card) return;
    const activeCategory =
  document.querySelector('.menu-tab.active')?.dataset.category;
  productModal.classList.remove(
  'coffee-modal',
  'tea-modal',
  'dessert-modal'
);

productModal.classList.add(`${activeCategory}-modal`);
  const modalInfoText = document.querySelector('.modal-info-text');

if (activeCategory === 'coffee') {
  modalInfoText.innerHTML =
    'The cost is not final. Download our mobile app to see the final price and place your order. ' +
    'Earn loyalty points and enjoy your favorite coffee with up to 20% discount.';
} else {
  modalInfoText.innerHTML =
    'The total price depends on the selected size and additives.<br>' +
    'After adding the item, you can review it in My order.';
}
  const sizeOptionsText = document.querySelectorAll('.size-option');
const additiveOptionsText = document.querySelectorAll('.additive-option');

if (activeCategory === 'dessert') {
  sizeOptionsText[0].lastChild.textContent = ' 50 g';
  sizeOptionsText[1].lastChild.textContent = ' 100 g';
  sizeOptionsText[2].lastChild.textContent = ' 200 g';

  additiveOptionsText[0].lastChild.textContent = ' Berries';
  additiveOptionsText[1].lastChild.textContent = ' Nuts';
  additiveOptionsText[2].lastChild.textContent = ' Jam';
}

if (activeCategory === 'coffee') {
  sizeOptionsText[0].lastChild.textContent = ' 200 ml';
  sizeOptionsText[1].lastChild.textContent = ' 300 ml';
  sizeOptionsText[2].lastChild.textContent = ' 400 ml';

  additiveOptionsText[0].lastChild.textContent = ' Sugar';
  additiveOptionsText[1].lastChild.textContent = ' Cinnamon';
  additiveOptionsText[2].lastChild.textContent = ' Syrup';
}

if (activeCategory === 'tea') {
  sizeOptionsText[0].lastChild.textContent = ' 200 ml';
  sizeOptionsText[1].lastChild.textContent = ' 300 ml';
  sizeOptionsText[2].lastChild.textContent = ' 400 ml';

  additiveOptionsText[0].lastChild.textContent = ' Sugar';
  additiveOptionsText[1].lastChild.textContent = ' Lemon';
  additiveOptionsText[2].lastChild.textContent = ' Syrup';
}

const secondAdditive =
  document.querySelectorAll('.additive-option')[1];

if (secondAdditive) {
  if (activeCategory === 'tea') {
    secondAdditive.childNodes[
      secondAdditive.childNodes.length - 1
    ].textContent = ' Lemon';
  } else {
    secondAdditive.childNodes[
      secondAdditive.childNodes.length - 1
    ].textContent = ' Cinnamon';
  }
}

    const image = card.querySelector('img');
    const title = card.querySelector('h2');
    const description = card.querySelector('p');
    const price = card.querySelector('strong');
    basePrice = parseFloat(price.textContent.replace('$', ''));
    sizeOptions.forEach((item, index) => {
  item.classList.toggle('active', index === 0);
});

additiveOptions.forEach((item) => {
  item.classList.remove('active');
});

    productModal.querySelector('.modal-image img').src = image.src;
    productModal.querySelector('.modal-image img').alt = title.textContent;
    productModal.querySelector('.modal-title').textContent = title.textContent;
    productModal.querySelector('.modal-description').textContent =
      description.textContent;
    productModal.querySelector('.modal-price').textContent =
      price.textContent;

    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  function closeModal() {
    productModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalCloseButton.addEventListener('click', closeModal);

  productModal.addEventListener('click', (event) => {
    if (event.target === productModal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
}
// MODAL SIZE OPTIONS
let basePrice = 0;
const sizeOptions = document.querySelectorAll('.size-option');

sizeOptions.forEach((option) => {
  option.addEventListener('click', () => {
    sizeOptions.forEach((item) => {
      item.classList.remove('active');
    });

    option.classList.add('active');
    const sizePrice = parseFloat(option.dataset.price);

let additivesPrice = 0;

additiveOptions.forEach((item) => {
  if (item.classList.contains('active')) {
    additivesPrice += parseFloat(item.dataset.price);
  }
});

const totalPrice = basePrice + sizePrice + additivesPrice;

productModal.querySelector('.modal-price').textContent =
  `$${totalPrice.toFixed(2)}`;
  });
});
// MODAL ADDITIVES

const additiveOptions = document.querySelectorAll('.additive-option');

additiveOptions.forEach((option) => {
  option.addEventListener('click', () => {
    option.classList.toggle('active');

    const activeSize = document.querySelector('.size-option.active');

    const sizePrice = activeSize
      ? parseFloat(activeSize.dataset.price)
      : 0;

    let additivesPrice = 0;

    additiveOptions.forEach((item) => {
      if (item.classList.contains('active')) {
        additivesPrice += parseFloat(item.dataset.price);
      }
    });

    const totalPrice = basePrice + sizePrice + additivesPrice;

    productModal.querySelector('.modal-price').textContent =
      `$${totalPrice.toFixed(2)}`;
  });
});

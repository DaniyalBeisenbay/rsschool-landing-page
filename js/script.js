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
  const coffeeHTML = menuGrid.innerHTML;

  const menuData = {
    tea: [
      {
        image: './assets/images/tea-1.png',
        name: 'Moroccan',
        description:
          'Fragrant black tea with the addition of tangerine, cinnamon, honey, lemon and mint',
        price: '$4.50',
      },
      {
        image: './assets/images/tea-2.png',
        name: 'Ginger',
        description:
          'Original black tea with fresh ginger, lemon and honey',
        price: '$5.00',
      },
      {
        image: './assets/images/tea-3.png',
        name: 'Cranberry',
        description:
          'Invigorating black tea with cranberry and honey',
        price: '$5.00',
      },
      {
        image: './assets/images/tea-4.png',
        name: 'Sea buckthorn',
        description:
          'Toning sweet black tea with sea buckthorn, fresh thyme and cinnamon',
        price: '$5.50',
      },
    ],

    dessert: [
      {
        image: './assets/images/dessert-1.png',
        name: 'Marble cheesecake',
        description:
          'Philadelphia cheese with lemon zest on a light sponge cake and red currant jam',
        price: '$3.50',
      },
      {
        image: './assets/images/dessert-2.png',
        name: 'Red velvet',
        description:
          'Layer cake with cream cheese frosting',
        price: '$4.00',
      },
      {
        image: './assets/images/dessert-3.png',
        name: 'Cheesecakes',
        description:
          'Soft cottage cheese pancakes with sour cream and fresh berries and sprinkled with powdered sugar',
        price: '$4.50',
      },
      {
        image: './assets/images/dessert-4.png',
        name: 'Creme brulee',
        description:
          'Delicate creamy dessert in a caramel basket with wild berries',
        price: '$4.00',
      },
      {
        image: './assets/images/dessert-5.png',
        name: 'Pancakes',
        description:
          'Tender pancakes with strawberry jam and fresh strawberries',
        price: '$4.50',
      },
      {
        image: './assets/images/dessert-6.png',
        name: 'Honey cake',
        description:
          'Classic honey cake with delicate custard',
        price: '$4.50',
      },
      {
        image: './assets/images/dessert-7.png',
        name: 'Chocolate cake',
        description:
          'Cake with hot chocolate filling and nuts with dried apricots',
        price: '$5.50',
      },
      {
        image: './assets/images/dessert-8.png',
        name: 'Black forest',
        description:
          'A combination of thin sponge cake with cherry jam and light chocolate mousse',
        price: '$6.50',
      },
    ],
  };

  function renderProducts(category) {
    if (category === 'coffee') {
      menuGrid.innerHTML = coffeeHTML;
      return;
    }

    const products = menuData[category];

    if (!products) return;

    menuGrid.innerHTML = products
      .map(
        (product) => `
          <article class="product-card">
            <div class="product-image">
              <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="product-content">
              <h2>${product.name}</h2>
              <p>${product.description}</p>
              <strong>${product.price}</strong>
            </div>
          </article>
        `
      )
      .join('');
  }

  menuTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;

      menuTabs.forEach((item) => {
        item.classList.remove('active');
      });

      tab.classList.add('active');

      renderProducts(category);
    });
  });
}
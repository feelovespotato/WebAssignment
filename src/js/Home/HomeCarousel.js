function initCarousel() {
  const drinks = [
    { name: 'Tea', desc: 'Explore our wide range of refreshing teas from around the world.', link: 'View All Teas', bg: '../assets/images/GreenTeaBG.webp' },
    { name: 'Coffee', desc: 'Rich, bold and smooth — our coffees are crafted for every mood.', link: 'View All Coffees', bg: '../assets/images/NescafeCoffeeBG.webp' },
    { name: 'Juice', desc: 'Fresh and fruity — packed with flavour in every sip.', link: 'View All Juices', bg: '../assets/images/JuiceBG.webp' },
    { name: 'Soda', desc: 'Carbonated and refreshing — perfect for a quick energy boost.', link: 'View All Sodas', bg: '../assets/images/SodaBG.webp' },
    { name: 'Beer', desc: 'From crisp lagers to bold stouts, find your perfect brew.', link: 'View All Beers', bg: '../assets/images/BeerBG.jpg' }
  ];

  let current = 0;

  function updateCarousel(direction = 1) {
    const content = document.getElementById('CarouselContent');
    const bg = document.getElementById('CarouselBackground');

    content.style.opacity = '0';
    content.style.transform = `translateX(${direction * 60}px)`;
    bg.style.opacity = '0';

    setTimeout(() => {
      const drink = drinks[current];
      bg.style.backgroundImage = `url('${drink.bg}')`;
      document.getElementById('DrinkName').textContent = drink.name;
      document.getElementById('DrinkDesc').textContent = drink.desc;
      document.getElementById('DrinkLink').textContent = drink.link;

      content.style.transform = `translateX(${direction * -60}px)`;

      requestAnimationFrame(() => {
        content.style.opacity = '1';
        content.style.transform = 'translateX(0)';
        bg.style.opacity = '1';
      });
    }, 400);
  }

  /* Event listeners for navigation buttons forward and backward */
  document.getElementById('PreviousDrink').addEventListener('click', () => {
    current = (current - 1 + drinks.length) % drinks.length;
    updateCarousel(-1);
  });

  document.getElementById('NextDrink').addEventListener('click', () => {
    current = (current + 1) % drinks.length;
    updateCarousel(1);
  });

  updateCarousel(0);
}
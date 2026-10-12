const header = document.querySelector('.header');
const navLinks = document.querySelector('.nav-links');
const toggle = document.querySelector('.menu-toggle');
let lastScroll = 0;

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

window.addEventListener('scroll', () => {
  if (!header) return;
  const current = window.scrollY;
  if (current > lastScroll && current > 120) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }
  lastScroll = current;
});

const lazyImages = document.querySelectorAll('[data-srcset]');

lazyImages.forEach((img) => {
  const srcset = img.dataset.srcset;
  const src = img.dataset.src;
  const picture = img.closest('picture');
  if (!srcset && !src) return;

  const highRes = new Image();
  if (srcset) {
    highRes.srcset = srcset;
  }
  if (src) {
    highRes.src = src;
  }
  highRes.onload = () => {
    if (picture) {
      picture.querySelectorAll('source[data-srcset]').forEach((source) => {
        source.srcset = source.dataset.srcset;
      });
    }
    if (srcset) {
      img.srcset = srcset;
    }
    if (src) {
      img.src = src;
    }
    img.classList.add('is-loaded');
  };
});

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
      },
    );
  });
}

const calendlyButtons = document.querySelectorAll('[data-calendly]');

if (calendlyButtons.length) {
  const loadCalendly = () => {
    if (window.Calendly) return;
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
  };

  calendlyButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      loadCalendly();
      const url = button.getAttribute('href');
      if (window.Calendly) {
        window.Calendly.initPopupWidget({ url });
      } else {
        window.open(url, '_blank');
      }
    });
  });
}

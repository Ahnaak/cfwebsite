// Mobile menu toggle
const btn = document.getElementById('menu-btn');
const mobileNav = document.getElementById('mobile-nav');
btn.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('hidden') === false;
  mobileNav.classList.toggle('flex', open);
  btn.setAttribute('aria-expanded', String(open));
});
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileNav.classList.add('hidden'); mobileNav.classList.remove('flex');
}));

// "Choose this" on a sponsor tier pre-selects it in the contact form
document.querySelectorAll('[data-plan]').forEach(a => a.addEventListener('click', () => {
  const sel = document.getElementById('q-interest');
  if (sel) sel.value = a.dataset.plan;
}));

// Contact form sending lives in js/contact-form.js

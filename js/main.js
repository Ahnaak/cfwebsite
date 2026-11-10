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

// Question form: front-end only for now (no backend connected yet)
document.querySelectorAll('#question-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.querySelector('.form-status').classList.remove('hidden');
    form.reset();
  });
});

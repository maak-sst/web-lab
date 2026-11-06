// меню на телефоні
var toggle = document.querySelector('.nav-toggle');
var nav = document.getElementById('nav');
if (toggle && nav) {
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}

// фільтр у каталозі
var buttons = document.querySelectorAll('.filters button');
var cards = document.querySelectorAll('[data-cat]');
buttons.forEach(function (b) {
  b.addEventListener('click', function () {
    buttons.forEach(function (x) { x.classList.remove('on'); });
    b.classList.add('on');
    var f = b.dataset.filter;
    cards.forEach(function (c) {
      c.style.display = (f === 'all' || c.dataset.cat === f) ? '' : 'none';
    });
  });
});

// форми поки що без сервера, просто показуємо повідомлення
document.querySelectorAll('form[data-demo]').forEach(function (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = form.querySelector('.form-ok');
    if (ok) ok.classList.add('show');
    form.reset();
    if (typeof recalc === 'function') recalc();
  });
});

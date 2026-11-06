// розрахунок вартості в конструкторі
var basePrice = { cube: 450, pack: 650, flat: 520 };
var fabricPrice = { oxford: 0, cordura: 120, pvc: 90 };
var insulPrice = { foam: 0, foil: 60, thick: 110 };

var form = document.getElementById('builder-form');

function num(id, min, max, def) {
  var v = parseInt(document.getElementById(id).value, 10);
  if (isNaN(v)) v = def;
  return Math.min(max, Math.max(min, v));
}

function recalc() {
  var model = document.getElementById('model').value;
  var l = num('length', 20, 80, 40);
  var w = num('width', 15, 60, 30);
  var h = num('height', 10, 60, 30);
  var qty = num('qty', 1, 1000, 1);
  var liters = Math.round(l * w * h / 1000);

  var unit = basePrice[model]
    + liters * 8
    + fabricPrice[document.getElementById('fabric').value]
    + insulPrice[document.getElementById('insul').value]
    + (document.getElementById('logo').checked ? 50 : 0);

  var discount = 0;
  if (qty >= 100) discount = 0.15;
  else if (qty >= 50) discount = 0.10;
  else if (qty >= 10) discount = 0.05;

  var total = Math.round(unit * qty * (1 - discount));

  document.getElementById('liters').textContent = liters + ' л';
  document.getElementById('unit').textContent = unit + ' грн';
  document.getElementById('disc').textContent = Math.round(discount * 100) + '%';
  document.getElementById('sum').textContent = total.toLocaleString('uk-UA') + ' грн';

  // підсумок для прихованого поля заявки
  document.getElementById('summary').value =
    'Модель: ' + document.getElementById('model').selectedOptions[0].text +
    '; розміри: ' + l + 'x' + w + 'x' + h + ' см; кількість: ' + qty +
    '; орієнтовно: ' + total + ' грн';

  drawBag(model, l, w, h);
}

// проста схема сумки, що змінюється разом з параметрами
function drawBag(model, l, w, h) {
  var color = document.querySelector('input[name="color"]:checked').value;
  var dark = shade(color, 0.78);
  var bw = Math.round(150 + (l - 40) * 2.2);
  var bh = Math.round(120 + (h - 30) * 2.2);
  bw = Math.max(120, Math.min(300, bw));
  bh = Math.max(90, Math.min(220, bh));
  var x = (400 - bw) / 2;
  var y = 250 - bh;
  var svg = '<ellipse cx="200" cy="258" rx="' + (bw / 2 + 10) + '" ry="9" fill="#2B2D42" opacity=".13"/>';
  if (model === 'pack') {
    svg += '<path d="M' + (x + 14) + ' ' + (y + 30) + ' q-34 40 -8 ' + (bh - 40) + '" fill="none" stroke="' + dark + '" stroke-width="12" stroke-linecap="round"/>' +
           '<path d="M' + (x + bw - 14) + ' ' + (y + 30) + ' q34 40 8 ' + (bh - 40) + '" fill="none" stroke="' + dark + '" stroke-width="12" stroke-linecap="round"/>';
  } else {
    svg += '<path d="M' + (200 - bw / 4) + ' ' + (y + 4) + ' q0-34 ' + (bw / 4) + '-34 q' + (bw / 4) + ' 0 ' + (bw / 4) + ' 34" fill="none" stroke="' + dark + '" stroke-width="10" stroke-linecap="round"/>';
  }
  svg += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + bh + '" rx="10" fill="' + color + '"/>' +
         '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + Math.round(bh * 0.26) + '" rx="10" fill="' + dark + '"/>' +
         '<rect x="' + x + '" y="' + (y + Math.round(bh * 0.62)) + '" width="' + bw + '" height="10" fill="#fff" opacity=".85"/>';
  if (document.getElementById('logo').checked) {
    svg += '<circle cx="200" cy="' + (y + Math.round(bh * 0.42)) + '" r="13" fill="#fff"/>' +
           '<path d="M200 ' + (y + Math.round(bh * 0.42) - 13) + 'a13 13 0 0 0 0 26z" fill="#F05D23"/>';
  }
  document.getElementById('bag').innerHTML = svg;
}

function shade(hex, f) {
  hex = hex.replace('#', '');
  var out = '#';
  for (var i = 0; i < 6; i += 2) {
    var v = Math.round(parseInt(hex.substr(i, 2), 16) * f);
    out += ('0' + v.toString(16)).slice(-2);
  }
  return out;
}

if (form) {
  form.addEventListener('input', recalc);
  form.addEventListener('change', recalc);
  document.querySelectorAll('input[name="color"]').forEach(function (r) {
    r.addEventListener('change', recalc);
  });
  recalc();
}

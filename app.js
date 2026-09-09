const RECIPES = {
  "Ofenkartoffeln": {
    ingredients: {"Wasser":2,"Salz":1,"Ei":1},
    purchase: 600,
    sale: {low:1200, medium:3000, high:4000}
  },
  "Sumada": {
    ingredients: {"Wasser":1,"Milch":1},
    purchase: 165,
    sale: {low:800, medium:2000, high:3000}
  },
  "Gyros": {
    ingredients: {"Gegrilltes Fleisch":2,"Butter":2,"Weizen":1},
    purchase: 900,
    sale: {low:2000, medium:4500, high:6000}
  }
};

const recipeEl = document.querySelector("#recipe");
const lowEl = document.querySelector("#lowCount");
const mediumEl = document.querySelector("#mediumCount");
const highEl = document.querySelector("#highCount");
const ingredientsEl = document.querySelector("#ingredients");
const totalQuantityEl = document.querySelector("#totalQuantity");
const costEl = document.querySelector("#cost");
const revenueEl = document.querySelector("#revenue");
const profitEl = document.querySelector("#profit");
const discountInfoEl = document.querySelector("#discountInfo");

const lowDisplay = document.querySelector("#lowDisplay");
const mediumDisplay = document.querySelector("#mediumDisplay");
const highDisplay = document.querySelector("#highDisplay");
const lowRevenueEl = document.querySelector("#lowRevenue");
const mediumRevenueEl = document.querySelector("#mediumRevenue");
const highRevenueEl = document.querySelector("#highRevenue");

Object.keys(RECIPES).forEach(name => {
  const o = document.createElement("option");
  o.value = name;
  o.textContent = name;
  recipeEl.appendChild(o);
});

function count(el) {
  const value = Math.floor(Number(el.value) || 0);
  return Math.max(0, Math.min(9999, value));
}

function discountFor(quantity) {
  return Math.min(25, Math.floor(quantity / 20) * 5);
}

function money(value) {
  return "$" + Math.round(value).toLocaleString("de-DE");
}

function calculate() {
  const recipe = RECIPES[recipeEl.value];
  const low = count(lowEl);
  const medium = count(mediumEl);
  const high = count(highEl);
  const quantity = low + medium + high;
  const discount = discountFor(quantity);

  totalQuantityEl.textContent = `${quantity} Stück`;

  ingredientsEl.innerHTML = "";
  Object.entries(recipe.ingredients).forEach(([name, amount]) => {
    const row = document.createElement("div");
    row.className = "ingredient";
    row.innerHTML = `<span>${name}</span><strong>${amount * quantity}×</strong>`;
    ingredientsEl.appendChild(row);
  });

  const lowRevenue = recipe.sale.low * low;
  const mediumRevenue = recipe.sale.medium * medium;
  const highRevenue = recipe.sale.high * high;
  const revenueTotal = lowRevenue + mediumRevenue + highRevenue;

  // Mengenrabatt wird wie bisher auf den gesamten Einkauf angewendet.
  const purchaseTotal = recipe.purchase * quantity * (1 - discount / 100);
  const profit = revenueTotal - purchaseTotal;

  lowDisplay.textContent = low;
  mediumDisplay.textContent = medium;
  highDisplay.textContent = high;
  lowRevenueEl.textContent = money(lowRevenue);
  mediumRevenueEl.textContent = money(mediumRevenue);
  highRevenueEl.textContent = money(highRevenue);

  costEl.textContent = money(purchaseTotal);
  revenueEl.textContent = money(revenueTotal);
  profitEl.textContent = money(profit);

  discountInfoEl.textContent = discount
    ? `Mengenrabatt: ${discount}% – ${quantity} Stück`
    : `Kein Mengenrabatt – ${quantity} Stück`;
}

[recipeEl, lowEl, mediumEl, highEl].forEach(el => {
  el.addEventListener("input", calculate);
  el.addEventListener("change", calculate);
});

document.querySelector("#calculateButton").addEventListener("click", calculate);
calculate();

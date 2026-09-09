const RECIPES = {
  "Ofenkartoffeln": {
    ingredients: {"Wasser": 2, "Salz": 1, "Ei": 1},
    purchase: 600,
    sale: {low: 1200, medium: 3000, high: 4000}
  },
  "Sumada": {
    ingredients: {"Wasser": 1, "Milch": 1},
    purchase: 165,
    sale: {low: 800, medium: 2000, high: 3000}
  },
  "Gyros": {
    ingredients: {"Gegrilltes Fleisch": 2, "Butter": 2, "Weizen": 1},
    purchase: 900,
    sale: {low: 2000, medium: 4500, high: 6000}
  }
};

const recipeEl = document.getElementById("recipe");
const lowEl = document.getElementById("lowCount");
const mediumEl = document.getElementById("mediumCount");
const highEl = document.getElementById("highCount");

Object.keys(RECIPES).forEach(name => {
  const option = document.createElement("option");
  option.value = name;
  option.textContent = name;
  recipeEl.appendChild(option);
});

function getCount(element) {
  const n = Math.floor(Number(element.value) || 0);
  return Math.max(0, Math.min(9999, n));
}

function getDiscount(quantity) {
  return Math.min(25, Math.floor(quantity / 20) * 5);
}

function money(value) {
  return "$" + Math.round(value).toLocaleString("de-DE");
}

function calculate() {
  const recipe = RECIPES[recipeEl.value];
  const low = getCount(lowEl);
  const medium = getCount(mediumEl);
  const high = getCount(highEl);
  const total = low + medium + high;
  const discount = getDiscount(total);

  document.getElementById("totalQuantity").textContent = total + " Stück";

  const ingredients = document.getElementById("ingredients");
  ingredients.innerHTML = "";

  Object.entries(recipe.ingredients).forEach(([name, amount]) => {
    const row = document.createElement("div");
    row.className = "ingredient-line";
    row.innerHTML = `<span>${name}</span><strong>${amount * total}×</strong>`;
    ingredients.appendChild(row);
  });

  const costBefore = recipe.purchase * total;
  const cost = costBefore * (1 - discount / 100);

  const lowRevenue = recipe.sale.low * low;
  const mediumRevenue = recipe.sale.medium * medium;
  const highRevenue = recipe.sale.high * high;
  const revenue = lowRevenue + mediumRevenue + highRevenue;
  const profit = revenue - cost;

  document.getElementById("costBefore").textContent = money(costBefore);
  document.getElementById("discount").textContent = discount + " %";
  document.getElementById("cost").textContent = money(cost);

  document.getElementById("lowRevenue").textContent = money(lowRevenue);
  document.getElementById("mediumRevenue").textContent = money(mediumRevenue);
  document.getElementById("highRevenue").textContent = money(highRevenue);
  document.getElementById("revenue").textContent = money(revenue);
  document.getElementById("profit").textContent = money(profit);

  document.getElementById("discountInfo").textContent = discount
    ? `Mengenrabatt: ${discount}% bei ${total} Stück`
    : `Kein Mengenrabatt bei ${total} Stück`;
}

function resetAll() {
  recipeEl.selectedIndex = 0;
  lowEl.value = 0;
  mediumEl.value = 0;
  highEl.value = 0;
  calculate();
}

[recipeEl, lowEl, mediumEl, highEl].forEach(element => {
  element.addEventListener("input", calculate);
  element.addEventListener("change", calculate);
});

document.getElementById("resetButton").addEventListener("click", resetAll);

calculate();

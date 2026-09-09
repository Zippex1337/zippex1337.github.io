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

const QUALITIES = [
  {id:"low", name:"Niedrig", colors:"Grau"},
  {id:"medium", name:"Mittel", colors:"Grün / Blau"},
  {id:"high", name:"Hoch", colors:"Lila / Gold"}
];

const recipeEl = document.querySelector("#recipe");
const quantityEl = document.querySelector("#quantity");
const qualityEl = document.querySelector("#qualityButtons");
const ingredientsEl = document.querySelector("#ingredients");
const costEl = document.querySelector("#cost");
const revenueEl = document.querySelector("#revenue");
const profitEl = document.querySelector("#profit");
const discountInfoEl = document.querySelector("#discountInfo");

let quality = "medium";

Object.keys(RECIPES).forEach(name => {
  const option = document.createElement("option");
  option.value = name;
  option.textContent = name;
  recipeEl.appendChild(option);
});

for(let n=1;n<=200;n++){
  const option=document.createElement("option");
  option.value=n;
  option.textContent=`${n} Stück`;
  quantityEl.appendChild(option);
}

QUALITIES.forEach(q=>{
  const button=document.createElement("button");
  button.type="button";
  button.className="quality";
  button.dataset.quality=q.id;
  button.innerHTML=`<b>${q.name} Qualität</b><span>${q.colors}</span>`;
  button.addEventListener("click",()=>{
    quality=q.id;
    document.querySelectorAll(".quality").forEach(b=>b.classList.remove("active"));
    button.classList.add("active");
    calculate();
  });
  qualityEl.appendChild(button);
});

document.querySelector('.quality[data-quality="medium"]').classList.add("active");

function discountFor(quantity){
  return Math.min(25, Math.floor(quantity/20)*5);
}

function money(value){
  return "$" + Math.round(value).toLocaleString("de-DE");
}

function calculate(){
  const recipe=RECIPES[recipeEl.value];
  const quantity=Math.max(1, Number(quantityEl.value)||1);
  const discount=discountFor(quantity);

  ingredientsEl.innerHTML="";
  Object.entries(recipe.ingredients).forEach(([name, amount])=>{
    const row=document.createElement("div");
    row.className="ingredient";
    row.innerHTML=`<span>${name}</span><strong>${amount*quantity}×</strong>`;
    ingredientsEl.appendChild(row);
  });

  // Mengenrabatt wird auf die Einkaufskosten angewendet.
  const purchaseTotal=recipe.purchase*quantity*(1-discount/100);
  const revenueTotal=recipe.sale[quality]*quantity;
  const profit=revenueTotal-purchaseTotal;

  costEl.textContent=money(purchaseTotal);
  revenueEl.textContent=money(revenueTotal);
  profitEl.textContent=money(profit);
  discountInfoEl.textContent=discount
    ? `Mengenrabatt: ${discount}% – ${quantity} Stück`
    : `Kein Mengenrabatt – ${quantity} Stück`;
}

recipeEl.addEventListener("change",calculate);
quantityEl.addEventListener("change",calculate);
calculate();

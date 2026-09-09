const INGREDIENT_PRICES={
"Wasser":250,"Milch":350,"Weizen":180,"Butter":240,"Salz":200,"Ei":320,"Gegrilltes Fleisch":0
};
const RECIPES={
"Ofenkartoffeln":{ingredients:{"Wasser":2,"Salz":1,"Ei":1},sale:{low:1200,medium:3000,high:4000}},
"Sumada":{ingredients:{"Wasser":1,"Milch":1},sale:{low:800,medium:2000,high:3000}},
"Gyros":{ingredients:{"Gegrilltes Fleisch":2,"Butter":2,"Weizen":1},sale:{low:2000,medium:4500,high:6000}}
};
const recipeEl=document.getElementById("recipe"),lowEl=document.getElementById("lowCount"),mediumEl=document.getElementById("mediumCount"),highEl=document.getElementById("highCount");
Object.keys(RECIPES).forEach(n=>{const o=document.createElement("option");o.value=n;o.textContent=n;recipeEl.appendChild(o)});
function count(e){return Math.max(0,Math.min(9999,Math.floor(Number(e.value)||0)))}
function disc(q){return Math.min(25,Math.floor(q/20)*5)}
function money(v){return "$"+Math.round(v).toLocaleString("de-DE")}
function calculate(){
const r=RECIPES[recipeEl.value],low=count(lowEl),medium=count(mediumEl),high=count(highEl),total=low+medium+high,d=disc(total);
document.getElementById("totalQuantity").textContent=total+" Stück";
const ing=document.getElementById("ingredients");ing.innerHTML="";
Object.entries(r.ingredients).forEach(([n,a])=>{const row=document.createElement("div");row.className="ingredient-line";row.innerHTML=`<span>${n}</span><strong>${a*total}×</strong>`;ing.appendChild(row)});
const cost=Object.entries(r.ingredients).reduce((s,[n,a])=>s+a*(INGREDIENT_PRICES[n]??0),0)*total;
const lowBefore=r.sale.low*low,medBefore=r.sale.medium*medium,highBefore=r.sale.high*high,salesBefore=lowBefore+medBefore+highBefore;
const factor=1-d/100,sales=salesBefore*factor,profit=sales-cost;
document.getElementById("costBefore").textContent=money(cost);
document.getElementById("discount").textContent=d+" %";
document.getElementById("revenue").textContent=money(sales);
document.getElementById("revenueTotal").textContent=money(sales);
document.getElementById("lowRevenue").textContent=money(lowBefore*factor);
document.getElementById("mediumRevenue").textContent=money(medBefore*factor);
document.getElementById("highRevenue").textContent=money(highBefore*factor);
document.getElementById("profit").textContent=money(profit);
document.getElementById("discountInfo").textContent=d?`Mengenrabatt: ${d}% auf den Verkaufspreis bei ${total} Stück`:`Kein Mengenrabatt bei ${total} Stück`;
}
function resetAll(){recipeEl.selectedIndex=0;lowEl.value=0;mediumEl.value=0;highEl.value=0;calculate()}
[recipeEl,lowEl,mediumEl,highEl].forEach(e=>{e.addEventListener("input",calculate);e.addEventListener("change",calculate)});
document.getElementById("resetButton").addEventListener("click",resetAll);calculate();
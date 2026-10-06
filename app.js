const INGREDIENT_PRICES={"Wasser":250,"Milch":350,"Weizen":180,"Butter":240,"Salz":200,"Ei":320,"Gegrilltes Fleisch":120};
const RECIPES={potatoes:{ingredients:{"Wasser":2,"Salz":1,"Ei":1}},sumada:{ingredients:{"Wasser":1,"Milch":1}},gyros:{ingredients:{"Gegrilltes Fleisch":2,"Butter":2,"Weizen":1}}};
const COOP={
none:{potatoes:{low:1200,medium:3000,high:4000},sumada:{low:800,medium:2000,high:3000},gyros:{low:2000,medium:4500,high:6000}},
doj:{potatoes:{low:1200,medium:2000,high:3000},sumada:{low:800,medium:1000,high:2000},gyros:{low:2000,medium:3500,high:5000}},
lspd:{potatoes:{low:1200,medium:2000,high:3000},sumada:{low:800,medium:1000,high:2000},gyros:{low:2000,medium:3500,high:5000}},
cartel:{potatoes:{low:1200,medium:2000,high:3000},sumada:{low:800,medium:1000,high:2000},gyros:{low:2000,medium:3500,high:5000}}
};
const coopEl=document.getElementById("coop");
const fields={potatoes:{low:document.getElementById("potatoesLow"),medium:document.getElementById("potatoesMedium"),high:document.getElementById("potatoesHigh"),total:document.getElementById("potatoesTotal")},sumada:{low:document.getElementById("sumadaLow"),medium:document.getElementById("sumadaMedium"),high:document.getElementById("sumadaHigh"),total:document.getElementById("sumadaTotal")},gyros:{low:document.getElementById("gyrosLow"),medium:document.getElementById("gyrosMedium"),high:document.getElementById("gyrosHigh"),total:document.getElementById("gyrosTotal")}};
function count(e){return Math.max(0,Math.min(9999,Math.floor(Number(e.value)||0)))}
function discountFor(n){return Math.min(25,Math.floor(n/20)*5)}
function money(v){return "$"+Math.round(v).toLocaleString("de-DE")}
function calculate(){
const prices=COOP[coopEl.value];let total=0,cost=0,ingTotals={},rev={low:0,medium:0,high:0};
for(const [key,r] of Object.entries(RECIPES)){
const f=fields[key],low=count(f.low),medium=count(f.medium),high=count(f.high),n=low+medium+high;f.total.textContent=n+" Stück";total+=n;
for(const [name,a] of Object.entries(r.ingredients))ingTotals[name]=(ingTotals[name]||0)+a*n;
cost+=Object.entries(r.ingredients).reduce((s,[name,a])=>s+a*(INGREDIENT_PRICES[name]??0),0)*n;
const p=prices[key];rev.low+=p.low*low;rev.medium+=p.medium*medium;rev.high+=p.high*high;
}
const d=discountFor(total),factor=1-d/100,raw=rev.low+rev.medium+rev.high,sale=raw*factor;
document.getElementById("ingredients").innerHTML="";
["Wasser","Milch","Weizen","Butter","Salz","Ei","Gegrilltes Fleisch"].forEach(name=>{if(ingTotals[name]){const x=document.createElement("div");x.className="ingredient-line";x.innerHTML=`<span>${name}</span><strong>${ingTotals[name]}×</strong>`;document.getElementById("ingredients").appendChild(x)}});
document.getElementById("cost").textContent=money(cost);document.getElementById("discount").textContent=d+" %";document.getElementById("saleAfterDiscount").textContent=money(sale);
document.getElementById("revenueLow").textContent=money(rev.low*factor);document.getElementById("revenueMedium").textContent=money(rev.medium*factor);document.getElementById("revenueHigh").textContent=money(rev.high*factor);document.getElementById("revenueTotal").textContent=money(sale);document.getElementById("salePrice").textContent=money(sale);document.getElementById("profit").textContent=money(sale-cost);
document.getElementById("discountInfo").textContent=d?`Mengenrabatt: ${d}% auf den Verkaufspreis bei ${total} Stück`:`Kein Mengenrabatt bei ${total} Stück`;
}
function resetAll(){coopEl.value="none";Object.values(fields).forEach(f=>{f.low.value=0;f.medium.value=0;f.high.value=0});calculate()}
[coopEl,...Object.values(fields).flatMap(f=>[f.low,f.medium,f.high])].forEach(e=>{e.addEventListener("input",calculate);e.addEventListener("change",calculate)});
document.getElementById("resetButton").addEventListener("click",resetAll);calculate();
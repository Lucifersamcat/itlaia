import { terms } from "./js/data/terms.js";
import { faqs } from "./js/data/faqs.js";
import { companies } from "./js/data/companies.js";
import { compareCategoryLabels, compareCriteria, compareProducts, fact, scenarios } from "./js/data/comparison.js";

const state={activeView:"inicio",termLetter:"Todas",termQuery:"",companyType:"Todas",companyQuery:"",faqCategory:"Todas",faqQuery:"",compareCategory:"general",compareScenario:"research",compareMode:"summary",selectedAgents:["chatgpt-plus","claude-pro","gemini-pro"]};
const normalize=value=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const escapeHtml=value=>String(value).replace(/[&<>"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));

function parseRoute(){const raw=location.hash.slice(1)||"inicio";const [view,slug]=raw.split("/");return{view,slug};}
function setActiveView(view){const allowed=["inicio","glosario","termino","empresas","empresa","comparador","aprendizaje","git-github","faqs"];state.activeView=allowed.includes(view)?view:"inicio";const titles={inicio:"Atlas IA — Aprende inteligencia artificial",glosario:"Glosario — Atlas IA",empresas:"Empresas y modelos — Atlas IA",comparador:"Comparador — Atlas IA",aprendizaje:"Aprendizaje — Atlas IA","git-github":"Git y GitHub — Atlas IA",faqs:"Preguntas frecuentes — Atlas IA"};if(titles[state.activeView])document.title=titles[state.activeView];document.querySelectorAll("[data-view]").forEach(section=>section.classList.toggle("is-active",section.dataset.view===state.activeView));const navView=view==="termino"?"glosario":view==="empresa"?"empresas":view==="git-github"?"aprendizaje":view;document.querySelectorAll("[data-route]").forEach(link=>link.classList.toggle("is-current",link.dataset.route===navView));document.querySelector(".main-nav").classList.remove("is-open");document.querySelector(".menu-toggle").setAttribute("aria-expanded","false");}
function handleRoute(scroll=true){const{view,slug}=parseRoute();if(view==="termino"){renderTermDetail(slug);}else if(view==="empresa"){renderCompanyDetail(slug);}else{setActiveView(view);}if(scroll)window.scrollTo({top:0,behavior:"smooth"});}

function go(hash){history.pushState(null,"",`#${hash}`);handleRoute();}
function searchTerm(query){state.termQuery=query.trim();state.termLetter="Todas";document.querySelector("#term-filter").value=state.termQuery;renderAlphabet();renderTerms();go("glosario");}

function renderAlphabet(){const letters=["Todas",...new Set(terms.map(term=>normalize(term.name).charAt(0).toUpperCase()))].sort((a,b)=>a==="Todas"?-1:b==="Todas"?1:a.localeCompare(b));const container=document.querySelector("#alphabet");container.innerHTML=letters.map(letter=>`<button type="button" class="${letter===state.termLetter?"is-active":""}" data-letter="${letter}">${letter}</button>`).join("");container.querySelectorAll("button").forEach(button=>button.addEventListener("click",()=>{state.termLetter=button.dataset.letter;renderAlphabet();renderTerms();}));}
function renderTerms(){const query=normalize(state.termQuery);const visible=terms.filter(term=>(state.termLetter==="Todas"||normalize(term.name).startsWith(state.termLetter.toLowerCase()))&&(!query||normalize(`${term.name} ${term.category} ${term.short}`).includes(query)));document.querySelector("#term-grid").innerHTML=visible.map(term=>`<article class="term-card"><a class="term-card-link" href="#termino/${term.slug}" data-term="${term.slug}"><div class="term-top"><h2>${term.name}</h2><span class="tag">${term.category}</span></div><p>${term.short}</p></a></article>`).join("");document.querySelector("#term-count").textContent=`${visible.length} ${visible.length===1?"término":"términos"}`;document.querySelector("#term-empty").hidden=visible.length!==0;document.querySelectorAll("[data-term]").forEach(link=>link.addEventListener("click",event=>{event.preventDefault();go(`termino/${link.dataset.term}`);}));}
function renderTermDetail(slug){const term=terms.find(item=>item.slug===slug);if(!term){go("glosario");return;}document.title=`${term.name} — Atlas IA`;const related=term.related.map(id=>terms.find(item=>item.slug===id)).filter(Boolean);document.querySelector("#term-detail").innerHTML=`<nav class="breadcrumb" aria-label="Migas de pan"><a href="#inicio" data-go="inicio">Inicio</a><span>›</span><a href="#glosario" data-go="glosario">Glosario</a><span>›</span><span>${term.name}</span></nav><header class="detail-hero"><div><p class="eyebrow">${term.category}</p><h1>${term.name}</h1><p class="detail-intro">${term.short}</p></div><aside class="detail-meta"><dl><div><dt>Nivel sugerido</dt><dd>${["Fundamentos","Uso"].includes(term.category)?"Inicial":"Intermedio"}</dd></div><div><dt>Área</dt><dd>${term.category}</dd></div><div><dt>Última revisión</dt><dd>9 de agosto de 2026</dd></div></dl></aside></header><div class="detail-layout"><div class="detail-content"><section><h2>Explicación</h2><p>${term.explanation}</p><div class="example-box"><strong>Ejemplo sencillo</strong><p>${term.example}</p></div></section><section><h2>Cómo funciona o cómo aplicarlo</h2><ol>${term.how.map(item=>`<li>${item}</li>`).join("")}</ol></section><section><h2>Limitaciones y riesgos</h2><ul>${term.risks.map(item=>`<li>${item}</li>`).join("")}</ul></section></div><aside class="detail-sidebar"><section><h2>Relacionados</h2><ul class="related-list">${related.map(item=>`<li><a href="#termino/${item.slug}" data-term="${item.slug}"><span>${item.name}</span><span>→</span></a></li>`).join("")}</ul></section><section><h2>Para recordar</h2><p class="data-note">Una explicación introductoria simplifica algunos detalles técnicos. Consulta documentación especializada antes de implementar sistemas críticos.</p></section></aside></div>`;setActiveView("termino");bindInternalLinks();}

function renderCompanyFilters(){const types=["Todas",...new Set(companies.flatMap(company=>company.types))];const container=document.querySelector("#company-filters");container.innerHTML=types.map(type=>`<button type="button" class="${type===state.companyType?"is-active":""}" data-type="${type}">${type}</button>`).join("");container.querySelectorAll("button").forEach(button=>button.addEventListener("click",()=>{state.companyType=button.dataset.type;renderCompanyFilters();renderCompanies();}));}
function renderCompanies(){
  const query=normalize(state.companyQuery);
  const visible=companies.filter(company=>{
    const matchesType=state.companyType==="Todas"||company.types.includes(state.companyType);
    const searchable=normalize(`${company.name} ${company.app} ${company.description} ${company.types.join(" ")} ${company.models.map(model=>model.name).join(" ")}`);
    return matchesType&&(!query||searchable.includes(query));
  });
  document.querySelector("#company-grid").innerHTML=visible.map(company=>`<article class="company-card"><a class="company-card-link" href="#empresa/${company.slug}" data-company="${company.slug}"><div class="company-mark" aria-hidden="true">${company.mark}</div><div><h2>${company.name}</h2><p class="company-app">Aplicación: <strong>${company.app}</strong></p><p class="company-description">${company.description}</p><p class="company-models"><strong>${company.models.length===1?"Modelo":"Modelos"}:</strong> ${company.models.map(model=>model.name).join(" · ")}</p><div class="company-modalities">${company.types.map(type=>`<span class="tag">${type}</span>`).join("")}</div></div><span class="company-action">Ver perfil <span aria-hidden="true">→</span></span></a></article>`).join("");
  document.querySelector("#company-count").textContent=`${visible.length} ${visible.length===1?"empresa":"empresas"}`;
  document.querySelector("#company-empty").hidden=visible.length!==0;
  document.querySelectorAll("[data-company]").forEach(link=>link.addEventListener("click",event=>{event.preventDefault();go(`empresa/${link.dataset.company}`);}));
}

function renderCompanyDetail(slug){const company=companies.find(item=>item.slug===slug);if(!company){go("empresas");return;}document.title=`${company.name} y sus modelos — Atlas IA`;document.querySelector("#company-detail").innerHTML=`<nav class="breadcrumb" aria-label="Migas de pan"><a href="#inicio" data-go="inicio">Inicio</a><span>›</span><a href="#empresas" data-go="empresas">Empresas y modelos</a><span>›</span><span>${company.name}</span></nav><header class="detail-hero"><div><p class="eyebrow">Empresa de inteligencia artificial</p><h1>${company.name}</h1><p class="detail-intro">${company.description}</p></div><aside class="detail-meta"><dl><div><dt>Aplicación o asistente</dt><dd>${company.app}</dd></div><div><dt>Acceso</dt><dd>${company.access}</dd></div><div><dt>Fecha de consulta</dt><dd>9 de agosto de 2026</dd></div></dl></aside></header><div class="detail-layout"><div class="detail-content"><section><h2>Empresa, aplicación y modelos</h2><p>${company.distinction}</p><ul class="company-summary"><li><strong>Empresa</strong><span>${company.name}</span></li><li><strong>Aplicación</strong><span>${company.app}</span></li><li><strong>Fundación</strong><span>${company.founded}</span></li><li><strong>Sede principal</strong><span>${company.headquarters}</span></li><li><strong>Especialidades</strong><span>${company.types.join(", ")}</span></li></ul></section><section><h2>Capacidades</h2><ul>${company.capabilities.map(item=>`<li>${item}</li>`).join("")}</ul></section><section><h2>Modelos y costos</h2><div class="notice-box"><strong>Importante</strong><p>La unidad depende de la modalidad: puede ser USD o CNY por 1 millón de tokens, créditos, imágenes, segundos de audio o video, suscripción o infraestructura propia. Cuando no existe un precio universal se indica expresamente.</p></div>${company.models.map(model=>`<article class="model-detail"><div class="model-detail-head"><div><h3>${model.name}</h3><p class="model-purpose">${model.purpose}</p></div><span class="tag">${model.modalities}</span></div><div class="model-facts"><div class="model-fact"><span>Entrada o acceso</span><strong>${model.input}</strong></div><div class="model-fact"><span>Caché</span><strong>${model.cache}</strong></div><div class="model-fact"><span>Salida o generación</span><strong>${model.output}</strong></div><div class="model-fact"><span>Contexto o límite</span><strong>${model.context}</strong></div></div></article>`).join("")}${company.note?`<p class="data-note">${company.note}</p>`:""}</section><section><h2>Fortalezas y limitaciones</h2><div class="pros-cons"><div><h3>Fortalezas</h3><ul>${company.strengths.map(item=>`<li>${item}</li>`).join("")}</ul></div><div><h3>Limitaciones y riesgos</h3><ul>${company.weaknesses.map(item=>`<li>${item}</li>`).join("")}</ul></div></div></section><section><h2>Cuándo conviene</h2><p>${company.choose}</p></section></div><aside class="detail-sidebar"><section><h2>Fuentes oficiales</h2><ul class="source-list">${company.sources.map(source=>`<li><a href="${source.url}" target="_blank" rel="noreferrer">${source.label}<small>${source.url}</small></a></li>`).join("")}</ul></section><section><h2>Verificación</h2><p class="data-note">Los catálogos y precios cambian. Verifica la documentación oficial antes de elegir o presupuestar un modelo.</p></section></aside></div>`;setActiveView("empresa");bindInternalLinks();}

function renderFaqFilters(){
  const categories=["Todas",...new Set(faqs.map(item=>item.category))];
  const container=document.querySelector("#faq-filters");
  container.innerHTML=categories.map(category=>`<button type="button" class="${category===state.faqCategory?"is-active":""}" data-faq-category="${category}">${category}</button>`).join("");
  container.querySelectorAll("button").forEach(button=>button.addEventListener("click",()=>{state.faqCategory=button.dataset.faqCategory;renderFaqFilters();renderFaqs();}));
}

function renderFaqs(){
  const query=normalize(state.faqQuery);
  const visible=faqs.filter(item=>(state.faqCategory==="Todas"||item.category===state.faqCategory)&&(!query||normalize(`${item.question} ${item.answer} ${item.category}`).includes(query)));
  document.querySelector("#faq-list").innerHTML=visible.map((item,index)=>`<details class="faq-item"><summary><span class="faq-index">${String(index+1).padStart(2,"0")}</span><span class="faq-question">${item.question}</span><span class="faq-toggle" aria-hidden="true">+</span></summary><div class="faq-answer"><p>${item.answer}</p><a class="faq-related" href="#termino/${item.related}" data-term="${item.related}">Consultar en el glosario →</a></div></details>`).join("");
  document.querySelector("#faq-count").textContent=`${visible.length} ${visible.length===1?"pregunta":"preguntas"}`;
  document.querySelector("#faq-empty").hidden=visible.length!==0;
  document.querySelectorAll("#faq-list [data-term]").forEach(link=>link.addEventListener("click",event=>{event.preventDefault();go(`termino/${link.dataset.term}`);}));
}

function renderCompareControls(){
  document.querySelector("#compare-categories").innerHTML=compareCategoryLabels.map(item=>`<button type="button" class="${item.id===state.compareCategory?"is-active":""}" data-compare-category="${item.id}">${item.label}</button>`).join("");

  document.querySelectorAll("[data-compare-category]").forEach(button=>button.addEventListener("click",()=>{
    state.compareCategory=button.dataset.compareCategory;
    state.compareScenario=Object.keys(scenarios[state.compareCategory])[0];
    state.selectedAgents=compareProducts.filter(product=>product.category===state.compareCategory).slice(0,3).map(product=>product.id);
    document.querySelector("#limit-message").hidden=true;
    renderCompareControls();renderAgentPicker();renderComparison();
  }));
  const scenarioSelect=document.querySelector("#compare-scenario");
  scenarioSelect.innerHTML=Object.entries(scenarios[state.compareCategory]).map(([id,item])=>`<option value="${id}" ${id===state.compareScenario?"selected":""}>${item.name}</option>`).join("");
  const modes=[{id:"summary",label:"Resumen"},{id:"differences",label:"Solo diferencias"},{id:"complete",label:"Completa"}];
  document.querySelector("#compare-modes").innerHTML=modes.map(item=>`<button type="button" class="${item.id===state.compareMode?"is-active":""}" data-compare-mode="${item.id}">${item.label}</button>`).join("");
  document.querySelectorAll("[data-compare-mode]").forEach(button=>button.addEventListener("click",()=>{state.compareMode=button.dataset.compareMode;renderCompareControls();renderComparison();}));
  const scenario=scenarios[state.compareCategory][state.compareScenario];
  document.querySelector("#scenario-explanation").innerHTML=`<strong>${scenario.name}</strong><p>${scenario.description} El orden de criterios se adapta a esta tarea.</p>`;
}

function renderAgentPicker(){
  const products=compareProducts.filter(product=>product.category===state.compareCategory);
  const container=document.querySelector("#agent-picker");
  container.innerHTML=products.map(product=>`<button type="button" data-agent="${product.id}" aria-pressed="${state.selectedAgents.includes(product.id)}">${product.name}</button>`).join("");

  container.querySelectorAll("button").forEach(button=>button.addEventListener("click",()=>toggleAgent(button.dataset.agent)));
}

function toggleAgent(id){
  const exists=state.selectedAgents.includes(id);const limit=document.querySelector("#limit-message");
  if(exists){state.selectedAgents=state.selectedAgents.filter(item=>item!==id);limit.hidden=true;}
  else if(state.selectedAgents.length<4){state.selectedAgents.push(id);limit.hidden=true;}
  else{limit.hidden=false;}
  renderAgentPicker();renderComparison();
}

function statusLabel(status){return{yes:"Incluido",limited:"Con condiciones",no:"No disponible",unknown:"No confirmado"}[status]||"Información";}
function isDifferent(products,key){const values=products.map(product=>product.fields[key]?.value||"—");return new Set(values).size>1;}
function comparisonRows(products){
  const all=compareCriteria[state.compareCategory];
  const priority=scenarios[state.compareCategory][state.compareScenario].priority;
  if(state.compareMode==="summary")return [...priority.map(key=>all.find(item=>item.key===key)).filter(Boolean),all.find(item=>item.key==="best"),all.find(item=>item.key==="limits")].filter((item,index,list)=>list.findIndex(other=>other.key===item.key)===index);
  if(state.compareMode==="differences")return all.filter(item=>isDifferent(products,item.key));
  return all;
}

function cellMarkup(product,criterion){const item=product.fields[criterion.key]||fact("unknown","No informado","No existe información suficiente en esta ficha.","#");return `<button class="evidence-cell" type="button" data-evidence-product="${product.id}" data-evidence-key="${criterion.key}"><span class="cell-status"><i class="status-dot status-${item.status}"></i>${statusLabel(item.status)}</span><span class="cell-value">${item.value}</span></button>`;}
function renderComparison(){
  const selected=state.selectedAgents.map(id=>compareProducts.find(product=>product.id===id)).filter(Boolean);
  document.querySelector("#selection-count").textContent=`${selected.length} de 4 seleccionados`;
  if(!selected.length){document.querySelector("#comparison").innerHTML='<div class="comparison-empty"><h2>Selecciona un producto</h2><p>Puedes comparar entre uno y cuatro elementos de la misma categoría.</p></div>';return;}
  const rows=comparisonRows(selected);let lastGroup="";let body="";
  rows.forEach(criterion=>{if(criterion.group!==lastGroup){body+=`<tr class="group-row"><th colspan="${selected.length+1}">${criterion.group}</th></tr>`;lastGroup=criterion.group;}body+=`<tr><td>${criterion.label}</td>${selected.map(product=>`<td>${cellMarkup(product,criterion)}</td>`).join("")}</tr>`;});
  document.querySelector("#comparison").innerHTML=`<table class="compare-table"><thead><tr><th>Criterio</th>${selected.map(product=>`<th>${product.name}<span class="compare-product-meta">${product.company}<br>${product.plan}<br>Verificado: ${product.verified}</span><button class="remove-agent" type="button" data-remove="${product.id}">Quitar</button></th>`).join("")}</tr></thead><tbody>${body}</tbody></table>`;
  document.querySelectorAll("[data-remove]").forEach(button=>button.addEventListener("click",()=>toggleAgent(button.dataset.remove)));
  document.querySelectorAll("[data-evidence-product]").forEach(button=>button.addEventListener("click",()=>openEvidence(button.dataset.evidenceProduct,button.dataset.evidenceKey)));
}

function openEvidence(productId,key){
  const product=compareProducts.find(item=>item.id===productId);const criterion=compareCriteria[product.category].find(item=>item.key===key);const item=product.fields[key];
  document.querySelector("#evidence-category").textContent=`${product.name} · ${criterion.group}`;
  document.querySelector("#evidence-title").textContent=criterion.label;
  document.querySelector("#evidence-value").textContent=item.value;
  document.querySelector("#evidence-note").textContent=item.note;
  document.querySelector("#evidence-plan").textContent=product.plan;
  document.querySelector("#evidence-verified").textContent=item.verified;

  const source=document.querySelector("#evidence-source");source.href=item.source;source.hidden=!item.source||item.source==="#";
  document.querySelector("#evidence-dialog").showModal();
}

function bindInternalLinks(){document.querySelectorAll("[data-go]").forEach(link=>link.addEventListener("click",event=>{event.preventDefault();go(link.dataset.go);}));document.querySelectorAll("[data-term]").forEach(link=>link.addEventListener("click",event=>{event.preventDefault();go(`termino/${link.dataset.term}`);}));}
document.querySelectorAll("[data-route]").forEach(link=>link.addEventListener("click",event=>{event.preventDefault();go(link.dataset.route);}));
document.querySelectorAll("[data-search]").forEach(button=>button.addEventListener("click",()=>searchTerm(button.dataset.search)));
document.querySelector("#global-search").addEventListener("submit",event=>{event.preventDefault();searchTerm(document.querySelector("#global-query").value);});
document.querySelector("#term-filter").addEventListener("input",event=>{state.termQuery=event.target.value;renderTerms();});
document.querySelector("#company-search").addEventListener("input",event=>{state.companyQuery=event.target.value;renderCompanies();});
document.querySelector("#faq-search").addEventListener("input",event=>{state.faqQuery=event.target.value;renderFaqs();});
document.querySelector(".menu-toggle").addEventListener("click",event=>{const open=document.querySelector(".main-nav").classList.toggle("is-open");event.currentTarget.setAttribute("aria-expanded",String(open));});
document.querySelector(".theme-toggle").addEventListener("click",()=>{const dark=document.documentElement.dataset.theme==="dark";document.documentElement.dataset.theme=dark?"light":"dark";localStorage.setItem("atlas-theme",dark?"light":"dark");});
document.querySelector("#compare-scenario").addEventListener("change",event=>{state.compareScenario=event.target.value;renderCompareControls();renderComparison();});
document.querySelector("#evidence-dialog .dialog-close").addEventListener("click",()=>document.querySelector("#evidence-dialog").close());
document.querySelector("#evidence-dialog").addEventListener("click",event=>{if(event.target===event.currentTarget)event.currentTarget.close();});
document.querySelectorAll(".copy-command").forEach(button=>button.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(button.dataset.command);button.textContent="Copiado";setTimeout(()=>button.textContent="Copiar",1600);}catch{button.textContent="Copia manualmente";}}));
window.addEventListener("hashchange",()=>handleRoute());
const savedTheme=localStorage.getItem("atlas-theme");if(savedTheme)document.documentElement.dataset.theme=savedTheme;
renderAlphabet();renderTerms();renderCompanyFilters();renderCompanies();renderFaqFilters();renderFaqs();renderCompareControls();renderAgentPicker();renderComparison();handleRoute(false);

"use strict";(()=>{var g=null,m=null;window.addEventListener("DOMContentLoaded",()=>{let n=document.querySelector("#upload-agent-listing .w-slider-arrow-left"),t=document.querySelector("#upload-agent-listing .w-slider-arrow-right"),e=I();h(e),b(e);let r=document.getElementById("btn-back"),s=document.getElementById("btn-next"),l=document.getElementById("submit-agent-upload");r==null||r.addEventListener("click",()=>{e=I()-1,h(e),b(e),n==null||n.click()}),s==null||s.addEventListener("click",()=>{e=I(),T(e)&&(e+=1,h(e),b(e),t==null||t.click(),e===4&&L())});let a=document.getElementById("email-form");a==null||a.addEventListener("submit",o=>(o.preventDefault(),M(),!0)),window.$memberstackDom.getCurrentMember().then(({data:o})=>{if(o){let c=document.querySelector("#memberstack_id-2");c&&(c.value=o.id),g=o.id}})});var k=n=>{let t=document.querySelector(".mask---brix-copy.request");t&&(t.style.height=n)},b=n=>{let t=window.innerWidth,e=document.querySelector(`#w-slider-mask-0 .w-slide:nth-child(${n}) > .slider-content-wrap---brix`);if(e){let r=e.clientHeight,s=t<324?75:50,l=Math.round(r)+s;k(l+"px")}},I=()=>{var e;let n=((e=document.querySelector(".w-slider-aria-label"))==null?void 0:e.textContent)||"",t=parseInt(n.slice(5,7),10);return isNaN(t)?1:t},h=n=>{let t=document.getElementById("btn-back"),e=document.getElementById("btn-next"),r=document.getElementById("submit-agent-upload");r&&(r.style.display="none"),n===1?(t&&(t.style.display="none"),e&&(e.style.display="block")):n>=2&&n<=3?(t&&(t.style.display="block"),e&&(e.style.display="block")):n===4&&(t&&(t.style.display="block"),e&&(e.style.display="none"),r&&(r.style.display="block"))},f=(n,t,e)=>{e?n.html(t).removeClass("hidden"):n.addClass("hidden")},y=(n,t,e)=>!n||n.trim()===""?(f(e,t,!0),!1):!0,T=n=>{var t,e,r,s,l,a;if(n===1){let i=$("#REA-Confirm").prop("checked"),o=$("#Agreement-Confirm").prop("checked"),c=$("#Induction-Confirm").prop("checked"),u=$(".error-message.slide1");return!i||!o||!c?(f(u,"Please check all checkboxes to proceed.",!0),!1):(f(u,"",!1),!0)}if(n===2){let i=(t=$("#F-Name").val())==null?void 0:t.trim(),o=(e=$("#L-Name").val())==null?void 0:e.trim(),c=(r=$("#Email").val())==null?void 0:r.trim(),u=(s=$("#Mobile").val())==null?void 0:s.trim(),E=(l=$("#Agency").val())==null?void 0:l.trim(),d=$(".error-message.slide2"),p=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;return!y(i,"Please fill all fields to proceed.",d)||!y(o,"Please fill all fields to proceed.",d)||!y(c,"Please fill all fields to proceed.",d)||!y(u,"Please fill all fields to proceed.",d)||!y(E,"Please fill all fields to proceed.",d)?!1:p.test(c)?(f(d,"",!1),!0):(f(d,"Please provide a valid email address.",!0),!1)}if(n===3){let i=(a=$("#TM-URL").val())==null?void 0:a.trim(),o=$(".error-message.slide3");return y(i,"Please fill TradeMe URL to proceed.",o)?(f(o,"",!1),!0):!1}return!0},L=async()=>{let n=document.getElementById("TM-URL").value,t="https://tlfapi.concypt.co.uk/scrape",e=JSON.stringify({url:n}),r=document.getElementById("loading-container");r&&(r.style.display="flex");try{let s=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:e});if(s.ok){m=await s.json(),m.memberID=g;let l=m.images[0],a=m.trademeID,i=document.getElementById("property-name"),o=document.getElementById("tm-thumbnail"),c=document.getElementById("preview-on-tm"),u=document.getElementById("TM-URL"),E=document.getElementById("TM-ID"),d=document.getElementById("Price");if(m.price&&(d.value=m.price),o&&l&&(o.src=l),c&&a){let p="https://www.trademe.co.nz/"+a;c.href=p,E.value=a,u.value=p}i&&(i.innerHTML=m.title)}else{let l=document.getElementById("property-name");l&&(l.innerHTML="An error occurred. Please go back and try again.")}}catch{let l=document.getElementById("property-name");l&&(l.innerHTML="An error occurred. Please go back and try again.")}finally{r&&(r.style.display="none")}},M=async()=>{let n=document.getElementById("loading-container");n&&(n.style.display="flex");let t=document.getElementById("rm-container"),e=document.getElementById("rm-title"),r=document.getElementById("rm-text"),s=document.getElementById("rm-button");if(!g||!m){console.error("Missing memberId or responseData");return}let l={...m,memberID:g},a="https://tlfapi.concypt.co.uk/creatitem";try{let i=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)});if(!i.ok)throw new Error(`HTTP error! status: ${i.status}`);let o=await i.json();i.ok&&t&&(t.style.display="none")}catch(i){console.error("Error creating property item:",i),t&&(t.style.display="flex",e&&(e.innerHTML="Error Creating Property"),r&&(r.innerHTML="An error occurred. Please go back and try again. If you keep experiencing errors, please contact support."),s&&(s.innerHTML="Go Back",s.addEventListener("click",()=>{t.style.display="none"})))}finally{n&&(n.style.display="none")}};})();

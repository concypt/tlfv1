"use strict";(()=>{var r=function(t){let n=[];for(let e in t)t.hasOwnProperty(e)&&n.push(encodeURIComponent(e)+"="+encodeURIComponent(t[e]));return n.join("&")},c=(t,n)=>{let e=n.getTime(),s=t.getTime();return Math.floor((e-s)/864e5)},i=t=>{let[n,e,s]=t.split("-");return new Date([e,n,s].join("/"))},a=new URLSearchParams(window.location.search),o=Object.fromEntries(a.entries()),l=i(o.created),d=new Date,g=c(l,d),f="/listing/"+o.listing;delete o.listing;delete o.created;window.location.replace(f+"?"+r(o));})();

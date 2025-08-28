(function(){"use strict";const r={WIDGET_URL:"http://localhost:3001",DEFAULT_POSITION:"bottom-right"},p=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
</svg>`,b=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>`;(function(){let o=null,t=null,e=null,a=!1,n=null,s=r.DEFAULT_POSITION;const d=document.currentScript;if(console.log("currentScript",d),d)n=d.getAttribute("data-org-id"),s=d.getAttribute("data-position")||r.DEFAULT_POSITION;else{const i=document.querySelectorAll('script[src*="echo-widget"]'),l=Array.from(i).find(c=>c.hasAttribute("data-org-id"));l&&(n=l.getAttribute("data-org-id"),s=l.getAttribute("data-position")||r.DEFAULT_POSITION)}if(console.log("orgId",n),!n){console.error("Echo Widget: data-org-id attribute is required");return}function h(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",g):g()}function g(){e=document.createElement("button"),e.id="echo-widget-button",e.innerHTML=p,e.style.cssText=`
      position: fixed;
      ${s==="bottom-right"?"right: 20px;":"left: 20px;"}
      bottom: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #3b82f6;
      color: white;
      border: none;
      cursor: pointer;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 24px rgba(59, 130, 246, 0.35);
      transition: all 0.2s ease;
    `,e.addEventListener("click",y),e.addEventListener("mouseenter",()=>{e&&(e.style.transform="scale(1.05)")}),e.addEventListener("mouseleave",()=>{e&&(e.style.transform="scale(1)")}),document.body.appendChild(e),t=document.createElement("div"),t.id="echo-widget-container",t.style.cssText=`
      position: fixed;
      ${s==="bottom-right"?"right: 20px;":"left: 20px;"}
      bottom: 90px;
      width: 400px;
      height: 600px;
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 110px);
      z-index: 999998;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
      display: none;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
    `,o=document.createElement("iframe"),o.src=w(),o.style.cssText=`
      width: 100%;
      height: 100%;
      border: none;
    `,o.allow="microphone; clipboard-read; clipboard-write",t.appendChild(o),document.body.appendChild(t),window.addEventListener("message",f)}function w(){const i=new URLSearchParams;return i.append("orgId",n),`${r.WIDGET_URL}?${i.toString()}`}function f(i){if(i.origin!==new URL(r.WIDGET_URL).origin)return;const{type:l,payload:c}=i.data;switch(l){case"close":u();break;case"resize":c.height&&t&&(t.style.height=`${c.height}px`);break}}function y(){a?u():m()}function m(){t&&e&&(a=!0,t.style.display="block",setTimeout(()=>{t&&(t.style.opacity="1",t.style.transform="translateY(0)")},10),e.innerHTML=b)}function u(){t&&e&&(a=!1,t.style.opacity="0",t.style.transform="translateY(10px)",setTimeout(()=>{t&&(t.style.display="none")},300),e.innerHTML=p,e.style.background="#3b82f6")}function x(){window.removeEventListener("message",f),t&&(t.remove(),t=null,o=null),e&&(e.remove(),e=null),a=!1}function v(i){x(),i.orgId&&(n=i.orgId),i.position&&(s=i.position),h()}window.EchoWidget={init:v,show:m,hide:u,destroy:x},h()})()})();

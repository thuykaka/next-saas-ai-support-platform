(function(){"use strict";const n={WIDGET_URL:"https://next-saas-ai-support-platform-widge.vercel.app",DEFAULT_POSITION:"bottom-right"},u=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
</svg>`,b=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>`;(function(){let o=null,e=null,t=null,d=!1,r=null,s=n.DEFAULT_POSITION;const c=document.currentScript;if(c)r=c.getAttribute("data-org-id"),s=c.getAttribute("data-position")||n.DEFAULT_POSITION;else{const i=document.querySelectorAll('script[src*="echo-widget"], script[src*="embed"]'),a=Array.from(i).find(l=>l.hasAttribute("data-org-id"));a&&(r=a.getAttribute("data-org-id"),s=a.getAttribute("data-position")||n.DEFAULT_POSITION)}if(!r){console.error("Echo Widget: data-org-id attribute is required");return}function h(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",g):g()}function g(){t=document.createElement("button"),t.type="button",t.id="echo-widget-button",t.innerHTML=u,t.style.cssText=`
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
    `,t.addEventListener("click",y),t.addEventListener("mouseenter",()=>{t&&(t.style.transform="scale(1.05)")}),t.addEventListener("mouseleave",()=>{t&&(t.style.transform="scale(1)")}),document.body.appendChild(t),e=document.createElement("div"),e.id="echo-widget-container",e.style.cssText=`
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
    `,o.allow="microphone; clipboard-read; clipboard-write",e.appendChild(o),document.body.appendChild(e),window.addEventListener("message",f)}function w(){const i=new URLSearchParams;return i.append("orgId",r),`${n.WIDGET_URL}?${i.toString()}`}function f(i){if(i.origin!==new URL(n.WIDGET_URL).origin||typeof i.data!="object"||i.data===null)return;const{type:a,payload:l}=i.data;switch(a){case"close":p();break;case"resize":l.height&&e&&(e.style.height=`${l.height}px`);break}}function y(){d?p():m()}function m(){e&&t&&(d=!0,e.style.display="block",setTimeout(()=>{e&&(e.style.opacity="1",e.style.transform="translateY(0)")},10),t.innerHTML=b)}function p(){e&&t&&(d=!1,e.style.opacity="0",e.style.transform="translateY(10px)",setTimeout(()=>{e&&(e.style.display="none")},300),t.innerHTML=u,t.style.background="#3b82f6")}function x(){window.removeEventListener("message",f),e&&(e.remove(),e=null,o=null),t&&(t.remove(),t=null),d=!1}function v(i){x(),i.orgId&&(r=i.orgId),i.position&&(s=i.position),h()}window.EchoWidget={init:v,show:m,hide:p,destroy:x},h()})()})();

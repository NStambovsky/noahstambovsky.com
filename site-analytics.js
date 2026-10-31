/* This site's Clarity project only. Never copy its ID into independent game instances. */
(()=>{
 const PROJECT_ID='nylti7eg1i'; // Existing project copied from Sevenworldtales with owner authorization.
 if(!/^[a-z0-9]{6,20}$/.test(PROJECT_ID)||window.__noahAnalytics)return;
 window.__noahAnalytics=true;
 const KEY='noah-site-analytics-consent-v1',MAX_AGE=180*86400000;
 let started=false,choice=null;
 try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved&&['granted','denied'].includes(saved.value)&&Date.now()-saved.at>=0&&Date.now()-saved.at<MAX_AGE)choice=saved.value;}catch{}
 const selector='form,input,textarea,[contenteditable=true]';
 function mask(root=document){if(root.matches?.(selector))root.setAttribute('data-clarity-mask','true');root.querySelectorAll?.(selector).forEach(el=>el.setAttribute('data-clarity-mask','true'));}
 function start(){if(started||choice!=='granted')return;started=true;mask();new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1)mask(node);}).observe(document.body,{childList:true,subtree:true});
  window.clarity=window.clarity||function(){(window.clarity.q=window.clarity.q||[]).push(arguments);};
  window.clarity('consentv2',{analytics_Storage:'granted',ad_Storage:'denied'});
  window.clarity('set','site_domain',location.hostname);
  window.clarity('set','site_section',location.pathname.startsWith('/rogue-dice')?'rogue-dice':location.pathname.startsWith('/crosscamp')||location.pathname.startsWith('/tatakai')?'crosscamp':location.pathname.startsWith('/canvas-lite')?'canvas-lite':'main-site');
  const script=document.createElement('script');script.async=true;script.src='https://www.clarity.ms/tag/'+PROJECT_ID;script.dataset.noahClarity='true';document.head.append(script);
 }
 const host=document.createElement('div');host.id='site-analytics-settings';host.setAttribute('data-clarity-mask','true');const shadow=host.attachShadow({mode:'open'});
 shadow.innerHTML=`<style>:host{all:initial;font-family:system-ui,sans-serif;color:#f6f3e9}button{font:600 13px/1.3 system-ui,sans-serif;cursor:pointer;border:1px solid #96afa6;border-radius:6px;padding:8px 12px;background:#eef3ee;color:#132a27}button:focus-visible{outline:3px solid #f4cc75;outline-offset:3px}.panel{position:fixed;left:12px;bottom:12px;z-index:2147483000;max-width:min(390px,calc(100vw - 24px));padding:16px;box-sizing:border-box;background:#19332ff7;border:1px solid #7c9f91;border-radius:10px;box-shadow:0 5px 24px #0005}.panel[hidden],button[hidden]{display:none}strong{font-size:15px}p{font-size:13px;line-height:1.45;margin:9px 0 12px}.actions{display:flex;flex-wrap:wrap;gap:9px}.quiet{background:transparent;color:#f6f3e9}.settings{position:fixed;left:7px;bottom:7px;z-index:2147482999;font-size:10px;padding:4px 7px;opacity:.8}@media(orientation:landscape) and (max-height:450px){.panel{max-width:380px;padding:12px;bottom:6px}.panel p{margin:6px 0 9px}}</style><button class="settings" type="button" aria-haspopup="dialog">Privacy</button><section class="panel" role="dialog" aria-label="Usage analytics preferences"><strong>Help improve this site?</strong><p>With your permission, Microsoft Clarity records page visits, clicks, scrolling and session replays. Form fields are masked. Advertising storage stays off. Your game saves work either way.</p><div class="actions"><button class="allow" type="button">Allow analytics</button><button class="decline quiet" type="button">Decline</button><button class="close quiet" type="button" hidden>Close</button></div></section>`;
 if(location.pathname.startsWith('/rogue-dice'))shadow.querySelector('style').textContent+=' .panel{background:#141012f7;border-color:#694047;color:#eee3e3}button{background:#a82e3e;border-color:#c35b67;color:#fff0f1}.quiet{background:transparent;color:#e6c7cc}.settings{background:#201317;color:#cfadb3}';
 const panel=shadow.querySelector('.panel'),settings=shadow.querySelector('.settings'),allow=shadow.querySelector('.allow'),decline=shadow.querySelector('.decline'),close=shadow.querySelector('.close');
 const rules=document.getElementById('rules'),practice=document.querySelector('.practice-safety'),embedded=location.pathname.startsWith('/rogue-dice')&&!!(rules||practice);
 if(embedded){const control=document.createElement('button');control.type='button';control.className='quiet';control.textContent='Privacy & analytics';control.setAttribute('aria-haspopup','dialog');control.addEventListener('click',()=>{if(rules?.open)rules.close();show();});if(rules)rules.querySelector('h2').insertAdjacentElement('afterend',control);else practice.append(' · ',control);}
 function hide(){panel.hidden=true;settings.hidden=embedded;}
 function show(){panel.hidden=false;settings.hidden=true;close.hidden=choice===null;decline.textContent=started?'Stop analytics & reload':'Decline';}
 function save(value){choice=value;try{localStorage.setItem(KEY,JSON.stringify({value,at:Date.now()}));}catch{}hide();}
 allow.addEventListener('click',()=>{save('granted');start();});
 decline.addEventListener('click',()=>{const reload=started;save('denied');if(reload){window.clarity?.('consentv2',{analytics_Storage:'denied',ad_Storage:'denied'});location.reload();}});
 close.addEventListener('click',hide);settings.addEventListener('click',show);
 document.body.append(host);if(choice===null)show();else hide();start();
})();

document.addEventListener('DOMContentLoaded',()=>{const t=document.querySelector('.menu-toggle');const n=document.getElementById('site-nav');t?.addEventListener('click',()=>{const opened=n.classList.toggle('open');t.setAttribute('aria-expanded',String(opened));});n?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{n.classList.remove('open');t?.setAttribute('aria-expanded','false');}));const y=document.getElementById('year');if(y)y.textContent=String(new Date().getFullYear());});
// Shared public footer branding and final-section return navigation.
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('main > .wrap.project-return').forEach(block=>{
    const section=document.createElement('section');section.className='project-return';
    section.setAttribute('aria-label','Continue exploring');
    const wrap=document.createElement('div');wrap.className='wrap';
    while(block.firstChild)wrap.append(block.firstChild);
    section.append(wrap);block.replaceWith(section);
  });
  document.querySelectorAll('.site-header nav[aria-label="Case study navigation"] a').forEach(link=>{
    if(link.textContent.trim()==='← Projects')link.textContent='Projects';
  });
});

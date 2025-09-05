document.getElementById('filter-chips')?.addEventListener('click', (e)=>{
  const chip=e.target.closest('.chip'); if(!chip) return;
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active')); chip.classList.add('active');
  const tag=chip.dataset.tag;
  document.querySelectorAll('article[data-tags]').forEach(a=>{
    a.style.display = (tag==='all'||a.dataset.tags.includes(tag)) ? '' : 'none';
  });
});
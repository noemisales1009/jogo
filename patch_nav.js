import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

// replace go function
html = html.replace(`function go(screenId){
  $$('.screen').forEach(s=>s.classList.remove('active'));
  $('#screen-'+screenId).classList.add('active');
}`, `function go(screenId){
  $$('.screen').forEach(s=>{
    s.classList.remove('active');
  });
  const target = $('#screen-'+screenId);
  target.classList.add('active');
  target.scrollTop = 0;
}`);

const oldCardHeroClick = `card.addEventListener('click', ()=>{
      state.hero = h;
      go('villain');
    });`;
const newCardHeroClick = `card.addEventListener('click', ()=>{
      card.style.transform = 'scale(0.95)';
      card.style.boxShadow = '0 0 40px var(--card-color)';
      setTimeout(() => {
        state.hero = h;
        go('villain');
        card.style.transform = '';
        card.style.boxShadow = '';
      }, 150);
    });`;
html = html.replace(oldCardHeroClick, newCardHeroClick);

const oldCardVilClick = `card.addEventListener('click', ()=>{
        state.villain = v;
        startBattle();
      });`;
const newCardVilClick = `card.addEventListener('click', ()=>{
        card.style.transform = 'scale(0.95)';
        card.style.boxShadow = '0 0 40px var(--card-color)';
        setTimeout(() => {
          state.villain = v;
          startBattle();
          card.style.transform = '';
          card.style.boxShadow = '';
        }, 150);
      });`;
html = html.replace(oldCardVilClick, newCardVilClick);

fs.writeFileSync('index.html', html, 'utf8');

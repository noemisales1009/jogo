import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace("btnRankBack.addEventListener('click', () => go('title'));", "btnRankBack.addEventListener('click', () => { buildMap(); go('map'); });");
fs.writeFileSync('index.html', html, 'utf8');

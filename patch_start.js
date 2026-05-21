import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace("$('#btn-start').addEventListener('click', ()=> go('hero'));", "$('#btn-start').addEventListener('click', ()=> { buildMap(); go('map'); });");
html = html.replace("$('#btn-replay').addEventListener('click', ()=> go('villain'));", "$('#btn-replay').addEventListener('click', ()=> { buildMap(); go('map'); });");
fs.writeFileSync('index.html', html, 'utf8');

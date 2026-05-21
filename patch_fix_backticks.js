import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

// The backticks got escaped as \\\` which produced literal \` string in index.html
html = html.replace(/\\\`/g, '`');
html = html.replace(/\\\$/g, '$');

fs.writeFileSync('index.html', html, 'utf8');

import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const svgPatch = `
function buildMap() {
  const container = $('#map-container');
  container.innerHTML = '';
  $('#map-score-display').innerText = userProgress.score;
  
  MAP_DATA.forEach(section => {
    const secDiv = document.createElement('div');
    secDiv.className = 'map-section';
    
    // Header
    secDiv.innerHTML += \\\`
      <div class="map-section-header" style="background: \\\${section.color}">
        <h3 style="color: \\\${section.bg}">\\\${section.title}</h3>
        <p style="color: #000"><b>\\\${section.subtitle}</b></p>
      </div>
    \\\`;
    
    const pathDiv = document.createElement('div');
    pathDiv.className = 'map-path';
    pathDiv.style.position = 'relative';
    pathDiv.style.width = '100%';
    
    const offsets = [0, 60, 80, 60, 0, -60, -80, -60];
    const nodeSpacing = 110; 
    
    // We create a wrapper that centers everything.
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.margin = '0 auto';
    wrapper.style.width = '300px'; // Fixed logical width for the path
    wrapper.style.height = (section.nodes.length * nodeSpacing) + 'px';
    
    let svgPathHtml = \\\`<svg viewBox="0 0 300 \\\${section.nodes.length * nodeSpacing}" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1">\\\`;
    
    for(let i=0; i < section.nodes.length - 1; i++) {
        const x1 = offsets[i % offsets.length] + 150; 
        const y1 = i * nodeSpacing + 40; 
        const x2 = offsets[(i+1) % offsets.length] + 150;
        const y2 = (i+1) * nodeSpacing + 40;
        
        const node1 = section.nodes[i];
        
        let pathColor = '#303b4b'; 
        if (userProgress.completedNodes.includes(node1.id)) {
            pathColor = section.color;
        }
        
        svgPathHtml += \\\`
          <path d="M\\\${x1},\\\${y1} Q\\\${x1},\\\${y1+50} \\\${(x1+x2)/2},\\\${(y1+y2)/2} T\\\${x2},\\\${y2}" 
                fill="none" stroke="\\\${pathColor}" stroke-width="16" stroke-linecap="round" />
          <path d="M\\\${x1},\\\${y1} Q\\\${x1},\\\${y1+50} \\\${(x1+x2)/2},\\\${(y1+y2)/2} T\\\${x2},\\\${y2}" 
                fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="16" stroke-linecap="round" stroke-dasharray="10, 10" />
        \\\`;
    }
    svgPathHtml += '</svg>';
    wrapper.innerHTML = svgPathHtml;
    
    const nodesContainer = document.createElement('div');
    nodesContainer.style.position = 'absolute';
    nodesContainer.style.top = '0';
    nodesContainer.style.left = '0';
    nodesContainer.style.width = '100%';
    nodesContainer.style.height = '100%';
    nodesContainer.style.zIndex = '2';
    
    section.nodes.forEach((node, idx) => {
      const xOffset = offsets[idx % offsets.length] + 150 - 40; // center is 150, node is 80x80 (half is 40)
      const yOffset = idx * nodeSpacing;
      
      const isDone = userProgress.completedNodes.includes(node.id);
      let isCurrent = false;
      let isLocked = true;
      
      if (node.type !== 'locked') {
        const nodeIndex = section.nodes.findIndex(n => n.id === node.id);
        const prevNodeId = nodeIndex > 0 ? section.nodes[nodeIndex-1].id : null;
        
        if (isDone) {
          isLocked = false;
        } else if (nodeIndex === 0 || (prevNodeId && userProgress.completedNodes.includes(prevNodeId))) {
          isCurrent = true;
          isLocked = false;
        }
      }
      
      let stateClass = 'locked';
      if (isDone) stateClass = 'done';
      if (isCurrent) stateClass = 'current';
      
      const nodeEl = document.createElement('div');
      nodeEl.className = \\\`map-node \\\${stateClass}\\\`;
      nodeEl.style.position = 'absolute';
      nodeEl.style.left = \\\`\\\${xOffset}px\\\`;
      nodeEl.style.top = \\\`\\\${yOffset}px\\\`;
      
      if (node.type === 'villain') {
        const v = VILLAINS[node.id];
        let imgHtml = '';
        if (isLocked) {
          imgHtml = \\\`<span class="locked-icon">🔒</span>\\\`;
        } else {
           const match = SPRITES[node.id].match(/src="(.*?)"/);
           const src = match ? match[1] : '';
           imgHtml = \\\`<img src="\\\${src}" />\\\`;
        }
        nodeEl.innerHTML = imgHtml;
        
        nodeEl.addEventListener('click', () => {
          if (!isLocked) {
             nodeEl.style.transform = \\\`scale(0.9)\\\`;
             setTimeout(() => {
                nodeEl.style.transform = \\\`scale(1)\\\`;
                state.villain = v;
                go('hero');
             }, 150);
          }
        });
      } else {
         nodeEl.innerHTML = \\\`<span class="locked-icon">🔒</span>\\\`;
         nodeEl.addEventListener('click', () => {
           if (!nodeEl.classList.contains('locked')) return;
           nodeEl.style.transform = \\\`scale(0.9)\\\`;
           setTimeout(()=>{
             nodeEl.style.transform = \\\`scale(1)\\\`;
           }, 150);
         });
      }
      
      nodesContainer.appendChild(nodeEl);
    });
    
    wrapper.appendChild(nodesContainer);
    pathDiv.appendChild(wrapper);
    secDiv.appendChild(pathDiv);
    container.appendChild(secDiv);
  });
}
`;

html = html.replace(/function buildMap\(\) \{[\s\S]*?\}\n/g, svgPatch);

fs.writeFileSync('index.html', html, 'utf8');

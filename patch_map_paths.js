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
    
    const offsets = [0, 40, 60, 40, 0, -40, -60, -40];
    const nodeSpacing = 120; // total vertical space per node
    
    let svgPathHtml = '<svg style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1">';
    
    // FIRST LOOP - SVG lines
    for(let i=0; i < section.nodes.length - 1; i++) {
        const x1 = offsets[i % offsets.length] + 300; // Assuming max width 600, center 300
        const y1 = i * nodeSpacing + 20 + 40; // 20 padding-top + 40 half-node
        const x2 = offsets[(i+1) % offsets.length] + 300;
        const y2 = (i+1) * nodeSpacing + 20 + 40;
        
        // determine if this line should be colored (both connected nodes are unlocked/completed)
        const node1 = section.nodes[i];
        const node2 = section.nodes[i+1];
        
        let pathColor = '#303b4b'; // locked
        if (userProgress.completedNodes.includes(node1.id)) {
            pathColor = section.color;
        }
        
        svgPathHtml += \\\`
          <path d="M\\\${x1},\\\${y1} Q\\\${x1},\\\${y1+40} \\\${(x1+x2)/2},\\\${(y1+y2)/2} T\\\${x2},\\\${y2}" 
                fill="none" stroke="\\\${pathColor}" stroke-width="12" stroke-linecap="round" />
        \\\`;
    }
    
    svgPathHtml += '</svg>';
    pathDiv.innerHTML = svgPathHtml;
    
    const nodesContainer = document.createElement('div');
    nodesContainer.style.position = 'relative';
    nodesContainer.style.zIndex = '2';
    nodesContainer.style.width = '100%';
    nodesContainer.style.height = (section.nodes.length * nodeSpacing) + 'px';
    
    section.nodes.forEach((node, idx) => {
      const xOffset = offsets[idx % offsets.length];
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
      // Position absolute inside nodesContainer
      nodeEl.style.position = 'absolute';
      nodeEl.style.left = \\\`calc(50% + \\\${xOffset}px - 40px)\\\`;
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
    
    pathDiv.appendChild(nodesContainer);
    secDiv.appendChild(pathDiv);
    container.appendChild(secDiv);
  });
}
`;

// we need to replace the whole buildMap block
html = html.replace(/function buildMap\(\) \{[\s\S]*?\}\n/g, svgPatch);

fs.writeFileSync('index.html', html, 'utf8');

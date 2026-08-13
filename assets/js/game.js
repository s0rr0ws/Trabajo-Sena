const PLAYER_KEY='sena_prismashift_player';
const PROGRESS_KEY='sena_prismashift_progress';
const page=document.body.dataset.page;

if(page==='login'){
  const saved=JSON.parse(localStorage.getItem(PLAYER_KEY)||'null');
  if(saved){document.querySelector('#playerName').value=saved.name||'';document.querySelector('#playerCourse').value=saved.course||'';document.querySelector('#playerSchool').value=saved.school||'';}
  document.querySelector('#playerForm').addEventListener('submit',event=>{
    event.preventDefault();
    const name=document.querySelector('#playerName').value.trim(),course=document.querySelector('#playerCourse').value.trim(),school=document.querySelector('#playerSchool').value.trim();
    if(!name||!course||!school||!document.querySelector('#rulesAccepted').checked){document.querySelector('#playerError').textContent='Completa todos los campos y acepta el alcance académico.';return;}
    localStorage.setItem(PLAYER_KEY,JSON.stringify({name,course,school}));
    location.href='game.html';
  });
}

if(page==='game'){
  const $=s=>document.querySelector(s);
  const key=(r,c)=>`${r},${c}`;
  const rectangle=(r1,r2,c1,c2,holes=[])=>{const blocked=new Set(holes);const tiles=[];for(let r=r1;r<=r2;r++)for(let c=c1;c<=c2;c++)if(!blocked.has(key(r,c)))tiles.push(key(r,c));return tiles};
  const levels=[
    {name:'Primer giro',hint:'Practica el cambio entre de pie y acostado.',rows:8,cols:11,tiles:rectangle(2,6,2,9),start:{orientation:'standing',r:4,c:2},goal:{r:4,c:8}},
    {name:'Esquinas seguras',hint:'Los bordes exigen anticipar las dos casillas del bloque.',rows:8,cols:11,tiles:rectangle(1,7,1,10,['1,1','1,2','1,9','1,10','7,1','7,9','7,10','2,5','6,6']),start:{orientation:'standing',r:6,c:2},goal:{r:3,c:8}},
    {name:'Ruta fragmentada',hint:'No mires solo la casilla siguiente: piensa en la orientación final.',rows:9,cols:12,tiles:rectangle(1,8,1,11,['1,1','1,2','1,6','1,10','1,11','8,1','8,10','8,11','2,6','3,10','5,5','6,9','7,5']),start:{orientation:'standing',r:7,c:2},goal:{r:4,c:8}},
    {name:'Vacíos cruzados',hint:'Usa movimientos laterales cuando el bloque esté acostado.',rows:9,cols:12,tiles:rectangle(1,9,1,12,['1,1','1,2','1,11','1,12','9,1','9,2','9,11','9,12','2,6','3,6','4,9','5,4','6,8','7,11','8,6']),start:{orientation:'standing',r:8,c:2},goal:{r:2,c:8}},
    {name:'Desafío prisma',hint:'Combina todo lo aprendido y busca una ruta eficiente.',rows:9,cols:12,tiles:rectangle(1,9,1,12,['1,1','1,2','1,6','1,11','1,12','9,1','9,2','9,6','9,11','9,12','2,7','3,5','3,9','4,4','4,10','5,7','6,5','6,9','7,7','8,10']),start:{orientation:'standing',r:8,c:2},goal:{r:2,c:11}}
  ];
  const player=JSON.parse(localStorage.getItem(PLAYER_KEY)||'null')||{name:'Jugador',course:'Grado 10',school:'Colegio'};
  let progress=JSON.parse(localStorage.getItem(PROGRESS_KEY)||'null')||{unlocked:1,best:{},runs:[]};
  let levelIndex=0,state,moves=0,busy=false;
  $('#playerLabel').textContent=player.name;$('#courseLabel').textContent=player.course;$('#playerInitial').textContent=player.name[0].toUpperCase();
  const occupied=s=>s.orientation==='standing'?[{r:s.r,c:s.c}]:s.orientation==='horizontal'?[{r:s.r,c:s.c},{r:s.r,c:s.c+1}]:[{r:s.r,c:s.c},{r:s.r+1,c:s.c}];
  const orientationText=o=>({standing:'De pie',horizontal:'Acostado horizontal',vertical:'Acostado vertical'}[o]);
  const saveProgress=()=>localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));
  const isValid=s=>occupied(s).every(p=>levels[levelIndex].tileSet.has(key(p.r,p.c)));
  const isWin=s=>s.orientation==='standing'&&s.r===levels[levelIndex].goal.r&&s.c===levels[levelIndex].goal.c;
  const nextState=(s,direction)=>{
    const n={...s};
    if(s.orientation==='standing'){
      if(direction==='left')Object.assign(n,{orientation:'horizontal',c:s.c-2});
      if(direction==='right')Object.assign(n,{orientation:'horizontal',c:s.c+1});
      if(direction==='up')Object.assign(n,{orientation:'vertical',r:s.r-2});
      if(direction==='down')Object.assign(n,{orientation:'vertical',r:s.r+1});
    }else if(s.orientation==='horizontal'){
      if(direction==='left')Object.assign(n,{orientation:'standing',c:s.c-1});
      if(direction==='right')Object.assign(n,{orientation:'standing',c:s.c+2});
      if(direction==='up')n.r=s.r-1;
      if(direction==='down')n.r=s.r+1;
    }else{
      if(direction==='up')Object.assign(n,{orientation:'standing',r:s.r-1});
      if(direction==='down')Object.assign(n,{orientation:'standing',r:s.r+2});
      if(direction==='left')n.c=s.c-1;
      if(direction==='right')n.c=s.c+1;
    }
    return n;
  };
  levels.forEach(level=>level.tileSet=new Set(level.tiles));
  const renderLevelButtons=()=>{$('#levelButtons').innerHTML=levels.map((l,i)=>`<button data-level="${i}" class="${i===levelIndex?'active':''}" ${i+1>progress.unlocked?'disabled':''} title="${l.name}">${i+1}</button>`).join('')};
  const renderBoard=()=>{
    const level=levels[levelIndex],parts=new Set(occupied(state).map(p=>key(p.r,p.c)));$('#board').style.setProperty('--cols',level.cols);let html='';
    for(let r=1;r<=level.rows;r++)for(let c=1;c<=level.cols;c++){
      const k=key(r,c),tile=level.tileSet.has(k),goal=r===level.goal.r&&c===level.goal.c,part=parts.has(k);
      html+=`<div class="cell ${tile?'tile':''} ${goal?'goal':''} ${part?'block-part':''} ${part&&state.orientation==='standing'?'standing':''}" data-cell="${k}"></div>`;
    }
    $('#board').innerHTML=html;$('#moves').textContent=moves;$('#best').textContent=progress.best[levelIndex+1]??'—';$('#orientation').textContent=orientationText(state.orientation);$('#occupied').textContent=occupied(state).map(p=>`(${p.r}, ${p.c})`).join(' y ');
  };
  const loadLevel=index=>{levelIndex=index;state={...levels[index].start};moves=0;busy=false;$('#board').classList.remove('falling');$('#levelKicker').textContent=`Nivel ${index+1} de ${levels.length}`;$('#levelName').textContent=levels[index].name;$('#levelHint').textContent=levels[index].hint;$('#message').textContent='';$('#winModal').hidden=true;renderLevelButtons();renderBoard()};
  const win=()=>{busy=true;const number=levelIndex+1,best=progress.best[number];if(best===undefined||moves<best)progress.best[number]=moves;progress.unlocked=Math.max(progress.unlocked,Math.min(levels.length,number+1));progress.runs.push({level:number,moves,completedAt:new Date().toISOString(),player:player.name});saveProgress();renderLevelButtons();$('#winTitle').textContent=number===levels.length?'¡Prisma dominado!':'¡Nivel superado!';$('#winText').textContent=`Completaste “${levels[levelIndex].name}” en ${moves} movimientos. Tu mejor marca es ${progress.best[number]}.`;$('#nextLevel').textContent=number===levels.length?'Volver al nivel 1':'Siguiente nivel';$('#winModal').hidden=false;renderBoard()};
  const move=direction=>{if(busy||!$('#winModal').hidden||!$('#helpModal').hidden)return;const candidate=nextState(state,direction);moves++;state=candidate;renderBoard();if(!isValid(candidate)){busy=true;$('#message').textContent='El bloque cayó. Reiniciando…';$('#board').classList.add('falling');setTimeout(()=>loadLevel(levelIndex),650);return}if(isWin(candidate)){$('#message').textContent='¡Objetivo alcanzado!';setTimeout(win,250)}else $('#message').textContent=''};
  $('#levelButtons').addEventListener('click',e=>{const b=e.target.closest('[data-level]');if(b&&!b.disabled)loadLevel(Number(b.dataset.level))});
  document.querySelectorAll('[data-move]').forEach(b=>b.addEventListener('click',()=>move(b.dataset.move)));
  document.addEventListener('keydown',e=>{const map={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right'};if(map[e.key]){e.preventDefault();move(map[e.key])}});
  $('#restart').addEventListener('click',()=>loadLevel(levelIndex));
  $('#replayLevel').addEventListener('click',()=>loadLevel(levelIndex));
  $('#nextLevel').addEventListener('click',()=>loadLevel(levelIndex===levels.length-1?0:levelIndex+1));
  $('#showHelp').addEventListener('click',()=>{$('#helpModal').hidden=false});$('#closeHelp').addEventListener('click',()=>{$('#helpModal').hidden=true});
  $('#clearProgress').addEventListener('click',()=>{progress={unlocked:1,best:{},runs:[]};saveProgress();loadLevel(0)});
  loadLevel(0);
}

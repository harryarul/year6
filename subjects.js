/* subjects.js — shared engine for Year 6 Hub subject pages.
   Each page defines window.SUBJECT = {title, kicker, heroWord, sub, TOPICS, GROUP, VIDEOS, EXPLORE, Q}
   then includes this file. It builds the whole page and wires all behaviour. */
(function(){
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const take=(a,n)=>shuffle(a).slice(0,Math.min(n,a.length));
  const cap=s=>s[0].toUpperCase()+s.slice(1);
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  window.__shuffle=shuffle;

  const S=window.SUBJECT;
  let current=null, diff='simple', quiz=null;

  document.addEventListener('DOMContentLoaded',()=>{
    document.title='Year 6 '+S.title+' — NSW Stage 3';
    const wrap=document.createElement('div'); wrap.className='wrap';
    wrap.innerHTML=`
      <header class="site">
        <span class="kicker">${esc(S.kicker)}</span>
        <h1>Year 6 <span>${esc(S.heroWord)}</span></h1>
        <p class="sub">${esc(S.sub)}</p>
      </header>
      <div id="home">
        <div class="nav-row"><a class="backbtn hub" href="index.html">↖ Year 6 Hub</a></div>
        <div class="grid" id="topicGrid"></div>
      </div>
      <div class="topic-view" id="topicView">
        <div class="nav-row">
          <a class="backbtn hub" href="index.html">↖ Year 6 Hub</a>
          <button class="backbtn" onclick="SUBJ.goHome()">← All topics</button>
        </div>
        <div class="topic-head"><h2 id="tvTitle"></h2><span class="badge" id="tvStrand"></span></div>
        <p class="topic-intro" id="tvIntro"></p>
        <div class="subtabs">
          <button class="subtab on" id="subtabWatch" onclick="SUBJ.show('watch')">📺 Watch</button>
          <button class="subtab" id="subtabExplore" onclick="SUBJ.show('explore')">🔍 Explore</button>
          <button class="subtab" id="subtabQuiz" onclick="SUBJ.show('quiz')">📝 Quiz</button>
        </div>
        <div class="sec active" id="secWatch"><div id="heroBox"></div><div id="picStrip"></div><div id="videoList"></div></div>
        <div class="sec" id="secExplore"><div id="exploreBox"></div>
          <p class="explore-note">Explore more online (opens in a new tab):</p>
          <div class="links-row" id="exploreLinks"></div></div>
        <div class="sec" id="secQuiz">
          <div class="toolbar">
            <div class="tabs">
              <button class="tab simple on" id="tabSimple" onclick="SUBJ.setDiff('simple')">Simple</button>
              <button class="tab hard" id="tabHard" onclick="SUBJ.setDiff('hard')">Hard</button>
            </div>
            <button class="btn" onclick="SUBJ.regen()">↻ New questions</button>
            <button class="btn sun" id="ansBtn" onclick="SUBJ.toggleAnswers()">Show answers</button>
            <button class="btn ghost" onclick="window.print()">🖨 Print worksheet</button>
          </div>
          <div class="ws-title" id="wsTitle"></div>
          <p class="ws-note">Watch and explore first, then try the quiz. Check with “Show answers”.</p>
          <ol class="questions" id="qList"></ol>
        </div>
        <div class="nav-row" style="justify-content:center;margin-top:24px">
          <a class="backbtn hub" href="index.html">↖ Back to Year 6 Hub</a>
          <button class="backbtn" onclick="SUBJ.goHome()">← All ${esc(S.heroWord)} topics</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    renderGrid();
  });

  function renderGrid(){
    let html='',last='';
    S.TOPICS.forEach(t=>{
      if(t.group!==last){html+=`<div class="strand-label">${esc(S.GROUP[t.group])}</div>`;last=t.group;}
      html+=`<div class="card" style="--accent:${t.accent||'var(--primary)'}" onclick="SUBJ.open('${t.id}')">
        <div class="ic">${t.icon||'⭐'}</div><h3>${esc(t.name)}</h3><p>${esc(t.intro)}</p></div>`;
    });
    document.getElementById('topicGrid').innerHTML=html;
  }

  function open(id){
    current=S.TOPICS.find(t=>t.id===id); diff='simple';
    document.body.classList.remove('show-answers');
    document.getElementById('ansBtn').textContent='Show answers';
    document.getElementById('home').style.display='none';
    document.getElementById('topicView').classList.add('active');
    document.getElementById('tvTitle').textContent=current.name;
    document.getElementById('tvStrand').textContent=S.GROUP[current.group];
    document.getElementById('tvIntro').textContent=current.intro;
    renderWatch(); renderExplore(); quiz=null; setDiff('simple',true);
    show('watch'); window.scrollTo(0,0);
  }
  function goHome(){document.getElementById('topicView').classList.remove('active');document.getElementById('home').style.display='block';window.scrollTo(0,0);}
  function show(name){['watch','explore','quiz'].forEach(s=>{
    document.getElementById('sec'+cap(s)).classList.toggle('active',s===name);
    document.getElementById('subtab'+cap(s)).classList.toggle('on',s===name);});}

  /* ---- Watch (hero + picture strip + videos) ---- */
  function renderWatch(){
    document.getElementById('heroBox').innerHTML=`<div class="hero-banner">
      <div class="emoji">${current.icon||'⭐'}</div><div class="cap">${esc(current.intro)}</div></div>`;
    document.getElementById('picStrip').innerHTML='<div class="pic-strip">'+(current.pics||[]).map(p=>
      `<div class="pic"><div class="pe">${p[0]}</div><small>${esc(p[1])}</small></div>`).join('')+'</div>';
    const vids=S.VIDEOS[current.id]||[];
    document.getElementById('videoList').innerHTML=vids.map(v=>{
      if(v.id) return `<div class="video-card"><h4>${esc(v.title)}</h4><div class="by">${esc(v.by)}</div>
        <div class="video-wrap"><iframe loading="lazy" src="https://www.youtube.com/embed/${v.id}" title="${esc(v.title)}" allowfullscreen allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div>
        <a class="yt" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">▶ Watch on YouTube</a></div>`;
      return `<a class="video-link" href="${v.url}" target="_blank" rel="noopener"><span class="play">▶</span>
        <span><b>${esc(v.title)}</b><small>${esc(v.by)}</small></span></a>`;
    }).join('');
  }

  /* ---- Explore (interactive widgets) ---- */
  let gScore=0,gTotal=0,gCur=null,pixColor='#222',reactState='idle',reactStart=0,reactBest=null,reactTimer=null,breatheTimer=null;
  let binState=[0,0,0,0],binTarget=null;const BINVAL=[8,4,2,1];
  function renderExplore(){
    const cfg=S.EXPLORE[current.id]; const box=document.getElementById('exploreBox');
    document.getElementById('exploreLinks').innerHTML=(cfg.links||[]).map((l,i)=>
      `<a class="linkbtn ${i%2?'alt':''}" href="${l[1]}" target="_blank" rel="noopener">${esc(l[0])}</a>`).join('');
    if(cfg.kind==='sort'){gScore=0;gTotal=0;
      box.innerHTML=`<div class="game"><h4>${esc(cfg.title)}</h4><div class="ghint">${esc(cfg.hint)}</div>
        <div class="prompt" id="gPrompt"></div><div class="opts" id="gOpts"></div>
        <div class="feedback" id="gFeedback"></div><div class="gscore" id="gScoreBox">Score: 0 / 0</div></div>`;
      nextSort();
    } else if(cfg.kind==='pixel'){
      const sw=['#222','#e23b3b','#ee8b1e','#f4c20d','#3a9d6b','#3a7ca5','#7a4fb0','#ffffff'];
      pixColor='#222';
      box.innerHTML=`<div class="game"><h4>${esc(cfg.title)}</h4><div class="ghint">${esc(cfg.hint)}</div>
        <div class="palette">${sw.map((c,i)=>`<div class="sw ${i===0?'sel':''}" style="background:${c};${c==='#ffffff'?'border-color:#ccc;':''}" onclick="SUBJ.pixPick(this,'${c}')"></div>`).join('')}</div>
        <div class="pixgrid" id="pixgrid"></div>
        <div class="opts"><button class="opt" onclick="SUBJ.pixClear()">🧽 Clear</button></div></div>`;
      const g=document.getElementById('pixgrid'); g.style.gridTemplateColumns='repeat(14,20px)';
      let cells='';for(let i=0;i<14*14;i++)cells+=`<div class="px" onclick="SUBJ.pixPaint(this)"></div>`;g.innerHTML=cells;
    } else if(cfg.kind==='prompt'){
      box.innerHTML=`<div class="game"><h4>${esc(cfg.title)}</h4><div class="ghint">${esc(cfg.hint)}</div>
        <div class="prompt" id="pPrompt">Tap the button for a challenge!</div>
        <div class="opts"><button class="opt" onclick="SUBJ.newPrompt()">🎲 Give me a challenge</button></div></div>`;
    } else if(cfg.kind==='breathe'){
      box.innerHTML=`<div class="game"><h4>${esc(cfg.title)}</h4><div class="ghint">${esc(cfg.hint)}</div>
        <div class="breathe-stage"><div class="breathe-circle" id="bCircle">Ready</div>
        <div class="opts"><button class="opt" id="bBtn" onclick="SUBJ.breatheToggle()">▶ Start</button></div></div></div>`;
    } else if(cfg.kind==='reaction'){
      reactState='idle';reactBest=null;
      box.innerHTML=`<div class="game"><h4>${esc(cfg.title)}</h4><div class="ghint">${esc(cfg.hint)}</div>
        <div class="reactbox" id="reactBox" onclick="SUBJ.reactClick()">Tap to start</div>
        <div class="gscore" id="reactMsg"></div></div>`;
    } else if(cfg.kind==='binary'){
      binState=[0,0,0,0];binTarget=null;
      box.innerHTML=`<div class="game"><h4>${esc(cfg.title)}</h4><div class="ghint">${esc(cfg.hint)}</div>
        <div class="bits" id="bits"></div><div class="bignum" id="binVal">0</div>
        <div class="feedback" id="binChallenge"></div>
        <div class="opts"><button class="opt" onclick="SUBJ.newTarget()">🎯 Give me a number to make</button></div>
        <div class="gscore" id="binMsg"></div></div>`;
      renderBits();
    }
  }
  function nextSort(){const cfg=S.EXPLORE[current.id];gCur=pick(cfg.items);
    document.getElementById('gPrompt').textContent=gCur[0];
    document.getElementById('gFeedback').textContent='';
    document.getElementById('gOpts').innerHTML=cfg.cats.map(c=>`<button class="opt" onclick="SUBJ.answerSort(this,'${c.replace(/'/g,"\\'")}')">${esc(c)}</button>`).join('');}
  function answerSort(btn,choice){gTotal++;const correct=gCur[1];
    document.querySelectorAll('#gOpts .opt').forEach(b=>b.disabled=true);
    const fb=document.getElementById('gFeedback');
    if(choice===correct){btn.classList.add('right');gScore++;fb.style.color='var(--green)';fb.textContent='✓ Correct!';}
    else{btn.classList.add('wrong');fb.style.color='var(--coral-dk)';fb.textContent='✗ It’s '+correct+'.';
      document.querySelectorAll('#gOpts .opt').forEach(b=>{if(b.textContent===correct)b.classList.add('right');});}
    document.getElementById('gScoreBox').textContent=`Score: ${gScore} / ${gTotal}`;
    setTimeout(nextSort,1100);}
  function pixPick(el,c){pixColor=c;document.querySelectorAll('.sw').forEach(s=>s.classList.remove('sel'));el.classList.add('sel');}
  function pixPaint(el){el.style.background=pixColor;}
  function pixClear(){document.querySelectorAll('#pixgrid .px').forEach(p=>p.style.background='#fff');}
  function newPrompt(){const cfg=S.EXPLORE[current.id];document.getElementById('pPrompt').textContent=pick(cfg.prompts);}
  function breatheToggle(){const c=document.getElementById('bCircle'),btn=document.getElementById('bBtn');
    if(breatheTimer){clearInterval(breatheTimer);breatheTimer=null;c.classList.remove('big');c.textContent='Ready';btn.textContent='▶ Start';return;}
    btn.textContent='⏸ Stop';let phase=0;const steps=['Breathe in…','Hold…','Breathe out…','Hold…'];
    const tick=()=>{c.textContent=steps[phase%4];if(phase%4===0)c.classList.add('big');if(phase%4===2)c.classList.remove('big');phase++;};
    tick();breatheTimer=setInterval(tick,4000);}
  function reactClick(){const box=document.getElementById('reactBox'),msg=document.getElementById('reactMsg');
    if(reactState==='idle'||reactState==='done'){reactState='waiting';box.className='reactbox waiting';box.textContent='Wait for green…';
      reactTimer=setTimeout(()=>{reactState='go';box.className='reactbox go';box.textContent='TAP NOW!';reactStart=Date.now();},800+Math.random()*2200);
    } else if(reactState==='waiting'){clearTimeout(reactTimer);reactState='done';box.className='reactbox';box.textContent='Too soon! Tap to try again';
    } else if(reactState==='go'){const ms=Date.now()-reactStart;reactState='done';box.className='reactbox';box.textContent='Tap to try again';
      if(reactBest===null||ms<reactBest)reactBest=ms;msg.textContent=`Your time: ${ms} ms  •  Best: ${reactBest} ms`;}}
  function renderBits(){document.getElementById('bits').innerHTML=binState.map((b,i)=>
      `<div class="bit ${b?'on':''}" onclick="SUBJ.toggleBit(${i})"><div class="b">${b}</div><small>${BINVAL[i]}</small></div>`).join('');
    const val=binState.reduce((s,b,i)=>s+b*BINVAL[i],0);
    document.getElementById('binVal').textContent=val;
    if(binTarget!==null){const msg=document.getElementById('binMsg');
      if(val===binTarget){msg.style.color='var(--green)';msg.textContent='🎉 You made '+binTarget+'! Try another.';}
      else{msg.style.color='#9a917f';msg.textContent='Target: '+binTarget+'  (binary: '+binTarget.toString(2).padStart(4,'0')+')';}}}
  function toggleBit(i){binState[i]=binState[i]?0:1;renderBits();}
  function newTarget(){binTarget=Math.floor(Math.random()*15)+1;const ch=document.getElementById('binChallenge');
    ch.style.color='var(--primary-dk)';ch.textContent='Make the number '+binTarget+' using the bits!';renderBits();}

  /* ---- Quiz ---- */
  function genQuiz(){return {simple:take(S.Q[current.id].simple,10),hard:take(S.Q[current.id].hard,10)};}
  function setDiff(d,skip){diff=d;
    document.getElementById('tabSimple').classList.toggle('on',d==='simple');
    document.getElementById('tabHard').classList.toggle('on',d==='hard');
    if(!skip||!quiz)quiz=genQuiz();renderQuiz();}
  function regen(){quiz=genQuiz();renderQuiz();}
  function renderQuiz(){const list=quiz[diff];
    document.getElementById('wsTitle').innerHTML=`${esc(current.name)} Quiz <span class="pill ${diff==='simple'?'green':'coral'}">${diff} · ${list.length} questions</span>`;
    document.getElementById('qList').innerHTML=list.map(it=>`<li><div class="qtext">${esc(it.q)}</div>
      <button class="reveal" onclick="this.nextElementSibling.style.display='block';this.style.display='none'">Reveal answer</button>
      <div class="ans">${esc(it.a)}</div></li>`).join('');}
  function toggleAnswers(){const on=document.body.classList.toggle('show-answers');document.getElementById('ansBtn').textContent=on?'Hide answers':'Show answers';}

  window.SUBJ={open,goHome,show,setDiff,regen,toggleAnswers,answerSort,pixPick,pixPaint,pixClear,newPrompt,breatheToggle,reactClick,toggleBit,newTarget};
})();

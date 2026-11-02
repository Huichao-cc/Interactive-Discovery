const scenes= {
    living: {
        title:'The living room',text:'Your cat is nowhere in sight. Where will you look first?',action:'Call your cat',message:'No answer. Try the sofa, the cat bed, or the closet.'
    }
    ,
kitchen: {
        title:'The treat cupboard',text:'A familiar snack might persuade a shy cat to come out.',action:'Pick up a cat treat'
    }
    ,
sofa: {
        title:'Under the sofa',text:'Lift the cover and take a closer look.',action:'Search under the sofa',message:'No cat here. But you hear a faint rustle near the closet…'
    }
    ,
bed: {
        title:'The empty cat bed',text:'Usually the favourite place for an afternoon nap.',action:'Check the cat bed',message:'The bed is empty. Your cat has found another cosy hiding place.'
    }
    ,
closet: {
        title:'Behind the clothes',text:'Something could be hiding behind these soft coats.',action:'Listen carefully'
    }
    ,
found: {
        title:'There you are!',text:'A little face peeks out from behind the coat. The treat worked. Mystery solved!',action:'Play again'
    }
}
;
let state;
try {
    state=JSON.parse(localStorage.getItem('cat-search-v1'))
}
catch {
}
if(!state)state= {
    treat:false,clue:false,searched:[],scene:'living'
}
;
const el=id=>document.getElementById(id);
function save() {
    try {
        localStorage.setItem('cat-search-v1',JSON.stringify(state))
    }
    catch {
    }
}
function go(key) {
    if(key==='found'&&!(state.treat&&state.clue))key='closet';
    state.scene=key;
    save();
    render()
}
function render() {
    let key=state.scene,s=scenes[key];
    if(!s) {
        go('living');
        return
    }
    el('photo').src='images/'+key+'.jpg';
    el('photo').alt=s.title;
    el('title').textContent=s.title;
    el('description').textContent=s.text;
    el('number').textContent=key==='found'?'CASE CLOSED':'EXPLORE · '+(Object.keys(scenes).indexOf(key)+1);
    el('feedback').textContent='';
    el('actions').replaceChildren();
    let b=document.createElement('button');
    b.textContent=key==='kitchen'&&state.treat?'Treat already collected':s.action;
    b.onclick=act;
    el('actions').append(b);
    if(key==='closet') {
        let t=document.createElement('button');
        t.textContent='Use cat treat';
        t.onclick=()=> {
            if(!state.treat)el('feedback').textContent='You need a treat. Look in the kitchen cupboard.';
            else if(!state.clue)el('feedback').textContent='Listen first to find out where the sound is coming from.';
            else go('found')
        }
        ;
        el('actions').append(t)
    }
    el('places').replaceChildren();
    for(let k of ['living','kitchen','sofa','bed','closet']) {
        let n=document.createElement('button');
        n.textContent=scenes[k].title+(state.searched.includes(k)?' · checked':'');
        n.className=k===key?'active':'';
        n.onclick=()=>go(k);
        el('places').append(n)
    }
    el('inventory').textContent=state.treat?'Treat: collected':'Treat: not collected';
    el('clue').textContent=state.clue?'Clue: a rustle in the closet':'Clue: keep exploring';
    el('progress').textContent=state.searched.length+' / 5 places investigated'
}
function act() {
    let k=state.scene;
    if(k==='found') {
        restart();
        return
    }
    if(!state.searched.includes(k))state.searched.push(k);
    let message=scenes[k].message;
    if(k==='kitchen') {
        message=state.treat?'You already have a treat. Try the closet.':'You picked up a cat treat. It is now in your pocket.';
        state.treat=true
    }
    if(k==='sofa'||k==='closet') {
        state.clue=true;
        if(k==='closet')message='A soft rustle! Your cat may be behind the coats. A treat could help.'
    }
    save();
    render();
    el('feedback').textContent=message
}
function hint() {
    el('hint').textContent=!state.treat?'Look for a snack in the kitchen cupboard.':!state.clue?'Search under the sofa or listen inside the closet.':'Go to the closet and use your treat.'
}
function restart() {
    state= {
        treat:false,clue:false,searched:[],scene:'living'
    }
    ;
    el('hint').textContent='';
    save();
    render()
}
render();

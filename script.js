(function(){
'use strict';
const TAU=Math.PI*2;
const EMOJI='"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

/* ================= terrain ================= */
// g: group. b: blocks movement and sight. glow: light radius in squares. tog: what a tap turns it into. f: flat color when zoomed out.
const T=[
 {k:'rock',n:'Solid rock (erase)',g:'Floors',c:'#14181e',b:1},
 {k:'floor',n:'Stone floor',g:'Floors',c:'#6d685d'},
 {k:'wall',n:'Stone wall',g:'Walls',c:'#363c47',b:1},
 {k:'door',n:'Door, closed',g:'Walls',c:'#6d685d',f:'#8a5a2b',b:1,tog:'dooro'},
 {k:'dooro',n:'Door, open',g:'Walls',c:'#6d685d',f:'#7a6a55',tog:'door'},
 {k:'rubble',n:'Rubble',g:'Floors',c:'#5d5850'},
 {k:'dirt',n:'Dirt',g:'Wild',c:'#6b5338'},
 {k:'grass',n:'Grass',g:'Wild',c:'#4c7838'},
 {k:'brush',n:'Tall brush',g:'Wild',c:'#3d6a2b'},
 {k:'tree',n:'Trees',g:'Wild',c:'#355d29',f:'#1f3d24',b:1,gr:'grass'},
 {k:'sand',n:'Sand',g:'Wild',c:'#b39a68'},
 {k:'shallow',n:'Shallow water',g:'Water',c:'#1f96d2'},
 {k:'deep',n:'Deep water',g:'Water',c:'#0f58a3'},
 {k:'ice',n:'Ice',g:'Water',c:'#a7c9d6'},
 {k:'lava',n:'Lava',g:'Water',c:'#cf4f1b',glow:3},
 {k:'acid',n:'Acid pool',g:'Living',c:'#9cbc2a',glow:1},
 {k:'chasm',n:'Chasm',g:'Floors',c:'#050608'},
 {k:'flesh',n:'Flesh floor',g:'Living',c:'#9a4b52'},
 {k:'fleshwall',n:'Flesh wall',g:'Living',c:'#5a1f27',b:1},
 {k:'memb',n:'Membrane, closed',g:'Living',c:'#9a4b52',f:'#c46a7a',b:1,tog:'membo'},
 {k:'membo',n:'Membrane, open',g:'Living',c:'#9a4b52',f:'#a85a66',tog:'memb'},
 {k:'bone',n:'Bone floor',g:'Living',c:'#cbbfa3'},
 {k:'ribs',n:'Rib wall',g:'Living',c:'#e2d8bd',f:'#bfb397',b:1},
 {k:'veins',n:'Veins',g:'Living',c:'#9a4b52',f:'#8a3a46'},
 {k:'fungus',n:'Glowing fungus',g:'Wild',c:'#2b2236',f:'#5d4a80',glow:2},
 {k:'crystal',n:'Glow crystal',g:'Objects',c:'#1d2730',f:'#5fb6c9',b:1,glow:3},
 {k:'eye',n:'Dungeon eye',g:'Living',c:'#5a1f27',f:'#7a2d37',b:1,glow:1},
 {k:'maw',n:'Maw of teeth',g:'Living',c:'#2a0c10'},
 {k:'bridge',n:'Bridge',g:'Floors',c:'#7a5634'},
 {k:'roots',n:'Roots',g:'Wild',c:'#6b5338',f:'#5a452f'},
 {k:'mud',n:'Mud',g:'Wild',c:'#4d3f2e'},
 {k:'swamp',n:'Swamp water',g:'Water',c:'#3b5236'},
 {k:'snow',n:'Snow',g:'Water',c:'#dfe7ea'},
 {k:'obsidian',n:'Obsidian',g:'Floors',c:'#25222c'},
 {k:'wood',n:'Wood floor',g:'Floors',c:'#7a5636'},
 {k:'tile',n:'Tiled floor',g:'Floors',c:'#a9a499'},
 {k:'carpet',n:'Carpet',g:'Floors',c:'#6e2c38'},
 {k:'cavewall',n:'Cave wall',g:'Walls',c:'#3b3530',b:1},
 {k:'icewall',n:'Ice wall',g:'Walls',c:'#7fa6b8',b:1},
 {k:'woodwall',n:'Wooden wall',g:'Walls',c:'#5a3d24',b:1},
 {k:'secret',n:'Secret door',g:'Walls',c:'#363c47',b:1,tog:'dooro'},
 {k:'stalag',n:'Stalagmites',g:'Objects',c:'#6d685d',f:'#4f4a43',b:1},
 {k:'pillar',n:'Pillar',g:'Objects',c:'#6d685d',f:'#8a8578',b:1},
 {k:'stairsup',n:'Stairs up',g:'Objects',c:'#6d685d',f:'#9a9486'},
 {k:'stairsdn',n:'Stairs down',g:'Objects',c:'#6d685d',f:'#4a463f'},
 {k:'pit',n:'Pit trap',g:'Objects',c:'#6d685d',f:'#1a1714'},
 {k:'mushroom',n:'Giant mushroom',g:'Wild',c:'#4a3a2a',f:'#4fb3a6',b:1,glow:1,gr:'dirt'},
 {k:'web',n:'Cobwebs',g:'Wild',c:'#4a4740',f:'#8a877e'},
 {k:'fire',n:'Campfire',g:'Objects',c:'#6b5338',f:'#e0862a',glow:4},
 {k:'torch',n:'Wall torch',g:'Walls',c:'#363c47',f:'#a8622a',b:1,glow:4},
 {k:'altar',n:'Altar',g:'Objects',c:'#6d685d',f:'#b9b2a2'},
 {k:'statue',n:'Statue',g:'Objects',c:'#6d685d',f:'#9e9a92',b:1},
 {k:'chest',n:'Treasure',g:'Objects',c:'#6d685d',f:'#c9a03d'},
 {k:'portal',n:'Portal',g:'Objects',c:'#1a1424',f:'#8a5ad1',glow:2},
 {k:'circle',n:'Magic circle',g:'Objects',c:'#6d685d',f:'#5aa39a',glow:1},
 {k:'tentacle',n:'Tentacles',g:'Living',c:'#9a4b52',f:'#6e3a5e'},
 {k:'teethwall',n:'Teeth wall',g:'Living',c:'#3a0d14',f:'#d9cfb8',b:1},
 {k:'blood',n:'Blood pool',g:'Living',c:'#6e0f19'},
 {k:'crust',n:'Lava crust',g:'Water',c:'#3a2420',glow:1},
 {k:'cobble',n:'Cobblestone',g:'Floors',c:'#77736b'},
 {k:'road',n:'Dirt road',g:'Wild',c:'#8a7150'},
 {k:'flowers',n:'Wildflowers',g:'Wild',c:'#4f7d3a'},
 {k:'wheat',n:'Wheat field',g:'Wild',c:'#c2a04a'},
 {k:'dunes',n:'Dunes',g:'Wild',c:'#c9a96e'},
 {k:'battlement',n:'Castle wall',g:'Walls',c:'#8c8a84',b:1},
 {k:'portcullis',n:'Portcullis, shut',g:'Walls',c:'#6d685d',f:'#3a3a3a',b:1,tog:'portcullo'},
 {k:'portcullo',n:'Portcullis, raised',g:'Walls',c:'#6d685d',f:'#5a5650',tog:'portcullis'},
 {k:'roof',n:'Tiled roof',g:'Structures',c:'#9a4a32',b:1},
 {k:'thatch',n:'Thatched roof',g:'Structures',c:'#b39150',b:1},
 {k:'palm',n:'Palm tree',g:'Wild',c:'#c9a96e',f:'#4f8a3a',gr:'sand'},
 {k:'deadtree',n:'Dead tree',g:'Wild',c:'#6b5338',f:'#4a3a2a',gr:'dirt'},
 {k:'boulder',n:'Boulder',g:'Wild',c:'#4c7838',f:'#7a766d',b:1,gr:'grass'},
 {k:'tent',n:'Tent',g:'Structures',c:'#4c7838',f:'#b8a27a',b:1,gr:'grass'},
 {k:'well',n:'Well',g:'Structures',c:'#77736b',f:'#5a6a7a',b:1,gr:'cobble'},
 {k:'grave',n:'Gravestone',g:'Structures',c:'#4c7838',f:'#8a8780',gr:'grass'},
 {k:'fence',n:'Fence',g:'Structures',c:'#4c7838',f:'#7a5a36',gr:'grass'},
 {k:'crates',n:'Crates and barrels',g:'Structures',c:'#6d685d',f:'#8a6236'},
 {k:'mast',n:'Ship mast',g:'Structures',c:'#7a5636',f:'#d9c9a0',gr:'wood'},

 {k:'metal',n:'Metal floor',g:'Tech',c:'#5c636c'},
 {k:'metalwall',n:'Metal wall',g:'Tech',c:'#2a2f37',b:1},
 {k:'glasswall',n:'Glass wall',g:'Tech',c:'#5f8fa3',b:1},
 {k:'elevator',n:'Elevator doors, shut',g:'Tech',c:'#5c636c',f:'#8d959f',b:1,tog:'elevatoro'},
 {k:'elevatoro',n:'Elevator doors, open',g:'Tech',c:'#5c636c',f:'#3a3f46',tog:'elevator'},
 {k:'gilded',n:'Gilded elevator, sealed',g:'Tech',c:'#5c636c',f:'#d4af37',b:1,tog:'elevatoro'},
 {k:'elight',n:'Red emergency light',g:'Tech',c:'#2a2f37',f:'#ff3a2a',b:1,glow:3},
 {k:'plight',n:'Pale light panel',g:'Tech',c:'#2a2f37',f:'#cfe8ff',b:1,glow:4},
 {k:'camera',n:'Security camera',g:'Tech',c:'#2a2f37',f:'#ff2020',b:1},
 {k:'screen',n:'Wall screen',g:'Tech',c:'#2a2f37',f:'#cfe8ff',b:1,glow:2},
 {k:'desk',n:'Desk or workbench',g:'Tech',c:'#5c636c',f:'#7a5e44'},
 {k:'terminal',n:'Computer terminal',g:'Tech',c:'#5c636c',f:'#46d483',glow:1},
 {k:'seats',n:'Seats and benches',g:'Tech',c:'#5c636c',f:'#4a6a9a'},
 {k:'cryopod',n:'Cryopod',g:'Tech',c:'#5c636c',f:'#7fd0ff',b:1,glow:1},
 {k:'machine',n:'Machinery',g:'Tech',c:'#5c636c',f:'#b87333',b:1},
 {k:'lockers',n:'Lockers',g:'Tech',c:'#5c636c',f:'#7a8a96',b:1},
 {k:'booth',n:'Scan booth',g:'Tech',c:'#5c636c',f:'#5aa06a',glow:1},
 {k:'speaker',n:'Loudspeaker',g:'Tech',c:'#5c636c',f:'#2a2a2e',b:1},];
const ID={};
T.forEach((t,i)=>{ID[t.k]=i;const n=parseInt(t.c.slice(1),16),r=n>>16,g=(n>>8)&255,b=n&255;
  t.sh=[];for(let j=0;j<6;j++){const f=.88+j*.05;t.sh.push(`rgb(${Math.min(255,r*f|0)},${Math.min(255,g*f|0)},${Math.min(255,b*f|0)})`);}
  const fl=parseInt((t.f||t.c).slice(1),16);t.rgb=[fl>>16,(fl>>8)&255,fl&255];});
const GROUPS=[['Floors','Floors and ground'],['Walls','Walls and doors'],['Wild','Wild growth'],['Water','Water, ice and fire'],['Living','Living dungeon'],['Structures','Buildings and camps'],['Objects','Objects and features']];
GROUPS.push(['Tech','Labs and machines']);
const BAD=new Set([ID.chasm,ID.deep,ID.lava,ID.maw,ID.pit]);
// In 3D view, 'b' cells stand up as walls and 'o' cells stand up as objects on the ground.
['rock','wall','cavewall','icewall','woodwall','secret','torch','fleshwall','ribs','teethwall','eye','door','memb','battlement','roof','thatch','portcullis','metalwall','glasswall','elevator','gilded','elight','plight','camera','screen'].forEach(k=>T[ID[k]].v='b');
['tree','pillar','statue','stalag','crystal','mushroom','palm','deadtree','boulder','tent','well','grave','fence','crates','mast','cryopod','machine','lockers','speaker'].forEach(k=>T[ID[k]].v='o');
function wallFor(id){const t=T[id];if(t.b)return id;
  if(t.g==='Tech')return ID.metalwall;
  if(t.k==='bone')return ID.ribs;if(t.g==='Living')return ID.fleshwall;
  if(['ice','snow'].includes(t.k))return ID.icewall;if(t.k==='wood')return ID.woodwall;
  if(t.g==='Wild'||['shallow','deep','swamp','lava','crust','obsidian','rubble'].includes(t.k))return ID.cavewall;
  return ID.wall;}

const COLORS=['#4fa3a5','#c9a03d','#6b7fd1','#b5639f','#5fae6b','#a0473a','#7a9a3a','#7b5aa6','#8a6b4a','#d0d3d6','#2f3640','#e07a3a'];

/* ================= minis library ================= */
const HEROES=[['Barbarian','🪓'],['Bard','🪕'],['Cleric','☀️'],['Druid','🌿'],['Fighter','⚔️'],['Monk','👊'],['Paladin','🛡️'],['Ranger','🏹'],
 ['Rogue','🗡️'],['Sorcerer','🔮'],['Warlock','🌒'],['Wizard','🧙'],['Artificer','⚙️'],['Blood hunter','🩸'],['Elf','🧝'],['Dwarf','🧔'],
 ['Familiar','🐈'],['Animal companion','🐺'],['Mount','🐴'],['Ally','🧑'],['Hireling','🎒'],['Summon','✨']];
const CATS={Beasts:'#8a6b4a',Humanoids:'#a0473a',Undead:'#5a5f66',Dragons:'#b5392f',Monstrosities:'#7b5aa6',Aberrations:'#6e3a7e',
 Elementals:'#c9762d',Fiends:'#8c1f2a',Fey:'#5fae6b',Constructs:'#6f7680',Giants:'#8a7a4a',Living:'#9a4b52'};
const CAT_NAMES={Fey:'Fey and plants',Constructs:'Constructs and oozes',Living:'Living dungeon'};
const CREATURES=[
 ['Rat','🐀',1,'Beasts'],['Swarm of rats','🐀',1,'Beasts'],['Bat','🦇',1,'Beasts'],['Swarm of bats','🦇',1,'Beasts'],['Wolf','🐺',1,'Beasts'],['Dire wolf','🐺',2,'Beasts'],
 ['Boar','🐗',1,'Beasts'],['Brown bear','🐻',2,'Beasts'],['Panther','🐆',1,'Beasts'],['Giant spider','🕷️',2,'Beasts'],['Giant snake','🐍',2,'Beasts'],['Crocodile','🐊',2,'Beasts'],
 ['Giant eagle','🦅',2,'Beasts'],['Shark','🦈',2,'Beasts'],['Giant octopus','🐙',2,'Beasts'],['Giant scorpion','🦂',2,'Beasts'],['Giant toad','🐸',2,'Beasts'],['Swarm of insects','🐝',1,'Beasts'],
 ['Horse','🐴',2,'Beasts'],['Mammoth','🦣',3,'Beasts'],['Tyrannosaurus','🦖',3,'Beasts'],['Giant crab','🦀',1,'Beasts'],['Giant beetle','🪲',2,'Beasts'],['Giant centipede','🐛',1,'Beasts'],
 ['Goblin','👺',1,'Humanoids'],['Hobgoblin','👺',1,'Humanoids'],['Orc','👹',1,'Humanoids'],['Kobold','🦎',1,'Humanoids'],['Gnoll','🐕',1,'Humanoids'],['Lizardfolk','🦎',1,'Humanoids'],
 ['Bandit','🥷',1,'Humanoids'],['Guard','💂',1,'Humanoids'],['Knight','🛡️',1,'Humanoids'],['Cultist','🕯️',1,'Humanoids'],['Mage','🧙',1,'Humanoids'],['Assassin','🗡️',1,'Humanoids'],
 ['Merfolk','🧜',1,'Humanoids'],['Noble','🤴',1,'Humanoids'],['Commoner','🧑',1,'Humanoids'],['Pirate','🏴‍☠️',1,'Humanoids'],['Archer','🏹',1,'Humanoids'],
 ['Skeleton','💀',1,'Undead'],['Zombie','🧟',1,'Undead'],['Ghoul','🧟',1,'Undead'],['Ghost','👻',1,'Undead'],['Wraith','👻',1,'Undead'],['Wight','🦴',1,'Undead'],
 ['Vampire','🧛',1,'Undead'],['Mummy','⚰️',1,'Undead'],['Lich','☠️',1,'Undead'],['Banshee','😱',1,'Undead'],['Bone dragon','🦴',3,'Undead'],
 ['Dragon wyrmling','🐉',1,'Dragons'],['Young dragon','🐉',2,'Dragons'],['Adult dragon','🐲',3,'Dragons'],['Ancient dragon','🐲',4,'Dragons'],['Wyvern','🐉',2,'Dragons'],
 ['Dragon turtle','🐢',4,'Dragons'],['Pseudodragon','🦎',1,'Dragons'],
 ['Owlbear','🦉',2,'Monstrosities'],['Basilisk','🦎',1,'Monstrosities'],['Hydra','🐍',3,'Monstrosities'],['Manticore','🦁',2,'Monstrosities'],['Chimera','🦁',2,'Monstrosities'],
 ['Griffon','🦅',2,'Monstrosities'],['Harpy','🪶',1,'Monstrosities'],['Mimic','📦',1,'Monstrosities'],['Bulette','🦈',2,'Monstrosities'],['Purple worm','🪱',4,'Monstrosities'],
 ['Roc','🦅',4,'Monstrosities'],['Minotaur','🐂',2,'Monstrosities'],['Medusa','🐍',1,'Monstrosities'],['Kraken','🦑',6,'Monstrosities'],['Sea serpent','🐍',4,'Monstrosities'],['Ankheg','🐜',2,'Monstrosities'],['Displacer beast','🐈‍⬛',2,'Monstrosities'],
 ['Beholder','👁️',2,'Aberrations'],['Mind flayer','🦑',1,'Aberrations'],['Aboleth','🐟',2,'Aberrations'],['Gibbering mouther','👄',1,'Aberrations'],['Otyugh','🦷',2,'Aberrations'],
 ['Grell','🪼',1,'Aberrations'],['Chuul','🦞',2,'Aberrations'],['Star spawn','🌌',1,'Aberrations'],
 ['Fire elemental','🔥',2,'Elementals'],['Water elemental','💧',2,'Elementals'],['Earth elemental','🪨',2,'Elementals'],['Air elemental','🌪️',2,'Elementals'],
 ['Magma mephit','🌋',1,'Elementals'],['Ice mephit','❄️',1,'Elementals'],["Will-o'-wisp",'✨',1,'Elementals'],['Storm spirit','⚡',2,'Elementals'],
 ['Imp','😈',1,'Fiends'],['Demon','👿',2,'Fiends'],['Balor','👿',3,'Fiends'],['Hell hound','🐕',1,'Fiends'],['Rakshasa','🐯',1,'Fiends'],['Night hag','🧙‍♀️',1,'Fiends'],
 ['Pixie','🧚',1,'Fey'],['Dryad','🧝',1,'Fey'],['Green hag','🧙‍♀️',1,'Fey'],['Satyr','🐐',1,'Fey'],['Treant','🌳',3,'Fey'],['Shambling mound','🌿',2,'Fey'],
 ['Myconid','🍄',1,'Fey'],['Twig blight','🥀',1,'Fey'],['Vine blight','🌱',1,'Fey'],['Unicorn','🦄',2,'Fey'],
 ['Animated armor','🛡️',1,'Constructs'],['Flesh golem','🧟',2,'Constructs'],['Stone golem','🗿',2,'Constructs'],['Iron golem','🤖',2,'Constructs'],['Gargoyle','🗿',1,'Constructs'],
 ['Gelatinous cube','🧊',2,'Constructs'],['Black pudding','🫧',2,'Constructs'],['Gray ooze','🫧',1,'Constructs'],['Ochre jelly','🟡',2,'Constructs'],
 ['Ogre','👹',2,'Giants'],['Troll','🧌',2,'Giants'],['Ettin','👥',2,'Giants'],['Hill giant','🗻',3,'Giants'],['Frost giant','🥶',3,'Giants'],['Fire giant','🔥',3,'Giants'],
 ['Cyclops','👁️',3,'Giants'],['Storm giant','⚡',4,'Giants'],
 ['Gut worm','🪱',2,'Living'],['Acid swarm','🦠',1,'Living'],['Bone knight','💀',1,'Living'],['Dungeon eye','👁️',1,'Living'],['Grasping tendril','🐙',1,'Living'],
 ['White cell','🫧',1,'Living'],['Stomach mimic','👄',2,'Living'],['Heart guardian','❤️‍🔥',3,'Living'],['Bile ooze','🫧',2,'Living'],['Parasite','🐛',1,'Living'],
 ['Glowcap druid','🍄',1,'Living'],['Lake leviathan','🐋',3,'Living'],['Jungle stalker','🐆',2,'Living'],['Dungeon heart','💗',4,'Living'],['Spore cloud','🌫️',2,'Living'],
];
const PRESET_FX={'Kraken':{anim:'tentacles',submerged:true},'Sea serpent':{submerged:true},'Giant octopus':{anim:'tentacles',submerged:true},'Shark':{submerged:true},
 'Aboleth':{anim:'tentacles',submerged:true},'Lake leviathan':{anim:'tentacles',submerged:true},'Grasping tendril':{anim:'tentacles'},'Fire elemental':{anim:'flames'},
 'Heart guardian':{anim:'flames'},'Balor':{anim:'flames'},'Imp':{anim:'flames'},'Magma mephit':{anim:'flames'},'Ghost':{anim:'hover'},'Banshee':{anim:'hover'},'Beholder':{anim:'hover'},
 'Air elemental':{anim:'hover'},'Wraith':{anim:'shadow'},'Lich':{anim:'shadow'},'Demon':{anim:'shadow'},'Vampire':{anim:'shadow'},"Will-o'-wisp":{anim:'aura'},'Dungeon heart':{anim:'aura'},
 'Water elemental':{anim:'aura'},'Spore cloud':{anim:'aura'},'Star spawn':{anim:'aura'}};
const CONDS=[['Prone','🛌'],['Poisoned','🤢'],['Stunned','💫'],['Frightened','😱'],['Charmed','💘'],['Blinded','🙈'],['Deafened','🙉'],['Restrained','⛓️'],
 ['Grappled','🤼'],['Paralyzed','🧊'],['Unconscious','💤'],['Invisible','🫥'],['Concentrating','🎯'],['Raging','💢'],['Blessed','✨'],['Burning','🔥'],['Flying','🪽']];
const CONDMAP=Object.fromEntries(CONDS);
const ICONS=[...new Set([...HEROES.map(h=>h[1]),...CREATURES.map(c=>c[1]),'🧝‍♂️','🧝‍♀️','🧙‍♂️','🧙‍♀️','🧛‍♀️','🧜‍♀️','🧚‍♂️','🧞','🦸','🦹','🤺','🥷','👸','🤴','👑','💍','🗝️','🪤','🕸️','🐲','🐉','🦂','🦗','🕊️','🐦‍⬛','🦊','🦝','🐍','🐊','🦍','🦏','🦬','🐲','☄️','🌙','⭐','💎','🧪','📜','🪓','🔨','⛏️','🪝'])];

/* ================= noise ================= */
function h3(x,y,s){let h=(Math.imul(x,374761393)+Math.imul(y,668265263)+Math.imul(s,1442695041))|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return(h>>>0)/4294967296;}
const hash=(x,y)=>h3(x,y,0);
function vnoise(x,y,s){const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,ux=fx*fx*(3-2*fx),uy=fy*fy*(3-2*fy);
  const a=h3(ix,iy,s),b=h3(ix+1,iy,s),c=h3(ix,iy+1,s),d=h3(ix+1,iy+1,s);return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy;}
function fbm(x,y,s){return vnoise(x,y,s)*.65+vnoise(x*2.13+5.1,y*2.13+1.7,s+17)*.35;}

/* ================= ecosystems ================= */
const BIOMES={
 jungle:{n:'Jungle',wall:'tree',f(x,y,u,v,s){const a=fbm(x*.09,y*.09,s),b=fbm(x*.27,y*.27,s+5);
   if(a<.3)return'deep';if(a<.35)return'shallow';if(a<.38)return'sand';if(b>.62)return'tree';if(b>.55)return'brush';if(b<.33)return'dirt';return'grass';}},
 swamp:{n:'Swamp',wall:'tree',f(x,y,u,v,s){const a=fbm(x*.1,y*.1,s),b=fbm(x*.3,y*.3,s+5);
   if(a<.36)return'swamp';if(a<.41)return'mud';if(b>.66)return'tree';if(b>.58)return'brush';if(b<.3)return'roots';return a>.6?'grass':'mud';}},
 fungal:{n:'Fungal forest',wall:'cavewall',f(x,y,u,v,s){const a=fbm(x*.1,y*.1,s),b=fbm(x*.3,y*.3,s+5);
   if(a<.32)return'shallow';if(b>.68)return'mushroom';if(b>.62)return'fungus';if(b>.57)return'roots';if(b<.32)return'rubble';if(a>.66)return'grass';return'dirt';}},
 flesh:{n:'Flesh cavern',wall:'fleshwall',f(x,y,u,v,s){const a=fbm(x*.1,y*.1,s),b=fbm(x*.25,y*.25,s+5);
   if(a<.31)return'acid';if(b>.66)return'veins';if(b<.3)return'bone';return'flesh';}},
 gut:{n:'Writhing gut',wall:'fleshwall',f(x,y,u,v,s){const a=fbm(x*.1,y*.1,s),b=fbm(x*.28,y*.28,s+5);
   if(a<.3)return'blood';if(a>.72)return'acid';if(b>.68)return'tentacle';if(b<.28)return'veins';return'flesh';}},
 bones:{n:'Bone yard',wall:'ribs',f(x,y,u,v,s){const a=fbm(x*.12,y*.12,s),b=fbm(x*.3,y*.3,s+5);
   if(a<.27)return'chasm';if(b>.72)return'ribs';if(b<.32)return'flesh';if(a>.72)return'rubble';return'bone';}},
 lake:{n:'Underground lake',wall:'cavewall',f(x,y,u,v,s){const d=Math.sqrt(u*u+v*v)+(fbm(x*.2,y*.2,s)-.5)*.5,isl=fbm(x*.15,y*.15,s+9);
   if(d<.55&&isl>.68)return isl>.74?'grass':'sand';if(d<.55)return'deep';if(d<.72)return'shallow';if(d<.86)return'sand';return'rubble';}},
 lava:{n:'Lava field',wall:'cavewall',f(x,y,u,v,s){const a=fbm(x*.08,y*.08,s),b=fbm(x*.3,y*.3,s+5);
   if(Math.abs(a-.5)<.035)return'lava';if(Math.abs(a-.5)<.06)return'crust';if(b>.76)return'crystal';if(a>.72)return'lava';if(b<.3)return'obsidian';return'floor';}},
 crystal:{n:'Crystal cave',wall:'cavewall',f(x,y,u,v,s){const a=fbm(x*.1,y*.1,s),b=fbm(x*.3,y*.3,s+5);
   if(a<.3)return'shallow';if(b>.7)return'crystal';if(b<.3)return'obsidian';if(a>.7)return'stalag';return'floor';}},
 frozen:{n:'Frozen hollow',wall:'icewall',f(x,y,u,v,s){const a=fbm(x*.1,y*.1,s),b=fbm(x*.3,y*.3,s+5);
   if(a<.3)return'deep';if(a<.35)return'shallow';if(b>.74)return'crystal';if(b<.3)return'snow';return'ice';}},
 tundra:{n:'Snowy forest',wall:'icewall',f(x,y,u,v,s){const a=fbm(x*.1,y*.1,s),b=fbm(x*.3,y*.3,s+5);
   if(a<.3)return'ice';if(b>.66)return'tree';if(b<.28)return'rubble';return'snow';}},
};

/* ================= state ================= */
let D=null,L=null;
const prefs={view3d:true,wallH:.35,mini3d:true,fx:true,miniStyle:'model'};
let view={x:0,y:0,cs:28},mode='dm',tool='move',curT=ID.floor,brush=1,brushShape='circle',density=.3,winding=false,shapeMode='room',biome='grassland',paintLift=null,hMode='raise',buildMode='rtower';
let selId=null,selLabel=null,measure=null;
let partyVis=null,litMap=null,visDirty=true,selVis=null,selVisFor=null,ovStamp=0;
const undoStacks=new Map();
const stage=document.getElementById('stage'),cv=document.getElementById('map');
let ctx=cv.getContext('2d'),dpr=1;

function newLevel(name,c,r){return{id:D.nextId++,name,cols:c,rows:r,cells:new Uint8Array(c*r),elev:new Uint8Array(c*r),explored:new Uint8Array(c*r),tokens:[],labels:[],lit:false,grid:true,scale:5,weather:'none',mood:'auto',gridStyle:'line'};}
const idx=(x,y)=>y*L.cols+x;
const inb=(x,y)=>x>=0&&y>=0&&x<L.cols&&y<L.rows;
const get=(x,y)=>inb(x,y)?L.cells[y*L.cols+x]:0;
function put(x,y,v){if(inb(x,y))L.cells[y*L.cols+x]=v;}
function isWall(x,y){const t=T[get(x,y)];return !!t.b&&!t.tog;}
function wrapAround(x,y,w){for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(inb(nx,ny)&&L.cells[ny*L.cols+nx]===0)L.cells[ny*L.cols+nx]=w;}}
const SZ=(t,lv)=>{lv=lv||L;return lv.scale>5?Math.max(1,Math.round(t.size*5/lv.scale)):t.size;};
function normTok(t){return Object.assign({anim:'none',submerged:false,icon:'',img:'',hp:0,hpMax:0,conds:[],hidden:false,vision:60,size:1,color:COLORS[0]},t);}

/* ================= shape builders ================= */
function order(a){return{ax:Math.min(a.x0,a.x1),ay:Math.min(a.y0,a.y1),bx:Math.max(a.x0,a.x1),by:Math.max(a.y0,a.y1)};}
function blob(ax,ay,bx,by,seed){
  const w=bx-ax+1,h=by-ay+1,cx=(ax+bx+1)/2,cy=(ay+by+1)/2,rx=w/2,ry=h/2;
  let m=new Uint8Array(w*h);
  if(w<4||h<4){m.fill(1);}
  else{
    const fq=Math.max(.04,Math.min(.16,6/Math.max(w,h)+.03));
    for(let j=0;j<h;j++)for(let i=0;i<w;i++){const x=ax+i,y=ay+j,u=(x+.5-cx)/rx,v=(y+.5-cy)/ry;
      if(u*u+v*v<.6+.6*vnoise(x*fq,y*fq,seed))m[j*w+i]=1;}
    const m2=new Uint8Array(w*h);
    for(let j=0;j<h;j++)for(let i=0;i<w;i++){let c=0;for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++){const ii=i+a,jj=j+b;if(ii>=0&&jj>=0&&ii<w&&jj<h)c+=m[jj*w+ii];}m2[j*w+i]=c>=5?1:0;}
    m=m2;
  }
  return{m,w,h,ax,ay,cx,cy,rx,ry};
}
function fillCells(list,id){const walk=!T[id].b,w=wallFor(id);for(let k=0;k<list.length;k+=2)put(list[k],list[k+1],id);
  if(walk)for(let k=0;k<list.length;k+=2)wrapAround(list[k],list[k+1],w);}
function roomRect(ax,ay,bx,by,id){
  const walk=!T[id].b,wall=wallFor(id);
  for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++){
    const border=x===ax||x===bx||y===ay||y===by;
    if(!walk){if(border)put(x,y,id);continue;}
    if(border){const c=get(x,y);if(T[c].b&&!T[c].tog)put(x,y,wall);}else put(x,y,id);
  }
}
function boxCells(ax,ay,bx,by){const l=[];for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++)l.push(x,y);return l;}
function ovalCells(ax,ay,bx,by){const l=[],cx=(ax+bx+1)/2,cy=(ay+by+1)/2,rx=(bx-ax+1)/2,ry=(by-ay+1)/2;
  for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++){const u=(x+.5-cx)/rx,v=(y+.5-cy)/ry;if(u*u+v*v<=1.02)l.push(x,y);}return l;}
function caveCells(ax,ay,bx,by,seed){const m=blob(ax,ay,bx,by,seed),l=[];
  for(let j=0;j<m.h;j++)for(let i=0;i<m.w;i++)if(m.m[j*m.w+i])l.push(m.ax+i,m.ay+j);return l;}
function applyBiome(key,ax,ay,bx,by,seed){
  const B=BIOMES[key],m=blob(ax,ay,bx,by,seed),wallId=ID[B.wall],cells=[];
  for(let j=0;j<m.h;j++)for(let i=0;i<m.w;i++){if(!m.m[j*m.w+i])continue;const x=m.ax+i,y=m.ay+j;if(!inb(x,y))continue;
    put(x,y,ID[B.f(x,y,(x+.5-m.cx)/m.rx,(y+.5-m.cy)/m.ry,seed)]);L.elev[y*L.cols+x]=0;cells.push(x,y);}
  for(let k=0;k<cells.length;k+=2){const x=cells[k],y=cells[k+1];if(!T[get(x,y)].b)wrapAround(x,y,wallId);}
  if(B.wall==='fleshwall'){
    for(let k=0;k<cells.length;k+=2)for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const x=cells[k]+dx,y=cells[k+1]+dy;
      if(get(x,y)===ID.fleshwall&&!T[get(cells[k],cells[k+1])].b&&h3(x,y,seed)<.05)put(x,y,ID.eye);}
  }
}
function carvePath(x1,y1,x2,y2,key,wd){
  const id=ID[key],w=wallFor(id),pts=[];let x=x1,y=y1;
  while(x!==x2){pts.push([x,y]);x+=Math.sign(x2-x);}while(y!==y2){pts.push([x,y]);y+=Math.sign(y2-y);}pts.push([x2,y2]);
  const r=Math.floor((wd||1)/2),placed=[];
  for(const[px,py]of pts)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const c=get(px+dx,py+dy);if(inb(px+dx,py+dy)&&T[c].b&&!T[c].tog){put(px+dx,py+dy,id);}placed.push(px+dx,py+dy);}
  for(let k=0;k<placed.length;k+=2)wrapAround(placed[k],placed[k+1],w);
}
function floodFill(sx,sy,id){
  const target=get(sx,sy);if(target===id)return 0;let n=0;
  const st=[sx,sy];
  while(st.length){const y=st.pop(),x=st.pop();if(!inb(x,y)||L.cells[idx(x,y)]!==target)continue;L.cells[idx(x,y)]=id;n++;st.push(x+1,y,x-1,y,x,y+1,x,y-1);}
  return n;
}

/* ================= example ================= */
function mk(kind,name,x,y,extra){return normTok(Object.assign({id:D.nextId++,kind,name,x,y,size:1,vision:60,color:kind==='hero'?COLORS[0]:COLORS[5]},extra||{}));}
function placeTok(t,floorKey){for(let y=t.y;y<t.y+t.size;y++)for(let x=t.x;x<t.x+t.size;x++)if(T[get(x,y)].b)put(x,y,ID[floorKey]);L.tokens.push(t);}
function lab(x,y,text,show){L.labels.push({id:D.nextId++,x,y,text,show:show!==false});}
function buildExample(){
  D={nextId:1,cur:0,levels:[]};
  L=newLevel('The Maw',64,40);D.levels.push(L);
  applyBiome('flesh',4,4,32,36,101);
  applyBiome('bones',36,6,61,32,202);
  carvePath(0,20,18,20,'flesh',1);
  carvePath(18,20,48,20,'flesh',1);
  for(let y=19;y<=21;y++)for(let x=0;x<=1;x++){put(x,y,ID.maw);wrapAround(x,y,ID.fleshwall);}
  put(34,20,ID.memb);
  carvePath(48,20,48,36,'flesh',1);
  for(let y=35;y<=38;y++)for(let x=47;x<=49;x++){put(x,y,ID.chasm);wrapAround(x,y,ID.fleshwall);}
  placeTok(mk('hero','Aria',5,20,{vision:60,color:'#4fa3a5',icon:'🏹',hp:24,hpMax:31}),'flesh');
  placeTok(mk('hero','Bram',3,20,{vision:40,color:'#c9a03d',icon:'⚔️',hp:38,hpMax:38}),'flesh');
  placeTok(mk('creature','Gullet worm',16,17,{size:2,color:CATS.Living,icon:'🪱',hp:68,hpMax:68}),'flesh');
  placeTok(mk('creature','Acid swarm',12,27,{color:'#7a9a3a',icon:'🦠',hp:22,hpMax:22}),'flesh');
  placeTok(mk('creature','Bone knight 1',46,14,{color:'#d0d3d6',icon:'💀',hp:30,hpMax:30}),'bone');
  placeTok(mk('creature','Bone knight 2',51,23,{color:'#d0d3d6',icon:'💀',hp:30,hpMax:30}),'bone');
  lab(2.5,17.6,'The Maw');lab(18,6.5,'The Gullet');lab(49,7.5,'Ossuary of the Swallowed');
  lab(48,33.5,'Throat to the Stomach Jungle',false);
  const maw=L;

  maw.weather='heartbeat';
  L=newLevel('Stomach Jungle',96,72);D.levels.push(L);L.lit=true;L.weather='spores';
  applyBiome('jungle',2,2,93,69,303);
  applyBiome('lake',34,22,62,48,404);
  applyBiome('fungal',62,46,92,69,505);
  applyBiome('gut',4,46,32,68,606);
  placeTok(mk('creature','Lake leviathan',46,33,{size:3,color:'#3f6f8f',icon:'🐋',hp:180,hpMax:180,anim:'tentacles',submerged:true}),'deep');
  placeTok(mk('creature','Glowcap druid',76,56,{color:'#7b5aa6',icon:'🍄',hp:27,hpMax:27}),'dirt');
  placeTok(mk('creature','Bile ooze',17,56,{size:2,color:'#7a9a3a',icon:'🫧',hp:45,hpMax:45}),'flesh');
  placeTok(mk('creature','Jungle stalker 1',25,22,{size:2,color:'#8a6b4a',icon:'🐆',hp:52,hpMax:52}),'grass');
  placeTok(mk('creature','Jungle stalker 2',70,20,{size:2,color:'#8a6b4a',icon:'🐆',hp:52,hpMax:52,hidden:true}),'grass');
  lab(26,12,'Stomach Jungle');lab(48,26.5,'Bile Lake');lab(77,49.5,'Glowcap Hollow');lab(18,49,'The Writhing Gut');
  const jungle=L;

  L=newLevel('The Hollow Wyrm, whole body',320,180);L.scale=100;L.weather='fog';D.levels.unshift(L);
  applyBiome('flesh',6,60,92,124,701);
  applyBiome('bones',84,36,176,146,702);
  applyBiome('jungle',168,26,288,156,703);
  applyBiome('gut',278,66,316,114,704);
  carvePath(78,92,104,92,'flesh',5);carvePath(160,92,186,92,'flesh',5);carvePath(268,90,292,90,'flesh',5);
  L.labels.push({id:D.nextId++,x:40,y:92,text:'The Maw',show:true,link:maw.id});
  L.labels.push({id:D.nextId++,x:130,y:92,text:'Ribcage Ossuary',show:true});
  L.labels.push({id:D.nextId++,x:228,y:91,text:'Stomach Jungle',show:true,link:jungle.id});
  L.labels.push({id:D.nextId++,x:297,y:76,text:'The Tail',show:true});
  L.labels.push({id:D.nextId++,x:160,y:20,text:'About 6 miles nose to tail',show:false});

  D.cur=1;L=D.levels[1];
}

/* ================= generators ================= */
const MAXE=15,EUF=.6;
function rng(seed){let a=(seed>>>0)||1;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const Eat=(x,y)=>inb(x,y)?L.elev[y*L.cols+x]:0;
function setE(x,y,v){if(inb(x,y))L.elev[y*L.cols+x]=Math.max(0,Math.min(MAXE,Math.round(v)));}
function setC(x,y,k,e){if(!inb(x,y))return;L.cells[y*L.cols+x]=typeof k==='string'?ID[k]:k;if(e!=null)setE(x,y,e);}
const getK=(x,y)=>T[get(x,y)].k;
function fillR(ax,ay,bx,by,k,e){for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++)setC(x,y,k,e);}
function ringR(ax,ay,bx,by,k,e){for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++)if(x===ax||x===bx||y===ay||y===by)setC(x,y,k,e);}
function discCells(cx,cy,r){const l=[];for(let y=Math.floor(cy-r-1);y<=Math.ceil(cy+r+1);y++)for(let x=Math.floor(cx-r-1);x<=Math.ceil(cx+r+1);x++){const d=Math.hypot(x+.5-cx,y+.5-cy);if(d<=r)l.push([x,y,d]);}return l;}
function towerAt(cx,cy,r,e,dir){
  for(const[x,y,d]of discCells(cx,cy,r)){if(d>r-1)setC(x,y,'battlement',e);else setC(x,y,'tile',0);}
  if(dir)for(let k=0;k<r+2;k++){const x=Math.floor(cx+dir[0]*k),y=Math.floor(cy+dir[1]*k);if(getK(x,y)==='battlement'){setC(x,y,'door',0);break;}}
}
const hills=(x,y,s,amp)=>Math.max(0,Math.round((fbm(x*.035,y*.035,s+3)-.42)*amp));
const OPEN=new Set(['grass','flowers','brush','dirt']);
function meander(ax,ay,bx,by,s,vertical,width,cb){
  const len=vertical?by-ay:bx-ax,span=vertical?bx-ax:by-ay,mid=(vertical?ax+bx:ay+by)/2;
  const lo=-Math.floor((width-1)/2),hi=lo+width-1;let prev=null;
  for(let t=0;t<=len;t++){
    const o=(fbm(t*.03,1.7,s)-.5)*span*.8,x=vertical?Math.round(mid+o):ax+t,y=vertical?ay+t:Math.round(mid+o);
    const seg=[];if(prev){const m=Math.max(Math.abs(x-prev[0]),Math.abs(y-prev[1]));for(let k=1;k<=m;k++)seg.push([Math.round(prev[0]+(x-prev[0])*k/m),Math.round(prev[1]+(y-prev[1])*k/m)]);}else seg.push([x,y]);
    for(const[px,py]of seg)for(let d=lo;d<=hi;d++){const X=vertical?px+d:px,Y=vertical?py:py+d;if(X>=ax&&X<=bx&&Y>=ay&&Y<=by&&inb(X,Y))cb(X,Y);}
    prev=[x,y];
  }
}
function genGrassland(ax,ay,bx,by,s){
  for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++){const b=fbm(x*.2,y*.2,s+5),c=h3(x,y,s),a=fbm(x*.07,y*.07,s+11);let k='grass';
    if(b>.64)k='flowers';else if(b<.3)k='brush';
    if(a>.68&&c<.45)k='tree';else if(c<.012)k='tree';else if(c>.993)k='boulder';
    setC(x,y,k,hills(x,y,s,7));}
  const w=bx-ax,h=by-ay,horiz=w>=h;
  if(Math.min(w,h)>=10){
    meander(ax,ay,bx,by,s+21,!horiz,2,(x,y)=>setC(x,y,'shallow',Math.max(0,Eat(x,y)-1)));
    meander(ax,ay,bx,by,s+37,horiz,1,(x,y)=>{const k=getK(x,y);setC(x,y,k==='shallow'||k==='deep'?'bridge':'road',null);});
  }
}
function genForest(ax,ay,bx,by,s){
  for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++){const a=fbm(x*.06,y*.06,s+11),b=fbm(x*.25,y*.25,s+5),c=h3(x,y,s);let k;
    if(a<.36){k=b>.6?'flowers':'grass';if(c<.04)k='tree';}
    else{k=c<.55?'tree':b>.55?'brush':b<.35?'roots':'grass';if(c>.985)k='deadtree';else if(c>.975)k='mushroom';else if(c>.968)k='boulder';}
    setC(x,y,k,hills(x,y,s,6));}
  const w=bx-ax,h=by-ay;if(Math.min(w,h)>=10)meander(ax,ay,bx,by,s+21,h>w,1,(x,y)=>setC(x,y,'shallow',Math.max(0,Eat(x,y)-1)));
}
function genDesert(ax,ay,bx,by,s){
  for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++){const d=fbm(x*.045,y*.09,s),r=fbm(x*.04,y*.04,s+7),c=h3(x,y,s);
    let e=Math.max(0,Math.round((d-.38)*9)),k=e>=2?'dunes':'sand';
    if(r>.7){e=5+Math.round((r-.7)*14);k=c<.3?'rubble':'floor';}
    else if(r>.665)k=c<.25?'boulder':'rubble';
    else if(c<.004)k='deadtree';else if(c>.997)k='bone';else if(c>.993)k='boulder';
    setC(x,y,k,e);}
}
function genOasis(ax,ay,bx,by,s){
  genDesert(ax,ay,bx,by,s);
  const cx=(ax+bx+1)/2,cy=(ay+by+1)/2,rx=(bx-ax+1)/2,ry=(by-ay+1)/2;
  for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++){const u=(x+.5-cx)/rx,v=(y+.5-cy)/ry,d=u*u+v*v+(fbm(x*.15,y*.15,s+3)-.5)*.25,c=h3(x+7,y,s);
    if(d<.1)setC(x,y,'deep',0);else if(d<.18)setC(x,y,'shallow',0);
    else if(d<.34)setC(x,y,c<.16?'palm':c<.4?'flowers':'grass',0);
    else if(d<.48)setC(x,y,c<.05?'palm':'sand',0);}
}
function genMountains(ax,ay,bx,by,s){
  for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++){const m=fbm(x*.03,y*.03,s)*.7+fbm(x*.09,y*.09,s+4)*.3,c=h3(x,y,s);
    const e=Math.max(0,Math.min(MAXE-1,Math.round((m-.3)*16)*2));
    let k=e>=11?'snow':e>=7?(c<.2?'rubble':'floor'):e>=3?(c<.14?'tree':c<.2?'boulder':c<.4?'brush':'grass'):(c<.05?'tree':'grass');
    if(e>=7&&e<11&&c>.985)k='boulder';
    setC(x,y,k,e);}
}
function genSea(ax,ay,bx,by,s){
  for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++){const d=fbm(x*.05,y*.05,s),c=h3(x,y,s);let k='deep',e=0;
    if(d>.64)k='shallow';if(d>.7)k='sand';if(d>.74){k=c<.12?'palm':c<.17?'boulder':'grass';e=1;}if(d>.79){e=2;k=c<.3?'tree':'grass';}
    setC(x,y,k,e);}
}
function fullBiome(key){return(ax,ay,bx,by,s)=>{const B=BIOMES[key],cx=(ax+bx+1)/2,cy=(ay+by+1)/2,rx=(bx-ax+1)/2,ry=(by-ay+1)/2;
  for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++){const k=B.f(x,y,(x+.5-cx)/rx,(y+.5-cy)/ry,s);setC(x,y,k,['deep','shallow','swamp','ice'].includes(k)?0:hills(x,y,s,4));}};}
function genCaves(ax,ay,bx,by,s){
  const R=rng(s),w=bx-ax+1,h=by-ay+1;
  if(w<8||h<8){fillCells(caveCells(ax,ay,bx,by,s),ID.floor);return;}
  let m=new Uint8Array(w*h);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++)m[j*w+i]=(i===0||j===0||i===w-1||j===h-1||R()<.47)?1:0;
  for(let it=0;it<5;it++){const m2=new Uint8Array(w*h);
    for(let j=0;j<h;j++)for(let i=0;i<w;i++){if(i===0||j===0||i===w-1||j===h-1){m2[j*w+i]=1;continue;}let c=0;
      for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++)c+=m[(j+b)*w+i+a];m2[j*w+i]=(c>=5||(it<2&&c<=1))?1:0;}
    m=m2;}
  const lab=new Int32Array(w*h).fill(-1);let best=-1,bestN=0,id=0;
  for(let k=0;k<w*h;k++){if(m[k]||lab[k]>=0)continue;let n=0;const st=[k];lab[k]=id;
    while(st.length){const q=st.pop();n++;const i=q%w,j=(q/w)|0;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const ii=i+a,jj=j+b;if(ii<0||jj<0||ii>=w||jj>=h)continue;const z=jj*w+ii;if(!m[z]&&lab[z]<0){lab[z]=id;st.push(z);}}}
    if(n>bestN){bestN=n;best=id;}id++;}
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const k=j*w+i,x=ax+i,y=ay+j;
    if(!m[k]&&lab[k]===best){const a=fbm(x*.1,y*.1,s),c=h3(x,y,s);let key=a<.3?'shallow':c<.04?'stalag':c<.07?'rubble':a>.66?'dirt':'floor';if(c>.995)key='fungus';setC(x,y,key,0);}}
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const k=j*w+i;if(!m[k]&&lab[k]===best)continue;const x=ax+i,y=ay+j;let adj=false;
    for(let b=-1;b<=1&&!adj;b++)for(let a=-1;a<=1;a++){const ii=i+a,jj=j+b;if(ii>=0&&jj>=0&&ii<w&&jj<h&&!m[jj*w+ii]&&lab[jj*w+ii]===best){adj=true;break;}}
    setC(x,y,adj?'cavewall':'rock',0);}
}
function genDungeon(ax,ay,bx,by,s){
  const R=rng(s),ri=(a,b)=>b<a?a:a+Math.floor(R()*(b-a+1)),rooms=[];
  fillR(ax,ay,bx,by,'rock',0);
  const styles=['floor','floor','floor','floor','tile','cobble','wood','carpet'];
  const room=(x0,y0,x1,y1)=>{const w=x1-x0+1,h=y1-y0+1,rw=Math.min(w,Math.max(5,ri(Math.floor(w*.55),w-1))),rh=Math.min(h,Math.max(5,ri(Math.floor(h*.55),h-1)));
    const rx=x0+ri(0,Math.max(0,w-rw)),ry=y0+ri(0,Math.max(0,h-rh)),r={x0:rx,y0:ry,x1:Math.min(x1,rx+rw-1),y1:Math.min(y1,ry+rh-1)};
    ringR(r.x0,r.y0,r.x1,r.y1,'wall',0);fillR(r.x0+1,r.y0+1,r.x1-1,r.y1-1,styles[Math.floor(R()*styles.length)],0);rooms.push(r);return[r];};
  const isWallK=k=>k==='wall';
  const carve=(x,y,horiz)=>{const k=getK(x,y);
    if(isWallK(k)){const side=horiz?isWallK(getK(x,y-1))&&isWallK(getK(x,y+1)):isWallK(getK(x-1,y))&&isWallK(getK(x+1,y));
      setC(x,y,side?(R()<.07?'secret':R()<.35?'dooro':'door'):'floor',0);}
    else if(k==='rock')setC(x,y,'floor',0);};
  const connect=(a,b)=>{const ax_=Math.floor((a.x0+a.x1)/2),ay_=Math.floor((a.y0+a.y1)/2),bx_=Math.floor((b.x0+b.x1)/2),by_=Math.floor((b.y0+b.y1)/2);
    if(R()<.5){for(let x=ax_;x!==bx_;x+=Math.sign(bx_-ax_))carve(x,ay_,true);for(let y=ay_;y!==by_;y+=Math.sign(by_-ay_))carve(bx_,y,false);}
    else{for(let y=ay_;y!==by_;y+=Math.sign(by_-ay_))carve(ax_,y,false);for(let x=ax_;x!==bx_;x+=Math.sign(bx_-ax_))carve(x,by_,true);}};
  const pick=l=>l[Math.floor(R()*l.length)];
  const split=(x0,y0,x1,y1,d)=>{const w=x1-x0+1,h=y1-y0+1;
    let vert=w>h?true:h>w?false:R()<.5;if(vert&&w<16)vert=false;if(!vert&&h<16)vert=true;
    if(d>7||(vert&&w<16)||(!vert&&h<16))return room(x0,y0,x1,y1);
    if(vert){const c=ri(x0+Math.floor(w*.4),x0+Math.floor(w*.6));const A=split(x0,y0,c,y1,d+1),B=split(c+1,y0,x1,y1,d+1);connect(pick(A),pick(B));return A.concat(B);}
    const c=ri(y0+Math.floor(h*.4),y0+Math.floor(h*.6));const A=split(x0,y0,x1,c,d+1),B=split(x0,c+1,x1,y1,d+1);connect(pick(A),pick(B));return A.concat(B);};
  split(ax,ay,bx,by,0);
  for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++)if(!T[get(x,y)].b)wrapAround(x,y,ID.wall);
  rooms.forEach(r=>{const iw=r.x1-r.x0-1,ih=r.y1-r.y0-1,cx=Math.floor((r.x0+r.x1)/2),inner=()=>[ri(r.x0+1,r.x1-1),ri(r.y0+1,r.y1-1)];
    if(iw>=7&&ih>=7&&R()<.45)for(let y=r.y0+2;y<=r.y1-2;y+=3)for(let x=r.x0+2;x<=r.x1-2;x+=3)if(x===r.x0+2||x>r.x1-5||y===r.y0+2||y>r.y1-5)setC(x,y,'pillar',0);
    if(R()<.3)setC(ri(r.x0+1,r.x1-1),r.y0+1,'chest',0);
    if(R()<.12&&ih>=4){setC(cx,r.y0+1,'altar',0);setC(cx,r.y0+3,'circle',0);}
    if(R()<.15){const[x,y]=inner();setC(x,y,'pit',0);}
    if(R()<.25)for(let k=0;k<4;k++){const[x,y]=inner();setC(x,y,'rubble',0);}
    if(R()<.15)for(let k=0;k<3;k++){const[x,y]=inner();setC(x,y,'web',0);}
    for(let k=0;k<2;k++){const x=ri(r.x0+1,r.x1-1);if(getK(x,r.y0)==='wall')setC(x,r.y0,'torch',0);}
  });
  if(rooms.length){const a=rooms[0],b=rooms[rooms.length-1];setC(Math.floor((a.x0+a.x1)/2),Math.floor((a.y0+a.y1)/2),'stairsup',0);setC(Math.floor((b.x0+b.x1)/2),Math.floor((b.y0+b.y1)/2),'stairsdn',0);}
}
function genCastle(ax,ay,bx,by,s){
  const R=rng(s),ri=(a,b)=>b<a?a:a+Math.floor(R()*(b-a+1)),w=bx-ax+1,h=by-ay+1;
  for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++)setC(x,y,fbm(x*.2,y*.2,s)>.64?'flowers':'grass',0);
  let x0=ax,y0=ay,x1=bx,y1=by;const moat=w>=34&&h>=34;
  if(moat){for(let k=0;k<2;k++)ringR(x0+k,y0+k,x1-k,y1-k,'deep',0);x0+=3;y0+=3;x1-=3;y1-=3;}else{x0++;y0++;x1--;y1--;}
  const cw=x1-x0+1,ch=y1-y0+1,hx=Math.floor((x0+x1)/2);
  if(cw<12||ch<12){fillR(x0,y0,x1,y1,'tile',0);ringR(x0,y0,x1,y1,'battlement',3);setC(hx,y1,'door',0);return;}
  const th=cw>=40&&ch>=40?2:1;
  for(let y=y0+th;y<=y1-th;y++)for(let x=x0+th;x<=x1-th;x++)setC(x,y,fbm(x*.15,y*.15,s+3)>.62?'dirt':'grass',0);
  for(let k=0;k<th;k++)ringR(x0+k,y0+k,x1-k,y1-k,'battlement',2);
  for(let x=x0+4;x<x1-3;x+=6)setC(x,y0+th-1,'torch',2);
  const tr=Math.max(2,Math.min(5,Math.round(Math.min(cw,ch)/10)));
  [[x0+.5,y0+.5,1,1],[x1+.5,y0+.5,-1,1],[x0+.5,y1+.5,1,-1],[x1+.5,y1+.5,-1,-1]].forEach(([cx,cy,dx,dy])=>towerAt(cx,cy,tr+.5,4,[dx*.7071,dy*.7071]));
  towerAt(hx-3.5,y1+.5,2,4,null);towerAt(hx+4.5,y1+.5,2,4,null);
  for(let k=0;k<th;k++)for(let d=-1;d<=1;d++)setC(hx+d,y1-k,k===0?'portcullis':'cobble',0);
  if(moat)for(let y=y1+1;y<=by;y++)for(let d=-1;d<=1;d++)setC(hx+d,y,'bridge',0);
  const kw=Math.max(9,Math.round(cw*.42)),kh=Math.max(8,Math.round(ch*.38)),kx0=hx-Math.floor(kw/2),kx1=kx0+kw-1,ky0=y0+th+tr+1,ky1=Math.min(ky0+kh-1,y1-th-5);
  fillR(kx0,ky0,kx1,ky1,'tile',0);ringR(kx0,ky0,kx1,ky1,'wall',3);
  const sp=ky0+Math.max(3,Math.floor((ky1-ky0)*.4)),n=kw>=16?3:2;
  for(let x=kx0;x<=kx1;x++)setC(x,sp,'wall',2);
  for(let r=0;r<n;r++){const a=kx0+Math.round(kw*r/n),b=r===n-1?kx1:kx0+Math.round(kw*(r+1)/n);if(r>0)for(let y=ky0;y<=sp;y++)setC(a,y,'wall',2);
    if(b-a>=2&&sp-ky0>=2){fillR(a+1,ky0+1,b-1,sp-1,r%2?'carpet':'wood',0);setC(Math.floor((a+b)/2),sp,'door',0);if(R()<.6)setC(a+1,ky0+1,'chest',0);}}
  for(let y=sp+1;y<ky1;y++)setC(hx,y,'carpet',0);
  setC(hx,sp+1,'altar',0);
  for(let y=sp+2;y<ky1-1;y+=2){setC(kx0+2,y,'pillar',0);setC(kx1-2,y,'pillar',0);}
  for(let x=kx0+2;x<kx1-1;x+=4)if(getK(x,sp)==='wall')setC(x,sp,'torch',2);
  setC(hx,ky1,'door',0);
  [[kx0+.5,ky0+.5],[kx1+.5,ky0+.5],[kx0+.5,ky1+.5],[kx1+.5,ky1+.5]].forEach(([cx,cy])=>{for(const[x,y]of discCells(cx,cy,1.6))setC(x,y,'battlement',5);});
  setC(hx,ky1,'door',0);
  for(let y=ky1+1;y<=y1-th;y++)for(let d=-1;d<=1;d++)setC(hx+d,y,'cobble',0);
  for(const side of[-1,1]){const inX=side<0?x0+th:kx1+2,outX=side<0?kx0-2:x1-th,bwid=Math.min(7,outX-inX+1);if(bwid<4)continue;
    const bx0=side<0?inX:outX-bwid+1,bx1=bx0+bwid-1;
    for(let y=y0+th+tr+2;y+5<=y1-th-2;y+=ri(8,10)){const bh=ri(5,7),by1=Math.min(y+bh-1,y1-th-2);
      if(R()<.5)fillR(bx0,y,bx1,by1,R()<.5?'roof':'thatch',R()<.5?2:3);
      else{ringR(bx0,y,bx1,by1,'woodwall',1);fillR(bx0+1,y+1,bx1-1,by1-1,'wood',0);setC(side<0?bx1:bx0,Math.floor((y+by1)/2),'door',0);setC(side<0?bx0+1:bx1-1,y+1,'crates',0);}}}
  const wx=x0+th+2,wy=y1-th-3;if(OPEN.has(getK(wx,wy)))setC(wx,wy,'well',0);
  setC(hx+3,y1-th-1,'crates',0);setC(hx+4,y1-th-1,'crates',0);setC(hx-3,y1-th-1,'stairsup',0);
  for(let k=0;k<Math.floor(cw*ch/200);k++){const x=ri(x0+th,x1-th),y=ri(y0+th,y1-th);if(OPEN.has(getK(x,y)))setC(x,y,'tree',0);}
}
function genVillage(ax,ay,bx,by,s){
  const R=rng(s),ri=(a,b)=>b<a?a:a+Math.floor(R()*(b-a+1)),w=bx-ax,h=by-ay,horiz=w>=h,roads=[];
  for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++){const b=fbm(x*.2,y*.2,s+5);setC(x,y,b>.66?'flowers':b<.28?'brush':'grass',0);}
  meander(ax,ay,bx,by,s+21,!horiz,2,(x,y)=>{setC(x,y,'road',0);roads.push(y*L.cols+x);});
  if(Math.min(w,h)>=20)meander(ax,ay,bx,by,s+33,horiz,1,(x,y)=>{setC(x,y,'road',0);roads.push(y*L.cols+x);});
  const cx=Math.floor((ax+bx)/2),cy=Math.floor((ay+by)/2);
  for(const[x,y]of discCells(cx+.5,cy+.5,3.5))if(x>=ax&&x<=bx&&y>=ay&&y<=by)setC(x,y,'cobble',0);setC(cx,cy,'well',0);
  const free=(x0,y0,x1,y1)=>{if(x0<ax||y0<ay||x1>bx||y1>by)return false;for(let y=y0-1;y<=y1+1;y++)for(let x=x0-1;x<=x1+1;x++)if(!OPEN.has(getK(x,y)))return false;return true;};
  const target=Math.max(2,Math.floor((w*h)/110));let placed=0;
  for(let tries=0;tries<target*30&&placed<target&&roads.length;tries++){
    const rc=roads[Math.floor(R()*roads.length)],rx=rc%L.cols,ry=Math.floor(rc/L.cols),hw=ri(4,7),hh=ri(4,6),side=Math.floor(R()*4);
    const x0=side<2?rx-Math.floor(hw/2):side===2?rx-hw-1:rx+2,y0=side===0?ry-hh-1:side===1?ry+2:ry-Math.floor(hh/2),x1=x0+hw-1,y1=y0+hh-1;
    if(!free(x0,y0,x1,y1))continue;placed++;
    if(R()<.6)fillR(x0,y0,x1,y1,R()<.55?'roof':'thatch',R()<.5?2:3);
    else{ringR(x0,y0,x1,y1,'woodwall',1);fillR(x0+1,y0+1,x1-1,y1-1,'wood',0);
      setC(side===2?x1:side===3?x0:Math.floor((x0+x1)/2),side===0?y1:side===1?y0:Math.floor((y0+y1)/2),'door',0);setC(x0+1,y0+1,'crates',0);}
  }
  for(let f=0;f<Math.max(1,Math.floor(w*h/500));f++){const fw=ri(6,12),fh=ri(5,9),x0=ri(ax+1,bx-fw-1),y0=ri(ay+1,by-fh-1);if(!free(x0,y0,x0+fw-1,y0+fh-1))continue;
    fillR(x0+1,y0+1,x0+fw-2,y0+fh-2,'wheat',0);ringR(x0,y0,x0+fw-1,y0+fh-1,'fence',0);setC(x0+Math.floor(fw/2),y0+fh-1,'road',0);}
  for(let k=0;k<w*h/55;k++){const x=ri(ax,bx),y=ri(ay,by);if(OPEN.has(getK(x,y)))setC(x,y,R()<.15?'boulder':'tree',0);}
}
function genRuins(ax,ay,bx,by,s){
  const R=rng(s),ri=(a,b)=>b<a?a:a+Math.floor(R()*(b-a+1)),w=bx-ax+1,h=by-ay+1;
  for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++){const b=fbm(x*.2,y*.2,s+5),c=h3(x,y,s);let k=b<.3?'brush':b>.66?'dirt':'grass';if(c<.01)k='tree';setC(x,y,k,hills(x,y,s,3));}
  for(let n=0;n<Math.max(2,Math.floor(w*h/170));n++){const rw=Math.min(w,ri(6,14)),rh=Math.min(h,ri(6,12)),x0=ri(ax,bx-rw+1),y0=ri(ay,by-rh+1),x1=x0+rw-1,y1=y0+rh-1;
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const edge=x===x0||x===x1||y===y0||y===y1;
      if(edge){const r=R();if(r<.28)setC(x,y,'rubble',0);else if(r>.34)setC(x,y,'wall',ri(0,2));}
      else{const c=h3(x,y,s+1);setC(x,y,c<.5?'cobble':c<.7?'floor':c<.88?'grass':c<.95?'roots':'rubble',0);}}
    if(rw>=9&&rh>=9)for(let y=y0+2;y<y1-1;y+=3)for(let x=x0+2;x<x1-1;x+=3)setC(x,y,R()<.6?'pillar':'rubble',0);
    if(R()<.35)setC(Math.floor((x0+x1)/2),Math.floor((y0+y1)/2),'statue',0);
    if(R()<.3)setC(ri(x0+1,x1-1),ri(y0+1,y1-1),'tree',0);}
}
function genGraveyard(ax,ay,bx,by,s){
  const R=rng(s),w=bx-ax+1,h=by-ay+1,cx=Math.floor((ax+bx)/2);
  for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++){const c=h3(x,y,s);setC(x,y,fbm(x*.2,y*.2,s)>.68?'dirt':c<.008?'deadtree':'grass',0);}
  ringR(ax,ay,bx,by,'fence',0);for(let d=-1;d<=1;d++)setC(cx+d,by,'cobble',0);
  const mw=Math.min(9,Math.max(5,Math.floor(w*.3))),mh=Math.min(7,Math.max(5,Math.floor(h*.25))),mx0=cx-Math.floor(mw/2),my0=ay+2,my1=my0+mh-1;
  if(w>=9&&h>=12){fillR(mx0,my0,mx0+mw-1,my1,'tile',0);ringR(mx0,my0,mx0+mw-1,my1,'wall',2);setC(cx,my1,'door',0);setC(cx,my0+1,'altar',0);setC(cx-2,my1+1,'statue',0);setC(cx+2,my1+1,'statue',0);}
  const top=w>=9&&h>=12?my1+2:ay+2;
  for(let y=top;y<by;y++)setC(cx,y,'cobble',0);
  for(let y=top+1;y<by-1;y+=2)for(let x=ax+2;x<bx-1;x+=2){if(Math.abs(x-cx)<=1)continue;if(R()<.75)setC(x,y,'grave',0);}
}
function genTemple(ax,ay,bx,by,s){
  const R=rng(s),w=bx-ax+1,h=by-ay+1,cx=Math.floor((ax+bx)/2);
  fillR(ax,ay,bx,by,'cobble',0);
  const x0=ax+1,y0=ay+1,x1=bx-1,y1=by-3;if(x1-x0<6||y1-y0<6){fillR(ax,ay,bx,by,'tile',0);setC(cx,Math.floor((ay+by)/2),'altar',0);return;}
  fillR(x0,y0,x1,y1,'tile',0);ringR(x0,y0,x1,y1,'wall',3);
  for(let d=-1;d<=1;d++){setC(cx+d,y1,'tile',0);for(let y=y1+1;y<=by;y++)setC(cx+d,y,'stairsup',0);}
  const wide=x1-x0>=12;for(let y=y0+2;y<y1;y++){setC(cx,y,'carpet',0);if(wide){setC(cx-1,y,'carpet',0);setC(cx+1,y,'carpet',0);}}
  const off=Math.max(2,Math.floor((x1-x0)/4)),lx=x0+off,rx=x1-off;
  for(let y=y0+3;y<y1-1;y+=3){setC(lx,y,'pillar',0);setC(rx,y,'pillar',0);}
  setC(cx,y0+1,'altar',0);setC(cx,y0+3,'circle',0);setC(cx-2,y0+1,'statue',0);setC(cx+2,y0+1,'statue',0);setC(lx,y0+1,'fire',0);setC(rx,y0+1,'fire',0);
  for(let x=x0+2;x<x1-1;x+=3)if(Math.abs(x-cx)>2)setC(x,y0,'torch',3);
}
const GENS={
  grassland:{n:'Grassland',e:'🌾',g:'Outdoors',full:1,d:'Rolling hills, flowers, trees, a stream and a road',run:genGrassland},
  forest:{n:'Forest',e:'🌲',g:'Outdoors',full:1,d:'Thick woods with clearings and a creek',run:genForest},
  desert:{n:'Desert',e:'🏜️',g:'Outdoors',full:1,d:'Dunes, rock mesas, bones and dead trees',run:genDesert},
  oasis:{n:'Oasis',e:'🌴',g:'Outdoors',full:1,d:'A spring ringed with palms in the sand',run:genOasis},
  mountains:{n:'Mountains',e:'🏔️',g:'Outdoors',full:1,d:'Stepped cliffs rising to snowy peaks',run:genMountains},
  jungle:{n:'Jungle',e:'🌿',g:'Outdoors',full:1,d:'Tangled trees, pools and sandbanks',run:fullBiome('jungle')},
  swamp:{n:'Swamp',e:'🐸',g:'Outdoors',full:1,d:'Murky water, mud and reeds',run:fullBiome('swamp')},
  sea:{n:'Open sea',e:'🌊',g:'Outdoors',full:1,d:'Bright ocean with shallows, reefs and islands',run:genSea},
  tundra:{n:'Snowy forest',e:'❄️',g:'Outdoors',full:1,d:'Snow, pines and frozen ponds',run:fullBiome('tundra')},
  caves:{n:'Cave system',e:'🕳️',g:'Underground',d:'Winding natural tunnels and chambers',run:genCaves},
  lake:{n:'Underground lake',e:'💧',g:'Underground',d:'A deep lake with sandy shores',run:(a,b,c,d,s)=>applyBiome('lake',a,b,c,d,s)},
  lava:{n:'Lava field',e:'🌋',g:'Underground',d:'Rivers of lava and obsidian',run:(a,b,c,d,s)=>applyBiome('lava',a,b,c,d,s)},
  crystal:{n:'Crystal cave',e:'💎',g:'Underground',d:'Glowing crystals and still pools',run:(a,b,c,d,s)=>applyBiome('crystal',a,b,c,d,s)},
  fungal:{n:'Fungal forest',e:'🍄',g:'Underground',d:'Giant glowing mushrooms',run:(a,b,c,d,s)=>applyBiome('fungal',a,b,c,d,s)},
  frozen:{n:'Frozen hollow',e:'🧊',g:'Underground',d:'Ice sheets and frozen crystals',run:(a,b,c,d,s)=>applyBiome('frozen',a,b,c,d,s)},
  castle:{n:'Castle',e:'🏰',g:'Built',full:1,d:'Walls, towers, gatehouse, keep and moat',run:genCastle},
  dungeon:{n:'Dungeon rooms',e:'🗝️',g:'Built',full:1,d:'Rooms, corridors, doors, traps and treasure',run:genDungeon},
  village:{n:'Village',e:'🏘️',g:'Built',full:1,d:'Houses along roads, fields and a well',run:genVillage},
  ruins:{n:'Ruins',e:'🏛️',g:'Built',full:1,d:'Broken walls, pillars and overgrowth',run:genRuins},
  graveyard:{n:'Graveyard',e:'🪦',g:'Built',full:1,d:'Rows of graves and a mausoleum',run:genGraveyard},
  temple:{n:'Temple',e:'🕯️',g:'Built',full:1,d:'Pillared hall, altar and grand steps',run:genTemple},
  flesh:{n:'Flesh cavern',e:'🫀',g:'Living',d:'Fleshy chambers with acid and bone',run:(a,b,c,d,s)=>applyBiome('flesh',a,b,c,d,s)},
  gut:{n:'Writhing gut',e:'🐙',g:'Living',d:'Blood pools and grasping tentacles',run:(a,b,c,d,s)=>applyBiome('gut',a,b,c,d,s)},
  bones:{n:'Bone yard',e:'🦴',g:'Living',d:'Rib walls and chasms',run:(a,b,c,d,s)=>applyBiome('bones',a,b,c,d,s)},
};
const BUILDS={ship:['Ship'],rtower:['Round tower'],stower:['Square tower'],house:['House'],hut:['Hut'],cabin:['Cabin with room'],camp:['Tent camp'],cwall:['Castle wall',1],bridge:['Bridge',1],hill:['Hill'],plateau:['Plateau'],mesa:['Rock mesa']};
function doBuild(m,ax,ay,bx,by,s){
  if(['rtower','stower','house','hut','cabin','camp','ship'].includes(m)){
    // Sit structures on a level foundation at the highest ground they cover.
    const pad=2,X0=Math.max(0,ax-pad),Y0=Math.max(0,ay-pad),X1=Math.min(L.cols-1,bx+pad),Y1=Math.min(L.rows-1,by+pad);let base=0;
    for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++)base=Math.max(base,Eat(x,y));
    const bc=[],be=[];for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++){bc.push(get(x,y));be.push(Eat(x,y));}
    buildRaw(m,ax,ay,bx,by,s);
    if(base){let k=0;for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++,k++){if(get(x,y)!==bc[k]||Eat(x,y)!==be[k])setE(x,y,Eat(x,y)+base);}
      if(m==='camp'){}}
    return;}
  buildRaw(m,ax,ay,bx,by,s);
}
function buildRaw(m,ax,ay,bx,by,s){
  if(m==='ship'){const w=bx-ax+1,h=by-ay+1,horiz=w>=h,len=horiz?w:h,wid=horiz?h:w;if(len<6||wid<3){fillR(ax,ay,bx,by,'wood',1);return;}
    const half=(wid-1)/2,mid=Math.round(horiz?(ay+by)/2:(ax+bx)/2),at=(i,j)=>horiz?[ax+i,ay+j]:[ax+j,ay+i];
    for(let i=0;i<len;i++){const t=i/(len-1),taper=t>.7?Math.max(.12,1-(t-.7)/.3):t<.06?.85:1,hw=half*taper;
      for(let j=0;j<wid;j++){const off=j-half;if(Math.abs(off)>hw+.01)continue;const[x,y]=at(i,j),edge=Math.abs(off)>hw-1||i===0;setC(x,y,edge?'woodwall':'wood',edge?2:1);}}
    for(const p of len>=14?[.28,.52]:[.45]){const i=Math.round(p*(len-1)),[x,y]=horiz?[ax+i,mid]:[mid,ay+i];setC(x,y,'mast',1);}
    {const i=Math.round(.4*(len-1)),[x,y]=horiz?[ax+i,mid+(wid>4?1:0)]:[mid+(wid>4?1:0),ay+i];setC(x,y,'stairsdn',1);}
    {const[x,y]=horiz?[ax+1,mid]:[mid,ay+1];if(len>=8)setC(x,y,'crates',1);}
    return;}
  const w=bx-ax+1,h=by-ay+1,cx=(ax+bx+1)/2,cy=(ay+by+1)/2,R=rng(s),mx=Math.floor((ax+bx)/2);
  switch(m){
    case 'rtower':{const r=Math.min(w,h)/2;if(r<1.6){for(const[x,y]of discCells(cx,cy,Math.max(.8,r)))setC(x,y,'battlement',4);}else{towerAt(cx,cy,r,3+Math.min(3,Math.floor(r/3)),[0,1]);if(r>=3)setC(Math.floor(cx),Math.floor(cy),'stairsup',0);}break;}
    case 'stower':if(w<3||h<3){fillR(ax,ay,bx,by,'battlement',4);break;}fillR(ax,ay,bx,by,'tile',0);ringR(ax,ay,bx,by,'battlement',3);setC(mx,by,'door',0);if(w>=5&&h>=5)setC(ax+1,ay+1,'stairsup',0);break;
    case 'house':fillR(ax,ay,bx,by,'roof',w*h>30?3:2);break;
    case 'hut':fillR(ax,ay,bx,by,'thatch',1);break;
    case 'cabin':if(w<3||h<3){fillR(ax,ay,bx,by,'woodwall',1);break;}fillR(ax,ay,bx,by,'wood',0);ringR(ax,ay,bx,by,'woodwall',1);setC(mx,by,'door',0);break;
    case 'camp':for(let y=ay;y<=by;y+=3)for(let x=ax;x<=bx;x+=3)if(R()<.7)setC(x+(R()<.5?0:1),y,'tent',null);setC(Math.floor(cx),Math.floor(cy),'fire',null);break;
    case 'hill':{const peak=Math.max(1,Math.min(10,Math.round(Math.min(w,h)/4))),l=ovalCells(ax,ay,bx,by);
      for(let k=0;k<l.length;k+=2){const x=l[k],y=l[k+1],u=(x+.5-cx)/(w/2),v=(y+.5-cy)/(h/2),d=Math.min(1,u*u+v*v);setE(x,y,Eat(x,y)+Math.round(peak*(1-d)+(vnoise(x*.3,y*.3,s)-.5)));}break;}
    case 'plateau':case 'mesa':{const l=caveCells(ax,ay,bx,by,s),up=m==='mesa'?5:3;
      for(let k=0;k<l.length;k+=2){const x=l[k],y=l[k+1];setE(x,y,Eat(x,y)+up);if(m==='mesa'){const c=h3(x,y,s);setC(x,y,c<.25?'rubble':c<.29?'boulder':'floor',null);}}break;}
  }
}

/* ================= vision ================= */
const FAR=40;
// Heights are in feet. Each ground elevation step is 5 ft. Under open sky, walls and trees have a height a flier can see over;
// underground (no open sky) every wall reaches the ceiling.
const BLOCK_FT={wall:12,secret:12,torch:12,door:10,woodwall:10,battlement:15,portcullis:15,icewall:20,tree:30,boulder:6,tent:8,well:6,pillar:15,statue:8,
  stalag:10,crystal:12,mushroom:12,roof:15,thatch:12,memb:10,eye:Infinity,fleshwall:Infinity,ribs:Infinity,teethwall:Infinity,cavewall:Infinity,rock:Infinity};
Object.assign(BLOCK_FT,{metalwall:12,glasswall:12,elevator:10,gilded:10,elight:12,plight:12,camera:12,screen:12,cryopod:6,machine:12,lockers:7,speaker:5});
const openSky=()=>L.sky===undefined?!!L.lit:!!L.sky;
const groundFt=(x,y)=>inb(x,y)?L.elev[y*L.cols+x]*5:0;
function topFt(i){const t=T[L.cells[i]],g=L.elev[i]*5;if(!t.b)return g;if(!openSky())return Infinity;const h=BLOCK_FT[t.k];return g+(h===undefined?10:h);}
function ray(ox,oy,x,y,skip,eye,tgt){
  const tx=x+.5,ty=y+.5,n=Math.ceil(Math.hypot(tx-ox,ty-oy)*3);let lx=-9,ly=-9;
  for(let k=1;k<n;k++){const px=Math.floor(ox+(tx-ox)*k/n),py=Math.floor(oy+(ty-oy)*k/n);
    if(px===lx&&py===ly)continue;lx=px;ly=py;
    if(px===x&&py===y)return true;
    if(skip(px,py))continue;
    if(!inb(px,py))return false;
    const top=topFt(py*L.cols+px);if(top===Infinity)return false;
    if(eye===undefined){if(T[L.cells[py*L.cols+px]].b)return false;continue;}
    if(top>eye+(tgt-eye)*k/n)return false;}
  return true;
}
// Can any hero see a point at height h (ft) above cell x,y? Used for flying creatures.
function partySees(x,y,h){
  for(const t of L.tokens){if(t.kind!=='hero')continue;const n=SZ(t),ox=t.x+n/2,oy=t.y+n/2,eye=groundFt(t.x,t.y)+(t.alt||0)+5;if(t.alt<0)continue;
    const dx=x+.5-ox,dy=y+.5-oy,dz=(h-eye)/L.scale,d2=dx*dx+dy*dy+dz*dz,R=t.vision/L.scale+.5;
    if(d2>R*R&&!(litMap&&litMap[y*L.cols+x]&&d2<FAR*FAR))continue;
    if(ray(ox,oy,x,y,(a,b)=>a>=t.x&&a<t.x+n&&b>=t.y&&b<t.y+n,eye,h))return true;}
  return false;
}
function heroBoxes(extra){return L.tokens.filter(t=>t.kind==='hero').map(t=>{const n=SZ(t),p=Math.ceil(Math.max(FAR,t.vision/L.scale))+extra;
  return[Math.max(0,t.x-p),Math.max(0,t.y-p),Math.min(L.cols-1,t.x+n+p),Math.min(L.rows-1,t.y+n+p)];});}
/* ================= light levels: sky light + light sources ================= */
// Every square gets a light value from 0 (darkness) to 1 (bright light): the sky light for the time of day,
// plus every glowing tile (torches, fires, lava, crystals, terminals…) and every light a mini carries.
// Light spreads only along lines of sight, so walls cast shadows. 0.75+ is bright, 0.3+ is dim, below is darkness.
const SKY={day:{v:1,n:'Daylight'},dusk:{v:.55,n:'Dawn or dusk'},moon:{v:.36,n:'Moonlit night'},night:{v:.1,n:'Dark night'},none:{v:0,n:'No light'}};
const LIGHTS={none:{n:'No light'},candle:{n:'Candle (5 ft bright, 5 ft dim)',b:5,d:10,c:'#ffc070'},torch:{n:'Torch (20 ft bright, 20 ft dim)',b:20,d:40,c:'#ffb04a'},
  lamp:{n:'Lamp (15 ft bright, 30 ft dim)',b:15,d:45,c:'#ffc070'},hooded:{n:'Hooded lantern (30 ft bright, 30 ft dim)',b:30,d:60,c:'#ffd080'},
  bullseye:{n:'Bullseye lantern or flashlight (60 ft)',b:60,d:120,c:'#fff0c0'},light:{n:'Light cantrip (20 ft bright, 20 ft dim)',b:20,d:40,c:'#fff6d8'},
  daylight:{n:'Daylight spell (60 ft bright, 60 ft dim)',b:60,d:120,c:'#fffbe8'},faint:{n:'Faint glow (5 ft dim)',b:0,d:5,c:'#a0e0ff'},
  fiery:{n:'Burning body (10 ft bright, 10 ft dim)',b:10,d:20,c:'#ff8a3a'}};
const lightTimeOf=l=>l.time||(l.lit?(l.mood==='night'?'night':l.mood==='dusk'?'dusk':'day'):(l.sky&&l.mood==='dusk'?'dusk':l.sky&&l.mood==='night'?'night':'none'));
let lightMap=null,lightStamp=0;
function lightVal(d,b,D){return d<=b?1-.15*d/Math.max(b,.01):d<=D?.75-.45*(d-b)/Math.max(D-b,.01):0;}
function addLight(out,v,i){const a=out[i];out[i]=a>=v?a+v*.3*(1-a):v+a*.3*(1-v);if(out[i]>1)out[i]=1;}
function castLight(out,ox,oy,b,D,eye,los,ownSkip){
  const R=Math.ceil(D);for(let y=Math.max(0,Math.floor(oy-R));y<=Math.min(L.rows-1,Math.ceil(oy+R));y++)
    for(let x=Math.max(0,Math.floor(ox-R));x<=Math.min(L.cols-1,Math.ceil(ox+R));x++){
      const d=Math.hypot(x+.5-ox,y+.5-oy);if(d>D)continue;const v=lightVal(d,b,D);if(v<=0)continue;const i=y*L.cols+x;
      if(los&&d>1&&!ray(ox,oy,x,y,ownSkip,eye,L.elev[i]*5+2))continue;addLight(out,v,i);}}
function terrainKey(){let h=L.cols*31+L.rows;const c=L.cells,e=L.elev;for(let i=0;i<c.length;i++)h=(h*33+c[i]*7+e[i])|0;return h;}
function staticLight(){
  const amb=SKY[lightTimeOf(L)]?SKY[lightTimeOf(L)].v:0,key=terrainKey()+'|'+amb;
  if(L._light&&L._light.key===key&&L._light.n===L.cells.length)return L._light.val;
  const n=L.cols*L.rows,out=new Float32Array(n);if(amb>0)out.fill(amb);
  const src=[];for(let i=0;i<n;i++){const g=T[L.cells[i]].glow;if(g)src.push(i);}
  const los=src.length<4000;
  for(const i of src){const x=i%L.cols,y=(i/L.cols)|0,g=T[L.cells[i]].glow;castLight(out,x+.5,y+.5,g*.6,g*1.5,L.elev[i]*5+5,los,(a,b)=>a===x&&b===y);}
  L._light={key,n:L.cells.length,val:out};return out;}
function computeLightMap(){
  const base=staticLight(),out=new Float32Array(base);
  for(const t of L.tokens){const P=LIGHTS[t.light];if(!P||!P.d||(t.hidden&&mode==='party'&&t.kind==='creature'))continue;const n=SZ(t),sc=L.scale||5;
    castLight(out,t.x+n/2,t.y+n/2,P.b/sc+n/2-.5,P.d/sc+n/2-.5,groundFt(t.x,t.y)+(t.alt||0)+5,true,(a,b)=>inFoot(t,a,b));}
  // walls show the light that falls on their faces
  const C=L.cols,lit=out.slice();for(let i=0;i<out.length;i++){if(!T[L.cells[i]].b)continue;const x=i%C;let m=0;
    for(const j of[i-1,i+1,i-C,i+C]){if(j<0||j>=out.length||(j===i-1&&x===0)||(j===i+1&&x===C-1)||T[L.cells[j]].b)continue;if(out[j]>m)m=out[j];}if(m>lit[i])lit[i]=m;}
  lightStamp++;return lit;}
function lightWord(v){return v>=.75?'bright light':v>=.3?'dim light':'darkness';}
function computeLight(){lightMap=computeLightMap();const lit=new Uint8Array(lightMap.length);for(let i=0;i<lit.length;i++)lit[i]=lightMap[i]>=.3?1:0;return lit;}
// darkness overlay: one pixel per square, smoothed when drawn, tinted by time of day
const lmc=document.createElement('canvas');let lmcStamp=-1,lmcMode='';
function drawLightLevels(){
  if(!lightMap||!L)return;const C=L.cols,R=L.rows,time=lightTimeOf(L),dm=mode==='dm',key=lightStamp+'|'+mode+'|'+time+'|'+(partyVis?ovStamp:0);
  if(lmcStamp!==key){lmcStamp=key;if(lmc.width!==C||lmc.height!==R){lmc.width=C;lmc.height=R;}
    const g=lmc.getContext('2d'),img=g.createImageData(C,R),d=img.data,tint=time==='night'||time==='moon'?[4,8,26]:time==='dusk'?[26,10,18]:[3,5,12],maxA=dm?.58:.93;
    for(let i=0;i<C*R;i++){const v=lightMap[i];let a=Math.pow(1-v,1.25)*maxA;if(!dm&&partyVis&&partyVis[i]&&v<.3)a=Math.min(a,.62);
      const j=i*4;d[j]=tint[0];d[j+1]=tint[1];d[j+2]=tint[2];d[j+3]=a*255;}g.putImageData(img,0,0);}
  const cs=view.cs;ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(lmc,0,0,C,R,0,0,C*cs,R*cs);ctx.restore();
  if(time==='dusk'){ctx.save();ctx.globalCompositeOperation='soft-light';ctx.fillStyle='rgba(255,140,60,.18)';ctx.fillRect(0,0,C*cs,R*cs);ctx.restore();}
}
const inFoot=(t,x,y)=>{const n=SZ(t);return x>=t.x&&x<t.x+n&&y>=t.y&&y<t.y+n;};
function heroVis(t,out){
  if((t.alt||0)<0&&!t.submerged){for(let y=t.y;y<t.y+SZ(t);y++)for(let x=t.x;x<t.x+SZ(t);x++)if(inb(x,y))out[idx(x,y)]=1;return;}
  const alt=t.alt||0,n=SZ(t),eye=groundFt(t.x,t.y)+alt+5,ox=t.x+n/2,oy=t.y+n/2,R=t.vision/L.scale+.5,M=Math.max(R,FAR),R2=R*R,M2=M*M,skip=(a,b)=>a>=t.x&&a<t.x+n&&b>=t.y&&b<t.y+n;
  for(let y=Math.max(0,Math.floor(oy-M));y<=Math.min(L.rows-1,Math.ceil(oy+M));y++)
    for(let x=Math.max(0,Math.floor(ox-M));x<=Math.min(L.cols-1,Math.ceil(ox+M));x++){
      const i=y*L.cols+x;if(out[i])continue;
      const dx=x+.5-ox,dy=y+.5-oy,d2=dx*dx+dy*dy;
      const g=L.elev[i]*5,dz=(eye-g)/L.scale,d3=d2+dz*dz;
      if(d3>M2)continue;if(d3>R2&&!litMap[i])continue;
      if(ray(ox,oy,x,y,skip,eye,g+2))out[i]=1;
    }
  for(let y=t.y;y<t.y+n;y++)for(let x=t.x;x<t.x+n;x++)if(inb(x,y))out[idx(x,y)]=1;
}
function computeVis(){
  litMap=computeLight();
  partyVis=new Uint8Array(L.cols*L.rows);
  for(const t of L.tokens)if(t.kind==='hero')heroVis(t,partyVis);
  for(const[bx0,by0,bx1,by1]of heroBoxes(2))for(let y=by0;y<=by1;y++)for(let x=bx0;x<=bx1;x++){const i=y*L.cols+x;if(partyVis[i])L.explored[i]=1;}
  visDirty=false;selVis=null;ovStamp++;
}
function invalidate(){visDirty=true;selVis=null;ovStamp++;}
function seenByParty(t){const n=SZ(t),alt=t.alt||0;
  if(alt<0&&!t.submerged)return false;
  if(alt>0){for(let y=t.y;y<t.y+n;y++)for(let x=t.x;x<t.x+n;x++)if(inb(x,y)&&partySees(x,y,groundFt(x,y)+alt+3))return true;return false;}
  for(let y=t.y;y<t.y+n;y++)for(let x=t.x;x<t.x+n;x++)if(inb(x,y)&&partyVis[idx(x,y)])return true;return false;}
function fmtDist(sq){const ft=Math.round(sq*L.scale);if(ft>=5280){const mi=ft/5280;return(mi>=10?Math.round(mi):mi.toFixed(1))+' mi';}return ft.toLocaleString()+' ft';}

/* ================= drawing ================= */
function base(t,px,py,s,h){ctx.fillStyle=t.sh[(h*6)|0];ctx.fillRect(px,py,s,s);}
function line(x1,y1,x2,y2,c,w){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function dot(x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,Math.max(.1,r),0,TAU);ctx.fill();}
function ring(x,y,r,c,w){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.arc(x,y,Math.max(.1,r),0,TAU);ctx.stroke();}
function curveAcross(px,py,s,x,y,c,w){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();
  const a=.2+.6*hash(x,y*3+1),b=.2+.6*hash(x+1,y*3+1),m=.2+.6*hash(x*5+2,y);
  ctx.moveTo(px,py+s*a);ctx.quadraticCurveTo(px+s*.5,py+s*m,px+s,py+s*b);ctx.stroke();}
function poly(pts,c){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)ctx.lineTo(pts[i],pts[i+1]);ctx.closePath();ctx.fill();}
function stoneWall(px,py,s){ctx.fillStyle='#363c47';ctx.fillRect(px,py,s,s);const m=Math.max(1,s*.05);
  for(let k=0;k<2;k++){const sy=py+k*s/2+m*.5;ctx.fillStyle=k?'#3d4350':'#414856';ctx.fillRect(px+m*.5,sy,s-m,s/2-m);ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(px+m*.5,sy,s-m,m*.7);ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(px+m*.5,sy+s/2-m*1.6,s-m,m*.7);}
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(px+s*.5,py,m*.8,s/2);}
function drawDoor(px,py,x,y,s,open){
  const horiz=isWall(x-1,y)||isWall(x+1,y);
  ctx.fillStyle='#8a5a2b';ctx.strokeStyle='#3e250f';ctx.lineWidth=Math.max(1,s*.05);
  const r=!open?(horiz?[px+s*.06,py+s*.32,s*.88,s*.36]:[px+s*.32,py+s*.06,s*.36,s*.88]):(horiz?[px+s*.06,py+s*.06,s*.16,s*.88]:[px+s*.06,py+s*.06,s*.88,s*.16]);
  ctx.fillRect(r[0],r[1],r[2],r[3]);ctx.strokeRect(r[0],r[1],r[2],r[3]);
  if(!open)horiz?dot(px+s*.72,py+s*.5,s*.05,'#d9b45a'):dot(px+s*.5,py+s*.72,s*.05,'#d9b45a');
}
function drawCell(id,px,py,x,y,s,det){
  const t=T[id],h=hash(x,y),g=hash(x+57,y+13),q=hash(x+3,y+91);
  if(!det){ctx.fillStyle=t.f||t.sh[(h*6)|0];ctx.fillRect(px,py,s,s);return;}
  const lw=Math.max(1,s*.05),F=T[ID.floor];
  switch(t.k){
    case 'floor':{ctx.fillStyle='#4a463f';ctx.fillRect(px,py,s,s);const lay=hash(x*5,y*3),st=lay>.72?[[0,0,1,1]]:lay>.36?[[0,0,1,.5],[0,.5,1,.5]]:[[0,0,.5,1],[.5,0,.5,1]],m=Math.max(1,s*.05);
      st.forEach((r,k)=>{const sx=px+r[0]*s+m*.5,sy=py+r[1]*s+m*.5,sw=r[2]*s-m,sh=r[3]*s-m;ctx.fillStyle=t.sh[(hash(x*7+k,y*11)*6)|0];ctx.fillRect(sx,sy,sw,sh);
        ctx.fillStyle='rgba(255,255,255,.09)';ctx.fillRect(sx,sy,sw,m*.7);ctx.fillRect(sx,sy,m*.7,sh);ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(sx,sy+sh-m*.7,sw,m*.7);ctx.fillRect(sx+sw-m*.7,sy,m*.7,sh);});
      if(g>.85)line(px+s*q*.6,py+s*h*.7+s*.1,px+s*q*.6+s*.28,py+s*h*.7+s*.24,'rgba(0,0,0,.25)',1);break;}
    case 'rubble':base(t,px,py,s,h);for(let i=0;i<3;i++)dot(px+s*(.2+.6*hash(x*3+i,y*5)),py+s*(.2+.6*hash(x*7,y*3+i)),s*(.07+.06*hash(i,x+y)),i%2?'#8b857a':'#3f3b35');break;
    case 'wall':stoneWall(px,py,s);break;
    case 'secret':stoneWall(px,py,s);if(mode==='dm'){ctx.strokeStyle='#f0c674';ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.strokeRect(px+s*.2,py+s*.25,s*.6,s*.5);ctx.setLineDash([]);}break;
    case 'cavewall':base(t,px,py,s,h);dot(px+s*(.3+.4*g),py+s*(.3+.3*q),s*(.28+.1*h),'#4a433c');dot(px+s*(.25+.4*g),py+s*(.22+.3*q),s*.14,'#58504a');break;
    case 'icewall':base(t,px,py,s,h);ctx.fillStyle='rgba(255,255,255,.45)';ctx.fillRect(px,py,s,s*.16);line(px+s*.2,py+s*.8,px+s*.55,py+s*.35,'rgba(255,255,255,.5)',lw);break;
    case 'woodwall':base(t,px,py,s,h);for(let i=1;i<3;i++)line(px+s*i/3,py,px+s*i/3,py+s,'#3a2616',lw);ctx.fillStyle='rgba(255,220,170,.12)';ctx.fillRect(px,py,s,s*.12);break;
    case 'torch':stoneWall(px,py,s);dot(px+s*.5,py+s*.55,s*.42,'rgba(255,170,60,.18)');ctx.fillStyle='#4a2f1a';ctx.fillRect(px+s*.44,py+s*.55,s*.12,s*.35);
      dot(px+s*.5,py+s*.5,s*.15,'#ff8a2a');dot(px+s*.5,py+s*.46,s*.08,'#ffe08a');break;
    case 'fleshwall':base(t,px,py,s,h);ctx.fillStyle='#7a2d37';ctx.fillRect(px,py,s,s*.14);curveAcross(px,py,s,x,y,'rgba(25,0,6,.5)',s*.07);break;
    case 'teethwall':base(t,px,py,s,h);ctx.fillStyle='#e8dfca';for(let i=0;i<3;i++){const a=px+s*i/3;poly([a,py+s*.15,a+s/3,py+s*.15,a+s/6,py+s*.85],'#e8dfca');}break;
    case 'ribs':ctx.fillStyle='#2b1a1d';ctx.fillRect(px,py,s,s);ctx.strokeStyle=t.c;ctx.lineWidth=s*.13;ctx.lineCap='round';
      for(let i=0;i<2;i++){ctx.beginPath();ctx.arc(px+s*.5,py+s*(.85+.4*i),s*.55,Math.PI*1.2,Math.PI*1.8);ctx.stroke();}ctx.lineCap='butt';break;
    case 'door':case 'dooro':base(F,px,py,s,h);drawDoor(px,py,x,y,s,t.k==='dooro');break;
    case 'memb':case 'membo':{base(T[ID.flesh],px,py,s,h);const horiz=isWall(x-1,y)||isWall(x+1,y);
      ctx.beginPath();ctx.ellipse(px+s/2,py+s/2,horiz?s*.48:s*.3,horiz?s*.3:s*.48,0,0,TAU);
      if(t.k==='memb'){ctx.fillStyle='#c46a7a';ctx.fill();ctx.strokeStyle='#6b2633';ctx.lineWidth=lw;ctx.stroke();
        horiz?line(px+s*.22,py+s/2,px+s*.78,py+s/2,'#4a1420',lw*1.4):line(px+s/2,py+s*.22,px+s/2,py+s*.78,'#4a1420',lw*1.4);}
      else{ctx.strokeStyle='#c46a7a';ctx.lineWidth=s*.09;ctx.stroke();}
      break;}
    case 'dirt':base(t,px,py,s,h);ctx.fillStyle='rgba(0,0,0,.2)';for(let i=0;i<3;i++)ctx.fillRect(px+s*.85*hash(x+i,y*2),py+s*.85*hash(y+i,x*2),s*.08,s*.08);break;
    case 'mud':base(t,px,py,s,h);if(g>.55){ctx.fillStyle='rgba(120,140,150,.25)';ctx.beginPath();ctx.ellipse(px+s*(.3+.4*q),py+s*(.3+.4*h),s*.22,s*.1,0,0,TAU);ctx.fill();}break;
    case 'grass':{base(t,px,py,s,h);ell(px+s*(.2+.6*q),py+s*(.2+.6*g),s*.32,s*.22,'rgba(20,50,10,.18)');ell(px+s*(.3+.4*g),py+s*(.3+.4*h),s*.22,s*.16,'rgba(150,200,90,.14)');
      for(const[col,k0]of[['#3e6a2c',0],['#78a852',3]]){ctx.strokeStyle=col;ctx.lineWidth=Math.max(1,s*.035);ctx.beginPath();
        for(let i=k0;i<k0+4;i++){const a=px+s*(.1+.8*hash(x*5+i,y)),b=py+s*(.25+.7*hash(x,y*5+i)),l=s*(.08+.08*hash(i,x+y));ctx.moveTo(a,b);ctx.quadraticCurveTo(a-l*.3,b-l*.6,a-l*.5,b-l);ctx.moveTo(a,b);ctx.quadraticCurveTo(a+l*.2,b-l*.7,a+l*.4,b-l*1.1);}ctx.stroke();}
      if(g>.93)dot(px+s*q,py+s*h,Math.max(1,s*.045),q>.5?'#f2e08a':'#f4f0f0');break;}
    case 'brush':base(t,px,py,s,h);for(let i=0;i<5;i++){const a=px+s*(.1+.8*hash(x*7+i,y*3)),b=py+s*(.6+.35*hash(x*3,y*7+i));line(a,b,a+s*(hash(i,x)-.5)*.25,b-s*.45,i%2?'#264a1b':'#6a9a44',lw);}break;
    case 'tree':base(t,px,py,s,h);
      dot(px+s*(.45+.1*g),py+s*(.5+.1*q),s*(.44+.06*h),'#1b3620');dot(px+s*(.4+.1*g),py+s*(.43+.1*q),s*(.28+.06*h),'#2a5230');dot(px+s*(.35+.1*g),py+s*(.36+.1*q),s*.11,'#3f733c');break;
    case 'sand':base(t,px,py,s,h);for(let i=0;i<4;i++)dot(px+s*hash(x*9+i,y),py+s*hash(x,y*9+i),Math.max(.6,s*.03),'rgba(90,70,40,.4)');break;
    case 'snow':base(t,px,py,s,h);for(let i=0;i<3;i++)dot(px+s*hash(x*9+i,y),py+s*hash(x,y*9+i),Math.max(.6,s*.04),'rgba(140,170,190,.45)');break;
    case 'shallow':case 'deep':case 'swamp':if(prefs.fx&&t.k!=='swamp'){ctx.fillStyle=t.c;ctx.fillRect(px,py,s,s);break;}base(t,px,py,s,h);
      if(t.k==='swamp'&&g>.55){for(let i=0;i<3;i++){const a=px+s*(.2+.6*hash(x*4+i,y));line(a,py+s*.85,a+s*.05,py+s*.35,'#7e9a52',lw);}}
      else if(g>.45){ctx.strokeStyle=t.k==='deep'?'rgba(255,255,255,.12)':'rgba(255,255,255,.24)';ctx.lineWidth=Math.max(1,s*.04);ctx.beginPath();
      const a=px+s*(.1+.4*q),b=py+s*(.3+.4*h);ctx.moveTo(a,b);ctx.quadraticCurveTo(a+s*.1,b-s*.1,a+s*.2,b);ctx.quadraticCurveTo(a+s*.3,b+s*.1,a+s*.4,b);ctx.stroke();}break;
    case 'ice':base(t,px,py,s,h);if(g>.5)line(px+s*.2,py+s*.75,px+s*.6,py+s*.3,'rgba(255,255,255,.65)',Math.max(1,s*.04));break;
    case 'lava':base(t,px,py,s,h);curveAcross(px,py,s,x,y,'#ffcf57',Math.max(1,s*.07));if(g>.6)dot(px+s*q,py+s*h,s*.06,'#ffe9a0');break;
    case 'crust':base(t,px,py,s,h);curveAcross(px,py,s,x,y,'#e0602a',Math.max(1,s*.04));break;
    case 'acid':base(t,px,py,s,h);for(let i=0;i<2;i++)ring(px+s*(.25+.5*hash(x+i,y*3)),py+s*(.25+.5*hash(x*3,y+i)),s*(.06+.06*hash(i,x)),'#e4f77e',Math.max(1,s*.04));break;
    case 'blood':base(t,px,py,s,h);if(g>.5){ctx.fillStyle='rgba(255,120,120,.18)';ctx.beginPath();ctx.ellipse(px+s*(.3+.4*q),py+s*(.3+.3*h),s*.18,s*.07,0,0,TAU);ctx.fill();}break;
    case 'chasm':ctx.fillStyle=t.c;ctx.fillRect(px,py,s,s);{const up=get(x,y-1);if(up!==id&&!T[up].b){ctx.fillStyle='rgba(140,125,110,.45)';ctx.fillRect(px,py,s,s*.1);}}break;
    case 'flesh':base(t,px,py,s,h);if(g>.8)curveAcross(px,py,s,x,y,'rgba(90,20,35,.5)',lw);break;
    case 'veins':base(T[ID.flesh],px,py,s,h);curveAcross(px,py,s,x,y,'#5a1626',s*.13);curveAcross(px,py,s,x,y,'#c45a6a',Math.max(1,s*.04));break;
    case 'tentacle':base(T[ID.flesh],px,py,s,h);ctx.lineCap='round';curveAcross(px,py,s,x+3,y,'#6e3a5e',s*.2);ctx.lineCap='butt';
      for(let i=0;i<3;i++)dot(px+s*(.2+.3*i),py+s*(.35+.3*hash(x+i,y)),s*.04,'#d9a6c6');break;
    case 'bone':base(t,px,py,s,h);if(g>.55)line(px+s*.15,py+s*(.3+.4*q),px+s*.7,py+s*(.2+.5*h),'#9e9278',lw);break;
    case 'fungus':base(t,px,py,s,h);
      for(let i=0;i<3;i++){const cx=px+s*(.2+.6*hash(x*4+i,y)),cy=py+s*(.2+.6*hash(x,y*4+i)),r=s*(.07+.07*hash(i,x+y));
        dot(cx,cy,r*2.3,i%2?'rgba(127,224,208,.16)':'rgba(192,140,255,.16)');dot(cx,cy,r,i%2?'#7fe0d0':'#c08cff');}break;
    case 'mushroom':base(T[ID.dirt],px,py,s,h);dot(px+s*.5,py+s*.5,s*.5,'rgba(111,214,200,.15)');dot(px+s*.5,py+s*.5,s*.42,'#3f9488');dot(px+s*.46,py+s*.44,s*.34,'#5fc9b9');
      for(let i=0;i<3;i++)dot(px+s*(.3+.4*hash(x+i,y*2)),py+s*(.3+.35*hash(x*2,y+i)),s*.05,'#e8fff8');break;
    case 'crystal':base(t,px,py,s,h);poly([px+s*.52,py+s*.06,px+s*.76,py+s*.55,px+s*.52,py+s*.94,px+s*.3,py+s*.55],'#5fb6c9');
      poly([px+s*.24,py+s*.3,px+s*.36,py+s*.62,px+s*.22,py+s*.88,px+s*.1,py+s*.6],'#a8e6f2');break;
    case 'eye':base(T[ID.fleshwall],px,py,s,h);ctx.fillStyle='#efe6d6';ctx.beginPath();ctx.ellipse(px+s/2,py+s/2,s*.38,s*.24,0,0,TAU);ctx.fill();
      dot(px+s/2,py+s/2,s*.17,'#d9a521');ctx.fillStyle='#120406';ctx.beginPath();ctx.ellipse(px+s/2,py+s/2,s*.045,s*.15,0,0,TAU);ctx.fill();break;
    case 'maw':ctx.fillStyle=t.c;ctx.fillRect(px,py,s,s);
      for(let i=0;i<3;i++){const a=px+s*i/3;poly([a,py,a+s/3,py,a+s/6,py+s*.32],'#ece3cf');poly([a,py+s,a+s/3,py+s,a+s/6,py+s*.68],'#ece3cf');}break;
    case 'bridge':base(t,px,py,s,h);for(let i=1;i<4;i++)line(px,py+s*i/4,px+s,py+s*i/4,'#4a3020',Math.max(1,s*.03));break;
    case 'roots':base(T[ID.dirt],px,py,s,h);curveAcross(px,py,s,x,y,'#2e2215',s*.1);if(g>.5)curveAcross(px,py,s,x+11,y,'#3d2d1c',s*.06);break;
    case 'obsidian':base(t,px,py,s,h);if(g>.5)line(px+s*.15,py+s*.3,px+s*.6,py+s*.15,'rgba(200,190,255,.18)',lw);break;
    case 'wood':base(t,px,py,s,h);line(px,py+s*.5,px+s,py+s*.5,'#5a3f26',Math.max(1,s*.03));line(px+s*(q>.5?.3:.7),py,px+s*(q>.5?.3:.7),py+s*.5,'#5a3f26',Math.max(1,s*.03));
      line(px+s*(q>.5?.7:.3),py+s*.5,px+s*(q>.5?.7:.3),py+s,'#5a3f26',Math.max(1,s*.03));break;
    case 'tile':base(t,px,py,s,h);ctx.strokeStyle='rgba(255,255,255,.22)';ctx.lineWidth=Math.max(1,s*.03);ctx.strokeRect(px+s*.1,py+s*.1,s*.8,s*.8);break;
    case 'carpet':base(t,px,py,s,h);poly([px+s*.5,py+s*.18,px+s*.82,py+s*.5,px+s*.5,py+s*.82,px+s*.18,py+s*.5],'#8c3a48');dot(px+s*.5,py+s*.5,s*.07,'#d9b45a');break;
    case 'stalag':base(F,px,py,s,h);dot(px+s*(.4+.2*g),py+s*(.5+.1*q),s*.36,'#4a453f');dot(px+s*(.36+.2*g),py+s*(.44+.1*q),s*.2,'#6a645b');dot(px+s*(.33+.2*g),py+s*(.4+.1*q),s*.07,'#8f887d');
      dot(px+s*(.78-.1*g),py+s*.25,s*.12,'#4a453f');break;
    case 'pillar':base(F,px,py,s,h);dot(px+s*.53,py+s*.55,s*.4,'rgba(0,0,0,.35)');dot(px+s*.5,py+s*.5,s*.4,'#8a8578');ring(px+s*.5,py+s*.5,s*.3,'#a7a294',lw);dot(px+s*.42,py+s*.42,s*.1,'#b4ae9f');break;
    case 'stairsup':case 'stairsdn':{base(F,px,py,s,h);const up=t.k==='stairsup';for(let i=0;i<5;i++){const y2=py+s*(.12+i*.18);ctx.fillStyle=`rgba(${up?'255,255,255':'0,0,0'},${.08+(up?4-i:i)*.06})`;ctx.fillRect(px+s*.1,y2,s*.8,s*.14);}
      poly(up?[px+s*.5,py+s*.2,px+s*.7,py+s*.45,px+s*.3,py+s*.45]:[px+s*.5,py+s*.8,px+s*.7,py+s*.55,px+s*.3,py+s*.55],up?'#f0c674':'#1a1714');break;}
    case 'pit':base(F,px,py,s,h);ctx.fillStyle='#1a1714';ctx.fillRect(px+s*.15,py+s*.15,s*.7,s*.7);ctx.strokeStyle='#8a8578';ctx.lineWidth=lw;ctx.strokeRect(px+s*.15,py+s*.15,s*.7,s*.7);
      for(let i=0;i<3;i++)poly([px+s*(.25+i*.2),py+s*.75,px+s*(.35+i*.2),py+s*.75,px+s*(.3+i*.2),py+s*.45],'#6a645b');break;
    case 'web':base(t,px,py,s,h);ctx.strokeStyle='rgba(235,235,225,.55)';ctx.lineWidth=Math.max(.7,s*.025);ctx.beginPath();
      const wx=px+s*(.3+.4*g),wy=py+s*(.3+.4*q);for(let i=0;i<6;i++){const a=i*TAU/6+h;ctx.moveTo(wx,wy);ctx.lineTo(wx+Math.cos(a)*s*.6,wy+Math.sin(a)*s*.6);}ctx.stroke();
      ring(wx,wy,s*.18,'rgba(235,235,225,.45)',Math.max(.7,s*.025));ring(wx,wy,s*.34,'rgba(235,235,225,.35)',Math.max(.7,s*.025));break;
    case 'fire':base(t,px,py,s,h);dot(px+s/2,py+s/2,s*.48,'rgba(255,150,50,.18)');line(px+s*.2,py+s*.72,px+s*.8,py+s*.5,'#4a2f1a',s*.1);line(px+s*.2,py+s*.5,px+s*.8,py+s*.72,'#5a3a20',s*.1);
      dot(px+s*.5,py+s*.52,s*.2,'#ff7a1a');dot(px+s*.5,py+s*.48,s*.12,'#ffc23a');dot(px+s*.5,py+s*.45,s*.05,'#fff2b0');break;
    case 'altar':base(F,px,py,s,h);ctx.fillStyle='#b9b2a2';ctx.fillRect(px+s*.15,py+s*.3,s*.7,s*.4);ctx.fillStyle='#d9b45a';ctx.fillRect(px+s*.15,py+s*.46,s*.7,s*.08);dot(px+s*.5,py+s*.38,s*.06,'#e05050');break;
    case 'statue':base(F,px,py,s,h);ctx.fillStyle='#5f5b54';ctx.fillRect(px+s*.15,py+s*.15,s*.7,s*.7);dot(px+s*.5,py+s*.6,s*.24,'#b8b3a8');dot(px+s*.5,py+s*.32,s*.13,'#cfcabe');break;
    case 'chest':base(F,px,py,s,h);ctx.fillStyle='#7a4a22';ctx.fillRect(px+s*.18,py+s*.3,s*.64,s*.42);ctx.fillStyle='#d9b45a';ctx.fillRect(px+s*.18,py+s*.42,s*.64,s*.07);ctx.fillRect(px+s*.45,py+s*.38,s*.1,s*.16);
      dot(px+s*.25,py+s*.82,s*.05,'#f0d070');dot(px+s*.75,py+s*.2,s*.04,'#f0d070');break;
    case 'portal':base(t,px,py,s,h);for(let i=0;i<4;i++){ctx.strokeStyle=['#5a2fa0','#8a5ad1','#b993ff','#e6d6ff'][i];ctx.lineWidth=Math.max(1,s*.07);ctx.beginPath();ctx.ellipse(px+s/2,py+s/2,s*(.44-i*.1),s*(.44-i*.1),0,h*TAU+i,h*TAU+i+4.5);ctx.stroke();}break;
    case 'circle':base(F,px,py,s,h);ring(px+s/2,py+s/2,s*.4,'#7fe0d0',lw);ring(px+s/2,py+s/2,s*.28,'rgba(127,224,208,.6)',Math.max(1,s*.03));
      ctx.strokeStyle='rgba(127,224,208,.7)';ctx.lineWidth=Math.max(1,s*.03);ctx.beginPath();for(let i=0;i<=5;i++){const a=-Math.PI/2+i*TAU*2/5;const X=px+s/2+Math.cos(a)*s*.28,Y=py+s/2+Math.sin(a)*s*.28;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);}ctx.stroke();break;
    case 'cobble':base(t,px,py,s,h);for(let i=0;i<4;i++){const v=hash(x*4+i,y*3);dot(px+s*(.27+.46*(i&1))+(v-.5)*s*.08,py+s*(.27+.46*(i>>1))+(hash(x,y*7+i)-.5)*s*.08,s*.19,v>.5?'#86827a':'#6a665e');}break;
    case 'road':base(t,px,py,s,h);for(let i=0;i<3;i++)dot(px+s*hash(x*7+i,y),py+s*hash(x,y*7+i),Math.max(.7,s*.035),'rgba(60,45,25,.45)');break;
    case 'flowers':{base(t,px,py,s,h);const cols=['#f2d24a','#f4f0e6','#e47aa6','#a985e0'];for(let i=0;i<4;i++)dot(px+s*(.15+.7*hash(x*3+i,y)),py+s*(.15+.7*hash(x,y*3+i)),Math.max(1,s*.06),cols[(i+((h*4)|0))%4]);break;}
    case 'wheat':base(t,px,py,s,h);ctx.strokeStyle='#8f7228';ctx.lineWidth=Math.max(1,s*.04);ctx.beginPath();for(let i=0;i<4;i++){const a=px+s*(.12+.25*i);ctx.moveTo(a,py+s*.9);ctx.lineTo(a+s*.05,py+s*.15);}ctx.stroke();break;
    case 'dunes':base(t,px,py,s,h);curveAcross(px,py,s,x,y,'rgba(140,105,55,.45)',Math.max(1,s*.05));curveAcross(px,py+s*.35,s,x,y+9,'rgba(250,230,190,.35)',Math.max(1,s*.04));break;
    case 'battlement':base(t,px,py,s,h);ctx.fillStyle='#a3a09a';ctx.fillRect(px+s*.18,py+s*.18,s*.64,s*.64);ctx.fillStyle='#6f6c66';for(let i=0;i<4;i++)ctx.fillRect(px+s*((i&1)?.72:0),py+s*((i>>1)?.72:0),s*.28,s*.28);break;
    case 'portcullis':case 'portcullo':{base(F,px,py,s,h);const up=t.k==='portcullo';ctx.strokeStyle='#2a2a2a';ctx.lineWidth=Math.max(1,s*.06);ctx.beginPath();
      if(up){ctx.moveTo(px,py+s*.08);ctx.lineTo(px+s,py+s*.08);}else{for(let i=1;i<5;i++){ctx.moveTo(px+s*i/5,py+s*.3);ctx.lineTo(px+s*i/5,py+s*.7);}ctx.moveTo(px,py+s*.38);ctx.lineTo(px+s,py+s*.38);ctx.moveTo(px,py+s*.62);ctx.lineTo(px+s,py+s*.62);}ctx.stroke();break;}
    case 'roof':base(t,px,py,s,h);ctx.strokeStyle='rgba(60,20,10,.45)';ctx.lineWidth=Math.max(1,s*.04);ctx.beginPath();for(let i=1;i<4;i++){ctx.moveTo(px,py+s*i/4);ctx.lineTo(px+s,py+s*i/4);}ctx.stroke();
      ctx.fillStyle='rgba(60,20,10,.3)';for(let i=0;i<4;i++)ctx.fillRect(px+((i+y)%2?s*.5:s*.02),py+s*i/4,Math.max(1,s*.04),s/4);break;
    case 'thatch':base(t,px,py,s,h);ctx.strokeStyle='rgba(100,75,30,.5)';ctx.lineWidth=Math.max(1,s*.03);ctx.beginPath();for(let i=0;i<6;i++){const a=px+s*hash(x*6+i,y);ctx.moveTo(a,py+s*(.1+.15*(i%3)));ctx.lineTo(a+s*.12,py+s*(.45+.15*(i%3)));}ctx.stroke();break;
    case 'palm':base(t,px,py,s,h);ctx.lineCap='round';for(let i=0;i<6;i++){const a=i*TAU/6+h*2;line(px+s/2,py+s/2,px+s/2+Math.cos(a)*s*.45,py+s/2+Math.sin(a)*s*.45,i%2?'#3f7a2e':'#5a9a3a',Math.max(1.5,s*.12));}ctx.lineCap='butt';dot(px+s/2,py+s/2,s*.08,'#6b4a28');break;
    case 'deadtree':base(t,px,py,s,h);ctx.lineCap='round';for(let i=0;i<4;i++){const a=i*TAU/4+h*3;line(px+s/2,py+s/2,px+s/2+Math.cos(a)*s*.42,py+s/2+Math.sin(a)*s*.42,'#3a2a1a',Math.max(1,s*.06));}ctx.lineCap='butt';dot(px+s/2,py+s/2,s*.1,'#4a3420');break;
    case 'boulder':base(t,px,py,s,h);dot(px+s*.53,py+s*.56,s*.38,'rgba(0,0,0,.3)');dot(px+s*.5,py+s*.5,s*.38,'#7a766d');dot(px+s*.42,py+s*.42,s*.16,'#9a958a');break;
    case 'tent':base(t,px,py,s,h);poly([px+s*.5,py+s*.08,px+s*.92,py+s*.5,px+s*.5,py+s*.92,px+s*.08,py+s*.5],'#b8a27a');line(px+s*.5,py+s*.08,px+s*.5,py+s*.92,'#7a6440',Math.max(1,s*.04));break;
    case 'well':base(T[ID.cobble],px,py,s,h);dot(px+s/2,py+s/2,s*.4,'#77736b');dot(px+s/2,py+s/2,s*.26,'#2c4a66');break;
    case 'grave':base(t,px,py,s,h);ctx.fillStyle='#8a8780';ctx.fillRect(px+s*.3,py+s*.3,s*.4,s*.3);dot(px+s*.5,py+s*.3,s*.2,'#8a8780');ctx.fillStyle='rgba(60,50,40,.5)';ctx.fillRect(px+s*.32,py+s*.62,s*.36,s*.25);break;
    case 'fence':{base(t,px,py,s,h);const vert=(getK(x,y-1)==='fence'||getK(x,y+1)==='fence')&&!(getK(x-1,y)==='fence'||getK(x+1,y)==='fence');
      if(vert){line(px+s*.45,py,px+s*.45,py+s,'#7a5a36',Math.max(1,s*.07));dot(px+s*.5,py+s*.2,s*.07,'#5a3a20');dot(px+s*.5,py+s*.8,s*.07,'#5a3a20');}
      else{line(px,py+s*.45,px+s,py+s*.45,'#7a5a36',Math.max(1,s*.07));line(px,py+s*.62,px+s,py+s*.62,'#6a4a2a',Math.max(1,s*.05));dot(px+s*.2,py+s*.52,s*.07,'#5a3a20');dot(px+s*.8,py+s*.52,s*.07,'#5a3a20');}break;}
    case 'mast':base(T[ID.wood],px,py,s,h);ctx.fillStyle='#d9c9a0';ctx.fillRect(px+s*.05,py+s*.38,s*.9,s*.24);dot(px+s/2,py+s/2,s*.12,'#5a3a20');break;
    case 'crates':base(F,px,py,s,h);ctx.fillStyle='#8a6236';ctx.fillRect(px+s*.1,py+s*.15,s*.4,s*.4);ctx.strokeStyle='#4a3018';ctx.lineWidth=Math.max(1,s*.03);ctx.strokeRect(px+s*.1,py+s*.15,s*.4,s*.4);dot(px+s*.7,py+s*.65,s*.2,'#6e4a26');ring(px+s*.7,py+s*.65,s*.14,'#3a2614',Math.max(1,s*.03));break;
    case 'metal':{base(t,px,py,s,h);ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=Math.max(1,s*.03);ctx.strokeRect(px+.5,py+.5,s-1,s-1);ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(px,py,s,s*.08);
      for(const[a,b]of[[.12,.12],[.88,.12],[.12,.88],[.88,.88]])dot(px+s*a,py+s*b,s*.035,'#8a929c');break;}
    case 'metalwall':base(t,px,py,s,h);ctx.fillStyle='#3a404a';ctx.fillRect(px,py,s,s*.16);ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(px,py+s*.84,s,s*.16);dot(px+s*.2,py+s*.5,s*.05,'#6a727c');dot(px+s*.8,py+s*.5,s*.05,'#6a727c');break;
    case 'glasswall':base(T[ID.metal],px,py,s,h);ctx.fillStyle='rgba(110,180,205,.6)';ctx.fillRect(px,py,s,s);line(px+s*.15,py+s*.85,px+s*.85,py+s*.15,'rgba(235,250,255,.75)',lw);line(px+s*.45,py+s*.9,px+s*.9,py+s*.45,'rgba(235,250,255,.4)',lw);break;
    case 'elevator':case 'elevatoro':case 'gilded':{base(T[ID.metal],px,py,s,h);const o=t.k==='elevatoro';ctx.fillStyle=o?'#16191e':t.k==='gilded'?'#d4af37':'#8d959f';ctx.fillRect(px+s*.06,py+s*.06,s*.88,s*.88);
      if(!o){line(px+s*.5,py+s*.06,px+s*.5,py+s*.94,'rgba(0,0,0,.45)',lw);ctx.fillStyle='rgba(255,255,255,.2)';ctx.fillRect(px+s*.06,py+s*.06,s*.88,s*.1);}break;}
    case 'elight':case 'plight':{base(T[ID.metalwall],px,py,s,h);const c=t.k==='plight'?'#eef6ff':'#ff3a2a';dot(px+s*.5,py+s*.5,s*.4,rgbaHex(c,.25));dot(px+s*.5,py+s*.5,s*.15,c);break;}
    case 'camera':base(T[ID.metalwall],px,py,s,h);ctx.fillStyle='#14161a';ctx.fillRect(px+s*.28,py+s*.38,s*.44,s*.24);dot(px+s*.68,py+s*.5,s*.07,'#ff2020');break;
    case 'screen':base(T[ID.metalwall],px,py,s,h);ctx.fillStyle='#d8ecff';ctx.fillRect(px+s*.12,py+s*.12,s*.76,s*.76);ctx.fillStyle='rgba(110,160,215,.55)';ctx.fillRect(px+s*.12,py+s*.12,s*.76,s*.2);break;
    case 'desk':base(T[ID.metal],px,py,s,h);ctx.fillStyle='#7a5e44';ctx.fillRect(px+s*.08,py+s*.2,s*.84,s*.55);ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(px+s*.08,py+s*.2,s*.84,s*.08);dot(px+s*.3,py+s*.47,s*.07,'#c8c0a8');break;
    case 'terminal':base(T[ID.metal],px,py,s,h);ctx.fillStyle='#4a4d52';ctx.fillRect(px+s*.1,py+s*.22,s*.8,s*.56);dot(px+s*.5,py+s*.44,s*.34,'rgba(70,212,131,.22)');ctx.fillStyle='#1d2a22';ctx.beginPath();ctx.ellipse(px+s*.5,py+s*.42,s*.24,s*.16,0,0,TAU);ctx.fill();
      ctx.fillStyle='#6aff9a';ctx.fillRect(px+s*.36,py+s*.37,s*.2,s*.035);ctx.fillRect(px+s*.36,py+s*.44,s*.13,s*.035);ctx.fillStyle='#2a2d32';ctx.fillRect(px+s*.22,py+s*.64,s*.56,s*.08);break;
    case 'seats':base(T[ID.metal],px,py,s,h);for(const a of[.12,.56]){ctx.fillStyle='#4a6a9a';ctx.fillRect(px+s*a,py+s*.25,s*.32,s*.44);ctx.fillStyle='#34507a';ctx.fillRect(px+s*a,py+s*.25,s*.32,s*.12);}break;
    case 'cryopod':base(T[ID.metal],px,py,s,h);ctx.fillStyle='#c8d0d8';ctx.beginPath();ctx.ellipse(px+s*.5,py+s*.5,s*.3,s*.45,0,0,TAU);ctx.fill();ctx.fillStyle='rgba(127,208,255,.9)';ctx.beginPath();ctx.ellipse(px+s*.5,py+s*.5,s*.2,s*.33,0,0,TAU);ctx.fill();ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(px+s*.4,py+s*.26,s*.05,s*.4);break;
    case 'machine':base(T[ID.metal],px,py,s,h);dot(px+s*.5,py+s*.5,s*.45,'#6a3a18');dot(px+s*.5,py+s*.5,s*.37,'#b87333');dot(px+s*.42,py+s*.42,s*.15,'#e8a868');dot(px+s*.5,py+s*.5,s*.08,'#3a2010');break;
    case 'lockers':base(T[ID.metal],px,py,s,h);for(let i=0;i<3;i++){ctx.fillStyle=i%2?'#6a7a86':'#7a8a96';ctx.fillRect(px+s*(.04+i*.31),py+s*.1,s*.29,s*.8);dot(px+s*(.25+i*.31),py+s*.5,s*.03,'#2a2d32');}break;
    case 'booth':base(T[ID.metal],px,py,s,h);ctx.fillStyle='#3a4048';ctx.fillRect(px+s*.1,py+s*.1,s*.8,s*.8);ctx.fillStyle='#8a2a2a';ctx.fillRect(px+s*.32,py+s*.42,s*.36,s*.34);dot(px+s*.5,py+s*.34,s*.18,'#5aa06a');dot(px+s*.5,py+s*.34,s*.09,'#9aff9a');break;
    case 'speaker':base(T[ID.metal],px,py,s,h);ctx.fillStyle='#24242a';ctx.fillRect(px+s*.2,py+s*.15,s*.6,s*.7);dot(px+s*.5,py+s*.38,s*.14,'#55585e');dot(px+s*.5,py+s*.66,s*.1,'#55585e');break;
    default:base(t,px,py,s,h);
  }
}
function initials(n){const w=n.trim().split(/\s+/).filter(Boolean);if(!w.length)return'?';if(w.length>1)return(w[0][0]+w[1][0]).toUpperCase();return w[0][0].toUpperCase();}
const imgCache=new Map();
function getImg(src){let im=imgCache.get(src);if(!im){im=new Image();im.onload=()=>{draw();refreshPrev();};im.src=src;imgCache.set(src,im);}return im.complete&&im.naturalWidth?im:null;}
const shadeCache=new Map();
function shade(hex,f){if(typeof hex!=='string')hex='#808080';const k=hex+f;let v=shadeCache.get(k);if(!v){let r,g,b;if(hex[0]==='#'){const n=parseInt(hex.slice(1,7),16);r=n>>16;g=(n>>8)&255;b=n&255;}else{const m=hex.match(/\d+/g)||[128,128,128];r=+m[0];g=+m[1];b=+m[2];}
  if(f>1){const a=f-1;r+=(255-r)*a;g+=(255-g)*a;b+=(255-b)*a;}else{r*=f;g*=f;b*=f;}v=`rgb(${r|0},${g|0},${b|0})`;shadeCache.set(k,v);}return v;}
function ell(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,TAU);ctx.fill();}
function face(t,cx,cy,r){
  const im=t.img&&getImg(t.img);
  if(im){ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.clip();ctx.drawImage(im,cx-r,cy-r,r*2,r*2);ctx.restore();}
  else if(t.icon&&r>=3.5){dot(cx,cy,r*.95,'rgba(255,255,255,.2)');ctx.font=`${Math.round(r*1.25)}px ${EMOJI}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#000';ctx.fillText(t.icon,cx,cy+r*.08);}
  else if(r>=4.5){ctx.font=`700 ${Math.round(r*.95)}px "Alegreya Sans",system-ui,sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.55)';ctx.fillStyle='#fff';const ini=initials(t.name);ctx.strokeText(ini,cx,cy+1);ctx.fillText(ini,cx,cy+1);}
}
function tokenFace(t,cx,cy,r){dot(cx,cy,r,t.color);face(t,cx,cy,r*.9);ring(cx,cy,r,t.kind==='hero'?'#f4ecda':'#15171b',Math.max(1.5,r*.12));}
function badges(t,cx,cy,r){
  if(!t.conds.length||r<7)return;const br=Math.max(6,Math.min(12,r*.34));
  t.conds.slice(0,4).forEach((c,i)=>{const a=-Math.PI/2+.25+i*.62,bx=cx+Math.cos(a)*r,by=cy+Math.sin(a)*r;
    dot(bx,by,br,'rgba(15,17,22,.9)');ctx.font=`${Math.round(br*1.25)}px ${EMOJI}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#000';ctx.fillText(CONDMAP[c]||'•',bx,by+br*.08);});
}
function hpBar(t,cx,y,w,up){
  if(!(t.hpMax>0&&(mode==='dm'||t.kind==='hero')&&view.cs>=10))return 0;
  const hh=Math.max(3,Math.min(6,view.cs*.12)),f=Math.max(0,Math.min(1,t.hp/t.hpMax)),yy=up?y-hh:y;w=Math.max(16,w);
  ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(cx-w/2-1,yy-1,w+2,hh+2);ctx.fillStyle=f>.5?'#5fae6b':f>.25?'#e0b03a':'#d94a3a';ctx.fillRect(cx-w/2,yy,w*f,hh);return hh+3;
}
function nameTag(t,cx,y){if(view.cs<20)return;ctx.font=`500 ${Math.max(10,Math.round(Math.min(view.cs,40)*.32))}px "Alegreya Sans",system-ui,sans-serif`;ctx.textAlign='center';ctx.textBaseline='top';
  ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(t.name,cx,y);ctx.fillStyle='#f4ecda';ctx.fillText(t.name,cx,y);}
function drawToken(t,alpha){
  t._box=null;
  const cs=view.cs,n=SZ(t),cx=(t.x+n/2)*cs,cy=(t.y+n/2)*cs,r=Math.max(2.5,n*cs*.42);
  ctx.globalAlpha=alpha;
  dot(cx+1.5,cy+2.5,r,'rgba(0,0,0,.45)');
  if(t.id===selId)ring(cx,cy,r+4,'#f0b443',3);
  tokenFace(t,cx,cy,r);
  if(t.kind==='creature')ring(cx,cy,r+Math.max(1.5,r*.12)/2+1,'rgba(244,236,218,.5)',1);
  if(t.hidden&&mode==='dm'){ctx.setLineDash([4,3]);ring(cx,cy,r+6,'#f0c674',1.5);ctx.setLineDash([]);}
  if(t.hpMax>0&&t.hp<=0){ctx.lineWidth=Math.max(2,r*.16);ctx.strokeStyle='rgba(160,20,20,.85)';ctx.beginPath();ctx.moveTo(cx-r*.6,cy-r*.6);ctx.lineTo(cx+r*.6,cy+r*.6);ctx.moveTo(cx+r*.6,cy-r*.6);ctx.lineTo(cx-r*.6,cy+r*.6);ctx.stroke();}
  badges(t,cx,cy,r);
  let ly=cy+r+3;ly+=hpBar(t,cx,ly,r*2,false);nameTag(t,cx,ly);
  ctx.globalAlpha=1;
}
// A standing 3D miniature: a round base with a curved-top standee on it.
function drawMini(t,alpha){
  const s=view.cs,n=SZ(t),r=Math.max(3,n*s*.42),cx=(t.x+n/2)*s,gy=(t.y+n/2)*s+r*.25;
  const bw=r*1.05,bh=r*.52,th=Math.max(2,r*.2),cw=r*1.5,ch=r*(1.75+prefs.wallH*1.9),rr=cw/2;
  const down=t.hpMax>0&&t.hp<=0,bottom=gy-bh*.15,top=down?gy-bh:bottom-ch;
  t._box=[(cx-Math.max(rr,bw))/s,top/s,(cx+Math.max(rr,bw))/s,(gy+bh+th)/s];
  ctx.globalAlpha=alpha;
  ell(cx+r*.3,gy+th+bh*.3,bw*1.12,bh*1.05,'rgba(0,0,0,.42)');
  if(t.id===selId){ctx.strokeStyle='#f0b443';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(cx,gy+th/2,bw+5,bh+4,0,0,TAU);ctx.stroke();}
  if(t.hidden&&mode==='dm'){ctx.setLineDash([4,3]);ctx.strokeStyle='#f0c674';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(cx,gy+th/2,bw+9,bh+7,0,0,TAU);ctx.stroke();ctx.setLineDash([]);}
  ctx.fillStyle='#121418';ctx.fillRect(cx-bw,gy,bw*2,th);ell(cx,gy+th,bw,bh,'#121418');
  ell(cx,gy,bw,bh,shade(t.color,.85));ell(cx,gy,bw*.8,bh*.76,shade(t.color,.55));ell(cx-bw*.25,gy-bh*.3,bw*.45,bh*.22,'rgba(255,255,255,.14)');
  if(down){
    face(t,cx,gy-bh*.05,Math.min(bw*.6,bh*1.1));
    ctx.lineWidth=Math.max(2,r*.14);ctx.strokeStyle='rgba(170,20,20,.9)';ctx.beginPath();
    ctx.moveTo(cx-bw*.5,gy-bh*.5);ctx.lineTo(cx+bw*.5,gy+bh*.4);ctx.moveTo(cx+bw*.5,gy-bh*.5);ctx.lineTo(cx-bw*.5,gy+bh*.4);ctx.stroke();
  }else{
    const left=cx-rr,ed=Math.max(1.5,r*.09);
    const path=ox=>{ctx.beginPath();ctx.moveTo(left+ox,bottom);ctx.lineTo(left+ox,top+rr);ctx.arc(cx+ox,top+rr,rr,Math.PI,0);ctx.lineTo(left+cw+ox,bottom);ctx.closePath();};
    path(ed);ctx.fillStyle=shade(t.color,.4);ctx.fill();
    const g=ctx.createLinearGradient(left,top,left+cw,bottom);g.addColorStop(0,shade(t.color,1.4));g.addColorStop(.5,t.color);g.addColorStop(1,shade(t.color,.65));
    path(0);ctx.fillStyle=g;ctx.fill();const bl=Math.max(1.2,r*.07);ctx.lineWidth=bl;ctx.strokeStyle=t.kind==='hero'?'#f4ecda':'#15171b';ctx.stroke();
    const fr=rr*.8,fy=top+rr;
    dot(cx,fy,fr+Math.max(1,r*.05),t.kind==='hero'?'#f4ecda':'#15171b');dot(cx,fy,fr,shade(t.color,.6));face(t,cx,fy,fr);
    const bandY=fy+fr+r*.14;if(bottom-bandY>2){ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(left+bl,bandY,cw-bl*2,bottom-bandY-bl*.5);}
    ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=Math.max(1,r*.05);ctx.beginPath();ctx.moveTo(left+cw*.15,bottom-ch*.08);ctx.lineTo(left+cw*.15,top+rr);ctx.stroke();
    ctx.fillStyle='#121418';ctx.fillRect(cx-cw*.32,bottom-th*.4,cw*.64,th*.8);
  }
  badges(t,cx+rr*.15,top+rr,rr*1.2);
  hpBar(t,cx,top-4,cw*1.1,true);
  nameTag(t,cx,gy+bh+th+2);
  ctx.globalAlpha=1;
}
function frontCol(t){return t._fr||(t._fr=t.k==='rock'?'#272b32':shade(t.f||t.c,.6));}
function drawFront(t,px,fy,s,WH,x,y){
  const k=t.k,lw=Math.max(1,s*.04);
  ctx.fillStyle=frontCol(t);ctx.fillRect(px,fy,s,WH);
  if(WH>=5){
    if(k==='wall'||k==='secret'||k==='torch'||k==='battlement'){if(k==='battlement'){ctx.fillStyle='rgba(0,0,0,.35)';for(let i=0;i<2;i++)ctx.fillRect(px+s*(.18+.5*i),fy,s*.22,Math.min(WH*.15,s*.12));}ctx.strokeStyle='rgba(0,0,0,.32)';ctx.lineWidth=lw;ctx.beginPath();const rows=Math.max(1,Math.round(WH/(s*.25)));
      for(let i=1;i<rows;i++){ctx.moveTo(px,fy+WH*i/rows);ctx.lineTo(px+s,fy+WH*i/rows);}
      for(let i=0;i<rows;i++){const off=(i+x)%2?s*.5:s*.2;ctx.moveTo(px+off,fy+WH*i/rows);ctx.lineTo(px+off,fy+WH*(i+1)/rows);}ctx.stroke();
      if(k==='torch'){const cx=px+s/2,cy=fy+WH*.42;dot(cx,cy,s*.5,'rgba(255,170,60,.22)');ctx.fillStyle='#4a2f1a';ctx.fillRect(cx-s*.05,cy,s*.1,WH*.4);dot(cx,cy,s*.13,'#ff8a2a');dot(cx,cy-s*.03,s*.07,'#ffe08a');}}
    else if(k==='roof'||k==='thatch'){ctx.fillStyle=k==='roof'?'#c9b89a':'#bfa77a';ctx.fillRect(px,fy,s,WH);ctx.fillStyle=k==='roof'?'#6e2a1c':'#8a6a30';ctx.fillRect(px,fy,s,Math.min(WH*.25,s*.18));
      ctx.fillStyle='#5a3a20';ctx.fillRect(px,fy+WH-Math.max(1,s*.06),s,Math.max(1,s*.06));ctx.fillRect(px,fy,Math.max(1,s*.05),WH);
      if(WH>s*.35){const r=hash(x,y);if(r>.75){ctx.fillStyle='#5a3a20';ctx.fillRect(px+s*.32,fy+WH*.38,s*.36,WH*.62);dot(px+s*.6,fy+WH*.7,Math.max(1,s*.03),'#d9b45a');}
        else if(r>.3){const wh=Math.min(WH*.3,s*.3);ctx.fillStyle='#f0d27a';ctx.fillRect(px+s*.35,fy+WH*.4,s*.3,wh);ctx.strokeStyle='#5a3a20';ctx.lineWidth=Math.max(1,s*.03);ctx.strokeRect(px+s*.35,fy+WH*.4,s*.3,wh);}}}
    else if(k==='portcullis'){ctx.fillStyle='#14161a';ctx.fillRect(px,fy,s,WH);ctx.strokeStyle='#6a6a6a';ctx.lineWidth=Math.max(1,s*.05);ctx.beginPath();
      for(let i=1;i<5;i++){ctx.moveTo(px+s*i/5,fy);ctx.lineTo(px+s*i/5,fy+WH);}for(let i=1;i<4;i++){ctx.moveTo(px,fy+WH*i/4);ctx.lineTo(px+s,fy+WH*i/4);}ctx.stroke();}
    else if(k==='rock'||k==='cavewall'){for(let i=0;i<2;i++)ell(px+s*hash(x*3+i,y),fy+WH*(.3+.4*hash(x,y*3+i)),s*.14,WH*.18,'rgba(0,0,0,.22)');}
    else if(k==='fleshwall'||k==='eye'){ctx.strokeStyle='rgba(40,0,10,.45)';ctx.lineWidth=lw*1.5;for(let i=0;i<2;i++){const a=px+s*(.2+.6*hash(x*5+i,y));ctx.beginPath();ctx.moveTo(a,fy);ctx.quadraticCurveTo(a+s*.15,fy+WH*.5,a,fy+WH);ctx.stroke();}
      if(k==='eye'){const cx=px+s/2,cy=fy+WH*.5,ew=Math.min(s*.38,WH*.8);ell(cx,cy,ew,ew*.6,'#efe6d6');dot(cx,cy,ew*.45,'#d9a521');ell(cx,cy,ew*.12,ew*.4,'#120406');}}
    else if(k==='ribs'){ctx.fillStyle='#2b1a1d';ctx.fillRect(px,fy,s,WH);ctx.fillStyle='#e2d8bd';for(let i=0;i<2;i++)ctx.fillRect(px+s*(.18+i*.45),fy,s*.18,WH);}
    else if(k==='teethwall'){ctx.fillStyle='#3a0d14';ctx.fillRect(px,fy,s,WH);for(let i=0;i<3;i++){const a=px+s*i/3;poly([a,fy,a+s/3,fy,a+s/6,fy+WH*.85],'#e8dfca');}}
    else if(k==='door'){ctx.fillStyle='#7a4a22';ctx.fillRect(px+s*.06,fy,s*.88,WH);ctx.strokeStyle='#3e250f';ctx.lineWidth=lw;ctx.beginPath();
      for(let i=1;i<4;i++){const xx=px+s*.06+s*.88*i/4;ctx.moveTo(xx,fy);ctx.lineTo(xx,fy+WH);}ctx.stroke();dot(px+s*.76,fy+WH*.55,Math.max(1,s*.05),'#d9b45a');}
    else if(k==='memb'){ell(px+s/2,fy+WH/2,s*.46,WH*.48,'#c46a7a');line(px+s/2,fy+WH*.15,px+s/2,fy+WH*.85,'#4a1420',lw*1.5);}
    else if(k==='icewall'){ctx.fillStyle='rgba(255,255,255,.2)';ctx.fillRect(px+s*.1,fy,s*.12,WH);ctx.fillRect(px+s*.55,fy,s*.06,WH);}
    else if(k==='woodwall'){ctx.strokeStyle='#3a2616';ctx.lineWidth=lw;ctx.beginPath();for(let i=1;i<3;i++){ctx.moveTo(px+s*i/3,fy);ctx.lineTo(px+s*i/3,fy+WH);}ctx.stroke();}
  }
  ctx.fillStyle='rgba(0,0,0,.35)';const sh=Math.max(1,WH*.1);ctx.fillRect(px,fy+WH-sh,s,sh);
}
function drawBlockTop(id,x,y,px,ty,det){const t=T[id],s=view.cs;
  if(t.k==='rock'){ctx.fillStyle=hash(x,y)>.5?'#191d24':'#161a20';ctx.fillRect(px,ty,s,s);}
  else if(t.k==='door'){ctx.fillStyle='#5a3a1f';ctx.fillRect(px,ty,s,s);ctx.fillStyle='#6e4826';ctx.fillRect(px,ty,s,s*.14);}
  else if(t.k==='memb'){ctx.fillStyle='#a8505e';ctx.fillRect(px,ty,s,s);}
  else if(t.k==='eye')drawCell(ID.fleshwall,px,ty,x,y,s,det);
  else if(t.k==='torch')drawCell(ID.wall,px,ty,x,y,s,det);
  else if(t.k==='portcullis')drawCell(ID.battlement,px,ty,x,y,s,det);
  else drawCell(id,px,ty,x,y,s,det);
}
const CLIFF={grass:'#5e4a33',flowers:'#5e4a33',brush:'#5e4a33',wheat:'#7a6440',road:'#6b5338',dirt:'#5a4530',roots:'#5a4530',mud:'#4a3c2c',
  snow:'#8b9aa2',sand:'#a08454',dunes:'#a08454',shallow:'#6aa8c8',deep:'#5a98b8',swamp:'#4a6a48'};
function drawCliff(t,px,fy,s,fh,x,y){
  ctx.fillStyle=CLIFF[t.k]||shade(t.c,.62);ctx.fillRect(px,fy,s,fh);
  const step=Math.max(4,s*prefs.wallH*.5),wet=t.k==='shallow'||t.k==='deep';
  ctx.fillStyle=wet?'rgba(255,255,255,.25)':'rgba(0,0,0,.18)';
  if(wet){for(let i=0;i<3;i++)ctx.fillRect(px+s*(.15+.3*i)+hash(x+i,y)*s*.1,fy,Math.max(1,s*.04),fh);}
  else for(let yy=fy+step;yy<fy+fh-1;yy+=step)ctx.fillRect(px,yy,s,Math.max(1,s*.03));
  if(fh>=6&&!wet){ctx.fillStyle='rgba(0,0,0,.15)';ctx.fillRect(px+s*hash(x,y)*.7,fy+fh*.3,s*.15,fh*.5);}
  ctx.fillStyle='rgba(0,0,0,.3)';const sh=Math.max(1,fh*.06);ctx.fillRect(px,fy+fh-sh,s,sh);
}
function groundId(id){const g=T[id].gr;return g?ID[g]:ID.floor;}
function drawObject(id,x,y,s,WH,lift){
  const k=T[id].k,f=Math.max(.4,WH/(s*.5)),cx=x*s+s/2,gy=y*s+s*.62-(lift||0),h=hash(x,y),g=hash(x+57,y+13);
  ell(cx+s*.1,gy+s*.04,s*.42,s*.16,'rgba(0,0,0,.38)');
  switch(k){
    case 'tree':{const ox=(g-.5)*s*.15,th=s*.42*f;ctx.fillStyle='#4a3420';ctx.fillRect(cx-s*.07,gy-th,s*.14,th);
      const cy=gy-th-s*.22,R=s*(.5+.08*h),tx=cx+ox;
      for(const[dx,dy,r]of[[-.28,.05,.62],[.28,.08,.6],[0,-.22,.66],[-.12,.18,.55],[.15,.2,.5]])sblob(tx+dx*R,cy+dy*R,R*r,R*r*.9,'#2c5a2c');
      for(const[dx,dy,r]of[[-.2,-.18,.32],[.15,-.3,.28],[-.32,0,.22]])dot(tx+dx*R,cy+dy*R,R*r,'rgba(140,200,90,.35)');
      dot(tx+R*.18,cy+R*.3,R*.45,'rgba(0,20,0,.18)');break;}
    case 'pillar':{const hh=s*1.1*f,w=s*.27;ell(cx,gy,w,w*.38,'#5f5b54');
      const gr=ctx.createLinearGradient(cx-w,0,cx+w,0);gr.addColorStop(0,'#6d6a62');gr.addColorStop(.35,'#c2bdb0');gr.addColorStop(1,'#5a564f');
      ctx.fillStyle=gr;ctx.fillRect(cx-w,gy-hh,w*2,hh);ctx.fillStyle='#8a8578';ctx.fillRect(cx-w*1.18,gy-hh-w*.12,w*2.36,w*.32);ell(cx,gy-hh-w*.12,w*1.18,w*.36,'#d2cdc0');break;}
    case 'statue':{const ph=s*.28*f;ctx.fillStyle='#57534c';ctx.fillRect(cx-s*.32,gy-ph,s*.64,ph);ell(cx,gy-ph,s*.32,s*.11,'#77736a');
      ell(cx,gy-ph-s*.36*f,s*.17,s*.32*f,'#b8b3a8');dot(cx,gy-ph-s*.78*f,s*.13,'#cfcabe');ell(cx-s*.05,gy-ph-s*.42*f,s*.05,s*.18*f,'rgba(255,255,255,.2)');break;}
    case 'stalag':{for(let i=0;i<3;i++){const ox=(hash(x*3+i,y)-.5)*s*.6,w=s*(.12+.1*hash(x,y*3+i)),hh=s*(.5+.6*hash(x+i,y+i))*f,bx=cx+ox;
      poly([bx-w,gy,bx,gy,bx,gy-hh],'#8f887d');poly([bx,gy,bx+w,gy,bx,gy-hh],'#5a544c');}break;}
    case 'crystal':{dot(cx,gy-s*.4*f,s*.6,'rgba(95,182,201,.16)');
      for(const[ox,w,hh]of[[-.18,.08,.75],[.22,.07,.6],[.04,.12,1.1]]){const bx=cx+ox*s,H2=s*hh*f;poly([bx-w*s,gy,bx,gy-H2,bx,gy],'#a8e6f2');poly([bx,gy,bx,gy-H2,bx+w*s,gy],'#3f8fa3');}break;}
    case 'mushroom':{const hh=s*.55*f;ctx.fillStyle='#e8e0cc';ctx.fillRect(cx-s*.08,gy-hh,s*.16,hh);dot(cx,gy-hh,s*.6,'rgba(111,214,200,.16)');
      ctx.fillStyle='#4fb3a6';ctx.beginPath();ctx.ellipse(cx,gy-hh,s*.45,s*.32*Math.max(.6,f),0,Math.PI,0);ctx.closePath();ctx.fill();ell(cx,gy-hh,s*.45,s*.08,'#3f9488');
      for(let i=0;i<3;i++)dot(cx+(i-1)*s*.18,gy-hh-s*(.12+.06*(i%2)),s*.045,'#e8fff8');break;}
    case 'palm':{const hh=s*1.05*f,lean=(g-.5)*s*.5,tx=cx+lean,ty=gy-hh;ctx.lineCap='round';ctx.strokeStyle='#7a5a34';ctx.lineWidth=Math.max(2,s*.11);
      ctx.beginPath();ctx.moveTo(cx,gy);ctx.quadraticCurveTo(cx+lean*.2,gy-hh*.5,tx,ty);ctx.stroke();
      for(let i=0;i<7;i++){const a=i*TAU/7+h;ctx.strokeStyle=i%2?'#3f7a2e':'#5a9a3a';ctx.lineWidth=Math.max(2,s*.13);ctx.beginPath();ctx.moveTo(tx,ty);
        ctx.quadraticCurveTo(tx+Math.cos(a)*s*.3,ty+Math.sin(a)*s*.15-s*.12,tx+Math.cos(a)*s*.55,ty+Math.sin(a)*s*.3+s*.1);ctx.stroke();}
      ctx.lineCap='butt';dot(tx,ty,s*.07,'#6b4a28');break;}
    case 'deadtree':{const hh=s*.95*f;ctx.lineCap='round';line(cx,gy,cx,gy-hh,'#3a2a1a',Math.max(2,s*.12));
      for(let i=0;i<4;i++){const yy=gy-hh*(.45+i*.15),dir=i%2?1:-1;line(cx,yy,cx+dir*s*(.25+.1*hash(x+i,y)),yy-s*.2,'#3a2a1a',Math.max(1,s*.06));}ctx.lineCap='butt';break;}
    case 'boulder':{const hh=s*.45*f;ell(cx,gy-hh*.5,s*.42,hh*.7+s*.12,'#6e6a62');ell(cx-s*.08,gy-hh*.7,s*.25,hh*.4+s*.06,'#8e897f');ell(cx-s*.14,gy-hh*.85,s*.08,s*.05,'#aaa59a');break;}
    case 'tent':{const hh=s*.7*f;poly([cx-s*.45,gy,cx,gy-hh,cx+s*.45,gy],'#c9b48a');poly([cx,gy-hh,cx+s*.45,gy,cx+s*.55,gy-s*.1,cx+s*.1,gy-hh-s*.08],'#9a8460');poly([cx-s*.1,gy,cx,gy-hh*.55,cx+s*.1,gy],'#3a2a1a');break;}
    case 'well':{const w=s*.38,hh=s*.3*f;ell(cx,gy,w,w*.4,'#5a564f');ctx.fillStyle='#77736b';ctx.fillRect(cx-w,gy-hh,w*2,hh);ell(cx,gy-hh,w,w*.4,'#8a867e');ell(cx,gy-hh,w*.72,w*.28,'#2c4a66');
      line(cx-w*.85,gy-hh,cx-w*.85,gy-hh-s*.55*f,'#4a3420',Math.max(1,s*.05));line(cx+w*.85,gy-hh,cx+w*.85,gy-hh-s*.55*f,'#4a3420',Math.max(1,s*.05));
      poly([cx-w*1.15,gy-hh-s*.5*f,cx,gy-hh-s*.78*f,cx+w*1.15,gy-hh-s*.5*f],'#8a3a28');break;}
    case 'grave':{const hh=s*.38*f,w=s*.2;ctx.fillStyle='#8a8780';ctx.fillRect(cx-w,gy-hh,w*2,hh);ctx.beginPath();ctx.arc(cx,gy-hh,w,Math.PI,0);ctx.fill();
      ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(cx+w*.4,gy-hh,w*.6,hh);break;}
    case 'fence':{const hh=s*.35*f,vert=(getK(x,y-1)==='fence'||getK(x,y+1)==='fence')&&!(getK(x-1,y)==='fence'||getK(x+1,y)==='fence');
      if(vert){ctx.fillStyle='#6a4a2a';ctx.fillRect(cx-s*.05,gy-hh-s*.35,s*.1,s*.95);ctx.fillStyle='#5a3a20';ctx.fillRect(cx-s*.07,gy-hh-s*.4,s*.14,s*.1);}
      else{ctx.fillStyle='#5a3a20';ctx.fillRect(x*s+s*.1,gy-hh,s*.08,hh);ctx.fillRect(x*s+s*.82,gy-hh,s*.08,hh);ctx.fillStyle='#7a5a36';ctx.fillRect(x*s,gy-hh*.85,s,hh*.18);ctx.fillRect(x*s,gy-hh*.45,s,hh*.18);}break;}
    case 'mast':{const hh=s*2.4*f;ctx.fillStyle='#5a3a20';ctx.fillRect(cx-s*.06,gy-hh,s*.12,hh);
      for(const[yy,w]of[[.38,1.1],[.7,.85]]){const top=gy-hh*(1-yy+.28),bh=hh*.26,sw=s*w;ctx.fillStyle='#4a3020';ctx.fillRect(cx-sw*.55,top-s*.04,sw*1.1,s*.07);
        ctx.fillStyle='#e6d8b0';ctx.beginPath();ctx.moveTo(cx-sw*.5,top);ctx.lineTo(cx+sw*.5,top);ctx.quadraticCurveTo(cx+sw*.6,top+bh*.5,cx+sw*.5,top+bh);ctx.lineTo(cx-sw*.5,top+bh);ctx.quadraticCurveTo(cx-sw*.4,top+bh*.5,cx-sw*.5,top);ctx.fill();
        ctx.fillStyle='rgba(120,90,50,.25)';ctx.fillRect(cx,top,sw*.5,bh);}
      break;}
    case 'cryopod':{const hh=s*.75*f,w=s*.3;ell(cx,gy,w,w*.4,'#8a929c');ctx.fillStyle='#c8d0d8';ctx.fillRect(cx-w,gy-hh,w*2,hh);ell(cx,gy-hh,w,w*.4,'#e6ecf2');
      ctx.fillStyle='rgba(127,208,255,.9)';ctx.fillRect(cx-w*.6,gy-hh*.85,w*1.2,hh*.62);ctx.fillStyle='rgba(255,255,255,.45)';ctx.fillRect(cx-w*.45,gy-hh*.8,w*.15,hh*.5);break;}
    case 'machine':{const hh=s*.9*f,w=s*.4;ell(cx,gy,w,w*.38,'#6a3a18');const gr=ctx.createLinearGradient(cx-w,0,cx+w,0);gr.addColorStop(0,'#7a4a22');gr.addColorStop(.4,'#e8a868');gr.addColorStop(1,'#6a3a18');
      ctx.fillStyle=gr;ctx.fillRect(cx-w,gy-hh,w*2,hh);ell(cx,gy-hh,w,w*.38,'#c88a4a');ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(cx-w,gy-hh*.3,w*2,s*.04);ctx.fillRect(cx-w,gy-hh*.65,w*2,s*.04);break;}
    case 'lockers':{const hh=s*.85*f,w=s*.42;ctx.fillStyle='#6a7a86';ctx.fillRect(cx-w,gy-hh,w*2,hh);ctx.fillStyle='#8a9aa6';ctx.fillRect(cx-w,gy-hh,w*2,s*.08);
      line(cx-w*.33,gy-hh,cx-w*.33,gy,'#3a4048',Math.max(1,s*.03));line(cx+w*.33,gy-hh,cx+w*.33,gy,'#3a4048',Math.max(1,s*.03));break;}
    case 'speaker':{const hh=s*.6*f,w=s*.25;ctx.fillStyle='#222226';ctx.fillRect(cx-w,gy-hh,w*2,hh);dot(cx,gy-hh*.7,w*.5,'#55585e');dot(cx,gy-hh*.3,w*.4,'#55585e');break;}
    case 'crates':{const b=s*.36*f;ctx.fillStyle='#8a6236';ctx.fillRect(cx-s*.38,gy-b,s*.4,b);ctx.fillStyle='#a5784a';ctx.fillRect(cx-s*.38,gy-b-s*.14,s*.4,s*.14);
      ctx.strokeStyle='#4a3018';ctx.lineWidth=Math.max(1,s*.03);ctx.strokeRect(cx-s*.38,gy-b,s*.4,b);
      const bx=cx+s*.2;ell(bx,gy,s*.17,s*.07,'#4e3420');ctx.fillStyle='#6e4a26';ctx.fillRect(bx-s*.17,gy-b*1.1,s*.34,b*1.1);ell(bx,gy-b*1.1,s*.17,s*.07,'#8a5e30');break;}
  }
}
/* ================= sculpted creature models ================= */
// Each model is painted like a miniature: rounded, lit from the upper left, standing on its base.
function rgbaHex(h,a){const n=parseInt(h.slice(1),16);return`rgba(${n>>16},${(n>>8)&255},${n&255},${a})`;}
function sblob(x,y,rx,ry,c,rot){rx=Math.max(.5,rx);ry=Math.max(.5,ry);const g=ctx.createRadialGradient(x-rx*.35,y-ry*.45,Math.min(rx,ry)*.1,x,y,Math.max(rx,ry)*1.15);
  g.addColorStop(0,shade(c,1.5));g.addColorStop(.45,c);g.addColorStop(1,shade(c,.42));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot||0,0,TAU);ctx.fill();}
function limb(x1,y1,x2,y2,w,c){w=Math.max(.8,w);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
  ctx.strokeStyle=shade(c,.45);ctx.lineWidth=w+Math.max(1,w*.3);ctx.stroke();ctx.strokeStyle=c;ctx.lineWidth=w;ctx.stroke();
  ctx.strokeStyle=shade(c,1.45);ctx.lineWidth=Math.max(.5,w*.28);ctx.beginPath();ctx.moveTo(x1-w*.2,y1-w*.1);ctx.lineTo(x2-w*.2,y2-w*.1);ctx.stroke();ctx.lineCap='butt';}
function tube(pts,w0,w1,c){ctx.lineCap='round';for(let pass=0;pass<3;pass++){for(let i=1;i<pts.length;i++){const w=Math.max(.8,w0+(w1-w0)*i/(pts.length-1));
  ctx.strokeStyle=pass===0?shade(c,.45):pass===1?c:shade(c,1.4);ctx.lineWidth=pass===0?w+1.5:pass===1?w:w*.25;ctx.beginPath();
  const o=pass===2?-w*.2:0;ctx.moveTo(pts[i-1][0]+o,pts[i-1][1]+o);ctx.lineTo(pts[i][0]+o,pts[i][1]+o);ctx.stroke();}}ctx.lineCap='butt';}
function eyes2(x,y,d,r,c){dot(x-d,y,r,c||'#141014');dot(x+d,y,r,c||'#141014');}
function glowEyes(x,y,d,r,c){ctx.save();ctx.globalCompositeOperation='lighter';dot(x-d,y,r*2.6,rgbaHex(c,.35));dot(x+d,y,r*2.6,rgbaHex(c,.35));ctx.restore();dot(x-d,y,r,c);dot(x+d,y,r,c);}
function wing(x,y,d,s,c,flap,bat){ctx.fillStyle=shade(c,.85);ctx.strokeStyle=shade(c,.45);ctx.lineWidth=Math.max(1,s*.035);ctx.beginPath();ctx.moveTo(x,y);
  const tx=x+d*s*1.15,ty=y-s*(.85-flap*.5);ctx.lineTo(tx,ty);
  if(bat){for(let i=1;i<=3;i++){const px=x+d*s*(1.15-i*.3),py=y+s*(.15+i*.08)-flap*s*.2*(1-i/4);ctx.quadraticCurveTo(px+d*s*.12,py-s*.25,px,py);}}
  else{ctx.lineTo(x+d*s*1.05,y-s*.2-flap*s*.2);ctx.lineTo(x+d*s*.75,y+s*.15);}
  ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(tx,ty);ctx.strokeStyle=shade(c,.6);ctx.lineWidth=Math.max(1,s*.06);ctx.stroke();}
function prop(k,x,y,s,t,sd){
  switch(k){
    case 'sword':line(x,y,x+s*.12,y-s*.85,'#3a3f48',s*.09);line(x,y,x+s*.12,y-s*.85,'#e3e7ec',s*.06);line(x-s*.12,y-s*.06,x+s*.14,y-s*.02,'#c9a03d',s*.06);break;
    case 'dagger':line(x,y,x+s*.08,y-s*.4,'#e3e7ec',s*.05);line(x-s*.07,y-s*.04,x+s*.08,y-s*.02,'#6b4a2a',s*.05);break;
    case 'axe':line(x,y+s*.1,x+s*.05,y-s*.8,'#6b4a2a',s*.06);poly([x+s*.04,y-s*.78,x+s*.3,y-s*.88,x+s*.32,y-s*.5,x+s*.05,y-s*.6],'#c8ccd2');break;
    case 'spear':line(x-s*.05,y+s*.3,x+s*.1,y-s*1.1,'#6b4a2a',s*.05);poly([x+s*.06,y-s*1.05,x+s*.14,y-s*1.05,x+s*.12,y-s*1.3],'#d9dde2');break;
    case 'club':line(x,y,x+s*.1,y-s*.55,'#6b4a2a',s*.12);sblob(x+s*.12,y-s*.62,s*.13,s*.16,'#7a5634');break;
    case 'mace':line(x,y,x+s*.06,y-s*.5,'#6b4a2a',s*.05);sblob(x+s*.07,y-s*.56,s*.1,s*.1,'#aab0b8');break;
    case 'hammer':line(x,y,x+s*.05,y-s*.6,'#6b4a2a',s*.06);ctx.fillStyle='#8a8f96';ctx.fillRect(x-s*.12,y-s*.72,s*.32,s*.16);break;
    case 'bow':ctx.strokeStyle='#7a5634';ctx.lineWidth=Math.max(1,s*.05);ctx.beginPath();ctx.arc(x-s*.25,y-s*.15,s*.5,-1,1);ctx.stroke();
      line(x-s*.25+Math.cos(-1)*s*.5,y-s*.15+Math.sin(-1)*s*.5,x-s*.25+Math.cos(1)*s*.5,y-s*.15+Math.sin(1)*s*.5,'rgba(240,240,230,.7)',1);break;
    case 'staff':line(x,y+s*.55,x+s*.06,y-s*.95,'#6b4a2a',s*.06);{const gx=x+s*.07,gy=y-s*1.02;ctx.save();ctx.globalCompositeOperation='lighter';dot(gx,gy,s*.22*(1+.15*Math.sin(t*.004+sd)),'rgba(120,200,255,.35)');ctx.restore();dot(gx,gy,s*.08,'#bfe8ff');}break;
    case 'leafstaff':line(x,y+s*.55,x+s*.06,y-s*.95,'#5a3a20',s*.06);for(let i=0;i<3;i++)ell(x+s*(.02+i*.06),y-s*(.9+i*.05),s*.1,s*.05,'#5a9a3a');break;
    case 'orb':{const gx=x+s*.05,gy=y-s*.18;ctx.save();ctx.globalCompositeOperation='lighter';dot(gx,gy,s*.25*(1+.2*Math.sin(t*.005+sd)),'rgba(200,120,255,.35)');ctx.restore();sblob(gx,gy,s*.1,s*.1,'#c08cff');break;}
    case 'holy':{ctx.save();ctx.globalCompositeOperation='lighter';dot(x+s*.05,y-s*.2,s*.22,'rgba(255,220,120,.35)');ctx.restore();dot(x+s*.05,y-s*.2,s*.07,'#ffe08a');line(x,y,x+s*.05,y-s*.5,'#6b4a2a',s*.05);break;}
    case 'lute':sblob(x-s*.1,y-s*.05,s*.16,s*.2,'#a0703a',-.6);line(x-s*.05,y-s*.15,x+s*.22,y-s*.55,'#5a3a20',s*.05);break;
    case 'torch':line(x,y,x+s*.04,y-s*.4,'#5a3a20',s*.06);ctx.save();ctx.globalCompositeOperation='lighter';dot(x+s*.04,y-s*.48,s*.14*(1+.15*Math.sin(t*.02+sd)),'rgba(255,170,60,.7)');ctx.restore();break;
  }
}
function mHum(cx,gy,u,p,t,sd){
  const s=u*1.15*(p.scale||1),b=Math.sin(t*.0025+sd)*s*.02,bo=p.body||'#7a8490',sk=p.bone?'#e6dcc4':(p.skin||'#d8a57a'),le=p.legs||shade(bo,.7),hu=p.hunch?s*.14:0;
  const hip=gy-s*.78,sh=gy-s*1.42+b+hu*.5,hx=cx+hu,hy=gy-s*1.8+b+hu;
  if(p.wings){const f=Math.sin(t*.004+sd);wing(cx-s*.1,sh,-1,s*.85,p.wings,f*.3);wing(cx+s*.1,sh,1,s*.85,p.wings,f*.3);}
  if(p.tail)tube([[cx-s*.1,hip],[cx-s*.5,hip+s*.2],[cx-s*.7+Math.sin(t*.003+sd)*s*.1,hip-s*.1]],s*.08,s*.03,sk);
  if(p.cape){const sw=Math.sin(t*.002+sd)*s*.05,g=ctx.createLinearGradient(cx-s*.5,0,cx+s*.5,0);g.addColorStop(0,shade(p.cape,1.2));g.addColorStop(1,shade(p.cape,.5));ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(cx-s*.34,sh);ctx.lineTo(cx+s*.34,sh);ctx.lineTo(cx+s*.52+sw,gy-s*.08);ctx.quadraticCurveTo(cx,gy,cx-s*.52+sw,gy-s*.08);ctx.closePath();ctx.fill();}
  if(p.robe){const g=ctx.createLinearGradient(cx-s*.5,0,cx+s*.5,0);g.addColorStop(0,shade(bo,1.35));g.addColorStop(.5,bo);g.addColorStop(1,shade(bo,.5));ctx.fillStyle=g;ctx.beginPath();
    ctx.moveTo(cx-s*.3,sh+s*.08);ctx.lineTo(cx+s*.3,sh+s*.08);ctx.lineTo(cx+s*.5,gy-s*.03);ctx.quadraticCurveTo(cx,gy+s*.07,cx-s*.5,gy-s*.03);ctx.closePath();ctx.fill();
    ctx.strokeStyle=shade(bo,.45);ctx.lineWidth=Math.max(1,s*.03);ctx.beginPath();ctx.moveTo(cx,sh+s*.2);ctx.lineTo(cx+s*.05,gy-s*.05);ctx.stroke();}
  else{const lw=s*(p.thin?.1:.2);limb(cx-s*.16,hip,cx-s*.2,gy-s*.07,lw,p.bone?sk:le);limb(cx+s*.16,hip,cx+s*.22,gy-s*.07,lw,p.bone?sk:le);
    ell(cx-s*.22,gy-s*.04,lw*.85,lw*.45,shade(p.bone?sk:le,.45));ell(cx+s*.25,gy-s*.04,lw*.85,lw*.45,shade(p.bone?sk:le,.45));}
  if(p.bone){ctx.strokeStyle=sk;ctx.lineWidth=Math.max(1,s*.05);for(let i=0;i<4;i++){const yy=sh+s*(.12+i*.11);ctx.beginPath();ctx.ellipse(cx,yy,s*(.26-i*.03),s*.06,0,Math.PI*.05,Math.PI*.95);ctx.stroke();}
    line(cx,sh,cx,hip,sk,Math.max(1,s*.06));ell(cx,hip,s*.18,s*.07,shade(sk,.8));}
  else{sblob(cx+hu*.3,(hip+sh)/2+s*.02,s*(p.bulk||.34),s*.44,bo);if(!p.robe){ctx.fillStyle=shade(bo,.4);ctx.fillRect(cx-s*.3,hip-s*.1,s*.6,s*.08);dot(cx,hip-s*.06,s*.04,'#c9a03d');}}
  const aw=s*(p.thin?.09:.15),la=[cx-s*.5,gy-s*.9+b],ra=[cx+s*.54,gy-s*.95+b];
  limb(cx-s*.32,sh+s*.06,la[0],la[1],aw,p.bone?sk:(p.arms||bo));limb(cx+s*.32,sh+s*.06,ra[0],ra[1],aw,p.bone?sk:(p.arms||bo));
  dot(la[0],la[1],aw*.65,sk);dot(ra[0],ra[1],aw*.65,sk);
  sblob(cx-s*.32,sh+s*.04,aw*.9,aw*.8,p.bone?sk:bo);sblob(cx+s*.32,sh+s*.04,aw*.9,aw*.8,p.bone?sk:bo);
  if(p.weapon)prop(p.weapon,ra[0],ra[1],s,t,sd);
  if(p.shield){sblob(la[0]-s*.04,la[1]-s*.1,s*.22,s*.28,p.shield);ctx.strokeStyle=shade(p.shield,1.6);ctx.lineWidth=Math.max(1,s*.04);ctx.beginPath();ctx.ellipse(la[0]-s*.04,la[1]-s*.1,s*.18,s*.24,0,0,TAU);ctx.stroke();}
  if(p.ears)for(const d of[-1,1])poly([hx+d*s*.18,hy,hx+d*s*.46,hy-s*.16,hx+d*s*.2,hy+s*.09],shade(sk,.85));
  if(p.hat==='snakes')for(let i=0;i<6;i++){const a=-Math.PI*(.1+.8*i/5);tube([[hx,hy-s*.1],[hx+Math.cos(a)*s*.3,hy-s*.1+Math.sin(a)*s*.3],[hx+Math.cos(a+.4*Math.sin(t*.004+i))*s*.45,hy+Math.sin(a)*s*.42]],s*.06,s*.03,'#5a8a3a');}
  sblob(hx,hy,s*.24,s*.25,sk);
  if(p.snout)sblob(hx+s*.12,hy+s*.08,s*.14,s*.1,shade(sk,.9));
  if(p.bone){dot(hx-s*.08,hy-s*.02,s*.06,'#120c08');dot(hx+s*.08,hy-s*.02,s*.06,'#120c08');ctx.fillStyle='#120c08';ctx.fillRect(hx-s*.08,hy+s*.12,s*.16,s*.03);if(p.glow)glowEyes(hx,hy-s*.02,s*.08,s*.025,p.glow);}
  else if(p.cyclops){dot(hx,hy-s*.03,s*.09,'#f4efe4');dot(hx,hy-s*.03,s*.045,'#2a1a10');}
  else if(p.glow)glowEyes(hx+s*.03,hy-s*.02,s*.08,s*.035,p.glow);else eyes2(hx+s*.04,hy-s*.02,s*.075,s*.032);
  if(p.tusks){poly([hx-s*.09,hy+s*.14,hx-s*.05,hy+s*.04,hx-s*.13,hy+s*.06],'#f0e8d0');poly([hx+s*.09,hy+s*.14,hx+s*.05,hy+s*.04,hx+s*.13,hy+s*.06],'#f0e8d0');}
  if(p.beard){ctx.fillStyle=p.beard;ctx.beginPath();ctx.moveTo(hx-s*.2,hy+s*.04);ctx.quadraticCurveTo(hx,hy+s*.12,hx+s*.2,hy+s*.04);ctx.lineTo(hx+s*.02,hy+s*.48);ctx.closePath();ctx.fill();}
  if(p.tentaface)for(let i=0;i<4;i++)tube([[hx-s*.1+i*s*.07,hy+s*.12],[hx-s*.12+i*s*.08+Math.sin(t*.004+i)*s*.05,hy+s*.35]],s*.05,s*.02,sk);
  const hc=p.hatc||shade(bo,.85);
  switch(p.hat){
    case 'wizard':poly([hx-s*.36,hy-s*.13,hx+s*.36,hy-s*.13,hx+s*.12,hy-s*.95],hc);ell(hx,hy-s*.13,s*.38,s*.08,shade(hc,.7));break;
    case 'hood':ctx.fillStyle=hc;ctx.beginPath();ctx.arc(hx,hy,s*.31,Math.PI*1.05,Math.PI*1.95);ctx.lineTo(hx+s*.32,hy+s*.22);ctx.lineTo(hx-s*.32,hy+s*.22);ctx.closePath();ctx.fill();
      ell(hx,hy+s*.04,s*.17,s*.15,'rgba(0,0,0,.5)');if(p.glow)glowEyes(hx+s*.02,hy+s*.02,s*.07,s*.03,p.glow);break;
    case 'helm':sblob(hx,hy-s*.06,s*.27,s*.24,'#9aa3ad');ctx.fillStyle='#16181c';ctx.fillRect(hx-s*.17,hy-s*.03,s*.34,s*.05);line(hx,hy-s*.3,hx,hy+s*.05,'#6b7680',Math.max(1,s*.04));break;
    case 'horns':for(const d of[-1,1]){ctx.strokeStyle='#e8dcc0';ctx.lineWidth=Math.max(1,s*.08);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(hx+d*s*.15,hy-s*.16);ctx.quadraticCurveTo(hx+d*s*.42,hy-s*.28,hx+d*s*.3,hy-s*.56);ctx.stroke();ctx.lineCap='butt';}break;
    case 'crown':poly([hx-s*.2,hy-s*.18,hx-s*.2,hy-s*.38,hx-s*.1,hy-s*.27,hx,hy-s*.42,hx+s*.1,hy-s*.27,hx+s*.2,hy-s*.38,hx+s*.2,hy-s*.18],'#e0b84a');break;
    case 'feather':ell(hx,hy-s*.18,s*.3,s*.08,hc);sblob(hx,hy-s*.25,s*.18,s*.1,hc);line(hx+s*.1,hy-s*.28,hx+s*.35,hy-s*.6,'#e8e0d0',Math.max(1,s*.05));break;
  }
  if(p.heads===2){sblob(hx-s*.42,hy+s*.05,s*.2,s*.21,sk);eyes2(hx-s*.38,hy+s*.03,s*.06,s*.028);}
}
function mQuad(cx,gy,u,p,t,sd){
  const s=u*1.1*(p.scale||1),c=p.body||'#8a8a8a',hc=p.head||c,b=Math.sin(t*.0025+sd)*s*.02,L_=p.long||1,by=gy-s*(p.tall||.62)+b,lw=s*(p.legw||.16);
  const ts=Math.sin(t*.004+sd)*s*.14;
  if(p.wings){const f=Math.sin(t*.005+sd);wing(cx,by-s*.2,-1,s*.95,p.wingc||shade(c,.8),f*.35,p.bat);}
  tube([[cx-s*.6*L_,by-s*.05],[cx-s*.92*L_,by-s*.18+ts],[cx-s*1.1*L_,by-s*.02+ts*1.4]],s*(p.tailw||.12),s*.04,p.tailc||c);
  for(const x of[-.45,.4])limb(cx+s*x*L_+s*.07,by,cx+s*x*L_+s*.1,gy-s*.07,lw,shade(c,.68));
  sblob(cx,by,s*.68*L_,s*(p.bodyh||.36),c);
  if(p.shell){sblob(cx-s*.05,by-s*.15,s*.6*L_,s*.38,p.shell);ctx.strokeStyle=shade(p.shell,.5);ctx.lineWidth=Math.max(1,s*.03);for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(cx+i*s*.25,by-s*.5);ctx.lineTo(cx+i*s*.3,by+s*.05);ctx.stroke();}}
  if(p.spots)for(let i=0;i<5;i++)dot(cx+s*(-.4+i*.2)*L_,by-s*(.05+.1*(i%2)),s*.05,shade(c,.55));
  if(p.mane)sblob(cx+s*.42*L_,by-s*.12,s*.28,s*.3,p.mane);
  for(const x of[-.52,.45])limb(cx+s*x*L_,by+s*.08,cx+s*x*L_+s*.02,gy-s*.06,lw,c);
  if(p.wings){const f=Math.sin(t*.005+sd);wing(cx+s*.1,by-s*.25,1,s*.95,p.wingc||shade(c,.8),f*.35,p.bat);}
  const nk=p.neck||.3,hx=cx+s*(.7*L_+nk*.25),hy=by-s*nk;
  if(nk>.35)tube([[cx+s*.45*L_,by-s*.05],[cx+s*(.6*L_+nk*.1),by-s*nk*.6],[hx,hy]],s*.22,s*.17,c);
  sblob(hx,hy,s*.25,s*.23,hc);
  if(p.beak)poly([hx+s*.18,hy-s*.06,hx+s*.42,hy+s*.04,hx+s*.18,hy+s*.12],'#d9a521');
  else{sblob(hx+s*.22,hy+s*.06,s*(p.snout||.16),s*.11,shade(hc,.92));dot(hx+s*(.22+(p.snout||.16)*.95),hy+s*.03,s*.035,'#111');}
  if(p.ears==='point')for(const d of[-.1,.07])poly([hx+d*s,hy-s*.14,hx+d*s+s*.07,hy-s*.42,hx+d*s+s*.15,hy-s*.12],shade(hc,.75));
  else if(p.ears==='round')for(const d of[-.12,.1])sblob(hx+d*s,hy-s*.2,s*.08,s*.08,shade(hc,.8));
  if(p.horns)for(const d of[-.08,.06]){ctx.strokeStyle='#e8dcc0';ctx.lineWidth=Math.max(1,s*.06);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(hx+d*s,hy-s*.16);ctx.quadraticCurveTo(hx+d*s-s*.2,hy-s*.4,hx+d*s-s*.32,hy-s*.38);ctx.stroke();ctx.lineCap='butt';}
  if(p.horn)poly([hx+s*.02,hy-s*.18,hx+s*.12,hy-s*.16,hx+s*.18,hy-s*.6],'#f0e0a0');
  if(p.tusks)poly([hx+s*.3,hy+s*.12,hx+s*.24,hy+s*.08,hx+s*.42,hy+s*.3],'#f0e8d0');
  dot(hx+s*.07,hy-s*.06,s*.04,p.eyec||'#111');if(p.eyec){ctx.save();ctx.globalCompositeOperation='lighter';dot(hx+s*.07,hy-s*.06,s*.1,rgbaHex(p.eyec,.35));ctx.restore();}
  if(p.spikes)for(let i=0;i<5;i++)poly([cx+s*(-.45+i*.22)*L_,by-s*.32,cx+s*(-.38+i*.22)*L_,by-s*.55,cx+s*(-.3+i*.22)*L_,by-s*.32],shade(c,.6));
}
function mDragon(cx,gy,u,p,t,sd){
  const q=Object.assign({long:1.25,neck:.75,tailw:.16,legw:.17,horns:1,spikes:1,wings:p.wings!==0,wingc:p.wingc||shade(p.body||'#b5392f',.75),eyec:p.eyec||'#ffd040',snout:.2},p);
  mQuad(cx,gy,u*1.05,q,t,sd);
  if(p.breath!==0){const s=u*1.15,ph=(t*.0006+sd)%1;if(ph<.18){const hx=cx+s*(.7*1.25+.19)+s*.3,hy=gy-s*.62-s*.75;ctx.save();ctx.globalCompositeOperation='lighter';
    for(let i=0;i<6;i++){const k=(ph/.18+i/6)%1,x=hx+k*s*1.2,y=hy+k*s*.3,r=s*(.08+k*.25);dot(x,y,r,`rgba(255,${150-k*80|0},40,${.5*(1-k)})`);}ctx.restore();}}
}
function mSerp(cx,gy,u,p,t,sd){
  const s=u*1.1*(p.scale||1),c=p.body||'#5a7a3a';
  for(let i=0;i<3;i++)sblob(cx,gy-s*(.12+i*.16),s*(.78-i*.18),s*(.22-i*.03),i%2?shade(c,.85):c);
  const n=p.heads||1;
  for(let k=0;k<n;k++){const off=(k-(n-1)/2)*s*.42,sw=Math.sin(t*.002+sd+k*1.3)*s*.12,
    pts=[[cx+off*.3,gy-s*.5],[cx+off*.7+sw,gy-s*.95],[cx+off+sw*.5,gy-s*1.35],[cx+off+s*.1+sw*.3,gy-s*1.62]];
    tube(pts,s*.26,s*.18,c);const[hx,hy]=pts[3];sblob(hx+s*.08,hy,s*.21,s*.15,c);
    dot(hx+s*.14,hy-s*.05,s*.035,p.eyec||'#f0d040');if(Math.sin(t*.006+k+sd)>.6)line(hx+s*.28,hy+s*.04,hx+s*.42,hy+s*.06,'#d0303a',Math.max(1,s*.03));}
}
function mSpider(cx,gy,u,p,t,sd){
  const s=u*1.1*(p.scale||1),c=p.body||'#2a2420',lc=shade(c,.8);
  if(p.tail){const sw=Math.sin(t*.003+sd)*s*.06;tube([[cx-s*.5,gy-s*.4],[cx-s*.8,gy-s*.85],[cx-s*.5+sw,gy-s*1.3],[cx-s*.1+sw,gy-s*1.25]],s*.13,s*.08,c);poly([cx-s*.1+sw,gy-s*1.3,cx+s*.12+sw,gy-s*1.18,cx-s*.06+sw,gy-s*1.12],'#e8dcc0');}
  for(let i=0;i<4;i++)for(const d of[-1,1]){const ph=Math.sin(t*.006+i*1.3+sd+(d>0?1.5:0))*s*.05,bx=cx+s*(-.1+i*.12),kx=bx+d*s*.45+s*(i-1.5)*.08,ky=gy-s*(.78-i*.03)+ph,fx=bx+d*s*.62+s*(i-1.5)*.2,fy=gy-s*.03;
    limb(bx,gy-s*.42,kx,ky,s*.07,lc);limb(kx,ky,fx,fy,s*.05,lc);}
  if(!p.tail)sblob(cx-s*.32,gy-s*.5,s*.44,s*.36,c);else sblob(cx-s*.2,gy-s*.42,s*.4,s*.26,c);
  if(p.mark)poly([cx-s*.38,gy-s*.66,cx-s*.26,gy-s*.66,cx-s*.32,gy-s*.52],p.mark);
  sblob(cx+s*.24,gy-s*.42,s*.25,s*.21,shade(c,.9));
  if(p.pincers)for(const d of[-1,1]){tube([[cx+s*.4,gy-s*.4],[cx+s*.7,gy-s*(.5+d*.12)],[cx+s*.85,gy-s*(.45+d*.15)]],s*.09,s*.07,c);sblob(cx+s*.92,gy-s*(.45+d*.15),s*.13,s*.09,shade(c,1.1));}
  for(let i=0;i<4;i++)dot(cx+s*(.36+(i%2)*.07),gy-s*(.48+(i>>1)*.06),s*.028,p.eyec||'#e03030');
}
function mBird(cx,gy,u,p,t,sd){
  const s=u*1.1*(p.scale||1),c=p.body||'#6b4a2a',f=Math.sin(t*.008+sd),by=gy-s*(p.lion?.7:1.05)+f*s*.05;
  if(p.lion){mQuad(cx,gy,u*.95,{body:c,ears:'point',beak:1,head:'#e8e0d0',tailw:.08},t,sd);wing(cx,by-s*.1,-1,s,shade(c,.8),f*.4);wing(cx+s*.1,by-s*.15,1,s,shade(c,.9),f*.4);return;}
  ell(cx,gy,s*.4,s*.12,'rgba(0,0,0,.25)');
  wing(cx-s*.05,by-s*.05,-1,s,shade(c,.85),f*.45,p.bat);
  poly([cx-s*.35,by+s*.05,cx-s*.75,by+s*.25,cx-s*.7,by-s*.05],shade(c,.7));
  sblob(cx,by,s*.38,s*.28,c);
  if(p.harpy){sblob(cx+s*.32,by-s*.32,s*.17,s*.18,'#d8a57a');eyes2(cx+s*.36,by-s*.34,s*.05,s*.025);ctx.fillStyle='#3a2a1a';ctx.beginPath();ctx.arc(cx+s*.32,by-s*.36,s*.18,Math.PI,0);ctx.fill();}
  else{sblob(cx+s*.32,by-s*.28,s*.17,s*.15,p.head||c);poly([cx+s*.45,by-s*.32,cx+s*.62,by-s*.24,cx+s*.45,by-s*.2],p.bat?'#2a2028':'#d9a521');dot(cx+s*.36,by-s*.32,s*.035,'#111');}
  if(p.bat)for(const d of[-.05,.08])poly([cx+s*(.28+d),by-s*.4,cx+s*(.32+d),by-s*.58,cx+s*(.38+d),by-s*.4],shade(c,.8));
  wing(cx+s*.05,by-s*.08,1,s,c,f*.45,p.bat);
}
function mEye(cx,gy,u,p,t,sd){
  const s=u*1.1*(p.scale||1),c=p.body||'#7b5aa6',y=gy-s*1.15+Math.sin(t*.002+sd)*s*.08;
  ell(cx,gy,s*.5,s*.14,'rgba(0,0,0,.28)');
  for(let i=0;i<7;i++){const a=-Math.PI*(.08+.84*i/6),w=Math.sin(t*.003+i*1.7+sd)*.25,x0=cx+Math.cos(a)*s*.45,y0=y+Math.sin(a)*s*.45,x1=cx+Math.cos(a+w)*s*.95,y1=y+Math.sin(a+w)*s*.9;
    tube([[x0,y0],[(x0+x1)/2+w*s*.2,(y0+y1)/2],[x1,y1]],s*.07,s*.04,shade(c,.85));dot(x1,y1,s*.07,'#f4efe4');dot(x1+s*.02,y1,s*.035,'#2a1a10');}
  sblob(cx,y,s*.62,s*.6,c);
  const ex=cx+s*.08,iy=y-s*.05;ell(ex,iy,s*.3,s*.24,'#f4efe4');
  dot(ex+Math.sin(t*.0011+sd)*s*.08,iy,s*.14,p.iris||'#d9a521');dot(ex+Math.sin(t*.0011+sd)*s*.08,iy,s*.06,'#120808');
  ctx.strokeStyle=shade(c,.45);ctx.lineWidth=Math.max(1,s*.05);ctx.beginPath();ctx.ellipse(ex,iy,s*.31,s*.25,0,Math.PI*1.1,Math.PI*1.9);ctx.stroke();
  ctx.fillStyle='#2a0c10';ctx.beginPath();ctx.ellipse(cx+s*.05,y+s*.35,s*.25,s*.09,0,0,Math.PI);ctx.fill();
  for(let i=0;i<5;i++)poly([cx-s*.15+i*s*.08,y+s*.35,cx-s*.11+i*s*.08,y+s*.42,cx-s*.07+i*s*.08,y+s*.35],'#f0e8d0');
}
function mOoze(cx,gy,u,p,t,sd){
  const s=u*1.15*(p.scale||1),c=p.body||'#7fd0a0',w=Math.sin(t*.003+sd);ctx.save();ctx.globalAlpha*=.88;
  if(p.cube){const h=s*1.2,wd=s*1.1,d=s*.35;ctx.fillStyle=rgbaHex(c,.35);ctx.fillRect(cx-wd/2,gy-h,wd,h);ctx.fillStyle=rgbaHex(c,.5);
    ctx.beginPath();ctx.moveTo(cx-wd/2,gy-h);ctx.lineTo(cx-wd/2+d,gy-h-d*.6);ctx.lineTo(cx+wd/2+d,gy-h-d*.6);ctx.lineTo(cx+wd/2,gy-h);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgbaHex(c,.25);ctx.beginPath();ctx.moveTo(cx+wd/2,gy-h);ctx.lineTo(cx+wd/2+d,gy-h-d*.6);ctx.lineTo(cx+wd/2+d,gy-d*.6);ctx.lineTo(cx+wd/2,gy);ctx.closePath();ctx.fill();
    sblob(cx-s*.1,gy-s*.5,s*.15,s*.14,'#e6dcc4');dot(cx-s*.15,gy-s*.52,s*.035,'#222');dot(cx-s*.05,gy-s*.52,s*.035,'#222');line(cx+s*.1,gy-s*.25,cx+s*.3,gy-s*.6,'#c8ccd2',Math.max(1,s*.04));
    ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=Math.max(1,s*.03);ctx.strokeRect(cx-wd/2,gy-h,wd,h);}
  else{sblob(cx,gy-s*.3,s*(.78+w*.04),s*(.4-w*.03),c);sblob(cx-s*.25,gy-s*.55-w*s*.03,s*.32,s*.26,shade(c,1.08));sblob(cx+s*.22,gy-s*.62+w*s*.03,s*.27,s*.23,c);
    ell(cx-s*.28,gy-s*.66,s*.12,s*.06,'rgba(255,255,255,.4)');
    for(let i=0;i<3;i++){const ph=(t*.0005+i/3+sd)%1;ring(cx+s*(-.3+i*.3),gy-s*(.2+ph*.5),s*.04*(1+ph),'rgba(255,255,255,.5)',1);}
    if(p.mouths)for(let i=0;i<4;i++){const mx=cx+s*(-.4+i*.27),my=gy-s*(.35+.15*(i%2));ell(mx,my,s*.08,s*.045,'#2a0c10');dot(mx-s*.03,my-s*.08,s*.035,'#f4efe4');}
    if(p.eyes!==0&&!p.mouths){eyes2(cx+s*.1,gy-s*.55,s*.08,s*.035,'#1a1a1a');}}
  ctx.restore();
}
function mGhost(cx,gy,u,p,t,sd){
  const s=u*1.15*(p.scale||1),c=p.body||'#cfe6ff',fl=Math.sin(t*.0022+sd)*s*.1,y=gy-s*1.05+fl;
  ctx.save();ctx.globalAlpha*=.82;
  const g=ctx.createLinearGradient(0,y-s*.9,0,gy);g.addColorStop(0,rgbaHex(c,.95));g.addColorStop(1,rgbaHex(c,0));ctx.fillStyle=g;ctx.beginPath();
  ctx.arc(cx,y-s*.5,s*.32,Math.PI,0);ctx.quadraticCurveTo(cx+s*.48,y,cx+s*.4,y+s*.6);
  for(let i=0;i<4;i++){const xx=cx+s*(.4-.27*(i+1)),yy=y+s*(.6+.12*Math.sin(t*.005+i+sd));ctx.quadraticCurveTo(xx+s*.13,yy+s*.15,xx,yy);}
  ctx.quadraticCurveTo(cx-s*.48,y,cx-s*.32,y-s*.5);ctx.closePath();ctx.fill();
  for(const d of[-1,1])tube([[cx+d*s*.28,y-s*.25],[cx+d*s*.55,y+Math.sin(t*.003+d)*s*.1],[cx+d*s*.62,y+s*.25]],s*.08,s*.02,shade(c,.9));
  ell(cx,y-s*.45,s*.2,s*.18,'rgba(10,10,30,.55)');
  ctx.restore();glowEyes(cx,y-s*.47,s*.08,s*.035,p.glow||'#9fe8ff');
}
function mEle(cx,gy,u,p,t,sd){
  const s=u*1.2*(p.scale||1),k=p.kind||'fire';
  if(k==='fire'||k==='wisp'){ctx.save();ctx.globalCompositeOperation='lighter';const n=k==='wisp'?6:16,base=k==='wisp'?gy-s*1.1+Math.sin(t*.003+sd)*s*.15:gy;
    for(let i=0;i<n;i++){const ph=(t*.0011+i/n)%1,x=cx+Math.sin(i*2.1+t*.003)*s*(k==='wisp'?.15:.38)*(1-ph),y=base-s*(k==='wisp'?ph*.4:.15+ph*1.7),r=s*((k==='wisp'?.2:.38)*(1-ph)+.05);
      const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,k==='wisp'?'rgba(200,240,255,.9)':'rgba(255,240,160,.9)');g.addColorStop(.5,k==='wisp'?'rgba(90,180,255,.5)':'rgba(255,120,30,.55)');g.addColorStop(1,'rgba(255,60,0,0)');
      ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}ctx.restore();if(k==='fire')glowEyes(cx,gy-s*1.2,s*.08,s*.035,'#fff4c0');return;}
  if(k==='water'){ctx.save();ctx.globalAlpha*=.8;for(let i=0;i<6;i++){const y=gy-s*(.15+i*.25),x=cx+Math.sin(t*.003+i+sd)*s*.08;sblob(x,y,s*(.5-i*.05),s*.2,i%2?'#3f9ad6':'#2a7ac0');}
    ell(cx-s*.1,gy-s*1.3,s*.1,s*.05,'rgba(255,255,255,.5)');ctx.restore();glowEyes(cx,gy-s*1.35,s*.08,s*.03,'#d0f4ff');return;}
  if(k==='air'){ctx.save();ctx.lineCap='round';for(let i=0;i<5;i++){const y=gy-s*(.1+i*.3),r=s*(.2+i*.12),a=t*.006+i;ctx.strokeStyle=`rgba(220,235,255,${.35+i*.08})`;ctx.lineWidth=Math.max(1,s*.06);ctx.beginPath();ctx.ellipse(cx,y,r,r*.3,0,a,a+4.2);ctx.stroke();}ctx.restore();return;}
  if(k==='earth'){for(let i=0;i<5;i++){const y=gy-s*(.2+i*.32),x=cx+Math.sin(i*1.7)*s*.08,w=s*(.42-i*.04);poly([x-w,y+s*.15,x-w*.7,y-s*.15,x+w*.6,y-s*.18,x+w,y+s*.12],i%2?'#7a7468':'#8e887b');}
    for(const d of[-1,1])sblob(cx+d*s*.55,gy-s*.9,s*.18,s*.22,'#6e695e');glowEyes(cx,gy-s*1.4,s*.08,s*.03,'#ffb040');}
}
function mTree(cx,gy,u,p,t,sd){
  const s=u*1.2*(p.scale||1),sw=Math.sin(t*.0015+sd)*s*.05;
  if(p.cap){line(cx,gy,cx,gy-s*.8,'#e8e0cc',s*.24);sblob(cx,gy-s*.5,s*.16,s*.35,'#e8e0cc');ctx.fillStyle=p.cap;ctx.beginPath();ctx.ellipse(cx+sw,gy-s*.85,s*.5,s*.35,0,Math.PI,0);ctx.closePath();ctx.fill();
    ell(cx+sw,gy-s*.85,s*.5,s*.08,shade(p.cap,.6));for(let i=0;i<4;i++)dot(cx+sw+s*(-.3+i*.2),gy-s*(.98+.06*(i%2)),s*.05,'#f4efe4');eyes2(cx,gy-s*.6,s*.06,s*.025,'#2a1a10');
    for(const d of[-1,1])limb(cx+d*s*.12,gy-s*.5,cx+d*s*.35,gy-s*.25,s*.08,'#e8e0cc');return;}
  const tc=p.dead?'#4a3a2a':'#5a3e24';
  poly([cx-s*.28,gy,cx+s*.28,gy,cx+s*.16,gy-s*1.3,cx-s*.16,gy-s*1.3],tc);
  ctx.strokeStyle=shade(tc,.6);ctx.lineWidth=Math.max(1,s*.03);for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(cx-s*.12+i*s*.1,gy-s*.1);ctx.lineTo(cx-s*.09+i*s*.08,gy-s*1.2);ctx.stroke();}
  limb(cx-s*.15,gy-s*.95,cx-s*.65+sw,gy-s*1.35,s*.1,tc);limb(cx+s*.15,gy-s*1,cx+s*.62+sw,gy-s*1.45,s*.1,tc);
  if(!p.dead){for(const[x,y,r]of[[-.35,1.55,.38],[.35,1.6,.4],[0,1.85,.45],[-.6,1.35,.25],[.6,1.45,.26]])sblob(cx+s*x+sw*1.5,gy-s*y,s*r,s*r*.85,p.leaf||'#3f7a2e');}
  glowEyes(cx,gy-s*.95,s*.08,s*.035,'#ffc040');
}
function mGolem(cx,gy,u,p,t,sd){
  const s=u*1.15*(p.scale||1),c=p.body||'#8a8578',b=Math.sin(t*.002+sd)*s*.015;
  const box=(x,y,w,h,col)=>{const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,shade(col,1.3));g.addColorStop(1,shade(col,.55));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.strokeStyle=shade(col,.4);ctx.lineWidth=Math.max(1,s*.03);ctx.strokeRect(x,y,w,h);};
  box(cx-s*.32,gy-s*.75,s*.24,s*.72,c);box(cx+s*.08,gy-s*.75,s*.24,s*.72,c);
  box(cx-s*.48,gy-s*1.55+b,s*.96,s*.85,c);box(cx-s*.78,gy-s*1.45+b,s*.26,s*.85,shade(c,.9));box(cx+s*.52,gy-s*1.45+b,s*.26,s*.85,shade(c,.9));
  box(cx-s*.2,gy-s*1.85+b,s*.4,s*.32,c);
  if(p.glow){ctx.save();ctx.globalCompositeOperation='lighter';const a=.6+.3*Math.sin(t*.003+sd);ctx.strokeStyle=rgbaHex(p.glow,a);ctx.lineWidth=Math.max(1,s*.04);ctx.beginPath();ctx.moveTo(cx-s*.2,gy-s*1.4);ctx.lineTo(cx,gy-s*1.2);ctx.lineTo(cx+s*.2,gy-s*1.4);ctx.moveTo(cx,gy-s*1.2);ctx.lineTo(cx,gy-s*.9);ctx.stroke();ctx.restore();}
  glowEyes(cx,gy-s*1.72+b,s*.08,s*.035,p.glow||'#9fe8ff');
}
function mWorm(cx,gy,u,p,t,sd){
  const s=u*1.2*(p.scale||1),c=p.body||'#7b3f8a';ell(cx,gy,s*.55,s*.2,'#140a10');
  const pts=[];for(let i=0;i<8;i++){const k=i/7,a=-Math.PI/2+Math.sin(t*.0018+sd)*.5*k+k*.9;pts.push([cx+Math.sin(k*2.6+t*.0015)*s*.25*k+k*s*.3,gy-s*k*1.6+Math.cos(a)*0]);}
  for(let i=0;i<pts.length;i++){const k=i/(pts.length-1);sblob(pts[i][0],pts[i][1],s*(.38-k*.12),s*(.3-k*.08),i%2?c:shade(c,.88));if(p.legs&&i<pts.length-1)for(const d of[-1,1])line(pts[i][0]+d*s*.3,pts[i][1],pts[i][0]+d*s*.45,pts[i][1]+s*.12,shade(c,.6),Math.max(1,s*.04));}
  const[hx,hy]=pts[pts.length-1];ell(hx+s*.05,hy-s*.05,s*.22,s*.14,'#2a0c10');for(let i=0;i<6;i++){const a=i*TAU/6;poly([hx+s*.05+Math.cos(a)*s*.2,hy-s*.05+Math.sin(a)*s*.12,hx+s*.05+Math.cos(a+.25)*s*.2,hy-s*.05+Math.sin(a+.25)*s*.12,hx+s*.05+Math.cos(a+.12)*s*.1,hy-s*.05+Math.sin(a+.12)*s*.06],'#f0e8d0');}
}
function mKraken(cx,gy,u,p,t,sd){
  const s=u*1.05*(p.scale||1),c=p.body||'#a0473a';
  for(let i=0;i<6;i++){const side=i<3?-1:1,k=i%3,pts=[[cx+side*s*.12,gy-s*.35]];
    for(let j=1;j<=6;j++){const w=Math.sin(t*.003+j*.8+i*1.3+sd);pts.push([cx+side*s*(.12+j*(.12+k*.03)),gy-s*.35+j*s*(.05+k*.015)-w*s*.07*j*.35-(j>=5?s*.12*(j-4):0)]);}
    tube(pts,s*.17,s*.04,shade(c,.92-k*.06));}
  sblob(cx,gy-s*.95+Math.sin(t*.002+sd)*s*.04,s*.45,s*.7,c);eyes2(cx+s*.05,gy-s*.7,s*.16,s*.07,'#f4d060');dot(cx-s*.11,gy-s*.7,s*.03,'#111');dot(cx+s*.21,gy-s*.7,s*.03,'#111');
}
function mFish(cx,gy,u,p,t,sd){
  const s=u*1.15*(p.scale||1),c=p.body||'#5a6a7a',w=Math.sin(t*.004+sd)*s*.08,y=gy-s*.45;
  poly([cx-s*.6,y,cx-s*1.0,y-s*.3+w,cx-s*.95,y+s*.3+w],shade(c,.8));sblob(cx,y,s*.7,s*.3,c);ell(cx,y+s*.12,s*.55,s*.12,shade(c,1.4));
  poly([cx-s*.1,y-s*.25,cx+s*.15,y-s*.62,cx+s*.25,y-s*.25],shade(c,.75));dot(cx+s*.45,y-s*.06,s*.05,'#111');line(cx+s*.5,y+s*.1,cx+s*.66,y+s*.06,'#2a0c10',Math.max(1,s*.04));
}
function mSwarm(cx,gy,u,p,t,sd){const s=u*1.1,c=p.body||'#3a3238';for(let i=0;i<18;i++){const a=t*.002*(1+(i%3))+i*2.4+sd,r=s*(.2+.5*((i*37)%10)/10),x=cx+Math.cos(a)*r,y=gy-s*(.5+.3*Math.sin(a*1.3))+Math.sin(a)*r*.4;sblob(x,y,s*.07,s*.05,c);}}
function mMimic(cx,gy,u,p,t,sd){
  const s=u*1.15,c=p.flesh?'#9a4b52':'#7a4a22',open=.25+.2*Math.max(0,Math.sin(t*.002+sd));
  const g=ctx.createLinearGradient(cx-s*.6,0,cx+s*.6,0);g.addColorStop(0,shade(c,1.3));g.addColorStop(1,shade(c,.55));ctx.fillStyle=g;ctx.fillRect(cx-s*.6,gy-s*.6,s*1.2,s*.6);
  ctx.fillStyle='#2a0c10';ctx.fillRect(cx-s*.55,gy-s*.62-s*open,s*1.1,s*open);for(let i=0;i<6;i++)poly([cx-s*.5+i*s*.18,gy-s*.62,cx-s*.42+i*s*.18,gy-s*.62,cx-s*.46+i*s*.18,gy-s*.5-s*open*.3],'#f0e8d0');
  ctx.save();ctx.translate(cx,gy-s*.62);ctx.rotate(-open*.8);ctx.fillStyle=shade(c,1.1);ctx.fillRect(-s*.6,-s*.3,s*1.2,s*.3);ctx.fillStyle='#d9b45a';ctx.fillRect(-s*.6,-s*.18,s*1.2,s*.06);ctx.restore();
  ctx.fillStyle='#d9b45a';ctx.fillRect(cx-s*.6,gy-s*.4,s*1.2,s*.06);tube([[cx,gy-s*.65],[cx+s*.3,gy-s*.5],[cx+s*.55+Math.sin(t*.005)*s*.1,gy-s*.3]],s*.1,s*.04,'#c45a6a');
}
function mHeart(cx,gy,u,p,t,sd){const s=u*1.2,ph=(t%1100)/1100,beat=1+.12*(Math.exp(-(((ph-.08)/.05)**2))+.6*Math.exp(-(((ph-.3)/.05)**2)));
  for(const d of[-1,1])tube([[cx+d*s*.2,gy-s*.1],[cx+d*s*.6,gy-s*.3],[cx+d*s*.8,gy-s*.05]],s*.12,s*.05,'#7a1f2a');
  ctx.save();ctx.translate(cx,gy-s*.8);ctx.scale(beat,beat);sblob(-s*.18,-s*.1,s*.32,s*.35,'#b5303f');sblob(s*.18,-s*.1,s*.32,s*.35,'#b5303f');poly([-s*.45,0,s*.45,0,0,s*.55],'#9a2a38');
  tube([[-s*.05,-s*.4],[-s*.1,-s*.65],[s*.05,-s*.75]],s*.12,s*.09,'#7a1f2a');ctx.restore();}
function mTendril(cx,gy,u,p,t,sd){const s=u*1.2;for(let i=0;i<3;i++){const pts=[];for(let k=0;k<=6;k++){const q=k/6;pts.push([cx+(i-1)*s*.25+Math.sin(t*.003+q*3+i)*s*.25*q,gy-q*s*1.5]);}tube(pts,s*.18,s*.04,'#6e3a5e');}}
const MODEL_FNS={hum:mHum,quad:mQuad,dragon:mDragon,serp:mSerp,spider:mSpider,bird:mBird,eye:mEye,ooze:mOoze,ghost:mGhost,ele:mEle,tree:mTree,golem:mGolem,worm:mWorm,kraken:mKraken,fish:mFish,swarm:mSwarm,mimic:mMimic,heart:mHeart,tendril:mTendril};
const MODEL_LABELS=[['auto','Automatic, from its name'],['hum','Person or humanoid'],['quad','Four-legged beast'],['dragon','Dragon'],['serp','Serpent'],['spider','Spider, bug or scorpion'],['bird','Winged flyer'],
  ['eye','Floating eye'],['ooze','Ooze or slime'],['ghost','Ghost or spirit'],['ele','Elemental'],['tree','Tree or plant creature'],['golem','Golem or construct'],['worm','Giant worm'],['kraken','Tentacled beast'],
  ['fish','Fish or shark'],['swarm','Swarm'],['mimic','Mimic'],['heart','Beating heart'],['tendril','Tendrils'],['card','Standee card with its picture']];
const MP={
 Barbarian:['hum',{body:'#8a5a3a',weapon:'axe',bulk:.42,legs:'#5a4030'}],Bard:['hum',{body:'#7b5aa6',weapon:'lute',cape:'#b5639f',hat:'feather',hatc:'#5a3a7a'}],
 Cleric:['hum',{body:'#d0d3d6',weapon:'holy',shield:'#c9a03d',hat:'helm'}],Druid:['hum',{body:'#5a7a3a',robe:1,weapon:'leafstaff',hat:'hood',hatc:'#4a6a30'}],
 Fighter:['hum',{body:'#7a8490',weapon:'sword',shield:'#a0473a',hat:'helm'}],Monk:['hum',{body:'#e07a3a',legs:'#8a4a20'}],
 Paladin:['hum',{body:'#c0c6cf',weapon:'sword',shield:'#3f6fbf',cape:'#3f6fbf',hat:'helm'}],Ranger:['hum',{body:'#4c6a3a',weapon:'bow',hat:'hood',hatc:'#3a5a2a',cape:'#3a5a2a'}],
 Rogue:['hum',{body:'#3a3f48',weapon:'dagger',hat:'hood',hatc:'#2a2e36'}],Sorcerer:['hum',{body:'#b5392f',robe:1,weapon:'orb'}],
 Warlock:['hum',{body:'#3a2a4a',robe:1,weapon:'orb',hat:'hood',hatc:'#2a1a3a',glow:'#b07aff'}],Wizard:['hum',{body:'#3f5fbf',robe:1,weapon:'staff',hat:'wizard',beard:'#e8e8e8'}],
 Artificer:['hum',{body:'#8a6b4a',weapon:'hammer',cape:'#5a3a20'}],'Blood hunter':['hum',{body:'#5a1f27',weapon:'sword',hat:'hood',hatc:'#3a0d14',cape:'#5a1f27'}],
 Elf:['hum',{body:'#5fae6b',ears:1,weapon:'bow',skin:'#e8c09a'}],Dwarf:['hum',{body:'#8a6b4a',scale:.85,bulk:.42,beard:'#a0522d',weapon:'axe',hat:'helm'}],
 Familiar:['quad',{body:'#2f3640',ears:'point',scale:.55}],'Animal companion':['quad',{body:'#8a8a8a',ears:'point',snout:.2}],Mount:['quad',{body:'#8a6236',neck:.6,long:1.15,mane:'#4a3420',tall:.75}],
 Ally:['hum',{body:'#6b7fd1'}],Hireling:['hum',{body:'#8a7a5a',weapon:'torch'}],Summon:['ele',{kind:'wisp'}],
 Rat:['quad',{body:'#6a625a',scale:.5,ears:'round',tailw:.05,snout:.18}],'Swarm of rats':['swarm',{body:'#6a625a'}],Bat:['bird',{body:'#3a3238',bat:1,scale:.7}],'Swarm of bats':['swarm',{body:'#2a2428'}],
 Wolf:['quad',{body:'#8a8a8a',ears:'point',snout:.2}],'Dire wolf':['quad',{body:'#4a4a50',ears:'point',snout:.2,scale:1.05,eyec:'#ffd040'}],Boar:['quad',{body:'#5a4030',ears:'point',tusks:1,snout:.18}],
 'Brown bear':['quad',{body:'#6b4a2a',ears:'round',bodyh:.44,legw:.22,snout:.15}],Panther:['quad',{body:'#2a2a30',ears:'point',long:1.15,tailw:.08,eyec:'#e0e040'}],
 'Giant spider':['spider',{body:'#2a2420',mark:'#b5303f'}],'Giant snake':['serp',{body:'#5a7a3a'}],Crocodile:['quad',{body:'#4a5a30',long:1.4,legw:.1,bodyh:.22,neck:.05,snout:.35,tall:.4,spikes:1}],
 'Giant eagle':['bird',{body:'#6b4a2a',head:'#f0ece0'}],Shark:['fish',{body:'#6a7a8a'}],'Giant octopus':['kraken',{body:'#c0502a'}],'Giant scorpion':['spider',{body:'#8a5a2a',tail:1,pincers:1}],
 'Giant toad':['quad',{body:'#5a7a3a',bodyh:.48,legw:.2,neck:.1,snout:.3,tall:.45}],'Swarm of insects':['swarm',{body:'#2a2a10'}],Horse:['quad',{body:'#8a6236',neck:.6,long:1.15,mane:'#4a3420',tall:.75}],
 Mammoth:['quad',{body:'#6b4a30',bodyh:.48,legw:.24,tusks:1,ears:'round',snout:.3,tall:.75}],Tyrannosaurus:['dragon',{body:'#5a6a3a',wings:0,breath:0,horns:0}],
 'Giant crab':['spider',{body:'#c0502a',pincers:1}],'Giant beetle':['spider',{body:'#2a3a4a'}],'Giant centipede':['worm',{body:'#7a3a20',legs:1}],
 Goblin:['hum',{body:'#6a5a3a',skin:'#7a9a3a',scale:.72,ears:1,weapon:'dagger'}],Hobgoblin:['hum',{skin:'#c0602a',body:'#8a3a2a',weapon:'sword',shield:'#5a3a20',hat:'helm'}],
 Orc:['hum',{skin:'#6a8a4a',body:'#5a4030',tusks:1,weapon:'axe',bulk:.42}],Kobold:['hum',{skin:'#a0473a',scale:.68,body:'#5a4030',weapon:'spear',tail:1,snout:1}],
 Gnoll:['hum',{skin:'#b0905a',body:'#5a4030',weapon:'spear',ears:1,snout:1}],Lizardfolk:['hum',{skin:'#4a7a4a',body:'#4a5a30',weapon:'spear',shield:'#6b4a2a',tail:1,snout:1}],
 Bandit:['hum',{body:'#5a4a3a',hat:'hood',hatc:'#3a3028',weapon:'sword'}],Guard:['hum',{body:'#7a8490',hat:'helm',weapon:'spear',shield:'#a0473a'}],
 Knight:['hum',{body:'#b8bec6',hat:'helm',weapon:'sword',shield:'#3f6fbf',cape:'#3f6fbf'}],Cultist:['hum',{body:'#5a1f27',robe:1,hat:'hood',hatc:'#3a0d14',weapon:'dagger'}],
 Mage:['hum',{body:'#7b5aa6',robe:1,hat:'wizard',weapon:'staff'}],Assassin:['hum',{body:'#1f2228',hat:'hood',hatc:'#15171b',weapon:'dagger'}],Merfolk:['hum',{skin:'#6fb0a0',body:'#2f6f8f',weapon:'spear',robe:1}],
 Noble:['hum',{body:'#7b3f8a',cape:'#b5392f',hat:'crown'}],Commoner:['hum',{body:'#8a7a5a'}],Pirate:['hum',{body:'#7a3a2a',weapon:'sword',hat:'feather',hatc:'#1f2228'}],Archer:['hum',{weapon:'bow',hat:'hood',body:'#5a6a3a'}],
 Skeleton:['hum',{bone:1,thin:1,weapon:'sword',shield:'#6b4a2a'}],Zombie:['hum',{skin:'#7a9a6a',body:'#5a5040',hunch:1}],Ghoul:['hum',{skin:'#8a9a8a',body:'#3a3a3a',hunch:1,thin:1,glow:'#d0ff60'}],
 Ghost:['ghost',{body:'#cfe6ff'}],Wraith:['ghost',{body:'#2a2a35',glow:'#ff4040'}],Wight:['hum',{bone:1,thin:1,weapon:'sword',glow:'#7fe0ff',cape:'#2a2a35'}],
 Vampire:['hum',{skin:'#e8e0e0',body:'#1a1a22',cape:'#7a1020',glow:'#ff3030'}],Mummy:['hum',{skin:'#d8cfb0',body:'#d8cfb0',legs:'#c8bfa0',glow:'#7fe0d0'}],
 Lich:['hum',{bone:1,robe:1,body:'#3a2a5a',hat:'crown',weapon:'staff',glow:'#7fe0ff'}],Banshee:['ghost',{body:'#dfe8ff',glow:'#ffffff'}],'Bone dragon':['dragon',{body:'#e6dcc4',wingc:'#b8ae98',eyec:'#7fe0ff'}],
 'Dragon wyrmling':['dragon',{scale:.8}],'Young dragon':['dragon',{}],'Adult dragon':['dragon',{}],'Ancient dragon':['dragon',{}],Wyvern:['dragon',{body:'#4a6a3a',breath:0}],
 'Dragon turtle':['quad',{body:'#3f6f5a',shell:'#4a5a3a',bodyh:.42,neck:.35}],Pseudodragon:['dragon',{scale:.7,body:'#c0602a',breath:0}],
 Owlbear:['quad',{body:'#6b4a2a',head:'#8a7a5a',beak:1,ears:'point',bodyh:.44,legw:.22}],Basilisk:['quad',{body:'#4a6a3a',long:1.3,legw:.12,bodyh:.26,tall:.42,spikes:1,eyec:'#ffd040'}],
 Hydra:['serp',{heads:5,body:'#3f6f5a'}],Manticore:['quad',{body:'#b07a3a',mane:'#7a4a20',wings:1,bat:1,spikes:1}],Chimera:['quad',{body:'#b08a4a',mane:'#7a4a20',wings:1,horns:1}],
 Griffon:['bird',{lion:1,body:'#b08a4a'}],Harpy:['bird',{harpy:1,body:'#5a4a3a'}],Mimic:['mimic',{}],Bulette:['quad',{body:'#5a6a7a',bodyh:.46,legw:.2,spikes:1}],'Purple worm':['worm',{body:'#7b3f8a'}],
 Roc:['bird',{body:'#6b4a2a'}],Minotaur:['hum',{skin:'#6b4a2a',body:'#5a3a20',hat:'horns',weapon:'axe',bulk:.45,scale:1.1,snout:1}],Medusa:['hum',{skin:'#7a9a6a',body:'#3f6f5a',hat:'snakes',robe:1}],
 Kraken:['kraken',{body:'#7b3f6a'}],'Sea serpent':['serp',{body:'#2f6f8f'}],Ankheg:['spider',{body:'#7a6a3a',pincers:1}],'Displacer beast':['quad',{body:'#2a2a40',ears:'point',long:1.1,eyec:'#40ff80'}],
 Beholder:['eye',{}],'Mind flayer':['hum',{skin:'#9a7aa0',body:'#3a2a4a',robe:1,tentaface:1,glow:'#ffffff'}],Aboleth:['fish',{body:'#4a6a7a'}],'Gibbering mouther':['ooze',{body:'#a07a70',mouths:1}],
 Otyugh:['ooze',{body:'#7a7a5a'}],Grell:['eye',{body:'#c0b0a0'}],Chuul:['spider',{pincers:1,body:'#5a6a3a'}],'Star spawn':['hum',{skin:'#5a7ab0',body:'#2a3a5a',glow:'#ffffff'}],
 'Fire elemental':['ele',{kind:'fire'}],'Water elemental':['ele',{kind:'water'}],'Earth elemental':['ele',{kind:'earth'}],'Air elemental':['ele',{kind:'air'}],
 'Magma mephit':['ele',{kind:'fire',scale:.6}],'Ice mephit':['ele',{kind:'water',scale:.6}],"Will-o'-wisp":['ele',{kind:'wisp'}],'Storm spirit':['ele',{kind:'air'}],
 Imp:['hum',{skin:'#b5392f',body:'#7a1f1f',scale:.6,hat:'horns',wings:'#7a1f1f',tail:1}],Demon:['hum',{skin:'#8c1f2a',body:'#5a1015',hat:'horns',wings:'#4a0d12',bulk:.45,scale:1.1,glow:'#ffcc33',tail:1}],
 Balor:['hum',{skin:'#8c1f2a',body:'#5a1015',hat:'horns',wings:'#2a0508',weapon:'sword',bulk:.5,scale:1.2,glow:'#ffcc33',tail:1}],'Hell hound':['quad',{body:'#2a1a1a',ears:'point',eyec:'#ff6020'}],
 Rakshasa:['hum',{skin:'#c0802a',body:'#5a2a6a',ears:1,cape:'#7b3f8a'}],'Night hag':['hum',{skin:'#6a5a7a',body:'#2a2030',robe:1,hat:'hood',hunch:1,glow:'#ff5050'}],
 Pixie:['hum',{scale:.5,wings:'#bfe8ff',body:'#5fae6b'}],Dryad:['hum',{skin:'#8aba6a',body:'#5fae6b',robe:1}],'Green hag':['hum',{skin:'#7a9a5a',body:'#3a4a2a',robe:1,hunch:1,hat:'hood'}],
 Satyr:['hum',{body:'#8a6b4a',hat:'horns',weapon:'lute'}],Treant:['tree',{}],'Shambling mound':['ooze',{body:'#4a6a2a',eyes:0}],Myconid:['tree',{cap:'#b07aff'}],'Twig blight':['tree',{scale:.6,dead:1}],
 'Vine blight':['tree',{scale:.7}],Unicorn:['quad',{body:'#f0f0f0',neck:.6,long:1.15,mane:'#e0c0ff',horn:1,tall:.75}],
 'Animated armor':['hum',{body:'#9aa3ad',skin:'#9aa3ad',hat:'helm',weapon:'sword',shield:'#6b7680'}],'Flesh golem':['golem',{body:'#a08070'}],'Stone golem':['golem',{body:'#8a8578'}],
 'Iron golem':['golem',{body:'#5a6068',glow:'#ff8a3a'}],Gargoyle:['hum',{skin:'#7a766d',body:'#6a665e',wings:'#5a564e',hat:'horns',hunch:1}],
 'Gelatinous cube':['ooze',{cube:1,body:'#7fd0a0'}],'Black pudding':['ooze',{body:'#1a1a22'}],'Gray ooze':['ooze',{body:'#8a8a8a'}],'Ochre jelly':['ooze',{body:'#c9a03d'}],
 Ogre:['hum',{skin:'#b09060',body:'#6b4a2a',bulk:.5,scale:1.15,weapon:'club'}],Troll:['hum',{skin:'#5a7a4a',body:'#4a3a2a',hunch:1,thin:1,scale:1.2,ears:1}],
 Ettin:['hum',{skin:'#a08060',body:'#5a4030',heads:2,weapon:'club',bulk:.48}],'Hill giant':['hum',{skin:'#c09070',body:'#7a5a3a',weapon:'club',bulk:.5}],
 'Frost giant':['hum',{skin:'#a0c8e0',body:'#5a6a7a',beard:'#e8f0ff',weapon:'axe'}],'Fire giant':['hum',{skin:'#5a3a3a',body:'#3a3a3a',beard:'#ff7a2a',weapon:'sword',hat:'helm'}],
 Cyclops:['hum',{skin:'#c09070',body:'#6b4a2a',cyclops:1,weapon:'club'}],'Storm giant':['hum',{skin:'#7a9ac0',body:'#3f5fbf',beard:'#e8e8e8',weapon:'spear'}],
 'Gut worm':['worm',{body:'#c07a7a'}],'Acid swarm':['swarm',{body:'#9cbc2a'}],'Bone knight':['hum',{bone:1,thin:1,weapon:'sword',shield:'#5a1f27',hat:'helm'}],'Dungeon eye':['eye',{body:'#9a4b52'}],
 'Grasping tendril':['tendril',{}],'White cell':['ooze',{body:'#e8e8f0'}],'Stomach mimic':['mimic',{flesh:1}],'Heart guardian':['golem',{body:'#9a2a3a',glow:'#ff5070'}],'Bile ooze':['ooze',{body:'#9cbc2a'}],
 Parasite:['worm',{body:'#d0b0a0',scale:.6}],'Glowcap druid':['tree',{cap:'#4fb3a6'}],'Lake leviathan':['kraken',{body:'#3f6f8f'}],'Jungle stalker':['quad',{body:'#8a6b4a',ears:'point',long:1.15,spots:1}],
 'Dungeon heart':['heart',{}],'Spore cloud':['swarm',{body:'#b07aff'}],
};
const CAT_MODEL={Beasts:'quad',Humanoids:'hum',Undead:'hum',Dragons:'dragon',Monstrosities:'quad',Aberrations:'eye',Elementals:'ele',Fiends:'hum',Fey:'tree',Constructs:'golem',Giants:'hum',Living:'ooze'};
function modelOf(t){
  const base=t.name.replace(/\s+\d+$/,'').replace(/^(Frenzied|Apex)\s+/,''),spec0=MP[base],spec=spec0&&t.frenzy?frenzyTint(spec0,t.frenzy):spec0;
  if(t.model&&t.model!=='auto'){if(t.model==='card')return null;if(spec&&spec[0]===t.model)return[spec[0],spec[1]];return[t.model,{body:t.color}];}
  if(t.img)return null;
  if(spec)return spec;
  if(t.kind==='hero')return['hum',{body:t.color}];
  return[CAT_MODEL[t.cat]||'hum',{body:t.color}];
}
function drawModelMini(t,alpha,now,spec){
  const s=view.cs,n=SZ(t),r=Math.max(3,n*s*.42),cx=(t.x+n/2)*s,gy=(t.y+n/2)*s+r*.25,bw=r*1.05,bh=r*.52,th=Math.max(2,r*.2),down=t.hpMax>0&&t.hp<=0,sd=(t.id*1.37)%10;
  const sh0=prefs.real3d!==false&&M3.ok?M3.cache.get(spec[0]+JSON.stringify(Object.assign({},spec[1],spec[1].body?{}:{body:t.color}))):null;
  const tallH=sh0&&sh0.ready&&sh0.topF?sh0.topF*r*3.78:r*2.35*((spec[1].scale||1));t._box=[(cx-r*1.3)/s,(gy-tallH)/s,(cx+r*1.3)/s,(gy+bh+th)/s];
  ctx.globalAlpha=alpha;
  ell(cx+r*.35,gy+th+bh*.3,bw*1.25,bh*1.1,'rgba(0,0,0,.45)');
  if(t.id===selId){ctx.strokeStyle='#f0b443';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(cx,gy+th/2,bw+5,bh+4,0,0,TAU);ctx.stroke();}
  if(t.hidden&&mode==='dm'){ctx.setLineDash([4,3]);ctx.strokeStyle='#f0c674';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(cx,gy+th/2,bw+9,bh+7,0,0,TAU);ctx.stroke();ctx.setLineDash([]);}
  ctx.fillStyle='#121418';ctx.fillRect(cx-bw,gy,bw*2,th);ell(cx,gy+th,bw,bh,'#121418');
  {const g=ctx.createLinearGradient(cx-bw,gy-bh,cx+bw,gy+bh);g.addColorStop(0,shade(t.color,1.35));g.addColorStop(.5,t.color);g.addColorStop(1,shade(t.color,.5));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(cx,gy,bw,bh,0,0,TAU);ctx.fill();}
  {const g=ctx.createRadialGradient(cx-bw*.3,gy-bh*.4,0,cx,gy,bw*.85);g.addColorStop(0,'#4a4f56');g.addColorStop(1,'#1e2125');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(cx,gy,bw*.82,bh*.78,0,0,TAU);ctx.fill();}
  const fn=MODEL_FNS[spec[0]]||mHum,p=Object.assign({},spec[1]);if(!p.body)p.body=t.color;
  ctx.save();
  if(t.face===-1){ctx.translate(cx,0);ctx.scale(-1,1);ctx.translate(-cx,0);}
  if(down){ctx.translate(cx,gy-bh*.1);ctx.rotate(Math.PI/2*.92);ctx.scale(.75,.75);ctx.translate(-cx,-gy);}
  const sh3=prefs.real3d!==false?sheet3D([spec[0],p]):null;
  if(sh3){const S=M3.S,fr=down?0:Math.floor((((now||0)/1700)+sd*.13)%1*M3.F),dw=r*3.78;ctx.drawImage(sh3.canvas,fr*S,0,S,S,cx-dw/2,gy-dw*M3.FOOT,dw,dw);}
  else if(M3.failed||prefs.real3d===false)fn(cx,gy,r,p,down?0:now,sd);
  else{const pulse=.18+.08*Math.sin((now||0)*.004+sd);ell(cx,gy-r*.95,r*.42,r*.95,`rgba(220,226,235,${pulse})`);ell(cx,gy-r*2.05,r*.3,r*.3,`rgba(220,226,235,${pulse})`);}
  ctx.restore();
  if(down){ctx.lineWidth=Math.max(2,r*.14);ctx.strokeStyle='rgba(170,20,20,.9)';ctx.beginPath();ctx.moveTo(cx-bw*.5,gy-bh*.5);ctx.lineTo(cx+bw*.5,gy+bh*.4);ctx.moveTo(cx+bw*.5,gy-bh*.5);ctx.lineTo(cx-bw*.5,gy+bh*.4);ctx.stroke();}
  const top=down?gy-bh*2:gy-tallH;
  badges(t,cx+r*.6,top+r*.5,r*.7);hpBar(t,cx,top-4,r*2,true);nameTag(t,cx,gy+bh+th+2);
  ctx.globalAlpha=1;
}

/* ================= Monster Hunter bestiary (from Amellwind's Monster Hunter Monster Manual) ================= */
function mWyvern(cx,gy,u,p,t,sd){
  // Bipedal wyvern: strong hind legs, long tail, neck and head; wings for flying wyverns, small arms or big fists for brutes.
  const s=u*1.05*(p.scale||1),c=p.body||'#b5302a',bl=p.belly||shade(c,1.25),b=Math.sin(t*.0025+sd)*s*.025,ts=Math.sin(t*.003+sd)*s*.12,slim=p.slim?.75:1;
  const hy=gy-s*.78,bx=cx-s*.05,by=gy-s*1.0+b,f=Math.sin(t*.004+sd);
  if(p.wings){ctx.save();ctx.globalAlpha*=.9;wing(bx+s*.1,by-s*.15,-1,s*1.15,p.wingc||shade(c,.75),f*.25);ctx.restore();}
  limb(bx-s*.05,hy,bx+s*.1,gy-s*.4,s*.2*slim,shade(c,.65));limb(bx+s*.1,gy-s*.4,bx-s*.02,gy-s*.05,s*.13*slim,shade(c,.65));
  const tail=[[bx-s*.45,by],[bx-s*.95,by+s*.12+ts],[bx-s*1.35,by+s*.3+ts*1.4],[bx-s*1.6,by+s*.42+ts*1.8]];
  tube(tail,s*.3*slim,s*.06,c);
  if(p.tailclub)sblob(tail[3][0],tail[3][1],s*.18,s*.15,p.tailclub===1?shade(c,.8):p.tailclub);
  if(p.tailblade){poly([tail[2][0],tail[2][1]-s*.05,tail[3][0]-s*.25,tail[3][1]-s*.25,tail[3][0]+s*.05,tail[3][1]],p.glow||'#d9d2c4');}
  sblob(bx,by,s*.6*slim,s*.36*slim,c,-.15);
  ell(bx+s*.08,by+s*.18,s*.38*slim,s*.12,bl);
  if(p.spikes)for(let i=0;i<5;i++)poly([bx-s*(.4-i*.18),by-s*.28,bx-s*(.33-i*.18),by-s*.55,bx-s*(.26-i*.18),by-s*.28],p.spikec||shade(c,.55));
  if(p.shell)sblob(bx-s*.05,by-s*.18,s*.5,s*.25,p.shell);
  limb(bx+s*.05,hy+s*.02,bx+s*.25,gy-s*.42,s*.24*slim,c);limb(bx+s*.25,gy-s*.42,bx+s*.15,gy-s*.06,s*.15*slim,c);
  ell(bx+s*.22,gy-s*.04,s*.17,s*.07,shade(c,.5));
  const nk=p.neck||.5,hx=bx+s*(.62+nk*.25),hyy=by-s*(.3+nk*.55)+b;
  tube([[bx+s*.42,by-s*.05],[bx+s*(.55+nk*.1),by-s*(.15+nk*.4)],[hx,hyy]],s*.24*slim,s*.17,c);
  if(p.fists){for(const d of[0,1]){const ax=bx+s*(.45+d*.1),ay=by+s*.05;limb(ax,ay,ax+s*.25,gy-s*.35,s*.16,shade(c,d?1:.75));sblob(ax+s*.28,gy-s*.3,s*.17,s*.15,p.glow||'#60ff60');}}
  else if(!p.wings&&!p.noarms)limb(bx+s*.45,by+s*.05,bx+s*.62,by+s*.25,s*.07,shade(c,.8));
  if(p.mane)for(let i=0;i<5;i++)poly([hx-s*.15,hyy-s*.15+i*s*.06,hx-s*.45,hyy-s*.3+i*s*.12,hx-s*.12,hyy-s*.05+i*s*.06],p.mane);
  if(p.fan)for(const d of[-1,1])ell(hx-s*.05,hyy-s*.18,s*.12,s*.28,p.fan,d*.5);
  if(p.crest)poly([hx-s*.12,hyy-s*.12,hx-s*.02,hyy-s*.5,hx+s*.12,hyy-s*.12],p.crest);
  sblob(hx,hyy,s*.24,s*.19,p.head||c);
  const jaw=.04+.05*Math.max(0,Math.sin(t*.002+sd));
  if(p.beak){poly([hx+s*.15,hyy-s*.1,hx+s*.55,hyy+s*.02,hx+s*.15,hyy+s*.08],p.beakc||'#e0c050');poly([hx+s*.15,hyy+s*.06,hx+s*.45,hyy+s*.06+jaw*s,hx+s*.15,hyy+s*.14],shade(p.beakc||'#e0c050',.75));}
  else{sblob(hx+s*.24,hyy+s*.01,s*.2,s*.1,p.head||c);sblob(hx+s*.22,hyy+s*.1+jaw*s,s*.18,s*.06,shade(p.head||c,.8));
    if(p.teeth!==0)for(let i=0;i<3;i++)poly([hx+s*(.14+i*.08),hyy+s*.08,hx+s*(.18+i*.08),hyy+s*.08,hx+s*(.16+i*.08),hyy+s*.14],'#f0e8d0');}
  if(p.horns)for(const d of[-.06,.04]){ctx.strokeStyle=p.hornc||'#e8dcc0';ctx.lineWidth=Math.max(1,s*(p.bighorns?.09:.06));ctx.lineCap='round';ctx.beginPath();ctx.moveTo(hx+d*s,hyy-s*.12);
    ctx.quadraticCurveTo(hx+d*s-s*.2,hyy-s*(p.bighorns?.55:.35),hx+d*s-s*(p.bighorns?.45:.35),hyy-s*(p.bighorns?.5:.32));ctx.stroke();ctx.lineCap='butt';}
  if(p.horn)poly([hx+s*.18,hyy-s*.1,hx+s*.28,hyy-s*.08,hx+s*.3,hyy-s*.5],p.hornc||'#e8dcc0');
  if(p.tusks)poly([hx+s*.3,hyy+s*.1,hx+s*.24,hyy+s*.06,hx+s*.5,hyy+s*.32],'#f0e8d0');
  if(p.eyeless){}else if(p.glow)glowEyes(hx+s*.06,hyy-s*.06,0,s*.035,p.eyec||p.glow);else dot(hx+s*.06,hyy-s*.06,s*.035,p.eyec||'#f0d040');
  if(p.wings)wing(bx+s*.2,by-s*.2,1,s*1.15,p.wingc||shade(c,.85),f*.25);
  if(p.glow&&!p.fists){ctx.save();ctx.globalCompositeOperation='lighter';const a=.25+.2*Math.sin(t*.003+sd);ctx.strokeStyle=rgbaHex(p.glow,a);ctx.lineWidth=Math.max(1,s*.05);
    ctx.beginPath();ctx.moveTo(bx-s*.4,by-s*.2);ctx.quadraticCurveTo(bx,by-s*.4,bx+s*.4,by-s*.25);ctx.stroke();ctx.restore();}
}
function mInsect(cx,gy,u,p,t,sd){
  const s=u*1.05*(p.scale||1),c=p.body||'#d0a030',fly=p.fly!==0,y=gy-s*(fly?.9:.4)+(fly?Math.sin(t*.006+sd)*s*.06:0),wf=Math.sin(t*.06+sd);
  if(fly)ell(cx,gy,s*.45,s*.12,'rgba(0,0,0,.25)');
  if(fly){ctx.save();ctx.globalAlpha*=.55;for(const d of[-1,1])ell(cx-s*.05,y-s*.3,s*.42,s*(.14+.06*wf),'rgba(220,240,255,.9)',d*.6-wf*.2*d);ctx.restore();}
  for(let i=0;i<3;i++)for(const d of[-1,1])limb(cx+s*(-.15+i*.15),y+s*.05,cx+s*(-.2+i*.18)+d*s*.15,(fly?y+s*.35:gy-s*.04)+Math.sin(t*.008+i)*s*.03,s*.05,shade(c,.5));
  const ab=[cx-s*.4,y+s*.02];sblob(ab[0],ab[1],s*.36,s*.24,c,-.2);
  if(p.stripes!==0)for(let i=0;i<3;i++){ctx.strokeStyle=shade(c,.35);ctx.lineWidth=Math.max(1,s*.05);ctx.beginPath();ctx.ellipse(ab[0]-s*.05+i*s*.12,ab[1],s*.04,s*.22,0,0,TAU);ctx.stroke();}
  if(p.stinger)poly([ab[0]-s*.35,ab[1],ab[0]-s*.55,ab[1]+s*.05,ab[0]-s*.33,ab[1]+s*.08],'#2a2a2a');
  sblob(cx,y-s*.02,s*.22,s*.18,shade(c,.85));sblob(cx+s*.25,y-s*.08,s*.16,s*.14,p.head||shade(c,.7));
  dot(cx+s*.3,y-s*.12,s*.07,p.eyec||'#a02020');dot(cx+s*.33,y-s*.14,s*.025,'rgba(255,255,255,.6)');
  if(p.horn)tube([[cx+s*.3,y-s*.2],[cx+s*.45,y-s*.45],[cx+s*.3,y-s*.6]],s*.07,s*.03,shade(c,.5));
  line(cx+s*.32,y-s*.2,cx+s*.45,y-s*.4,shade(c,.4),Math.max(1,s*.025));
  if(p.glow){ctx.save();ctx.globalCompositeOperation='lighter';dot(ab[0],ab[1],s*.5*(1+.15*Math.sin(t*.004+sd)),rgbaHex(p.glow,.3));ctx.restore();}
}
MODEL_FNS.wyvern=mWyvern;MODEL_FNS.insect=mInsect;
MODEL_LABELS.splice(MODEL_LABELS.length-1,0,['wyvern','Wyvern (two legs, tail)'],['insect','Giant insect']);
// Class: [label, model, emoji, default params]
const MH_CLASS={
 amph:['Amphibian','quad','🐸',{bodyh:.48,neck:.1,snout:.3,tall:.45,legw:.2}],
 bird:['Bird wyvern','wyvern','🦅',{wings:1,beak:1,neck:.6,slim:1}],
 brute:['Brute wyvern','wyvern','🦖',{neck:.35}],
 crab:['Carapaceon','spider','🦀',{pincers:1}],
 elder:['Elder dragon','dragon','🐉',{}],
 fbeast:['Fanged beast','quad','🦍',{bodyh:.44,legw:.22,ears:'round',snout:.16}],
 fwyv:['Fanged wyvern','quad','🐺',{long:1.2,ears:'point',snout:.22,spikes:1}],
 fly:['Flying wyvern','wyvern','🐲',{wings:1,neck:.55}],
 levi:['Leviathan','quad','🐊',{long:1.45,tall:.42,bodyh:.26,legw:.13,neck:.25,snout:.28,spikes:1}],
 neop:['Neopteron','insect','🐝',{}],
 pisc:['Piscine wyvern','fish','🐟',{}],
 snake:['Snake wyvern','serp','🐍',{}],
 temno:['Temnoceran','spider','🕷️',{}],
 thero:['Theropod','wyvern','🦖',{slim:1,neck:.55,noarms:0}],
 unk:['Unknown','wyvern','👁️',{wings:1}],
 herb:['Herbivore','quad','🦕',{}],
 lyn:['Lynian','hum','🐈',{scale:.55,ears:1,tail:1}],
 endem:['Endemic life','spider','🐞',{scale:.45}],
};
// name;CR;size(S M L H G);color;flags (key=value or key)
const MH_DATA=`amph|Tetranadon;6;L;#5a7a4a;shell=#3f5a3a|Tetsucabra;4;L;#d0702a;tusks,head=#3a3a7a|Zamite;1/2;M;#6a8aa0;m=fish|Zamtrios;5;H;#7a9ab0;snout=.35,spikes
bird|Aknosom;6;L;#ece4d4;crest=#c0302a,fan=#e0b040|Gypceros;8;L;#6a7a9a;crest=#e8e8b0,beakc=#c0a0a0|Hypnocatrice;4;L;#e07a3a;crest=#60c0e0|Malfestio;9;L;#3f5fbf;fan=#e0c040,eyec=#e03030,beakc=#c0c0c0|Qurupeco;6;L;#4a8a4a;crest=#e03030|Pukei-Pukei;4;L;#5a9a4a;beak=0,belly=#e8e0d0|Coral Pukei-Pukei;10;L;#d0605a;beak=0,belly=#a070c0|Yian Garuga;7;L;#5a3a7a;mane=#c8c8c8,spikes,tailclub=1|Scarred Yian Garuga;16;L;#4a2a5a;mane=#d8d8d8,spikes,tailclub=1,eyec=#ff4040|Yian Kut-Ku;3;L;#e08a7a;fan=#ecdcd0|Blue Yian Kut-Ku;5;L;#4a6ab0;fan=#c8d0e8
brute|Anjanath;7;H;#7a5a3a;head=#d08a8a,glow=#ff7030|Fulgur Anjanath;15;H;#d0d0d0;head=#e08a3a,glow=#60a0ff|Banbaro;12;H;#e8e0d0;horns,bighorns,hornc=#d0a0a0|Brachydios;17;H;#1a1a22;fists,glow=#60ff60,horn,hornc=#60ff60|Raging Brachydios;22;H;#2a1a1a;fists,glow=#ffb030,horn,hornc=#ffb030|Barroth;4;L;#b0805a;crest=#8a6a4a|Baby Barroth;1/4;M;#b0805a;crest=#8a6a4a,scale=.8|Deviljho;18;H;#4a6a4a;spikes,spikec=#c8c0a0,belly=#8a6a5a|Savage Deviljho;22;H;#2a2a2a;spikes,spikec=#c84040,glow=#ff3030|Duramboros;9;H;#8a7a5a;horns,bighorns,tailclub=#6a5a4a|Glavenus;13;H;#6a4a3a;tailblade,glow=#ff6020|Acidic Glavenus;19;H;#4a5a6a;tailblade,glow=#60a0ff|Radobaan;10;H;#3a3a3a;shell=#d8d0c0|Uragaan;6;H;#a07a3a;shell=#7a6a5a|Juvenile Uragaan;3;L;#a07a3a;shell=#7a6a5a|Pumpkin Uragaan;10;H;#e07a1a;shell=#3a7a2a
crab|Ceanataur;1/2;M;#c08a3a|Shogun Ceanataur;13;H;#3a5a8a;mark=#e8e0d0|Tempered Shogun Ceanataur;17;H;#2a4a7a;mark=#e8e0d0|Hermitaur;1/2;M;#c0502a|Daimyo Hermitaur;9;H;#c0402a;mark=#e8e0d0|Tempered Daimyo Hermitaur;18;H;#a0302a;mark=#e8e0d0|Shen Gaoren;30;G;#6a5a4a;mark=#e8e0d0,scale=1.2
elder|Alatreon;21;G;#1a1a22;eyec=#ff6040,wingc=#3a2a2a|Tempered Alatreon (MHW);30;G;#1a1a22;eyec=#ff6040|Amatsumagatsuchi;17;G;#e8e8f0;m=serp|Behemoth;27;G;#4a3a5a;wings=0|Ceadeus;26;G;#3a5a8a;m=fish,scale=1.3|Chameleos;14;H;#7a4a9a;breath=0|Tempered Chameleos;19;H;#6a3a8a;breath=0|Risen Chameleos;21;H;#5a2a7a;breath=0,eyec=#ff40ff|Dalamadur;18;G;#8a3a2a;m=serp|Shah Dalamadur;30;G;#3a2a2a;m=serp,eyec=#ff6040|Dire Miralis;11;G;#2a2a2a;eyec=#ff6020,wingc=#5a2a1a|Tempered Dire Miralis;18;G;#2a2a2a;eyec=#ff6020|Archtempered Dire Miralis;26;G;#1a1a1a;eyec=#ff4010|Fatalis;28;G;#1a1a1a;eyec=#ff4020|Tempered Fatalis (MHW);30;G;#101010;eyec=#ff4020|Gaismagorm;28;G;#3a2a1a;eyec=#ffb040|Gogmazios;19;G;#2a2a2a;eyec=#e0c040|Jhen Mohran;26;G;#b09060;m=fish,scale=1.3|Kirin;12;L;#f0f0f0;m=quad,horn,neck=.6,long=1.15,mane=#e0e8ff,tall=.75,eyec=#80d0ff|Tempered Kirin;19;L;#e8f0ff;m=quad,horn,neck=.6,long=1.15,mane=#c0d8ff,tall=.75,eyec=#80d0ff|Kulve Taroth;21;G;#e0b040;eyec=#ff8030|Kushala Daora;15;H;#7a8490;breath=0|Risen Kushala Daora;17;H;#5a6470;breath=0,eyec=#80e0ff|Lao-Shan Lung;30;G;#6a2a2a;wings=0|Lunastra;12;H;#3f5fbf;eyec=#80c0ff|Tempered Lunastra;19;H;#2f4faf;eyec=#80c0ff|Malzeno;20;H;#c0c6cf;eyec=#ff3050,wingc=#a02040|Nakarkos;20;G;#e6dcc4;m=serp,eyec=#80ff80|Namielle;14;H;#2a3a6a;eyec=#60d0ff,wingc=#4a7ad0|Tempered Namielle;19;H;#2a3a6a;eyec=#60d0ff|Archtempered Namielle;24;H;#1a2a5a;eyec=#60d0ff|Nergigante;23;H;#3a3a3a;spikec=#e8e8e8|Ruiner Nergigante;30;H;#2a2a2a;spikec=#ffffff,eyec=#ff3030|Safi'jiiva;29;G;#8a2a2a;eyec=#ff4040|Shara Ishvalda;25;G;#a0a0a0;eyec=#60e0ff|Teostra;13;H;#c0402a;eyec=#ffb030|Tempered Teostra;20;H;#b0302a;eyec=#ffb030|Risen Teostra;22;H;#a0201a;eyec=#ffd030|Thunder Serpent Narwa;19;G;#3a3a4a;m=serp,eyec=#60a0ff|Vaal Hazak;24;H;#d0c8b0;eyec=#60ff90,wingc=#8a8070|Blackveil Vaal Hazak;26;H;#3a3a3a;eyec=#ff4040|Valstrax;16;H;#c0c6cf;eyec=#80c0ff|Crimson Glow Valstrax;22;H;#a02a2a;eyec=#ff4040|Velkhana;17;H;#e0f0ff;eyec=#80d0ff,wingc=#a0d0f0|Tempered Velkhana;22;H;#d0e8ff;eyec=#80d0ff|Archtempered Velkhana;27;H;#c0e0ff;eyec=#80d0ff|Wind Serpent Ibushi;19;G;#4a6a5a;m=serp,eyec=#80ffc0|Xeno'jiiva;25;G;#e8f0f8;eyec=#60e0ff,wingc=#b0e0f0|Yama Tsukami;18;G;#5a7a4a;m=kraken
fbeast|Arzuros;4;L;#3f5fbf|Arzuros Cub;1/8;S;#3f5fbf;scale=.6|Bloodsoaked Arzuros;11;L;#7a2a2a;eyec=#ff3030|Bishaten;7;L;#d0702a;tailw=.2|Blood Orange Bishaten;12;L;#e05a1a;tailw=.2|Blango;1/2;M;#e8e8e8|Blangonga;9;L;#e8e8e8;tusks|Bullfango;1/4;M;#4a3a2a;tusks,ears=point|Bullfango Shoat;0;S;#6a5a4a;scale=.6|Bulldrome;2;L;#3a2a1a;tusks,ears=point|Conga;1/2;M;#d080a0|Congalala;6;L;#d080a0;mane=#e8b030|Gammoth;16;G;#6a5a4a;tusks,snout=.35,tall=.8|Young Gammoth;6;H;#6a5a4a;tusks,snout=.3|Garangolm;16;H;#5a4a3a;shell=#7a6a5a|Goss Harag;18;H;#e8e8e8;eyec=#60c0ff|Kecha Wacha;6;L;#c0a080;ears=round,tailw=.18|Young Kecha Wacha;1;M;#c0a080;scale=.7|Lagombi;3;L;#e8e8f0;ears=point|Lagombi Kit;1/2;S;#e8e8f0;ears=point,scale=.6|Rajang;15;L;#2a2a2a;mane=#e0a030,eyec=#ffd040,horns|Furious Rajang;21;L;#3a2a1a;mane=#ffd030,eyec=#ffff60,horns|Adolescent Rajang;8;M;#2a2a2a;mane=#e0a030,horns|Volvidon;5;L;#c06a3a;shell=#8a4a2a|Volvidon Pup;1/2;S;#c06a3a;shell=#8a4a2a,scale=.6|Wulg;1;M;#e8e8f0;ears=point,snout=.22|Wulg Pup;1/8;S;#e8e8f0;ears=point,scale=.55
fwyv|Dodogama;7;L;#7a6a5a;snout=.32|Dodogama, Juvenile;1;M;#7a6a5a;scale=.7|Girros;1;M;#4a6aa0|Girros Pup;1/8;S;#4a6aa0;scale=.55|Great Girros;6;L;#3a5a90;eyec=#ffe040|Jagras;1/2;M;#6a7a4a|Jagras Pup;1/8;S;#6a7a4a;scale=.55|Great Jagras;4;L;#6a7a4a;bodyh=.45|Lunagaron;19;H;#4a5a8a;eyec=#80d0ff|Magnamalo;17;H;#5a2a5a;horns,eyec=#b060ff|Scorned Magnamalo;21;H;#3a1a3a;horns,eyec=#d080ff|Odogaron;8;L;#a02a2a|Young Odogaron;4;M;#a02a2a;scale=.75|Ebony Odogaron;12;L;#2a2a2a;eyec=#a060ff|Shamos;1;M;#4a3a6a|Shamos Pup;0;S;#4a3a6a;scale=.55|Tobi-Kadachi;6;L;#4a8a8a;eyec=#80e0ff,tailw=.2|Tobi-Kitachi;2;M;#4a8a8a;tailw=.18|Viper Tobi-Kadachi;9;L;#5a3a6a;eyec=#c060ff,tailw=.2|Viper Tobi-Kitachi;3;M;#5a3a6a;tailw=.18|Zinogre;10;L;#3f5fbf;horns,eyec=#80c0ff,mane=#e0e0a0|Juvenile Zinogre;3;M;#3f5fbf;horns
fly|Akantor;20;G;#3a2a2a;tusks,spikes,wings=0|Astalos;9;L;#3a7a3a;crest=#e0e040,glow=#80ffb0|Tempered Astalos;16;L;#2a6a2a;crest=#e0e040,glow=#80ffb0|Barioth;15;L;#e0e8f0;tusks|Frostfang Barioth;20;L;#c8d8e8;tusks,eyec=#60c0ff|Basarios;6;H;#7a7a6a;shell=#8a8a7a|Baby Basarios;1;M;#7a7a6a;shell=#8a8a7a,scale=.6|Bazelgeuse;17;H;#3a3a3a;glow=#ff6020|Seething Bazelgeuse;21;H;#2a1a1a;glow=#ff3010|Diablos;18;H;#c0a070;horns,bighorns,wingc=#a08050|Espinas;12;H;#3a7a3a;spikes,spikec=#e0e0a0|Tempered Espinas;18;H;#2a6a2a;spikes|Flaming Espinas;15;H;#c04a2a;spikes,glow=#ff6020|Giggi;1/2;S;#e8e0e0;m=worm,scale=.5|Gigginox;10;L;#e8e0e0;eyeless|Chaotic Gigginox;14;L;#5a5a6a;eyeless,glow=#a080ff|Gravios;14;H;#5a4a4a;shell=#6a5a5a,glow=#ff6020|Khezu;10;L;#e8e0e0;eyeless,glow=#a0c0ff|Legiana;13;L;#c0e0f0;wingc=#e0f0ff|Shrieking Legiana;17;L;#d0e8ff;eyec=#60c0ff|Monoblos;12;H;#d0c0a0;horn|Nargacuga;11;L;#1a1a22;eyec=#ff3030,tailblade|Baby Nargacuga;1/4;S;#1a1a22;scale=.55|Young Nargacuga;5;M;#1a1a22;eyec=#ff3030|Silverwind Nargacuga;19;L;#c0c6cf;eyec=#ff3030,tailblade|Lucent Nargacuga;21;L;#2a5a4a;eyec=#60ffa0,tailblade|Paolumu;7;L;#e8e0d0;head=#c0a060|Paolumu Pup;2;M;#e8e0d0;scale=.7|Nightshade Paolumu;12;L;#4a4a6a|Rathalos;10;H;#b5302a;spikes,glow=#ff7030|Rathian;8;L;#5a7a3a;spikes,tailclub=1|Seregios;7;L;#d0b030;spikes|Tempered Seregios;15;L;#c0a020;spikes|Young Seregios;2;M;#d0b030;scale=.7|Tigrex;16;H;#d0a030;spikes,spikec=#3f5fbf|Brute Tigrex;20;H;#3a3a3a;spikes,spikec=#c04030|Ukanlos;20;G;#e0e8f0;tusks,wings=0
levi|Almudron;15;H;#c09040|Magma Almudron;17;H;#3a2a2a;eyec=#ff6020|Gobul;7;H;#5a6a5a;m=fish|Gobling;3;M;#5a6a5a;m=fish,scale=.7|Lagiacrus;14;H;#2a3a5a;eyec=#80c0ff,spikec=#e8e8e8|Young Lagiacrus;8;L;#2a3a5a|Ludroth;1;M;#e0a030|Baby Ludroth;1/8;S;#e0a030;scale=.55|Royal Ludroth;5;L;#e0a030;mane=#d07a20|Mizutsune;11;H;#f0e8f0;mane=#e0a0c0|Young Mizutsune;11;L;#f0e8f0;mane=#e0a0c0|Violet Mizutsune;15;H;#8a5aa0;mane=#c080e0|Nibelsnarf;8;H;#c0a070;snout=.35|Young Nibelsnarf;4;L;#c0a070|Somnacanth;10;H;#e0a0a0;mane=#f0d0d0|Aurora Somnacanth;14;H;#a0e0f0;mane=#e0f0ff|Uroktor;1/2;S;#3a3a3a;eyec=#ff6020,scale=.55|Agnaktor;6;H;#3a2a2a;eyec=#ff6020,snout=.4
neop|Ahtal-Ka;23;G;#c0a040;horn|Ahtal-Neset;23;G;#a08a40;fly=0,horn|Altaroth;0;S;#7a5a3a;fly=0,scale=.45|Bnahabra;1/4;S;#4a6a3a;scale=.5|Great Thunderbug;1/4;S;#e0e060;glow=#ffff60,scale=.5|Hornetaur;1/4;S;#3a2a2a;fly=0,horn,scale=.5|Konchu;1/4;S;#7a4aa0;fly=0,stripes=0,scale=.5|Seltas;3;L;#5a7a3a;horn|Seltas Queen;11;H;#3a5a2a;fly=0,horn|Vespoid;1/4;S;#d0a030;stinger,scale=.5|Vespoid Princess;1/2;M;#d0a030;stinger|Vespoid Queen;1;L;#d09020;stinger
pisc|Beotodus;12;H;#c0d0e0|Cephadrome;7;L;#c0a070|Cephalos;2;M;#c0a070|Delex;1/8;S;#a0a0a0;scale=.5|Gajau;1;M;#5a6a2a|Jyuratodus;11;H;#6a4a3a|Lavasioth;13;H;#2a2a2a|Plesioth;9;H;#3f8f7a
snake|Najarala;9;H;#3f7a5a|Remobra;1/4;S;#6a7a5a;scale=.5|Wingdrake;1/8;S;#4a8a8a;m=bird,scale=.6
temno|Nerscylla;6;L;#4a3a5a;mark=#e8e0d0|Fey Nerscylla;9;L;#8a6aa0;mark=#e8e0d0|Rachnoid;1;M;#3a3a3a|Rakna-Kadaki;17;H;#e8e0d0;eyec=#ff8030|Pyre Rakna-Kadaki;19;H;#3a2a2a;eyec=#ff6020,mark=#ff8030
thero|Baggi;1;M;#5a7aa0|Great Baggi;2;L;#4a6a90;crest=#e0e0e0|Boggi;1;M;#7a6a5a|Genprey;1/2;M;#d0b030|Gendrome;2;L;#c0a020;crest=#e04030|Giaprey;1/2;M;#80a0c0|Giadrome;2;L;#7090b0;crest=#e04030|Ioprey;1/2;M;#c0402a|Iodrome;1;L;#b0301a;crest=#e0a030|Izuchi;1;M;#c0a070;tailblade|Great Izuchi;3;L;#b09060;tailblade|Jaggi;1/2;M;#c07a4a|Jaggia;1;M;#a06a4a|Great Jaggi;2;L;#c07a4a;mane=#a05a3a|Kulu-Ya-Ku;4;L;#d0a07a;beak,head=#e8e0d0|Tempered Kulu-Ya-Ku;7;L;#c0906a;beak,head=#e8e0d0|Maccao;1/4;M;#3a7a6a|Great Maccao;2;L;#2a6a5a;crest=#e0c040|Tzitzi-Ya-Ku;6;L;#3a6a8a;beak,crest=#60e0ff,glow=#80f0ff|Velociprey;1/4;M;#3f6fbf|Velocidrome;1;L;#3f6fbf;crest=#e04030|Wroggi;1;M;#6a5aa0|Great Wroggi;2;L;#5a4a90;crest=#e0c040
unk|Gore Magala;21;H;#1a1a22;glow=#b060ff,eyeless|Tempered Gore Magala;21;H;#1a1a22;glow=#b060ff,eyeless|Chaotic Gore Magala;24;H;#4a3a2a;glow=#e0c060,horns|Shagaru Magala;25;H;#e0c070;glow=#ffe080,horns|Tempered Shagaru Magala;30;H;#d0b060;glow=#ffe080,horns|Leshen;12;L;#3a3a2a;m=hum,hat=horns,glow=#ff3030,thin,robe,skin=#d8d0c0|Ancient Leshen;21;H;#2a2a1a;m=hum,hat=horns,glow=#ff3030,thin,robe,skin=#d8d0c0,scale=1.2|Qurio;1/8;S;#5a2a2a;m=insect,scale=.45|Qurio Swarm;2;M;#5a2a2a;m=swarm
herb|Apceros;1/4;L;#5a6a8a;shell=#4a5a7a,spikes|Aptonoth;1/8;L;#8a8a5a;neck=.65,long=1.2,tall=.7|Anteka;1/8;M;#8a6a4a;horns|Bombadgy;1/8;M;#a07a5a;bodyh=.45|Epioth;1/8;L;#80a0c0;m=fish|Gargwa;1/4;M;#d0c060;m=bird|Gastodon;1;L;#7a7a6a;horn|Gowngoat;1/8;M;#e8e0d0;horns|Kelbi;0;S;#c09060;horns,scale=.6|Kestodon;1/4;M;#8a8a7a;crest=#c0a080|Larinoth;1/4;H;#8a8a6a;neck=.7,long=1.2,tall=.75|Mosswine;0;S;#c07a6a;mane=#5a8a3a,scale=.65|Moofah;0;M;#e8e8e0;mane=#e8e8e0|Palamute;1/2;M;#c0a070;ears=point|Popo;1/4;L;#6a5a4a;tusks,snout=.3|Rhenoplos;2;L;#a0907a;horn|Slagtoth;1/8;H;#7a7a5a;neck=.65,long=1.2
lyn|Boaboa;1/4;S;#7a5a3a;weapon=spear|Felyne;1;S;#e8d0a0;weapon=sword,body=#a0503a|Gajalaka;1/8;S;#8a6a4a;weapon=spear|Grimalkyne;1;S;#6a5a4a;weapon=dagger|Melynx;1;S;#2a2a2a;weapon=dagger|Wild Melynx;1/8;S;#3a3a3a|Shakalaka;1/8;S;#8a6a4a;weapon=spear,hat=crown|King Shakalaka;1;S;#8a6a4a;weapon=spear,hat=crown,scale=.7
endem|Dung Beetle;0;S;#3a3a2a|Bomb Beetle;0;S;#c04a2a|Forest Gekko;0;S;#5a9a4a;m=quad,long=1.3,scale=.4,ears=0|Iron Helmcrab;0;S;#7a7a7a;pincers|Nitrotoad;0;S;#c04a2a;m=quad,bodyh=.5,neck=.1,snout=.3,tall=.4,scale=.45|Paratoad;0;S;#d0c040;m=quad,bodyh=.5,neck=.1,snout=.3,tall=.4,scale=.45|Sleeptoad;0;S;#6a8ad0;m=quad,bodyh=.5,neck=.1,snout=.3,tall=.4,scale=.45|Soldier Helmcrab;0;S;#a07a4a;pincers|Vigorwasp;0;S;#5ac05a;m=insect,glow=#80ff80,scale=.4|Giant Vigorwasp;0;S;#5ac05a;m=insect,glow=#80ff80,scale=.55|Wiggler;0;S;#c08ab0;m=worm,scale=.4`;
const MH=[];
MH_DATA.split('\n').forEach(row=>{const parts=row.split('|'),cls=parts[0],C=MH_CLASS[cls];
  parts.slice(1).forEach(ent=>{const[name,cr,sz,col,fl]=ent.split(';');const flags=(fl||'').split(',').filter(Boolean),mf=flags.find(f=>f.startsWith('m=')),m=mf?mf.slice(2):C[1];
    const p=Object.assign({},mf?{}:C[3],{body:col});if(cls==='lyn')p.skin=col;
    flags.forEach(f=>{const[k,v]=f.split('=');if(k==='m')return;p[k]=v===undefined?1:(isNaN(+v)?v:+v);});
    if(p.ears===0)delete p.ears;
    const size={S:1,M:1,L:2,H:3,G:4}[sz]||1;MP[name]=[m,p];MH.push([name,C[2],size,'Hunter',cls,cr]);});});
CREATURES.push(...MH);CATS.Hunter='#c9772e';CAT_NAMES.Hunter='Monster Hunter';CAT_MODEL.Hunter='wyvern';

/* ================= tiny software 3D renderer ================= */
// A small, dependency-free 3D engine (smooth-shaded triangles, depth buffer, three lights, rim light and gloss).
// It renders each creature model offline into an image, so it works anywhere, including GitHub Pages, with no downloads.
const SR=(()=>{
  const A=Math.PI/6,CA=Math.cos(A),SA=Math.sin(A);
  class V3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z;}set(x,y,z){this.x=x;this.y=y;this.z=z;return this;}copy(v){this.x=v.x;this.y=v.y;this.z=v.z;return this;}
    clone(){return new V3(this.x,this.y,this.z);}add(v){this.x+=v.x;this.y+=v.y;this.z+=v.z;return this;}sub(v){this.x-=v.x;this.y-=v.y;this.z-=v.z;return this;}
    multiplyScalar(s){this.x*=s;this.y*=s;this.z*=s;return this;}length(){return Math.hypot(this.x,this.y,this.z);}normalize(){const l=this.length()||1;return this.multiplyScalar(1/l);}setScalar(s){this.x=this.y=this.z=s;return this;}}
  class V2{constructor(x,y){this.x=x;this.y=y;}}
  class Quat{constructor(){this.x=0;this.y=0;this.z=0;this.w=1;this.used=false;}
    setFromUnitVectors(a,b){let r=a.x*b.x+a.y*b.y+a.z*b.z+1,x,y,z;if(r<1e-6){r=0;if(Math.abs(a.x)>Math.abs(a.z)){x=-a.y;y=a.x;z=0;}else{x=0;y=-a.z;z=a.y;}}
      else{x=a.y*b.z-a.z*b.y;y=a.z*b.x-a.x*b.z;z=a.x*b.y-a.y*b.x;}const l=Math.hypot(x,y,z,r);this.x=x/l;this.y=y/l;this.z=z/l;this.w=r/l;this.used=true;return this;}}
  class Euler{constructor(){this.x=0;this.y=0;this.z=0;}set(x,y,z){this.x=x;this.y=y;this.z=z;return this;}}
  function compose(o){const s=o.scale,p=o.position;let r;
    if(o.quaternion.used){const{x,y,z,w}=o.quaternion;r=[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w),2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w),2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)];}
    else{const{x,y,z}=o.rotation,cx=Math.cos(x),sx=Math.sin(x),cy=Math.cos(y),sy=Math.sin(y),cz=Math.cos(z),sz=Math.sin(z);
      r=[cy*cz,-cy*sz,sy,cx*sz+sx*sy*cz,cx*cz-sx*sy*sz,-sx*cy,sx*sz-cx*sy*cz,sx*cz+cx*sy*sz,cx*cy];}
    return[r[0]*s.x,r[1]*s.y,r[2]*s.z,p.x,r[3]*s.x,r[4]*s.y,r[5]*s.z,p.y,r[6]*s.x,r[7]*s.y,r[8]*s.z,p.z];}
  function mul(a,b){return[a[0]*b[0]+a[1]*b[4]+a[2]*b[8],a[0]*b[1]+a[1]*b[5]+a[2]*b[9],a[0]*b[2]+a[1]*b[6]+a[2]*b[10],a[0]*b[3]+a[1]*b[7]+a[2]*b[11]+a[3],
    a[4]*b[0]+a[5]*b[4]+a[6]*b[8],a[4]*b[1]+a[5]*b[5]+a[6]*b[9],a[4]*b[2]+a[5]*b[6]+a[6]*b[10],a[4]*b[3]+a[5]*b[7]+a[6]*b[11]+a[7],
    a[8]*b[0]+a[9]*b[4]+a[10]*b[8],a[8]*b[1]+a[9]*b[5]+a[10]*b[9],a[8]*b[2]+a[9]*b[6]+a[10]*b[10],a[8]*b[3]+a[9]*b[7]+a[10]*b[11]+a[11]];}
  class Obj{constructor(){this.position=new V3();this.scale=new V3(1,1,1);this.rotation=new Euler();this.quaternion=new Quat();this.children=[];this.parent=null;this.mw=[1,0,0,0,0,1,0,0,0,0,1,0];}
    add(c){this.children.push(c);c.parent=this;return this;}remove(c){const i=this.children.indexOf(c);if(i>=0)this.children.splice(i,1);c.parent=null;return this;}
    traverse(f){f(this);for(const c of this.children)c.traverse(f);}updateMatrixWorld(){const l=compose(this);this.mw=this.parent?mul(this.parent.mw,l):l;for(const c of this.children)c.updateMatrixWorld();}}
  class Group extends Obj{}
  class Mesh extends Obj{constructor(g,m){super();this.geometry=g;this.material=m;}}
  class Color{constructor(c){this.set(c);}set(c){let r=.5,g=.5,b=.5;
    if(typeof c==='number'){r=((c>>16)&255)/255;g=((c>>8)&255)/255;b=(c&255)/255;}
    else if(typeof c==='string'){if(c[0]==='#'){const n=parseInt(c.slice(1,7),16);r=(n>>16)/255;g=((n>>8)&255)/255;b=(n&255)/255;}else{const m=c.match(/[\d.]+/g)||[128,128,128];r=m[0]/255;g=m[1]/255;b=m[2]/255;}}
    this.r=r;this.g=g;this.b=b;return this;}}
  const lin=v=>Math.pow(v,2.2);
  class MeshStandardMaterial{constructor(o){Object.assign(this,{roughness:.6,metalness:0,flatShading:false,transparent:false,opacity:1,side:0,emissive:null,emissiveIntensity:1},o);
    if(!(this.color instanceof Color))this.color=new Color(this.color||'#888');}
    lin(){const c=this.color,e=this.emissive;return this._l||(this._l={r:lin(c.r),g:lin(c.g),b:lin(c.b),er:e?lin(e.r)*this.emissiveIntensity:0,eg:e?lin(e.g)*this.emissiveIntensity:0,eb:e?lin(e.b)*this.emissiveIntensity:0});}}
  class Geo{constructor(pos,nrm,idx){this.pos=pos||new Float32Array(0);this.nrm=nrm||null;this.idx=idx||null;this.userData={};}
    setAttribute(n,a){if(n==='position')this.pos=a.array;}computeVertexNormals(){}dispose(){}}
  class BufferGeometry extends Geo{}
  class Float32BufferAttribute{constructor(arr){this.array=new Float32Array(arr);}}
  function SphereGeometry(r=1,ws=18,hs=12,phS=0,phL=Math.PI*2,thS=0,thL=Math.PI){ws=Math.min(ws,24);hs=Math.min(hs,16);const p=[],n=[],ix=[];
    for(let y=0;y<=hs;y++){const th=thS+y/hs*thL;for(let x=0;x<=ws;x++){const ph=phS+x/ws*phL,nx=-Math.cos(ph)*Math.sin(th),ny=Math.cos(th),nz=Math.sin(ph)*Math.sin(th);p.push(nx*r,ny*r,nz*r);n.push(nx,ny,nz);}}
    for(let y=0;y<hs;y++)for(let x=0;x<ws;x++){const a=y*(ws+1)+x,b=a+ws+1;ix.push(a,b,a+1,b,b+1,a+1);}return new Geo(new Float32Array(p),new Float32Array(n),ix);}
  function CylinderGeometry(rt=1,rb=1,h=1,rs=14,hs=1,open=false){rs=Math.min(rs,16);const p=[],n=[],ix=[],sl=(rb-rt)/h;
    for(let y=0;y<=1;y++){const yy=-h/2+y*h,r=y?rt:rb;for(let x=0;x<=rs;x++){const a=x/rs*Math.PI*2,c=Math.cos(a),s=Math.sin(a),l=Math.hypot(1,sl);p.push(r*c,yy,r*s);n.push(c/l,sl/l,s/l);}}
    for(let x=0;x<rs;x++)ix.push(x,x+rs+1,x+1,x+rs+1,x+rs+2,x+1);
    if(!open)for(const top of[0,1]){const r=top?rt:rb,yy=top?h/2:-h/2,base=p.length/3;p.push(0,yy,0);n.push(0,top?1:-1,0);
      for(let x=0;x<=rs;x++){const a=x/rs*Math.PI*2;p.push(r*Math.cos(a),yy,r*Math.sin(a));n.push(0,top?1:-1,0);}for(let x=0;x<rs;x++)ix.push(base,base+1+x,base+2+x);}
    return new Geo(new Float32Array(p),new Float32Array(n),ix);}
  const ConeGeometry=(r=1,h=1,rs=14)=>CylinderGeometry(0,r,h,rs,1,false);
  function BoxGeometry(){const p=[],n=[],ix=[];const F=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
    for(const[a,b,c]of F){const u=b?[1,0,0]:[0,1,0],v=[b*u[2]-c*u[1],c*u[0]-a*u[2],a*u[1]-b*u[0]],base=p.length/3;
      for(const[s,t]of[[-1,-1],[1,-1],[1,1],[-1,1]]){p.push(a*.5+u[0]*s*.5+v[0]*t*.5,b*.5+u[1]*s*.5+v[1]*t*.5,c*.5+u[2]*s*.5+v[2]*t*.5);n.push(a,b,c);}ix.push(base,base+1,base+2,base,base+2,base+3);}
    return new Geo(new Float32Array(p),new Float32Array(n),ix);}
  const IcosahedronGeometry=(r=1)=>SphereGeometry(r,7,5);
  function TorusGeometry(R=1,tb=.3,rs=8,ts=20,arc=Math.PI*2){rs=Math.min(rs,10);ts=Math.min(ts,24);const p=[],n=[],ix=[];
    for(let j=0;j<=rs;j++)for(let i=0;i<=ts;i++){const u=i/ts*arc,v=j/rs*Math.PI*2,cx=R*Math.cos(u),cy=R*Math.sin(u),nx=Math.cos(v)*Math.cos(u),ny=Math.cos(v)*Math.sin(u),nz=Math.sin(v);
      p.push(cx+tb*nx,cy+tb*ny,tb*nz);n.push(nx,ny,nz);}
    for(let j=0;j<rs;j++)for(let i=0;i<ts;i++){const a=(ts+1)*j+i,b=(ts+1)*(j+1)+i;ix.push(a,b,a+1,b,b+1,a+1);}return new Geo(new Float32Array(p),new Float32Array(n),ix);}
  function LatheGeometry(pts,segs=20){segs=Math.min(segs,20);const p=[],n=[],ix=[];
    for(let i=0;i<=segs;i++){const a=i/segs*Math.PI*2,c=Math.cos(a),s=Math.sin(a);pts.forEach((q,k)=>{const q0=pts[Math.max(0,k-1)],q1=pts[Math.min(pts.length-1,k+1)],dr=q1.x-q0.x,dy=q1.y-q0.y,l=Math.hypot(dr,dy)||1;
      p.push(q.x*s,q.y,q.x*c);n.push(dy/l*s,-dr/l,dy/l*c);});}
    const m=pts.length;for(let i=0;i<segs;i++)for(let k=0;k<m-1;k++){const a=i*m+k,b=(i+1)*m+k;ix.push(a,b,a+1,b,b+1,a+1);}return new Geo(new Float32Array(p),new Float32Array(n),ix);}
  class Box3{constructor(){this.min=new V3(1e9,1e9,1e9);this.max=new V3(-1e9,-1e9,-1e9);}
    setFromObject(o){o.updateMatrixWorld();o.traverse(m=>{if(!m.geometry)return;const w=m.mw,P=m.geometry.pos;
      for(let i=0;i<P.length;i+=3){const x=P[i],y=P[i+1],z=P[i+2],X=w[0]*x+w[1]*y+w[2]*z+w[3],Y=w[4]*x+w[5]*y+w[6]*z+w[7],Z=w[8]*x+w[9]*y+w[10]*z+w[11];
        if(X<this.min.x)this.min.x=X;if(Y<this.min.y)this.min.y=Y;if(Z<this.min.z)this.min.z=Z;if(X>this.max.x)this.max.x=X;if(Y>this.max.y)this.max.y=Y;if(Z>this.max.z)this.max.z=Z;}});return this;}}
  // Lights (world space): warm key from the upper left front, cool rim from behind, soft fill, sky/ground ambience.
  const nz=(x,y,z)=>{const l=Math.hypot(x,y,z);return[x/l,y/l,z/l];};
  const KEY=nz(-3,6,4),RIM=nz(3,3,-4),FILL=nz(4,1.5,3),VW=[0,SA,CA],HK=nz(KEY[0]+VW[0],KEY[1]+VW[1],KEY[2]+VW[2]);
  class Renderer{constructor(S){this.S=S;const c=document.createElement('canvas');c.width=c.height=S;this.domElement=c;this.ctx=c.getContext('2d');this.img=this.ctx.createImageData(S,S);
      this.zb=new Float32Array(S*S);this.cb=new Float32Array(S*S*4);this.yb=new Float32Array(S*S);this.nb=new Float32Array(S*S*3);this.ib=new Int32Array(S*S);this.mid=0;}
    render(scene){const S=this.S;this.zb.fill(-1e9);this.cb.fill(0);this.ib.fill(0);this.mid=0;scene.updateMatrixWorld();const op=[],tr=[];
      scene.traverse(o=>{if(o.geometry&&o.material)(o.material.transparent?tr:op).push(o);});
      for(const m of op)this.draw(m,false);tr.sort((a,b)=>(a.mw[7]*SA+a.mw[11]*CA)-(b.mw[7]*SA+b.mw[11]*CA));for(const m of tr)this.draw(m,true);
      const d=this.img.data,cb=this.cb;for(let i=0;i<S*S;i++){const a=cb[i*4+3],j=i*4;if(a<=.001){d[j+3]=0;continue;}
        for(let k=0;k<3;k++){let v=cb[j+k]/a;v=v/(1+v*.08);d[j+k]=Math.min(255,Math.pow(Math.min(1,v),1/2.2)*255);}d[j+3]=Math.min(255,a*255);}
      // ink: silhouettes and depth jumps get a dark line; creases where two parts meet get a softer line
      const zb=this.zb,nb=this.nb,ib=this.ib;for(let y=1;y<S-1;y++)for(let x=1;x<S-1;x++){const i=y*S+x;if(zb[i]<-1e8)continue;const z=zb[i];let ed=0;
        for(const n of[i-1,i+1,i-S,i+S]){const zn=zb[n];if(zn<-1e8||Math.abs(zn-z)>.3){ed=1;break;}
          }
        if(ed){const j=i*4,f=1-ed*.6;d[j]*=f;d[j+1]*=f;d[j+2]*=f*1.03;}}
      if(!this.noBlit)this.ctx.putImageData(this.img,0,0);return this.img.data;}
    draw(m,blend){const S=this.S,g=m.geometry,w=m.mw,P=g.pos,N=g.nrm,nv=P.length/3,mat=m.material,L=mat.lin(),ds=mat.side===2,flat=mat.flatShading,op=blend?mat.opacity:1;
      // inverse transpose for normals
      const a=w[0],b=w[1],c=w[2],d=w[4],e=w[5],f=w[6],gg=w[8],h=w[9],ii=w[10],det=a*(e*ii-f*h)-b*(d*ii-f*gg)+c*(d*h-e*gg)||1e-9;
      const it=[(e*ii-f*h)/det,-(d*ii-f*gg)/det,(d*h-e*gg)/det,-(b*ii-c*h)/det,(a*ii-c*gg)/det,-(a*h-b*gg)/det,(b*f-c*e)/det,-(a*f-c*d)/det,(a*e-b*d)/det];
      const sxl=Math.hypot(w[0],w[4],w[8]),syl=Math.hypot(w[1],w[5],w[9]),szl=Math.hypot(w[2],w[6],w[10]),lya=new Float32Array(nv);
      const sx=new Float32Array(nv),sy=new Float32Array(nv),sz=new Float32Array(nv),wy=new Float32Array(nv),wxa=new Float32Array(nv),wza=new Float32Array(nv),wn=new Float32Array(nv*3),k=S/3.4,yb=this.yb,nb=this.nb,ib=this.ib,mid=++this.mid,tex=mat.tex||0;
      for(let v=0;v<nv;v++){const x=P[v*3],y=P[v*3+1],z=P[v*3+2],X=w[0]*x+w[1]*y+w[2]*z+w[3],Y=w[4]*x+w[5]*y+w[6]*z+w[7],Z=w[8]*x+w[9]*y+w[10]*z+w[11];
        sx[v]=(X+1.7)*k;sy[v]=(1.9-((Y-1)*CA-Z*SA))*k;sz[v]=(Y-1)*SA+Z*CA;wy[v]=Y;wxa[v]=x*sxl;lya[v]=y*syl;wza[v]=z*szl;
        if(N){const nx=N[v*3],ny=N[v*3+1],nz_=N[v*3+2];let X2=it[0]*nx+it[1]*ny+it[2]*nz_,Y2=it[3]*nx+it[4]*ny+it[5]*nz_,Z2=it[6]*nx+it[7]*ny+it[8]*nz_;const l=Math.hypot(X2,Y2,Z2)||1;wn[v*3]=X2/l;wn[v*3+1]=Y2/l;wn[v*3+2]=Z2/l;}}
      const idx=g.idx,nt=idx?idx.length/3:nv/3,zb=this.zb,cb=this.cb;
      for(let t=0;t<nt;t++){const i0=idx?idx[t*3]:t*3,i1=idx?idx[t*3+1]:t*3+1,i2=idx?idx[t*3+2]:t*3+2;
        const x0=sx[i0],y0=sy[i0],x1=sx[i1],y1=sy[i1],x2=sx[i2],y2=sy[i2],area=(x1-x0)*(y2-y0)-(x2-x0)*(y1-y0);if(Math.abs(area)<1e-6)continue;
        let fnx,fny,fnz;{ // face normal from world-ish positions via screen + depth is unreliable; use averaged vertex normals or reconstruct
          if(N&&!flat){fnx=0;fny=0;fnz=0;}else{const ax=(P[i1*3]-P[i0*3]),ay=(P[i1*3+1]-P[i0*3+1]),az=(P[i1*3+2]-P[i0*3+2]),bx=(P[i2*3]-P[i0*3]),by=(P[i2*3+1]-P[i0*3+1]),bz=(P[i2*3+2]-P[i0*3+2]);
            let cx_=ay*bz-az*by,cy_=az*bx-ax*bz,cz_=ax*by-ay*bx;let X2=it[0]*cx_+it[1]*cy_+it[2]*cz_,Y2=it[3]*cx_+it[4]*cy_+it[5]*cz_,Z2=it[6]*cx_+it[7]*cy_+it[8]*cz_;const l=Math.hypot(X2,Y2,Z2)||1;fnx=X2/l;fny=Y2/l;fnz=Z2/l;
            if(N&&flat){const ax2=wn[i0*3]+wn[i1*3]+wn[i2*3],ay2=wn[i0*3+1]+wn[i1*3+1]+wn[i2*3+1],az2=wn[i0*3+2]+wn[i1*3+2]+wn[i2*3+2];if(fnx*ax2+fny*ay2+fnz*az2<0){fnx=-fnx;fny=-fny;fnz=-fnz;}}}}
        const minx=Math.max(0,Math.floor(Math.min(x0,x1,x2))),maxx=Math.min(S-1,Math.ceil(Math.max(x0,x1,x2))),miny=Math.max(0,Math.floor(Math.min(y0,y1,y2))),maxy=Math.min(S-1,Math.ceil(Math.max(y0,y1,y2)));
        const inv=1/area,z0=sz[i0],z1=sz[i1],z2=sz[i2];
        for(let py=miny;py<=maxy;py++){const yc=py+.5;for(let px=minx;px<=maxx;px++){const xc=px+.5;
          const w0=((x1-xc)*(y2-yc)-(x2-xc)*(y1-yc))*inv,w1=((x2-xc)*(y0-yc)-(x0-xc)*(y2-yc))*inv,w2=1-w0-w1;if(w0<-2e-3||w1<-2e-3||w2<-2e-3)continue;
          const z=w0*z0+w1*z1+w2*z2,pi=py*S+px;if(z<=zb[pi])continue;
          let nx,ny,nz2;if(N&&!flat){nx=w0*wn[i0*3]+w1*wn[i1*3]+w2*wn[i2*3];ny=w0*wn[i0*3+1]+w1*wn[i1*3+1]+w2*wn[i2*3+1];nz2=w0*wn[i0*3+2]+w1*wn[i1*3+2]+w2*wn[i2*3+2];const l=Math.hypot(nx,ny,nz2)||1;nx/=l;ny/=l;nz2/=l;}else{nx=fnx;ny=fny;nz2=fnz;}
          let vd=nx*VW[0]+ny*VW[1]+nz2*VW[2];if(vd<0&&(ds||!N)){nx=-nx;ny=-ny;nz2=-nz2;vd=-vd;}
          const hemi=.5+.5*ny,ar=.18+.17*hemi,ag=.17+.18*hemi,ab=.15+.24*hemi;
          const dk=Math.max(0,nx*KEY[0]+ny*KEY[1]+nz2*KEY[2])*1.35,dr=Math.max(0,nx*RIM[0]+ny*RIM[1]+nz2*RIM[2])*.55,df=Math.max(0,nx*FILL[0]+ny*FILL[1]+nz2*FILL[2])*.3;
          const sst=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);},dkq=.62*sst(.12,.3,dk)+.68*sst(.62,.85,dk),dkk=dk*.62+dkq*.38;
          let tv=0;if(tex){const X=w0*wxa[i0]+w1*wxa[i1]+w2*wxa[i2],Yw=w0*lya[i0]+w1*lya[i1]+w2*lya[i2],Z=w0*wza[i0]+w1*wza[i1]+w2*wza[i2];
            const ss=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
            if(tex===1){const u=X*13+Z*5,v=Yw*13+(Math.floor(X*13+Z*5)&1)*.5,fu=u-Math.floor(u)-.5,fv=v-Math.floor(v)-.5;tv=.03-ss(.12,.3,fu*fu+fv*fv)*.28;}
            else if(tex===2)tv=(Math.sin(X*31+Math.sin(Yw*7)*2.2)+Math.sin(Z*29+Yw*6.3))*.05;
            else if(tex===3)tv=(Math.sin(X*11+Math.sin(Z*7)*2)*Math.sin(Yw*10+Math.sin(X*6)*2))*.14;
            else if(tex===4)tv=Math.sin((X+Z)*40)*.035+Math.sin(Yw*30)*.03;
            else if(tex===5)tv=Math.sin(Yw*26+Math.sin(X*7+Z*6)*2.2)*.12-.03;}
          const tm=1+tv,met=mat.metalness,rough=mat.roughness,kd=(1-met*.55)*tm;
          const R=L.r*(ar+dkk*1.0+dr*.66+df*1.0)*kd,G=L.g*(ag+dkk*.94+dr*.82+df*.85)*kd,B=L.b*(ab+dkk*.86+dr*1.0+df*.7)*kd;
          const sh=Math.pow(Math.max(0,nx*HK[0]+ny*HK[1]+nz2*HK[2]),5+(1-rough)*18)*(.03+(1-rough)*.32),sR=sh*(1-met+met*L.r*2),sG=sh*(1-met+met*L.g*2),sB=sh*(1-met+met*L.b*2);
          const rim=Math.pow(1-Math.max(0,vd),3)*.28;
          const Yp=w0*wy[i0]+w1*wy[i1]+w2*wy[i2],ao=Yp<.45?.6+.4*Math.max(0,Yp)/.45:1;
          const cr=(R+sR)*ao+rim*.6+L.er,cg=(G+sG)*ao+rim*.75+L.eg,cbb=(B+sB)*ao+rim*1.0+L.eb,j=pi*4;
          if(!blend){cb[j]=cr;cb[j+1]=cg;cb[j+2]=cbb;cb[j+3]=1;zb[pi]=z;yb[pi]=Yp;nb[pi*3]=nx;nb[pi*3+1]=ny;nb[pi*3+2]=nz2;ib[pi]=mid;}
          else{const a0=cb[j+3];cb[j]=cb[j]*(1-op)+cr*op;cb[j+1]=cb[j+1]*(1-op)+cg*op;cb[j+2]=cb[j+2]*(1-op)+cbb*op;cb[j+3]=a0+op*(1-a0);}}}}}}
  return{V3,Vector3:V3,Vector2:V2,Group,Mesh,Color,MeshStandardMaterial,BufferGeometry,Float32BufferAttribute,Box3,Renderer,DoubleSide:2,FrontSide:0,
    SphereGeometry:(...a)=>SphereGeometry(...a),CylinderGeometry:(...a)=>CylinderGeometry(...a),ConeGeometry:(...a)=>ConeGeometry(...a),BoxGeometry:()=>BoxGeometry(),
    IcosahedronGeometry:(...a)=>IcosahedronGeometry(...a),TorusGeometry:(...a)=>TorusGeometry(...a),LatheGeometry:(...a)=>LatheGeometry(...a)};
})();

/* ================= real 3D creature models (rendered with three.js) ================= */
// Each creature is built from rounded 3D shapes, lit like a painted miniature, rendered once into a small
// animation strip, then drawn on the map. If 3D graphics aren't available, the flat painted models are used instead.
const M3={S:192,F:16,ok:false,failed:false,cache:new Map(),queue:[],geo:{},mats:new Map(),FOOT:.8135};
function init3D(){
  if(M3.ok)return true;if(M3.failed)return false;
  try{M3.SS=M3.S*2;M3.r=new SR.Renderer(M3.SS);M3.r.noBlit=true;M3.sc=new SR.Group();M3.ok=true;return true;}catch(e){M3.failed=true;return false;}
}
function gGeo(k,mk){return M3.geo[k]||(M3.geo[k]=mk());}
function mat3(col,o){o=o||{};const k=col+'|'+(o.r||'')+(o.m||'')+(o.e||'')+(o.op||'')+(o.ds?1:0)+(o.flat?1:0)+(o.ei||'')+'|'+(o.tex||0);let m=M3.mats.get(k);
  if(!m){const T3=SR;m=new T3.MeshStandardMaterial({color:new T3.Color(col),roughness:o.r!=null?o.r:.58,metalness:o.m||.04,flatShading:!!o.flat,
    transparent:o.op!=null,opacity:o.op!=null?o.op:1,side:o.ds?T3.DoubleSide:T3.FrontSide});
    m.tex=o.tex||0;if(o.e){m.emissive=new T3.Color(o.e);m.emissiveIntensity=o.ei||1.3;}M3.mats.set(k,m);}return m;}
function mesh3(g,geo,m,x,y,z,sx,sy,sz){const ms=new SR.Mesh(geo,m);ms.position.set(x,y,z);ms.scale.set(sx,sy==null?sx:sy,sz==null?sx:sz);ms.castShadow=true;g.add(ms);return ms;}
const SPH=()=>gGeo('s',()=>SR.SphereGeometry(1,24,18));
const BOX=()=>gGeo('b',()=>SR.BoxGeometry(1,1,1));
const ICO=()=>gGeo('i',()=>SR.IcosahedronGeometry(1,1));
function ball(g,c,x,y,z,sx,sy,sz,o){return mesh3(g,SPH(),mat3(c,o),x,y,z,sx,sy,sz);}
function box3(g,c,x,y,z,sx,sy,sz,o){return mesh3(g,BOX(),mat3(c,o),x,y,z,sx,sy,sz);}
function orient(m,a,b){const T3=SR,va=new T3.Vector3(a[0],a[1],a[2]),vb=new T3.Vector3(b[0],b[1],b[2]),d=vb.clone().sub(va),len=d.length();
  m.position.copy(va).add(vb).multiplyScalar(.5);if(len>1e-5)m.quaternion.setFromUnitVectors(new T3.Vector3(0,1,0),d.normalize());return len;}
function seg(g,a,b,r0,r1,c,o,joint){const q=Math.max(.05,Math.round(r1/Math.max(r0,1e-4)*20)/20),geo=gGeo('c'+q,()=>SR.CylinderGeometry(q,1,1,16,1,true));
  const m=new SR.Mesh(geo,mat3(c,o));const len=orient(m,a,b);m.scale.set(r0,len,r0);m.castShadow=true;g.add(m);if(joint!==false)ball(g,c,b[0],b[1],b[2],r1,r1,r1,o);}
function chain(g,pts,r0,r1,c,o){ball(g,c,pts[0][0],pts[0][1],pts[0][2],r0,r0,r0,o);for(let i=1;i<pts.length;i++){const ra=r0+(r1-r0)*(i-1)/(pts.length-1),rb=r0+(r1-r0)*i/(pts.length-1);seg(g,pts[i-1],pts[i],ra,rb,c,o);}}
function spike(g,a,b,r,c,o){const m=new SR.Mesh(gGeo('cone',()=>SR.ConeGeometry(1,1,14)),mat3(c,o));const len=orient(m,a,b);m.scale.set(r,len,r);m.castShadow=true;g.add(m);}
function membrane(g,pts,c,o){const T3=SR,geo=new T3.BufferGeometry(),v=[];for(let i=1;i<pts.length-1;i++)v.push(...pts[0],...pts[i],...pts[i+1]);
  geo.setAttribute('position',new T3.Float32BufferAttribute(v,3));geo.computeVertexNormals();geo.userData.tmp=1;const m=new T3.Mesh(geo,mat3(c,Object.assign({ds:1,r:.8},o)));m.castShadow=true;g.add(m);}
function curve3(a,b,c,n){const pts=[];for(let i=0;i<=n;i++){const t=i/n,u=1-t;pts.push([u*u*a[0]+2*u*t*b[0]+t*t*c[0],u*u*a[1]+2*u*t*b[1]+t*t*c[1],u*u*a[2]+2*u*t*b[2]+t*t*c[2]]);}return pts;}
function eyes3(g,x,y,z,d,r,c){const o=c?{e:c,ei:2}:{r:.2};const col=c||'#151015';ball(g,col,x,y,z+d,r,r,r,o);ball(g,col,x,y,z-d,r,r,r,o);}
function wing3(g,root,s,flap,c,scale,feather){const k=scale||1,[x,y,z]=root,f=flap;
  const arm=[x+.12*k,y+(.62+f*.3)*k,z+s*.38*k],tips=[[x+.3*k,y+(1.3+f*.55)*k,z+s*.62*k],[x-.35*k,y+(1.22+f*.45)*k,z+s*.88*k],[x-.95*k,y+(.9+f*.3)*k,z+s*.86*k],[x-1.38*k,y+(.38+f*.12)*k,z+s*.55*k]],back=[x-.75*k,y-.02*k,z+s*.12*k];
  const memC=feather?c:shade(c,.78),pull=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
  const edge=[...tips,back];for(let i=0;i<edge.length-1;i++){const a=edge[i],b=edge[i+1],mid=pull(pull(a,b,.5),arm,feather?.05:.28);membrane(g,[arm,a,mid,b],memC,{});}
  membrane(g,[root,arm,back],memC,{});
  if(!feather){seg(g,root,arm,.075*k,.06*k,shade(c,.6),{});seg(g,arm,tips[0],.05*k,.03*k,shade(c,.55),{},false);for(let i=1;i<4;i++)seg(g,arm,tips[i],.035*k,.012*k,shade(c,.5),{},false);
    spike(g,arm,[arm[0]+.12*k,arm[1]+.12*k,arm[2]],.03*k,'#e8dcc0');}
  else for(let i=0;i<4;i++)spike(g,tips[i],[tips[i][0]-.22*k,tips[i][1]-.06*k,tips[i][2]],.07*k,shade(c,.75));}
const STEEL={m:.75,r:.28},GOLD={m:.8,r:.3};
function prop3(g,k,h,ph){const[x,y,z]=h;
  switch(k){
    case 'sword':seg(g,[x,y-.04,z],[x+.08,y+.9,z],.04,.015,'#dfe3e8',STEEL,false);box3(g,'#c9a03d',x+.01,y+.06,z,.28,.04,.06,GOLD);seg(g,[x,y-.2,z],[x,y,z],.03,.03,'#5a3a20');break;
    case 'dagger':seg(g,[x,y,z],[x+.05,y+.42,z],.03,.01,'#dfe3e8',STEEL,false);box3(g,'#6b4a2a',x,y+.02,z,.14,.03,.05);break;
    case 'axe':seg(g,[x,y-.3,z],[x+.05,y+.75,z],.03,.03,'#6b4a2a');ball(g,'#c8ccd2',x+.18,y+.62,z,.18,.14,.03,STEEL);break;
    case 'spear':seg(g,[x-.06,y-.6,z],[x+.1,y+1.05,z],.025,.025,'#6b4a2a');spike(g,[x+.1,y+1.03,z],[x+.13,y+1.3,z],.05,'#dfe3e8',STEEL);break;
    case 'club':seg(g,[x,y-.05,z],[x+.12,y+.7,z],.04,.11,'#7a5634');break;
    case 'mace':seg(g,[x,y-.1,z],[x+.05,y+.55,z],.03,.03,'#6b4a2a');ball(g,'#aab0b8',x+.06,y+.62,z,.1,.1,.1,STEEL);break;
    case 'hammer':seg(g,[x,y-.1,z],[x+.04,y+.7,z],.03,.03,'#6b4a2a');box3(g,'#8a8f96',x+.04,y+.72,z,.32,.16,.16,STEEL);break;
    case 'bow':{const m=new SR.Mesh(gGeo('bow',()=>SR.TorusGeometry(.5,.025,8,24,Math.PI*.8)),mat3('#7a5634'));m.position.set(x-.05,y+.1,z);m.rotation.z=Math.PI*.6;g.add(m);break;}
    case 'staff':seg(g,[x-.02,y-.75,z],[x+.06,y+1.0,z],.03,.025,'#6b4a2a');ball(g,'#bfe8ff',x+.06,y+1.08,z,.09,.09,.09,{e:'#7fd0ff',ei:2.5});break;
    case 'leafstaff':seg(g,[x-.02,y-.75,z],[x+.06,y+1.0,z],.03,.025,'#5a3a20');for(let i=0;i<3;i++)ball(g,'#5a9a3a',x+.06+i*.05,y+.95+i*.04,z,.08,.05,.05);break;
    case 'orb':ball(g,'#c08cff',x+.05,y+.18,z,.1,.1,.1,{e:'#a060ff',ei:2.5});break;
    case 'holy':ball(g,'#ffe08a',x+.05,y+.2,z,.07,.07,.07,{e:'#ffd060',ei:2.5});seg(g,[x,y-.2,z],[x+.04,y+.15,z],.025,.025,'#6b4a2a');break;
    case 'lute':ball(g,'#a0703a',x-.05,y+.05,z+.05,.16,.2,.07);seg(g,[x-.05,y+.15,z+.05],[x+.15,y+.55,z+.05],.025,.02,'#5a3a20');break;
    case 'torch':seg(g,[x,y-.1,z],[x+.03,y+.4,z],.03,.03,'#5a3a20');spike(g,[x+.03,y+.4,z],[x+.04,y+.6,z],.06,'#ffb040',{e:'#ff8020',ei:3});break;
  }}
// ---- upgraded anatomy: defined muscles, tapered snouts, proper joints, walk cycles, surface textures ----
const STX={scales:1,fur:2,stone:3,cloth:4,bark:5,chitin:6};
const cyc=ph=>Math.sin(ph*6.283),lift=(ph,o)=>Math.max(0,Math.sin(ph*6.283+o))*1;
function snout(g,from,to,r0,r1,c,o){seg(g,from,to,r0,r1,c,o,false);ball(g,c,to[0],to[1],to[2],r1,r1*.9,r1,o);}
function hornC(g,base,dir,len,r,c){const p1=[base[0]+dir[0]*len*.5,base[1]+dir[1]*len*.5+len*.12,base[2]+dir[2]*len*.5],p2=[base[0]+dir[0]*len,base[1]+dir[1]*len,base[2]+dir[2]*len];
  seg(g,base,p1,r,r*.6,c,{r:.35},false);spike(g,p1,p2,r*.6,c,{r:.35});}
function h3Hum(g,p,ph){
  const A=cyc(ph),B=cyc(ph+.25),bo=p.body||'#7a8490',sk=p.bone?'#e6dcc4':(p.skin||'#d8a57a'),le=p.bone?sk:(p.legs||shade(bo,.62)),th=p.thin?.62:1,bk=(p.bulk||.34)/.34,hu=p.hunch?.16:0;
  const armored=p.hat==='helm'||p.shield,met=armored?STEEL:{},cl={tex:STX.cloth},sway=A*.025,breathe=1+B*.02;
  // legs with knees and boots
  if(p.robe){const prof=[[.0,.0],[.5,.02],[.48,.25],[.4,.6],[.32,.95],[.27,1.15],[.0,1.18]].map(([r,h])=>new SR.Vector2(r*bk,h));const geo=SR.LatheGeometry(prof,20);geo.userData.tmp=1;mesh3(g,geo,mat3(bo,cl),sway,0,0,1);
    for(let i=0;i<5;i++){const a=-1.2+i*.6;seg(g,[sway+Math.cos(a)*.3*bk,1.0,Math.sin(a)*.3*bk],[sway+Math.cos(a)*.46*bk,.08,Math.sin(a)*.46*bk],.035,.05,shade(bo,.8),cl,false);}}
  else for(const s of[-1,1]){const kx=.08+(s>0?A:-A)*.02,kn=[kx,.55,s*.15],hip=[sway,1.02,s*.13],an=[.02,.12,s*.16];
    seg(g,hip,kn,.13*th*bk,.095*th,le,cl);seg(g,kn,an,.095*th,.07*th,le,cl);
    ball(g,p.bone?sk:shade(le,.5),.1,.07,s*.16,.16*th,.08,.1*th,{r:.45});}
  // torso: hips, waist, chest
  if(p.bone){seg(g,[0,1.0,0],[0,1.62,0],.04,.04,sk);for(let i=0;i<4;i++){const m=new SR.Mesh(gGeo('rib',()=>SR.TorusGeometry(.22,.025,6,18,Math.PI*1.3)),mat3(sk));m.position.set(.02,1.52-i*.11,0);m.rotation.set(Math.PI/2,0,-Math.PI*.15);m.scale.setScalar(1-i*.08);g.add(m);}
    ball(g,sk,0,1.0,0,.2,.09,.17);}
  else{if(!p.robe)ball(g,shade(bo,.85),sway,1.05,0,.24*bk,.15,.2*bk,cl);ball(g,bo,sway+hu*.3,1.25,0,.22*bk,.18,.19*bk,cl);
    if(!armored)ball(g,bo,sway+hu*.45,1.47*breathe,0,.29*bk,.22*breathe,.23*bk,cl);
    if(armored){ball(g,'#b8bfc8',sway+hu*.45+.05,1.47*breathe,0,.3*bk,.23*breathe,.245*bk,STEEL);seg(g,[sway+.3*bk,1.3,0],[sway+.3*bk,1.62,0],.02,.02,'#d0d6dc',STEEL,false);}
    if(!p.robe){const m=new SR.Mesh(gGeo('belt',()=>SR.CylinderGeometry(1,1,1,20)),mat3(shade(bo,.35),{r:.5}));m.position.set(sway,1.12,0);m.scale.set(.25*bk,.06,.21*bk);g.add(m);ball(g,'#c9a03d',sway+.25*bk,1.12,0,.04,.035,.03,GOLD);}}
  if(p.cape){const f=A*.06,f2=B*.05;membrane(g,[[sway-.1,1.62,0],[sway-.12,1.64,.3],[sway-.32+f,.9,.42],[sway-.42+f2,.12,.46],[sway-.5+f,.1,0],[sway-.42+f2,.12,-.46],[sway-.32+f,.9,-.42],[sway-.12,1.64,-.3]],p.cape,{tex:STX.cloth});}
  if(p.wings){wing3(g,[sway-.12,1.55,.15],1,A*.4,p.wings,.82);wing3(g,[sway-.12,1.55,-.15],-1,A*.4,p.wings,.82);}
  if(p.tail)chain(g,[[-.15,1.0,0],[-.48,.72,0],[-.78,.5+A*.08,.1],[-.98,.55+A*.12,.15]],.07,.022,sk);
  // shoulders, arms, hands
  const sh=1.6*breathe,ac=p.bone?sk:(p.arms||bo),aw=(p.thin?.065:.09)*bk;
  for(const s of[-1,1])ball(g,ac,sway+.02,sh,s*.3*bk,.12,.11,.12,Object.assign({},cl,met));
  if(armored)for(const s of[-1,1])ball(g,'#c2c8d0',sway+.02,sh+.05,s*.31*bk,.15,.09,.14,STEEL);
  const rh=[sway+.4,1.12+A*.025,.4*bk],lh=[sway+.24,1.14-A*.02,-.44*bk];
  seg(g,[sway+.02,sh,.3*bk],[sway+.16,1.33,.4*bk],aw,aw*.85,ac,cl);seg(g,[sway+.16,1.33,.4*bk],rh,aw*.85,aw*.65,p.bone?sk:shade(ac,.95),cl);
  seg(g,[sway+.02,sh,-.3*bk],[sway+.1,1.33,-.42*bk],aw,aw*.85,ac,cl);seg(g,[sway+.1,1.33,-.42*bk],lh,aw*.85,aw*.65,p.bone?sk:shade(ac,.95),cl);
  ball(g,armored?'#9aa3ad':sk,...rh,.07,.08,.065,armored?STEEL:{});ball(g,armored?'#9aa3ad':sk,...lh,.07,.08,.065,armored?STEEL:{});
  if(p.weapon)prop3(g,p.weapon,rh,ph);
  if(p.shield){const m=new SR.Mesh(gGeo('shield',()=>SR.CylinderGeometry(1,1,.12,24)),mat3(p.shield,{m:.35,r:.4}));m.position.set(lh[0]+.08,lh[1]+.05,lh[2]-.05);m.rotation.set(Math.PI/2,0,.5);m.scale.set(.3,1,.36);g.add(m);
    const r2=new SR.Mesh(gGeo('srim',()=>SR.TorusGeometry(1,.06,6,24)),mat3('#c9a03d',GOLD));r2.position.copy(m.position);r2.rotation.set(0,-.5,0);r2.scale.set(.3,.36,.3);ball(g,'#c9a03d',lh[0]+.13,lh[1]+.05,lh[2]+.02,.06,.06,.03,GOLD);}
  // head: skull, jaw, nose, brow, hair
  const hx=sway+.04+hu,hy=1.97-hu*.4+B*.008;seg(g,[sway,1.72,0],[hx,hy-.13,0],.065,.06,sk);
  if(p.ears)for(const s of[-1,1])spike(g,[hx-.02,hy+.04,s*.17],[hx-.1,hy+.22,s*.38],.06,shade(sk,.9));
  ball(g,sk,hx,hy+.02,0,.19,.21,.18);ball(g,sk,hx+.06,hy-.1,0,.13,.09,.13);
  if(!p.bone){spike(g,[hx+.16,hy+.02,0],[hx+.24,hy-.03,0],.035,shade(sk,.95));ball(g,shade(sk,.85),hx+.15,hy+.09,0,.06,.025,.13);}
  if(p.snout)snout(g,[hx+.12,hy-.03,0],[hx+.32,hy-.08,0],.09,.06,shade(sk,.92));
  if(p.bone){eyes3(g,hx+.15,hy+.03,0,.07,.045,p.glow);box3(g,'#2a1a10',hx+.15,hy-.12,0,.04,.025,.12);}
  else if(p.cyclops){ball(g,'#f4efe4',hx+.16,hy+.04,0,.07,.07,.05);ball(g,'#2a1a10',hx+.21,hy+.04,0,.03,.03,.02);}
  else eyes3(g,hx+.17,hy+.04,0,.07,.028,p.glow);
  if(!p.hat&&!p.bone&&!p.robe)ball(g,p.hair||'#4a3020',hx-.04,hy+.1,0,.2,.15,.19,{tex:STX.fur,r:.8});
  if(p.tusks)for(const s of[-1,1])spike(g,[hx+.13,hy-.12,s*.07],[hx+.18,hy+.0,s*.1],.025,'#f0e8d0');
  if(p.beard){spike(g,[hx+.1,hy-.04,0],[hx+.18,hy-.5,0],.15,p.beard,{tex:STX.fur});}
  if(p.tentaface)for(let i=0;i<4;i++)chain(g,[[hx+.14,hy-.1,(i-1.5)*.05],[hx+.22,hy-.3,(i-1.5)*.06],[hx+.2+A*.04,hy-.45,(i-1.5)*.07]],.03,.012,sk);
  if(p.heads===2){ball(g,sk,hx,hy-.02,-.38,.19,.21,.18);eyes3(g,hx+.16,hy,-.38,.06,.028);}
  const hc=p.hatc||shade(bo,.85);
  switch(p.hat){
    case 'wizard':{const m=new SR.Mesh(gGeo('cone',()=>SR.ConeGeometry(1,1,14)),mat3(hc,cl));m.position.set(hx-.06,hy+.5,0);m.scale.set(.23,.72,.23);m.rotation.z=.28;g.add(m);
      const b=new SR.Mesh(gGeo('brim',()=>SR.CylinderGeometry(1,1,.04,24)),mat3(shade(hc,.8),cl));b.position.set(hx,hy+.15,0);b.scale.set(.4,1,.4);g.add(b);ball(g,'#e0c060',hx-.02,hy+.2,0,.21,.03,.21,GOLD);break;}
    case 'hood':ball(g,hc,hx-.03,hy+.04,0,.25,.27,.25,cl);ball(g,'#100a0e',hx+.11,hy,0,.13,.16,.15);if(p.glow)eyes3(g,hx+.2,hy+.01,0,.06,.03,p.glow);break;
    case 'helm':ball(g,'#a7afb8',hx,hy+.06,0,.23,.21,.22,STEEL);box3(g,'#16181c',hx+.18,hy+.03,0,.05,.035,.24);seg(g,[hx-.05,hy+.24,0],[hx+.12,hy+.32,0],.03,.01,'#b5303f');break;
    case 'horns':for(const s of[-1,1])chain(g,[[hx,hy+.14,s*.12],[hx-.1,hy+.32,s*.24],[hx-.3,hy+.38,s*.3]],.05,.015,'#e8dcc0');break;
    case 'crown':{const m=new SR.Mesh(gGeo('crown',()=>SR.CylinderGeometry(1,1,1,16,1,true)),mat3('#e0b84a',Object.assign({ds:1},GOLD)));m.position.set(hx,hy+.21,0);m.scale.set(.17,.1,.17);g.add(m);
      for(let i=0;i<6;i++){const a=i/6*6.283;spike(g,[hx+Math.cos(a)*.16,hy+.25,Math.sin(a)*.16],[hx+Math.cos(a)*.17,hy+.37,Math.sin(a)*.17],.03,'#e0b84a',GOLD);}break;}
    case 'feather':{const b=new SR.Mesh(gGeo('brim',()=>SR.CylinderGeometry(1,1,.04,24)),mat3(hc));b.position.set(hx,hy+.15,0);b.scale.set(.34,1,.34);g.add(b);ball(g,hc,hx,hy+.2,0,.19,.1,.19);
      membrane(g,[[hx-.05,hy+.25,.1],[hx-.4,hy+.55,.15],[hx-.45,hy+.45,.15],[hx-.1,hy+.22,.1]],'#e8e0d0');break;}
    case 'snakes':for(let i=0;i<7;i++){const a=i/7*6.283;chain(g,[[hx,hy+.1,0],[hx+Math.cos(a)*.22,hy+.2+A*.04,Math.sin(a)*.22],[hx+Math.cos(a)*.38,hy+.1,Math.sin(a)*.36]],.04,.02,'#5a8a3a');}break;
  }
}
// four-legged beasts with a walk cycle: diagonal legs move together, paws lift, hind legs bend backwards at the hock
function legQ(g,hip,front,s,ph,o,c,lw,len){const sw=Math.sin(ph*6.283+o),lf=Math.max(0,Math.sin(ph*6.283+o+1.57))*.1*len,ex=sw*.14*len;
  const foot=[hip[0]+ex,.06+lf,hip[2]+s*.04];
  if(front){const kn=[hip[0]+.04+ex*.5,hip[1]*.5+lf*.5,hip[2]+s*.02];seg(g,hip,kn,.14*lw,.09*lw,c);seg(g,kn,foot,.09*lw,.07*lw,shade(c,.9));}
  else{const kn=[hip[0]+.14+ex*.4,hip[1]*.62+lf*.3,hip[2]+s*.03],hk=[hip[0]-.08+ex*.7,hip[1]*.28+lf*.6,hip[2]+s*.04];
    ball(g,c,hip[0],hip[1]-.02,hip[2],.2*lw,.24*lw,.15*lw);seg(g,hip,kn,.16*lw,.1*lw,c);seg(g,kn,hk,.09*lw,.07*lw,shade(c,.9));seg(g,hk,foot,.07*lw,.06*lw,shade(c,.85));}
  ball(g,shade(c,.55),foot[0]+.06,foot[1],foot[2],.11*lw,.06,.1*lw,{r:.5});}
function h3Quad(g,p,ph){
  const c=p.body||'#8a8a8a',hc=p.head||c,L_=p.long||1,bh=(p.bodyh||.36)/.36,tl=(p.tall||.62)/.62,lw=(p.legw||.16)/.16,by=.92*tl+Math.abs(cyc(ph*2))*.02,fur={tex:p.shell?0:STX.fur,r:.75};
  if(p.wings)wing3(g,[.1,by+.35,-.25],-1,cyc(ph)*.4,p.wingc||shade(c,.8),.9);
  for(const s of[-1,1]){const far=s<0,cc=far?shade(c,.82):c;legQ(g,[.5*L_,by-.05,s*.22],true,s,ph,s>0?0:3.14,cc,lw,tl);legQ(g,[-.52*L_,by-.02,s*.22],false,s,ph,s>0?3.14:0,cc,lw,tl);}
  ball(g,c,.45*L_,by+.04,0,.42,.42*bh,.38,fur);ball(g,c,-.05*L_,by,0,.55*L_,.36*bh,.34,fur);ball(g,c,-.5*L_,by+.02,0,.36,.37*bh,.34,fur);
  ball(g,shade(c,1.2),.05,by-.24*bh,0,.62*L_,.14,.27,fur);
  if(p.shell){ball(g,p.shell,-.05,by+.15,0,.8*L_,.45,.45,{r:.4,tex:STX.stone});for(let i=0;i<5;i++)ball(g,shade(p.shell,.7),-.5+i*.25,by+.48,0,.09,.06,.09);}
  if(p.spots)for(let i=0;i<8;i++)ball(g,shade(c,.5),-.6+i*.17,by+.1+(i%2)*.15,.3,.06,.05,.03);
  if(p.mane)for(let i=0;i<14;i++){const a=-.4+i/13*2.6,bx=.62*L_,byy=by+.28,ox=-Math.cos(a)*.42,oy=Math.sin(a)*.45,oz=(i%3-1)*.18;spike(g,[bx,byy,oz*.4],[bx+ox,byy+oy,oz],.13,p.mane,{tex:STX.fur,r:.8});}
  if(p.spikes)for(let i=0;i<6;i++){const x=(.45-i*.22)*L_;spike(g,[x,by+.33*bh,0],[x-.08,by+.62*bh,0],.06,shade(c,.5));}
  const ts=cyc(ph);chain(g,[[-.82*L_,by+.08,0],[-1.12*L_,by+.18+ts*.08,ts*.08],[-1.38*L_,by+.08+ts*.12,ts*.14],[-1.58*L_,by-.08+ts*.18,ts*.18]],.11*((p.tailw||.12)/.12),.03,p.tailc||c,fur);
  const nk=p.neck||.3,hx=.92*L_+nk*.35,hy=by+.24+nk*.8+cyc(ph+.3)*.02;
  chain(g,[[.62*L_,by+.12,0],[.76*L_+nk*.15,by+.2+nk*.45,0],[hx-.06,hy-.04,0]],.26,.19,c,fur);
  ball(g,hc,hx,hy+.02,0,.22,.21,.21,fur);
  if(p.beak)spike(g,[hx+.16,hy,0],[hx+.52,hy-.14,0],.11,'#d9a521',{r:.3});
  else{const sn=(p.snout||.16)/.16;snout(g,[hx+.12,hy-.03,0],[hx+.12+.26*sn,hy-.08,0],.13,.07,shade(hc,.95),fur);ball(g,'#1a1416',hx+.15+.26*sn,hy-.06,0,.04,.035,.05,{r:.25});
    seg(g,[hx+.08,hy-.12,0],[hx+.08+.22*sn,hy-.15-Math.max(0,cyc(ph))*.03,0],.08,.04,shade(hc,.8),{},false);}
  ball(g,shade(hc,.8),hx+.1,hy+.13,0,.07,.03,.16);
  eyes3(g,hx+.13,hy+.07,0,.12,.035,p.eyec);
  if(p.ears==='point')for(const s of[-1,1])spike(g,[hx-.06,hy+.15,s*.11],[hx-.1,hy+.42,s*.15],.065,shade(hc,.8),fur);
  else if(p.ears==='round')for(const s of[-1,1])ball(g,shade(hc,.8),hx-.08,hy+.2,s*.15,.09,.09,.04,fur);
  if(p.horns)for(const s of[-1,1])chain(g,[[hx-.05,hy+.15,s*.12],[hx-.25,hy+.38,s*.2],[hx-.48,hy+.36,s*.22]],.06,.015,'#e8dcc0');
  if(p.horn)spike(g,[hx+.12,hy+.18,0],[hx+.35,hy+.65,0],.06,'#f0e0a0',{m:.3,r:.3});
  if(p.tusks)for(const s of[-1,1])chain(g,[[hx+.28,hy-.12,s*.1],[hx+.4,hy-.25,s*.14],[hx+.5,hy-.12,s*.14]],.04,.015,'#f0e8d0');
  if(p.wings)wing3(g,[.15,by+.38,.25],1,cyc(ph)*.4,p.wingc||shade(c,.85),.9);
}
function h3Dragon(g,p,ph){
  const A=cyc(ph),c=p.body||'#b5302a',bl=shade(c,1.4),wc=p.wingc||shade(c,.7),by=1.0+Math.max(0,-A)*.04,sc={tex:STX.scales,r:.45};
  if(p.wings!==0)wing3(g,[0,by+.45,-.26],-1,A*.7,wc,1.2);
  for(const s of[-1,1]){const cc=s<0?shade(c,.8):c;legQ(g,[.48,by-.02,s*.26],true,s,ph*.5,s>0?0:3.14,cc,1.15,1.05);legQ(g,[-.58,by,s*.26],false,s,ph*.5,s>0?3.14:0,cc,1.25,1.1);}
  ball(g,c,.42,by+.08,0,.44,.44,.4,sc);ball(g,c,-.12,by,0,.6,.4,.38,sc);ball(g,c,-.6,by+.03,0,.36,.36,.34,sc);
  for(let i=0;i<6;i++)ball(g,bl,.45-i*.2,by-.27+Math.abs(i-2)*.02,0,.13,.06,.24,{r:.4});
  const sw=A*.07,neck=[[.66,by+.16,0],[.9,by+.52,.02],[1.08,by+.9+sw,.03],[1.28,by+1.12+sw,.03]];chain(g,neck,.29,.16,c,sc);
  for(let i=0;i<3;i++)ball(g,bl,neck[i][0]+.08,neck[i][1]-.12,0,.12,.07,.16,{r:.4});
  for(let i=0;i<4;i++)spike(g,[neck[i][0]-.06,neck[i][1]+.2-i*.02,0],[neck[i][0]-.2,neck[i][1]+.38-i*.02,0],.045,shade(c,.45));
  const hx=1.48,hy=by+1.18+sw,jaw=.04+Math.max(0,cyc(ph+.2))*.09;
  ball(g,c,hx,hy+.02,0,.24,.18,.2,sc);snout(g,[hx+.12,hy,0],[hx+.5,hy-.05,0],.15,.08,c,sc);
  seg(g,[hx+.05,hy-.1,0],[hx+.46,hy-.15-jaw,0],.11,.06,shade(c,.85),sc,false);
  for(let i=0;i<5;i++){spike(g,[hx+.18+i*.065,hy-.08,.07],[hx+.18+i*.065,hy-.15,.07],.016,'#f4efe4');spike(g,[hx+.18+i*.06,hy-.13-jaw,.06],[hx+.18+i*.06,hy-.07-jaw,.06],.014,'#f4efe4');}
  if(p.breath!==0)ball(g,'#3a0a04',hx+.32,hy-.11-jaw*.5,0,.14,.02+jaw*.35,.07,{e:'#ff5010',ei:1.4});
  ball(g,shade(c,.7),hx+.06,hy+.13,0,.09,.04,.17);eyes3(g,hx+.12,hy+.09,0,.12,.038,p.eyec||'#ffd040');
  ball(g,'#120808',hx+.5,hy-.02,.05,.02,.02,.02);
  if(p.horns!==0)for(const s of[-1,1]){hornC(g,[hx-.08,hy+.14,s*.1],[-.75,.5,s*.25],.5,.055,p.hornc||'#e8dcc0');hornC(g,[hx-.12,hy+.04,s*.15],[-.8,.15,s*.4],.25,.03,p.hornc||'#e8dcc0');}
  if(p.spikes!==0)for(let i=0;i<7;i++){const x=.5-i*.22;spike(g,[x,by+.37,0],[x-.12,by+.62-i*.015,0],.065,shade(c,.45));}
  const tail=[[-.9,by+.05,0]];for(let i=1;i<=6;i++)tail.push([-.9-i*.3,by+.05-i*.15+Math.sin(ph*6.283+i*.7)*.05*i,Math.sin(ph*6.283+i*.9)*.035*i]);chain(g,tail,.24,.035,c,sc);
  for(let i=1;i<5;i++)spike(g,[tail[i][0],tail[i][1]+.18-i*.03,tail[i][2]],[tail[i][0]-.1,tail[i][1]+.32-i*.04,tail[i][2]],.04,shade(c,.45));
  const tt=tail[6];membrane(g,[[tt[0]+.05,tt[1],tt[2]],[tt[0]-.12,tt[1]+.18,tt[2]],[tt[0]-.38,tt[1]+.02,tt[2]],[tt[0]-.12,tt[1]-.14,tt[2]]],shade(c,.5));
  if(p.wings!==0)wing3(g,[.02,by+.48,.26],1,A*.7,wc,1.2);
}
function h3Wyv(g,p,ph){
  const A=cyc(ph),c=p.body||'#b5302a',bl=p.belly||shade(c,1.3),sl=p.slim?.82:1,by=1.25+Math.abs(cyc(ph))*.03,sc={tex:STX.scales,r:.45};
  if(p.wings)wing3(g,[.05,by+.25,-.25],-1,A*.55,p.wingc||shade(c,.72),1.1);
  for(const s of[-1,1]){const o=s>0?0:3.14,st=Math.sin(ph*6.283+o)*.12,lf=Math.max(0,Math.sin(ph*6.283+o+1.57))*.12,cc=s<0?shade(c,.82):c;
    const hip=[-.05,by-.1,s*.24],kn=[.24+st*.6,.72+lf*.5,s*.28],an=[-.04+st,.3+lf,s*.28],ft=[.12+st,.06+lf,s*.28];
    ball(g,cc,-.05,by-.12,s*.24,.27*sl,.32*sl,.21*sl,sc);seg(g,hip,kn,.2*sl,.12*sl,cc,sc);seg(g,kn,an,.12*sl,.075*sl,shade(cc,.9),sc);seg(g,an,ft,.075*sl,.06,shade(cc,.75));
    for(let k=-1;k<=1;k++)spike(g,[ft[0]+.08,ft[1],ft[2]+k*.06],[ft[0]+.24,ft[1]-.03,ft[2]+k*.07],.025,'#e8dcc0');}
  ball(g,c,.22,by+.05,0,.42*sl,.42*sl,.38*sl,sc);ball(g,c,-.25,by-.02,0,.52*sl,.36*sl,.34*sl,sc);
  for(let i=0;i<5;i++)ball(g,bl,.3-i*.17,by-.27,0,.12,.06,.22*sl,{r:.4});
  const tail=[[-.62,by,0]];for(let i=1;i<=6;i++)tail.push([-.62-i*.27,by-i*.1+Math.sin(ph*6.283+i*.7)*.05*i,Math.sin(ph*6.283+i)*.03*i]);chain(g,tail,.27*sl,.045,c,sc);
  const tt=tail[6];if(p.tailclub)ball(g,typeof p.tailclub==='string'?p.tailclub:shade(c,.75),tt[0],tt[1],tt[2],.2,.16,.16,{flat:1,tex:STX.stone});
  if(p.tailblade)spike(g,[tail[3][0],tail[3][1]+.05,0],[tt[0]-.35,tt[1]+.3,0],.09,p.glow||'#d9d2c4',p.glow?{e:p.glow,ei:1.5}:{m:.5,r:.3});
  if(p.spikes)for(let i=0;i<6;i++)spike(g,[.4-i*.25,by+.34*sl-i*.03,0],[.3-i*.25,by+.6*sl-i*.04,0],.06,p.spikec||shade(c,.45));
  if(p.shell)ball(g,p.shell,-.05,by+.18,0,.6,.3,.38,{flat:1,r:.7,tex:STX.stone});
  if(p.glow&&!p.fists)for(let i=0;i<5;i++)ball(g,p.glow,.35-i*.22,by+.32*sl,0,.05,.05,.05,{e:p.glow,ei:2.2});
  const nk=p.neck||.5,neck=[[.5,by+.08,0],[.72,by+.24+nk*.45,0],[.94+nk*.2,by+.32+nk*.75+cyc(ph+.3)*.03,0]];chain(g,neck,.24*sl,.17*sl,c,sc);
  const[hx,hy]=[neck[2][0]+.1,neck[2][1]+.02],jaw=.03+Math.max(0,cyc(ph+.2))*.07;
  if(p.fists)for(const s of[-1,1]){seg(g,[.42,by-.02,s*.3],[.68,by-.32,s*.4],.14,.12,s<0?shade(c,.8):c,sc);ball(g,p.glow||'#60ff60',.76,by-.42,s*.42,.18,.16,.16,{e:p.glow||'#60ff60',ei:1.4,flat:1});}
  else if(!p.wings&&!p.noarms)for(const s of[-1,1]){seg(g,[.42,by-.02,s*.24],[.6,by-.25,s*.3],.06,.045,shade(c,.85));spike(g,[.6,by-.25,s*.3],[.68,by-.33,s*.3],.03,'#e8dcc0');}
  if(p.mane)for(let i=0;i<9;i++){const a=.2+i*.3;spike(g,[hx-.12,hy-.05-i*.03,(i%2?.06:-.06)],[hx-.12-Math.cos(a)*.4,hy+Math.sin(a)*.25-i*.04,(i%2?.16:-.16)],.08,p.mane,{tex:STX.fur,r:.8});}
  if(p.fan)for(const s of[-1,1])ball(g,p.fan,hx-.1,hy+.15,s*.25,.07,.28,.24);
  if(p.crest)spike(g,[hx-.05,hy+.15,0],[hx-.22,hy+.58,0],.08,p.crest);
  ball(g,p.head||c,hx,hy+.02,0,.22,.18,.19,sc);
  if(p.beak){spike(g,[hx+.14,hy+.02,0],[hx+.6,hy-.1,0],.1,p.beakc||'#e0c050',{r:.3});spike(g,[hx+.14,hy-.08,0],[hx+.5,hy-.15-jaw,0],.07,shade(p.beakc||'#e0c050',.75));}
  else{snout(g,[hx+.1,hy,0],[hx+.44,hy-.04,0],.14,.08,p.head||c,sc);seg(g,[hx+.04,hy-.1,0],[hx+.4,hy-.14-jaw,0],.1,.05,shade(p.head||c,.8),sc,false);
    if(p.teeth!==0)for(let i=0;i<4;i++)spike(g,[hx+.16+i*.07,hy-.07,.07],[hx+.16+i*.07,hy-.15,.07],.016,'#f4efe4');}
  if(p.horns)for(const s of[-1,1])hornC(g,[hx-.05,hy+.12,s*.1],[-.7,p.bighorns?.7:.45,s*.25],p.bighorns?.6:.38,p.bighorns?.08:.05,p.hornc||'#e8dcc0');
  if(p.horn)spike(g,[hx+.2,hy+.1,0],[hx+.3,hy+.5,0],.06,p.hornc||'#e8dcc0');
  if(p.tusks)for(const s of[-1,1])chain(g,[[hx+.3,hy-.1,s*.08],[hx+.45,hy-.25,s*.12],[hx+.58,hy-.12,s*.12]],.04,.015,'#f0e8d0');
  if(!p.eyeless)eyes3(g,hx+.1,hy+.07,0,.12,.035,p.eyec||p.glow||'#f0d040');
  if(p.wings)wing3(g,[.1,by+.28,.25],1,A*.55,p.wingc||shade(c,.82),1.1);
}
function h3Serp(g,p,ph){const A=Math.sin(ph*6.283),c=p.body||'#5a7a3a',n=p.heads||1;
  for(let i=0;i<3;i++){const m=new SR.Mesh(gGeo('tor',()=>SR.TorusGeometry(1,.3,14,28)),mat3(i%2?shade(c,.88):c));m.position.set(0,.18+i*.28,0);m.rotation.x=Math.PI/2;m.scale.set(.7-i*.15,.7-i*.15,.75-i*.15);m.castShadow=true;g.add(m);}
  for(let k=0;k<n;k++){const a=n>1?(k-(n-1)/2)*.62:0,sw=Math.sin(ph*6.283+k*1.3)*.08,ca=Math.cos(a),sa=Math.sin(a),R=n>1?.7:.4,
      pts=[[.05,.8,0],[.1+ca*R*.35+sw,1.3,sa*R*.45],[.15+ca*R*.7+sw*.6,1.75,sa*R*.85],[.25+ca*R+sw*.3,2.05-Math.abs(a)*.18,sa*R*1.15]];
    chain(g,pts,.17,.12,c,{tex:STX.scales,r:.4});const[hx,hy,hz]=pts[3];ball(g,c,hx,hy,hz,.15,.12,.13,{tex:STX.scales,r:.4});snout(g,[hx+.05,hy-.01,hz],[hx+.34,hy-.06,hz],.12,.065,c,{tex:STX.scales,r:.4});ball(g,shade(c,1.3),hx+.12,hy-.1,hz,.14,.04,.09);
    eyes3(g,hx+.08,hy+.06,hz,.09,.03,p.eyec||'#f0d040');for(const s2 of[-1,1])spike(g,[hx+.22,hy-.06,hz+s2*.04],[hx+.23,hy-.16,hz+s2*.04],.015,'#f4efe4');
    if(Math.sin(ph*6.283+k)>.5)seg(g,[hx+.3,hy-.08,hz],[hx+.46,hy-.1,hz],.012,.006,'#d0303a',{},false);}}
function h3Spider(g,p,ph){const A=Math.sin(ph*6.283),c=p.body||'#2a2420',lc=shade(c,.8);
  if(p.tail){const tl=[[-.45,.6,0],[-.8,1.0,0],[-.6,1.5,0],[-.15,1.65+A*.05,0]];chain(g,tl,.14,.08,c);spike(g,tl[3],[.1,1.45,0],.06,'#e8dcc0');}
  for(let i=0;i<4;i++)for(const s of[-1,1]){const ph2=Math.sin(ph*6.283+i*1.5+(s>0?1.5:0))*.06,bx=.25-i*.14,hip=[bx,.5,s*.15],kn=[bx+(1.5-i)*.12,.95+ph2,s*.6],ft=[bx+(1.5-i)*.32,.03,s*.85];
    seg(g,hip,kn,.06,.045,s<0?shade(lc,.8):lc);seg(g,kn,ft,.045,.02,s<0?shade(lc,.8):lc);}
  if(!p.tail)ball(g,c,-.5,.62,0,.55,.45,.48,{r:.3,tex:STX.fur});else ball(g,c,-.25,.5,0,.45,.3,.35);
  if(p.mark)ball(g,p.mark,-.55,1.0,0,.18,.06,.15);
  ball(g,shade(c,.9),.25,.52,0,.3,.24,.27,{r:.25,tex:STX.chitin});ball(g,shade(c,.85),.5,.55,0,.17,.15,.17,{r:.25});
  for(let i=0;i<4;i++)ball(g,p.eyec||'#e03030',.63,.6+(i>>1)*.06,(i%2?.05:-.05),.035,.035,.035,{e:p.eyec||'#e03030',ei:1.6});
  if(p.pincers)for(const s of[-1,1]){chain(g,[[.5,.5,s*.15],[.8,.62,s*.25],[1.0,.6,s*.3]],.08,.07,c);ball(g,shade(c,1.1),1.12,.6,s*.3,.16,.1,.11);spike(g,[1.15,.62,s*.3],[1.4,.66+A*.03,s*.28],.05,shade(c,.8));}}
function h3Insect(g,p,ph){const A=Math.sin(ph*6.283*3),c=p.body||'#d0a030',fly=p.fly!==0,y=fly?1.2+Math.sin(ph*6.283)*.06:.45;
  for(let i=0;i<3;i++)for(const s of[-1,1])chain(g,[[(.15-i*.15),y-.05,s*.12],[(.2-i*.2),y-.25,s*.4],[(.25-i*.25),fly?y-.6:.02,s*.5]],.03,.015,shade(c,.5));
  ball(g,c,-.45,y,0,.5,.32,.32);if(p.stripes!==0)for(let i=0;i<3;i++){const m=new SR.Mesh(gGeo('band',()=>SR.TorusGeometry(1,.1,8,24)),mat3(shade(c,.3),{r:.85}));m.position.set(-.6+i*.18,y,0);m.rotation.y=Math.PI/2;const rr=.36-Math.abs(i-1)*.05;m.scale.set(rr,rr*1.02,rr);g.add(m);}
  if(p.stinger)spike(g,[-.9,y,0],[-1.2,y-.1,0],.06,'#1a1a1a');
  ball(g,shade(c,.85),.08,y+.02,0,.22,.2,.2);ball(g,p.head||shade(c,.7),.35,y+.05,0,.16,.15,.17);
  for(const s of[-1,1])ball(g,p.eyec||'#a02020',.42,y+.1,s*.1,.07,.08,.06,{r:.15,m:.3});
  if(p.horn)chain(g,[[.4,y+.15,0],[.6,y+.45,0],[.5,y+.65,0]],.06,.02,shade(c,.5));
  if(fly)for(const s of[-1,1])membrane(g,[[.0,y+.2,s*.1],[-.25,y+.45+A*.15,s*(.6)],[-.7,y+.42+A*.12,s*.75],[-.6,y+.25,s*.3]],'#dff0ff',{op:.45,r:.2});
  if(p.glow)ball(g,p.glow,-.45,y,0,.3,.2,.2,{e:p.glow,ei:2});}
function h3Bird(g,p,ph){const A=Math.sin(ph*6.283),c=p.body||'#6b4a2a';
  if(p.lion){h3Quad(g,{body:c,ears:'point',beak:1,head:'#e8e0d0',tailw:.08},ph);wing3(g,[.1,1.3,-.25],-1,A*.5,shade(c,.85),1,1);wing3(g,[.1,1.3,.25],1,A*.5,c,1,1);return;}
  const y=1.3+A*.05;wing3(g,[0,y+.1,-.2],-1,A*.6,shade(c,.82),1,!p.bat);
  membrane(g,[[-.35,y-.05,0],[-.85,y-.2,.25],[-.95,y-.15,0],[-.85,y-.2,-.25]],shade(c,.7));
  ball(g,c,0,y,0,.45,.3,.3);ball(g,shade(c,1.25),.1,y-.12,0,.32,.15,.22);
  for(const s of[-1,1])seg(g,[0,y-.25,s*.1],[.05,.08,s*.12],.03,.025,'#d9a521');
  if(p.harpy){ball(g,'#d8a57a',.38,y+.3,0,.17,.19,.17);eyes3(g,.53,y+.33,0,.06,.025);ball(g,'#3a2a1a',.33,y+.38,0,.18,.15,.18);}
  else{ball(g,p.head||c,.38,y+.25,0,.17,.15,.15);spike(g,[.52,y+.25,0],[.75,y+.15,0],.06,p.bat?'#2a2028':'#d9a521');eyes3(g,.48,y+.3,0,.09,.03);
    if(p.bat)for(const s of[-1,1])spike(g,[.33,y+.38,s*.08],[.3,y+.6,s*.12],.05,shade(c,.8));}
  wing3(g,[0,y+.12,.2],1,A*.6,c,1,!p.bat);}
function h3Eye(g,p,ph){const A=Math.sin(ph*6.283),c=p.body||'#7b5aa6',y=1.45+A*.06;
  for(let i=0;i<8;i++){const a=-Math.PI*(.1+.8*i/7),w=Math.sin(ph*6.283+i*1.7)*.25,b=[Math.cos(a)*.5,y+.35+Math.sin(-a)*.1,(i%2?.25:-.25)];
    const tip=[Math.cos(a+w)*.95,y+.95+Math.sin(i)*.15,(i%2?.45:-.45)];chain(g,[b,[(b[0]+tip[0])/2+w*.2,(b[1]+tip[1])/2+.15,(b[2]+tip[2])/2],tip],.06,.035,shade(c,.85));
    ball(g,'#f4efe4',tip[0],tip[1],tip[2],.08,.08,.08);ball(g,'#2a1a10',tip[0]+.05,tip[1],tip[2]+.03,.035,.035,.035);}
  ball(g,c,0,y,0,.62,.6,.6);ball(g,'#f4efe4',.45,y+.05,.1,.28,.24,.2,{r:.2});ball(g,p.iris||'#d9a521',.66,y+.05+A*.02,.14,.13,.13,.06,{e:p.iris||'#d9a521',ei:.5});ball(g,'#120808',.71,y+.05+A*.02,.16,.06,.06,.03);
  ball(g,'#2a0c10',.42,y-.32,.05,.25,.08,.25);for(let i=0;i<5;i++)spike(g,[.4+i*.04,y-.27,-.12+i*.06],[.42+i*.04,y-.35,-.12+i*.06],.025,'#f0e8d0');}
function h3Ooze(g,p,ph){const A=Math.sin(ph*6.283),c=p.body||'#7fd0a0',o={op:.78,r:.15,m:.1};
  if(p.cube){box3(g,c,0,.75,0,1.3,1.4,1.3,{op:.42,r:.08,m:.1});ball(g,'#e6dcc4',-.1,.7,.1,.16,.15,.15);seg(g,[.2,.3,0],[.4,.9,.1],.03,.03,'#c8ccd2',STEEL);return;}
  ball(g,c,0,.32,0,.95+A*.04,.38-A*.03,.8,o);ball(g,shade(c,1.1),-.25,.62,.1,.45,.32,.4,o);ball(g,c,.25,.72,-.05,.36,.28,.32,o);
  for(let i=0;i<4;i++){const k=(ph+i/4)%1;ball(g,'#ffffff',-.4+i*.25,.3+k*.6,.3,.05,.05,.05,{op:.6});}
  if(p.mouths)for(let i=0;i<4;i++){ball(g,'#2a0c10',-.5+i*.33,.45+(i%2)*.2,.6,.1,.06,.03);ball(g,'#f4efe4',-.5+i*.33,.6+(i%2)*.2,.62,.05,.05,.03);}
  else if(p.eyes!==0)eyes3(g,.6,.6,0,.12,.05);}
function h3Ghost(g,p,ph){const A=Math.sin(ph*6.283),c=p.body||'#cfe6ff',y=.55+A*.08;
  const prof=[[0,.05],[.5,0],[.46,.35],[.38,.85],[.33,1.25],[.31,1.5],[.24,1.72],[0,1.85]].map(([r,h])=>new SR.Vector2(r,h));
  const geo=SR.LatheGeometry(prof,24);geo.userData.tmp=1;const m=new SR.Mesh(geo,mat3(c,{op:.72,e:c,ei:.35,ds:1}));m.position.set(0,y,0);g.add(m);
  ball(g,'#0a0a1a',.18,y+1.5,0,.16,.15,.15,{op:.9});eyes3(g,.28,y+1.52,0,.07,.035,p.glow||'#9fe8ff');
  for(const s of[-1,1])chain(g,[[0,y+1.3,s*.3],[.28,y+1.0+A*.05,s*.42],[.42,y+.7+A*.04,s*.38]],.085,.025,c,{op:.75});
  for(let i=0;i<5;i++){const a=i/5*6.283;chain(g,[[Math.cos(a)*.38,y+.1,Math.sin(a)*.38],[Math.cos(a)*.45+Math.sin(ph*6.283+i)*.06,y-.15,Math.sin(a)*.45],[Math.cos(a)*.4,y-.35,Math.sin(a)*.4]],.07,.01,c,{op:.6});}}
function h3Ele(g,p,ph){const A=Math.sin(ph*6.283),k=p.kind||'fire';
  if(k==='fire'){const core={e:'#ff3a00',ei:1.1};ball(g,'#2a0800',0,.95,0,.3,.55,.26,core);ball(g,'#2a0800',.04,1.62,0,.2,.22,.19,core);
    for(let i=0;i<14;i++){const t=(ph+i/14)%1,a=i*2.4,r=.18+.12*(i%3),bx=Math.cos(a)*r,bz=Math.sin(a)*r*.8,by=.25+(i%5)*.3,h=.35+.35*Math.sin(t*3.14);
      spike(g,[bx,by,bz],[bx*1.2+Math.sin(ph*12+i)*.06,by+h,bz],.1+.04*(i%2),'#3a1000',{e:i%3?'#ff7010':'#ffc030',ei:1.5});}
    for(const s2 of[-1,1])chain(g,[[0,1.35,s2*.25],[.2,1.15+A*.06,s2*.45],[.38,1.0,s2*.5]],.09,.05,'#3a1000',{e:'#ff5a10',ei:1.3});
    eyes3(g,.18,1.66,0,.08,.04,'#fff8c0');return;}
  if(k==='wisp'){const n=3,base=1.3+A*.12;
    for(let i=0;i<n;i++){const t=((ph+i/n)%1),x=Math.sin(i*2.1+ph*6)*.35*(1-t),y=base+(k==='wisp'?t*.4:.2+t*1.9),r=(k==='wisp'?.22:.42)*(1-t)+.05;
      ball(g,k==='wisp'?'#204060':'#3a0e02',x,y,(i%3-1)*.15,r,r,r,{e:k==='wisp'?'#9fe0ff':t<.3?'#fff0a0':t<.6?'#ffa030':'#ff4a10',ei:k==='wisp'?1.6:t<.3?1.3:1.1,op:.88});}
    if(k==='fire')eyes3(g,.2,1.6,0,.1,.05,'#fff8d0');return;}
  if(k==='water'){const w=cyc(ph)*.04,prof=[[0,0],[.62,.02],[.5,.3],[.36,.7],[.3,1.1],[.34,1.45],[.26,1.75],[.1,1.95],[0,2.0]].map(([r,h],i)=>new SR.Vector2(r+Math.sin(ph*6.283+i)*.03,h));
    const geo=SR.LatheGeometry(prof,20);geo.userData.tmp=1;mesh3(g,geo,mat3('#2f86c8',{op:.82,r:.08,m:.25}),w,0,0,1);
    for(const s2 of[-1,1])chain(g,[[.05,1.45,s2*.28],[.3,1.25+cyc(ph+.2)*.05,s2*.5],[.55,1.05,s2*.55]],.12,.07,'#3f9ad6',{op:.8,r:.08,m:.25});
    for(let i=0;i<7;i++){const a=i/7*6.283;spike(g,[Math.cos(a)*.15+w,1.85,Math.sin(a)*.15],[Math.cos(a)*.3+w,2.15+Math.sin(ph*6.283+i)*.06,Math.sin(a)*.3],.06,'#e8f6ff',{r:.2});}
    eyes3(g,.27,1.62,0,.09,.04,'#d0f4ff');return;}
  if(k==='air'){for(let i=0;i<5;i++){const m=new SR.Mesh(gGeo('tor',()=>SR.TorusGeometry(1,.3,14,28)),mat3('#e8f0ff',{op:.45}));m.position.set(0,.15+i*.36,0);m.rotation.set(Math.PI/2,0,ph*6.283+i);m.scale.set(.25+i*.12,.25+i*.12,.1);g.add(m);}return;}
  for(let i=0;i<5;i++){const m=mesh3(g,ICO(),mat3(i%2?'#7a7468':'#8e887b',{flat:1,r:.85}),Math.sin(i*1.7)*.08,.25+i*.36,0,.42-i*.04,.24,.36);m.rotation.set(i,i*2,i*3);}
  for(const s of[-1,1]){const m=mesh3(g,ICO(),mat3('#6e695e',{flat:1,r:.85}),.1,1.0,s*.6,.2,.26,.2);m.rotation.set(s,2,1);}eyes3(g,.35,1.7,0,.1,.04,'#ffb040');}
function h3Tree(g,p,ph){const A=Math.sin(ph*6.283),sw=A*.04;
  if(p.cap){for(const s2 of[-1,1])seg(g,[0,.35,s2*.1],[.05+cyc(ph)*s2*.04,0,s2*.12],.08,.07,'#d8d0bc');seg(g,[0,.3,0],[0,.9,0],.22,.16,'#e8e0cc');const cap=new SR.Mesh(gGeo('cap',()=>SR.SphereGeometry(1,24,12,0,Math.PI*2,0,Math.PI/2)),mat3(p.cap));cap.position.set(sw,.88,0);cap.scale.set(.6,.42,.6);cap.castShadow=true;g.add(cap);
    for(let i=0;i<6;i++){const a=i/6*6.283;ball(g,'#f4efe4',sw+Math.cos(a)*.35,1.12,Math.sin(a)*.35,.06,.03,.06);}eyes3(g,.17,.6,0,.07,.03,'#2a1a10');
    for(const s of[-1,1])seg(g,[0,.62,s*.18],[.2,.4+cyc(ph)*s*.04,s*.38],.07,.05,'#e8e0cc');return;}
  const tc=p.dead?'#4a3a2a':'#5a3e24';seg(g,[0,0,0],[0,1.5,0],.3,.18,tc,{r:.9,tex:STX.bark});
  for(const s of[-1,1])seg(g,[0,1.1,s*.12],[.35,1.55+sw,s*.6],.09,.04,tc);
  for(const s of[-1,1])seg(g,[0,.05,s*.1],[.3,.02,s*.4],.1,.05,tc);
  if(!p.dead)for(const[x,y,z,r]of[[-.3,1.9,.2,.5],[.3,1.95,-.2,.5],[0,2.25,0,.55],[.4,1.6,.45,.35],[-.35,1.6,-.4,.35]]){const m=mesh3(g,ICO(),mat3(p.leaf||'#3f7a2e',{flat:1,r:.8}),x+sw,y,z,r,r*.85,r);m.rotation.set(x,y,z);}
  eyes3(g,.27,1.1,0,.09,.04,'#ffc040');}
function h3Golem(g,p,ph){const A=Math.sin(ph*6.283),c=p.body||'#8a8578',o={flat:1,r:.8,tex:STX.stone};
  for(const s of[-1,1])box3(g,shade(c,s<0?.8:1),0,.4,s*.22,.3,.8,.28,o);box3(g,c,0,1.2+A*.01,0,.65,.8,.85,o);
  for(const s of[-1,1]){box3(g,shade(c,s<0?.8:.95),.05,1.2,s*.6,.3,.85,.28,o);box3(g,shade(c,.9),.12,.7,s*.62,.36,.3,.32,o);}
  box3(g,c,.05,1.78,0,.42,.38,.42,o);
  if(p.glow){box3(g,p.glow,.33,1.3,0,.02,.35,.06,{e:p.glow,ei:2});box3(g,p.glow,.33,1.3,0,.02,.06,.4,{e:p.glow,ei:2});}
  eyes3(g,.27,1.8,0,.1,.04,p.glow||'#9fe8ff');}
function h3Worm(g,p,ph){const A=Math.sin(ph*6.283),c=p.body||'#7b3f8a';const hole=new SR.Mesh(gGeo('hole',()=>SR.CylinderGeometry(1,1,.02,24)),mat3('#140a10'));hole.position.set(0,.01,0);hole.scale.set(.75,1,.6);g.add(hole);
  const pts=[];for(let i=0;i<8;i++){const t=i/7;pts.push([Math.sin(t*2.4+A*.4)*.3*t+t*.3,t*2.2,Math.sin(t*3+A*.3)*.15*t]);}
  for(let i=0;i<pts.length;i++){const t=i/(pts.length-1);ball(g,i%2?c:shade(c,.85),pts[i][0],pts[i][1],pts[i][2],.45-t*.15,.32,.42-t*.12);if(p.legs&&i<pts.length-1)for(const s of[-1,1])seg(g,[pts[i][0],pts[i][1],s*.3],[pts[i][0]+.1,pts[i][1]-.15,s*.55],.03,.02,shade(c,.6));}
  const[hx,hy,hz]=pts[7];ball(g,'#2a0c10',hx+.05,hy+.2,hz,.22,.06,.22);for(let i=0;i<8;i++){const a=i/8*6.283;spike(g,[hx+.05+Math.cos(a)*.2,hy+.22,hz+Math.sin(a)*.2],[hx+.05+Math.cos(a)*.12,hy+.1,hz+Math.sin(a)*.12],.03,'#f0e8d0');}}
function h3Kraken(g,p,ph){const c=p.body||'#a0473a';
  for(let i=0;i<8;i++){const a=i/8*6.283,pts=[[Math.cos(a)*.25,.3,Math.sin(a)*.25]];for(let j=1;j<=5;j++){const w=Math.sin(ph*6.283+j*.8+i*1.3)*.12;pts.push([Math.cos(a+w)*(.25+j*.24),.18+(j>=4?(j-3)*.2:0)+Math.max(0,w),Math.sin(a+w)*(.25+j*.22)]);}chain(g,pts,.16,.04,shade(c,.9));}
  ball(g,c,0,1.0+Math.sin(ph*6.283)*.04,0,.5,.8,.5);ball(g,shade(c,1.2),.1,.55,0,.45,.3,.42);eyes3(g,.42,.75,0,.22,.08,'#f4d060');}
function h3Fish(g,p,ph){const A=Math.sin(ph*6.283),c=p.body||'#5a6a7a',y=.6;
  membrane(g,[[-.6,y,0],[-1.05,y+.35+A*.1,A*.1],[-1.0,y-.35+A*.1,A*.1]],shade(c,.8));ball(g,c,0,y,0,.75,.32,.3);ball(g,shade(c,1.4),.05,y-.15,0,.6,.14,.24);
  membrane(g,[[-.1,y+.28,0],[.15,y+.7,0],[.3,y+.25,0]],shade(c,.75));eyes3(g,.5,y+.06,0,.2,.05);}
function h3Swarm(g,p,ph){const c=p.body||'#3a3238';for(let i=0;i<16;i++){const a=ph*6.283*(1+(i%3))+i*2.4,r=.25+.6*((i*37)%10)/10;ball(g,c,Math.cos(a)*r,.6+.4*Math.sin(a*1.3)+((i*13)%5)*.15,Math.sin(a)*r*.6,.08,.06,.06);}}
function h3Mimic(g,p,ph){const c=p.flesh?'#9a4b52':'#7a4a22',open=.35+.3*Math.max(0,Math.sin(ph*6.283));
  box3(g,c,0,.35,0,1.2,.7,.8,{r:.7});box3(g,'#d9b45a',0,.5,0,1.22,.08,.82,GOLD);box3(g,'#2a0c10',0,.72,0,1.1,.05,.7);
  const lid=new SR.Group();box3(lid,shade(c,1.1),0,.15,-.4,1.2,.3,.8,{r:.7});lid.position.set(0,.7,.4);lid.rotation.x=-open;g.add(lid);
  for(let i=0;i<6;i++)spike(g,[-.5+i*.2,.72,.35],[-.5+i*.2,.95,.35],.04,'#f0e8d0');chain(g,[[.2,.75,.2],[.5,.9,.4],[.8,.6,.45]],.08,.04,'#c45a6a');}
function h3Heart(g,p,ph){const t=ph,beat=1+.12*(Math.exp(-(((t-.08)/.06)**2))+.6*Math.exp(-(((t-.3)/.06)**2)));
  const H=new SR.Group();ball(H,'#b5303f',-.25,1.1,0,.42,.45,.4);ball(H,'#b5303f',.25,1.1,0,.42,.45,.4);spike(H,[0,.95,0],[0,.25,0],.55,'#9a2a38');H.scale.setScalar(beat);H.position.y=(1-beat)*.8;g.add(H);
  for(const s of[-1,1])chain(g,[[s*.2,1.5,0],[s*.35,1.9,.1],[s*.7,2.0,.2]],.12,.08,'#7a1f2a');chain(g,[[0,.4,.3],[.6,.1,.5],[1.0,.05,.6]],.1,.05,'#7a1f2a');}
function h3Tendril(g,p,ph){for(let i=0;i<3;i++){const pts=[];for(let k=0;k<=6;k++){const q=k/6;pts.push([(i-1)*.3+Math.sin(ph*6.283+q*3+i)*.3*q,q*2,(i%2?.2:-.2)]);}chain(g,pts,.18,.04,'#6e3a5e');}}
const H3={hum:h3Hum,quad:h3Quad,dragon:h3Dragon,wyvern:h3Wyv,serp:h3Serp,spider:h3Spider,insect:h3Insect,bird:h3Bird,eye:h3Eye,ooze:h3Ooze,ghost:h3Ghost,ele:h3Ele,tree:h3Tree,golem:h3Golem,worm:h3Worm,kraken:h3Kraken,fish:h3Fish,swarm:h3Swarm,mimic:h3Mimic,heart:h3Heart,tendril:h3Tendril};
// Size and position are worked out once from the whole animation (all wing beats and tail swings together)
// and reused for every frame, so the model never jumps or shrinks between frames.
function fit3D(spec){const CA3=Math.cos(Math.PI/6),SA3=.5;let x0=1e9,x1=-1e9,s0=1e9,s1=-1e9,y0=1e9;
  for(let f=0;f<M3.F;f++){const g=new SR.Group();(H3[spec[0]]||h3Hum)(g,spec[1],f/M3.F);g.rotation.y=-.5;g.updateMatrixWorld();
    g.traverse(m=>{if(!m.geometry)return;const w=m.mw,P=m.geometry.pos;for(let i=0;i<P.length;i+=3){const x=P[i],y=P[i+1],z=P[i+2],X=w[0]*x+w[1]*y+w[2]*z+w[3],Y=w[4]*x+w[5]*y+w[6]*z+w[7],Z=w[8]*x+w[9]*y+w[10]*z+w[11],sv=Y*CA3-Z*SA3;
      if(X<x0)x0=X;if(X>x1)x1=X;if(sv<s0)s0=sv;if(sv>s1)s1=sv;if(Y<y0)y0=Y;}});dispose3D(g);}
  const lift=y0<0?-y0:0,top=s1+lift*CA3,bot=s0+lift*CA3;let k=Math.min(3.2/Math.max(x1-x0,.01),2.66/Math.max(top,.01),spec[1].scale||1);if(bot<0)k=Math.min(k,.6/-bot);
  return{k,dx:-(x0+x1)/2*k,dy:lift*k};}
function build3D(spec,ph,fit){const g=new SR.Group();(H3[spec[0]]||h3Hum)(g,spec[1],ph);g.rotation.y=-.5;g.scale.setScalar(fit.k);g.position.set(fit.dx,fit.dy,0);return g;}
function dispose3D(g){g.traverse(o=>{if(o.geometry&&o.geometry.userData.tmp)o.geometry.dispose();});}
const M3V='m3v12:';
// final pass: whichever colouring most frames agree on wins; any odd frame is replaced by its nearest good neighbour
function fixSheet(e){try{const F=M3.F,S=M3.S,m=e.means||[];if(m.length<F)return;let best=0,bi=0;
  for(let i=0;i<F;i++){let c=0;for(let j=0;j<F;j++)if(m[i]&&m[j]&&!hueOff(m[i],m[j]))c++;if(c>best){best=c;bi=i;}}
  const ok=m.map(x=>x&&!hueOff(x,m[bi]));if(ok.every(Boolean))return;const g=e.canvas.getContext('2d');
  for(let i=0;i<F;i++)if(!ok[i]){let k=1,src=-1;while(k<F&&src<0){if(ok[(i-k+F)%F])src=(i-k+F)%F;else if(ok[(i+k)%F])src=(i+k)%F;k++;}if(src>=0)g.putImageData(g.getImageData(src*S,0,S,S),i*S,0);}}catch(x){}}
function hueOff(a,b){return Math.abs((a[0]-a[2])-(b[0]-b[2]))+Math.abs((a[1]-a[2])-(b[1]-b[2]))>26||Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2])>60;}
// checks a saved model strip: true when every frame has the same colouring
function sheetOK(img){try{const S=M3.S,c=document.createElement('canvas');c.width=S*M3.F;c.height=S;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);
  const D=g.getImageData(0,0,c.width,S).data,means=[];for(let f=0;f<M3.F;f++){let n=0,R=0,G=0,B=0;for(let y=0;y<S;y+=2)for(let x=f*S;x<(f+1)*S;x+=2){const j=(y*c.width+x)*4;if(D[j+3]>200){n++;R+=D[j];G+=D[j+1];B+=D[j+2];}}means.push(n?[R/n,G/n,B/n]:null);}
  const ref=means[0];return!ref||means.every(m=>!m||!hueOff(m,ref));}catch(x){return true;}}
function measure3D(e){try{const S=M3.S,c=document.createElement('canvas');c.width=S*M3.F;c.height=S;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(e.canvas,0,0);
  const D=g.getImageData(0,0,c.width,S).data;let top=S;for(let y=0;y<S&&top===S;y++)for(let x=0;x<c.width;x+=2)if(D[(y*c.width+x)*4+3]>40){top=y;break;}e.topF=Math.max(.05,M3.FOOT-top/S);}catch(x){e.topF=.62;}}window.__dm3={fixSheet:e=>fixSheet(e),sheetOK:i=>sheetOK(i),M3,mo:t=>modelOf(t),H3:()=>H3,fit3D,build3D,sheet3D,pump3D,all:()=>{const out=[],seen=new Set();const add=(n,t)=>{const sp=modelOf(t);if(!sp)return;const p=Object.assign({},sp[1]);if(!p.body)p.body=t.color;const k=sp[0]+JSON.stringify(p);if(seen.has(k))return;seen.add(k);out.push([n,[sp[0],p]]);};CREATURES.forEach(c=>add(c[0],{name:c[0],kind:'creature',color:CATS[c[3]]||'#a0473a',cat:c[3]}));HEROES.forEach(h=>add(h[0],{name:h[0],kind:'hero',color:COLORS[0]}));CREATURES.slice(0,40).forEach(c=>{const t={name:'Frenzied '+c[0],kind:'creature',color:'#7a2aa0',cat:c[3],frenzy:1};add(t.name,t);});return out;}};window.__spec=n=>{const x=MP[n];return x?[x[0],Object.assign({},x[1],{body:x[1].body||'#8a6b4a'})]:['hum',{body:'#7a8490'}];};
function sheet3D(spec){if(!init3D())return null;const key=spec[0]+JSON.stringify(spec[1]);let e=M3.cache.get(key);
  if(!e){e={spec,ready:false,key};M3.cache.set(key,e);
    const queue=()=>{if(!e.ready&&!M3.queue.includes(e)){M3.queue.push(e);redraw();}};
    idbGet(M3V+key).then(blob=>{if(!blob)return queue();const img=new Image();img.onload=()=>{if(img.naturalWidth===M3.S*M3.F&&sheetOK(img)){e.canvas=img;measure3D(e);e.ready=true;redraw();}else queue();};img.onerror=queue;img.src=URL.createObjectURL(blob);}).catch(queue);}
  return e.ready?e:null;}
function pump3D(budget){if(!M3.ok)return;const t0=performance.now();let did=0;
  while(M3.queue.length&&performance.now()-t0<budget){const e=M3.queue[0];
    try{if(!e.canvas){e.canvas=document.createElement('canvas');e.canvas.width=M3.S*M3.F;e.canvas.height=M3.S;e.f=0;e.fit=fit3D(e.spec);}
      const grp=build3D(e.spec,e.f/M3.F,e.fit);M3.sc.add(grp);const src=M3.r.render(M3.sc);M3.sc.remove(grp);
      const S=M3.S,SS=M3.SS,out=new ImageData(S,S),o=out.data;let n=0,R=0,G=0,B=0;
      for(let y=0;y<S;y++)for(let x=0;x<S;x++){let r=0,g=0,b=0,a=0;for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){const j=((y*2+dy)*SS+x*2+dx)*4,al=src[j+3];r+=src[j]*al;g+=src[j+1]*al;b+=src[j+2]*al;a+=al;}
        const k=(y*S+x)*4;if(a>0){o[k]=r/a;o[k+1]=g/a;o[k+2]=b/a;o[k+3]=a/4;if(a>800){n++;R+=o[k];G+=o[k+1];B+=o[k+2];}}}
      const mean=n?[R/n,G/n,B/n]:[0,0,0];
      // Every frame must have the same colouring as the first. If a frame comes out tinted differently
      // (seen on iPhones), it is re-rendered on a fresh renderer; if it still differs, the previous good frame is reused.
      let good=out;
      if(e.f===0)e.mean=mean;else if(n&&e.mean&&hueOff(mean,e.mean)){e.retry=(e.retry||0)+1;if(e.retry<=3){M3.r=new SR.Renderer(M3.SS);M3.r.noBlit=true;continue;}good=e.lastOut||out;}
      e.retry=0;e.lastOut=good;(e.means=e.means||[])[e.f]=good===out?mean:(e.means[e.f-1]||mean);
      e.canvas.getContext('2d').putImageData(good,e.f*S,0);
      e.f++;did++;if(e.f>=M3.F){fixSheet(e);measure3D(e);e.ready=true;M3.queue.shift();try{e.canvas.toBlob(b=>{if(b)idbPut(M3V+e.key,b).catch(()=>{});},'image/png');}catch(x){}}}catch(err){e.failed=true;M3.queue.shift();console.warn('3D model failed',err);}}
  if(did)redraw();}

function drawLabels(){
  const cs=view.cs,fs=Math.max(12,Math.min(40,cs*.85));
  ctx.font=`${fs}px "IM Fell English SC",Georgia,serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
  for(const lb of L.labels){
    if(mode==='party'&&!lb.show)continue;
    // DM notes: a small pin when zoomed out (so they don't bury the map), full text when zoomed in
    if(!lb.show&&!lb.link&&cs<44&&lb.id!==selLabel){const x=lb.x*cs,y=lb.y*cs,r=Math.max(5,cs*.32);dot(x,y,r+1.5,'rgba(10,8,6,.8)');dot(x,y,r,'#f0c674');
      ctx.save();ctx.fillStyle='#2a1e08';ctx.font=`bold ${Math.round(r*1.3)}px Georgia,serif`;ctx.fillText('i',x,y+r*.08);ctx.restore();lb._w=r*2/cs;lb._h=r*2/cs;continue;}
    const txt=lb.text+(lb.link?' ›':''),w=ctx.measureText(txt).width,x=lb.x*cs,y=lb.y*cs;lb._w=w/cs;lb._h=fs*1.2/cs;
    if(lb.id===selLabel){ctx.strokeStyle='#f0b443';ctx.lineWidth=1.5;ctx.setLineDash([4,3]);ctx.strokeRect(x-w/2-6,y-fs*.65,w+12,fs*1.3);ctx.setLineDash([]);}
    ctx.lineWidth=Math.max(3,fs*.24);ctx.strokeStyle='rgba(10,8,6,.85)';ctx.strokeText(txt,x,y);
    ctx.fillStyle=lb.show?(lb.link?'#ffe2a8':'#f4ecda'):'#f0c674';ctx.fillText(txt,x,y);
    if(lb.link){ctx.fillStyle=ctx.fillStyle;ctx.fillRect(x-w/2,y+fs*.5,w,Math.max(1,fs*.06));}
  }
  ctx.lineJoin='miter';
}
function visibleTokens(){return L.tokens.filter(t=>mode==='dm'||t.kind==='hero'||(!t.hidden&&seenByParty(t)));}
let ov=null,ovKey='',ovBuilt=0,ovTimer=null;
function overview(){
  const key=mode+'|'+ovStamp+'|'+L.id;if(ov&&ovKey===key)return ov;
  if(ov&&ovKey.endsWith('|'+L.id)&&act&&performance.now()-ovBuilt<220){clearTimeout(ovTimer);ovTimer=setTimeout(draw,240);return ov;}
  if(!ov)ov=document.createElement('canvas');
  if(ov.width!==L.cols||ov.height!==L.rows){ov.width=L.cols;ov.height=L.rows;}
  const g=ov.getContext('2d'),im=g.createImageData(L.cols,L.rows),d=im.data,party=mode==='party';
  for(let i=0,n=L.cells.length;i<n;i++){const c=T[L.cells[i]].rgb;let r=c[0],gg=c[1],b=c[2];const e=L.elev[i];if(e){const a=Math.min(.35,e*.04);r+=(255-r)*a;gg+=(255-gg)*a;b+=(255-b)*a;}
    if(party&&!partyVis[i]){if(L.explored[i]){r*=.26;gg*=.26;b*=.26;}else{r=5;gg=7;b=10;}}
    const j=i<<2;d[j]=r;d[j+1]=gg;d[j+2]=b;d[j+3]=255;}
  g.putImageData(im,0,0);ovKey=key;ovBuilt=performance.now();return ov;
}
/* ================= effects ================= */
const sc=document.createElement('canvas'),lc=document.createElement('canvas');
let fx={water:null,lava:null,foam:null,lights:[],tents:[],nW:0,nL:0};
const FXW={shallow:1,deep:1};
const FXC={terminal:'#7affb0',elight:'#ff4030',plight:'#dcefff',cryopod:'#7fd0ff',screen:'#cfe8ff',booth:'#8aff9a',lava:'#ff7a2a',crust:'#ff6a20',fire:'#ffb04a',torch:'#ffb04a',crystal:'#7fe0ff',fungus:'#a07aff',mushroom:'#6fe0d0',portal:'#b07aff',acid:'#c8f050',eye:'#ffcc55',circle:'#7fe0d0'};
function fxCollect(id,px,py,x,y,cs){
  const t=T[id];
  if(FXW[t.k]){fx.water.rect(px,py,cs,cs);fx.nW++;
    const land=(nx,ny)=>inb(nx,ny)&&!FXW[T[L.cells[ny*L.cols+nx]].k];
    if(land(x,y-1)){fx.foam.moveTo(px,py+1);fx.foam.lineTo(px+cs,py+1);}
    if(land(x,y+1)){fx.foam.moveTo(px,py+cs-1);fx.foam.lineTo(px+cs,py+cs-1);}
    if(land(x-1,y)){fx.foam.moveTo(px+1,py);fx.foam.lineTo(px+1,py+cs);}
    if(land(x+1,y)){fx.foam.moveTo(px+cs-1,py);fx.foam.lineTo(px+cs-1,py+cs);}}
  else if(t.k==='lava'){fx.lava.rect(px,py,cs,cs);fx.nL++;}
  if(t.glow&&fx.lights.length<900)fx.lights.push({x:px+cs/2,y:py+cs/2,r:(t.glow+1.5)*cs,c:FXC[t.k]||'#ffd27a',s:hash(x,y)*10,f:t.k==='fire'||t.k==='torch'||t.k==='lava'||t.k==='crust'});
  if(t.k==='tentacle'&&fx.tents.length<300)fx.tents.push([px+cs/2,py+cs*.75,hash(x,y)*10]);
}
const isBlk=(x,y)=>inb(x,y)&&T[L.cells[y*L.cols+x]].v==='b';
function aoCell(px,py,s,x,y,tall){
  if(s<9)return;const n=isBlk(x,y-1),w=isBlk(x-1,y),e=isBlk(x+1,y),so=!tall&&isBlk(x,y+1);if(!(n||w||e||so))return;
  // Light comes from the upper left, so walls to the north and west cast longer, darker shadows.
  for(let k=0;k<4;k++){const a=.22-.05*k,a2=.12-.03*k;
    if(n){ctx.fillStyle=`rgba(0,0,0,${a})`;ctx.fillRect(px,py+s*.11*k,s,s*.11);}
    if(w){ctx.fillStyle=`rgba(0,0,0,${a})`;ctx.fillRect(px+s*.11*k,py,s*.11,s);}
    if(e&&a2>0){ctx.fillStyle=`rgba(0,0,0,${a2})`;ctx.fillRect(px+s-s*.08*(k+1),py,s*.08,s);}
    if(so&&a2>0){ctx.fillStyle=`rgba(0,0,0,${a2})`;ctx.fillRect(px,py+s-s*.08*(k+1),s,s*.08);}}
}
// Procedural textures: tileable caustics (light webs on water), soft grain for richer ground, and fog.
let TEX=null;const patCache=new WeakMap();
function pnoise(x,y,P,s){const ix=Math.floor(x),iy=Math.floor(y),fx_=x-ix,fy=y-iy,ux=fx_*fx_*(3-2*fx_),uy=fy*fy*(3-2*fy),m=v=>((v%P)+P)%P;
  const a=h3(m(ix),m(iy),s),b=h3(m(ix+1),m(iy),s),c=h3(m(ix),m(iy+1),s),d=h3(m(ix+1),m(iy+1),s);return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy;}
function makeTex(){
  const N=256;
  // Caustics: a warped cell pattern, softened, so the light webs look wavy like sunlight through water.
  const caus=(seed,col,cells,width,warp)=>{const c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext('2d'),im=g.createImageData(N,N),d=im.data,R=rng(seed),P=[],A=new Float32Array(N*N);
    for(let i=0;i<cells;i++)P.push([R()*N,R()*N]);
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){const wx=x+(pnoise(x/N*4,y/N*4,4,seed)-.5)*warp,wy=y+(pnoise(x/N*4+7.3,y/N*4+1.1,4,seed+1)-.5)*warp;let f1=1e9,f2=1e9;
      for(const[px,py]of P){let dx=Math.abs(wx-px)%N,dy=Math.abs(wy-py)%N;if(dx>N/2)dx=N-dx;if(dy>N/2)dy=N-dy;const dd=dx*dx+dy*dy;if(dd<f1){f2=f1;f1=dd;}else if(dd<f2)f2=dd;}
      const a=Math.max(0,1-(Math.sqrt(f2)-Math.sqrt(f1))/width);A[y*N+x]=a*a;}
    for(let pass=0;pass<2;pass++){const B=new Float32Array(N*N);for(let y=0;y<N;y++)for(let x=0;x<N;x++){let t=0;for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++)t+=A[((y+b+N)%N)*N+(x+a+N)%N];B[y*N+x]=t/9;}A.set(B);}
    for(let k=0;k<N*N;k++){const j=k*4;d[j]=col[0];d[j+1]=col[1];d[j+2]=col[2];d[j+3]=Math.min(255,A[k]*300);}
    g.putImageData(im,0,0);return c;};
  const noise=(seed,fog)=>{const c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext('2d'),im=g.createImageData(N,N),d=im.data;
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){let v=0,amp=.5,tot=0;for(const P of[4,8,16,32]){v+=pnoise(x/N*P,y/N*P,P,seed+P)*amp;tot+=amp;amp*=.55;}v/=tot;const j=(y*N+x)*4;
      if(fog){const a=Math.max(0,Math.min(1,(v-.38)*2.4));d[j]=d[j+1]=d[j+2]=235;d[j+3]=a*200;}else{const g2=Math.round(70+v*120);d[j]=d[j+1]=d[j+2]=g2;d[j+3]=255;}}
    g.putImageData(im,0,0);return c;};
  TEX={c1:caus(11,[150,225,255],18,9,46),c2:caus(29,[220,250,255],26,6,34),lava:caus(41,[255,205,95],14,11,50),grain:noise(5,false),fog:noise(9,true)};
}
function pat(g,key){if(!TEX)makeTex();let m=patCache.get(g);if(!m){m={};patCache.set(g,m);}if(!m[key])m[key]=g.createPattern(TEX[key],'repeat');return m[key];}
function setPat(p,scale,ox,oy){if(p&&p.setTransform&&window.DOMMatrix){p.setTransform(new DOMMatrix([scale,0,0,scale,ox,oy]));return true;}return false;}
function drawGrain(W,H){const p=pat(ctx,'grain');if(!setPat(p,view.cs*10/256,0,0))return;ctx.save();ctx.globalCompositeOperation='soft-light';ctx.globalAlpha=.6;ctx.fillStyle=p;ctx.fillRect(view.x,view.y,W,H);ctx.restore();}
function moodLevel(){const m=L.mood||'auto';let d=m==='auto'?(L.lit?0:.42):m==='dusk'?.35:m==='night'?.72:0;if(mode==='dm')d*=.55;return d;}
function flick(l,t){return l.f?1+.025*Math.sin(t*.004+l.s)+.012*Math.sin(t*.009+l.s*2.3):1+.012*Math.sin(t*.0015+l.s);}
function tokLift(t){const cs=view.cs;if(!(prefs.view3d&&cs>=8))return 0;const EU=cs*prefs.wallH*EUF,WH=cs*prefs.wallH,n=SZ(t);let lift=0;
  for(let y=t.y;y<t.y+n;y++)for(let x=t.x;x<t.x+n;x++)if(inb(x,y)){const j=y*L.cols+x;lift=Math.max(lift,L.elev[j]*EU+(T[L.cells[j]].v==='b'?WH:0));}return lift;}
function drawWaterFx(t,W,H){
  const cs=view.cs;
  if(fx.nW){const k1=cs*12/256,k2=cs*7/256,sp=cs/1000;
    ctx.save();ctx.clip(fx.water);
    const pf=pat(ctx,'fog'),kf=cs*22/256;if(setPat(pf,kf,(t*sp*.08)%(256*kf),(t*sp*.05)%(256*kf))){ctx.globalCompositeOperation='soft-light';ctx.globalAlpha=.7;ctx.fillStyle=pf;ctx.fillRect(view.x,view.y,W,H);}
    ctx.globalCompositeOperation='lighter';
    const p1=pat(ctx,'c1'),p2=pat(ctx,'c2');
    if(setPat(p1,k1,(t*sp*.35)%(256*k1),(t*sp*.22)%(256*k1))){ctx.globalAlpha=.55+.1*Math.sin(t*.0011);ctx.fillStyle=p1;ctx.fillRect(view.x,view.y,W,H);}
    if(setPat(p2,k2,-(t*sp*.28)%(256*k2),(t*sp*.4)%(256*k2))){ctx.globalAlpha=.42+.1*Math.sin(t*.0017+1);ctx.fillStyle=p2;ctx.fillRect(view.x,view.y,W,H);}
    ctx.restore();
    ctx.save();ctx.strokeStyle=`rgba(235,250,255,${.4+.15*Math.sin(t*.002)})`;ctx.lineWidth=Math.max(1.5,cs*.12);ctx.setLineDash([cs*.35,cs*.22]);ctx.lineDashOffset=-t*.004*cs;ctx.stroke(fx.foam);ctx.restore();}
  if(fx.nL){const k=cs*10/256,sp=cs/1000,p=pat(ctx,'lava');ctx.save();ctx.clip(fx.lava);ctx.globalCompositeOperation='lighter';
    if(setPat(p,k,(t*sp*.12)%(256*k),(t*sp*.08)%(256*k))){ctx.globalAlpha=.5+.2*Math.sin(t*.0015);ctx.fillStyle=p;ctx.fillRect(view.x,view.y,W,H);}
    ctx.globalAlpha=.12+.08*Math.sin(t*.003);ctx.fillStyle='#ff9a3a';ctx.fillRect(view.x,view.y,W,H);ctx.restore();}
  for(const[x,y,s]of fx.tents){const a=-Math.PI/2+Math.sin(t*.0022+s)*.7,a2=a+Math.sin(t*.0031+s*2)*.6,l=cs*.75;
    const mx=x+Math.cos(a)*l*.5,my=y+Math.sin(a)*l*.5,ex=mx+Math.cos(a2)*l*.5,ey=my+Math.sin(a2)*l*.5;
    ctx.lineCap='round';ctx.strokeStyle='#6e3a5e';ctx.lineWidth=cs*.2;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(mx,my,ex,ey);ctx.stroke();
    ctx.strokeStyle='#a8628f';ctx.lineWidth=cs*.08;ctx.stroke();ctx.lineCap='butt';dot(ex,ey,cs*.05,'#e3b4d2');}
}
function drawLighting(t){
  const cs=view.cs,lights=fx.lights.slice();
  for(const h of L.tokens){const P=LIGHTS[h.light];if(!P||!P.d)continue;if(mode==='party'&&h.kind==='creature'&&(h.hidden||!seenByParty(h)))continue;const n=SZ(h);
    lights.push({x:(h.x+n/2)*cs,y:(h.y+n/2)*cs-tokLift(h),r:(P.d/(L.scale||5)+n/2)*cs*.9,c:P.c,s:h.id,f:h.light==='torch'||h.light==='candle'||h.light==='fiery'});}
  let use=lights;if(use.length>220){const k=Math.ceil(use.length/220);use=use.filter((_,i)=>i%k===0).map(l=>Object.assign({},l,{r:l.r*1.25}));}
  const amb=SKY[lightTimeOf(L)].v,str=amb>=.75?.35:1;
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(const l of use){if(!l.c)continue;const r=l.r*.85*flick(l,t),gr=ctx.createRadialGradient(l.x,l.y,0,l.x,l.y,r),a=Math.round((l.f?56:36)*str).toString(16).padStart(2,'0');gr.addColorStop(0,l.c+a);gr.addColorStop(1,l.c+'00');ctx.fillStyle=gr;ctx.fillRect(l.x-r,l.y-r,r*2,r*2);}
  ctx.restore();
}
// Animated minis: writhing tentacles, hovering, glowing auras, flames and shadows.
function drawTokAnim(t,cx,gy,r,now,under){
  const a=t.anim;if(!a||a==='none')return;
  if(a==='tentacles'&&under){const n=6+Math.min(6,SZ(t)*2),len=r*2.6+view.cs*.6,base=shade(t.color,.75),light=shade(t.color,1.35);
    ctx.lineCap='round';
    for(let i=0;i<n;i++){const a0=i*TAU/n+t.id,pts=[];let x=cx,y=gy,ang=a0;
      for(let k=0;k<=10;k++){const s=k/10;ang=a0+Math.sin(now*.0016+s*4+i*1.7)*.55*s+Math.sin(now*.0007+i)*.25;x+=Math.cos(ang)*len/10;y+=Math.sin(ang)*len/10*.75;pts.push([x,y]);}
      for(let k=1;k<pts.length;k++){const w=Math.max(1,r*.32*(1-k/pts.length)+1);ctx.strokeStyle=base;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(...pts[k-1]);ctx.lineTo(...pts[k]);ctx.stroke();
        if(k%2===0&&w>3)dot(pts[k][0],pts[k][1]+w*.2,w*.18,light);}}
    ctx.lineCap='butt';}
  else if(a==='aura'&&under&&t.frenzy){const rr=r*(1.6+.05*Math.sin(now*.0012+t.id));const g=ctx.createRadialGradient(cx,gy-r*.3,r*.2,cx,gy-r*.3,rr);g.addColorStop(0,'rgba(70,15,100,.38)');g.addColorStop(1,'rgba(40,0,60,0)');ctx.fillStyle=g;ctx.fillRect(cx-rr,gy-r*.3-rr,rr*2,rr*2);
    for(let i=0;i<4;i++){const ph=((now*.0005+i/4+t.id*.13)%1),mx=cx+Math.sin(i*2.3+now*.001)*r*.6,my=gy-r*(.3+ph*1.6),mr=r*(.25+ph*.35);dot(mx,my,mr,`rgba(110,40,150,${.22*(1-ph)})`);}}
  else if(a==='aura'&&under){const rr=r*(1.7+.06*Math.sin(now*.0015+t.id));ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(cx,gy,0,cx,gy,rr);g.addColorStop(0,t.color+'aa');g.addColorStop(1,t.color+'00');ctx.fillStyle=g;ctx.fillRect(cx-rr,gy-rr,rr*2,rr*2);ctx.restore();}
  else if(a==='shadow'&&under){const rr=r*(1.8+.12*Math.sin(now*.002+t.id));const g=ctx.createRadialGradient(cx,gy,r*.3,cx,gy,rr);g.addColorStop(0,'rgba(10,0,20,.55)');g.addColorStop(1,'rgba(10,0,20,0)');ctx.fillStyle=g;ctx.fillRect(cx-rr,gy-rr,rr*2,rr*2);}
  else if(a==='flames'&&!under){ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<7;i++){const ph=(now*.0012+i/7)%1,ang=i*TAU/7+t.id,fx_=cx+Math.cos(ang)*r*.9,fy=gy+Math.sin(ang)*r*.45-ph*r*1.6,fr=r*.32*(1-ph);
    if(fr>0){const g=ctx.createRadialGradient(fx_,fy,0,fx_,fy,fr);g.addColorStop(0,'rgba(255,220,120,.9)');g.addColorStop(1,'rgba(255,90,20,0)');ctx.fillStyle=g;ctx.fillRect(fx_-fr,fy-fr,fr*2,fr*2);}}ctx.restore();}
}
function drawTok(t,now,sub){
  const cs=view.cs,minis=prefs.mini3d&&cs>=8,n=SZ(t),unseen=mode==='dm'&&t.kind==='creature'&&!t.hidden&&L.tokens.some(h=>h.kind==='hero')&&!seenByParty(t),alpha=1;
  let lift=tokLift(t);const fxOn=prefs.fx&&cs>=5,alt=t.alt||0,tall=prefs.view3d&&cs>=8;
  if(fxOn&&t.anim==='hover')lift+=cs*(.25+.08*Math.sin(now*.003+t.id));
  const cx=(t.x+n/2)*cs,gy=(t.y+n/2)*cs-tokLift(t),r=Math.max(3,n*cs*.42);
  const altLift=alt>0?Math.min(cs*5,(alt/5)*(tall?cs*prefs.wallH*EUF:cs*.15)):0;
  if(altLift){ // shadow on the ground and a drop line, so you can see which square a flier is over
    ctx.save();ell(cx,gy+r*.25,r*Math.max(.35,.9-alt/400),r*Math.max(.18,.45-alt/800),`rgba(0,0,0,${Math.max(.15,.4-alt/600)})`);
    ctx.setLineDash([3,4]);ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(cx,gy+r*.25);ctx.lineTo(cx,gy-altLift+r*.2);ctx.stroke();ctx.restore();lift+=altLift;}
  if(unseen){ctx.save();ctx.setLineDash([3,4]);ctx.strokeStyle='rgba(200,205,215,.85)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(cx,gy+r*.3,r*1.25,r*.66,0,0,TAU);ctx.stroke();ctx.restore();}
  if(fxOn&&!sub&&!(alt<0))drawTokAnim(t,cx,gy,r,now,true);
  if(lift){ctx.save();ctx.translate(0,-lift);}
  const style=prefs.miniStyle||(prefs.mini3d?'model':'flat'),spec=style==='model'&&cs>=5?modelOf(t):null;
  const dim=sub||(alt<0)?.55:1;
  if(spec)drawModelMini(t,alpha*dim,now,spec);
  else if(sub||alt<0)drawToken(t,alpha*.55);else (style!=='flat'&&cs>=8)?drawMini(t,alpha):drawToken(t,alpha);
  if(lift){ctx.restore();if(!t._box)t._box=[t.x,t.y,t.x+n,t.y+n];t._box[1]-=lift/cs;t._box[3]-=lift/cs;}
  if(sub){ctx.fillStyle='rgba(5,45,110,.32)';ctx.beginPath();ctx.arc(cx,(t.y+n/2)*cs-lift,r*1.05,0,TAU);ctx.fill();}
  if(fxOn)drawTokAnim(t,cx,gy-lift,r,now,false);
  if(alt&&cs>=8){const txt=(alt>0?'↑ ':'↓ ')+Math.abs(alt)+' ft',y=gy-lift-r*(minis?2.4:1.2);ctx.font=`700 ${Math.max(10,Math.min(15,cs*.34))}px "Alegreya Sans",system-ui,sans-serif`;
    const w=ctx.measureText(txt).width+10,h=Math.max(14,Math.min(20,cs*.45));ctx.fillStyle=alt>0?'rgba(30,90,160,.92)':'rgba(90,60,30,.92)';
    ctx.beginPath();ctx.roundRect?ctx.roundRect(cx+r*.4,y-h/2,w,h,h/2):ctx.rect(cx+r*.4,y-h/2,w,h);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(txt,cx+r*.4+5,y+1);}
}
// Weather and atmosphere, drawn in screen space over the map.
const wx={type:'',w:0,h:0,p:[],t:0,flash:0};
function initWeather(type,W,H){wx.type=type;wx.w=W;wx.h=H;wx.p=[];const R=Math.random,A=W*H;
  const n={rain:Math.min(420,A/1700),storm:Math.min(520,A/1400),snow:Math.min(260,A/2600),embers:70,sunbeams:50,ash:Math.min(160,A/3500),fireflies:40,spores:55,bubbles:40,dust:60}[type]||0;
  for(let i=0;i<n;i++)wx.p.push({x:R()*W,y:R()*H,v:R(),ph:R()*TAU,r:R()});}
function drawWeather(now,W,H){
  const type=L.weather||'none';if(type==='none')return;
  if(wx.type!==type||wx.w!==W||wx.h!==H)initWeather(type,W,H);
  const dt=Math.min(.05,wx.t?(now-wx.t)/1000:.016);wx.t=now;
  ctx.save();
  if(type==='rain'||type==='storm'){ctx.strokeStyle='rgba(175,200,235,.5)';ctx.lineWidth=1;ctx.beginPath();
    for(const p of wx.p){const v=500+p.v*500;p.y+=v*dt;p.x+=v*.25*dt;if(p.y>H){p.y=-20;p.x=Math.random()*W;}if(p.x>W)p.x-=W;ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-4-p.v*4,p.y-16-p.v*10);}ctx.stroke();
    if(type==='storm'){if(Math.random()<.0012)wx.flash=1;if(wx.flash>0){ctx.fillStyle=`rgba(220,230,255,${wx.flash*.16})`;ctx.fillRect(0,0,W,H);wx.flash-=dt*1.6;}
      ctx.fillStyle='rgba(10,15,30,.18)';ctx.fillRect(0,0,W,H);}}
  else if(type==='snow'){for(const p of wx.p){p.y+=(20+p.v*40)*dt;p.x+=Math.sin(now*.001+p.ph)*20*dt;if(p.y>H){p.y=-5;p.x=Math.random()*W;}dot((p.x+W)%W,p.y,1+p.r*2.2,'rgba(255,255,255,.85)');}}
  else if(type==='ash'){for(const p of wx.p){p.y+=(12+p.v*20)*dt;p.x+=Math.sin(now*.0008+p.ph)*12*dt;if(p.y>H){p.y=-5;p.x=Math.random()*W;}dot((p.x+W)%W,p.y,1+p.r*1.5,'rgba(150,145,140,.6)');}}
  else if(type==='embers'||type==='fireflies'||type==='spores'||type==='dust'||type==='bubbles'){
    if(type!=='bubbles'&&type!=='dust')ctx.globalCompositeOperation='lighter';
    for(const p of wx.p){
      if(type==='embers'){p.y-=(25+p.v*45)*dt;p.x+=Math.sin(now*.002+p.ph)*25*dt;}
      else if(type==='bubbles'){p.y-=(18+p.v*30)*dt;p.x+=Math.sin(now*.003+p.ph)*10*dt;}
      else if(type==='spores'){p.y-=(5+p.v*10)*dt;p.x+=Math.sin(now*.0006+p.ph)*10*dt;}
      else{p.x+=Math.cos(now*.0005+p.ph)*(type==='dust'?6:18)*dt;p.y+=Math.sin(now*.0007+p.ph*1.3)*(type==='dust'?4:14)*dt;}
      if(p.y<-10){p.y=H+5;p.x=Math.random()*W;}if(p.y>H+10)p.y=-5;const x=(p.x%W+W)%W;
      const pulse=.5+.5*Math.sin(now*.003+p.ph*3);
      if(type==='embers'){dot(x,p.y,1+p.r*1.6,`rgba(255,${120+p.r*90|0},40,${.5+.5*pulse})`);}
      else if(type==='fireflies'){dot(x,p.y,9,`rgba(200,255,120,${.08*pulse})`);dot(x,p.y,2,`rgba(230,255,150,${.25+.7*pulse})`);}
      else if(type==='spores'){const c=p.r>.5?'120,240,220':'200,150,255';dot(x,p.y,7,`rgba(${c},${.07*pulse})`);dot(x,p.y,1.8,`rgba(${c},${.3+.5*pulse})`);}
      else if(type==='bubbles'){ring(x,p.y,2+p.r*4,'rgba(210,240,255,.55)',1);}
      else dot(x,p.y,.8+p.r,`rgba(255,245,220,${.12+.18*pulse})`);
    }}
  else if(type==='fog'){const p=pat(ctx,'fog');for(const[k,a,sx]of[[2.2,.55,.012],[3.4,.4,-.008]]){if(setPat(p,k,(now*sx-view.x*.3)%(256*k),(now*sx*.4-view.y*.3)%(256*k))){ctx.globalAlpha=a;ctx.fillStyle=p;ctx.fillRect(0,0,W,H);}}}
  else if(type==='sunbeams'){ctx.globalCompositeOperation='lighter';for(let i=0;i<6;i++){const x=((i*W/5+now*.01*(1+i%3))%(W*1.4))-W*.2,w=W*(.08+.05*(i%3)),a=.06+.04*Math.sin(now*.0007+i*1.3);
      const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,`rgba(255,236,180,${a*1.6})`);g.addColorStop(1,'rgba(255,236,180,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+w,0);ctx.lineTo(x+w-W*.35,H);ctx.lineTo(x-W*.35,H);ctx.closePath();ctx.fill();}
    for(const p of wx.p){p.x+=Math.cos(now*.0005+p.ph)*6*.016;p.y+=Math.sin(now*.0007+p.ph)*4*.016;dot((p.x%W+W)%W,(p.y%H+H)%H,.8+p.r,`rgba(255,245,210,${.15+.2*Math.sin(now*.003+p.ph)})`);}}
  else if(type==='heartbeat'){const ph=(now%1600)/1600,b=.5-.5*Math.cos(ph*6.283),g=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.42,W/2,H/2,Math.max(W,H)*.72);
    g.addColorStop(0,'rgba(120,0,20,0)');g.addColorStop(1,`rgba(110,0,22,${.14+.08*b})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
  ctx.restore();
}
let raf=0,lastT=0,staticDirty=true;
function redraw(){if(!raf)raf=requestAnimationFrame(tick);}
function draw(){staticDirty=true;if(!raf)raf=requestAnimationFrame(tick);}
function tick(now){
  raf=0;if(!L)return;
  const anim=prefs.fx&&!document.hidden;
  if(!staticDirty&&anim&&now-lastT<32){raf=requestAnimationFrame(tick);return;}
  lastT=now;
  if(sc.width!==cv.width||sc.height!==cv.height){sc.width=cv.width;sc.height=cv.height;staticDirty=true;}
  if(staticDirty){const old=ctx;ctx=sc.getContext('2d');renderStatic();ctx=old;staticDirty=false;}
  composite(now);
  if(anim)raf=requestAnimationFrame(tick);
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)draw();});
function composite(now){
  const W=cv.clientWidth,H=cv.clientHeight,cs=view.cs,small=cs<5;
  ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.drawImage(sc,0,0);
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.translate(-view.x,-view.y);
  const fxOn=prefs.fx&&!small;
  const list=visibleTokens().sort((a,b)=>(a.y+SZ(a))-(b.y+SZ(b))||(a.kind==='hero')-(b.kind==='hero')||(a.id===selId)-(b.id===selId));
  for(const t of list)if(t.submerged)drawTok(t,now,true);
  if(fxOn&&fx.water)drawWaterFx(now,W,H);
  for(const t of list)if(!t.submerged)drawTok(t,now,false);
  drawLightLevels();
  if(fxOn)drawLighting(now);
  drawLabels();
  drawOverlays();
  if(M3.queue.length)pump3D(16);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  if(prefs.fx){drawWeather(now,W,H);
    const vg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.hypot(W,H)*.6);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,8,.42)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);}
}

function renderStatic(){
  if(!L)return;
  liveView(false);
  if(visDirty)computeVis();
  const W=cv.clientWidth,H=cv.clientHeight,cs=view.cs,party=mode==='party';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.fillStyle='#0a0d11';ctx.fillRect(0,0,W,H);
  const small=cs<5,tall=prefs.view3d&&cs>=8,WH=tall?cs*prefs.wallH:0,EU=tall?cs*prefs.wallH*EUF:0,minis=prefs.mini3d&&cs>=8;
  const x0=Math.max(0,Math.floor(view.x/cs)),y0=Math.max(0,Math.floor(view.y/cs));
  const x1=Math.min(L.cols-1,Math.floor((view.x+W)/cs)),y1=Math.min(L.rows-1,Math.floor((view.y+H)/cs));
  const y1e=Math.min(L.rows-1,y1+(tall?Math.ceil((MAXE*EUF+1)*prefs.wallH)+3:0));
  ctx.translate(-view.x,-view.y);
  const det=cs>=13,sel=L.tokens.find(t=>t.id===selId),showSel=mode==='dm'&&sel&&sel.kind==='hero';
  if(showSel&&!small&&(!selVis||selVisFor!==selId)){selVis=new Uint8Array(L.cols*L.rows);heroVis(sel,selVis);selVisFor=selId;}
  const hOf=j=>L.elev[j]*EU+(T[L.cells[j]].v==='b'?WH:0);
  const fxc=prefs.fx&&!small;fx={water:new Path2D(),lava:new Path2D(),foam:new Path2D(),lights:[],tents:[],nW:0,nL:0};
  const glowGrid=L.gridStyle==='glow',gridCol=glowGrid?'rgba(140,225,255,.34)':'rgba(0,0,0,.28)';
  if(small){ctx.imageSmoothingEnabled=false;ctx.drawImage(overview(),0,0,L.cols*cs,L.rows*cs);ctx.imageSmoothingEnabled=true;}
  else if(!tall){
    ctx.fillStyle=T[0].c;ctx.fillRect(0,0,L.cols*cs,L.rows*cs);
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const i=y*L.cols+x,id=L.cells[i];if(id)drawCell(id,x*cs,y*cs,x,y,cs,det);
      if(fxc){if(id&&T[id].v!=='b')aoCell(x*cs,y*cs,cs,x,y,false);if(!party||partyVis[i])fxCollect(id,x*cs,y*cs,x,y,cs);}
      const e=L.elev[i];if(e){ctx.fillStyle=`rgba(255,255,255,${Math.min(.35,e*.045)})`;ctx.fillRect(x*cs,y*cs,cs,cs);}}
    ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=Math.max(1,cs*.05);ctx.beginPath();
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const i=y*L.cols+x,e=L.elev[i];
      if(x<L.cols-1&&L.elev[i+1]!==e){ctx.moveTo((x+1)*cs,y*cs);ctx.lineTo((x+1)*cs,(y+1)*cs);}
      if(y<L.rows-1&&L.elev[i+L.cols]!==e){ctx.moveTo(x*cs,(y+1)*cs);ctx.lineTo((x+1)*cs,(y+1)*cs);}}
    ctx.stroke();
    if(fxc)drawGrain(W,H);
    if(L.grid&&cs>=9){ctx.save();if(glowGrid)ctx.globalCompositeOperation='lighter';ctx.strokeStyle=gridCol;ctx.lineWidth=1;ctx.beginPath();
      for(let x=x0;x<=x1+1;x++){ctx.moveTo(x*cs+.5,y0*cs);ctx.lineTo(x*cs+.5,(y1+1)*cs);}
      for(let y=y0;y<=y1+1;y++){ctx.moveTo(x0*cs,y*cs+.5);ctx.lineTo((x1+1)*cs,y*cs+.5);}ctx.stroke();ctx.restore();}
    if(showSel){ctx.fillStyle='rgba(240,180,67,.2)';for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(selVis[y*L.cols+x])ctx.fillRect(x*cs,y*cs,cs,cs);}
    if(party)for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const i=y*L.cols+x;if(partyVis[i])continue;
      ctx.fillStyle=L.explored[i]?'rgba(5,7,10,.74)':'#05070a';ctx.fillRect(x*cs,y*cs,cs+.5,cs+.5);}
  }else{
    // 3D: draw back to front, row by row, so raised ground and walls cover what is behind them.
    ctx.fillStyle='#14181e';ctx.fillRect(0,0,L.cols*cs,L.rows*cs);
    for(let y=y0;y<=y1e;y++){const hasBelow=y+1<L.rows;
      for(let x=x0;x<=x1;x++){
        const i=y*L.cols+x,id=L.cells[i],t=T[id],v=t.v,Hc=hOf(i),Hs=hasBelow?hOf(i+L.cols):0,px=x*cs,ty=y*cs-Hc,fh=Math.max(0,Hc-Hs);
        const seen=!party||partyVis[i],exp=L.explored[i];
        if(!seen&&!exp){ctx.fillStyle='#05070a';ctx.fillRect(px,ty,cs+.5,cs+fh+.5);continue;}
        if(fh>0){const fy=(y+1)*cs-Hc;if(v==='b')drawFront(t,px,fy,cs,fh,x,y);else drawCliff(v==='o'?T[groundId(id)]:t,px,fy,cs,fh,x,y);}
        if(v==='b')drawBlockTop(id,x,y,px,ty,det);else{const g=v==='o'?groundId(id):id;if(g)drawCell(g,px,ty,x,y,cs,det);}
        if(L.elev[i]&&v!=='b'){ctx.fillStyle=`rgba(255,255,255,${Math.min(.22,L.elev[i]*.018)})`;ctx.fillRect(px,ty,cs,cs);}
        if(fxc){if(v!=='b')aoCell(px,ty,cs,x,y,true);if(seen)fxCollect(id,px,ty,x,y,cs);}
        if(L.grid&&cs>=9&&id){ctx.strokeStyle=gridCol;ctx.lineWidth=1;ctx.strokeRect(px+.5,ty+.5,cs,cs);}
        if(fh>0){ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(px,ty+cs-1,cs,1.5);}
        if(showSel&&selVis[i]){ctx.fillStyle='rgba(240,180,67,.22)';ctx.fillRect(px,ty,cs,cs);}
        if(v==='o'){ctx.globalAlpha=seen?1:.35;drawObject(id,x,y,cs,WH,L.elev[i]*EU);ctx.globalAlpha=1;}
        if(!seen){ctx.fillStyle='rgba(5,7,10,.74)';ctx.fillRect(px,ty,cs+.5,cs+fh+.5);}
      }
    }
  }
  if(fxc&&tall)drawGrain(W,H);
  if(mode==='dm'){ctx.strokeStyle='rgba(240,180,67,.35)';ctx.lineWidth=1;ctx.strokeRect(.5,.5,L.cols*cs-1,L.rows*cs-1);}
  if(showSel){const n=SZ(sel);ctx.strokeStyle='rgba(240,180,67,.85)';ctx.setLineDash([6,5]);ctx.lineWidth=1.5;ctx.beginPath();
    ctx.arc((sel.x+n/2)*cs,(sel.y+n/2)*cs,Math.max(.1,(sel.vision/L.scale)*cs),0,TAU);ctx.stroke();ctx.setLineDash([]);}
}

function drawOverlays(){
  const cs=view.cs,tall=prefs.view3d&&cs>=8,EU=tall?cs*prefs.wallH*EUF:0,WH=tall?cs*prefs.wallH:0,hOf=j=>L.elev[j]*EU+(T[L.cells[j]].v==='b'?WH:0);
  const tag=(txt,tx,ty)=>{ctx.textAlign='left';ctx.textBaseline='bottom';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(txt,tx,ty);ctx.fillStyle='#f0b443';ctx.fillText(txt,tx,ty);};
  if(act&&act.type==='rect'){
    const o=order(act),w=o.bx-o.ax+1,h=o.by-o.ay+1;
    const boxy=(tool==='shape'&&(shapeMode==='room'||shapeMode==='box'))||(tool==='build'&&['stower','house','hut','cabin','camp','ship'].includes(buildMode))||(tool==='biome'&&GENS[biome].full);
    ctx.fillStyle='rgba(240,180,67,.14)';ctx.strokeStyle='#f0b443';ctx.lineWidth=2;ctx.setLineDash([6,4]);
    if(boxy){ctx.fillRect(o.ax*cs,o.ay*cs,w*cs,h*cs);ctx.strokeRect(o.ax*cs+1,o.ay*cs+1,w*cs-2,h*cs-2);}
    else{ctx.beginPath();ctx.ellipse((o.ax+w/2)*cs,(o.ay+h/2)*cs,w*cs/2,h*cs/2,0,0,TAU);ctx.fill();ctx.stroke();}
    ctx.setLineDash([]);ctx.font='600 13px "Alegreya Sans",sans-serif';tag(`${fmtDist(w)} × ${fmtDist(h)}`,o.ax*cs+4,o.ay*cs-4);
  }
  if(act&&act.type==='line'){
    ctx.globalAlpha=.55;ctx.fillStyle='#f0b443';const pts=linePoints(act),bw=Math.max(1,brush)*cs;
    for(const[px,py]of pts){if(brush===1)ctx.fillRect(px*cs,py*cs,cs,cs);else{ctx.beginPath();ctx.arc((px+.5)*cs,(py+.5)*cs,bw/2,0,TAU);ctx.fill();}}
    ctx.globalAlpha=1;ctx.font='600 13px "Alegreya Sans",sans-serif';tag(`${fmtDist(Math.hypot(act.x1-act.x0,act.y1-act.y0))} long`,(act.x1+1)*cs,act.y1*cs);
  }
  if(measure){
    const ax=(measure.x0+.5)*cs,ay=(measure.y0+.5)*cs,bx=(measure.x1+.5)*cs,by=(measure.y1+.5)*cs;
    const sq=Math.max(Math.abs(measure.x1-measure.x0),Math.abs(measure.y1-measure.y0));
    ctx.setLineDash([5,5]);ring(ax,ay,sq*cs,'rgba(240,180,67,.5)',1.5);ctx.setLineDash([]);
    line(ax,ay,bx,by,'rgba(0,0,0,.6)',5);line(ax,ay,bx,by,'#f0b443',2.5);dot(ax,ay,4,'#f0b443');dot(bx,by,4,'#f0b443');
    ctx.font='700 15px "Alegreya Sans",sans-serif';tag(fmtDist(sq),bx+8,by-6);
  }
  if(hover&&['paint','scatter','replace','height'].includes(tool)&&mode==='dm'){
    const pc=pick(hover),hx=pc.x,hy=pc.y,lift=tall&&inb(hx,hy)?hOf(hy*L.cols+hx):0;ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=1.5;
    if(brush===1)ctx.strokeRect(hx*cs+1,hy*cs+1-lift,cs-2,cs-2);
    else if(brushShape==='square'){const lo=-Math.floor((brush-1)/2);ctx.strokeRect((hx+lo)*cs,(hy+lo)*cs-lift,brush*cs,brush*cs);}
    else{ctx.beginPath();ctx.arc((hx+.5)*cs,(hy+.5)*cs-lift,(brush/2+.2)*cs,0,TAU);ctx.stroke();}
  }
}

/* ================= view ================= */
const MINCS=.08,MAXCS=90;
function resizeCanvas(){dpr=window.devicePixelRatio||1;cv.width=Math.max(1,Math.round(cv.clientWidth*dpr));cv.height=Math.max(1,Math.round(cv.clientHeight*dpr));clampView();draw();}
function clampView(){if(!L)return;const W=cv.clientWidth,H=cv.clientHeight,mw=L.cols*view.cs,mh=L.rows*view.cs;
  view.x=Math.min(Math.max(view.x,-W*.6),mw-W*.4);view.y=Math.min(Math.max(view.y,-H*.6),mh-H*.4);}
function zoomAt(f,sx,sy){const wx=(sx+view.x)/view.cs,wy=(sy+view.y)/view.cs;view.cs=Math.max(MINCS,Math.min(MAXCS,view.cs*f));view.x=wx*view.cs-sx;view.y=wy*view.cs-sy;clampView();draw();}
function fitView(){const W=cv.clientWidth,H=cv.clientHeight;view.cs=Math.max(MINCS,Math.min(44,Math.min(W/L.cols,H/L.rows)*.96));
  view.x=(L.cols*view.cs-W)/2;view.y=(L.rows*view.cs-H)/2;draw();}
function centerOn(x,y,cs){const W=cv.clientWidth,H=cv.clientHeight;view.cs=cs;view.x=x*cs-W/2;view.y=y*cs-H/2;clampView();draw();}
function startView(){const hs=L.tokens.filter(t=>t.kind==='hero');
  if(hs.length){centerOn(hs.reduce((a,t)=>a+t.x+.5,0)/hs.length,hs.reduce((a,t)=>a+t.y+.5,0)/hs.length,24);}else fitView();}

/* ================= undo & save ================= */
function stack(){let s=undoStacks.get(L.id);if(!s){s=[];undoStacks.set(L.id,s);}return s;}
const cleanLabels=()=>L.labels.map(({_w,_h,...r})=>r);
const cleanTok=({_box,...r})=>r;
function undoCap(){return Math.max(4,Math.min(40,Math.floor(2e7/L.cells.length)));}
function pushUndo(){const s=stack();s.push({cells:L.cells.slice(),elev:L.elev.slice(),tokens:JSON.stringify(L.tokens.map(cleanTok)),labels:JSON.stringify(cleanLabels())});while(s.length>undoCap())s.shift();updUndo();}
function undo(){const s=stack();const u=s.pop();if(!u){toast('Nothing left to undo on this level.');return;}L.cells=u.cells;if(u.elev)L.elev=u.elev;L.tokens=JSON.parse(u.tokens);L.labels=JSON.parse(u.labels);
  if(!L.tokens.some(t=>t.id===selId))selId=null;closeSheets();invalidate();draw();save();updUndo();}
function updUndo(){const e=!stack().length;document.getElementById('undoBtn').disabled=e;document.getElementById('fUndo').disabled=e;}
const KEY='dungeon-maker-v2',OLDKEY='dungeon-maker-v1';
function rle(a){let s='',i=0;const n=a.length;while(i<n){const v=a[i];let j=i+1;while(j<n&&a[j]===v)j++;const c=j-i;s+=String.fromCharCode(48+v)+(c>1?c.toString(36):'')+'|';i=j;}return s;}
function unrle(s,n){const a=new Uint8Array(n);let i=0,p=0;while(p<s.length&&i<n){const v=Math.max(0,Math.min(T.length-1,s.charCodeAt(p)-48));p++;let q=s.indexOf('|',p);if(q<0)q=s.length;
  const c=q>p?parseInt(s.slice(p,q),36):1;a.fill(v,i,Math.min(n,i+c));i+=c;p=q+1;}return a;}
function dec(s,n){const a=new Uint8Array(n);for(let i=0;i<n&&i<s.length;i++)a[i]=Math.max(0,Math.min(T.length-1,s.charCodeAt(i)-48));return a;}
// IndexedDB holds far more than localStorage, so mile-wide levels and pictures fit.
let dbp=null;
function db(){if(!dbp)dbp=new Promise((res,rej)=>{try{const r=indexedDB.open('dungeon-maker',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);}catch(e){rej(e);}});return dbp;}
function idbGet(k){return db().then(d=>new Promise((res,rej)=>{const q=d.transaction('kv').objectStore('kv').get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error);}));}
function idbPut(k,v){return db().then(d=>new Promise((res,rej)=>{const tx=d.transaction('kv','readwrite');tx.objectStore('kv').put(v,k);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error);tx.onabort=()=>rej(tx.error);}));}
function snapshot(){return{v:4,cur:D.cur,nextId:D.nextId,prefs:Object.assign({},prefs),levels:D.levels.map(l=>({id:l.id,name:l.name,cols:l.cols,rows:l.rows,lit:l.lit,sky:l.sky,grid:l.grid,scale:l.scale,weather:l.weather,mood:l.mood,time:l.time,gridStyle:l.gridStyle,
  cells:l.cells,elev:l.elev,explored:l.explored,tokens:l.tokens.map(cleanTok),labels:l.labels.map(({_w,_h,...r})=>r)}))};}
function saveLS(){localStorage.setItem(KEY,JSON.stringify({v:3,cur:D.cur,nextId:D.nextId,prefs,levels:D.levels.map(l=>({id:l.id,name:l.name,cols:l.cols,rows:l.rows,lit:l.lit,sky:l.sky,grid:l.grid,scale:l.scale,weather:l.weather,mood:l.mood,time:l.time,gridStyle:l.gridStyle,rle:1,
  cells:rle(l.cells),elev:rle(l.elev),explored:rle(l.explored),tokens:l.tokens.map(cleanTok),labels:l.labels.map(({_w,_h,...r})=>r)}))}));}
let saveTimer=null,saveFailed=false;
function saveFail(){if(!saveFailed){saveFailed=true;toast('This dungeon is too big to save on this device. Try fewer pictures on minis, or smaller levels.',7000);}}
function save(){if(tableMode)return;clearTimeout(saveTimer);saveTimer=setTimeout(()=>{
  let snap;try{snap=snapshot();}catch(e){return;}
  idbPut('dungeon',snap).then(()=>{saveFailed=false;markSynced();}).catch(()=>{try{saveLS();saveFailed=false;}catch(e){saveFail();}});
},600);}
function levelFrom(l,binary){const n=l.cols*l.rows;let cells,ex,el;
  if(binary){cells=l.cells instanceof Uint8Array&&l.cells.length===n?l.cells:new Uint8Array(n);ex=l.explored instanceof Uint8Array&&l.explored.length===n?l.explored:new Uint8Array(n);el=l.elev instanceof Uint8Array&&l.elev.length===n?l.elev:new Uint8Array(n);}
  else{const fn=l.rle?unrle:dec;cells=fn(l.cells||'',n);ex=fn(l.explored||'',n);el=l.elev?unrle(l.elev,n):new Uint8Array(n);}
  return{id:l.id,name:l.name||'Level',cols:l.cols,rows:l.rows,lit:!!l.lit,sky:l.sky,grid:l.grid!==false,scale:l.scale||5,weather:l.weather||'none',mood:l.mood||'auto',time:l.time,gridStyle:l.gridStyle||'line',cells,elev:el,explored:ex,tokens:(l.tokens||[]).map(normTok),labels:l.labels||[]};}
function fromData(d,binary){D={nextId:d.nextId||1,cur:Math.min(d.cur||0,d.levels.length-1),levels:d.levels.map(l=>levelFrom(l,binary))};if(d.prefs)Object.assign(prefs,d.prefs);L=D.levels[D.cur];}
async function loadAll(){
  try{const d=await idbGet('dungeon');if(d&&Array.isArray(d.levels)&&d.levels.length){fromData(d,true);return true;}}catch(e){}
  try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d&&Array.isArray(d.levels)&&d.levels.length){fromData(d,false);return true;}}catch(e){}
  try{const o=JSON.parse(localStorage.getItem(OLDKEY)||'null');
    if(o&&o.cols&&Array.isArray(o.cells)){
      D={nextId:(o.nextId||100)+1,cur:0,levels:[]};
      const l=newLevel('Level 1',o.cols,o.rows);l.cells=Uint8Array.from(o.cells);if(Array.isArray(o.explored))l.explored=Uint8Array.from(o.explored);
      l.tokens=(o.tokens||[]).map(normTok);D.levels.push(l);L=l;return true;}
  }catch(e){}
  return false;
}

/* ================= pointer ================= */
const ptrs=new Map();let gesture=null,act=null,hover=null;
function sp(e){const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
const toW=p=>({x:(p.x+view.x)/view.cs,y:(p.y+view.y)/view.cs});
const clampC=(v,max)=>Math.max(0,Math.min(max-1,v));
function hitToken(w){const list=visibleTokens().sort((a,b)=>(b.id===selId)-(a.id===selId)||(b.y+SZ(b))-(a.y+SZ(a)));
  return list.find(t=>{const n=SZ(t);if(w.x>=t.x&&w.x<t.x+n&&w.y>=t.y&&w.y<t.y+n)return true;const b=t._box;return!!b&&w.x>=b[0]&&w.x<=b[2]&&w.y>=b[1]&&w.y<=b[3];});}
function hitLabel(w){for(let i=L.labels.length-1;i>=0;i--){const lb=L.labels[i];if(mode==='party'&&!lb.show)continue;if(lb._w==null)continue;
  if(Math.abs(w.x-lb.x)<=lb._w/2+.2&&Math.abs(w.y-lb.y)<=lb._h/2+.1)return lb;}return null;}
function pick(w){const x=Math.floor(w.x),fy=Math.floor(w.y);if(!(prefs.view3d&&view.cs>=8)||x<0||x>=L.cols)return{x,y:fy};
  const EUc=prefs.wallH*EUF,WHc=prefs.wallH,hC=j=>L.elev[j]*EUc+(T[L.cells[j]].v==='b'?WHc:0);
  for(let y=Math.min(L.rows-1,Math.floor(w.y+MAXE*EUc+WHc+1));y>=Math.max(0,fy-1);y--){const i=y*L.cols+x,Hc=hC(i),Hs=y+1<L.rows?hC(i+L.cols):0;
    if(w.y>=y-Hc&&w.y<y+1-Hc)return{x,y};if(Hc>Hs&&w.y>=y+1-Hc&&w.y<y+1-Hs)return{x,y};}
  return{x,y:fy};}
function brushAt(cx,cy,a,kind){
  const tw=T[curT],w=wallFor(curT);ovStamp++;
  let lo,hi,r=brush/2;
  if(brushShape==='square'&&kind!=='scatter'){lo=-Math.floor((brush-1)/2);hi=lo+brush-1;}else{lo=-Math.ceil(r);hi=Math.ceil(r);}
  for(let dy=lo;dy<=hi;dy++)for(let dx=lo;dx<=hi;dx++){
    if(!(brushShape==='square'&&kind!=='scatter')){
      if(brush===1?(dx||dy):(dx*dx+dy*dy>r*r+.01))continue;
      if(brushShape==='rough'&&brush>2&&dx*dx+dy*dy>r*r*.3&&Math.random()<.45)continue;
    }
    const x=cx+dx,y=cy+dy;if(!inb(x,y))continue;const k=y*L.cols+x;
    if(kind==='height'){if(a.touched.has(k))continue;a.touched.add(k);const e=L.elev[k];let n=e;
      if(hMode==='raise')n=e+1;else if(hMode==='lower')n=e-1;else if(hMode==='flatten')n=a.level;
      else{let sm=0,c=0;for(let b=-1;b<=1;b++)for(let q=-1;q<=1;q++)if(inb(x+q,y+b)){sm+=L.elev[(y+b)*L.cols+x+q];c++;}n=Math.round(sm/c);}
      L.elev[k]=Math.max(0,Math.min(MAXE,n));continue;}
    if(kind==='scatter'){if(a.touched.has(k))continue;a.touched.add(k);if(T[L.cells[k]].b||L.cells[k]===0||Math.random()>density)continue;L.cells[k]=curT;continue;}
    if(kind==='replace'&&L.cells[k]!==a.target)continue;
    L.cells[k]=curT;if(paintLift!=null)L.elev[k]=paintLift;if(!tw.b)wrapAround(x,y,w);
  }
}
function strokeTo(cx,cy,kind){let x=act.lx,y=act.ly;const dx=Math.abs(cx-x),dy=-Math.abs(cy-y),sx=x<cx?1:-1,sy=y<cy?1:-1;let err=dx+dy;
  while(!(x===cx&&y===cy)){const e2=2*err;if(e2>=dy){err+=dy;x+=sx;}if(e2<=dx){err+=dx;y+=sy;}brushAt(x,y,act,kind);}act.lx=cx;act.ly=cy;}
function linePoints(a){
  const x0=a.x0+.5,y0=a.y0+.5,x1=a.x1+.5,y1=a.y1+.5,len=Math.hypot(x1-x0,y1-y0),n=Math.max(1,Math.ceil(len*2));
  const nx=-(y1-y0)/(len||1),ny=(x1-x0)/(len||1),amp=winding?Math.min(len*.2,18):0,pts=[];let lx=null,ly=null;
  for(let i=0;i<=n;i++){const t=i/n,off=amp?(fbm(t*len*.06,3.3,a.seed)-.5)*2.6*amp*Math.sin(Math.PI*t):0;
    const px=Math.floor(x0+(x1-x0)*t+nx*off),py=Math.floor(y0+(y1-y0)*t+ny*off);
    if(px===lx&&py===ly)continue;
    if(lx!==null&&(Math.abs(px-lx)>1||Math.abs(py-ly)>1)){const m=Math.max(Math.abs(px-lx),Math.abs(py-ly));for(let k=1;k<m;k++)pts.push([Math.round(lx+(px-lx)*k/m),Math.round(ly+(py-ly)*k/m)]);}
    pts.push([px,py]);lx=px;ly=py;}
  return pts;
}
function changed(){invalidate();draw();save();}
const stamping=()=>['paint','scatter','replace','height'].includes(tool);
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('pointerdown',e=>{
  try{cv.setPointerCapture(e.pointerId);}catch(_){}
  const p=sp(e);ptrs.set(e.pointerId,p);
  if(ptrs.size===2){if(act&&act.type==='paint')changed();act=null;const[a,b]=[...ptrs.values()];
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;gesture={d0:Math.hypot(a.x-b.x,a.y-b.y)||1,cs0:view.cs,wx:(mx+view.x)/view.cs,wy:(my+view.y)/view.cs};draw();return;}
  if(ptrs.size>2)return;
  if(e.button===1||e.button===2){act={type:'pan',lx:p.x,ly:p.y,sx:p.x,sy:p.y,moved:true};return;}
  const w=toW(p),pc=pick(w),cx=pc.x,cy=pc.y;
  if(tool==='move'){
    const t=tableMode?null:hitToken(w);
    if(t){selId=t.id;selLabel=null;act={type:'token',t,ox:w.x-t.x,oy:w.y-t.y,moved:false};draw();return;}
    const lb=hitLabel(w);
    if(lb){selLabel=lb.id;act={type:'label',lb,ox:w.x-lb.x,oy:w.y-lb.y,sx:p.x,sy:p.y,moved:false};draw();return;}
    act={type:'pan',lx:p.x,ly:p.y,sx:p.x,sy:p.y,moved:false};return;
  }
  if(tool==='measure'){const x=clampC(cx,L.cols),y=clampC(cy,L.rows);measure={x0:x,y0:y,x1:x,y1:y};act={type:'measure'};draw();return;}
  if(stamping()){if(!inb(cx,cy))return;pushUndo();act={type:'paint',lx:cx,ly:cy,touched:new Set(),target:get(cx,cy),level:Eat(cx,cy)};brushAt(cx,cy,act,tool);draw();return;}
  if(tool==='fill'){if(inb(cx,cy)){pushUndo();const n=floodFill(cx,cy,curT);changed();if(n>5000)toast(`Filled ${n.toLocaleString()} squares. Undo if that was too much.`);}return;}
  if(tool==='line'||(tool==='build'&&BUILDS[buildMode][1])){const x=clampC(cx,L.cols),y=clampC(cy,L.rows);act={type:'line',x0:x,y0:y,x1:x,y1:y,seed:(Math.random()*1e6)|0};draw();return;}
  if(tool==='shape'||tool==='biome'||tool==='build'){const x=clampC(cx,L.cols),y=clampC(cy,L.rows);act={type:'rect',x0:x,y0:y,x1:x,y1:y};draw();return;}
  if(tool==='label'){pushUndo();const lb={id:D.nextId++,x:w.x,y:w.y,text:'New place',show:true};L.labels.push(lb);selLabel=lb.id;selId=null;changed();openLabel(lb,true);}
});
cv.addEventListener('pointermove',e=>{
  const p=sp(e);if(ptrs.has(e.pointerId))ptrs.set(e.pointerId,p);
  if(gesture&&ptrs.size>=2){const[a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y),mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
    view.cs=Math.max(MINCS,Math.min(MAXCS,gesture.cs0*d/gesture.d0));view.x=gesture.wx*view.cs-mx;view.y=gesture.wy*view.cs-my;clampView();draw();return;}
  const w=toW(p);
  if(e.pointerType==='mouse'){hover=w;if(!act&&stamping())draw();}
  if(!act)return;
  if(act.type==='pan'){if(!act.moved&&Math.hypot(p.x-act.sx,p.y-act.sy)>6)act.moved=true;
    if(act.moved){view.x-=p.x-act.lx;view.y-=p.y-act.ly;clampView();draw();}act.lx=p.x;act.ly=p.y;return;}
  if(act.type==='token'){const t=act.t,n=SZ(t),nx=Math.max(0,Math.min(L.cols-n,Math.round(w.x-act.ox))),ny=Math.max(0,Math.min(L.rows-n,Math.round(w.y-act.oy)));
    if(nx!==t.x||ny!==t.y){if(!act.moved){pushUndo();act.moved=true;}if(nx!==t.x)t.face=nx>t.x?1:-1;t.x=nx;t.y=ny;invalidate();draw();liveTokens();}return;}
  if(act.type==='label'){if(!act.moved){if(Math.hypot(p.x-act.sx,p.y-act.sy)<6)return;pushUndo();act.moved=true;}
    act.lb.x=w.x-act.ox;act.lb.y=w.y-act.oy;draw();return;}
  const pc=pick(w);
  if(act.type==='paint'){strokeTo(pc.x,pc.y,tool);draw();return;}
  const x=clampC(pc.x,L.cols),y=clampC(pc.y,L.rows);
  if(act.type==='measure'){if(x!==measure.x1||y!==measure.y1){measure.x1=x;measure.y1=y;draw();}return;}
  if(act.type==='rect'||act.type==='line'){if(x!==act.x1||y!==act.y1){act.x1=x;act.y1=y;draw();}}
});
function pointerEnd(e){
  ptrs.delete(e.pointerId);
  if(gesture){if(ptrs.size<2){gesture=null;act=null;}return;}
  if(!act)return;const a=act;act=null;
  if(a.type==='pan'){if(a.moved)return;
    const w=toW(sp(e)),pc=pick(w),cx=pc.x,cy=pc.y,c=get(cx,cy);
    if(inb(cx,cy)&&T[c].tog&&(mode==='dm'||partyVis[idx(cx,cy)])){pushUndo();put(cx,cy,ID[T[c].tog]);changed();toast(T[ID[T[c].tog]].n.replace(/^./,m=>m.toUpperCase())+'.');}
    else{selId=null;selLabel=null;closeSheets();draw();}
    return;}
  if(a.type==='measure'){if(measure&&measure.x0===measure.x1&&measure.y0===measure.y1)measure=null;draw();return;}
  if(a.type==='token'){if(!a.moved)openTok(a.t);else save();return;}
  if(a.type==='label'){if(!a.moved){if(mode==='party'&&a.lb.link)goLink(a.lb);else openLabel(a.lb);}else save();draw();return;}
  if(a.type==='paint'){changed();return;}
  if(a.type==='line'){pushUndo();const st={touched:new Set()},keep=[curT,paintLift];
    if(tool==='build'){const pts=linePoints(a);let base=0;for(const[x,y]of pts)base=Math.max(base,Eat(x,y));curT=buildMode==='cwall'?ID.battlement:ID.bridge;paintLift=buildMode==='cwall'?base+2:(base||null);}
    for(const[x,y]of linePoints(a))brushAt(x,y,st,'paint');[curT,paintLift]=keep;changed();return;}
  if(a.type==='rect'){const o=order(a);pushUndo();const seed=(Math.random()*1e6)|0;
    if(tool==='biome')GENS[biome].run(o.ax,o.ay,o.bx,o.by,seed);
    else if(tool==='build')doBuild(buildMode,o.ax,o.ay,o.bx,o.by,seed);
    else if(shapeMode==='room')roomRect(o.ax,o.ay,o.bx,o.by,curT);
    else if(shapeMode==='box')fillCells(boxCells(o.ax,o.ay,o.bx,o.by),curT);
    else if(shapeMode==='oval')fillCells(ovalCells(o.ax,o.ay,o.bx,o.by),curT);
    else fillCells(caveCells(o.ax,o.ay,o.bx,o.by,seed),curT);
    changed();}
}
cv.addEventListener('pointerup',pointerEnd);
cv.addEventListener('pointercancel',pointerEnd);
cv.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){hover=null;draw();}});
cv.addEventListener('wheel',e=>{e.preventDefault();const p=sp(e);
  if(e.shiftKey){view.x+=e.deltaY;clampView();draw();return;}
  zoomAt(Math.exp(-Math.max(-60,Math.min(60,e.deltaY))*(e.ctrlKey?.012:.004)),p.x,p.y);},{passive:false});

/* ================= tools, view, options ================= */
const HINTS={
  move:'Drag minis to move them, tap one to edit. Tap doors and membranes to open them. Drag to pan, pinch to zoom.',
  measure:'Drag from one square to another to measure. The circle shows that distance as a radius.',
  paint:'Drag to paint. Walkable ground grows walls where it meets solid rock.',
  scatter:'Drag to sprinkle terrain loosely. Good for forests, mushrooms, rubble and bones.',
  replace:'Drag to swap only the terrain you start on, like turning grass into snow without touching walls.',
  fill:'Tap an area to flood it with the chosen terrain.',
  line:'Drag from start to end for a corridor, river or lava flow. Size sets the width.',
  shape:'Drag to place a room, a filled box, an oval or an organic cave.',
  biome:'Pick what to generate, then drag a rectangle. Castles, villages, deserts, mountains and more.',
  height:'Drag to raise or lower the ground into hills, cliffs and pits. Smooth softens steep edges.',
  build:'Pick a structure, then drag to place it. Castle walls and bridges are drawn like a line.',
  label:'Tap the map to name a place. You can hide labels from players.'
};
const toastEl=document.getElementById('toast');let toastTimer=null;
function toast(msg,ms){toastEl.textContent=msg;toastEl.classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove('on'),ms||4200);}
function partyHint(){toast(L.lit?'Party view. This level is lit from within, so heroes see everything in line of sight.':'Party view. Heroes see within their sight range, plus anything glowing.');}
function setTool(t,quiet){tool=t;if(t!=='measure')measure=null;
  document.querySelectorAll('.tool').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tool===t)));
  const opts=document.getElementById('opts');let any=false;
  opts.querySelectorAll('[data-for]').forEach(el=>{const on=el.dataset.for.split(' ').includes(t);el.hidden=!on;any=any||on;});
  opts.hidden=!any;
  if(!quiet)toast(HINTS[t]);draw();}
document.querySelectorAll('.tool').forEach(b=>b.addEventListener('click',()=>{closeSheets();setTool(b.dataset.tool);}));
document.querySelectorAll('#viewSeg button').forEach(b=>b.addEventListener('click',()=>{
  mode=b.dataset.view;ovStamp++;
  document.querySelectorAll('#viewSeg button').forEach(o=>o.setAttribute('aria-pressed',String(o===b)));
  document.querySelectorAll('.tool.edit').forEach(o=>o.disabled=mode==='party');
  if(mode==='party'){if(document.querySelector('.tool[aria-pressed="true"]').disabled)setTool('move',true);
    if(visDirty)computeVis();const s=L.tokens.find(t=>t.id===selId);if(s&&s.kind==='creature'&&(s.hidden||!seenByParty(s))){selId=null;closeSheets();}partyHint();}
  else toast('DM view. You see everything.');
  draw();}));
function choice(id,opts,get_,set_){const el=document.getElementById(id);
  opts.forEach(([v,label])=>{const b=document.createElement('button');b.className=id==='sizes'?'size':'chip plain';b.textContent=label;b.setAttribute('aria-pressed',String(get_()===v));
    b.addEventListener('click',()=>{set_(v);el.querySelectorAll('button').forEach(o=>o.setAttribute('aria-pressed',String(o===b)));draw();});el.appendChild(b);});}
choice('sizes',[1,2,3,5,8,12,20].map(n=>[n,String(n)]),()=>brush,v=>brush=v);
choice('shapeSeg',[['circle','Round'],['square','Square'],['rough','Rough']],()=>brushShape,v=>brushShape=v);
choice('densSeg',[[.12,'Sparse'],[.3,'Medium'],[.55,'Thick']],()=>density,v=>density=v);
choice('windSeg',[[false,'Straight'],[true,'Winding']],()=>winding,v=>winding=v);
choice('modeSeg',[['room','Room'],['box','Box'],['oval','Oval'],['cave','Cave']],()=>shapeMode,v=>shapeMode=v);
choice('liftSeg',[[null,'Keep'],[0,'0'],[1,'1'],[2,'2'],[3,'3'],[5,'5'],[8,'8']],()=>paintLift,v=>paintLift=v);
choice('hModeSeg',[['raise','Raise'],['lower','Lower'],['flatten','Flatten'],['smooth','Smooth']],()=>hMode,v=>hMode=v);
choice('buildSeg',Object.entries(BUILDS).map(([k,b])=>[k,b[0]]),()=>buildMode,v=>buildMode=v);
const GEN_GROUPS=[['Outdoors','Outdoors'],['Underground','Underground'],['Built','Built places'],['Living','Living dungeon']];
function updGenBtn(){const G=GENS[biome];document.getElementById('genBtn').textContent=`${G.e} ${G.n} ▾`;}
function renderGen(){const box=document.getElementById('genGroups');box.innerHTML='';
  GEN_GROUPS.forEach(([g,title])=>{const h=document.createElement('h3');h.textContent=title;box.appendChild(h);const grid=document.createElement('div');grid.className='tgrid';
    Object.entries(GENS).filter(([,G])=>G.g===g).forEach(([k,G])=>{const b=document.createElement('button');b.className='tcell';b.setAttribute('aria-pressed',String(k===biome));
      const e=document.createElement('span');e.className='emo';e.textContent=G.e;e.style.background='rgba(127,127,127,.18)';b.appendChild(e);
      const n=document.createElement('span');n.textContent=G.n;b.appendChild(n);const d=document.createElement('small');d.textContent=G.d;b.appendChild(d);
      b.addEventListener('click',()=>{biome=k;updGenBtn();closeSheets();toast(`Drag a rectangle to make ${G.n.toLowerCase()}.`);});grid.appendChild(b);});
    box.appendChild(grid);});}
document.getElementById('genBtn').addEventListener('click',()=>{renderGen();openSheet(document.getElementById('genSheet'));});
document.getElementById('genDone').addEventListener('click',closeSheets);
updGenBtn();
function paintSwatch(canvas,id){const d=window.devicePixelRatio||1,s=canvas.clientWidth||canvas.width;canvas.width=s*d;canvas.height=s*d;
  const old=ctx;ctx=canvas.getContext('2d');ctx.setTransform(d,0,0,d,0,0);ctx.fillStyle=T[0].c;ctx.fillRect(0,0,s,s);if(id)drawCell(id,0,0,-5,7,s,true);ctx=old;}
function setTerrain(id){curT=id;document.getElementById('terrainName').textContent=T[id].n;paintSwatch(document.getElementById('terrainSw'),id);
  document.querySelectorAll('#terrainGroups .tcell').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.id===id)));}
function setCompact(on){document.body.classList.toggle('compact',on);document.getElementById('hideTools').setAttribute('aria-pressed',String(on));requestAnimationFrame(resizeCanvas);}
document.getElementById('hideTools').addEventListener('click',()=>{const on=!document.body.classList.contains('compact');setCompact(on);if(on)toast('Tools hidden. Tap Show tools to bring them back.');});
document.getElementById('showTools').addEventListener('click',()=>setCompact(false));

/* ================= sheets ================= */
const sheets=['tokSheet','labelSheet','terrainSheet','lvlSheet','libSheet','iconSheet','genSheet','tmSheet','csSheet','partySheet'].map(i=>document.getElementById(i));
function openSheet(el){sheets.forEach(s=>s.hidden=s!==el);}
function closeSheets(){sheets.forEach(s=>s.hidden=true);document.querySelectorAll('[data-armed]').forEach(b=>{delete b.dataset.armed;b.textContent=b.dataset.label;});}
function confirmBtn(btn,armedText,fn){btn.dataset.label=btn.textContent;btn.addEventListener('click',()=>{
  if(btn.dataset.armed){delete btn.dataset.armed;btn.textContent=btn.dataset.label;fn();}
  else{btn.dataset.armed='1';btn.textContent=armedText;setTimeout(()=>{if(btn.dataset.armed){delete btn.dataset.armed;btn.textContent=btn.dataset.label;}},4000);}});}

// terrain sheet
const tg=document.getElementById('terrainGroups');
GROUPS.forEach(([g,title])=>{const h=document.createElement('h3');h.textContent=title;tg.appendChild(h);const grid=document.createElement('div');grid.className='tgrid';
  T.forEach((t,i)=>{if(t.g!==g)return;const b=document.createElement('button');b.className='tcell';b.dataset.id=i;
    const c=document.createElement('canvas');c.width=44;c.height=44;b.appendChild(c);const s_=document.createElement('span');s_.textContent=t.n;b.appendChild(s_);
    b.addEventListener('click',()=>{setTerrain(i);closeSheets();});grid.appendChild(b);});tg.appendChild(grid);});
document.getElementById('terrainBtn').addEventListener('click',()=>{openSheet(document.getElementById('terrainSheet'));
  document.querySelectorAll('#terrainGroups canvas').forEach(c=>paintSwatch(c,+c.parentNode.dataset.id));setTerrain(curT);});
document.getElementById('terrainDone').addEventListener('click',closeSheets);

// mini library
let libKind='hero',libCat='All',libQty=1,libSub='all';
const libGrid=document.getElementById('libGrid'),libCats=document.getElementById('libCats'),libSearch=document.getElementById('libSearch');
function renderLib(){
  libCats.innerHTML='';libCats.hidden=libKind!=='creature';
  if(libKind==='creature')['All',...Object.keys(CATS)].forEach(c=>{const b=document.createElement('button');b.className='chip plain';b.textContent=c==='All'?'All':(CAT_NAMES[c]||c);
    b.setAttribute('aria-pressed',String(c===libCat));b.addEventListener('click',()=>{libCat=c;libSub='all';renderLib();});libCats.appendChild(b);});
  let row=document.getElementById('libSubs');if(!row){row=document.createElement('div');row.id='libSubs';row.className='opts';libCats.after(row);}row.innerHTML='';row.hidden=!(libKind==='creature'&&libCat==='Hunter');
  if(libKind==='creature'&&libCat==='Hunter'){
    [['all','All classes'],...Object.entries(MH_CLASS).map(([k,v])=>[k,v[0]])].forEach(([k,l])=>{const b=document.createElement('button');b.className='chip plain';b.textContent=l;
      b.setAttribute('aria-pressed',String(k===libSub));b.addEventListener('click',()=>{libSub=k;renderLib();});row.appendChild(b);});}
  const q=libSearch.value.trim().toLowerCase();libGrid.innerHTML='';
  const items=libKind==='hero'?HEROES.map(([n,e])=>({n,e,s:1,c:null})):CREATURES.filter(c=>(libCat==='All'||c[3]===libCat)&&(libCat!=='Hunter'||libSub==='all'||c[4]===libSub)).map(([n,e,s,c,cls,cr])=>({n,e,s,c,cls,cr}));
  const blank={n:libKind==='hero'?'Blank hero':'Blank creature',e:'',s:1,c:null,blank:true};
  [blank,...items].filter(it=>!q||it.n.toLowerCase().includes(q)||(it.c||'').toLowerCase().includes(q)||(it.cls&&MH_CLASS[it.cls][0].toLowerCase().includes(q))).forEach(it=>{
    const b=document.createElement('button');b.className='tcell';
    const e=document.createElement('span');e.className='emo';e.textContent=it.e||'＋';e.style.background=it.c?CATS[it.c]:(libKind==='hero'?'#4fa3a5':'#a0473a');b.appendChild(e);
    const n=document.createElement('span');n.textContent=it.n;b.appendChild(n);
    if(libKind==='creature'&&!it.blank){const sm=document.createElement('small');sm.textContent=it.cls?`${MH_CLASS[it.cls][0]} · CR ${it.cr}`:(['','Medium','Large','Huge','Gargantuan','','Colossal'][it.s]||'');b.appendChild(sm);}
    b.addEventListener('click',()=>addMinis(it));libGrid.appendChild(b);});
  if(!libGrid.children.length){const p=document.createElement('p');p.className='note';p.textContent='No minis match. Try another word, or add a blank mini and pick any icon.';libGrid.appendChild(p);}
}
function openLib(kind){libKind=kind;libSearch.value='';libQty=1;document.getElementById('qOut').textContent='1';
  document.querySelectorAll('#libTabs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===kind)));
  document.getElementById('libTitle').textContent=kind==='hero'?'Add heroes':'Add creatures';renderLib();openSheet(document.getElementById('libSheet'));setTool('move',true);}
document.querySelectorAll('#libTabs button').forEach(b=>b.addEventListener('click',()=>openLib(b.dataset.k)));
libSearch.addEventListener('input',renderLib);
document.getElementById('qMinus').addEventListener('click',()=>{libQty=Math.max(1,libQty-1);document.getElementById('qOut').textContent=libQty;});
document.getElementById('qPlus').addEventListener('click',()=>{libQty=Math.min(20,libQty+1);document.getElementById('qOut').textContent=libQty;});
document.getElementById('libDone').addEventListener('click',closeSheets);
document.getElementById('addHero').addEventListener('click',()=>openLib('hero'));
document.getElementById('addMon').addEventListener('click',()=>openLib('creature'));
function namesFor(base,n){
  const nums=L.tokens.map(t=>t.name===base?0:(t.name.startsWith(base+' ')&&/^\d+$/.test(t.name.slice(base.length+1))?+t.name.slice(base.length+1):-1)).filter(v=>v>=0);
  if(!nums.length&&n===1)return[base];
  let start=Math.max(0,...nums)+1;if(nums.includes(0)&&start<2)start=2;
  return Array.from({length:n},(_,i)=>`${base} ${start+i}`);
}
function addMinis(it){
  pushUndo();const kind=libKind,c=screenCenter(),base=it.blank?(kind==='hero'?'Hero':'Creature'):it.n,names=namesFor(base,libQty);let last=null;
  const used=new Set(L.tokens.filter(t=>t.kind==='hero').map(t=>t.color));
  names.forEach(name=>{const size=it.s||1,p=freeSpot(L,SZ({size}),c.x,c.y);
    const color=kind==='hero'?(COLORS.find(x=>!used.has(x))||COLORS[0]):(it.c?CATS[it.c]:'#a0473a');used.add(color);
    const t=mk(kind,name,p.x,p.y,Object.assign({size,icon:it.e||'',color,vision:60,cat:it.c||''},it.blank?{}:PRESET_FX[it.n]||{}));L.tokens.push(t);last=t;});
  selId=last.id;changed();
  if(names.length===1){openTok(last,kind==='hero'||it.blank);}else{closeSheets();toast(`Added ${names.length} ${base.toLowerCase()} minis.`);}
}
function freeSpot(lv,size,cx,cy){
  const occ=new Uint8Array(lv.cols*lv.rows);
  for(const t of lv.tokens){const n=SZ(t,lv);for(let y=t.y;y<t.y+n;y++)for(let x=t.x;x<t.x+n;x++)if(x>=0&&y>=0&&x<lv.cols&&y<lv.rows)occ[y*lv.cols+x]=1;}
  const ok=(x,y,strict)=>{if(x<0||y<0||x>lv.cols-size||y>lv.rows-size)return false;
    for(let j=0;j<size;j++)for(let i=0;i<size;i++){const k=(y+j)*lv.cols+x+i;if(occ[k])return false;if(strict){const c=lv.cells[k];if(T[c].b||BAD.has(c))return false;}}return true;};
  const sx=Math.round(cx-size/2),sy=Math.round(cy-size/2);
  for(const strict of[true,false]){const maxR=strict?Math.min(160,Math.max(lv.cols,lv.rows)):Math.max(lv.cols,lv.rows);
    for(let rad=0;rad<=maxR;rad++){let best=null,bd=1e12;
      const test=(x,y)=>{if(!ok(x,y,strict))return;const d=(x-sx)**2+(y-sy)**2;if(d<bd){bd=d;best={x,y};}};
      if(rad===0)test(sx,sy);else{for(let x=sx-rad;x<=sx+rad;x++){test(x,sy-rad);test(x,sy+rad);}for(let y=sy-rad+1;y<sy+rad;y++){test(sx-rad,y);test(sx+rad,y);}}
      if(best)return best;}}
  return{x:Math.max(0,Math.min(lv.cols-size,sx)),y:Math.max(0,Math.min(lv.rows-size,sy))};
}
function screenCenter(){return{x:(view.x+cv.clientWidth/2)/view.cs,y:(view.y+cv.clientHeight/2)/view.cs};}

// token sheet
const tokName=document.getElementById('tokName'),tokVis=document.getElementById('tokVis'),visOut=document.getElementById('visOut'),tokSize=document.getElementById('tokSize'),
  tokLevel=document.getElementById('tokLevel'),sw=document.getElementById('swatches'),hpIn=document.getElementById('hp'),hpMaxIn=document.getElementById('hpMax'),
  tokHidden=document.getElementById('tokHidden'),condRow=document.getElementById('condRow'),prev=document.getElementById('tokPrev');
COLORS.forEach(c=>{const b=document.createElement('button');b.className='swatch';b.style.background=c;b.dataset.c=c;b.setAttribute('aria-label','Color '+c);
  b.addEventListener('click',()=>{const t=cur();if(!t)return;t.color=c;markSwatch(c);refreshPrev();draw();save();});sw.appendChild(b);});
CONDS.forEach(([n,e])=>{const b=document.createElement('button');b.className='cond';b.textContent=`${e} ${n}`;b.dataset.c=n;
  b.addEventListener('click',()=>{const t=cur();if(!t)return;t.conds=t.conds.includes(n)?t.conds.filter(x=>x!==n):[...t.conds,n];syncConds(t);draw();save();});condRow.appendChild(b);});
function syncConds(t){condRow.querySelectorAll('.cond').forEach(b=>b.setAttribute('aria-pressed',String(t.conds.includes(b.dataset.c))));}
function markSwatch(c){sw.querySelectorAll('.swatch').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.c===c)));}
const cur=()=>L&&L.tokens.find(t=>t.id===selId);
function refreshPrev(){const t=cur();if(!t||document.getElementById('tokSheet').hidden)return;const d=window.devicePixelRatio||1;prev.width=58*d;prev.height=58*d;
  const old=ctx;ctx=prev.getContext('2d');ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,58,58);tokenFace(t,29,29,26);ctx=old;}
function openTok(t,focus){
  selId=t.id;openSheet(document.getElementById('tokSheet'));
  document.getElementById('tokTitle').textContent=t.kind==='hero'?'Edit hero':'Edit creature';
  tokName.value=t.name;
  document.getElementById('visField').hidden=t.kind!=='hero';
  document.getElementById('hiddenRow').hidden=t.kind==='hero';tokHidden.checked=!!t.hidden;tokAnim.value=t.anim||'none';tokModel.value=t.model||'auto';tokLight.value=t.light||'none';showTokLight(t);document.getElementById('tokSheetBtn').hidden=t.kind!=='hero';showAlt(t);document.getElementById('tokFrenzy').value=String(t.frenzy||0);tokSub.checked=!!t.submerged;
  tokVis.value=t.vision;visOut.textContent=t.vision+' ft';tokSize.value=String(t.size);
  hpIn.value=t.hpMax?t.hp:'';hpMaxIn.value=t.hpMax||'';
  tokLevel.innerHTML='';D.levels.forEach((l,i)=>{const o=document.createElement('option');o.value=i;o.textContent=l.name;tokLevel.appendChild(o);});tokLevel.value=String(D.cur);
  markSwatch(t.color);syncConds(t);refreshPrev();draw();
  if(focus){tokName.focus();tokName.select();}
}
tokName.addEventListener('input',()=>{const t=cur();if(!t)return;t.name=tokName.value.slice(0,28)||'?';refreshPrev();draw();save();});
tokName.addEventListener('keydown',e=>{if(e.key==='Enter')tokName.blur();});
tokVis.addEventListener('input',()=>{const t=cur();if(!t)return;t.vision=+tokVis.value;visOut.textContent=t.vision+' ft';invalidate();draw();save();});
tokSize.addEventListener('change',()=>{const t=cur();if(!t)return;pushUndo();t.size=+tokSize.value;t.x=Math.max(0,Math.min(t.x,L.cols-SZ(t)));t.y=Math.max(0,Math.min(t.y,L.rows-SZ(t)));changed();});
const tokAlt=document.getElementById('tokAlt'),altOut=document.getElementById('altOut');
function showAlt(t){const a=t.alt||0;tokAlt.value=a;altOut.textContent=a>0?`${a} ft up`:a<0?`${-a} ft down`:'On the ground';}
function setAlt(v){const t=cur();if(!t)return;t.alt=Math.max(-500,Math.min(5000,Math.round((+v||0)/5)*5));
  if(t.alt>0&&!t.conds.includes('Flying'))t.conds=[...t.conds,'Flying'];if(t.alt<=0)t.conds=t.conds.filter(c=>c!=='Flying');syncConds(t);showAlt(t);invalidate();draw();save();liveTokens();}
tokAlt.addEventListener('change',()=>setAlt(tokAlt.value));
document.querySelectorAll('[data-alt]').forEach(b=>b.addEventListener('click',()=>{const t=cur();if(!t)return;const d=+b.dataset.alt;setAlt(d===0?0:(t.alt||0)+d);}));
const tokAnim=document.getElementById('tokAnim'),tokSub=document.getElementById('tokSub'),tokModel=document.getElementById('tokModel');
MODEL_LABELS.forEach(([v,l])=>{const o=document.createElement('option');o.value=v;o.textContent=l;tokModel.appendChild(o);});
document.getElementById('tokFrenzy').addEventListener('change',e=>{const t=cur();if(!t)return;t.frenzy=+e.target.value;if(t.frenzy&&(!t.anim||t.anim==='none'))t.anim=t.frenzy>1?'shadow':'aura';tokAnim.value=t.anim;draw();save();});
const tokLight=document.getElementById('tokLight');
Object.entries(LIGHTS).forEach(([k,v])=>{const o=document.createElement('option');o.value=k;o.textContent=v.n;tokLight.appendChild(o);});
function showTokLight(t){if(visDirty)computeVis();const n=SZ(t),i=idx(Math.min(L.cols-1,t.x+(n>>1)),Math.min(L.rows-1,t.y+(n>>1)));
  document.getElementById('tokLightOut').textContent=lightMap?`Standing in ${lightWord(lightMap[i])}.`:'';}
tokLight.addEventListener('change',()=>{const t=cur();if(!t)return;t.light=tokLight.value;invalidate();showTokLight(t);draw();save();});
tokModel.addEventListener('change',()=>{const t=cur();if(!t)return;t.model=tokModel.value;draw();save();});
tokAnim.addEventListener('change',()=>{const t=cur();if(!t)return;t.anim=tokAnim.value;draw();save();});
tokSub.addEventListener('change',()=>{const t=cur();if(!t)return;t.submerged=tokSub.checked;draw();save();});
tokHidden.addEventListener('change',()=>{const t=cur();if(!t)return;t.hidden=tokHidden.checked;draw();save();});
function setHp(v,max){const t=cur();if(!t)return;if(max!=null)t.hpMax=Math.max(0,max|0);t.hp=Math.max(0,Math.min(t.hpMax||9999,v|0));if(!t.hpMax&&t.hp)t.hpMax=t.hp;
  hpIn.value=t.hpMax?t.hp:'';hpMaxIn.value=t.hpMax||'';draw();save();}
hpIn.addEventListener('change',()=>setHp(+hpIn.value));
hpMaxIn.addEventListener('change',()=>{const t=cur();if(!t)return;const m=+hpMaxIn.value||0;setHp(t.hpMax?Math.min(t.hp,m):m,m);});
document.querySelectorAll('[data-hp]').forEach(b=>b.addEventListener('click',()=>{const t=cur();if(!t)return;if(!t.hpMax){toast('Set maximum hit points first.');hpMaxIn.focus();return;}setHp(t.hp+ +b.dataset.hp);}));
tokLevel.addEventListener('change',()=>{const t=cur();if(!t)return;const i=+tokLevel.value;if(i===D.cur)return;
  pushUndo();L.tokens=L.tokens.filter(o=>o!==t);const target=D.levels[i];const p=freeSpot(target,SZ(t,target),target.cols/2,target.rows/2);t.x=p.x;t.y=p.y;target.tokens.push(t);
  selId=null;closeSheets();changed();toast(`${t.name} moved to ${target.name}.`);});
document.getElementById('tokDone').addEventListener('click',closeSheets);
document.getElementById('tokDel').addEventListener('click',()=>{pushUndo();L.tokens=L.tokens.filter(t=>t.id!==selId);selId=null;closeSheets();changed();});
document.getElementById('tokDup').addEventListener('click',()=>{const t=cur();if(!t)return;pushUndo();
  const base=t.name.replace(/\s+\d+$/,'');if(t.name===base)t.name=base+' 1';
  const c=JSON.parse(JSON.stringify(t));c.id=D.nextId++;c.name=namesFor(base,1)[0];if(c.name===base)c.name=base+' 2';
  const p=freeSpot(L,SZ(t),t.x+SZ(t),t.y);c.x=p.x;c.y=p.y;L.tokens.push(c);selId=c.id;changed();openTok(c);});
document.getElementById('noPic').addEventListener('click',()=>{const t=cur();if(!t)return;t.icon='';t.img='';refreshPrev();draw();save();});
document.getElementById('fileIn').addEventListener('change',e=>{const f=e.target.files[0];e.target.value='';if(!f)return;const t=cur();if(!t)return;
  const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=c.height=160;const g=c.getContext('2d');
    const s=Math.min(im.width,im.height);g.drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,160,160);pushUndo();t.img=c.toDataURL('image/jpeg',.82);refreshPrev();changed();};
    im.onerror=()=>toast('That file couldn’t be opened as a picture. Try a JPG or PNG.');im.src=r.result;};r.readAsDataURL(f);});
// icon picker
const iconGrid=document.getElementById('iconGrid');
ICONS.forEach(e=>{const b=document.createElement('button');b.textContent=e;b.setAttribute('aria-label','Icon '+e);
  b.addEventListener('click',()=>{const t=cur();if(!t)return;t.icon=e;t.img='';draw();save();openTok(t);});iconGrid.appendChild(b);});
document.getElementById('pickIcon').addEventListener('click',()=>{const t=cur();if(!t)return;iconGrid.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===t.icon)));openSheet(document.getElementById('iconSheet'));});
document.getElementById('iconDone').addEventListener('click',()=>{const t=cur();t?openTok(t):closeSheets();});

// label sheet
const labelText=document.getElementById('labelText'),labelShow=document.getElementById('labelShow');
const curLabel=()=>L.labels.find(l=>l.id===selLabel);
const labelLink=document.getElementById('labelLink'),labelGo=document.getElementById('labelGo');
function goLink(lb){const i=D.levels.findIndex(l=>l.id===lb.link);if(i<0){toast('That level no longer exists.');return;}switchLevel(i);toast('Now on '+D.levels[i].name+'.');}
labelLink.addEventListener('change',()=>{const l=curLabel();if(!l)return;l.link=labelLink.value?+labelLink.value:null;labelGo.hidden=!l.link;draw();save();});
labelGo.addEventListener('click',()=>{const l=curLabel();if(l&&l.link)goLink(l);});
function openLabel(lb,focus){selLabel=lb.id;openSheet(document.getElementById('labelSheet'));labelText.value=lb.text;labelShow.checked=lb.show;
  labelLink.innerHTML='<option value="">No level</option>'+D.levels.filter(l=>l.id!==L.id).map(l=>`<option value="${l.id}">${l.name.replace(/[<&"]/g,'')}</option>`).join('');labelLink.value=lb.link?String(lb.link):'';labelGo.hidden=!lb.link;draw();if(focus){labelText.focus();labelText.select();}}
labelText.addEventListener('input',()=>{const l=curLabel();if(!l)return;l.text=labelText.value||' ';draw();save();});
labelText.addEventListener('keydown',e=>{if(e.key==='Enter')labelText.blur();});
labelShow.addEventListener('change',()=>{const l=curLabel();if(!l)return;l.show=labelShow.checked;draw();save();});
document.getElementById('labelDone').addEventListener('click',()=>{selLabel=null;closeSheets();draw();});
document.getElementById('labelDel').addEventListener('click',()=>{pushUndo();L.labels=L.labels.filter(l=>l.id!==selLabel);selLabel=null;closeSheets();changed();});

// level sheet
function fillLevels(){const sel=document.getElementById('levelSel');sel.innerHTML='';D.levels.forEach((l,i)=>{const o=document.createElement('option');o.value=i;o.textContent=l.name;sel.appendChild(o);});sel.value=String(D.cur);}
function switchLevel(i){D.cur=i;L=D.levels[i];liveSend({k:'level',id:L.id});selId=null;selLabel=null;measure=null;closeSheets();invalidate();fillLevels();updUndo();startView();save();if(mode==='party')partyHint();}
document.getElementById('levelSel').addEventListener('change',e=>switchLevel(+e.target.value));
function sizeNoteText(){return`This level is ${L.cols.toLocaleString()} × ${L.rows.toLocaleString()} squares, about ${fmtDist(L.cols)} × ${fmtDist(L.rows)}. Up to 2,000 squares a side.`;}
function syncLvlSheet(){document.getElementById('lvName').value=L.name;document.getElementById('mapW').value=L.cols;document.getElementById('mapH').value=L.rows;
  document.getElementById('scaleSel').value=String(L.scale);document.getElementById('sizeNote').textContent=sizeNoteText();
  document.querySelectorAll('#timeSeg button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===lightTimeOf(L))));
  document.querySelectorAll('#lookSeg button').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.v==='1')===prefs.view3d)));
  document.querySelectorAll('#miniSeg button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===(prefs.miniStyle||'model'))));
  document.getElementById('wallField').hidden=!prefs.view3d;document.getElementById('wallH').value=prefs.wallH;document.getElementById('wallOut').textContent=Math.round(prefs.wallH*100)+'%';
  document.getElementById('gridChk').checked=L.grid;document.getElementById('skyChk').checked=openSky();document.getElementById('delLvlBtn').disabled=D.levels.length<2;
  const mark=(id,v)=>document.querySelectorAll(id+' button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===v)));
  mark('#fxSeg',prefs.fx?'1':'0');mark('#gridStyleSeg',L.gridStyle||'line');document.getElementById('weatherSel').value=L.weather||'none';
  document.getElementById('followChk').checked=prefs.follow!==false;}
document.getElementById('skyChk').addEventListener('change',e=>{L.sky=e.target.checked;changed();});
document.getElementById('followChk').addEventListener('change',e=>{prefs.follow=e.target.checked;save();liveView(true);});
document.querySelectorAll('#fxSeg button').forEach(b=>b.addEventListener('click',()=>{prefs.fx=b.dataset.v==='1';syncLvlSheet();draw();save();}));
document.querySelectorAll('#gridStyleSeg button').forEach(b=>b.addEventListener('click',()=>{L.gridStyle=b.dataset.v;if(L.gridStyle==='glow')L.grid=true;syncLvlSheet();draw();save();}));

document.getElementById('weatherSel').addEventListener('change',e=>{L.weather=e.target.value;if(L.weather!=='none'&&!prefs.fx){prefs.fx=true;syncLvlSheet();}draw();save();});
document.getElementById('scaleSel').addEventListener('change',e=>{L.scale=+e.target.value;syncLvlSheet();changed();toast(`Each square is now ${fmtDist(1)}.`);});
document.querySelectorAll('#lookSeg button').forEach(b=>b.addEventListener('click',()=>{prefs.view3d=b.dataset.v==='1';syncLvlSheet();draw();save();}));
document.querySelectorAll('#miniSeg button').forEach(b=>b.addEventListener('click',()=>{prefs.miniStyle=b.dataset.v;prefs.mini3d=b.dataset.v!=='flat';syncLvlSheet();draw();save();}));
document.getElementById('wallH').addEventListener('input',e=>{prefs.wallH=+e.target.value;document.getElementById('wallOut').textContent=Math.round(prefs.wallH*100)+'%';draw();save();});
document.getElementById('lvlBtn').addEventListener('click',()=>{const s=document.getElementById('lvlSheet');if(!s.hidden){closeSheets();return;}syncLvlSheet();openSheet(s);});
document.getElementById('lvlDone').addEventListener('click',closeSheets);
document.getElementById('lvName').addEventListener('input',e=>{L.name=e.target.value||'Untitled level';fillLevels();save();});
document.getElementById('resizeBtn').addEventListener('click',()=>{
  const w=Math.max(10,Math.min(2000,+document.getElementById('mapW').value||L.cols)),h=Math.max(10,Math.min(2000,+document.getElementById('mapH').value||L.rows));
  const c=new Uint8Array(w*h),ex=new Uint8Array(w*h),el=new Uint8Array(w*h);
  for(let y=0;y<Math.min(h,L.rows);y++)for(let x=0;x<Math.min(w,L.cols);x++){c[y*w+x]=L.cells[y*L.cols+x];ex[y*w+x]=L.explored[y*L.cols+x];el[y*w+x]=L.elev[y*L.cols+x];}
  L.cells=c;L.explored=ex;L.elev=el;L.cols=w;L.rows=h;L.tokens=L.tokens.filter(t=>t.x+SZ(t)<=w&&t.y+SZ(t)<=h);
  undoStacks.delete(L.id);updUndo();syncLvlSheet();invalidate();fitView();save();toast(`Level is now ${fmtDist(w)} × ${fmtDist(h)}.`);});
document.querySelectorAll('#timeSeg button').forEach(b=>b.addEventListener('click',()=>{L.time=b.dataset.v;L.lit=L.time==='day';syncLvlSheet();invalidate();changed();}));
document.getElementById('gridChk').addEventListener('change',e=>{L.grid=e.target.checked;draw();save();});
document.getElementById('fogBtn').addEventListener('click',()=>{L.explored.fill(0);changed();toast('Explored areas reset for this level.');});
confirmBtn(document.getElementById('clearBtn'),'Tap again to clear this level',()=>{pushUndo();L.cells.fill(0);L.elev.fill(0);L.explored.fill(0);L.tokens=[];L.labels=[];selId=null;closeSheets();changed();});
document.getElementById('addLvlBtn').addEventListener('click',()=>{const l=newLevel('Level '+(D.levels.length+1),120,80);D.levels.push(l);switchLevel(D.levels.length-1);toast('New 120 × 80 level added. Rename or resize it in Level settings.');});
confirmBtn(document.getElementById('delLvlBtn'),'Tap again to delete this level',()=>{if(D.levels.length<2)return;undoStacks.delete(L.id);D.levels.splice(D.cur,1);switchLevel(Math.max(0,D.cur-1));});
confirmBtn(document.getElementById('sampleBtn'),'Tap again: this replaces your whole dungeon',()=>{undoStacks.clear();buildExample();switchLevel(0);});

document.getElementById('undoBtn').addEventListener('click',undo);
document.getElementById('fUndo').addEventListener('click',undo);
const zc=f=>()=>zoomAt(f,cv.clientWidth/2,cv.clientHeight/2);
document.getElementById('zoomIn').addEventListener('click',zc(1.35));document.getElementById('fIn').addEventListener('click',zc(1.35));
document.getElementById('zoomOut').addEventListener('click',zc(1/1.35));document.getElementById('fOut').addEventListener('click',zc(1/1.35));
document.getElementById('fitBtn').addEventListener('click',fitView);
document.addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName))return;
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();undo();}
  else if(e.key==='Escape'){closeSheets();measure=null;draw();}});

/* ================= The Frenzied Comet campaign ================= */
function mixHex(a,b,t){const p=x=>parseInt(x.slice(1,7),16),A=p(a),B=p(b),ch=s=>Math.round(((A>>s)&255)*(1-t)+((B>>s)&255)*t);return'#'+[16,8,0].map(s=>ch(s).toString(16).padStart(2,'0')).join('');}
function frenzyTint(spec,f){const p=Object.assign({},spec[1]);
  for(const k of['body','head','wingc','mane','belly','skin','shell'])if(typeof p[k]==='string'&&p[k][0]==='#')p[k]=mixHex(p[k],f>1?'#1e0628':'#3a1060',f>1?.72:.66);
  p.eyec='#ff2030';if(f>1)p.glow=p.glow||'#b040ff';return[spec[0],p];}
const FZ={frenzy:1,color:'#7a2aa0',anim:'aura'},AX={frenzy:2,color:'#3a0a5a',anim:'shadow'};
function ctok(kind,name,x,y,extra){const t=mk(kind,name,x,y,Object.assign({vision:60,color:'#a0473a'},extra||{}));const n=SZ(t);
  for(let j=0;j<n;j++)for(let i=0;i<n;i++){const c=get(x+i,y+j);if(T[c].b&&T[c].v!=='o')put(x+i,y+j,ID.floor);}L.tokens.push(t);return t;}
function minions(base,n,pts,extra){for(let k=0;k<n;k++){const[x,y]=pts[k%pts.length];ctok('creature',`${base} ${k+1}`,x+(k>=pts.length?1:0),y,Object.assign({hp:1,hpMax:1},FZ,extra||{}));}}
function note(x,y,text,link){L.labels.push({id:D.nextId++,x,y,text,show:false,link:link||null});}
function place(x,y,text,link){L.labels.push({id:D.nextId++,x,y,text,show:true,link:link||null});}
function newLv(name,c,r,o){const l=newLevel(name,c,r);Object.assign(l,o||{});D.levels.push(l);L=l;return l;}
function thick(x0,y0,x1,y1,w0,w1,fn){const len=Math.hypot(x1-x0,y1-y0),n=Math.max(1,Math.ceil(len/2));
  for(let s=0;s<=n;s++){const t=s/n,cx=x0+(x1-x0)*t,cy=y0+(y1-y0)*t,r=(w0+(w1-w0)*t)/2;
    for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++){if(!inb(x,y))continue;const dx=x+.5-cx,dy=y+.5-cy;if(dx*dx+dy*dy<=r*r)fn(x,y,t,Math.sqrt(dx*dx+dy*dy)/r);}}}

function buildShallows(){
  newLv('Coast 1: Spongebed Shallows',40,32,{lit:true});
  for(let y=0;y<32;y++){const surf=26+Math.round((fbm(y*.15,3,71)-.5)*5),deep=surf+6;
    for(let x=0;x<40;x++){let k=x>=deep?'deep':x>=surf?'shallow':'sand';const c=h3(x,y,71);if(k==='sand'&&c<.02)k='palm';else if(k==='sand'&&c>.985)k='boulder';setC(x,y,k,0);}}
  fillR(0,0,24,1,'grass',0);for(let x=1;x<=21;x+=5)fillR(x,0,x+3,1,(x/5)%2?'thatch':'roof',2);
  fillR(0,2,25,3,'wood',1);for(let x=25;x<=36;x++)fillR(x,2,x,3,'bridge',1);fillR(30,4,31,9,'bridge',1);
  setC(4,3,'crates',1);setC(12,3,'crates',1);setC(20,2,'crates',1);setC(33,3,'crates',1);
  for(const[bx,by]of[[8,12],[13,22],[20,8]])for(const[x,y]of discCells(bx+.5,by+2,1.6)){setC(x,y,'woodwall',1);}
  fillR(15,13,19,17,'wood',0);ringR(15,13,19,17,'woodwall',1);setC(15,15,'door',0);setC(16,14,'web',0);setC(18,16,'web',0);
  [[16,14],[17,14],[18,14],[16,16],[17,16],[18,15]].forEach(([x,y],k)=>ctok('creature','Villager '+(k+1),x,y,{color:'#5fae6b',model:'hum',hp:4,hpMax:4}));
  ctok('creature','Frenzied Royal Ludroth',26,18,Object.assign({size:2,hp:380,hpMax:380},FZ));
  minions('Frenzied Ludroth',10,[[21,14],[21,16],[22,15],[22,17],[29,10],[30,13],[28,22],[31,20],[29,25],[33,16]]);
  place(12,1.2,'Fishing village');place(10,4.6,'Village docks');place(17,12.3,'Net shed');place(34,28,'The surf');
  note(17,19.2,'6 villagers trapped: each Ludroth at the shed kills 1/turn');note(8,10.6,'Overturned boats: half cover');note(33,30.5,'Shallows: difficult terrain for non-swimmers');
  note(26,21,'Royal Ludroth heals 20 HP/turn in water (break mane)');
}
function buildCaves(){
  newLv('Coast 2: The Drowning Caves',26,26,{weather:'bubbles'});
  const l=ovalCells(2,2,23,21);fillCells(l,ID.floor);
  for(let k=0;k<l.length;k+=2){const x=l[k],y=l[k+1],c=h3(x,y,72);if(c<.08)setC(x,y,'rubble',0);else if(c>.96)setC(x,y,'stalag',0);else if(fbm(x*.25,y*.25,72)<.3)setC(x,y,'shallow',0);}
  for(let y=4;y<=6;y++)for(let x=6;x<=18;x++)if(!T[get(x,y)].b)setC(x,y,'floor',2);
  for(let y=9;y<=15;y++)for(let x=19;x<=21;x++)if(!T[get(x,y)].b)setC(x,y,'floor',2);
  carvePath(12,20,12,25,'deep',3);for(let y=18;y<=25;y++)for(let x=11;x<=13;x++)setC(x,y,'deep',0);
  setC(10,5,'chest',2);setC(11,5,'bone',2);setC(5,9,'fungus',0);setC(17,17,'fungus',0);setC(20,7,'fungus',0);
  ctok('creature','Frenzied Shogun Ceanataur',10,9,Object.assign({size:3,hp:500,hpMax:500,conds:['Flying']},FZ));
  minions('Frenzied Ceanataur',8,[[7,8],[15,9],[8,14],[16,13],[9,5],[13,5],[16,5],[7,5]]);
  for(let k=0;k<4;k++)L.tokens[L.tokens.length-8+k].conds=['Flying'];
  place(12,2.6,'North shelf (10 ft up)');place(20,8.4,'East shelf');place(12,24,'Sea tunnel');place(10.5,4.2,"Hermit's chart case");
  note(4,22.8,'Tide: R1-2 ankle · R3-4 waist · R5+ chest (swim)');note(13,16.5,'Shogun starts on the ceiling (Flying = on ceiling)');
  note(13,17.5,'4 minions start on the ceiling');
}
function buildWake(){
  newLv("Coast 3: The Comet's Wake",46,46,{lit:true,weather:'storm',mood:'dusk',gridStyle:'glow'});
  const cx=23,cy=23;
  for(let y=0;y<46;y++)for(let x=0;x<46;x++){const d=Math.hypot(x+.5-cx,y+.5-cy)+(fbm(x*.2,y*.2,73)-.5)*2,c=h3(x,y,73);
    let k='deep';if(d>=14&&d<17.5){k=c<.18?'boulder':c<.45?'rubble':'shallow';if(h3(x,y,74)<.06)k='shallow';}else if(d>=11.5&&d<14)k='shallow';setC(x,y,k,0);}
  buildRaw('ship',7,19,18,22,74);for(let y=18;y<=23;y++)for(let x=7;x<=9;x++)if(get(x,y)!==ID.deep)setC(x,y,'shallow',0);
  fillR(22,22,23,23,'portal',0);for(const[x,y]of[[21,21],[24,21],[21,24],[24,24],[22,20],[25,23]])setC(x,y,'crystal',0);
  ctok('creature','Apex Lagiacrus',27,25,Object.assign({size:3,hp:760,hpMax:760,submerged:true},AX));
  place(12.5,17.6,'Wrecked galleon (only solid ground)');place(23,8.2,'Reef ring: difficult terrain');place(23,19.4,'Comet core (40 ft down)');
  note(23,27.5,'Core: AC 15, 60 HP, 200 lb. Destroy it to stop the hazards (lose the shard)');
  note(23,42.5,'Lair (init 20): Core Pulse · Shard Rain · Storm Surge');note(33,30,'Phase 1 deep water; Enraged at 380: climbs the galleon');
}
function buildHush(){
  newLv('Forest: The Hush Wood',46,46,{mood:'dusk',weather:'spores',sky:true});
  const cx=23,cy=24;
  for(let y=0;y<46;y++)for(let x=0;x<46;x++){const d=Math.hypot(x+.5-cx,y+.5-cy),b=fbm(x*.2,y*.2,75),c=h3(x,y,75);
    let k=b<.35?'roots':b>.62?'brush':c<.5?'dirt':'grass';if(d>16&&c<.6)k='tree';else if(d<=16&&c<.03)k='mushroom';setC(x,y,k,0);}
  const giants=[[12,14],[33,13],[10,30],[36,31],[20,36],[29,37],[15,22],[31,22],[23,31]];
  for(const[gx,gy]of giants)for(const[x,y]of discCells(gx,gy,1.6))setC(x,y,'tree',3);
  for(const[x,y]of discCells(23,12,2.6))setC(x,y,'tree',8);setC(23,14,'roots',0);
  const log=(x0,y0,x1,y1)=>{for(const[x,y]of linePoints({x0,y0,x1,y1,seed:1}))setC(x,y,'woodwall',1);};
  log(15,28,20,26);log(27,18,30,22);log(8,22,10,27);log(32,28,37,26);
  ctok('creature','Apex Nargacuga',29,26,Object.assign({size:3,hp:560,hpMax:560,hidden:true},AX));
  minions('Frenzied Baby Nargacuga',6,[[17,18],[28,16],[14,27],[32,30],[22,33],[19,22]],{hidden:true});
  ctok('creature','Frenzied Kecha Wacha 1',17,30,Object.assign({size:2,hp:45,hpMax:45},FZ));ctok('creature','Frenzied Kecha Wacha 2',27,29,Object.assign({size:2,hp:45,hpMax:45},FZ));
  place(23,3,'The Hush Wood');place(23,8.4,'Shard tree (hollow 40 ft up)');note(23,16.5,'Climb: DC 15 Athletics. Pulling the shard triggers Spore Bloom');
  note(23,43,'Lair (init 20): Canopy Closes · Spore Bloom · Falling Limb');note(31,33,'Nargacuga hides in dim light; break its eyes');
}
function buildPass(){
  newLv('Mountains: The Howling Pass',50,24,{lit:true,weather:'snow'});
  for(let y=0;y<24;y++)for(let x=0;x<50;x++){let k,e=0;const c=h3(x,y,76);
    if(y<=6){k=c<.2?'rubble':'snow';e=8;}else if(y<=14){k=fbm(x*.18,y*.3,76)<.42?'ice':'snow';if(c>.985)k='boulder';}else{k='chasm';}setC(x,y,k,e);}
  for(let y=1;y<=6;y++)for(let x=22;x<=26;x++)setC(x,y,'icewall',8);setC(24,6,'crystal',4);setC(23,6,'ice',4);setC(25,6,'ice',4);
  for(let x=0;x<50;x++)if(h3(x,15,77)<.3)setC(x,15,'rubble',0);
  ctok('creature','Apex Tigrex',42,9,Object.assign({size:3,hp:640,hpMax:640},AX));
  minions('Frenzied Blango',8,[[16,8],[20,12],[28,9],[31,13],[12,11],[35,8],[25,13],[19,9]],{hidden:true});
  place(25,.9,'The Howling Pass');place(24.5,7.6,'Frozen waterfall: shard inside');place(25,19,'Sheer drop');
  note(24.5,16.2,'Ice: difficult; DC 13 Dex or prone when dashing. Shard: AC 15, 50 HP');note(6,17,'Lair: Avalanche · Rockfall · Whiteout');
  note(6,21,'Blango burst from the snow behind the party on round 2');
}
function buildSteppe(){
  newLv('Plains: The Glass Steppe',60,60,{lit:true,weather:'dust'});
  for(let y=0;y<60;y++)for(let x=0;x<60;x++){const b=fbm(x*.12,y*.12,78),c=h3(x,y,78);let k=b>.6?'brush':b<.3?'dirt':'grass';if(c>.992)k='boulder';else if(b>.66&&c<.3)k='wheat';setC(x,y,k,0);}
  for(const[x,y,d]of discCells(30,30,6.5)){const c=h3(x,y,79);setC(x,y,d>5.5?'rubble':c<.12?'crystal':'obsidian',0);}setC(29,29,'portal',0);
  ctok('creature','Apex Diablos',42,20,Object.assign({size:3,hp:700,hpMax:700,hidden:true},AX));
  minions('Frenzied Bullfango',12,[[10,12],[12,12],[14,12],[11,14],[13,14],[15,14],[10,16],[12,16],[14,16],[16,12],[16,16],[9,14]]);
  ctok('creature','Frenzied Bulldrome',12,9,Object.assign({size:2,hp:60,hpMax:60},FZ));
  place(30,22,'Glass crater (60 ft)');place(12,7.5,'The herd');note(30,38,'Glass: difficult; falling prone = 5 slashing. Shard: 100 lb, 5 fire/turn');
  note(44,18,'Diablos starts burrowed (tremorsense 120 ft). Loud noises stun it');note(30,56,'Lair: Dust Storm · Glass Fracture · Shard Pulse');
}
// The new frenzied living dungeon: a walking mountain, 25 miles long outside and 25 miles across inside.
const MASS='Ul’Garrath, the Walking Mountain';
function buildMassifOutside(links){
  const lv=newLv(MASS+' (outside, 25 mi)',1320,880,{scale:100,lit:true,weather:'none'});const W=1320,H=880,cx=620,cy=440,rx=380,ry=290;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const a=fbm(x*.02,y*.02,901),c=h3(x,y,901),i=y*W+x;let k=a>.62?'brush':a<.32?'dirt':'grass';if(c<.003)k='tree';else if(c>.9985)k='boulder';L.cells[i]=ID[k];L.elev[i]=a>.6?1:0;}
  for(let k=0;k<5;k++){const fx=20+k*40,fy=cy+(k%2?-95:95);for(const[x,y,d]of discCells(fx,fy,15))if(inb(x,y))setC(x,y,d>12?'rubble':'mud',0);}
  const legPts=[[cx+250,cy-ry*.82,cx+330,cy-ry-150],[cx+250,cy+ry*.82,cx+330,cy+ry+150],[cx-20,cy-ry*.95,cx-20,cy-ry-170],[cx-20,cy+ry*.95,cx-20,cy+ry+170],[cx-280,cy-ry*.8,cx-360,cy-ry-140],[cx-280,cy+ry*.8,cx-360,cy+ry+140]];
  for(const[x0,y0,x1,y1]of legPts){
    thick(x0,y0,x1,y1,90,64,(x,y,t)=>{const c=h3(x,y,909);setC(x,y,fbm(x*.05,y*.05,909)>.58?'grass':c<.2?'rubble':'floor',Math.round(9-4*t));});
    for(const[x,y,d]of discCells(x1,y1,48))if(inb(x,y))setC(x,y,d>44?'cavewall':h3(x,y,910)<.15?'rubble':'floor',5);
    const dir=Math.atan2(y1-y0,x1-x0);for(let k=-2;k<=2;k++){const a=dir+k*.38,tx=x1+Math.cos(a)*48,ty=y1+Math.sin(a)*48;for(const[x,y]of discCells(tx,ty,11))if(inb(x,y))setC(x,y,'cavewall',6);}}
  thick(cx-rx+40,cy,cx-rx-220,cy+30,170,24,(x,y,t)=>{setC(x,y,h3(x,y,911)<.25?'rubble':fbm(x*.05,y*.05,911)>.55?'grass':'floor',Math.round(8-7*t));});
  for(let k=0;k<9;k++){const t=k/9,x=cx-rx+20-230*t,y=cy+30*t;for(const[a,b]of discCells(x,y,6-4*t))if(inb(a,b))setC(a,b,'stalag',null);}
  const hx=cx+rx+120,hy=cy;
  thick(cx+rx-60,cy,hx-80,hy,220,190,(x,y)=>{setC(x,y,h3(x,y,912)<.2?'rubble':fbm(x*.05,y*.05,912)>.55?'grass':'floor',9);});
  for(let y=hy-130;y<=hy+130;y++)for(let x=hx-160;x<=hx+170;x++){const u=(x-hx)/165,v=(y-hy)/125,d=u*u+v*v+(fbm(x*.03,y*.03,913)-.5)*.15;if(d>=1||!inb(x,y))continue;
    setC(x,y,d>.9?'cavewall':h3(x,y,913)<.18?'rubble':'floor',Math.round(9+(1-d)*4));}
  for(const s of[-1,1]){for(const[x,y]of discCells(hx+55,hy+s*58,10))setC(x,y,'eye',13);
    thick(hx-40,hy+s*90,hx-200,hy+s*230,26,8,(x,y)=>setC(x,y,'cavewall',12));}
  fillR(hx+120,hy-36,hx+168,hy+36,'maw',3);fillR(hx+120,hy-44,hx+168,hy-37,'teethwall',6);fillR(hx+120,hy+37,hx+168,hy+44,'teethwall',6);
  for(let y=cy-ry-25;y<=cy+ry+25;y++)for(let x=cx-rx-25;x<=cx+rx+25;x++){if(!inb(x,y))continue;const u=(x-cx)/rx,v=(y-cy)/ry,d=u*u+v*v+(fbm(x*.012,y*.012,902)-.5)*.16;if(d>=1)continue;
    const m=fbm(x*.006,y*.006,903)*.6+fbm(x*.022,y*.022,904)*.3+(1-d)*.4-.1,c=h3(x,y,905);let e=Math.max(5,Math.min(15,Math.round(4+m*9.5))),k;
    if(d>.94){k='cavewall';e=7;}else if(e>=13)k=c<.08?'ice':'snow';else if(e>=11)k=c<.15?'rubble':c<.17?'boulder':'floor';
    else{const lake=fbm(x*.016,y*.016,906);if(lake<.27){k=lake<.22?'deep':'shallow';e=Math.min(e,9);}else{const f=fbm(x*.05,y*.05,907);k=f>.55?(c<.65?'tree':'grass'):f>.45?(c<.08?'tree':'grass'):c<.12?'tree':'brush';}}
    if(Math.abs(fbm(x*.01,y*.01,908)-.5)<.006&&e<13)k=c<.5?'lava':'crust';
    const i=y*W+x;L.cells[i]=ID[k];L.elev[i]=e;}
  const sx=cx+60,sy=cy-50;
  for(const[x,y,d]of discCells(sx,sy,46)){const c=h3(x,y,914);setC(x,y,d>36?'rubble':d<7?'portal':d<12&&c<.35?'crystal':'obsidian',d>36?14:13);}
  for(const[x,y]of discCells(cx-130,cy+70,15))setC(x,y,'chasm',9);
  const vx=cx-220,vy=cy-150;for(const[x,y,d]of discCells(vx,vy,26))setC(x,y,d<4?'well':'grass',8);
  for(let k=0;k<16;k++){const a=k*2.4,r=8+(k*37%14),x=Math.round(vx+Math.cos(a)*r),y=Math.round(vy+Math.sin(a)*r);setC(x,y,k%3?'thatch':'roof',9);}
  for(const a of[0,Math.PI/2,Math.PI,Math.PI*1.5])for(let r=4;r<24;r++)setC(Math.round(vx+Math.cos(a)*r),Math.round(vy+Math.sin(a)*r),'road',8);
  const tx=cx+230,ty=cy+140;for(const[x,y,d]of discCells(tx,ty,18))setC(x,y,d<9?'tile':'floor',11);for(let k=0;k<10;k++)setC(Math.round(tx+Math.cos(k*.63)*12),Math.round(ty+Math.sin(k*.63)*12),'pillar',11);setC(tx,ty,'altar',11);
  ctok('creature','Frenzied Rathalos',sx+30,sy+20,Object.assign({size:3},FZ));ctok('creature','Frenzied Kulu-Ya-Ku',cx-60,cy+180,FZ);
  ctok('creature','King Shakalaka',vx+3,vy+3,{cat:'Hunter',color:'#c9772e'});ctok('creature','Frenzied Gypceros',cx+150,cy+200,FZ);
  place(cx,cy-ry-60,MASS);place(hx+145,hy-60,'The Maw-Gate (way inside)',links.maw);place(hx+60,hy-100,'The Eyes');
  place(sx,sy-58,'Summit Crater: the Heart-Shard Spire');place(cx-130,cy+95,'Breathing Vent (into the Lungs)',links.inside);
  place(vx,vy-32,'Shellback Village (Lynians)');place(tx,ty-26,'Temple of the Mountain');place(cx-rx-170,cy+90,'The Tail');
  place(160,cy-130,'Trail of crushed earth');legPts.forEach(([,,x1,y1],k)=>place(x1,y1+(y1<cy?-56:56),['Right foreleg','Left foreleg','Right midleg','Left midleg','Right hindleg','Left hindleg'][k]));
  note(cx,cy+ry+40,'It walks east about 1 mile per hour. Each step: DC 15 Dex or prone; lakes slosh');
  note(sx,sy+56,'Frenzied comet heart-shard lodged in the summit (pulses with the party’s shards)');
  note(cx-130,cy+40,'Every 10 min the vent exhales spores: all within 1 mile gain 1 frenzy charge');
  return lv;
}
function buildMassifInside(links){
  const lv=newLv(MASS+' (inside, 25 mi)',1320,1000,{scale:100,weather:'spores',mood:'night'});const W=1320,H=1000;
  const R={maw:[1100,380,1300,620],sea:[850,380,1080,620],heart:[560,400,800,600],lungN:[600,80,900,330],lungS:[600,670,900,920],magma:[250,350,520,650],fungal:[330,80,560,300],oss:[330,700,560,920],frozen:[60,100,240,300]};
  applyBiome('crystal',...R.maw,921);applyBiome('lake',...R.sea,922);applyBiome('gut',...R.heart,923);applyBiome('crystal',...R.lungN,924);applyBiome('crystal',...R.lungS,925);
  applyBiome('lava',...R.magma,926);applyBiome('fungal',...R.fungal,927);applyBiome('bones',...R.oss,928);applyBiome('frozen',...R.frozen,929);
  const c=k=>[Math.round((R[k][0]+R[k][2])/2),Math.round((R[k][1]+R[k][3])/2)];
  const tun=(a,b,k)=>{const[p,q]=c(a),[r,s]=c(b);carvePath(p,q,r,s,k||'rubble',5);};
  carvePath(c('maw')[0],c('maw')[1],W-1,c('maw')[1],'flesh',7);
  tun('maw','sea');tun('sea','heart','flesh');tun('heart','lungN','veins');tun('heart','lungS','veins');tun('heart','magma');tun('magma','fungal');tun('magma','oss');tun('fungal','frozen');tun('lungN','fungal');tun('lungS','oss');
  for(const[x,y]of[[300,0],[700,0],[1050,0],[300,H-1],[700,H-1],[1050,H-1]]){const[hx,hy]=c('heart');carvePath(x<600?c('magma')[0]:x<900?hx:c('sea')[0],y?c('lungS')[1]:c('lungN')[1],x,y,'floor',5);}
  for(const k of['lungN','lungS']){const[x,y]=c(k);for(let n=0;n<40;n++){const a=n*2.39,r=10+(n*53%110);setC(Math.round(x+Math.cos(a)*r),Math.round(y+Math.sin(a)*r*.7),'portal',0);}}
  const[hx,hy]=c('heart');for(const[x,y,d]of discCells(hx,hy,9))setC(x,y,d<3?'portal':'flesh',0);
  ctok('creature','Heart of Ul’Garrath',hx-2,hy-2,{model:'heart',size:4,color:'#b5303f',anim:'aura',frenzy:1});
  ctok('creature','Apex Gore Magala',c('lungN')[0]+20,c('lungN')[1],AX);ctok('creature','Frenzied Plesioth',c('sea')[0],c('sea')[1],Object.assign({submerged:true},FZ));
  ctok('creature','Frenzied Agnaktor',c('magma')[0],c('magma')[1],FZ);ctok('creature','Frenzied Nerscylla',c('fungal')[0],c('fungal')[1],FZ);
  ctok('creature','Frenzied Odogaron',c('oss')[0],c('oss')[1],FZ);ctok('creature','Frenzied Barioth',c('frozen')[0],c('frozen')[1],FZ);ctok('creature','Frenzied Gore Magala',c('lungS')[0],c('lungS')[1],FZ);
  const P=(k,t,dy,ln)=>{const[x,y]=c(k);place(x,R[k][1]-12+(dy||0),t,ln);};
  P('maw','The Maw-Gate Halls',0,links.maw);P('sea','The Stomach Sea');P('heart','The Frenzied Heart',0,links.heart);P('lungN','North Crystal Lung',0,links.lung);P('lungS','South Crystal Lung');
  P('magma','Magma Heart-Veins');P('fungal','Fungal Undergrowth');P('oss','Ossuary of the Devoured');P('frozen','Frozen Marrow');
  place(300,30,'Right hindleg shaft');place(700,30,'Right midleg shaft');place(1050,30,'Right foreleg shaft');place(300,H-30,'Left hindleg shaft');place(700,H-30,'Left midleg shaft');place(1050,H-30,'Left foreleg shaft');
  place(1240,c('maw')[1]-30,'Out through the mouth',links.outside);
  note(hx,hy+130,'Lungs breathe every 10 min: everyone inside gains 1 frenzy charge until the heart-shard is removed');
  note(hx,hy+150,'The mountain’s immune system: frenzied minion swarms hunt intruders in the tunnels');
  return lv;
}
function buildMawGate(back){
  newLv('Ul’Garrath: The Maw-Gate (5 ft)',64,48,{mood:'night',weather:'heartbeat'});
  applyBiome('crystal',18,3,63,45,931);
  fillR(0,15,19,32,'flesh',0);for(let x=0;x<20;x++){setC(x,14,'teethwall',3);setC(x,33,'teethwall',3);if(x%3===0){setC(x,15,'maw',0);setC(x,32,'maw',0);}}
  for(let x=0;x<20;x++)for(const y of[13,34])if(get(x,y)===0)setC(x,y,'fleshwall',2);
  for(let k=0;k<6;k++)setC(3+k*3,17+(k%2)*12,'acid',0);for(let y=16;y<=31;y+=3)setC(9,y,'veins',0);carvePath(19,24,30,24,'flesh',3);
  minions('Frenzied Ioprey',6,[[24,20],[26,28],[30,18],[33,26],[36,22],[28,24]]);ctok('creature','Frenzied Iodrome',38,23,Object.assign({size:2,hp:45,hpMax:45},FZ));
  place(9,12,'The Maw-Gate');place(42,4.5,'Gullet crystal halls');place(5,40,'Back inside the mountain',back);note(9,36,'Acid drool pools; the teeth grind shut each time it takes a step');
}
function buildLung(back){
  newLv('Ul’Garrath: North Crystal Lung (5 ft)',70,60,{mood:'night',weather:'spores',gridStyle:'glow'});
  applyBiome('crystal',2,2,67,57,941);
  for(let n=0;n<60;n++){const a=n*2.39,r=5+(n*31%24);const x=Math.round(35+Math.cos(a)*r),y=Math.round(30+Math.sin(a)*r*.8);if(!T[get(x,y)].b)setC(x,y,'portal',0);}
  ctok('creature','Apex Gore Magala',33,27,Object.assign({size:3},AX));minions('Frenzied Qurio',8,[[25,20],[44,22],[22,36],[47,38],[30,44],[40,15],[18,28],[52,30]]);
  place(35,3.6,'North Crystal Lung');place(8,55,'Back to the tunnels',back);note(35,56,'Each breath (every 10 min, or on Enraged): DC 18 Con or 1 frenzy charge');
}
function buildHeart(back){
  newLv('Ul’Garrath: The Frenzied Heart (5 ft)',80,80,{mood:'night',weather:'heartbeat'});
  applyBiome('gut',3,3,76,76,951);
  for(const[x,y,d]of discCells(40,40,24))if(d>20&&d<23)setC(x,y,'lava',0);
  for(const a of[0,Math.PI/2,Math.PI,Math.PI*1.5])for(let r=19;r<=24;r++)for(let w=-1;w<=1;w++)setC(Math.round(40+Math.cos(a)*r+(a%Math.PI?w:0)),Math.round(40+Math.sin(a)*r+(a%Math.PI?0:w)),'bone',0);
  for(const[x,y,d]of discCells(40,40,12))setC(x,y,d<2.5?'portal':'flesh',0);
  for(let k=0;k<8;k++){const a=k*Math.PI/4;for(let r=12;r<20;r++)setC(Math.round(40+Math.cos(a)*r),Math.round(40+Math.sin(a)*r),'veins',0);}
  ctok('creature','Heart of Ul’Garrath',37,30,{model:'heart',size:6,color:'#b5303f',anim:'aura',frenzy:1});
  minions('Frenzied White Cell',8,[[30,30],[50,30],[30,50],[50,50],[40,26],[40,54],[26,40],[54,40]],{model:'ooze',color:'#e8e8f0'});
  place(40,6,'The Frenzied Heart');place(40,62,'Lava moat; bone bridges');place(8,75,'Back to the tunnels',back);
  note(40,66,'The heart-shard: bring the party’s shards here to CALM the virus (ally) or FEED it (Apex dungeon)');
  note(40,69,'Every heartbeat (init 20): DC 18 Con or 1 frenzy charge');
}
async function addCometCampaign(){
  const keep=L,wait=()=>new Promise(r=>setTimeout(r,30));
  toast('Building the Frenzied Comet maps. This takes a few seconds…',8000);await wait();
  const first=D.levels.length;
  buildShallows();await wait();buildCaves();await wait();buildWake();await wait();buildHush();await wait();buildPass();await wait();buildSteppe();await wait();
  toast('Raising Ul’Garrath, the Walking Mountain…',8000);await wait();
  buildMawGate(null);const mawLv=L;await wait();buildLung(null);const lungLv=L;await wait();buildHeart(null);const heartLv=L;await wait();
  const outside=buildMassifOutside({maw:mawLv.id,inside:null});await wait();
  const inside=buildMassifInside({maw:mawLv.id,heart:heartLv.id,lung:lungLv.id,outside:outside.id});
  for(const lb of outside.labels)if(lb.text.startsWith('Breathing Vent'))lb.link=inside.id;
  for(const lv of[mawLv,lungLv,heartLv])for(const lb of lv.labels)if(lb.text.startsWith('Back'))lb.link=inside.id;
  const order=[...D.levels.slice(0,first),...D.levels.slice(first,first+6),outside,inside,mawLv,lungLv,heartLv];D.levels=order;
  L=keep;invalidate();fillLevels();switchLevel(first);
  toast('Added 6 encounter maps and Ul’Garrath (outside, inside and 3 key areas). Pick them from the level menu.',8000);
}

/* ================= Mordenheim Kinetics: Sanctuary, Deep Freeze (Cryogenics), Neural Tuning ================= */
CATS.Mordenheim='#5c6f80';CAT_MODEL.Mordenheim='hum';CAT_NAMES.Mordenheim='Mordenheim Kinetics';
CREATURES.push(['Echo','🧑',1,'Mordenheim'],['Empty Echo','🤖',1,'Mordenheim'],['Shattered Echo','🤖',1,'Mordenheim'],['K-Nine','🐕',1,'Mordenheim'],['Adam','🧟',2,'Mordenheim'],
  ['Hendrik von Aubrecker','🦾',1,'Mordenheim'],['Hendrik’s Created','🧟',1,'Mordenheim'],['Created','🧟',1,'Mordenheim'],['Gerta von Aubrecker','🧥',2,'Mordenheim'],
  ['Rudolph von Aubrecker','🧠',2,'Mordenheim'],['Viktra Mordenheim','👩‍🔬',1,'Mordenheim']);
Object.assign(MP,{'Echo':['hum',{body:'#5a6a7a',skin:'#e0cfc0'}],'Empty Echo':['hum',{body:'#6e655a',skin:'#e8e2d8',hair:'#e8e2d8',thin:1}],
  'Shattered Echo':['hum',{body:'#4a4038',skin:'#c8b8a8',hunch:1,glow:'#ff3020',thin:1}],'K-Nine':['quad',{body:'#7a8088',head:'#8a9098',ears:'point',snout:.22,eyec:'#ff3030',spikes:1,long:1.1,legw:.13}],
  'Adam':['hum',{body:'#4e4236',skin:'#9aa890',hair:'#1a1a1a',bulk:.5,hunch:1}],'Hendrik von Aubrecker':['hum',{body:'#7c838c',arms:'#9aa3ad',skin:'#c9a07a',thin:1,weapon:'dagger'}],
  'Hendrik’s Created':['hum',{body:'#5a4a3c',skin:'#a8b0a0',bulk:.46,hunch:1}],'Created':['hum',{body:'#5a4a3c',skin:'#a8b0a0',bulk:.46,hunch:1}],
  'Gerta von Aubrecker':['hum',{body:'#5a4636',skin:'#d0c0b0',robe:1}],'Rudolph von Aubrecker':['spider',{body:'#7a8088',mark:'#e8c0a0',eyec:'#7affb0'}],
  'Viktra Mordenheim':['hum',{body:'#e6e6e6',skin:'#e0c0a8',robe:1}]});
const MKC=CATS.Mordenheim;
function mkTok(name,x,y,o){return ctok('creature',name,x,y,Object.assign({color:MKC,cat:'Mordenheim'},o||{}));}
function mkRing(ax,ay,bx,by,floor,wall,e){fillR(ax,ay,bx,by,wall||'metalwall',e||0);fillR(ax+1,ay+1,bx-1,by-1,floor||'metal',e||0);}

function buildSanctuary(){
  const lv=newLv('Sanctuary (Mordenheim Kinetics, level 1)',39,26,{lit:false,sky:false,mood:'night'});
  // S1 Elevator Bank
  fillR(0,17,9,25,'metalwall');fillR(1,20,8,22,'metal');
  for(const x of[1,4,7]){fillR(x,18,x+1,18,'metal');fillR(x,19,x+1,19,'elevator');fillR(x,23,x+1,23,'elevator');fillR(x,24,x+1,24,'metal');}
  fillR(4,18,5,18,'chasm');
  for(const x of[3,6]){setC(x,19,'elight');setC(x,23,'elight');}
  setC(1,22,'brush');setC(2,22,'brush');setC(6,21,'brush');setC(7,22,'brush');setC(8,20,'brush');setC(7,21,'blood');setC(0,22,'camera');
  fillR(9,20,9,22,'portcullis');setC(8,19,'plight');
  place(4.5,21.5,'S1 Elevator Bank');
  note(7.5,20.6,'Corpse in a lab coat: white “MK” key card');note(4.5,17.6,'Snapped shaft: 50 ft drop to Cryogenics (Deep Freeze)');
  note(1.5,23.6,'Camera above plants: DC 13 Perception');note(8.6,18.6,'Blue panel: tap key card to raise grille');
  note(4.5,25.4,'South shafts climb 80 ft and loop back here');note(4.5,16.6,'North shafts: elevator box, hatch up 10 ft to S3');
  // S2 Lobby
  fillR(9,17,29,25,'metalwall');fillR(10,18,28,24,'tile');fillR(9,20,9,22,'portcullis');
  fillR(12,17,25,17,'glasswall');
  for(let y=19;y<=24;y++)for(let x=21;x<=28;x++){const c=h3(x,y,91),d=(x-21)+(y-19)*.6;if(d>2+c*3)setC(x,y,c<.3?'cavewall':'rubble',0);}
  fillR(16,19,18,19,'desk');setC(17,19,'terminal');setC(17,20,'chest');
  fillR(10,18,11,19,'stairsup',1);fillR(22,18,23,19,'stairsup',1);
  setC(14,22,'pillar');setC(20,22,'pillar');fillR(11,24,13,24,'seats');
  setC(15,25,'elight');setC(24,25,'elight');
  setC(29,21,'secret');
  mkTok('Empty Echo',10,18,{icon:'🤖'});
  place(17,21.6,'S2 Lobby');place(25,22.6,'Collapsed rubble');
  note(17,20.6,'Ringing phone: Viktra asks you to enter INNOVATE');note(18.6,21.4,'Under the desk: vodka flask, bullseye lantern (flashlight), dagger');
  note(10.6,17.4,'Empty Echo on the landing: Passive Perception 10 to notice');note(28.4,20.4,'Secret passage to S5: DC 15 Perception');
  note(20,23.8,'Lofted ceiling 30 ft');
  // S3 Mezzanine Offices (10 ft up)
  fillR(0,0,10,17,'metalwall',2);fillR(1,1,9,16,'metal',2);
  fillR(6,0,7,0,'gilded',2);
  fillR(3,3,9,6,'glasswall',2);fillR(4,4,8,5,'metal',2);fillR(5,4,8,4,'desk',2);setC(4,6,'elevatoro',2);
  fillR(5,9,9,13,'glasswall',2);fillR(6,10,8,12,'metal',2);setC(6,10,'desk',2);setC(7,10,'terminal',2);setC(8,12,'desk',2);setC(5,11,'elevatoro',2);
  fillR(1,11,3,15,'glasswall',2);fillR(1,12,2,14,'metal',2);setC(1,12,'desk',2);setC(2,14,'chest',2);setC(3,13,'elevatoro',2);
  fillR(1,6,2,9,'rubble',2);setC(1,7,'cavewall',2);
  fillR(10,16,10,17,'stairsup',1);setC(9,16,'metal',2);
  setC(4,8,'blood',2);setC(0,1,'camera',2);setC(10,15,'camera',2);setC(0,4,'elight',2);setC(0,14,'elight',2);setC(5,17,'elight',2);
  mkTok('Empty Echo',4,10,{icon:'🤖'});mkTok('Empty Echo',7,15,{icon:'🤖'});
  place(5,8.4,'S3 Mezzanine Offices');place(6.5,1.4,'Gilded elevator');
  note(4,7.4,'Corpse: handheld cassette player · blood trail to S4 (DC 10 Investigation)');
  note(7.5,9.4,'Glowing terminal, unplugged: “DO NOT BETRAY ME”');note(2,16.4,'Desk: Potion of Growth, computer engineering book, $100 (100 GP)');
  note(6.5,2.4,'Sealed: opens only by the command at S5’s terminal');note(5,15.6,'Two cameras in opposite corners · ceiling 20 ft');
  // S4 Atrium
  fillR(11,0,28,16,'glasswall',0);for(const[x,y]of[[11,0],[12,0],[11,1],[28,0],[27,0],[28,1]])setC(x,y,'rock',0);
  for(let y=1;y<=15;y++)for(let x=12;x<=27;x++){const c=h3(x,y,92);setC(x,y,c<.18?'brush':c<.3?'grass':'dirt',0);}
  for(let x=13;x<=26;x++)setC(x,0,'chasm',0);
  for(const[x,y]of[[13,10],[14,13],[25,4],[26,9],[22,3],[24,13],[16,8]])setC(x,y,'tree',0);
  for(let y=2;y<=10;y++){const cx=19+Math.round(Math.sin(y*.7)*1.2);for(let x=cx-1;x<=cx+1;x++)setC(x,y,y<4||x===cx?'shallow':'swamp',0);}
  for(let y=1;y<=7;y++)for(let x=12;x<=16-Math.floor(y/3);x++)setC(x,y,'rubble',x<14?2:1);
  for(let y=2;y<=7;y++)for(let x=9;x<=11;x++)setC(x,y,'rubble',x<11?2:1);
  for(let y=11;y<=13;y++)for(let x=17;x<=19;x++)setC(x,y,'cobble',0);setC(18,12,'stairsdn',0);setC(18,10,'statue',0);
  fillR(16,15,20,15,'stairsup',0);
  mkTok('K-Nine',13,9,{icon:'🐕',hidden:true});mkTok('K-Nine',26,8,{icon:'🐕',hidden:true});
  place(21,6,'S4 Atrium');place(19.5,0.6,'Broken wall: 50 ft cliff to Copperbark Hollow');place(18,9.4,'Statue of Viktra Mordenheim');
  note(18,14.6,'Dry fountain: spiral stair down 20 ft to S5 (faster than 5 ft/round: DC 12 Dex or fall)');
  note(25,12.4,'Bloody cassette “ITERATE” in the bushes: DC 15 Perception');note(19.5,1.6,'Rain: lightly obscured · darkness · rubble is difficult terrain');
  note(19.5,8.4,'K-Nines hide in bushes (Passive 14 to spot); attack near the center');note(19.5,7.4,'If the party saw S5 first: Adam is here fighting the K-Nines');
  note(18,10.6,'DC 10 History: it is Viktra Mordenheim');
  // S5 Adam's Sanctuary (below the atrium)
  fillR(29,1,38,16,'cavewall');
  for(const[x,y,r]of[[33,7,2.6],[35,10,2.4],[32,12,2.2],[34,4,1.8],[36,6,1.6]])for(const[cx,cy]of discCells(x,y,r))if(cx>=30&&cx<=37&&cy>=2&&cy<=15)setC(cx,cy,'dirt',0);
  setC(34,2,'stairsup',0);setC(34,3,'stairsup',0);
  setC(32,8,'desk');setC(33,6,'terminal');setC(35,6,'carpet');setC(36,6,'carpet');for(const[x,y]of[[31,12],[32,13],[36,11],[36,12],[30,10]])setC(x,y,'crates');setC(35,13,'chest');
  fillR(30,17,34,22,'cavewall');for(let x=30;x<=33;x++)setC(x,21,'dirt');for(let y=14;y<=21;y++)setC(33,y,'dirt');setC(27,21,'rubble');setC(28,21,'rubble');
  mkTok('Adam',33,9,{size:2,icon:'🧟'});
  place(33.5,1.4,'S5 Adam’s Sanctuary');place(34,2.6,'Stairs up to S4 fountain');place(31.6,22.4,'Tunnel to S2');
  note(33,5.4,'Terminal “Project_Lamordia”: INNOVATE (help Viktra) or ITERATE (help Adam); Adam must be connected');
  note(33.5,15.4,'2 Potions of Healing, musket + 10 bullets, $300 of components, blankets, books, rope, shovel, oil, lock (9-4-39)');
  note(33.5,11.4,'Adam starts Indifferent; avoids cameras');
  return lv;
}

function buildCryogenics(){
  const lv=newLv('Deep Freeze: Cryogenics (Mordenheim Kinetics, level 3)',38,23,{lit:false,sky:false,mood:'night'});
  // D3 Operating Theater
  mkRing(13,0,29,6);for(let y=1;y<=5;y++)for(let x=17;x<=19;x++)if(h3(x,y,93)<.7)setC(x,y,'shallow');
  fillR(14,3,15,3,'altar');setC(16,3,'machine');setC(14,1,'terminal');
  for(let x=20;x<=26;x+=2)fillR(x,1,x,5,'seats');fillR(27,2,27,4,'desk');setC(27,3,'terminal');
  setC(13,3,'plight');setC(29,3,'plight');fillR(18,6,19,6,'elevator');
  mkTok('Hendrik von Aubrecker',16,4,{icon:'🦾'});mkTok('Hendrik’s Created',14,3,{icon:'🧟',conds:['Unconscious'],hp:60,hpMax:60});
  place(21,0.6,'D3 Operating Theater');note(15,5.6,'Spike his terminal or table: DC 13 Sleight of Hand · the Created wakes berserk (60 HP)');
  note(23,5.6,'Hendrik: one key card; trades a power spike to throttle Gerta’s workstation');
  // D2 Hallway ring (2 ft of water)
  mkRing(10,7,29,20,'shallow');fillR(13,10,26,17,'metalwall');fillR(18,7,19,7,'shallow');
  for(const[x,y]of[[10,9],[10,17],[29,9],[29,18],[15,20],[24,20],[15,7],[24,7]])setC(x,y,'plight');
  fillR(21,8,26,8,'seats');fillR(16,19,17,19,'cryopod');fillR(21,20,22,22,'rubble');setC(21,22,'chasm');setC(22,22,'chasm');
  mkTok('Hendrik’s Created',27,8,{icon:'🧟'});mkTok('Shattered Echo',16,19,{icon:'🤖',conds:['Restrained']});
  place(11.5,8.6,'D2 Hallway');note(19,19.6,'2 ft water: difficult terrain · floating cryopod (stuck latch)');note(27,9.6,'The Created stalks counter-clockwise');
  note(21.6,21.6,'Collapsed passage');
  // D5 Cryogenerator
  fillR(14,11,25,16,'metal');for(let y=12;y<=15;y++)for(let x=14;x<=18;x++)if(fbm(x*.4,y*.4,94)>.4)setC(x,y,'ice');
  for(const x of[15,18,21]){fillR(x,11,x+1,11,'machine');fillR(x,16,x+1,16,'machine');}
  fillR(21,12,21,15,'stairsup',0);fillR(22,12,25,15,'metal',1);fillR(23,12,25,15,'machine',1);setC(22,13,'terminal',1);setC(22,14,'terminal',1);
  setC(13,11,'elevator');setC(13,12,'elevator');setC(13,15,'elevator');setC(13,16,'elevator');setC(13,13,'screen');setC(13,14,'screen');
  place(19.5,13.4,'D5 Cryogenerator');note(12,13.5,'Power terminal: two key cards open both door pairs');
  note(23.5,10.6,'Reset: lever DC 15 Con or 3d6 cold · shaking DC 15 Str or prone · 1d3 icicles +4, 1d10');
  note(19.5,17.6,'Below 0 °F · ceiling 40 ft · icicles everywhere');
  // D1 Cryopod Storage
  mkRing(0,7,9,17);for(let y=8;y<=16;y++)for(let x=1;x<=8;x++)if(fbm(x*.35,y*.35,95)>.5)setC(x,y,'shallow');
  for(const y of[9,11,13])setC(1,y,'cryopod');setC(5,15,'cryopod');setC(7,15,'cryopod');setC(6,10,'cryopod');setC(8,8,'chest');
  fillR(9,11,9,12,'elevator');fillR(9,11,10,12,'shallow');setC(9,11,'elevator');setC(9,12,'elevator');
  fillR(2,17,6,20,'metalwall');fillR(3,17,4,17,'elevator');fillR(3,18,5,19,'metal');setC(0,9,'plight');setC(9,15,'plight');
  for(const y of[9,11,13])mkTok('Shattered Echo',2,y,{icon:'🤖',conds:['Unconscious']});
  place(4.5,7.6,'D1 Cryopod Storage');place(4,20.4,'Elevator (offline)');
  note(4,16.4,'Elevator needs 100 power · each pod here needs 50');note(2,8.4,'3 pods still frozen (echoes wake if opened or thawed)');
  note(6.5,9.4,'Smashed pod: destroyed echo · 2 empty pods');note(7.5,7.5,'Crowbar in the corner');
  // D4 Cryopod Research
  mkRing(30,7,37,18);fillR(29,14,30,15,'elevator');setC(29,14,'shallow');setC(29,15,'shallow');setC(30,14,'elevator');setC(30,15,'elevator');
  for(const y of[8,10])for(let x=31;x<=34;x++)setC(x,y,'cryopod');for(let x=31;x<=34;x++)setC(x,16,'cryopod');
  fillR(32,13,34,13,'desk');setC(33,13,'terminal');setC(37,12,'plight');
  mkTok('Gerta von Aubrecker',33,14,{size:2,icon:'🧥'});
  for(const y of[8,10,16])for(let x=31;x<=34;x++)mkTok('Shattered Echo',x,y,{icon:'🤖',conds:['Unconscious'],hidden:true});
  place(33.5,7.6,'D4 Cryopod Research');note(33.5,12.4,'Below 0 °F · “Don’t let the cold out”');
  note(33.5,17.6,'Spike her terminal: DC 14 Sleight of Hand · Gerta has the other key card');note(33.5,11.4,'12 pods, each with a dormant Shattered Echo (hidden tokens)');
  note(27,21.6,'Pale emergency lights: dim light');
  return lv;
}

function buildNeuralTuning(){
  const lv=newLv('Neural Tuning (Mordenheim Kinetics, level 5)',43,26,{lit:true,sky:false});
  // N1 Bright Hallway
  mkRing(0,4,6,7,'tile');setC(6,5,'elevatoro');setC(6,6,'elevatoro');setC(5,5,'crates');
  for(const x of[1,3,5])setC(x,4,'plight');
  place(3,8.4,'N1 Bright Hallway');note(3,3.6,'Fallen ladder jams the door open (remove it and the door locks)');note(3,9.2,'Ceiling 10 ft · mirror-like walls');
  // N2 Calibration Chamber
  mkRing(6,3,17,15,'tile');setC(6,5,'elevatoro');setC(6,6,'elevatoro');fillR(7,4,11,7,'tile',2);for(let y=8;y<=13;y++)setC(7,y,'stairsup',Math.max(0,Math.round((13-y)/3)));
  fillR(17,7,17,12,'screen');setC(16,6,'speaker');setC(16,13,'speaker');setC(9,10,'machine');
  for(const[x,y]of[[13,8],[13,9],[14,9],[12,10],[13,10],[14,10],[13,11],[14,11],[13,12]])setC(x,y,'seats');
  fillR(11,15,12,15,'elevator');
  [['Alexis Melodious','🎤'],['Bryant Epsilon','💻'],['Jessita Cruz','💝'],['Wilbert Monroe','💼']].forEach(([n,i],k)=>mkTok(n,[11,15,10,14][k],[8,8,12,13][k],{icon:i,model:'hum',color:'#6a8aa6'}));
  place(11.5,3.6,'N2 Calibration Chamber');place(9,4.6,'Balcony');
  note(11.5,14.4,'Tone, 2 rounds: DC 13 Con or 2d4 thunder; echoes fail, 2 fails = Shattered Echo');
  note(15.5,14.6,'Speakers: AC 13, 10 HP; tone stops if both break');note(8.6,12.4,'Echoes: pop star, tech worker, philanthropist, investor');
  // corridor N2 -> N3
  fillR(10,16,13,16,'metalwall');fillR(11,16,12,16,'tile');
  // N3 Proprioception Test (L-shaped, under N5)
  mkRing(8,17,27,24,'tile');fillR(11,17,12,17,'tile');
  fillR(13,18,17,18,'lockers');fillR(8,19,8,22,'screen');for(const[x,y]of[[11,20],[12,20],[11,21],[12,21]])setC(x,y,'seats');
  fillR(15,22,18,22,'terminal');setC(14,19,'chest');
  mkTok('Empty Echo',16,21,{icon:'🤖'});mkTok('Empty Echo',17,21,{icon:'🤖'});
  place(13,23.5,'N3 Proprioception Test');note(9.6,18.4,'Screen: Quintessential Qualities of Musical Virtuosi');
  note(16.5,19.4,'Play your highest ability’s instrument: percussion Str · string Dex · brass Con · electronic Int · woodwind Wis · vocals Cha');
  note(16.5,20.4,'3 wrong in a row: the 2 automatons become Shattered Echoes');note(14,18.4,'Lockers: one is an Instrument of Illusions');
  // N4 Service Elevator
  fillR(22,20,27,24,'metalwall');fillR(23,21,26,23,'metal');setC(22,22,'elevatoro');setC(26,22,'terminal');
  place(24.5,24.6,'N4 Service Elevator');note(24.5,20.6,'“Insert emergency lever” · socket fits Rudolph’s arm (DC 10 Investigation)');
  // N5 Neuroscan Booths
  fillR(18,6,26,20,'metalwall');fillR(19,7,25,19,'metal');for(const[x,y]of[[19,7],[25,7],[19,19],[25,19]])setC(x,y,'metalwall');
  for(const y of[9,11,13,15,17])setC(19,y,'booth');for(const y of[9,14,17])setC(25,y,'booth');
  fillR(20,20,21,20,'elevator');fillR(21,6,22,6,'elevator');fillR(26,12,26,13,'elevator');
  for(let y=11;y<=14;y++)for(let x=27;x<=29;x++)setC(x,y,'rubble');for(let y=19;y<=21;y++)for(let x=28;x<=30;x++)if(!(x===28&&y===21))setC(x,y,'rubble');
  mkTok('Rudolph von Aubrecker',21,9,{size:2,icon:'🧠'});
  for(const[x,y]of[[20,8],[24,8],[20,12],[24,12]])mkTok('Empty Echo',x,y,{icon:'🤖'});
  place(22,18.4,'N5 Neuroscan Booths');note(27.5,10.4,'East doors jammed by rubble');
  note(22,15.4,'Booth: DC 13 Dex or grappled + restrained (escape 13); end of turn DC 15 Wis or 3d6 psychic + side effect');
  note(22,16.4,'Arm = elevator lever: DC 15 Investigation to notice, DC 20 Sleight of Hand to take');
  note(22,17.4,'Booths: $1,500, Cloak of Protection, Scroll of Aura of Purity, fire-opal gold chain (2,500 GP)');
  // N6 Hallway
  fillR(20,0,26,6,'metalwall');fillR(21,1,25,5,'metal');fillR(23,2,23,5,'metalwall');fillR(21,6,22,6,'elevator');
  fillR(26,4,30,7,'metalwall');fillR(26,5,29,6,'metal');setC(26,6,'metalwall');setC(29,6,'terminal');
  setC(21,2,'seats');setC(24,1,'seats');setC(25,4,'seats');
  mkTok('Echo',21,2,{icon:'🧑',model:'hum',color:'#6a8aa6'});mkTok('Echo',24,1,{icon:'🧑',model:'hum',color:'#6a8aa6'});mkTok('Echo',25,4,{icon:'🧑',model:'hum',color:'#6a8aa6'});
  place(23,0.6,'N6 Hallway');note(28.5,7.6,'Terminal: Rudolph can turn these echoes into Shattered Echoes');
  // N7 Neuroprint Database
  const cx=36,cy=6;for(let y=0;y<=12;y++)for(let x=29;x<=42;x++){const d=Math.abs(x-cx)+Math.abs(y-cy);if(d<=6)setC(x,y,d===6?'metalwall':'tile');}
  for(let y=0;y<=12;y++)for(let x=29;x<=42;x++){const d=Math.abs(x-cx)+Math.abs(y-cy);if(d<=1)setC(x,y,'machine');else if(d===2)setC(x,y,(x===cx||y===cy)?'terminal':'metal');else if(d===5&&(x+y)%3===0)setC(x,y,'terminal');}
  setC(36,1,'machine');setC(41,6,'machine');setC(36,11,'machine');setC(30,6,'elevatoro');
  place(36,9.4,'N7 Neuroprint Database');note(36,2.4,'3 power lines: AC 14, 40 HP · breaking one: 10-ft burst, DC 15 Dex, 4d6 lightning');
  note(36,10.4,'If N5 turned violent: Rudolph + 3 Shattered Echoes make a last stand here');note(36,3.4,'2 lines broken: Rudolph surrenders · ceiling 50 ft');
  note(14,1.4,'Doors locked (DC 15, 1 min) except N4 · Rudolph can unlock any remotely');
  return lv;
}

async function addMordenheimMaps(){
  const keep=L,wait=()=>new Promise(r=>setTimeout(r,30));
  toast('Building the Mordenheim Kinetics maps…',6000);await wait();
  const first=D.levels.length;
  const san=buildSanctuary();await wait();const cryo=buildCryogenics();await wait();buildNeuralTuning();
  for(const lb of san.labels)if(lb.text==='Gilded elevator'||lb.text.startsWith('Snapped shaft'))lb.link=cryo.id;
  L=keep;invalidate();fillLevels();switchLevel(first);save();
  toast('Added Sanctuary, Deep Freeze and Neural Tuning. Your other maps are unchanged.',7000);
}

/* ================= text to map ================= */
// Reads a plain-English description and builds a map from the generators, builds, creatures and weather already in the app.
// It works offline (no AI service), by recognising place words, directions, sizes, counts and creature names.
const TM_FEATURES=[
 [/\b(castle|fortress|keep|citadel|stronghold)s?\b/,'castle','built'],[/\b(dungeon|labyrinth|maze|vault|catacombs?)\b/,'dungeon','built'],
 [/\b(village|town|hamlet|settlement)s?\b/,'village','built'],[/\b(ruin|ruins|ruined)\b/,'ruins','built'],[/\b(graveyard|cemetery|crypt|tomb)s?\b/,'graveyard','built'],
 [/\b(temple|shrine|church|cathedral|monastery)s?\b/,'temple','built'],
 [/\b(jungle|rainforest)\b/,'jungle','biome'],[/\b(swamp|marsh|bog|fen|wetlands?)\b/,'swamp','biome'],[/\b(oasis)\b/,'oasis','biome'],
 [/\b(desert|dunes?|wasteland|badlands)\b/,'desert','biome'],[/\b(mountains?|peaks?|alpine|highlands?)\b/,'mountains','biome'],
 [/\b(snowy|tundra|snow forest|taiga)\b/,'tundra','biome'],[/\b(frozen|glacier|ice cave|icy cave)\b/,'frozen','biome'],
 [/\b(forest|woods?|woodland|grove)\b/,'forest','biome'],[/\b(plains?|grassland|meadows?|fields?|prairie|steppe|farmland)\b/,'grassland','biome'],
 [/\b(lava|volcan\w*|magma)\b/,'lava','biome'],[/\b(crystal)\b/,'crystal','biome'],[/\b(mushroom|fungal|fungus|fungi)\b/,'fungal','biome'],
 [/\b(flesh|living dungeon|organs?)\b/,'flesh','biome'],[/\b(gut|stomach|intestines?|bowels?)\b/,'gut','biome'],[/\b(bones?|ossuary|boneyard)\b/,'bones','biome'],
 [/\b(underground lake|lake|pond|lagoon)s?\b/,'lake','biome'],[/\b(caves?|cavern|caverns|grotto|tunnels|underground)\b/,'caves','biome'],
 [/\b(sea|ocean|open water|bay)\b/,'sea','water'],[/\b(coast|beach|shore|shoreline|harbou?r)\b/,'coast','water'],[/\b(island|isle)s?\b/,'island','water'],
 [/\b(river|stream|creek)s?\b/,'river','line'],[/\b(road|path|trail)s?\b/,'road','line'],[/\b(wall|walls|rampart)\b/,'cwall','line'],
 [/\b(towers?|spire)\b/,'rtower','build'],[/\b(houses?|cottage|cabin|inn|tavern|shack)\b/,'house','build'],[/\b(huts?)\b/,'hut','build'],
 [/\b(camp|tents|campsite|encampment)\b/,'camp','build'],[/\b(ship|boat|galleon|wreck|shipwreck)s?\b/,'ship','build'],[/\b(bridge)\b/,'bridge','build'],
 [/\b(hill|hills|mound)\b/,'hill','build'],[/\b(cliffs?|plateau|mesa|ridge)\b/,'plateau','build'],[/\b(crater|pit)\b/,'crater','build'],
];
const TM_DIRS=[[/\b(north ?east|northeastern|upper right|top right)\b/,'ne'],[/\b(north ?west|northwestern|upper left|top left)\b/,'nw'],
 [/\b(south ?east|southeastern|lower right|bottom right)\b/,'se'],[/\b(south ?west|southwestern|lower left|bottom left)\b/,'sw'],
 [/\b(north|northern|top|upper)\b/,'n'],[/\b(south|southern|bottom|lower)\b/,'s'],[/\b(east|eastern|right)\b/,'e'],[/\b(west|western|left)\b/,'w'],
 [/\b(center|centre|middle|central|heart of)\b/,'c']];
const TM_NUM={a:1,an:1,one:1,single:1,two:2,pair:2,couple:2,three:3,few:3,four:4,several:4,group:4,five:5,pack:5,band:5,six:6,many:6,seven:7,eight:8,swarm:8,nine:9,ten:10,horde:10,eleven:11,twelve:12,dozen:12};
const TM_ALIAS={dragon:'Young dragon',dragons:'Young dragon',spider:'Giant spider',spiders:'Giant spider',snake:'Giant snake',snakes:'Giant snake',bear:'Brown bear',bears:'Brown bear',
 giant:'Hill giant',giants:'Hill giant',eagle:'Giant eagle',scorpion:'Giant scorpion',octopus:'Giant octopus',crab:'Giant crab',crabs:'Giant crab',beetle:'Giant beetle',beetles:'Giant beetle',
 centipede:'Giant centipede',toad:'Giant toad',elemental:'Fire elemental',golem:'Stone golem',ooze:'Gray ooze',slime:'Gray ooze',slimes:'Gray ooze',soldier:'Guard',soldiers:'Guard',
 guards:'Guard',villager:'Commoner',villagers:'Commoner',townsfolk:'Commoner',peasants:'Commoner',farmers:'Commoner',wolves:'Wolf',undead:'Skeleton',zombies:'Zombie'};
let tmNames=null;
function tmNameList(){if(tmNames)return tmNames;const out=[];
  const add=(name,target)=>{const n=name.toLowerCase(),v=new Set([n,n+'s',n+'es',n.replace(/fe?$/,'ves'),n.replace(/y$/,'ies'),n.replace(/man$/,'men')]);for(const w of v)out.push([w,target]);};
  CREATURES.forEach(c=>add(c[0],c[0]));Object.entries(TM_ALIAS).forEach(([w,t])=>out.push([w,t]));
  out.sort((a,b)=>b[0].length-a[0].length);return tmNames=out;}
function tmCount(before){const w=before.trim().split(/\s+/).slice(-3);for(let i=w.length-1;i>=0;i--){const x=w[i].replace(/[^a-z0-9]/g,'');if(/^\d+$/.test(x))return Math.min(40,+x);if(TM_NUM[x])return TM_NUM[x];}return 1;}
function tmCreatures(cl){const found=[],used=[];
  for(const[w,target]of tmNameList()){const re=new RegExp('\\b'+w.replace(/[.*+?^${}()|[\]\\']/g,'\\$&')+'\\b','g');let m;
    while((m=re.exec(cl))){const a=m.index,b=a+w.length;if(used.some(([p,q])=>a<q&&b>p))continue;used.push([a,b]);
      if(/^\s*(camp|village|town|ship|cave|caves|lair|den|nest|fort|fortress|castle|temple|ruins|island|cove|bay|king|queen|lord|hunter)\b/.test(cl.slice(b)))continue;
      const before=cl.slice(0,a),mod=/\bapex\s*$/.test(before)?2:/\bfrenzied\s*$/.test(before)||/\binfected\s*$/.test(before)?1:0;
      let count=tmCount(before.replace(/\b(apex|frenzied|infected|giant|huge|small|large|angry|hungry|wild)\s*$/,''));if(w!==target.toLowerCase()&&w.endsWith('s')&&count===1&&!/\b(a|an|one)\s*$/.test(before))count=3;
      found.push({name:target,count,mod});}}
  return found;}
function tmSize(s){
  let m=s.match(/(\d[\d,]*)\s*(?:ft|feet|foot)?\s*(?:by|x|×)\s*(\d[\d,]*)\s*(ft|feet|foot|squares?)/);
  if(m){const a=+m[1].replace(/,/g,''),b=+m[2].replace(/,/g,'');if(/squ/.test(m[3]))return{w:a,h:b,scale:5};return fitScale(a,b);}
  m=s.match(/(\d+(?:\.\d+)?)\s*(?:mi|miles?)\b/);if(m){const ft=+m[1]*5280;return fitScale(ft,ft*.75);}
  m=s.match(/(\d[\d,]*)\s*(?:ft|feet|foot)\s*(?:wide|across|long|square)?/);if(m){const ft=+m[1].replace(/,/g,'');return fitScale(ft,ft*.8);}
  if(/\b(massive|enormous|gigantic|colossal|vast|sprawling)\b/.test(s))return{w:240,h:180,scale:5};
  if(/\b(huge|big|large)\b/.test(s))return{w:130,h:100,scale:5};if(/\b(tiny|small|little)\b/.test(s))return{w:40,h:32,scale:5};
  return{w:80,h:60,scale:5};}
function fitScale(wf,hf){for(const sc of[5,10,30,100,500,5280]){const w=Math.round(wf/sc),h=Math.round(hf/sc);if(w<=400&&h<=400)return{w:Math.max(10,w),h:Math.max(10,h),scale:sc};}return{w:400,h:300,scale:5280};}
function tmDir(cl){for(const[re,d]of TM_DIRS)if(re.test(cl))return d;return null;}
function tmRect(dir,size,band){const W=L.cols,H=L.rows,c={n:[.5,.18],s:[.5,.82],e:[.82,.5],w:[.18,.5],ne:[.8,.2],nw:[.2,.2],se:[.8,.8],sw:[.2,.8],c:[.5,.5]}[dir||'c'];
  let rw=W*.2*size,rh=H*.2*size;if(band&&(dir==='n'||dir==='s'))rw=W*.45;if(band&&(dir==='e'||dir==='w'))rh=H*.45;
  const ax=Math.max(0,Math.round(c[0]*W-rw)),ay=Math.max(0,Math.round(c[1]*H-rh)),bx=Math.min(W-1,Math.round(c[0]*W+rw)),by=Math.min(H-1,Math.round(c[1]*H+rh));return[ax,ay,bx,by];}
function tmWaterBand(side,s){const W=L.cols,H=L.rows;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const t=side==='e'?x/W:side==='w'?1-x/W:side==='s'?y/H:1-y/H,along=side==='e'||side==='w'?y:x;
    const edge=.62+(fbm(along*.06,4.4,s)-.5)*.16;if(t>edge+.12)setC(x,y,'deep',0);else if(t>edge+.03)setC(x,y,'shallow',0);else if(t>edge-.03)setC(x,y,h3(x,y,s)<.04?'palm':'sand',0);}}
function textToMap(text,asNew){
  const s=' '+text.toLowerCase().replace(/[’']/g,"'")+' ',seed=(Math.random()*1e6)|0,did=[];
  const clauses=s.split(/[.;\n]|,|\bwith\b|\band\b|\bwhile\b|\bnear\b|\bbeside\b/).map(c=>c.trim()).filter(Boolean);
  const feats=[];clauses.forEach((cl,ci)=>{const dir=tmDir(cl),size=/\b(huge|big|large|vast|massive|wide|great)\b/.test(cl)?1.5:/\b(small|little|tiny)\b/.test(cl)?.6:1;
    let gotB=false,gotBi=false;
    for(const[re,key,kind]of TM_FEATURES){if(!re.test(cl))continue;
      if(kind==='built'){if(gotB)continue;gotB=true;}else if(kind==='biome'||kind==='water'){if(gotBi&&key!=='island')continue;gotBi=true;}
      let k2=key;if(kind==='built'&&/\bruin/.test(cl)&&key!=='ruins')k2='ruins';
      const prev=feats.find(f=>(f.key===k2||f.orig===key)&&f.ref===undefined);
      if(prev&&!dir&&(kind==='built'||kind==='biome'||kind==='build')){feats.push({key:k2,kind,dir,size,cl,ci,ref:prev.ci});continue;}
      feats.push({key:k2,orig:key,kind,dir,size,cl,ci});}});
  feats.forEach(f=>{if(f.ref!==undefined)f.used=true;});
  const underground=/\b(underground|beneath|below ground|subterranean|cave|cavern|dungeon|crypt|catacomb)/.test(s);
  const sz=tmSize(s);
  if(asNew){const name=text.trim().replace(/\s+/g,' ').slice(0,48);newLv(name.charAt(0).toUpperCase()+name.slice(1),sz.w,sz.h,{scale:sz.scale});}
  else{pushUndo();}
  const W=L.cols,H=L.rows;
  delete L.time;L.lit=!underground&&!/\b(night|dark|darkness|midnight|moonlit|gloom)/.test(s);L.sky=!underground;L.mood=/\b(night|midnight|moonlit)\b/.test(s)?'night':/\b(dusk|twilight|sunset|evening)\b/.test(s)?'dusk':'auto';
  const wx=[[/\bthunder|storm/,'storm'],[/\brain/,'rain'],[/\bsnow|blizzard/,'snow'],[/\bfog|mist/,'fog'],[/\bember|volcan|ash/,'embers'],[/\bfirefl/,'fireflies'],[/\bspore/,'spores'],[/\bunderwater|bubbl/,'bubbles'],[/\bsunbeam|sunlit|sunny/,'sunbeams'],[/\bheartbeat|beating heart|living dungeon/,'heartbeat']].find(([re])=>re.test(s));
  L.weather=wx?wx[1]:'none';
  // 1. base: the first undirected biome or built place, else a sensible default
  const hasCoast=feats.some(f=>f.key==='coast');
  const baseF=feats.find(f=>(f.kind==='biome'||f.kind==='water')&&!f.dir&&!f.used&&f.key!=='island'&&f.key!=='coast'&&!(hasCoast&&f.key==='sea'))||null;
  let baseKey=baseF?baseF.key:underground?'caves':'grassland';if(baseKey==='lake'&&!underground)baseKey='grassland';
  if(baseF&&baseF.key==='sea'&&hasCoast)baseKey='grassland';
  if(baseKey==='caves'&&/\bcavern\b/.test(s)&&!/\b(tunnels|cave system)\b/.test(s)){L.cells.fill(0);L.elev.fill(0);fillCells(caveCells(1,1,W-2,H-2,seed),ID.floor);for(let i=0;i<L.cells.length;i++)if(L.cells[i]===ID.floor){const h=h3(i%W,(i/W)|0,seed);if(h<.06)L.cells[i]=ID.rubble;else if(h>.985)L.cells[i]=ID.stalag;}did.push('a vast cavern');}
  else if(baseKey==='sea'){for(let y=0;y<H;y++)for(let x=0;x<W;x++)setC(x,y,'deep',0);did.push('open sea');}
  else{L.cells.fill(0);L.elev.fill(0);const G=GENS[baseKey]||GENS.grassland;if(G.full)G.run(0,0,W-1,H-1,seed);else{G.run(1,1,W-2,H-2,seed);}did.push(G.n.toLowerCase()+' across the map');}
  if(baseF)baseF.used=true;
  const regions={};
  // 2. coastlines and water
  for(const f of feats.filter(f=>f.ref===undefined&&f.kind==='water'&&!f.used)){f.used=true;
    if(f.key==='sea'&&!f.dir&&hasCoast)continue;
    if(f.key==='coast'||(f.key==='sea'&&f.dir)){const side=f.dir&&'nsew'.includes(f.dir)?f.dir:'e';tmWaterBand(side,seed+3);regions[f.ci]=tmRect(side,1,true);did.push(`coastline and sea to the ${({n:'north',s:'south',e:'east',w:'west'})[side]}`);}
    else if(f.key==='island'){const r=tmRect(f.dir||'c',f.size*.9);if(baseKey!=='sea')for(let y=0;y<H;y++)for(let x=0;x<W;x++)setC(x,y,'deep',0);
      const cx=(r[0]+r[2])/2,cy=(r[1]+r[3])/2,rx=(r[2]-r[0])/2,ry=(r[3]-r[1])/2;
      for(let y=r[1]-4;y<=r[3]+4;y++)for(let x=r[0]-4;x<=r[2]+4;x++){if(!inb(x,y))continue;const d=((x-cx)/rx)**2+((y-cy)/ry)**2+(fbm(x*.12,y*.12,seed)-.5)*.5;
        if(d<.55)setC(x,y,h3(x,y,seed)<.25?'tree':h3(x,y,seed)<.3?'palm':'grass',d<.3?1:0);else if(d<.8)setC(x,y,'sand',0);else if(d<1.1)setC(x,y,'shallow',0);}
      regions[f.ci]=r;did.push('an island');}}
  // 3. regional biomes
  for(const f of feats.filter(f=>f.ref===undefined&&f.kind==='biome'&&!f.used)){f.used=true;const r=tmRect(f.dir||'c',f.size),G=GENS[f.key];if(!G)continue;G.run(r[0],r[1],r[2],r[3],seed+f.ci*7);regions[f.ci]=r;did.push(`${G.n.toLowerCase()} in the ${dirName(f.dir)}`);}
  // 4. rivers, then roads (roads bridge rivers), then walls
  for(const f of feats.filter(f=>f.ref===undefined&&f.kind==='line')){f.used=true;const vert=/\b(north|south)\b.*\b(to|toward|towards|into)\b|\bfrom (the )?(north|south)|runs? (north|south)|\bnorth[- ]south\b/.test(f.cl)||(!/\b(east|west)\b/.test(f.cl)&&W<H);
    if(f.key==='river'){meander(0,0,W-1,H-1,seed+11,vert,Math.max(2,Math.round(Math.min(W,H)/25*f.size)),(x,y)=>setC(x,y,'shallow',Math.max(0,Eat(x,y)-1)));
      meander(0,0,W-1,H-1,seed+11,vert,1,(x,y)=>setC(x,y,'deep',null));did.push('a river');}
    else if(f.key==='road'){meander(0,0,W-1,H-1,seed+23,!vert,Math.min(W,H)>60?2:1,(x,y)=>{const k=getK(x,y);setC(x,y,k==='shallow'||k==='deep'?'bridge':T[get(x,y)].b?'road':'road',null);});did.push('a road');}
    else if(f.key==='cwall'){const r=tmRect(f.dir||'c',f.size);ringR(r[0],r[1],r[2],r[3],'battlement',2);did.push('a wall');}}
  // 5. built places
  for(const f of feats.filter(f=>f.ref===undefined&&f.kind==='built')){f.used=true;const big=f.key==='castle'?1.35:1,r=tmRect(f.dir||'c',f.size*big);GENS[f.key].run(r[0],r[1],r[2],r[3],seed+f.ci*13);regions[f.ci]=r;did.push(`${GENS[f.key].n.toLowerCase()} in the ${dirName(f.dir)}`);}
  // 6. single structures
  for(const f of feats.filter(f=>f.ref===undefined&&f.kind==='build')){const r=tmRect(f.dir||'c',.5*f.size),cx=Math.round((r[0]+r[2])/2),cy=Math.round((r[1]+r[3])/2);let b;
    if(f.key==='crater'){for(const[x,y,d]of discCells(cx,cy,Math.max(3,Math.min(W,H)*.08*f.size)))if(inb(x,y))setC(x,y,d<1.5?'portal':h3(x,y,seed)<.1?'crystal':'obsidian',0);did.push('a crater');regions[f.ci]=r;continue;}
    const S={rtower:[3,3],house:[4,3],hut:[2,2],camp:[6,6],ship:[12,4],bridge:[0,0],hill:[10,8],plateau:[12,9]}[f.key]||[4,4],sw=Math.round(S[0]*(f.key==='hill'||f.key==='plateau'?f.size*Math.max(1,W/60):f.size)),sh=Math.round(S[1]*(f.key==='hill'||f.key==='plateau'?f.size*Math.max(1,H/45):f.size));
    if(f.key==='bridge'){let best=null;for(let y=0;y<H&&!best;y++)for(let x=0;x<W;x++)if(getK(x,y)==='shallow'&&Math.abs(x-cx)+Math.abs(y-cy)<W){best=[x,y];break;}if(best)for(let k=-3;k<=3;k++)setC(best[0]+k,best[1],'bridge',null);did.push('a bridge');continue;}
    if(f.key==='ship'){let best=null,bd=1e9;for(let y=0;y<H;y+=2)for(let x=0;x<W;x+=2)if(getK(x,y)==='deep'){const d=(x-cx)**2+(y-cy)**2;if(d<bd){bd=d;best=[x,y];}}if(best){doBuild('ship',best[0]-6,best[1]-2,best[0]+5,best[1]+1,seed);did.push('a ship');}continue;}
    doBuild(f.key,Math.max(0,cx-sw),Math.max(0,cy-sh),Math.min(W-1,cx+sw),Math.min(H-1,cy+sh),seed+f.ci);regions[f.ci]=[cx-sw,cy-sh,cx+sw,cy+sh];did.push(BUILDS[f.key][0].toLowerCase());}
  // 7. creatures and the party, placed in their clause's region
  feats.forEach(f=>{if(f.ref!==undefined&&regions[f.ref]&&!regions[f.ci])regions[f.ci]=regions[f.ref];});
  clauses.forEach((cl,ci)=>{const dir=tmDir(cl),r=regions[ci]||tmRect(dir||'c',.6),cx=(r[0]+r[2])/2,cy=(r[1]+r[3])/2;
    const pm=cl.match(/\b(party|heroes|adventurers|players|pcs)\b/);
    if(pm){const nm=cl.match(/\b(?:party|group|band) of (\w+)|(\w+) (?:heroes|adventurers|players|pcs)\b/),nw=nm?(nm[1]||nm[2]):'',nv=/^\d+$/.test(nw)?+nw:TM_NUM[nw]||0,n=Math.min(8,nv>1?nv:4),cls=['Fighter','Wizard','Rogue','Cleric','Ranger','Paladin','Bard','Druid'];
      const pr=regions[ci]?[cx,cy]:dir?[cx,cy]:[W/2,H*.85];
      for(let k=0;k<n;k++){const h=HEROES.find(x=>x[0]===cls[k]),p=freeSpot(L,1,pr[0],pr[1]);L.tokens.push(mk('hero',cls[k],p.x,p.y,{icon:h[1],color:COLORS[k%COLORS.length],vision:60}));}did.push(`a party of ${n}`);}
    for(const c of tmCreatures(cl)){const def=CREATURES.find(x=>x[0]===c.name);if(!def)continue;const names=namesFor((c.mod===2?'Apex ':c.mod===1?'Frenzied ':'')+c.name,c.count);
      for(const nm of names){const size=def[2],p=freeSpot(L,SZ({size}),cx,cy);
        L.tokens.push(mk('creature',nm,p.x,p.y,Object.assign({size,icon:def[1],color:CATS[def[3]]||'#a0473a',cat:def[3],vision:60},PRESET_FX[c.name]||{},c.mod===2?AX:c.mod===1?FZ:{})));}
      did.push(`${c.count} × ${c.mod===2?'Apex ':c.mod===1?'Frenzied ':''}${c.name}`);}});
  // 8. names on the map
  feats.filter(f=>f.ref===undefined&&regions[f.ci]&&(f.kind==='built'||f.kind==='biome')).forEach(f=>{const r=regions[f.ci];L.labels.push({id:D.nextId++,x:(r[0]+r[2])/2,y:Math.max(1.2,r[1]+1),text:(GENS[f.key]||{n:f.key}).n,show:true});});
  if(asNew){fillLevels();switchLevel(D.levels.indexOf(L));}else{invalidate();fitView();save();}
  changed();return did;
}
function dirName(d){return({n:'north',s:'south',e:'east',w:'west',ne:'northeast',nw:'northwest',se:'southeast',sw:'southwest',c:'middle'})[d||'c'];}

/* ================= character sheets (with gestalt) ================= */
const ABIL=[['str','Strength'],['dex','Dexterity'],['con','Constitution'],['int','Intelligence'],['wis','Wisdom'],['cha','Charisma']];
const SKILLS=[['Acrobatics','dex'],['Animal Handling','wis'],['Arcana','int'],['Athletics','str'],['Deception','cha'],['History','int'],['Insight','wis'],['Intimidation','cha'],['Investigation','int'],
  ['Medicine','wis'],['Nature','int'],['Perception','wis'],['Performance','cha'],['Persuasion','cha'],['Religion','int'],['Sleight of Hand','dex'],['Stealth','dex'],['Survival','wis']];
const CLASSES={Artificer:[8,['con','int'],'int'],Barbarian:[12,['str','con'],''],Bard:[8,['dex','cha'],'cha'],'Blood Hunter':[10,['dex','int'],'int'],Cleric:[8,['wis','cha'],'wis'],
  Druid:[8,['int','wis'],'wis'],Fighter:[10,['str','con'],''],Monk:[8,['str','dex'],'wis'],Paladin:[10,['wis','cha'],'cha'],Ranger:[10,['str','dex'],'wis'],Rogue:[8,['dex','int'],''],
  Sorcerer:[6,['con','cha'],'cha'],Warlock:[8,['wis','cha'],'cha'],Wizard:[6,['int','wis'],'int']};
function newSheet(t){return{player:'',race:'',background:'',alignment:'',level:1,xp:'',gestalt:true,a:{cls:CLASSES[t.name]?t.name:'',sub:''},b:{cls:'',sub:''},
  abil:{str:10,dex:10,con:10,int:10,wis:10,cha:10},saveOv:{},skills:{},ac:10,speed:30,temp:0,hdUsed:0,death:{s:0,f:0},inspiration:false,
  attacks:[{n:'',b:'',d:''}],slots:Array.from({length:9},()=>[0,0]),spells:'',featA:'',featB:'',inv:'',notes:'',trackers:[{n:'Frenzy charges',c:0,m:3},{n:'Infected',c:0,m:1}]};}
const md=v=>Math.floor((+v-10)/2),sgn=v=>(v>=0?'+':'')+v,profOf=l=>2+Math.floor((Math.max(1,Math.min(20,+l||1))-1)/4);
let csTok=null,csTab='main';
function sheetOf(t){if(!t.sheet)t.sheet=newSheet(t);return t.sheet;}
function classSaves(sh){const s=new Set();for(const side of sh.gestalt?['a','b']:['a']){const c=CLASSES[sh[side].cls];if(c)c[1].forEach(x=>s.add(x));}return s;}
function hitDie(sh){let d=0;for(const side of sh.gestalt?['a','b']:['a']){const c=CLASSES[sh[side].cls];if(c)d=Math.max(d,c[0]);}return d||8;}
function openSheetFor(t){csTok=t;sheetOf(t);csTab='main';renderSheet();openSheet(document.getElementById('csSheet'));}
function esc(v){return String(v==null?'':v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);}
function renderSheet(){const t=csTok;if(!t)return;const sh=sheetOf(t),P=profOf(sh.level),saves=classSaves(sh),hd=hitDie(sh),box=document.getElementById('csBody');
  document.getElementById('csTitle').textContent=t.name+' · character sheet';
  document.querySelectorAll('#csTabs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t===csTab)));
  const inp=(k,v,o)=>`<input ${o&&o.num?'type="number"':'type="text"'} data-k="${k}" value="${esc(v)}" ${o&&o.w?`style="width:${o.w}"`:''} ${o&&o.ph?`placeholder="${esc(o.ph)}"`:''}>`;
  const clsOpts=v=>`<option value="">Choose…</option>`+Object.keys(CLASSES).map(c=>`<option ${c===v?'selected':''}>${c}</option>`).join('')+(v&&!CLASSES[v]?`<option selected>${esc(v)}</option>`:'')+'<option value="__custom">Other class…</option>';
  let h='';
  if(csTab==='main'){
    const castA=CLASSES[sh.a.cls]&&CLASSES[sh.a.cls][2],castB=sh.gestalt&&CLASSES[sh.b.cls]&&CLASSES[sh.b.cls][2];
    h+=`<div class="pair"><div class="field"><label>Player</label>${inp('player',sh.player)}</div><div class="field"><label>Level</label>${inp('level',sh.level,{num:1})}</div></div>
    <div class="pair"><div class="field"><label>Race / species</label>${inp('race',sh.race)}</div><div class="field"><label>Background</label>${inp('background',sh.background)}</div></div>
    <div class="pair"><div class="field"><label>Alignment</label>${inp('alignment',sh.alignment)}</div><div class="field"><label>Experience</label>${inp('xp',sh.xp)}</div></div>
    <label class="check"><input type="checkbox" data-k="gestalt" ${sh.gestalt?'checked':''}> Gestalt character (two classes at once)</label>
    <div class="cs-gest">
      <div class="cs-side"><h3>${sh.gestalt?'Side A':'Class'}</h3><div class="field"><label>Class</label><select data-k="a.cls">${clsOpts(sh.a.cls)}</select></div>${sh.a.cls&&!CLASSES[sh.a.cls]?`<div class="field"><label>Class name</label>${inp('a.cls',sh.a.cls)}</div>`:''}<div class="field"><label>Subclass</label>${inp('a.sub',sh.a.sub)}</div></div>
      ${sh.gestalt?`<div class="cs-side"><h3>Side B</h3><div class="field"><label>Class</label><select data-k="b.cls">${clsOpts(sh.b.cls)}</select></div>${sh.b.cls&&!CLASSES[sh.b.cls]?`<div class="field"><label>Class name</label>${inp('b.cls',sh.b.cls)}</div>`:''}<div class="field"><label>Subclass</label>${inp('b.sub',sh.b.sub)}</div></div>`:''}
    </div>
    <p class="note">${sh.gestalt?'Gestalt: both classes level up together at every level. Hit die is the larger of the two, and saving throws from both classes are proficient. Proficiency bonus follows character level.':'Turn on Gestalt to give this character a second class that levels alongside the first.'}</p>
    <div class="cs-stats"><div><b>${sgn(P)}</b><span>Proficiency</span></div><div><b>d${hd}</b><span>Hit die</span></div><div><b>${sgn(md(sh.abil.dex))}</b><span>Initiative</span></div>
      <div><b>${10+md(sh.abil.wis)+((sh.skills.Perception||0)*P)}</b><span>Passive Perception</span></div>
      ${castA?`<div><b>${8+P+md(sh.abil[castA])}</b><span>Spell DC (${esc(sh.a.cls)})</span></div>`:''}${castB&&castB!==castA?`<div><b>${8+P+md(sh.abil[castB])}</b><span>Spell DC (${esc(sh.b.cls)})</span></div>`:''}</div>`;}
  if(csTab==='stats'){
    h+=`<div class="cs-abil">${ABIL.map(([k,n])=>`<div><span>${n}</span>${inp('abil.'+k,sh.abil[k],{num:1})}<b>${sgn(md(sh.abil[k]))}</b></div>`).join('')}</div>
    <h3>Saving throws</h3><div class="cs-list">${ABIL.map(([k,n])=>{const on=sh.saveOv[k]!=null?sh.saveOv[k]:saves.has(k);return`<label class="check"><input type="checkbox" data-save="${k}" ${on?'checked':''}> <b>${sgn(md(sh.abil[k])+(on?P:0))}</b> ${n}${saves.has(k)?' <small>(class)</small>':''}</label>`;}).join('')}</div>
    <h3>Skills</h3><p class="note">Tap a skill to cycle: not proficient, proficient, expertise.</p><div class="cs-list">${SKILLS.map(([n,a])=>{const v=sh.skills[n]||0;return`<button class="cs-skill" data-skill="${esc(n)}" aria-pressed="${v>0}"><b>${sgn(md(sh.abil[a])+v*P)}</b> ${n} <small>${a.toUpperCase()}${v===2?' · expertise':''}</small></button>`;}).join('')}</div>`;}
  if(csTab==='combat'){
    h+=`<div class="pair"><div class="field"><label>Armor class</label>${inp('ac',sh.ac,{num:1})}</div><div class="field"><label>Speed (ft)</label>${inp('speed',sh.speed,{num:1})}</div></div>
    <div class="pair"><div class="field"><label>Hit points</label>${inp('hp',t.hp,{num:1})}</div><div class="field"><label>Max HP</label>${inp('hpMax',t.hpMax,{num:1})}</div><div class="field"><label>Temp HP</label>${inp('temp',sh.temp,{num:1})}</div></div>
    <button class="btn" id="csCalcHp" style="white-space:normal">Work out max HP from level, Con and hit die (d${hd})</button>
    <div class="pair"><div class="field"><label>Hit dice used (of ${sh.level})</label>${inp('hdUsed',sh.hdUsed,{num:1})}</div>
      <div class="field"><label>Death saves</label><div class="row"><span>✓</span>${[0,1,2].map(i=>`<input type="checkbox" data-death="s${i}" ${sh.death.s>i?'checked':''}>`).join('')}<span>✗</span>${[0,1,2].map(i=>`<input type="checkbox" data-death="f${i}" ${sh.death.f>i?'checked':''}>`).join('')}</div></div></div>
    <label class="check"><input type="checkbox" data-k="inspiration" ${sh.inspiration?'checked':''}> Inspiration</label>
    <h3>Attacks</h3>${sh.attacks.map((a,i)=>`<div class="row cs-atk">${inp(`attacks.${i}.n`,a.n,{ph:'Weapon or spell'})}${inp(`attacks.${i}.b`,a.b,{ph:'+7',w:'64px'})}${inp(`attacks.${i}.d`,a.d,{ph:'1d8+4 slashing'})}<button class="btn sq" data-delatk="${i}" aria-label="Remove attack">×</button></div>`).join('')}
    <button class="btn" id="csAddAtk">Add an attack</button>
    <h3>Trackers</h3><p class="note">Count anything: frenzy charges, rage, ki, superiority dice.</p>${sh.trackers.map((r,i)=>`<div class="row cs-trk">${inp(`trackers.${i}.n`,r.n)}<button class="btn sq" data-trk="${i}:-1">−</button><b>${r.c} / </b>${inp(`trackers.${i}.m`,r.m,{num:1,w:'56px'})}<button class="btn sq" data-trk="${i}:1">+</button><button class="btn sq" data-deltrk="${i}" aria-label="Remove tracker">×</button></div>`).join('')}
    <button class="btn" id="csAddTrk">Add a tracker</button>`;}
  if(csTab==='spells'){
    h+=`<h3>Spell slots</h3><div class="cs-slots">${sh.slots.map(([c,m],i)=>`<div><span>Level ${i+1}</span><div class="row"><button class="btn sq" data-slot="${i}:-1">−</button><b>${c}/${m}</b><button class="btn sq" data-slot="${i}:1">+</button></div><label class="note">Max ${inp(`slots.${i}.1`,m,{num:1,w:'52px'})}</label></div>`).join('')}</div>
    <button class="btn" id="csRest" style="white-space:normal">Long rest: refill slots, HP and hit dice, clear trackers</button>
    <div class="field"><label>Spells known or prepared</label><textarea data-k="spells" rows="6">${esc(sh.spells)}</textarea></div>`;}
  if(csTab==='notes'){
    h+=`<div class="field"><label>Features: ${esc(sh.a.cls||'Side A')}${sh.a.sub?' ('+esc(sh.a.sub)+')':''}</label><textarea data-k="featA" rows="5">${esc(sh.featA)}</textarea></div>
    ${sh.gestalt?`<div class="field"><label>Features: ${esc(sh.b.cls||'Side B')}${sh.b.sub?' ('+esc(sh.b.sub)+')':''}</label><textarea data-k="featB" rows="5">${esc(sh.featB)}</textarea></div>`:''}
    <div class="field"><label>Equipment and treasure</label><textarea data-k="inv" rows="5">${esc(sh.inv)}</textarea></div>
    <div class="field"><label>Notes, backstory, bonds</label><textarea data-k="notes" rows="5">${esc(sh.notes)}</textarea></div>`;}
  box.innerHTML=h;}
function setPath(obj,path,v){const ks=path.split('.');let o=obj;for(let i=0;i<ks.length-1;i++)o=o[ks[i]];o[ks[ks.length-1]]=v;}
function csChanged(rerender){save();draw();if(rerender)renderSheet();}
(function wireSheet(){
  const body=document.getElementById('csBody');
  body.addEventListener('change',e=>{const el=e.target,t=csTok;if(!t)return;const sh=sheetOf(t);
    if(el.dataset.save){sh.saveOv[el.dataset.save]=el.checked;return csChanged(true);}
    if(el.dataset.death){const k=el.dataset.death[0],n=body.querySelectorAll(`[data-death^="${k}"]:checked`).length;sh.death[k]=n;return csChanged(false);}
    const k=el.dataset.k;if(!k)return;let v=el.type==='checkbox'?el.checked:el.value;
    if(k==='hp'||k==='hpMax'){t[k]=Math.max(0,+v||0);if(k==='hpMax'&&t.hp>t.hpMax)t.hp=t.hpMax;return csChanged(true);}
    if(el.type==='number')v=+v||0;
    if((k==='a.cls'||k==='b.cls')&&v==='__custom')v='Custom class';
    setPath(sh,k,v);if(/^slots\.\d+\.1$/.test(k)){const i=+k.split('.')[1];sh.slots[i][0]=Math.min(sh.slots[i][0],v);}
    csChanged(/^(gestalt|level|abil\.|a\.cls|b\.cls|slots|trackers\.\d+\.m)/.test(k));});
  body.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!csTok)return;const sh=sheetOf(csTok),t=csTok;
    if(b.dataset.skill){const n=b.dataset.skill;sh.skills[n]=((sh.skills[n]||0)+1)%3;return csChanged(true);}
    if(b.dataset.slot){const[i,d]=b.dataset.slot.split(':').map(Number);const s=sh.slots[i];s[0]=Math.max(0,Math.min(s[1],s[0]+d));return csChanged(true);}
    if(b.dataset.trk){const[i,d]=b.dataset.trk.split(':').map(Number);const r=sh.trackers[i];r.c=Math.max(0,Math.min(+r.m||99,r.c+d));return csChanged(true);}
    if(b.dataset.delatk){sh.attacks.splice(+b.dataset.delatk,1);return csChanged(true);}
    if(b.dataset.deltrk){sh.trackers.splice(+b.dataset.deltrk,1);return csChanged(true);}
    if(b.id==='csAddAtk'){sh.attacks.push({n:'',b:'',d:''});return csChanged(true);}
    if(b.id==='csAddTrk'){sh.trackers.push({n:'New tracker',c:0,m:3});return csChanged(true);}
    if(b.id==='csCalcHp'){const hd=hitDie(sh),con=md(sh.abil.con),lv=Math.max(1,+sh.level||1);t.hpMax=Math.max(1,hd+con+(lv-1)*(hd/2+1+con));t.hp=t.hpMax;toast(`Max HP set to ${t.hpMax} (d${hd}, level ${lv}).`);return csChanged(true);}
    if(b.id==='csRest'){sh.slots.forEach(s=>s[0]=s[1]);t.hp=t.hpMax;sh.temp=0;sh.hdUsed=Math.max(0,sh.hdUsed-Math.max(1,Math.floor((+sh.level||1)/2)));sh.death={s:0,f:0};sh.trackers.forEach(r=>{if(/frenzy|infect/i.test(r.n))r.c=0;});toast('Long rest taken.');return csChanged(true);}
  });
  document.querySelectorAll('#csTabs button').forEach(b=>b.addEventListener('click',()=>{csTab=b.dataset.t;renderSheet();}));
  document.getElementById('csDone').addEventListener('click',closeSheets);
})();
function renderParty(){const box=document.getElementById('partyList');box.innerHTML='';let n=0;
  D.levels.forEach((lv,li)=>lv.tokens.filter(t=>t.kind==='hero').forEach(t=>{n++;const sh=t.sheet,cls=sh?[sh.a.cls,sh.gestalt?sh.b.cls:''].filter(Boolean).join(' / '):'';
    const b=document.createElement('button');b.className='party-row';b.innerHTML=`<b>${esc(t.name)}</b><span>${sh&&sh.player?esc(sh.player)+' · ':''}${cls?esc(cls)+' · ':''}Level ${sh?sh.level:1}</span><span>${t.hpMax?`HP ${t.hp}/${t.hpMax}`:'No HP set'} · ${esc(lv.name)}</span>`;
    b.addEventListener('click',()=>{if(li!==D.cur)switchLevel(li);selId=t.id;openSheetFor(t);});box.appendChild(b);}));
  if(!n)box.innerHTML='<p class="note">No heroes yet. Add them with + Heroes, then come back here to fill in their sheets.</p>';}

document.getElementById('partyBtn').addEventListener('click',()=>{renderParty();openSheet(document.getElementById('partySheet'));});
document.getElementById('partyDone').addEventListener('click',closeSheets);
document.getElementById('tokSheetBtn').addEventListener('click',()=>{const t=cur();if(t)openSheetFor(t);});
/* ================= table display ================= */
let tableMode=false,bc=null,lastViewSent=0;
try{bc=new BroadcastChannel('dungeon-maker-live');}catch(e){}
function liveSend(m){if(bc&&!tableMode)try{bc.postMessage(m);}catch(e){}}
function liveTokens(){liveSend({k:'tok',lvl:L.id,toks:L.tokens.map(t=>[t.id,t.x,t.y,t.alt||0])});}
function liveView(force){if(tableMode||prefs.follow===false)return;const now=performance.now();if(!force&&now-lastViewSent<120)return;lastViewSent=now;
  const W=cv.clientWidth,H=cv.clientHeight;liveSend({k:'view',lvl:L.id,cx:(view.x+W/2)/view.cs,cy:(view.y+H/2)/view.cs,cells:W/view.cs});}
function markSynced(){try{localStorage.setItem('dungeon-maker-sync',String(Date.now()));}catch(e){}}
function enterTable(){tableMode=true;document.body.classList.add('table');closeSheets();mode='party';ovStamp++;prefs.fx=prefs.fx!==false;
  document.querySelectorAll('#viewSeg button').forEach(o=>o.setAttribute('aria-pressed',String(o.dataset.view==='party')));setTool('move',true);
  requestAnimationFrame(()=>{resizeCanvas();startView();});toast('Table display. This screen now follows the DM.',4000);}
function exitTable(){tableMode=false;document.body.classList.remove('table');requestAnimationFrame(resizeCanvas);reloadAll();}
async function reloadAll(){const keep=L&&L.id;let ok=false;try{ok=await loadAll();}catch(e){}if(!ok)return;
  if(tableMode){mode='party';}else if(keep){const i=D.levels.findIndex(l=>l.id===keep);if(i>=0){D.cur=i;L=D.levels[i];}}
  selId=null;invalidate();fillLevels();draw();}
if(bc)bc.onmessage=e=>{if(!tableMode||!L)return;const m=e.data||{};
  if(m.k==='tok'&&m.lvl===L.id){const map=new Map(m.toks.map(a=>[a[0],a]));let ch=false;for(const t of L.tokens){const a=map.get(t.id);if(a&&(t.x!==a[1]||t.y!==a[2]||(t.alt||0)!==(a[3]||0))){t.x=a[1];t.y=a[2];t.alt=a[3]||0;ch=true;}}if(ch){invalidate();draw();}}
  else if(m.k==='view'&&m.lvl===L.id){const W=cv.clientWidth,H=cv.clientHeight,cs=Math.max(MINCS,Math.min(MAXCS,W/m.cells));view.cs=cs;view.x=m.cx*cs-W/2;view.y=m.cy*cs-H/2;draw();}
  else if(m.k==='level'){const i=D.levels.findIndex(l=>l.id===m.id);if(i>=0&&i!==D.cur){D.cur=i;L=D.levels[i];invalidate();fillLevels();startView();}}};
window.addEventListener('storage',e=>{if(e.key==='dungeon-maker-sync'&&tableMode)reloadAll();});
document.getElementById('tableBtn').addEventListener('click',enterTable);
let tmWhere='new';
const TM_EX=['A misty forest at night with a ruined castle in the middle, a river running north to south and 6 goblins in the castle',
 'A desert oasis with a temple to the east, a camp in the south and a party of 5 heroes',
 'A coast with a fishing village to the west, a shipwreck in the sea and 10 frenzied Ludroth',
 'A huge underground cavern with a lava lake in the north, crystal caves to the east and an apex Brachydios',
 'A snowy mountain pass with a tower on a cliff to the north and a pack of wolves'];
TM_EX.forEach(e=>{const b=document.createElement('button');b.className='chip plain';b.textContent=e.length>42?e.slice(0,40)+'…':e;b.title=e;b.addEventListener('click',()=>{document.getElementById('tmText').value=e;});document.getElementById('tmExamples').appendChild(b);});
document.querySelectorAll('#tmWhere button').forEach(b=>b.addEventListener('click',()=>{tmWhere=b.dataset.v;document.querySelectorAll('#tmWhere button').forEach(o=>o.setAttribute('aria-pressed',String(o===b)));}));
const openTm=()=>{openSheet(document.getElementById('tmSheet'));document.getElementById('tmText').focus();};
document.getElementById('tmBtn').addEventListener('click',openTm);document.getElementById('tmBtn2').addEventListener('click',openTm);
document.getElementById('tmClose').addEventListener('click',closeSheets);
document.getElementById('tmGo').addEventListener('click',()=>{const txt=document.getElementById('tmText').value.trim();if(!txt){toast('Type a description first, or tap an example.');return;}
  try{const did=textToMap(txt,tmWhere==='new');closeSheets();toast('Made: '+did.join(', ')+'.',8000);}catch(e){toast('That description couldn’t be built. Try simpler wording.');console.error(e);}});
document.getElementById('mkBtn').addEventListener('click',()=>{closeSheets();addMordenheimMaps();});
document.getElementById('cometBtn').addEventListener('click',()=>{closeSheets();addCometCampaign();});
document.getElementById('exitTable').addEventListener('click',exitTable);

/* ================= start ================= */
(async()=>{
  let ok=false;try{ok=await loadAll();}catch(e){}
  if(!ok)buildExample();
  fillLevels();
  new ResizeObserver(resizeCanvas).observe(stage);
  dpr=window.devicePixelRatio||1;cv.width=Math.max(1,cv.clientWidth*dpr);cv.height=Math.max(1,cv.clientHeight*dpr);
  setTerrain(ID.floor);setTool('move',true);updUndo();startView();
  if(location.hash==='#table')enterTable();
  else if(!prefs.seenFx){prefs.seenFx=true;prefs.seen3d=true;toast('New: animated water, firelight, weather and moving creatures. Find them in Settings.',7000);save();}
  else if(!prefs.seen3d){prefs.seen3d=true;toast('Now in 3D: walls stand tall and minis stand on bases. Levels can be miles across. Set the square size in Settings.',7000);save();}
  if(!tableMode&&!prefs.cometAdded){prefs.cometAdded=true;prefs.mkAdded=true;setTimeout(async()=>{await addCometCampaign();await addMordenheimMaps();},900);}
  else if(!tableMode&&!prefs.mkAdded){prefs.mkAdded=true;save();setTimeout(addMordenheimMaps,900);}
  if(!prefs.seenModels){prefs.seenModels=true;prefs.miniStyle='model';prefs.mini3d=true;save();}
  if(document.fonts)document.fonts.ready.then(draw);
})();
})();

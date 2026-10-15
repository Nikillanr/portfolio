import { writeFile } from 'node:fs/promises';
const out = new URL('../dist/assets/', import.meta.url);
const text=(x,y,value,size=12,fill='#c5d8c4')=>`<text x="${x}" y="${y}" fill="${fill}" font-family="monospace" font-size="${size}" letter-spacing="2">${value}</text>`;
const line=(x1,y1,x2,y2,color='#b9d6a6',opacity=.5)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" opacity="${opacity}"/>`;
function wrap(body,accent,label,background='#1c3029'){
 let grid='';for(let x=0;x<1600;x+=50)grid+=line(x,0,x,1000,accent,.055);for(let y=0;y<1000;y+=50)grid+=line(0,y,1600,y,accent,.055);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000"><defs><radialGradient id="bg"><stop stop-color="${background}"/><stop offset="1" stop-color="#0c1514"/></radialGradient><linearGradient id="metal" x2=".6" y2="1"><stop stop-color="#e0e2cc"/><stop offset=".5" stop-color="#7e9b8a"/><stop offset="1" stop-color="#263e37"/></linearGradient></defs><rect width="1600" height="1000" fill="url(#bg)"/>${grid}<circle cx="900" cy="430" r="310" fill="none" stroke="${accent}" opacity=".1"/><circle cx="900" cy="430" r="270" fill="none" stroke="${accent}" opacity=".08"/>${body}${text(65,930,label,12,accent)}${text(1180,930,'CONCEPT ILLUSTRATION',10,accent)}</svg>`;
}
let robot='<ellipse cx="890" cy="760" rx="350" ry="65" fill="#000" opacity=".28"/>';
for(const[x,y,dir,dim]of [[680,425,-1,true],[1030,405,1,true],[730,500,-1,false],[1120,475,1,false]]){
 const kx=x+dir*65,ky=y+140,fx=kx-dir*65,fy=ky+165;
 robot+=`<g opacity="${dim?.5:1}"><path d="M${x},${y} L${kx},${ky} L${fx},${fy}" fill="none" stroke="#152a24" stroke-width="50" stroke-linecap="round"/><path d="M${x},${y} L${kx},${ky} L${fx},${fy}" fill="none" stroke="url(#metal)" stroke-width="32" stroke-linecap="round"/><path d="M${x+10},${y} L${kx+10},${ky} L${fx+10},${fy}" fill="none" stroke="#d9edc5" stroke-width="2" opacity=".6"/><circle cx="${kx}" cy="${ky}" r="23" fill="#263e35" stroke="#b4c9a5" stroke-width="3"/><circle cx="${kx}" cy="${ky}" r="8" fill="#c6e7b7"/><ellipse cx="${fx}" cy="${fy+8}" rx="28" ry="13" fill="#11231d" stroke="#75967a"/></g>`;
}
robot+=`<path d="M610 405 L940 332 L1190 405 L855 493Z" fill="url(#metal)" stroke="#b9ccb1" stroke-width="2"/><path d="M610 405 L855 493 L855 559 L610 468Z" fill="#3c5545" stroke="#839c7d"/><path d="M855 493 L1190 405 L1190 471 L855 559Z" fill="#263f32" stroke="#8ca581"/><path d="M680 405 L935 351 L1105 405 L855 470Z" fill="#233e32" stroke="#a8c797"/><path d="M710 407 L938 361 M750 424 L978 376 M790 439 L1018 391" stroke="#6e936a" stroke-width="7"/><circle cx="1161" cy="435" r="12" fill="#d9f6ad"/><circle cx="1127" cy="445" r="9" fill="#0a211a" stroke="#a2b48d"/><path d="M885 382v-60" stroke="#b9cfb5" stroke-width="5"/><ellipse cx="885" cy="320" rx="29" ry="13" fill="#2b4936" stroke="#d1e7af"/><ellipse cx="885" cy="310" rx="29" ry="13" fill="#acc592"/><g fill="none" stroke="#bfdb99" opacity=".45"><path d="M480 370h100 M530 320v100 M1240 480h100 M1290 430v100"/><path d="M1190 405l120-100h100 M745 661l-180 60H430" stroke-dasharray="4 6"/></g>${text(1285,285,'ACTUATION')}${text(380,748,'JOINT / CONTROL')}${text(660,265,'01 — EMBODIED INTELLIGENCE',11)}`;
await writeFile(new URL('quadruped.svg',out),wrap(robot,'#b7d691','NR / ROBOTICS STUDIO'));
let terrain='';for(let row=0;row<28;row++){let points='';for(let col=0;col<50;col++){const x=330+col*20+row*7,y=260+row*15+Math.sin(col*.21+row*.13)*40+Math.cos(col*.15-row*.1)*26;points+=`${x},${y} `;terrain+=`<circle cx="${x}" cy="${y}" r="${col%5===0?2.2:1.1}" fill="#b2d9a7" opacity="${.25+row/50}"/>`;}terrain+=`<polyline points="${points}" fill="none" stroke="#88b89a" opacity=".16"/>`;}
terrain+=`<path d="M510 630Q650 490 760 520T1020 430T1240 325" fill="none" stroke="#e8e6a7" stroke-width="4" stroke-dasharray="10 10"/><g fill="none" stroke="#c5e8b5"><rect x="750" y="380" width="170" height="130"/><path d="M750 380l55-40h170l-55 40 M920 510l55-40V340"/></g>${text(775,365,'TARGET / UGV',11)}${text(380,260,'PERCEPTION → PLANNING → ACTION')}${text(1110,710,'TERRAIN MAPPING')}`;
await writeFile(new URL('perception.svg',out),wrap(terrain,'#bad9af','NR / PERCEPTION &amp; NAVIGATION','#233e32'));
let molecule='';const pts=[[640,300],[750,260],[860,320],[850,450],[740,515],[630,450],[970,260],[1080,330],[1095,465],[1200,520],[980,530]];const edges=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[2,6],[6,7],[7,8],[8,10],[10,3],[8,9]];
for(const[a,b]of edges)molecule+=`<path d="M${pts[a]}L${pts[b]}" stroke="#b7b4d9" stroke-width="5" opacity=".6"/>`;
pts.forEach(([x,y],i)=>{molecule+=`<circle cx="${x}" cy="${y}" r="${i%3===0?25:17}" fill="${i%3===0?'#d3d3ed':'#778bac'}"/><circle cx="${x-5}" cy="${y-5}" r="6" fill="#fff" opacity=".4"/>`;});
molecule+=`<rect x="550" y="645" width="730" height="92" rx="12" fill="#18232a" stroke="#8e9db5" opacity=".9"/>${text(580,682,'QUERY RESEARCH DATA IN NATURAL LANGUAGE',13,'#d8d9eb')}${text(580,712,'MCP  /  SEMANTIC LAYER  /  TRINO',11,'#879ab3')}${text(590,200,'CONNECTING SCIENTISTS TO THEIR DATA',12,'#adb8d5')}<path d="M780 545v75h100" fill="none" stroke="#929bb9" stroke-dasharray="5 6"/>`;
await writeFile(new URL('research.svg',out),wrap(molecule,'#b9bbdd','NR / RESEARCH DATA SYSTEMS','#30324a'));
let health='<g transform="translate(550 180)"><rect width="660" height="470" rx="30" fill="#162b31" stroke="#80b7bd" stroke-width="2"/><rect x="25" y="25" width="610" height="420" rx="18" fill="#102329" stroke="#477b81"/>';
for(let i=0;i<24;i++)health+=`<path d="M${45+i*24} 45v380" stroke="#5fadb1" opacity="${.08+Math.sin(i*.4)**2*.22}"/>`;
health+='<circle cx="330" cy="225" r="125" fill="none" stroke="#a6ddd7" opacity=".3"/><circle cx="330" cy="225" r="85" fill="none" stroke="#a6ddd7" opacity=".4"/><path d="M90 225h150l20-32 24 68 28-97 32 110 28-49h200" fill="none" stroke="#c7e6ce" stroke-width="3"/></g>';
for(let i=0;i<3;i++)health+=`<rect x="${550+i*240}" y="720" width="180" height="60" rx="5" fill="#142c32" stroke="#7aa6aa"/>${text(570+i*240,756,['DETECTOR','gRPC / REST','OPERATOR UI'][i],11,'#b4d3d2')}${i<2?line(730+i*240,750,790+i*240,750,'#97bdbb',.7):''}`;
await writeFile(new URL('healthcare.svg',out),wrap(health,'#9bc9c9','NR / HEALTHCARE ENGINEERING','#214149'));
let rehab='';for(let i=0;i<9;i++)rehab+=`<ellipse cx="890" cy="${660-i*27}" rx="${280-i*16}" ry="${65-i*3}" fill="none" stroke="#cba9c5" opacity="${.08+i*.025}"/>`;
const joints=[[890,260],[890,345],[815,375],[740,455],[700,380],[965,375],[1040,455],[1090,385],[890,500],[820,560],[805,700],[960,560],[1000,700]];
for(const[a,b]of [[0,1],[1,2],[2,3],[3,4],[1,5],[5,6],[6,7],[1,8],[8,9],[9,10],[8,11],[11,12]])rehab+=`<path d="M${joints[a]}L${joints[b]}" stroke="#d7b7c5" stroke-width="5"/>`;
joints.forEach(([x,y])=>rehab+=`<circle cx="${x}" cy="${y}" r="8" fill="#e8d4da"/><circle cx="${x}" cy="${y}" r="18" fill="none" stroke="#b28f9f" opacity=".4"/>`);
rehab+=`<rect x="850" y="240" width="82" height="34" rx="10" fill="#3d354b" stroke="#f3d7da"/>${text(1075,305,'ADAPT / LEARN / REPEAT',11,'#d6b2c8')}${text(545,758,'HUMAN MOTION × MACHINE LEARNING',11,'#d6b2c8')}`;
await writeFile(new URL('rehab.svg',out),wrap(rehab,'#c9a9c8','NR / ADAPTIVE REHABILITATION','#413047'));
const produce=`<ellipse cx="900" cy="700" rx="250" ry="45" fill="#000" opacity=".25"/><path d="M900 340C780 250 610 350 650 510C680 660 800 715 900 665C1000 715 1120 660 1150 510C1190 350 1020 250 900 340Z" fill="#a5b678" stroke="#d2dcb0" stroke-width="2"/><path d="M900 340Q880 275 930 225" fill="none" stroke="#c8d4a1" stroke-width="13"/><path d="M915 285Q990 210 1050 270Q1000 330 915 285Z" fill="#5e8457" stroke="#b8c995"/><path d="M735 385Q685 460 730 550" fill="none" stroke="#e6e8bc" stroke-width="20" opacity=".3" stroke-linecap="round"/><g stroke="#dbebc5" fill="none"><path d="M590 390v-90h90 M1120 300h90v90 M590 610v100h90 M1120 710h90V610" stroke-width="3"/><path d="M620 500h560" stroke-dasharray="5 7" opacity=".4"/></g>${text(620,265,'PRODUCE / VISUAL FEATURES',12,'#d5dfb9')}${text(1035,765,'CV → FRESHNESS',12,'#d5dfb9')}`;
await writeFile(new URL('freshness.svg',out),wrap(produce,'#cbd3a0','NR / COMPUTER VISION','#3d4830'));
console.log('Created six original SVG project covers.');
let leadership='';
for(let i=0;i<45;i++){
 const angle=i/45*Math.PI*2;
 const radius=i%3===0?265:i%3===1?215:165;
 const x=850+Math.cos(angle)*radius,y=465+Math.sin(angle)*radius;
 leadership+=`<path d="M850 465L${x} ${y}" stroke="#cbbb91" opacity=".18"/><circle cx="${x}" cy="${y}" r="${i%5===0?8:5}" fill="#c9c49d" opacity=".8"/>`;
}
leadership+=`<rect x="720" y="400" width="260" height="130" rx="12" fill="#292f26" stroke="#d7d1ad"/>${text(755,450,'PROJECT MANAS',18,'#e2dfc7')}${text(755,488,'TEAM MANAGER',12,'#b7bea0')}${text(580,155,'45 PEOPLE / ONE TEAM',14,'#cec8a8')}`;
await writeFile(new URL('leadership.svg',out),wrap(leadership,'#d4c7a4','NR / TEAM LEADERSHIP','#413d2a'));
console.log('Created leadership SVG placeholder.');

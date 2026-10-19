// Rebuild native SVG layout assets: node scripts/build-assets.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = path.join(root, 'assets');
mkdirSync(assets, { recursive: true });

// Plana palette: Deep Shittim Obsidian, Crimson/Rose, Cyber Cyan, Silver Violet
const C = { 
  bg: '#090c16', 
  panel: '#0e1322', 
  line: '#222b42', 
  ink: '#f3f5ff', 
  muted: '#9ba5be', 
  violet: '#b894fc', 
  cyan: '#5ce1e6', 
  rose: '#ff4d6d', 
  gold: '#ffd166',
  crimson: '#e63946'
};

const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const image = name => `data:image/jpeg;base64,${readFileSync(path.join(assets, name)).toString('base64')}`;
const bg = image('plana_banner_bg.jpg');
const avatar = image('plana_avatar.jpg');
const text = (x, y, value, size = 20, fill = C.ink, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(value)}</text>`;
const style = `<style>
  text{font-family:Inter,'Segoe UI',Arial,sans-serif} .mono{font-family:'Cascadia Code','SFMono-Regular',Consolas,monospace}
  .pulse{animation:pulse 3s ease-in-out infinite} .cursor{animation:blink 1.2s steps(1) infinite}
  .float{animation:float 9s ease-in-out infinite}
  @keyframes pulse{0%,100%{opacity:.45}50%{opacity:1}} @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @media(prefers-reduced-motion:reduce){*{animation:none!important} .typing{clip-path:none!important}}
</style>`;

function svg(w, h, title, body, defs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title"><title id="title">${esc(title)}</title>${style}<defs>${defs}</defs>${body}</svg>\n`;
}
function save(name, content) { writeFileSync(path.join(assets, `${name}.svg`), content); }
function pill(x, y, label, color = C.violet, size = 13) {
  const w = label.length * size * .62 + 28;
  return `<rect x="${x}" y="${y}" width="${w}" height="${size+20}" rx="${(size+20)/2}" fill="${color}" fill-opacity=".09" stroke="${color}" stroke-opacity=".28"/>${text(x+14,y+size+9,label,size,color,'class="mono"')}`;
}

// 1. Cover / Hero Banner (Responsive Desktop & Mobile) featuring PLANA
for (const mobile of [false, true]) {
  const w = mobile ? 600 : 1200, h = mobile ? 560 : 460;
  const defs = `<clipPath id="canvas"><rect width="${w}" height="${h}" rx="24"/></clipPath>
    <linearGradient id="shade" x2="1" y2=".25"><stop stop-color="#090c16" stop-opacity=".94"/><stop offset=".55" stop-color="#090c16" stop-opacity=".65"/><stop offset="1" stop-color="#090c16" stop-opacity=".25"/></linearGradient>
    <linearGradient id="bottom" x2="0" y2="1"><stop stop-color="#090c16" stop-opacity="0"/><stop offset="1" stop-color="#090c16" stop-opacity=".96"/></linearGradient>
    <linearGradient id="accent"><stop stop-color="${C.cyan}"/><stop offset=".5" stop-color="${C.rose}"/><stop offset="1" stop-color="${C.violet}"/></linearGradient>
    <clipPath id="portrait"><circle cx="${mobile ? 485 : 966}" cy="${mobile ? 120 : 212}" r="${mobile ? 72 : 105}"/></clipPath>`;
  const inset = mobile ? 32 : 62;
  let s = `<g clip-path="url(#canvas)"><rect width="${w}" height="${h}" fill="${C.bg}"/>
    <image href="${bg}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/>
    <rect width="${w}" height="${h}" fill="url(#shade)"/>
    <rect width="${w}" height="${h}" fill="url(#bottom)"/>
    <path d="M${w*.66} 0L${w*.52} ${h}M${w*.68} 0L${w*.54} ${h}" stroke="${C.rose}" stroke-opacity=".12" stroke-width="1"/>
    <rect x="${inset}" y="${mobile?42:38}" width="${mobile?8:6}" height="${mobile?8:6}" rx="2" fill="${C.cyan}" class="pulse"/>
    ${text(inset+(mobile?20:18),mobile?50:45,'LEMAN / PERSONAL SPACE',mobile?15:13,C.cyan,'class="mono" letter-spacing="2"')}
    ${text(inset,mobile?156:126,'AFTER HOURS · SHITTIM CHEST OS',mobile?15:14,C.rose,'class="mono" letter-spacing="4"')}
    ${text(inset-4,mobile?245:245,'LEMAN',mobile?86:128,C.ink,'font-weight="800" letter-spacing="-4"')}
    <path d="M${inset} ${mobile?295:304}H${mobile?536:620}" stroke="url(#accent)" stroke-opacity=".75" stroke-width="2.5"/>
    ${text(inset,mobile?342:346,'Code. Music. Anime. Repeat.',mobile?26:23,C.ink,'font-weight="600"')}
    ${text(inset,mobile?380:382,'Shittim Chest Operating System online_',mobile?17:15,C.muted,'class="mono"')}`;
  
  const cx = mobile?485:966, cy = mobile?120:212, r = mobile?72:105;
  s += `<g class="float"><circle cx="${cx}" cy="${cy}" r="${r+17}" fill="${C.bg}" fill-opacity=".3" stroke="${C.rose}" stroke-opacity=".35"/>
    <circle cx="${cx}" cy="${cy}" r="${r+8}" fill="none" stroke="${C.cyan}" stroke-opacity=".7" stroke-dasharray="3 12"/>
    <image href="${avatar}" x="${cx-r}" y="${cy-r}" width="${r*2}" height="${r*2}" clip-path="url(#portrait)"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.ink}" stroke-opacity=".25"/></g>`;
  
  if (!mobile) {
    s += `${text(cx,361,'夜の余白',18,C.ink,'text-anchor="middle" letter-spacing="6"')}
      ${text(cx,387,'PLANA · THE QUIET BETWEEN COMMITS',10,C.muted,'class="mono" text-anchor="middle" letter-spacing="1.4"')}`;
  } else {
    s += pill(inset,418,'DEV / AUDIO / AUTOMATION',C.violet,15);
    s += text(inset,500,'夜の余白 / PLANA · SHITTIM CHEST',14,C.muted,'class="mono"');
  }
  for (let i=0;i<12;i++) {
    const x=(i*137+741)%w, y=(i*73+66)%(h-60);
    s += `<circle cx="${x}" cy="${y}" r="${i%3===0?2:1}" fill="${i%2?C.cyan:C.rose}" opacity=".45" class="pulse" style="animation-delay:${i*.3}s"/>`;
  }
  s += `<path d="M${inset} ${h-28}H${w-inset}" stroke="${C.line}"/>${text(inset,h-12,'SYSTEM // SHITTIM CHEST',11,C.muted,'class="mono" letter-spacing="1.6"')}${text(w-inset,h-12,'ARCHIVE 01',11,C.muted,'class="mono" text-anchor="end" letter-spacing="1.6"')}</g>
    <rect x=".5" y=".5" width="${w-1}" height="${h-1}" rx="24" fill="none" stroke="${C.rose}" stroke-opacity=".25"/>`;
  save(mobile?'hero-mobile':'hero',svg(w,h,'Leman — After Hours / Shittim Chest',s,defs));
}

// 2. Section Headers
for (const [key,n,title,subtitle] of [
  ['about','01','MEET THE PLAYER','INTRODUCTION'], ['arsenal','02','TOOLS OF THE TRADE','MY TOOLBOX'],
  ['projects','03','SELECTED SIDE QUESTS','PROJECT ARCHIVE'], ['connect','04','START A NEW ARC','SAY HELLO']
]) {
  save(`section-${key}`,svg(1000,74,`${n} — ${title}`,
    `<rect x="0" y="10" width="1000" height="54" rx="12" fill="${C.bg}"/>${text(18,44,n,16,C.rose,'class="mono"')}
    <path d="M53 24V50" stroke="${C.line}"/>${text(72,45,title,21,C.ink,'font-weight="700" letter-spacing="1.4"')}
    ${text(976,43,subtitle,10,C.muted,'class="mono" text-anchor="end" letter-spacing="1.6"')}`));
  save(`section-${key}-mobile`,svg(600,76,`${n} — ${title}`,
    `<rect x="0" y="6" width="600" height="64" rx="12" fill="${C.bg}"/>${text(18,46,n,21,C.rose,'class="mono"')}
    <path d="M60 24V53" stroke="${C.line}"/>${text(80,47,title,25,C.ink,'font-weight="700" letter-spacing=".5"')}`));
}

// 3. Interactive Terminal Window
for (const mobile of [false,true]) {
  const w=mobile?600:1200,h=mobile?342:266,p=mobile?28:40;
  let s=`<rect x=".5" y=".5" width="${w-1}" height="${h-1}" rx="18" fill="${C.bg}" stroke="${C.line}"/>
    <path d="M0 48H${w}" stroke="${C.line}"/>
    <circle cx="${p}" cy="24" r="4" fill="${C.rose}"/><circle cx="${p+17}" cy="24" r="4" fill="${C.gold}"/><circle cx="${p+34}" cy="24" r="4" fill="${C.cyan}"/>
    ${text(w-p,29,'leman@shittim-chest: ~',mobile?13:12,C.muted,'class="mono" text-anchor="end"')}
    ${text(p,90,'❯',23,C.cyan,'class="mono"')}
    <g class="typing" clip-path="url(#typing)">${text(p+28,90,'cat player.yml',mobile?22:21,C.ink,'class="mono"')}</g>
    ${text(p,135,'handle',mobile?24:18,C.muted,'class="mono"')}${text(p+150,135,'@lemanh1231',mobile?26:20,C.violet,'class="mono"')}
    ${text(p,173,'quests',mobile?24:18,C.muted,'class="mono"')}${text(p+150,173,mobile?'audio · emulators':'game server emulators · audio streaming · Android modding',mobile?25:20,C.ink,'class="mono"')}`;
  if(mobile) s+=text(p+150,206,'automation · devops',25,C.ink,'class="mono"');
  const last=mobile?251:216;
  s+=`${text(p,last,'next_arc',mobile?23:18,C.muted,'class="mono"')}${text(p+150,last,'keep building',mobile?26:20,C.cyan,'class="mono"')}
    <rect x="${p+150+(mobile?216:168)}" y="${last-19}" width="10" height="23" rx="1" fill="${C.cyan}" class="cursor"/>`;
  if(mobile)s+=text(p,307,'# shittim chest operating system online',15,C.muted,'class="mono"');
  const defs=`<clipPath id="typing"><rect x="${p+28}" y="60" width="230" height="40"><animate attributeName="width" values="0;230;230" keyTimes="0;.28;1" dur="8s" repeatCount="indefinite"/></rect></clipPath>`;
  save(mobile?'terminal-mobile':'terminal',svg(w,h,'Profile terminal — leman',s,defs));
}

// 4. Arsenal
const tools=[
  ['Py','Python','EMULATORS & BOTS',C.violet],
  ['JS','JavaScript','STREAMING & WEB',C.gold],
  ['Kt','Kotlin','ANDROID & MODDING',C.rose],
  ['TS','TypeScript','TYPED ENGINES',C.cyan],
  ['>_','Actions','CI/CD PIPELINES',C.cyan],
  ['[]','Docker','CONTAINER RUNTIME',C.violet]
];
for(const mobile of [false,true]){
  const w=mobile?600:1200,cols=mobile?2:6,gap=12,cw=(w-gap*(cols-1))/cols,ch=mobile?148:156,rows=Math.ceil(tools.length/cols),h=rows*ch+(rows-1)*gap;
  let s='';
  tools.forEach(([symbol,name,sub,color],i)=>{
    const x=(i%cols)*(cw+gap),y=Math.floor(i/cols)*(ch+gap);
    s+=`<rect x="${x+.5}" y="${y+.5}" width="${cw-1}" height="${ch-1}" rx="16" fill="${C.bg}" stroke="${C.line}"/>
      <rect x="${x+19}" y="${y+18}" width="42" height="37" rx="10" fill="${color}" fill-opacity=".1"/>
      ${text(x+40,y+43,symbol,19,color,'class="mono" text-anchor="middle" font-weight="700"')}
      ${text(x+19,y+92,name,mobile?24:21,C.ink,'font-weight="600"')}
      ${text(x+19,y+121,sub,mobile?12:10,C.muted,'class="mono" letter-spacing="1"')}
      <path d="M${x+19} ${y+ch-12}H${x+cw-19}" stroke="${color}" stroke-opacity=".18"/>`;
  });
  save(mobile?'arsenal-mobile':'arsenal',svg(w,h,'Toolbox — Python, JavaScript, Kotlin, TypeScript, Actions, Docker',s));
}

// 5. Selected Projects
const projects=[
  {
    key:'ggserver',
    n:'01',
    name:'GGServer',
    category:'SERVER EMULATOR',
    color:C.violet,
    stack:'PYTHON / APACHE THRIFT / DOCKER',
    desc:'Guitar Girl game private server emulator & packet protocol handler.',
    short:'Game server emulator & Thrift protocol engine.',
    symbol:'🎸'
  },
  {
    key:'proxy',
    n:'02',
    name:'youtube-proxy-checker',
    category:'STREAMING AUDITOR',
    color:C.cyan,
    stack:'JAVASCRIPT / NODE.JS / LAVALINK',
    desc:'YouTube Proxy & Direct Dual Auditor (Lavalink node simulator).',
    short:'Lavalink simulator & dual proxy auditor.',
    symbol:'⚡'
  },
  {
    key:'lyric',
    n:'03',
    name:'HyperLyric-Spotify-Provider-Fix',
    category:'ANDROID EXTENSION',
    color:C.rose,
    stack:'KOTLIN / LSPATCH / SPOTIFY API',
    desc:'Spotify Lyricon provider compatibility & battery optimizer.',
    short:'Spotify lyrics provider & battery optimizer.',
    symbol:'♪'
  }
];

for(const project of projects)for(const mobile of [false,true]){
  const {key,n,name,category,color,stack,desc,short,symbol}=project;
  const w=mobile?600:1200,h=mobile?230:164,left=mobile?24:119;
  let s=`<rect x=".5" y=".5" width="${w-1}" height="${h-1}" rx="18" fill="${C.bg}" stroke="${C.line}"/>
    <rect x="1" y="27" width="3" height="${h-54}" rx="1.5" fill="${color}"/>
    ${text(left,mobile?34:31,`${n} / ${category}`,11,color,'class="mono" letter-spacing="1.7"')}
    ${text(left,mobile?82:72,name,mobile?30:30,C.ink,'font-weight="700" letter-spacing="-.5"')}
    ${text(left,mobile?120:107,mobile?short:desc,mobile?22:19,C.muted)}
    ${text(left,mobile?191:141,stack,mobile?13:11,color,'class="mono" letter-spacing="1.2"')}
    ${text(w-27,mobile?193:89,'↗',mobile?24:30,color,'text-anchor="end"')}`;
  if(!mobile)s+=`<rect x="28" y="49" width="64" height="64" rx="18" fill="${color}" fill-opacity=".08" stroke="${color}" stroke-opacity=".2"/>${text(60,90,symbol,23,color,'class="mono" text-anchor="middle"')}${text(w-60,34,'VIEW REPOSITORY',10,C.muted,'class="mono" text-anchor="end" letter-spacing="1.4"')}`;
  save(`project-${key}${mobile?'-mobile':''}`,svg(w,h,`${name} — ${desc}`,s));
}

// 6. Connect Button
save('connect',svg(420,64,'Explore Lemanh1231 on GitHub',`<rect x="1" y="1" width="418" height="62" rx="16" fill="${C.bg}" stroke="${C.rose}" stroke-opacity=".65"/><circle cx="27" cy="32" r="4" fill="${C.cyan}" class="pulse"/>${text(47,39,'GITHUB / LEMANH1231',18,C.ink,'class="mono" letter-spacing="1"')}${text(386,40,'↗',24,C.rose,'text-anchor="end"')}`));

// 7. Footers
save('footer',svg(1200,126,'See you in the next commit — leman',`<defs><linearGradient id="g"><stop stop-color="${C.cyan}"/><stop offset=".5" stop-color="${C.rose}"/><stop offset="1" stop-color="${C.violet}"/></linearGradient></defs><rect x="0" y="0" width="1200" height="126" rx="18" fill="${C.bg}"/><path d="M35 1H1165" stroke="url(#g)" stroke-opacity=".6"/>${text(600,53,'SEE YOU IN THE NEXT COMMIT.',21,C.ink,'text-anchor="middle" font-weight="600" letter-spacing="3"')}${text(600,87,'LEMAN / SHITTIM CHEST ARCHIVES',11,C.muted,'class="mono" text-anchor="middle" letter-spacing="2"')}`));
save('footer-mobile',svg(600,140,'See you in the next commit — leman',`<rect width="600" height="140" rx="18" fill="${C.bg}"/><path d="M25 1H575" stroke="${C.rose}" stroke-opacity=".6"/>${text(300,61,'SEE YOU IN THE NEXT COMMIT.',24,C.ink,'text-anchor="middle" font-weight="600" letter-spacing=".5"')}${text(300,103,'LEMAN / SHITTIM CHEST ARCHIVES',14,C.muted,'class="mono" text-anchor="middle" letter-spacing=".6"')}`));

console.log('Successfully cooked Plana Hero and Assets for Leman!');

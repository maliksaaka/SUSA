// SUSA music page: procedural 3D iPod (three.js r170, MIT). Loaded only on /music when WebGL is available.
import * as THREE from './three.module.min.js';
import {RoundedBoxGeometry} from './RoundedBoxGeometry.js';
import {RoomEnvironment} from './RoomEnvironment.js';
export async function mount(box,api){
 const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,mob=matchMedia('(pointer:coarse)').matches;
 const cv=document.createElement('canvas');cv.className='ip3d';cv.tabIndex=0;cv.setAttribute('aria-label','Song browser');
 const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,powerPreference:'high-performance'});
 R.setPixelRatio(Math.min(devicePixelRatio,2));R.outputColorSpace=THREE.SRGBColorSpace;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;
 R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
 const S=new THREE.Scene(),pm=new THREE.PMREMGenerator(R);S.environment=pm.fromScene(new RoomEnvironment(),.035).texture;
 const cam=new THREE.PerspectiveCamera(30,1,.1,20);cam.position.set(0,0,2.55);
 const W=.62,H=1.035,D=.105;const G=new THREE.Group();S.add(G);const tilt=new THREE.Group();G.add(tilt);
 const mk=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);return c};
 const rnd=(a=>()=>(a=(a*16807)%2147483647)/2147483647)(7);
 // micro-scratch roughness: polished base, faint hairlines and a few wear swirls
 const scr=mk(1024,1024,(g,w,h)=>{g.fillStyle='rgb(24,24,24)';g.fillRect(0,0,w,h);g.lineCap='round';
  for(let i=0;i<900;i++){const x=rnd()*w,y=rnd()*h,a=rnd()*Math.PI,l=10+rnd()*120,v=34+rnd()*46;g.strokeStyle=`rgba(${v},${v},${v},${.15+rnd()*.3})`;g.lineWidth=.5+rnd()*.8;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke()}
  for(let i=0;i<40;i++){g.strokeStyle=`rgba(60,60,60,${.1+rnd()*.15})`;g.lineWidth=.6;g.beginPath();g.arc(rnd()*w,rnd()*h,40+rnd()*200,rnd()*6,rnd()*6+1);g.stroke()}});
 const scrT=new THREE.CanvasTexture(scr);scrT.wrapS=scrT.wrapT=THREE.RepeatWrapping;
 const chrome=new THREE.MeshPhysicalMaterial({color:0xeceef0,metalness:1,roughness:1,roughnessMap:scrT,envMapIntensity:1.25});
 const body=new THREE.Mesh(new RoundedBoxGeometry(W,H,D,8,.075),chrome);body.castShadow=body.receiveShadow=true;tilt.add(body);
 // white front shell
 const rr=(w,h,r)=>{const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s};
 const fg=new THREE.ExtrudeGeometry(rr(W-.008,H-.008,.07),{depth:.014,bevelEnabled:true,bevelThickness:.006,bevelSize:.005,bevelSegments:5,curveSegments:24});
 const white=new THREE.MeshPhysicalMaterial({color:0xf5f5f2,roughness:.32,clearcoat:1,clearcoatRoughness:.04,sheen:.2});
 const front=new THREE.Mesh(fg,white);front.position.z=D/2-.012;front.castShadow=front.receiveShadow=true;tilt.add(front);const FZ=D/2+.0085;
 // screen: bezel, live LCD canvas, glass
 const sw=.5,sh=.355,sy=.255;const bez=new THREE.Mesh(new THREE.ShapeGeometry(rr(sw+.03,sh+.03,.018)),new THREE.MeshStandardMaterial({color:0x0b0c0d,roughness:.4}));bez.position.set(0,sy,FZ+.0004);tilt.add(bez);
 const lcd=document.createElement('canvas');const LK=3;lcd.width=640*LK;lcd.height=Math.round(640*sh/sw)*LK;const lcdT=new THREE.CanvasTexture(lcd);lcdT.colorSpace=THREE.SRGBColorSpace;const MA=R.capabilities.getMaxAnisotropy();lcdT.anisotropy=MA;lcdT.generateMipmaps=false;lcdT.minFilter=THREE.LinearFilter;
 const scrM=new THREE.Mesh(new THREE.PlaneGeometry(sw,sh),new THREE.MeshBasicMaterial({map:lcdT,toneMapped:false}));scrM.position.set(0,sy,FZ+.0008);tilt.add(scrM);
 const glass=new THREE.Mesh(new THREE.ShapeGeometry(rr(sw+.03,sh+.03,.018)),new THREE.MeshPhysicalMaterial({color:0xffffff,metalness:0,roughness:.03,transparent:true,opacity:.07,envMapIntensity:1.4,depthWrite:false}));glass.position.set(0,sy,FZ+.0016);tilt.add(glass);
 // click wheel
 const wr=.205,wy=-.235;const wl=mk(1024,1024,(g)=>{g.scale(2,2);const w=512;const c=w/2;g.fillStyle='#ededeb';g.fillRect(0,0,w,w);g.fillStyle='#a3a7aa';g.font='600 34px "Instrument Sans",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('MENU',c,60);
  const tri=(x,y,d)=>{g.beginPath();g.moveTo(x,y-14);g.lineTo(x,y+14);g.lineTo(x+d*22,y);g.fill()};tri(c+160,c,1);tri(c+182,c,1);g.fillRect(c+204,c-14,5,28);tri(c-160,c,-1);tri(c-182,c,-1);g.fillRect(c-209,c-14,5,28);tri(c-24,c+196,1);g.fillRect(c+6,c+182,7,28);g.fillRect(c+18,c+182,7,28)});
 const wlT=new THREE.CanvasTexture(wl);wlT.colorSpace=THREE.SRGBColorSpace;wlT.anisotropy=R.capabilities.getMaxAnisotropy();
 const wheel=new THREE.Mesh(new THREE.CircleGeometry(wr,96),new THREE.MeshPhysicalMaterial({map:wlT,roughness:.62,clearcoat:.15}));wheel.position.set(0,wy,FZ+.0004);wheel.receiveShadow=true;tilt.add(wheel);
 const ring=new THREE.Mesh(new THREE.RingGeometry(wr-.002,wr+.002,96),new THREE.MeshStandardMaterial({color:0xcfd0cd,roughness:.5}));ring.position.set(0,wy,FZ+.0006);tilt.add(ring);
 const cg=new THREE.CylinderGeometry(.074,.076,.01,72);cg.rotateX(Math.PI/2);const cbtn=new THREE.Mesh(cg,new THREE.MeshPhysicalMaterial({color:0xf7f7f5,roughness:.25,clearcoat:1,clearcoatRoughness:.06}));cbtn.position.set(0,wy,FZ+.004);cbtn.castShadow=true;tilt.add(cbtn);
 // lights
 const key=new THREE.DirectionalLight(0xfff4e2,2.2);key.position.set(-1.2,1.6,2.2);key.castShadow=true;key.shadow.mapSize.set(mob?512:1024,mob?512:1024);key.shadow.radius=4;key.shadow.bias=-.0004;const sc=key.shadow.camera;sc.left=sc.bottom=-.8;sc.right=sc.top=.8;sc.near=.5;sc.far=6;S.add(key);
 const rim=new THREE.DirectionalLight(0xffe7c4,.8);rim.position.set(1.5,-.6,-1.8);S.add(rim);S.add(new THREE.HemisphereLight(0xfff8ec,0xc9ad80,.35));
 // LCD drawing, tied to the existing track browser state
 const ART={};function art(u){if(!u)return null;if(ART[u])return ART[u].complete?ART[u]:null;const im=new Image();im.crossOrigin='anonymous';im.onload=()=>{drawLCD();need()};im.src=u;ART[u]=im;return null}
 function drawLCD(){const g=lcd.getContext('2d'),w=lcd.width/LK,h=lcd.height/LK,st=api.state();g.setTransform(LK,0,0,LK,0,0);g.imageSmoothingQuality='high';g.fillStyle='#f6f7f6';g.fillRect(0,0,w,h);
  const hb=g.createLinearGradient(0,0,0,34);hb.addColorStop(0,'#f8f8f8');hb.addColorStop(1,'#d5d8da');g.fillStyle=hb;g.fillRect(0,0,w,34);g.fillStyle='#b8bcbe';g.fillRect(0,34,w,1);
  g.font='600 17px "Instrument Sans",sans-serif';g.textBaseline='middle';g.fillStyle='#2d5ea8';g.fillText(st.playing?'Now Playing':'Music',12,18);g.fillStyle='#111';g.textAlign='right';g.fillText(`${st.sel+1} of ${st.n}`,w-12,18);g.textAlign='left';
  const lw=w*.56,RH=(h-35)/7;g.save();g.beginPath();g.rect(0,35,lw,h-35);g.clip();g.font='17px "Instrument Sans",sans-serif';
  for(let k=0;k<7;k++){const i=st.top+k;if(i>=st.n)break;const y=35+k*RH;if(i===st.sel){const sg=g.createLinearGradient(0,y,0,y+RH);sg.addColorStop(0,'#5a87c9');sg.addColorStop(1,'#2d5ea8');g.fillStyle=sg;g.fillRect(0,y,lw,RH);g.fillStyle='#fff'}else g.fillStyle='#151515';
   let t=st.title(i);while(g.measureText(t).width>lw-20&&t.length>2)t=t.slice(0,-2);if(t!==st.title(i))t=t.trimEnd()+'...';g.fillText(t,10,y+RH/2)}
  g.restore();g.fillStyle='#d4d7d6';g.fillRect(lw,35,1,h-35);
  const ax=lw+(w-lw)/2,as=Math.min(150,w-lw-30),im=art(st.art);g.save();g.shadowColor='rgba(0,0,0,.3)';g.shadowBlur=10;g.shadowOffsetY=4;g.fillStyle='#ccc';g.fillRect(ax-as/2,50,as,as);g.restore();if(im)g.drawImage(im,ax-as/2,50,as,as);
  g.textAlign='center';g.fillStyle='#111';g.font='600 16px "Instrument Sans",sans-serif';const tt=st.title(st.sel);let ln=[''];tt.split(' ').forEach(wd=>{const c=ln[ln.length-1];if(g.measureText(c+' '+wd).width>w-lw-20&&c)ln.push(wd);else ln[ln.length-1]=(c?c+' ':'')+wd});
  ln.slice(0,2).forEach((l,k)=>g.fillText(l,ax,50+as+22+k*20));g.font='14px "Instrument Sans",sans-serif';g.fillStyle='#555';g.fillText(st.meta,ax,50+as+68);g.textAlign='left';
  const gl=g.createLinearGradient(0,0,w,h);gl.addColorStop(0,'rgba(255,255,255,.35)');gl.addColorStop(.36,'rgba(255,255,255,.08)');gl.addColorStop(.37,'rgba(255,255,255,0)');g.fillStyle=gl;g.fillRect(0,0,w,h);lcdT.needsUpdate=true}
 let yaw=0,pitch=0,vy=0,vp=0,tgt=null,drag=null,lx=-.4,ly=-.5,clx=lx,cly=ly,vis=true,raf=0,t0=performance.now(),last=t0,idle=0;
 api.onChange=()=>{drawLCD();need()};drawLCD();
 // layout
 box.classList.add('has3d');box.prepend(cv);function size(){const r={width:cv.clientWidth,height:cv.clientHeight};if(!r.width)return;R.setSize(r.width,r.height,false);cam.aspect=r.width/r.height;cam.updateProjectionMatrix();need()}
 new ResizeObserver(size).observe(box);size();
 // motion state
 const ray=new THREE.Raycaster(),ptr=new THREE.Vector2(),PICK=[body,front,bez,scrM,glass,wheel,ring,cbtn];
 function pick(e){const r=cv.getBoundingClientRect();ptr.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(ptr,cam);const h=ray.intersectObjects(PICK,false)[0];return h||null}
 const loc=p=>tilt.worldToLocal(p.clone());
 cv.addEventListener('touchstart',e=>{const t=e.touches[0];if(pick(t))e.preventDefault()},{passive:false});
 cv.addEventListener('pointerdown',e=>{const h=pick(e);if(!h)return;cv.setPointerCapture(e.pointerId);const o=h.object,p=loc(h.point);
  if(o===cbtn)drag={m:'btn'};else if(o===wheel||o===ring)drag={m:'wh',a:Math.atan2(p.y-wy,p.x),acc:0,mv:0,p};else if(o===scrM||o===glass||o===bez)drag={m:'sc',y:e.clientY,acc:0};else drag={m:'rot',x:e.clientX,y:e.clientY,d:0,t:performance.now()};vy=vp=0;idle=0;need()});
 cv.addEventListener('pointermove',e=>{if(!drag)return;if(drag.m==='wh'){const h=pick(e);if(!h)return;const p=loc(h.point),a=Math.atan2(p.y-wy,p.x);let d=(a-drag.a)*180/Math.PI;if(d>180)d-=360;if(d<-180)d+=360;drag.a=a;drag.acc-=d;drag.mv+=Math.abs(d);while(drag.acc>=22){api.step(1);drag.acc-=22}while(drag.acc<=-22){api.step(-1);drag.acc+=22}}
  else if(drag.m==='sc'){drag.acc+=drag.y-e.clientY;drag.y=e.clientY;while(drag.acc>16){api.step(1);drag.acc-=16}while(drag.acc<-16){api.step(-1);drag.acc+=16}}
  else if(drag.m==='rot'){const dx=e.clientX-drag.x,dy=e.clientY-drag.y,now=performance.now(),k=Math.min(1,16/Math.max(1,now-drag.t));drag.x=e.clientX;drag.y=e.clientY;drag.t=now;drag.d+=Math.abs(dx)+Math.abs(dy);yaw+=dx*.011;pitch=Math.max(-1.1,Math.min(1.1,pitch+dy*.009));vy=vy*.5+dx*.006*k;vp=vp*.5+dy*.004*k;need()}});
 const up=e=>{if(!drag)return;const d=drag;drag=null;
  if(d.m==='btn')api.play();else if(d.m==='wh'&&d.mv<6){const x=d.p.x,y=d.p.y-wy;if(Math.abs(y)>Math.abs(x)){y>0?api.step(-7):api.toggle()}else api.step(x<0?-1:1)}
  else if(d.m==='rot'&&d.d<5)flip();if(RM){vy=vp=0}need()};
 cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 function flip(){tgt=Math.round(yaw/Math.PI)*Math.PI+Math.PI;need()}
 api.flip=flip;
 cv.addEventListener('keydown',e=>{const k={ArrowDown:1,ArrowRight:1,ArrowUp:-1,ArrowLeft:-1,PageDown:7,PageUp:-7,Home:-1e4,End:1e4}[e.key];if(k){e.preventDefault();api.step(k)}else if(e.key==='Enter'||e.key===' '){e.preventDefault();api.play()}else if(e.key==='f'){flip()}});
 const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
 if(fine)addEventListener('pointermove',e=>{const r=box.getBoundingClientRect();lx=Math.max(-1,Math.min(1,(e.clientX-r.left-r.width/2)/innerWidth*2.2));ly=Math.max(-1,Math.min(1,(e.clientY-r.top-r.height/2)/innerHeight*2.2));need()},{passive:true});
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;need()}).observe(box);document.addEventListener('visibilitychange',need);
 function need(){if(!raf&&vis&&!document.hidden&&document.body.contains(box))raf=requestAnimationFrame(frame)}
 function frame(now){raf=0;const dt=Math.min(.05,(now-last)/1000);last=now;let busy=false;
  if(!drag){if(tgt!==null){const d=tgt-yaw;yaw+=RM?d:d*Math.min(1,dt*7);if(Math.abs(d)<.002){yaw=tgt;tgt=null}else busy=true;pitch+=(0-pitch)*Math.min(1,dt*6)}
   else{yaw+=vy;pitch+=vp;vy*=.93;vp*=.9;if(Math.abs(vy)+Math.abs(vp)>.0008)busy=true;else{vy=vp=0;const f=Math.round(yaw/Math.PI)*Math.PI;yaw+=(f-yaw)*Math.min(1,dt*3);pitch+=(0-pitch)*Math.min(1,dt*3);if(Math.abs(f-yaw)>.001||Math.abs(pitch)>.001)busy=true;else{yaw=f}}}}else busy=true;
  idle+=dt;const sway=RM?0:Math.min(1,idle/2),t=(now-t0)/1000;
  clx+=(lx-clx)*Math.min(1,dt*5);cly+=(ly-cly)*Math.min(1,dt*5);if(Math.abs(lx-clx)+Math.abs(ly-cly)>.002)busy=true;
  G.rotation.y=yaw+(fine?clx*.12:0)+sway*Math.sin(t*.6)*.06;G.rotation.x=pitch+(fine?cly*.08:0)+sway*Math.sin(t*.45)*.025;G.position.y=sway*Math.sin(t*.8)*.008;
  key.position.set(-1.2+clx*2.4,1.6-cly*1.8,2.2);
  box.style.setProperty('--sx',(-clx*26+Math.sin(G.rotation.y)*10).toFixed(1)+'px');box.style.setProperty('--sy',(30+cly*10).toFixed(1)+'px');
  R.render(S,cam);if(busy||(!RM))need()}
 need();return {R,flip}}

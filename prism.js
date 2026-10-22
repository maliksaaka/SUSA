// SUSA /music background: iridescent light leak. WebGL2, CSS fallback, reduced motion renders one frame.
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const GLSL=`#version 300 es
precision highp float;uniform vec2 R;uniform float T;out vec4 o;
vec3 sp(float t){return clamp(abs(fract(t+vec3(0.,2.,1.)/3.)*6.-3.)-1.,0.,1.);}
void main(){vec2 f=gl_FragCoord.xy;f.y=R.y-f.y;float h=min(R.x,R.y);vec2 p=(f-R*.5)/h;p.y=-p.y;float t=T;
vec2 q=p*1.2;for(int i=0;i<3;i++){q+=.25*vec2(sin(q.y*2.1+t*.06+float(i)),cos(q.x*1.8-t*.05+float(i)*1.7));}
float band=q.x*.9+q.y*.5;vec3 col=mix(sp(band*.6),vec3(1),.35);
float lit=smoothstep(.0,1.,1.-length((f/R-vec2(.95,.0))*vec2(1.,1.3)));
float rib=pow(.5+.5*sin(band*9.),3.);
vec4 c=vec4(col,1.)*lit*(.22+.3*rib);float A=clamp(c.a,0.,1.);o=vec4(min(c.rgb,vec3(A)),A);}`;
const css=document.createElement('style');css.textContent=`
body[data-r=music]{overflow-x:clip}
.pz3{position:fixed;inset:0;pointer-events:none;z-index:2;mix-blend-mode:overlay;opacity:.85}
.pzf{background:radial-gradient(120% 90% at 95% 0,rgba(255,170,170,.35),rgba(255,230,150,.25) 25%,rgba(150,230,200,.2) 40%,rgba(160,180,255,.18) 55%,transparent 70%)}`;
document.head.appendChild(css);
let cur=null,raf=0;
function kill(){cancelAnimationFrame(raf);raf=0;if(cur){cur.remove();cur=null}}
function mount(){const el=document.createElement('div');el.className='pz3';el.setAttribute('aria-hidden','true');
 const cv=document.createElement('canvas');cv.style.cssText='width:100%;height:100%;display:block';el.appendChild(cv);document.body.prepend(el);cur=el;
 let draw=null;try{draw=gl(cv)}catch(e){draw=null}
 if(!draw){cv.remove();el.classList.add('pzf');document.documentElement.dataset.prism='css';return}
 const t0=performance.now();
 const fit=()=>{const d=Math.min(devicePixelRatio||1,1.5),w=Math.max(1,innerWidth*d|0),h=Math.max(1,innerHeight*d|0);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;return true}return false};
 const frame=()=>{fit();draw(cv.width,cv.height,RM?4:(performance.now()-t0)/1000)};
 if(RM){frame();addEventListener('resize',()=>{if(cur===el&&fit())frame()});return}
 const loop=()=>{if(cur!==el)return;if(!document.hidden)frame();raf=requestAnimationFrame(loop)};loop();
}
function gl(cv){const g=cv.getContext('webgl2',{premultipliedAlpha:true,antialias:false});if(!g)return null;
 const sh=(t,s)=>{const x=g.createShader(t);g.shaderSource(x,s);g.compileShader(x);if(!g.getShaderParameter(x,g.COMPILE_STATUS))throw g.getShaderInfoLog(x);return x};
 const pr=g.createProgram();g.attachShader(pr,sh(g.VERTEX_SHADER,'#version 300 es\nvoid main(){vec2 v=vec2(gl_VertexID==1?3.:-1.,gl_VertexID==2?3.:-1.);gl_Position=vec4(v,0,1);}'));g.attachShader(pr,sh(g.FRAGMENT_SHADER,GLSL));g.linkProgram(pr);
 if(!g.getProgramParameter(pr,g.LINK_STATUS))return null;g.useProgram(pr);
 const uR=g.getUniformLocation(pr,'R'),uT=g.getUniformLocation(pr,'T');document.documentElement.dataset.prism='webgl';
 return(w,h,t)=>{g.viewport(0,0,w,h);g.uniform2f(uR,w,h);g.uniform1f(uT,t);g.drawArrays(g.TRIANGLES,0,3)}}
function check(){const on=document.body.dataset.r==='music';if(on&&(!cur||!cur.isConnected)){kill();mount()}else if(!on&&cur)kill()}
new MutationObserver(check).observe(document.body,{attributes:true,attributeFilter:['data-r'],childList:true,subtree:true});check();

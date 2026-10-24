import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Water } from 'three/addons/objects/Water.js';
import { gsap } from 'gsap';
import SunCalc from 'suncalc';

const $ = id => document.getElementById(id);
const DEG = 180 / Math.PI;
const LOCATION = { latitude: 20.051806, longitude: 110.315556 };
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const small = matchMedia('(max-width: 700px)').matches;
const state = { minutes: 1062, date: '2026-10-24', playing: false, sea: !motionQuery.matches, reduced: motionQuery.matches, ready: false, view: 0, clean: false, altitude: 0 };
let renderer, scene, camera, water, sky, sun, fill, bridge, raf, disposed = false, dirty = true;
let previous = 0, frames = 0, lastStats = 0, fps = 0, waterClock = 0, lastPlaybackUpdate = 0;
let solarDirection = new THREE.Vector3(), envTarget, pmrem, envScene, envTimer;
const emissives = new Set();
const cameras = [{position:[390,105,530],target:[10,34,0]}, {position:[-330,68,470],target:[-35,42,0]}];
const viewTarget = new THREE.Vector3(10,34,0);
const timeText = minutes => `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(Math.floor(minutes%60)).padStart(2,'0')}`;
const localDate = (minutes = state.minutes) => new Date(`${state.date}T${timeText(minutes)}:00+08:00`);
const localMinutes = date => {const d=new Date(date.getTime()+8*3600000);return d.getUTCHours()*60+d.getUTCMinutes();};
const smooth = (a,b,x) => THREE.MathUtils.smoothstep(x,a,b);
let solarTimes;

function updateTimes() {
  solarTimes = SunCalc.getTimes(localDate(720), LOCATION.latitude, LOCATION.longitude);
}
function setPlaying(value) {
  state.playing = value && state.ready;
  $('play').setAttribute('aria-pressed',String(state.playing));
  $('play').setAttribute('aria-label',state.playing?'暂停时间流动':'播放一天的光影');
  $('play-icon').textContent=state.playing?'Ⅱ':'▷';
  $('play-label').textContent=state.playing?'暂停时间':'让时间流动';
  if(!state.playing&&state.ready)scheduleEnvironment();
  ensureLoop();
}
function updateUI() {
  const text=timeText(state.minutes);
  $('clock').textContent=text;
  $('time').value=Math.round(state.minutes);
  $('time').style.setProperty('--progress',`${(state.minutes-300)/930*100}%`);
  $('time').setAttribute('aria-valuetext',`${text}，海口当地时间`);
  $('altitude').textContent=`${state.altitude.toFixed(1)}°`;
  const morning=state.minutes<localMinutes(solarTimes.solarNoon);
  let mood,note;
  if(state.altitude < -5){mood='灯火与海';note='夜色落下，桥成为另一道光。';}
  else if(state.altitude < 0){mood='蓝调未央';note='天光渐退，水面留住最后的颜色。';}
  else if(state.altitude < 12){mood=morning?'海上初光':'余晖入海';note=morning?'第一束光，轻轻掠过桥塔。':'桥的线条，慢慢染上温度。';}
  else if(state.altitude < 30){mood=morning?'清晨的轮廓':'斜阳之间';note='拉索投下细影，海面泛起微光。';}
  else{mood='日光正盛';note='光与影，在桥的两侧分明。';}
  $('mood').textContent=mood;$('mood-note').textContent=note;
}

function updateLight() {
  const pos=SunCalc.getPosition(localDate(),LOCATION.latitude,LOCATION.longitude);
  state.altitude=pos.altitude*DEG;
  // Scene +X = approximate north, +Z = east. SunCalc azimuth is south toward west.
  solarDirection.set(-Math.cos(pos.azimuth)*Math.cos(pos.altitude),Math.sin(pos.altitude),-Math.sin(pos.azimuth)*Math.cos(pos.altitude));
  if(sun){
    const alt=state.altitude, daylight=smooth(-5,10,alt), direct=smooth(-1,9,alt), warmth=1-smooth(3,26,alt);
    const night=1-smooth(-9,1,alt);
    sun.position.copy(solarDirection).multiplyScalar(1100);sun.target.position.set(0,20,0);
    sun.color.copy(new THREE.Color('#fff4df')).lerp(new THREE.Color('#ffac65'),warmth*.8);
    sun.intensity=direct*(2.5+Math.max(0,Math.sin(pos.altitude))*1.6);
    fill.color.set('#9ebfd4').lerp(new THREE.Color('#b9b5c2'),warmth*.35);
    fill.groundColor.set('#495553');fill.intensity=.32+daylight*.85;
    renderer.toneMappingExposure=.74+daylight*.12;
    sky.material.uniforms.sunPosition.value.copy(solarDirection);
    sky.material.uniforms.nightMix.value=night;
    sky.material.uniforms.cloudWarm.value=warmth;
    sky.material.uniforms.zenith.value.set('#47819e').lerp(new THREE.Color('#45647b'),warmth).lerp(new THREE.Color('#071728'),night);
    sky.material.uniforms.horizon.value.set('#b0d2d7').lerp(new THREE.Color('#edaa76'),warmth).lerp(new THREE.Color('#39536f'),night);
    const fogDay=new THREE.Color('#9fbdc3'),fogWarm=new THREE.Color('#bc987e'),fogNight=new THREE.Color('#243847');
    scene.fog.color.copy(fogDay).lerp(fogWarm,warmth*.65).lerp(fogNight,night);
    scene.fog.density=.00043+night*.00010;
    water.material.uniforms.sunDirection.value.copy(solarDirection);
    water.material.uniforms.sunColor.value.copy(sun.color).multiplyScalar(direct*(.6+daylight*.5));
    water.material.uniforms.waterColor.value.set('#24676c').lerp(new THREE.Color('#0c2633'),night).multiplyScalar(.75+daylight*.25);
    for(const m of emissives) m.emissiveIntensity=night*2.5;
    if(bridge) bridge.traverse(o=>{if(o.isMesh&&o.name.startsWith('01')){o.material.emissive.set('#efbb7b');o.material.emissiveIntensity=night*.22;}});
    renderer.shadowMap.needsUpdate=true;
    scene.environmentIntensity=.12+daylight*.18;
    if(state.ready&&!state.playing)scheduleEnvironment();
  }
  updateUI();dirty=true;ensureLoop();
}

function scheduleEnvironment(){
  clearTimeout(envTimer);
  envTimer=setTimeout(()=>{if(!pmrem||disposed)return;const old=envTarget;envTarget=pmrem.fromScene(envScene,.12,.1,25000);scene.environment=envTarget.texture;old?.dispose();dirty=true;ensureLoop();},180);
}

function createNormals(){
  const n=256, data=new Uint8Array(n*n*4), waves=[];
  for(let j=0;j<18;j++){
    const k=2+Math.floor(j*1.7),a=j*2.399;
    waves.push([Math.round(Math.cos(a)*k)||1,Math.round(Math.sin(a)*k)||1,1/(1+j*.28),j*1.71]);
  }
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    let dx=0,dy=0;
    for(const [kx,ky,a,p] of waves){const c=Math.cos((kx*x+ky*y)/n*Math.PI*2+p)*a;dx+=c*kx/20;dy+=c*ky/20;}
    const v=new THREE.Vector3(-dx*.55,-dy*.55,1).normalize(),i=(y*n+x)*4;
    data[i]=(v.x*.5+.5)*255;data[i+1]=(v.y*.5+.5)*255;data[i+2]=(v.z*.5+.5)*255;data[i+3]=255;
  }
  const texture=new THREE.DataTexture(data,n,n,THREE.RGBAFormat);
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true;
  return texture;
}

function createSky(){
  // Art-directed atmospheric palette; solar disk remains at geographic azimuth/elevation.
  const m=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{sunPosition:{value:new THREE.Vector3()},nightMix:{value:0},cloudWarm:{value:0},zenith:{value:new THREE.Color()},horizon:{value:new THREE.Color()}},
  vertexShader:`varying vec3 vWorld;void main(){vWorld=(modelMatrix*vec4(position,1.0)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position.z=gl_Position.w;}`,
  fragmentShader:`varying vec3 vWorld;uniform vec3 sunPosition;uniform vec3 zenith;uniform vec3 horizon;uniform float nightMix; uniform float cloudWarm;
    float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise21(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x),mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x),f.y);}
    float fbm(vec2 p){float s=0.0,a=0.5;for(int i=0;i<5;i++){s+=a*noise21(p);p=mat2(1.6,1.2,-1.2,1.6)*p;a*=0.5;}return s;}
    void main(){
      vec3 direction=normalize(vWorld-cameraPosition);float h=max(direction.y,0.0);
      float sunDot=max(dot(direction,normalize(sunPosition)),0.0);
      vec3 retColor=mix(horizon,zenith,pow(smoothstep(0.0,0.8,h),0.42));
      vec3 glow=mix(vec3(1.0,0.88,0.65),vec3(1.0,0.39,0.12),cloudWarm);
      retColor+=glow*pow(sunDot,22.0)*0.28*(1.0-nightMix);
      retColor+=glow*pow(sunDot,350.0)*0.45*(1.0-nightMix);
      retColor+=vec3(1.0,0.83,0.56)*smoothstep(0.99994,0.99997,sunDot)*12.0*(1.0-nightMix);
      vec2 uv=direction.xz/max(h+0.18,0.035)*2.0;
      float cloud=smoothstep(0.52,0.78,fbm(uv+vec2(2.7,8.2)))*smoothstep(0.01,0.16,h);
      vec3 cloudColor=mix(vec3(.8,.9,.97),vec3(1.0,.65,.42),cloudWarm*.7)*(1.0-nightMix*.92);
      retColor=mix(retColor,cloudColor,cloud*.62);
      gl_FragColor=vec4(retColor,1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`});
  const object=new THREE.Mesh(new THREE.SphereGeometry(1,32,16),m);object.scale.setScalar(20000);
  return object;
}

async function init(){
  try{
    if(new URLSearchParams(location.search).has('fallback'))throw new Error('Requested static fallback');
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance',preserveDrawingBuffer:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,small?1.25:1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
    $('scene').appendChild(renderer.domElement);
    renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();showFallback('三维场景暂时中断，请刷新以重新加载。');});
    scene=new THREE.Scene();scene.fog=new THREE.FogExp2('#aebcbe',.0003);
    camera=new THREE.PerspectiveCamera(43,1,1,25000);camera.position.fromArray(cameras[0].position);
    sky=createSky();scene.add(sky);
    sun=new THREE.DirectionalLight('#fff4df',3);sun.castShadow=true;sun.shadow.mapSize.set(small?1024:2048,small?1024:2048);
    Object.assign(sun.shadow.camera,{left:-470,right:470,top:290,bottom:-290,near:1,far:2400});sun.shadow.normalBias=.18;sun.shadow.bias=-.00008;sun.shadow.radius=2;
    scene.add(sun,sun.target);
    fill=new THREE.HemisphereLight('#adc2cf','#465657',1.5);scene.add(fill);
    water=new Water(new THREE.PlaneGeometry(20000,20000),{textureWidth:small?512:1024,textureHeight:small?512:1024,waterNormals:createNormals(),sunDirection:solarDirection,sunColor:'#ffdcac',waterColor:'#1a4548',distortionScale:3.8,fog:true});
    water.rotation.x=-Math.PI/2;water.position.y=.02;water.receiveShadow=true;water.material.uniforms.size.value=2.4;
    // Calmer estuary wave slopes; add sunlight independently of reflection brightness.
    water.material.fragmentShader=water.material.fragmentShader.replace('vec3( 1.5, 1.0, 1.5 )','vec3( 0.65, 1.0, 0.65 )').replace('float rf0 = 0.3;','float rf0 = 0.08;').replace(/vec3 albedo = mix\(.*reflectance\);/,'vec3 albedo = mix(waterColor * (0.25 + diffuseLight * 0.5) * getShadowMask(), reflectionSample, clamp(reflectance, 0.0, 0.88));').replace('vec3 outgoingLight = albedo;','vec3 outgoingLight = albedo + specularLight * 0.45 * getShadowMask();');
    scene.add(water);
    resize();updateTimes();updateLight();
    const model=await new GLTFLoader().loadAsync(`${import.meta.env.BASE_URL}models/century-bridge.glb`,e=>{if(e.total)$('load-copy').textContent=`正在铺开海与桥 · ${Math.round(e.loaded/e.total*100)}%`;});
    bridge=model.scene;
    bridge.traverse(o=>{
      if(!o.isMesh)return;
      o.castShadow=!/Distant|City|Warm|Aviation|176/.test(o.name);o.receiveShadow=true;
      const m=o.material;
      if(m.emissive?.getHex()>0){emissives.add(m);m.emissiveIntensity=0;}
      if(o.name.startsWith('01')){m.roughness=.64;m.color.set('#c9cdca');}
      if(o.name.startsWith('05')){m.metalness=.28;m.roughness=.55;m.color.set('#bac4c3');}
    });scene.add(bridge);
    // Low resolution sky environment gives metal and concrete coherent ambient response.
    pmrem=new THREE.PMREMGenerator(renderer);envScene=new THREE.Scene();
    const envSky=sky.clone();envScene.add(envSky);envTarget=pmrem.fromScene(envScene,.12,.1,25000);scene.environment=envTarget.texture;scene.environmentIntensity=.3;
    state.ready=true;updateLight();renderer.render(scene,camera);document.body.classList.add('ready');
    if(!state.reduced)gsap.from('.topbar,.heading,.place,.observation,.view-tools,.timeline,footer',{opacity:0,y:8,stagger:.07,duration:.9,ease:'power2.out',clearProps:'opacity,transform'});
    ensureLoop();
  }catch(error){console.error('Scene initialization:',error);showFallback('当前设备暂时无法运行三维场景，已显示静态光影画面。');}
}

function showFallback(message){
  state.ready=false;setPlaying(false);state.sea=false;cancelAnimationFrame(raf);raf=null;
  $('scene').style.display='none';$('loading').style.display='none';$('fallback').hidden=false;$('fallback').textContent=message;
  for(const id of ['time','date','play','view','sea','capture'])$(id).disabled=true;
  document.querySelectorAll('[data-moment]').forEach(b=>b.disabled=true);
}
function resize(){
  if(!renderer)return;const rect=$('experience').getBoundingClientRect();
  renderer.setSize(rect.width,rect.height);camera.aspect=rect.width/rect.height;
  // Portrait keeps the full twin-pylon span, reserving the upper and lower margins for type.
  camera.fov=camera.aspect<.9?57:43;
  const factor=camera.aspect<.9?1.4:1;
  camera.position.fromArray(cameras[state.view].position).multiplyScalar(factor);camera.lookAt(viewTarget);camera.updateProjectionMatrix();dirty=true;ensureLoop();
}
function ensureLoop(){if(!raf&&!disposed&&renderer&&state.ready&&!document.hidden)raf=requestAnimationFrame(frame);}
function frame(now){
  raf=null;if(disposed||document.hidden||!state.ready)return;
  const dt=Math.min((now-(previous||now))/1000,.08);previous=now;
  if(state.playing){state.minutes+=dt*18;if(state.minutes>1230)state.minutes=300;if(now-lastPlaybackUpdate>75){lastPlaybackUpdate=now;updateLight();}}
  if(state.sea&&!state.reduced){waterClock+=dt*.32;water.material.uniforms.time.value=waterClock;dirty=true;}
  if(dirty){renderer.render(scene,camera);dirty=false;}
  frames++;if(now-lastStats>1000){fps=Math.round(frames*1000/(now-lastStats));lastStats=now;frames=0;}
  if(state.sea||state.playing||gsap.isTweening(camera.position))ensureLoop();
}

$('time').addEventListener('input',e=>{setPlaying(false);state.minutes=Number(e.target.value);document.querySelectorAll('[data-moment]').forEach(b=>b.classList.remove('selected'));updateLight();});
$('date').addEventListener('change',e=>{if(!e.target.value||!e.target.validity.valid){e.target.value=state.date;return;}state.date=e.target.value;updateTimes();updateLight();});
$('play').addEventListener('click',()=>setPlaying(!state.playing));
document.querySelectorAll('[data-moment]').forEach(button=>button.addEventListener('click',()=>{
  setPlaying(false);const preset={dawn:localMinutes(solarTimes.sunrise)+18,noon:localMinutes(solarTimes.solarNoon),golden:localMinutes(solarTimes.sunset)-40,blue:localMinutes(solarTimes.sunset)+24};
  state.minutes=THREE.MathUtils.clamp(preset[button.dataset.moment],300,1230);document.querySelectorAll('[data-moment]').forEach(b=>b.classList.toggle('selected',b===button));updateLight();
}));
$('sea').addEventListener('click',()=>{state.sea=!state.sea;$('sea').setAttribute('aria-pressed',String(state.sea));$('sea-label').textContent=state.sea?'流动':'静止';$('sea').title=state.sea?'暂停海面动态':'开启海面动态';if(state.reduced&&state.sea)state.reduced=false;dirty=true;ensureLoop();});
$('view').addEventListener('click',()=>{
  state.view=(state.view+1)%cameras.length;$('view-label').textContent=`0${state.view+1}`;
  const pose=cameras[state.view],factor=camera.aspect<.9?1.4:1;gsap.killTweensOf(camera.position);gsap.killTweensOf(viewTarget);
  gsap.to(viewTarget,{x:pose.target[0],y:pose.target[1],z:pose.target[2],duration:state.reduced?0:1.8});
  gsap.to(camera.position,{x:pose.position[0]*factor,y:pose.position[1]*factor,z:pose.position[2]*factor,duration:state.reduced?0:1.8,ease:'power2.inOut',onUpdate:()=>{camera.lookAt(viewTarget);dirty=true;ensureLoop();}});
});
$('capture').addEventListener('click',()=>{if(!state.ready)return;renderer.render(scene,camera);const a=document.createElement('a');a.download=`century-light-${state.date}-${timeText(state.minutes).replace(':','')}.png`;a.href=renderer.domElement.toDataURL('image/png');a.click();});
function clean(value){state.clean=value;document.body.classList.toggle('clean',value);document.querySelectorAll('.chrome').forEach(el=>el.inert=value);$('restore').hidden=!value;if(value)$('restore').focus();else $('hide').focus();}
$('hide').addEventListener('click',()=>clean(true));$('restore').addEventListener('click',()=>clean(false));
$('about').addEventListener('click',()=>$('info').showModal());$('close-info').addEventListener('click',()=>$('info').close());
$('info').addEventListener('click',e=>{if(e.target===$('info')){const r=$('info').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('info').close();}});
addEventListener('keydown',e=>{if(e.key==='Escape'&&state.clean)clean(false);});
addEventListener('resize',resize);
document.addEventListener('visibilitychange',()=>{previous=0;if(document.hidden){cancelAnimationFrame(raf);raf=null;}else{dirty=true;ensureLoop();}});
motionQuery.addEventListener('change',e=>{state.reduced=e.matches;state.sea=!e.matches;setPlaying(false);$('sea-label').textContent=state.sea?'流动':'静止';$('sea').setAttribute('aria-pressed',String(state.sea));dirty=true;ensureLoop();});
if(state.reduced){$('sea-label').textContent='静止';$('sea').setAttribute('aria-pressed','false');}
window.__study={getState:()=>({...state,fps,sun:solarDirection.toArray(),drawCalls:renderer?.info.render.calls,triangles:renderer?.info.render.triangles,model:bridge?.children.length,timezone:'Asia/Shanghai',location:LOCATION})};
addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(raf);clearTimeout(envTimer);if(camera)gsap.killTweensOf(camera.position);gsap.killTweensOf(viewTarget);scene?.traverse(o=>{o.geometry?.dispose();if(o.material){const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m.dispose());}});water?.material.uniforms.normalSampler.value.dispose();water?.material.uniforms.mirrorSampler.value.dispose();sun?.shadow.dispose();envTarget?.dispose();pmrem?.dispose();renderer?.dispose();});
addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
updateTimes();updateLight();init();

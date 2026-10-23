import{r as v,R as t,c as it}from"./react-dbfpew6W.js";import{W as ot,S as He,C as st,P as lt,D as Ue,V as ee,a as H,b as je,c as ke,M as $e,R as Ge,d as Me,L as Se,e as Ye,f as ct,H as ut,T as dt,g as mt,N as ht,h as pt,i as ft,j as U}from"./water-renderer-B3RKq6hH.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function a(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=a(i);fetch(i.href,r)}})();function ne(o){return(o%1440+1440)%1440}function Ke(o=new Date){return o.getHours()*60+o.getMinutes()}function Ce(o){const e=(Math.round(o)%1440+1440)%1440,a=Math.floor(e/60);return`${a%12||12}:${String(e%60).padStart(2,"0")} ${a<12?"a.m.":"p.m."}`}function _e(o){return o=ne(o),o<300||o>=1260?"Moonlit stillness":o<480?"The world wakes slowly":o<960?"An unhurried afternoon":o<1140?"A little golden hour":"The last light lingers"}function de(o){const e=ne(o)/60,a=Math.max(0,Math.min(1,Math.sin((e-6)/12*Math.PI)*1.5)),n=Math.exp(-Math.pow((e-18)/1.7,2))+.45*Math.exp(-Math.pow((e-6.5)/1.3,2)),i=(1-Math.min(1,a*2.5))*(1-Math.min(1,n*.9));return{daylight:a,warmth:n,night:i}}function Xe(o){const e=ne(o)/60;return{morningMist:Math.exp(-Math.pow((e-6.4)/1.35,2)),cloudCover:.51+.065*Math.sin((e-8)/24*Math.PI*2)}}function vt(o=256){const e=new Uint8Array(o*o*4),a=(i,r,l)=>{let s=Math.imul(i+l*19,374761393)^Math.imul(r+l*7,668265263);return s=Math.imul(s^s>>>13,1274126177),((s^s>>>16)>>>0)/4294967295},n=(i,r,l,s)=>{const h=i*l,d=r*l,g=Math.floor(h),x=Math.floor(d),A=h-g,C=d-x,b=A*A*(3-2*A),R=C*C*(3-2*C),m=a(g%l,x%l,s),c=a((g+1)%l,x%l,s),w=a(g%l,(x+1)%l,s),f=a((g+1)%l,(x+1)%l,s);return(m+(c-m)*b)*(1-R)+(w+(f-w)*b)*R};for(let i=0;i<o;i++)for(let r=0;r<o;r++){const l=r/o,s=i/o,h=(i*o+r)*4;e[h]=Math.round(255*(n(l,s,4,7)*.56+n(l,s,8,19)*.28+n(l,s,16,31)*.12+n(l,s,32,43)*.04)),e[h+1]=Math.round(255*(n(l,s,8,57)*.7+n(l,s,24,73)*.3)),e[h+2]=Math.round(255*(n(l,s,4,97)*.7+n(l,s,16,103)*.3)),e[h+3]=255}return e}const z={position:[0,1.9,-4.6],pitch:22*Math.PI/180,tanHalfFov:Math.tan(20.5*Math.PI/180)},B=[-12,-5,24,28];function gt(o,e,a,n){if(a<=0||n<=0)return null;const i=(o/a*2-1)*a/n*z.tanHalfFov,r=(1-e/n*2)*z.tanHalfFov,l=-Math.sin(z.pitch)+Math.cos(z.pitch)*r,s=Math.cos(z.pitch)+Math.sin(z.pitch)*r;if(l>=-.001)return null;const h=-1.9/l;return[z.position[0]+i*h,z.position[2]+s*h]}function yt(o){const e=(o[0]-B[0])/B[2],a=(o[1]-B[1])/B[3];return e>0&&e<1&&a>0&&a<1?[e,a]:null}function Ze(o){const e=(o/60-6)/12*Math.PI,a=Math.max(.08,Math.sin(e)*.86),n=Math.sqrt(1-a*a),i=o/1440*Math.PI*2,r=Math.sin(i)*.78;return[r*n,a,Math.sqrt(1-r*r)*n]}const wt=[[.24,.97,2.4,.04],[-.32,.95,4.3,.024],[.55,.84,7.7,.011],[-.18,.98,12.7,.0038],[.46,.89,20.3,.0018],[-.54,.84,32.9,8e-4],[.16,.99,51.7,35e-5],[-.71,.7,81.3,16e-5],[.34,.94,122,85e-6],[-.39,.92,179,35e-6]];function Qe(o){const e=(o/60+2)/24*Math.PI*2,a=-.045+.055*Math.sin(e),n=.31+.035*Math.cos(e);return[a,n,Math.sqrt(1-a*a-n*n)]}const Je=`
varying vec2 vUv;
void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }
`,xt=`
precision highp float;
uniform sampler2D uPrevious;
uniform vec2 uTexel;
uniform vec4 uImpulse;
uniform vec3 uStrokeStart;
varying vec2 vUv;
void main(){
  vec2 state=texture2D(uPrevious,vUv).rg;
  float neighbors=texture2D(uPrevious,vUv+vec2(uTexel.x,0.)).r
    +texture2D(uPrevious,vUv-vec2(uTexel.x,0.)).r
    +texture2D(uPrevious,vUv+vec2(0.,uTexel.y)).r
    +texture2D(uPrevious,vUv-vec2(0.,uTexel.y)).r;
  float velocity=(state.y+(neighbors-4.*state.x)*.235)*.993;
  float height=state.x+velocity;
  float edge=min(min(vUv.x,1.-vUv.x),min(vUv.y,1.-vUv.y));
  float damping=mix(.78,1.,smoothstep(0.,.065,edge));
  vec2 segment=(uImpulse.xy-uStrokeStart.xy)*vec2(24.,28.);
  vec2 point=(vUv-uStrokeStart.xy)*vec2(24.,28.);
  float along=clamp(dot(point,segment)/max(dot(segment,segment),.00001),0.,1.);
  vec2 offset=point-segment*along;
  float q=dot(offset,offset)/max(uImpulse.w,.0001);
  // Depress the finger's path and push displaced water onto its banks.
  float brush=mix(-exp(-q),(q-1.)*exp(-q),uStrokeStart.z);
  float push=uImpulse.z*brush;
  height+=push;
  velocity+=push*.16*uStrokeStart.z;
  gl_FragColor=vec4(clamp(height*damping,-.3,.3),velocity*damping,0.,1.);
}
`,bt=`
precision highp float;
uniform sampler2D uBedColor,uBedNormal,uBedHeight,uBedAO,uEnvironment,uClouds,uWeather,uSimulation;
uniform vec2 uResolution,uSimTexel;
uniform vec3 uCamera,uForward,uUp,uSun,uMoon;
uniform vec4 uBounds;
uniform vec4 uWaves[10];
uniform vec4 uRipples[8];
uniform vec4 uWakeSegments[12],uWakeParams[12];
uniform float uTime,uWaveTime,uSkyTravel,uAspect,uTanFov,uDaylight,uWarmth,uNight,uSimEnabled;
uniform float uMorningMist,uCloudCover;
varying vec2 vUv;
const float PI=3.14159265359;
const float IOR=1.333;

vec2 simUV(vec2 p){return (p-uBounds.xy)/uBounds.zw;}
float interaction(vec2 p){
  vec2 uv=simUV(p);
  if(uv.x<=0.||uv.y<=0.||uv.x>=1.||uv.y>=1.)return 0.;
  return texture2D(uSimulation,uv).r*uSimEnabled;
}

// The same surface supplies the ray intersection, reflected direction,
// refracted direction and sunlight footprint. Derivatives are analytic.
vec3 surface(vec2 p,float footprint){
  vec3 result=vec3(0.);
  for(int i=0;i<10;i++){
    vec4 wave=uWaves[i];
    float k=wave.z;
    float waveFilter=1.-smoothstep(1.1,3.5,k*footprint);
    float modulationPhase=dot(p,vec2(.36,-.27))+float(i)*1.7+uWaveTime*.045;
    float phaseWarp=sin(dot(p,vec2(.29,.43))+float(i)*.8);
    vec2 warpGradient=cos(dot(p,vec2(.29,.43))+float(i)*.8)*vec2(.29,.43);
    float phase=dot(wave.xy,p)*k+phaseWarp*.65-uWaveTime*sqrt(9.81*k)*.43+float(i)*2.17;
    float modulation=.72+.28*sin(modulationPhase);
    float amplitude=wave.w*waveFilter*modulation;
    result.x+=amplitude*sin(phase);
    result.yz+=amplitude*cos(phase)*(k*wave.xy+warpGradient*.65)
      +wave.w*waveFilter*.28*cos(modulationPhase)*vec2(.36,-.27)*sin(phase);
  }
  float h=interaction(p);
  vec2 delta=uSimTexel*uBounds.zw;
  result.x+=h;
  result.y+=(interaction(p+vec2(delta.x,0.))-interaction(p-vec2(delta.x,0.)))/(2.*delta.x);
  result.z+=(interaction(p+vec2(0.,delta.y))-interaction(p-vec2(0.,delta.y)))/(2.*delta.y);
  // Physical-distance rings cover devices without floating-point render targets
  // and add a fine leading wave to the coarser simulated displacement field.
  for(int i=0;i<8;i++){
    float age=uTime-uRipples[i].z;
    if(age<0.||age>7.)continue;
    vec2 dp=p-uRipples[i].xy;
    float distance=length(dp)+.001;
    float center=distance-age*1.15;
    float envelope=exp(-center*center*6.)*exp(-age*.85)*uRipples[i].w;
    float phase=distance*16.-age*19.;
    float amp=.018*mix(1.,.35,uSimEnabled);
    result.x+=sin(phase)*envelope*amp;
    result.yz+=dp/distance*envelope*amp*(16.*cos(phase)-12.*center*sin(phase));
  }
  // Short directional wakes resolve the finger-sized groove immediately.
  // They share the water height and normal, so refraction and moonlight bend too.
  vec3 wake=vec3(0.);
  for(int i=0;i<12;i++){
    float age=uTime-uWakeParams[i].x;
    if(age<0.||age>2.8||uWakeParams[i].y<=0.)continue;
    vec4 segment=uWakeSegments[i];
    vec2 axis=segment.zw-segment.xy;
    float along=clamp(dot(p-segment.xy,axis)/max(dot(axis,axis),.00001),0.,1.);
    vec2 dp=p-mix(segment.xy,segment.zw,along);
    float distance=length(dp)+.0001;
    float width=uWakeParams[i].z+age*.055;
    float q=(distance-age*.58)/width;
    float hollow=exp(-2.*q*q);
    float crest=exp(-2.*(q-1.35)*(q-1.35));
    float fade=exp(-age*1.35)*(1.-smoothstep(2.,2.8,age));
    float amplitude=uWakeParams[i].y*fade;
    wake.x+=amplitude*(-hollow+.55*crest);
    float slope=amplitude*(4.*q*hollow-2.2*(q-1.35)*crest)/width;
    wake.yz+=dp/distance*slope;
  }
  // Bound overlapping trails, with the matching derivative of the soft limit.
  float wakeScale=1./(1.+abs(wake.x)/.075);
  result+=vec3(wake.x*wakeScale,wake.yz*wakeScale*wakeScale);
  return result;
}

vec2 bedUV(vec2 p){return mat2(.94,.342,-.342,.94)*p*.255+vec2(.17,.38);}
float depthAt(vec2 p){float z=max(p.y+3.,0.);return .24+.066*z+.0035*z*z;}
float bedY(vec2 p,float lod){return -depthAt(p)+(textureLod(uBedHeight,bedUV(p),lod).r-.45)*.19;}

vec3 findBed(vec3 p,vec3 ray,float lod){
  float start=0.;
  float end=(depthAt(p.xz)+.3)/max(-ray.y-.14*max(ray.z,0.),.18);
  float stride=end/24.;
  float travel=0.;
  for(int i=0;i<24;i++){
    travel+=stride;
    vec3 q=p+ray*travel;
    if(q.y<bedY(q.xz,lod))break;
    start=travel;
  }
  end=travel;
  for(int i=0;i<6;i++){
    float middle=(start+end)*.5;
    vec3 q=p+ray*middle;
    if(q.y>bedY(q.xz,lod))start=middle;else end=middle;
  }
  return p+ray*(start+end)*.5;
}

float fresnel(float cosine){
  float transmitted=sqrt(1.-(1.-cosine*cosine)/(IOR*IOR));
  float a=(cosine-IOR*transmitted)/(cosine+IOR*transmitted);
  float b=(IOR*cosine-transmitted)/(IOR*cosine+transmitted);
  return .5*(a*a+b*b);
}

// Two cloud decks move at different speeds on a shared sky plane. The same
// field supplies reflected clouds, direct-light occlusion and drifting shadows.
vec2 skyPlane(vec3 direction){return direction.xz/(max(direction.y,0.)+.28)*.38;}
vec2 cloudLayers(vec2 p){
  vec2 wind=vec2(uSkyTravel,uSkyTravel*.31);
  vec3 low=texture2D(uWeather,p+wind).rgb;
  vec3 high=texture2D(uWeather,p*vec2(.72,1.55)+wind*.47+vec2(.37,.21)).rgb;
  float body=smoothstep(.54-uCloudCover*.20,.72-uCloudCover*.20,low.r+(low.g-.5)*.10);
  float wisps=smoothstep(.50,.75,high.b+(high.g-.5)*.14)*.32;
  return vec2(body,wisps);
}
float cloudShade(vec3 light,vec2 ground){
  vec2 layers=cloudLayers(skyPlane(light)+ground*.017);
  return 1.-layers.x*.52-layers.y*.28;
}

vec3 environment(vec3 direction,float lod){
  direction.y=max(direction.y,.015);
  direction=normalize(direction);
  vec2 uv=vec2(atan(direction.x,direction.z)/(2.*PI)+.21,asin(direction.y*.68)/PI+.5);
  vec3 radiance=textureLod(uEnvironment,uv,lod).rgb;
  float skyMask=smoothstep(1.06,1.32,radiance.b/max(radiance.g,.001));
  vec3 cloudLight=textureLod(uClouds,vec2(uv.x+uSkyTravel*.48,asin(direction.y)/PI+.5),lod).rgb;
  // Cap the photographed solar disk; the moving sun is evaluated separately.
  radiance=min(radiance,vec3(7.));
  float luminance=dot(radiance,vec3(.2126,.7152,.0722));
  vec3 day=radiance*.90;
  vec3 dusk=pow(max(radiance,vec3(.001)),vec3(.85))*vec3(1.16,.48,.20);
  vec3 night=mix(vec3(luminance),radiance,.38)*vec3(.09,.13,.19)+vec3(.008,.014,.024);
  vec3 color=mix(night,day,uDaylight);
  color=mix(color,dusk*.56,uWarmth*.9);
  vec2 layers=cloudLayers(skyPlane(direction));
  float density=clamp(layers.x+layers.y,0.,1.);
  float horizon=pow(1.-direction.y,3.);
  float sunward=pow(max(dot(direction,uSun),0.),5.);
  vec3 clearDay=mix(vec3(.17,.36,.57),vec3(.64,.76,.83),horizon*.7);
  // HDR detail adds photographic variation inside the moving cloud forms.
  vec3 cloudDay=mix(vec3(.68,.78,.89),vec3(1.6,1.65,1.67),smoothstep(.1,.85,layers.x));
  cloudDay*=clamp(dot(cloudLight,vec3(.2126,.7152,.0722))*.2+.8,.8,1.25);
  vec3 daySky=mix(clearDay,cloudDay,density);
  vec3 duskSky=mix(vec3(.22,.19,.32),vec3(1.15,.49,.20),horizon*.55+sunward*.35);
  vec3 litCloud=mix(vec3(.48,.30,.35),vec3(1.65,.85,.39),.25+sunward*.65);
  duskSky=mix(duskSky,litCloud,density);
  vec3 nightSky=mix(vec3(.010,.019,.038),vec3(.047,.063,.096),density);
  vec3 sky=mix(nightSky,daySky,uDaylight);
  sky=mix(sky,duskSky,uWarmth*.85);
  // The bank remains anchored; only exposed sky receives the cloud field.
  color=mix(color,sky,skyMask*.92);
  // A moon in the reflected environment: wave normals break its disk and halo.
  float moonAngle=length(direction-uMoon);
  float disk=1.-smoothstep(.010,.014,moonAngle);
  float halo=exp(-moonAngle*moonAngle/ .005)*.22;
  float moonDetail=.88+.08*sin(direction.x*510.)*sin(direction.y*390.);
  color+=vec3(.78,.87,1.)*(disk*7.*moonDetail+halo)*uNight*(1.-density*.70);
  return color;
}

vec3 toneMap(vec3 c){
  // ACES fitted curve, followed by linear-to-display transfer.
  c=clamp((c*(2.51*c+.03))/(c*(2.43*c+.59)+.14),0.,1.);
  return mix(c*12.92,1.055*pow(c,vec3(1./2.4))-.055,step(vec3(.0031308),c));
}

void main(){
  vec2 ndc=vUv*2.-1.;
  vec3 ray=normalize(uForward+vec3(1.,0.,0.)*ndc.x*uTanFov*uAspect+uUp*ndc.y*uTanFov);
  float travel=-uCamera.y/min(ray.y,-.015);
  vec3 p=uCamera+ray*travel;
  float footprint=travel*uTanFov*2./uResolution.y/max(-ray.y,.12);
  // Two heightfield intersection corrections, not screen-space image distortion.
  for(int i=0;i<2;i++){
    float height=surface(p.xz,footprint).x;
    travel=(height-uCamera.y)/ray.y;
    p=uCamera+ray*travel;
  }
  vec3 wave=surface(p.xz,footprint);
  vec3 n=normalize(vec3(-wave.y,1.,-wave.z));
  vec3 view=-ray;
  if(dot(n,view)<.025)n=normalize(mix(n,vec3(0.,1.,0.),.55));
  float nv=max(dot(n,view),.001);
  float F=fresnel(nv);
  vec3 reflected=reflect(ray,n);
  float envLod=clamp(log2(max(footprint*65.,1.)),0.,3.5);
  vec3 reflection=environment(reflected,envLod);

  vec3 transmitted=refract(ray,n,1./IOR);
  float bedLod=clamp(log2(max(footprint*220.,1.)),0.,6.);
  vec3 bed=findBed(p,transmitted,bedLod);
  vec2 uv=bedUV(bed.xz);
  vec3 albedo=textureLod(uBedColor,uv,bedLod).rgb;
  vec3 materialNormal=textureLod(uBedNormal,uv,bedLod).xyz*2.-1.;
  vec2 horizontalNormal=mat2(.94,-.342,.342,.94)*materialNormal.xy;
  vec3 bedNormal=normalize(vec3(horizontalNormal.x,materialNormal.z,horizontalNormal.y));
  float ao=textureLod(uBedAO,uv,bedLod*.5).r;
  // Wet stone: suppress dry diffuse haze without baking shadows into its color.
  albedo=mix(vec3(dot(albedo,vec3(.2126,.7152,.0722))),albedo,.72)*.70;
  vec3 extinction=vec3(.54,.205,.115);
  float underwaterDistance=length(bed-p);
  vec3 transmission=exp(-extinction*underwaterDistance);
  vec3 keyLight=normalize(mix(uSun,uMoon,uNight));
  vec3 lightRay=refract(-keyLight,n,1./IOR);
  float depth=max(.05,p.y-bed.y);
  vec2 lightFootprint=p.xz+lightRay.xz*depth/max(-lightRay.y,.1);
  vec2 pdx=dFdx(p.xz),pdy=dFdy(p.xz),ldx=dFdx(lightFootprint),ldy=dFdy(lightFootprint);
  float area=abs(pdx.x*pdy.y-pdx.y*pdy.x);
  float focused=abs(ldx.x*ldy.y-ldx.y*ldy.x);
  float flux=clamp(area/max(focused,area*.16),.28,5.);
  float caustic=mix(1.,flux,.4*exp(-depth*.35));
  vec3 lightColor=mix(vec3(1.,.95,.85),vec3(1.,.53,.25),uWarmth);
  float sunVisibility=cloudShade(uSun,bed.xz);
  float moonVisibility=cloudShade(uMoon,bed.xz);
  float sunStrength=uDaylight*(1.-uWarmth*.5)*sunVisibility;
  vec3 underwaterSun=-refract(-uSun,vec3(0.,1.,0.),1./IOR);
  float lambert=max(dot(bedNormal,underwaterSun),0.);
  vec3 lightTransmission=exp(-extinction*depth/max(underwaterSun.y,.15));
  vec3 ambient=vec3(.21,.27,.31)*(.045+uDaylight*.7+uWarmth*.2)+vec3(.036,.054,.080)*uNight;
  vec3 illumination=ambient*mix(.35,1.,ao)+lightColor*sunStrength*lambert*lightTransmission*caustic*.64;
  vec3 underwaterMoon=-refract(-uMoon,vec3(0.,1.,0.),1./IOR);
  illumination+=vec3(.16,.21,.29)*uNight*max(dot(bedNormal,underwaterMoon),0.)*lightTransmission*mix(1.,caustic,.45)*moonVisibility;
  vec3 bottom=albedo*illumination;
  vec3 scatter=vec3(.014,.049,.057)*(.035+uDaylight*.55+uWarmth*.12+uNight*.5);
  vec3 through=bottom*transmission+scatter*(1.-transmission);
  vec3 color=mix(through,reflection,F);

  // Sun glints use this same wave normal, so they move with the actual surface.
  vec3 halfVector=normalize(view+uSun);
  float nh=max(dot(n,halfVector),0.);
  float roughness=.026+min(footprint*.1,.06);
  float a2=roughness*roughness;
  float denominator=nh*nh*(a2-1.)+1.;
  float distribution=a2/(PI*denominator*denominator);
  float highlight=min(distribution*.013,3.5)*sunStrength*max(dot(n,uSun),0.);
  color+=lightColor*highlight;
  vec3 moonHalf=normalize(view+uMoon);
  float moonNH=max(dot(n,moonHalf),0.);
  float moonRoughness=.018+min(footprint*.08,.035);
  float moonA2=moonRoughness*moonRoughness;
  float moonD=moonNH*moonNH*(moonA2-1.)+1.;
  float moonGlitter=min(moonA2/(PI*moonD*moonD)*.007,2.8);
  color+=vec3(.68,.82,1.)*moonGlitter*uNight*max(dot(n,uMoon),0.)*moonVisibility;
  // A thin moving mist sits over distant water at dawn, leaving near stones clear.
  float mistShape=texture2D(uWeather,p.xz*vec2(.013,.026)+vec2(uSkyTravel*.65,0.)).g;
  float mist=(1.-exp(-max(travel-5.,0.)*.045))*uMorningMist*(.15+mistShape*.22);
  vec3 mistColor=mix(vec3(.32,.43,.49),vec3(.62,.48,.36),uWarmth*.55);
  color=mix(color,mistColor,mist);
  float vignette=1.-.15*dot(ndc*.65,ndc*.65);
  color=toneMap(color*(1.45+uNight*.3))*vignette;
  gl_FragColor=vec4(color,1.);
}
`;function Et({minutes:o,motion:e,onReady:a,onWaterInteraction:n}){const i=v.useRef(null),r=v.useRef({minutes:o,motion:e,onWaterInteraction:n});r.current={minutes:o,motion:e,onWaterInteraction:n},v.useEffect(()=>{const s=i.current,h=window.matchMedia("(pointer: coarse)").matches||innerWidth<700;let d;try{d=new ot({antialias:!1,alpha:!0,powerPreference:"high-performance"})}catch{s.dataset.status="fallback",a();return}d.setClearColor(0,0),d.domElement.setAttribute("aria-label","实时渲染的湖面"),s.appendChild(d.domElement),s.dataset.renderer="physical-water",s.dataset.status="loading";const g=new He,x=new st;let A=null;d.debug.onShaderError=(u,k,y,I)=>{A=new Error([u.getProgramInfoLog(k),u.getShaderInfoLog(y),u.getShaderInfoLog(I)].filter(Boolean).join(`
`)),console.error("Physical water shader could not compile.",A)};const C=new lt(2,2),b=new Ue(new Uint8Array([0,0,0,255]),1,1);b.needsUpdate=!0;const R=de(r.current.minutes),m=Xe(r.current.minutes),c={uBedColor:{value:b},uBedNormal:{value:b},uBedHeight:{value:b},uBedAO:{value:b},uEnvironment:{value:b},uClouds:{value:b},uWeather:{value:b},uSimulation:{value:b},uMorningMist:{value:m.morningMist},uCloudCover:{value:m.cloudCover},uResolution:{value:new ke(1,1)},uSimTexel:{value:new ke(1/256,1/256)},uCamera:{value:new H(...z.position)},uForward:{value:new H(0,-Math.sin(z.pitch),Math.cos(z.pitch))},uUp:{value:new H(0,Math.cos(z.pitch),Math.sin(z.pitch))},uSun:{value:new H(...Ze(r.current.minutes))},uMoon:{value:new H(...Qe(r.current.minutes))},uNight:{value:R.night},uBounds:{value:new ee(...B)},uWaves:{value:wt.map(u=>new ee(...u))},uWakeSegments:{value:Array.from({length:12},()=>new ee)},uWakeParams:{value:Array.from({length:12},()=>new ee(-100,0,.2,0))},uRipples:{value:Array.from({length:8},()=>new ee(-100,-100,-100,0))},uWaveTime:{value:0},uSkyTravel:{value:0},uTime:{value:0},uAspect:{value:1},uTanFov:{value:z.tanHalfFov},uDaylight:{value:R.daylight},uWarmth:{value:R.warmth},uSimEnabled:{value:0}},w=new je({uniforms:c,vertexShader:Je,fragmentShader:bt});g.add(new $e(C,w));const f=[b],E=new Ue(vt(),256,256,Ge);E.wrapS=E.wrapT=Me,E.magFilter=Se,E.minFilter=Ye,E.generateMipmaps=!0,E.needsUpdate=!0,c.uWeather.value=E,f.push(E);let S=!1,V=!1,L=0,X=0,O=0,re=0,Z=!0,P=0,M=null,D=[],ie=0,oe=0;const te=d.extensions.has("EXT_color_buffer_float"),$=h?256:384;c.uSimTexel.value.set(1/$,1/$);const ae=te?[0,1].map(()=>new ct($,$,{type:ut,format:Ge,minFilter:Se,magFilter:Se,depthBuffer:!1,stencilBuffer:!1})):[],Q=new He,G={uStrokeStart:{value:new H},uPrevious:{value:b},uTexel:{value:new ke(1/$,1/$)},uImpulse:{value:new ee(-10,-10,0,.06)}},ce=new je({uniforms:G,vertexShader:Je,fragmentShader:xt});Q.add(new $e(C,ce));for(const u of ae)d.setRenderTarget(u),d.clear();d.setRenderTarget(null),c.uSimEnabled.value=te?1:0,s.dataset.simulation=te?"height-velocity":"analytic-ripples";const me=new dt,p=async(u,k,y=!1)=>{const I=await me.loadAsync(`./materials/${u}`);if(S){I.dispose();return}f.push(I),I.wrapS=I.wrapT=Me,I.anisotropy=Math.min(8,d.capabilities.getMaxAnisotropy()),I.colorSpace=y?mt:ht,c[k].value=I},Y=async(u,k)=>{const y=await new pt().loadAsync(`./materials/${u}`);if(S){y.dispose();return}y.wrapS=Me,y.wrapT=ft,y.generateMipmaps=!0,y.minFilter=Ye,f.push(y),c[k].value=y};Promise.all([p("bed-color.jpg","uBedColor",!0),p("bed-normal.jpg","uBedNormal"),p("bed-height.jpg","uBedHeight"),p("bed-ao.jpg","uBedAO"),Y("lakeside.hdr","uEnvironment"),Y("clouds.hdr","uClouds")]).then(()=>{if(!S){if(d.compile(g,x),te&&d.compile(Q,x),A)throw A;V=!0,Z=!0,s.dataset.status="ready",a()}}).catch(u=>{S||(s.dataset.status="fallback",console.warn("Water materials could not load; keeping the static cover.",u),a())});let T=1;const N=()=>{const u=h?105e4:22e5,k=Math.min(window.devicePixelRatio,h?1.7:2,Math.sqrt(u/(innerWidth*innerHeight)))*T;d.setPixelRatio(k),d.setSize(innerWidth,innerHeight),d.getDrawingBufferSize(c.uResolution.value),c.uAspect.value=innerWidth/innerHeight,Z=!0};N(),window.addEventListener("resize",N);const W=u=>gt(u.clientX,u.clientY,innerWidth,innerHeight),nt=(u,k)=>{if(!u)return;const y=yt(u);y&&(D.push({value:new ee(y[0],y[1],k,.032),start:new H(y[0],y[1],0)}),D.length>16&&D.shift()),c.uRipples.value[P].set(u[0],u[1],X,k/.05),P=(P+1)%8,s.dataset.interactions=String(Number(s.dataset.interactions||0)+1),Z=!0},rt=(u,k,y,I)=>{const K=Math.sqrt(U.clamp(y/1e3,0,1)),F=.14+.045*K+.09*(1-U.clamp(I,0,1)),se=Math.hypot(k[0]-u[0],k[1]-u[1]),_=U.clamp(se/F,.08,1),ve=(.048+.036*K)*_,ue=[(k[0]-B[0])/B[2],(k[1]-B[1])/B[3]],be=new H((u[0]-B[0])/B[2],(u[1]-B[1])/B[3],1);D.push({value:new ee(ue[0],ue[1],ve,F*F),start:be}),D.length>16&&D.shift(),c.uWakeSegments.value[oe].set(u[0],u[1],k[0],k[1]),c.uWakeParams.value[oe].set(X,.018+.014*K,F,0),oe=(oe+1)%12,s.dataset.interactions=String(Number(s.dataset.interactions||0)+1),s.dataset.wakes=String(Number(s.dataset.wakes||0)+1),Z=!0},he=(u,k,y={})=>r.current.onWaterInteraction?.({type:u,x:k.clientX/innerWidth,y:k.clientY/innerHeight,...y}),J=()=>{M&&r.current.onWaterInteraction?.({type:"cancel"}),M=null},Re=u=>{!V||!r.current.motion||u.button>0||u.target.closest("button,a,dialog,input")||(J(),M={id:u.pointerId,point:W(u),time:performance.now(),px:u.clientX,py:u.clientY,travel:0,dragged:!1},he("start",u))},Pe=u=>{if(!M||M.id!==u.pointerId)return;if(!r.current.motion||u.pointerType==="mouse"&&!(u.buttons&1)){J();return}const k=performance.now(),y=W(u),I=k-M.time;if(!y||!M.point||I<25)return;const K=Math.hypot(u.clientX-M.px,u.clientY-M.py);if(M.travel+=K,M.travel>8&&(M.dragged=!0),M.dragged&&K>.5){const F=K/Math.max(I,8)*1e3;rt(M.point,y,F,u.clientY/innerHeight),he("drag",u,{speed:F,travel:M.travel})}Object.assign(M,{point:y,time:k,px:u.clientX,py:u.clientY})},De=u=>{if(M?.id!==u.pointerId)return;const k=Math.hypot(u.clientX-M.px,u.clientY-M.py)+M.travel;!M.dragged&&k<=8&&r.current.motion&&(nt(W(u),.065),he("splash",u)),he("end",u),M=null},Fe=u=>{M?.id===u.pointerId&&J()},ze=()=>{document.hidden&&J()};window.addEventListener("pointerdown",Re),window.addEventListener("pointermove",Pe),window.addEventListener("pointerup",De),window.addEventListener("pointercancel",Fe),window.addEventListener("blur",J),document.addEventListener("visibilitychange",ze);let ye=r.current.minutes,pe=0,fe=0,we=performance.now(),xe=0;const We=u=>{if(S)return;if(L=requestAnimationFrame(We),M&&!r.current.motion&&J(),document.hidden){O=u,ye=r.current.minutes;return}const k=(u-O)/1e3;if(k<1/30-.0015)return;O=u;const y=Math.min(k,.05),I=r.current.minutes-ye;ye=r.current.minutes;const K=r.current.motion?Math.min(1,Math.abs(I)/Math.max(y,.001)/240):0;pe=U.lerp(pe,K,1-Math.exp(-y*5));const F=de(r.current.minutes),se=Xe(r.current.minutes),_=1-Math.exp(-y*7);c.uMorningMist.value=U.lerp(c.uMorningMist.value,se.morningMist,_),c.uCloudCover.value=U.lerp(c.uCloudCover.value,se.cloudCover,_),c.uDaylight.value=U.lerp(c.uDaylight.value,F.daylight,_),c.uWarmth.value=U.lerp(c.uWarmth.value,F.warmth,_),c.uNight.value=U.lerp(c.uNight.value,F.night,_);const ve=new H(...Qe(r.current.minutes));c.uMoon.value.lerp(ve,_).normalize();const ue=new H(...Ze(r.current.minutes));c.uSun.value.lerp(ue,_).normalize();const be=Math.abs(se.morningMist-c.uMorningMist.value)>1e-4||Math.abs(se.cloudCover-c.uCloudCover.value)>1e-4||c.uMoon.value.distanceTo(ve)>.001||Math.abs(F.night-c.uNight.value)>1e-4||Math.abs(F.daylight-c.uDaylight.value)>1e-4||Math.abs(F.warmth-c.uWarmth.value)>1e-4||c.uSun.value.distanceTo(ue)>.001;if(!(!V||!r.current.motion&&!be&&!Z)){if(r.current.motion)if(X+=y,c.uWaveTime.value+=y*(1+pe*2.4),c.uSkyTravel.value+=y*.0012+U.clamp(I,-60,60)*48e-5,re+=y,te){for(let qe=0;qe<3&&re>=1/60;qe++){G.uPrevious.value=ae[ie].texture;const Ee=D.shift();Ee?(G.uImpulse.value.copy(Ee.value),G.uStrokeStart.value.copy(Ee.start)):G.uImpulse.value.z=0;const Oe=1-ie;d.setRenderTarget(ae[Oe]),d.render(Q,x),ie=Oe,re-=1/60}c.uSimulation.value=ae[ie].texture}else D=[],re=0;s.dataset.sceneMinutes=r.current.minutes.toFixed(2),s.dataset.timeRush=pe.toFixed(3),s.dataset.skyTravel=c.uSkyTravel.value.toFixed(4),s.dataset.morningMist=c.uMorningMist.value.toFixed(3),s.dataset.cloudCover=c.uCloudCover.value.toFixed(3),c.uTime.value=X,d.setRenderTarget(null),d.render(g,x),Z=!1,fe++,k>.05&&xe++,u-we>2500&&(s.dataset.fps=String(Math.round(fe*1e3/(u-we))),xe>fe*.3&&T>.65&&(T=Math.max(.65,T*.88),N()),fe=0,xe=0,we=u)}};L=requestAnimationFrame(We);const Be=u=>{u.preventDefault(),s.classList.add("lost"),s.dataset.status="context-lost",cancelAnimationFrame(L),a()},Ve=()=>{window.location.reload()};return d.domElement.addEventListener("webglcontextlost",Be),d.domElement.addEventListener("webglcontextrestored",Ve),()=>{S=!0,cancelAnimationFrame(L),window.removeEventListener("resize",N),window.removeEventListener("pointerdown",Re),window.removeEventListener("pointermove",Pe),window.removeEventListener("pointerup",De),window.removeEventListener("pointercancel",Fe),window.removeEventListener("blur",J),document.removeEventListener("visibilitychange",ze),J(),d.domElement.removeEventListener("webglcontextlost",Be),d.domElement.removeEventListener("webglcontextrestored",Ve);for(const u of f)u.dispose();for(const u of ae)u.dispose();ce.dispose(),w.dispose(),C.dispose(),d.dispose(),d.domElement.remove()}},[a]);const l=de(o);return t.createElement("div",{className:"lake","aria-hidden":"true",style:{backgroundImage:"url(../lake.jpg)"}},t.createElement("div",{className:"lake-fallback-tone",style:{background:`rgba(3,12,30,${(1-l.daylight)*.64})`}}),t.createElement("div",{ref:i,className:"lake-canvas"}))}function kt(o,e){return o+((ne(e)-ne(o)+2160)%1440-720)}function Mt(o,e,a){const n=Math.max(0,Math.min(1,a));return o+(e-o)*(n*n*(3-2*n))}function St(o,e){return Math.floor(o/30)!==Math.floor(e/30)}const et=.32;function Tt(o,e,a){const n=Math.exp(-Math.max(0,a)/et);return{position:o+e*et*(1-n),velocity:e*n}}function At(o,e,a,n){const r=Math.max(0,n),l=o-a,s=e+19*l,h=Math.exp(-19*r);return{position:a+(l+s*r)*h,velocity:(e-19*s*r)*h}}function tt(o){return 720/(Math.max(1,o)*(.54+.46*Math.PI/2))}function Nt(o,e){const a=o.at(-1);if(!a||o.length<2||e-a.time>140)return 0;const n=o.find(l=>l.time>=a.time-100)||o[0],i=a.time-n.time;if(i<8)return 0;const r=(a.position-n.position)/i*1e3;return Math.max(-1600,Math.min(1600,r))*Math.exp(-Math.max(0,e-a.time)/75)}function Ct({minutes:o,target:e,travelTo:a,stop:n,coast:i,wheelBy:r,onManual:l}){const s=v.useRef(null),h=v.useRef(null),d=v.useRef({wheelBy:r,onManual:l});d.current={wheelBy:r,onManual:l},v.useEffect(()=>{const m=s.current,c=()=>{const E=h.current;h.current=null,E&&m.hasPointerCapture(E.id)&&m.releasePointerCapture(E.id),n()},w=E=>{E.preventDefault(),d.current.onManual();const S=E.deltaY*(E.deltaMode===1?16:E.deltaMode===2?m.clientHeight:1);d.current.wheelBy(Math.max(-180,Math.min(180,S*tt(m.clientHeight)*.6)))},f=()=>{document.hidden&&c()};return m.addEventListener("wheel",w,{passive:!1}),window.addEventListener("blur",c),document.addEventListener("visibilitychange",f),()=>{c(),m.removeEventListener("wheel",w),window.removeEventListener("blur",c),document.removeEventListener("visibilitychange",f)}},[n]);const g=m=>{if(m.button>0)return;l();const c=n(),w=performance.now();m.currentTarget.focus(),m.currentTarget.setPointerCapture(m.pointerId),h.current={id:m.pointerId,startY:m.clientY,position:c,scale:tt(m.currentTarget.clientHeight),samples:[{position:c,time:w}]}},x=m=>{const c=h.current;if(!c||c.id!==m.pointerId)return;const w=performance.now(),f=c.position+(c.startY-m.clientY)*c.scale;for(c.samples.push({position:f,time:w});c.samples.length>2&&c.samples[1].time<w-120;)c.samples.shift();a(f,{absolute:!0,duration:0})},A=(m,c=!1)=>{const w=h.current;if(!(!w||w.id!==m.pointerId)){if(h.current=null,m.currentTarget.hasPointerCapture(w.id)&&m.currentTarget.releasePointerCapture(w.id),c){n();return}i(Nt(w.samples,performance.now()))}},C=m=>{const c={ArrowUp:5,ArrowRight:5,ArrowDown:-5,ArrowLeft:-5,PageUp:60,PageDown:-60};!(m.key in c)&&m.key!=="Home"&&m.key!=="End"||(m.preventDefault(),l(),m.key==="Home"||m.key==="End"?a(m.key==="Home"?0:1439,{duration:900}):a(e.current+c[m.key],{absolute:!0,duration:120}))},b=o/30,R=Array.from({length:27},(m,c)=>Math.floor(b)+c-13);return t.createElement("div",{ref:s,className:"time-wheel",role:"slider",tabIndex:0,"aria-label":"一天中的时间","aria-orientation":"vertical","aria-valuemin":0,"aria-valuemax":1439,"aria-valuenow":ne(Math.round(o)),"aria-valuetext":Ce(o),"aria-describedby":"time-instructions",onPointerDown:g,onPointerMove:x,onPointerUp:m=>A(m),onPointerCancel:m=>A(m,!0),onLostPointerCapture:m=>A(m,!0),onKeyDown:C},t.createElement("div",{className:"wheel-ribs","aria-hidden":"true"},R.map(m=>{const c=(m-b)/12,w=Math.max(-1,Math.min(1,c))*Math.PI/2,f=Math.max(0,Math.cos(w)),E=.5+(c*.54+Math.sin(w)*.46)*.5;return t.createElement("i",{key:m,className:m%2===0?"hour":"",style:{top:`${E*100}%`,width:`${76+25*Math.pow(f,.72)}px`,opacity:Math.max(0,Math.pow(f,1.6))*.82}})})),t.createElement("div",{className:"wheel-needle","aria-hidden":"true"}))}function Lt(o,e,a){const[n,i]=v.useState(o),r=v.useRef(o),l=v.useRef(o),s=v.useRef(0),h=v.useRef(null),d=v.useRef({motion:e,onTick:a});d.current={motion:e,onTick:a};const g=v.useCallback(()=>(cancelAnimationFrame(s.current),s.current=0,h.current=null,l.current=r.current,r.current),[]),x=v.useCallback((m,c=!0)=>{c&&St(r.current,m)&&d.current.onTick?.(),r.current=m,i(m)},[]),A=v.useCallback((m,{duration:c=2600,absolute:w=!1,sound:f=!0}={})=>{const E=g(),S=w?m:kt(E,m);l.current=S;const V=performance.now();if(!d.current.motion||c<=0){x(S,f);return}const L=X=>{if(document.hidden){r.current=S,i(S),s.current=0;return}const O=d.current.motion?Math.min(1,(X-V)/c):1;x(Mt(E,S,O),f),s.current=O<1?requestAnimationFrame(L):0};s.current=requestAnimationFrame(L)},[g,x]),C=v.useCallback((m,c=0,w=r.current)=>{if(g(),!d.current.motion){l.current=w,x(w);return}const f={mode:m,velocity:c,destination:w,stamp:performance.now(),snapping:!1};h.current=f,l.current=w;const E=S=>{if(h.current!==f)return;if(document.hidden||!d.current.motion){g();return}const V=Math.min(.05,Math.max(0,(S-f.stamp)/1e3));f.stamp=S;const L=f.mode==="coast"?Tt(r.current,f.velocity,V):At(r.current,f.velocity,f.destination,V);if(f.velocity=L.velocity,x(L.position),f.mode==="coast"&&(l.current=L.position),Math.abs(f.velocity)<4&&(f.mode==="coast"||Math.abs(f.destination-L.position)<.2))if(!f.snapping)f.mode="wheel",f.snapping=!0,f.destination=Math.round(L.position/5)*5,l.current=f.destination;else{x(f.destination),g();return}s.current=requestAnimationFrame(E)};s.current=requestAnimationFrame(E)},[g,x]),b=v.useCallback(m=>C("coast",m),[C]),R=v.useCallback(m=>{const c=h.current;c?.mode==="wheel"&&d.current.motion?(c.destination+=m,c.snapping=!1,l.current=c.destination):C("wheel",0,r.current+m)},[C]);return v.useEffect(()=>()=>cancelAnimationFrame(s.current),[]),{minutes:n,clock:r,target:l,travelTo:A,stop:g,coast:b,wheelBy:R}}const q={name:"Zen",title:"Zen. — Learning through making",tagline:"Learning by making, one small experiment at a time.",signature:"Stay curious. Keep making.",about:[`正在学习如何用 AI，把脑海里的小想法变成可以看见、听见和触碰的体验。`,`我不是职业设计师，也还没有很多作品。这个空间记录的是我边学边做的过程：对光线、声音、交互和网页的好奇，以及每一次小小的尝试。`,`这里的第一件作品，就是这个仍在生长的网站。希望它能让你停留片刻，也提醒我继续创造一些美好的东西。`],email:"zzeng129@asu.edu",workIntro:"One honest experiment, still taking shape.",workNote:"更多内容会随着学习慢慢出现。现在，这里先记录这个网站本身。",projects:[{id:"stillwater",number:"01",name:"Stillwater",type:"LEARNING EXPERIMENT",year:"2026",caption:"The first thing I made here.",description:"这是我学习用 AI、视觉、声音和交互构建网页的第一次完整尝试。湖面会回应触碰，时间会改变光线，音乐让空间慢下来。它不是一份完成的设计作品集，而是一段正在发生的学习记录。",className:"water",label:"本网站 · 持续进行中的个人实验"}]},Te={ticks:[{url:"./audio/reference/time-tick.flac",gain:.24}],impacts:[{url:"./audio/reference/click1.flac",gain:2.1},{url:"./audio/reference/little-splash.flac",gain:1.15},{url:"./audio/reference/splash.flac",gain:10.8},{url:"./audio/reference/click-x.flac",gain:4.27},{url:"./audio/reference/click-y.flac",gain:7.08},{url:"./audio/reference/anothaone.flac",gain:4.64}],drags:[{url:"./audio/reference/swoosh-2.mp3",gain:.26,entry:.17,end:.92},{url:"./audio/reference/swoosh-3.mp3",gain:.36,entry:.07,end:.9},{url:"./audio/reference/swoosh-4.mp3",gain:.31,entry:.06,end:.82},{url:"./audio/reference/swoosh-5.mp3",gain:.5,entry:.16,end:.86}]},It=(o,e,a)=>Math.max(e,Math.min(a,o)),Le=(o,e,a)=>{const n=It((a-o)/(e-o),0,1);return n*n*(3-2*n)},Ie=o=>Le(.06,.52,o);function Ae({speed:o=0,travel:e=0,y:a=.5}={}){return e<16||o<40?0:Ie(a)*(.45+.55*Le(16,90,e))*(.4+.6*Le(40,900,o))}function at(o,e=-1,a=Math.random){if(o<1)return-1;if(o===1)return 0;if(e<0||e>=o)return Math.floor(a()*o);const n=Math.floor(a()*(o-1));return n>=e?n+1:n}const ge=(o,e,a)=>Math.max(e,Math.min(a,o));class Rt{constructor(){this.context=null,this.nodes=[],this.voices=new Set,this.volume=.65,this.timeTicks=0,this.lastTick=-1,this.night=0,this.track=0,this.disposed=!1,this.splashes=0,this.dragStarts=0,this.lastImpact=-1,this.lastStroke=-1,this.gesture=null,this.sampleState="loading",this.abort=new AbortController,this.sampleBytes=Object.fromEntries(Object.entries(Te).map(([e,a])=>[e,a.map(n=>fetch(n.url,{signal:this.abort.signal}).then(i=>{if(!i.ok)throw new Error("Water sample unavailable");return i.arrayBuffer()}).catch(()=>null))]))}keep(...e){return this.nodes.push(...e),e[0]}build(){const e=this.context;this.bus=this.keep(e.createGain()),this.bus.gain.value=0,this.compressor=this.keep(e.createDynamicsCompressor()),this.compressor.threshold.value=-14,this.compressor.knee.value=16,this.compressor.ratio.value=5,this.compressor.attack.value=.006,this.compressor.release.value=.22,this.analyser=this.keep(e.createAnalyser()),this.analyser.fftSize=1024,this.samples=new Float32Array(1024),this.bus.connect(this.compressor),this.compressor.connect(this.analyser),this.analyser.connect(e.destination)}async play(){if(this.disposed)return;this.context||(this.context=new(window.AudioContext||window.webkitAudioContext));const e=this.context,a=e.resume();if(this.bus||(this.build(),this.prepareSamples()),await a,!this.disposed){if(e.state!=="running")throw new Error("Audio did not start");this.bus.gain.setTargetAtTime(this.volume,e.currentTime,.35)}}setVolume(e){this.volume=ge(e,0,1),this.bus&&this.bus.gain.setTargetAtTime(this.volume,this.context.currentTime,.08)}setNight(e){this.night=ge(e,0,1)}voice(e,a,n){const i={nodes:e,source:a};this.voices.add(i),a.onended=()=>{e.forEach(r=>r.disconnect()),this.voices.delete(i)},a.stop(n)}prepareSamples(){const e=this.context;this.sampleReady=Promise.all(Object.entries(this.sampleBytes).map(async([a,n])=>{const i=await Promise.all(n.map(async(r,l)=>{const s=await r;if(!s||this.disposed)return null;try{return{...Te[a][l],buffer:await e.decodeAudioData(s)}}catch{return null}}));return[a,i.filter(Boolean)]})).then(a=>{if(this.disposed)return;this.samplesByKind=Object.fromEntries(a);const n=a.reduce((r,[,l])=>r+l.length,0),i=Object.values(Te).reduce((r,l)=>r+l.length,0);this.sampleState=n===i?"ready":a.every(([,r])=>r.length)?"partial":"failed"})}sampledVoice(e,{x:a=.5,y:n=.5,gain:i=1,offset:r=0,duration:l=e.buffer.duration-r}={}){const s=this.context,h=s.currentTime,d=s.createBufferSource(),g=s.createGain(),x=s.createBiquadFilter(),A=s.createStereoPanner();return d.buffer=e.buffer,d.playbackRate.value=1,d.loop=!1,x.type="lowpass",x.Q.value=.3,x.frequency.value=6e3+Ie(n)*14e3,A.pan.value=ge((a-.5)*.65,-.32,.32),g.gain.setValueAtTime(i,h),d.connect(g),g.connect(x),x.connect(A),A.connect(this.bus),d.start(h,r),this.voice([d,g,x,A],d,h+l),{source:d,level:g,tone:x,pan:A,startedAt:h,endsAt:h+l}}timeTick(){const e=this.context;if(this.disposed||e?.state!=="running"||!this.bus)return;const a=e.currentTime;if(a-this.lastTick<.038)return;const n=this.samplesByKind?.ticks?.[0];n&&(this.lastTick=a,this.sampledVoice(n,{gain:n.gain}),this.timeTicks++)}touch(e){const{type:a}=e;if(a==="end"||a==="cancel"){this.endStroke();return}if(a==="start"){this.endStroke(),this.gesture={latest:null,voice:null,starting:!1,smoothedLevel:0,updatedAt:0};return}const n=this.context;if(this.disposed||n?.state!=="running"||!this.bus)return;if(a==="splash"){const l=n.currentTime;this.sampleReady.then(()=>{if(this.disposed||n.state!=="running"||n.currentTime-l>.45||this.voices.size>=16)return;const s=this.samplesByKind?.impacts||[],h=at(s.length,this.lastImpact);h<0||(this.lastImpact=h,this.sampledVoice(s[h],{...e,gain:s[h].gain*.86*Ie(e.y)}),this.splashes++,this.lastSample=s[h].url)});return}if(a!=="drag")return;const i=this.gesture;if(!i)return;i.latest=e,i.voice&&this.updateStroke(i),(!i.voice||n.currentTime>=i.voice.endsAt-.2)&&!i.starting&&Ae(e)>.015&&this.startStroke(i)}startStroke(e){e.starting=!0,this.sampleReady.then(()=>{const a=this.context;if(this.disposed||this.gesture!==e||a.state!=="running")return;e.starting=!1;const n=this.samplesByKind?.drags||[],i=at(n.length,this.lastStroke);if(i<0||Ae(e.latest)<=.015)return;const r=n[i],l=e.voice,s=a.currentTime;l&&s<l.endsAt&&(this.hold(l.level.gain,s),l.level.gain.linearRampToValueAtTime(1e-4,Math.min(l.endsAt,s+.18))),this.lastStroke=i,e.sampleGain=r.gain;const h=r.entry||0,d=Math.min(r.end||r.buffer.duration,r.buffer.duration)-h;e.voice=this.sampledVoice(r,{...e.latest,gain:1e-4,offset:h,duration:d}),this.dragStarts++,this.lastSample=r.url,this.updateStroke(e)})}hold(e,a){if(e.cancelAndHoldAtTime)e.cancelAndHoldAtTime(a);else{const n=e.value;e.cancelScheduledValues(a),e.setValueAtTime(n,a)}}updateStroke(e){const a=this.context,n=a.currentTime,{voice:i,latest:r,sampleGain:l}=e;if(n>=i.endsAt)return;const s=Ae(r),h=e.updatedAt?Math.max(0,n-e.updatedAt):.05,d=1-Math.exp(-h/.065);e.smoothedLevel+=(s-e.smoothedLevel)*d,e.updatedAt=n;const g=e.smoothedLevel*l*1.8;i.pan.pan.setTargetAtTime(ge((r.x-.5)*.65,-.32,.32),n,.09),i.tone.frequency.setTargetAtTime(3e3+e.smoothedLevel*3600,n,.08),this.hold(i.level.gain,n),i.level.gain.setTargetAtTime(Math.max(1e-4,g),n,.025),i.level.gain.setTargetAtTime(1e-4,n+.12,.14)}endStroke(){const e=this.gesture;if(this.gesture=null,!e?.voice||!this.context||this.context.state==="closed")return;const a=this.context.currentTime;if(a>=e.voice.endsAt)return;const n=e.voice.level.gain;this.hold(n,a),n.setTargetAtTime(1e-4,a+.07,.18)}diagnostics(){if(!this.analyser||this.context.state!=="running")return{state:this.context?.state||"idle",rms:0,peak:0,timeTicks:this.timeTicks,splashes:this.splashes,dragStarts:this.dragStarts,samples:this.sampleState,lastSample:this.lastSample||""};this.analyser.getFloatTimeDomainData(this.samples);let e=0,a=0;for(const n of this.samples)e+=n*n,a=Math.max(a,Math.abs(n));return{state:this.context.state,rms:Math.sqrt(e/this.samples.length),peak:a,timeTicks:this.timeTicks,splashes:this.splashes,dragStarts:this.dragStarts,samples:this.sampleState,lastSample:this.lastSample||""}}clearVoices(){for(const{source:e,nodes:a}of this.voices){e.onended=null;try{e.stop()}catch{}a.forEach(n=>n.disconnect())}this.voices.clear()}async pause(){this.endStroke(),this.clearVoices(),this.context?.state==="running"&&await this.context.suspend()}dispose(){this.disposed=!0,this.abort.abort(),this.endStroke(),this.clearVoices();for(const e of this.nodes){if(e.stop)try{e.stop()}catch{}e.disconnect()}this.nodes=[],this.context&&this.context.state!=="closed"&&this.context.close().catch(()=>{})}}const le=[{title:"Calme",subtitle:"Ever So Blue · Official preview",url:"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/97/51/42/97514222-7e8d-a65b-3e29-b34bf0285305/mzaf_13403160097079185817.plus.aac.p.m4a"}];function Pt(o,e,a=1.5){const n=Math.min(Math.round(a*e.sampleRate),Math.floor(e.length/4)),i=e.length-n,r=o.createBuffer(e.numberOfChannels,i,e.sampleRate);for(let l=0;l<e.numberOfChannels;l++){const s=e.getChannelData(l),h=r.getChannelData(l);h.set(s.subarray(n,i));for(let d=0;d<n;d++){const g=(1-Math.cos(Math.PI*d/Math.max(1,n-1)))/2;h[i-n+d]=s[i+d]*(1-g)+s[d]*g}}return r}class Dt{constructor(e=()=>{}){this.onChange=e,this.track=0,this.status="idle",this.volume=.65,this.buffers=new Map,this.sources=new Set,this.version=0,this.offset=0,this.wanted=!1,this.disposed=!1,this.abort=new AbortController}report(e,a=""){this.status=e,this.disposed||this.onChange({status:e,track:this.track,error:a})}setup(){this.context||(this.context=new(window.AudioContext||window.webkitAudioContext),this.gain=this.context.createGain(),this.gain.gain.value=this.volume,this.analyser=this.context.createAnalyser(),this.analyser.fftSize=1024,this.meter=new Float32Array(1024),this.gain.connect(this.analyser),this.analyser.connect(this.context.destination))}load(e){if(!this.buffers.has(e)){const a=fetch(le[e].url,{signal:this.abort.signal}).then(n=>{if(!n.ok)throw new Error("Music unavailable");return n.arrayBuffer()}).then(n=>this.context.decodeAudioData(n)).then(n=>Pt(this.context,n)).catch(n=>{throw this.buffers.delete(e),n});this.buffers.set(e,a)}return this.buffers.get(e)}stopVoice(e,a=.3){if(!e||e.stopping)return;e.stopping=!0;const n=this.context.currentTime,i=e.level.gain;if(i.cancelAndHoldAtTime)i.cancelAndHoldAtTime(n);else{const r=i.value;i.cancelScheduledValues(n),i.setValueAtTime(r,n)}i.linearRampToValueAtTime(0,n+a),e.source.stop(n+a+.02)}async play(){if(this.disposed)return;const e=++this.version,a=this.track;this.wanted=!0,this.report("loading");try{this.setup();const n=this.context.resume(),[i]=await Promise.all([this.load(a),n]);if(this.disposed||e!==this.version||!this.wanted)return;if(this.context.state!=="running")throw new Error("Audio did not start");const r=this.context.currentTime,l=this.context.createBufferSource(),s=this.context.createGain();l.buffer=i,l.loop=!0,s.gain.setValueAtTime(0,r),s.gain.linearRampToValueAtTime(1,r+.6),l.connect(s),s.connect(this.gain),this.stopVoice(this.voice,.6);const h={source:l,level:s,track:a,started:r,offset:this.offset%i.duration,duration:i.duration};l.onended=()=>{l.disconnect(),s.disconnect(),this.sources.delete(h)},l.start(r,h.offset),this.sources.add(h),this.voice=h,this.report("playing")}catch{if(this.disposed||e!==this.version)return;this.stopVoice(this.voice),this.voice=null,this.wanted=!1,this.report("error","音乐暂未加载成功，点击播放重试。")}}pause(){++this.version,this.wanted=!1,this.voice&&(this.offset=this.voice.track===this.track?(this.voice.offset+this.context.currentTime-this.voice.started)%this.voice.duration:0,this.stopVoice(this.voice),this.voice=null),this.report("paused")}setTrack(e){const a=(e%le.length+le.length)%le.length;a!==this.track&&(this.track=a,this.offset=0,++this.version,this.wanted?this.play():this.report("paused"))}setVolume(e){this.volume=Math.max(0,Math.min(1,e)),this.gain&&this.gain.gain.setTargetAtTime(this.volume,this.context.currentTime,.08)}diagnostics(){let e=0;return this.analyser&&this.context.state==="running"&&(this.analyser.getFloatTimeDomainData(this.meter),e=Math.sqrt(this.meter.reduce((a,n)=>a+n*n,0)/this.meter.length)),{status:this.status,track:this.track,rms:e,loop:!!this.voice?.source.loop,position:this.voice?(this.voice.offset+this.context.currentTime-this.voice.started)%this.voice.duration:this.offset,duration:this.voice?.duration||0,voices:this.sources.size}}dispose(){this.disposed=!0,++this.version,this.abort.abort();for(const e of this.sources){e.source.onended=null;try{e.source.stop()}catch{}e.source.disconnect(),e.level.disconnect()}this.sources.clear(),this.gain?.disconnect(),this.analyser?.disconnect(),this.context&&this.context.state!=="closed"&&this.context.close().catch(()=>{})}}function j({name:o,...e}){const a={moon:t.createElement("path",{d:"M20.5 14a8.6 8.6 0 0 1-10.6-10.6A8.7 8.7 0 1 0 20.5 14Z"}),volume:t.createElement(t.Fragment,null,t.createElement("path",{d:"m11 5-5 4H3v6h3l5 4V5Z"}),t.createElement("path",{d:"M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"})),sun:t.createElement(t.Fragment,null,t.createElement("circle",{cx:"12",cy:"12",r:"3.7"}),t.createElement("path",{d:"M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"})),close:t.createElement("path",{d:"m6 6 12 12M6 18 18 6"}),arrow:t.createElement("path",{d:"M5 12h14m-6-6 6 6-6 6"}),play:t.createElement("path",{fill:"currentColor",stroke:"none",d:"m8 5 11 7-11 7z"}),pause:t.createElement(t.Fragment,null,t.createElement("path",{d:"M8 5v14m8-14v14",strokeWidth:"3"})),next:t.createElement(t.Fragment,null,t.createElement("path",{fill:"currentColor",stroke:"none",d:"m5 6 10 6-10 6z"}),t.createElement("path",{d:"M18 6v12"})),previous:t.createElement(t.Fragment,null,t.createElement("path",{fill:"currentColor",stroke:"none",d:"m19 6-10 6 10 6z"}),t.createElement("path",{d:"M6 6v12"})),waves:t.createElement("path",{d:"M2 7q5-4 10 0t10 0M2 12q5-4 10 0t10 0M2 17q5-4 10 0t10 0"})};return t.createElement("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",...e},a[o])}function Ne({type:o,onClose:e,children:a}){const n=v.useRef(null);return v.useEffect(()=>{const i=n.current;return i.showModal(),()=>i.close()},[o]),t.createElement("dialog",{ref:n,className:`modal ${o}`,"aria-labelledby":"panel-title",onCancel:e,onClick:i=>{i.target===i.currentTarget&&e()}},t.createElement("div",{className:"panel"},t.createElement("button",{className:"close-button",onClick:e,"aria-label":"关闭"},t.createElement(j,{name:"close"})),a))}function Ft(){const[o,e]=v.useState(!1),[a,n]=v.useState(!1),[i,r]=v.useState(null),[l,s]=v.useState(null),[h,d]=v.useState(()=>!window.matchMedia("(prefers-reduced-motion: reduce)").matches),[g,x]=v.useState("idle"),A=g==="playing",C=A||g==="loading",b=v.useRef(null),[R,m]=v.useState(0),[c,w]=v.useState(""),f=v.useRef(null),E=v.useRef(R);E.current=R;const S=v.useRef(null),V=v.useRef(null),[L,X]=v.useState(65),O=v.useCallback(()=>{if(S.current)return S.current;const p=f.current.play().then(async()=>{document.hidden&&await f.current.pause()}).catch(()=>{}).finally(()=>{S.current=null});return S.current=p,p},[]),re=v.useCallback(p=>{S.current?S.current.then(()=>{document.hidden||f.current?.touch(p)}):f.current?.touch(p)},[]),Z=v.useCallback(()=>{document.hidden||f.current?.timeTick()},[]),{minutes:P,target:M,travelTo:D,stop:ie,coast:oe,wheelBy:te}=Lt(870,h,Z),$=v.useRef(null),ae=v.useCallback(()=>e(!0),[]);v.useEffect(()=>{document.title=q.title,f.current=new Rt,b.current=new Dt(({status:T,track:N,error:W})=>{x(T),m(N),E.current=N,w(W)});const p=window.matchMedia("(prefers-reduced-motion: reduce)"),Y=T=>d(!T.matches);return p.addEventListener("change",Y),()=>{f.current.dispose(),b.current.dispose(),p.removeEventListener("change",Y)}},[]),v.useEffect(()=>{if(!a)return;D(Ke(),{sound:!1});const p=setInterval(()=>D(Ke(),{duration:800,sound:!1}),15e3);return()=>clearInterval(p)},[a,D]),v.useEffect(()=>{const p=()=>{document.hidden&&(f.current.pause(),b.current.pause())};return document.addEventListener("visibilitychange",p),()=>document.removeEventListener("visibilitychange",p)},[]),v.useEffect(()=>{f.current.setNight(de(P).night)},[P]),v.useEffect(()=>{b.current.setVolume(L/100)},[L]),v.useEffect(()=>{const p=T=>{T.target.closest?.(".sound-player")||document.hidden||T.type==="keydown"&&!["Enter"," ","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","PageUp","PageDown","Home","End"].includes(T.key)||T.type==="pointerdown"&&T.button>0||f.current?.context?.state!=="running"&&O()};window.addEventListener("pointerdown",p,!0),window.addEventListener("keydown",p,!0);const Y=setInterval(()=>{const T=f.current?.diagnostics(),N=V.current;if(!T||!N)return;N.dataset.audioState=T.state,N.dataset.audioRms=T.rms.toFixed(5),N.dataset.audioPeak=T.peak.toFixed(5),N.dataset.splashes=String(T.splashes),N.dataset.timeTicks=String(T.timeTicks),N.dataset.dragStarts=String(T.dragStarts),N.dataset.samples=T.samples,N.dataset.lastSample=T.lastSample;const W=b.current?.diagnostics();W&&(N.dataset.musicState=W.status,N.dataset.musicRms=W.rms.toFixed(5),N.dataset.musicLoop=String(W.loop),N.dataset.musicPosition=W.position.toFixed(2),N.dataset.musicDuration=W.duration.toFixed(2),N.dataset.musicVoices=String(W.voices))},400);return()=>{window.removeEventListener("pointerdown",p,!0),window.removeEventListener("keydown",p,!0),clearInterval(Y)}},[O]);const Q=(p,Y)=>{$.current=Y.currentTarget,r(p),s(null)},G=()=>{r(null),s(null),requestAnimationFrame(()=>$.current?.focus())},ce=()=>{b.current.wanted?b.current.pause():b.current.play()},me=p=>{b.current.setTrack(E.current+p)};return t.createElement("main",{className:`${o?"ready":""} ${i?"panel-open":""}`},t.createElement(Et,{minutes:P,motion:h,onReady:ae,onWaterInteraction:re}),t.createElement("div",{className:"shade","aria-hidden":"true"}),t.createElement("div",{className:`arrival ${o?"gone":""}`,"aria-hidden":o},t.createElement(j,{name:"waves"}),t.createElement("span",null,"A quiet place to keep learning.")),t.createElement("div",{className:"home-ui"},t.createElement("header",{className:"masthead"},t.createElement("button",{className:"identity",onClick:p=>Q("about",p),"aria-label":`关于 ${q.name}`},q.name,t.createElement("span",{className:"identity-dot"},".")),t.createElement("span",{className:"eyebrow site-note"},"A PERSONAL SPACE ",t.createElement("span",{className:"tiny-dot"})," EST. 2026")),t.createElement("section",{className:"side-nav","aria-label":"个人网站导航"},t.createElement("button",{className:"time-trigger",onClick:p=>Q("time",p),"aria-label":"调整时间与光线"},t.createElement(j,{name:de(P).night>.5?"moon":"sun"}),t.createElement("span",null,Ce(P))),t.createElement("span",{className:"nav-divider"}),t.createElement("button",{className:"text-link",onClick:p=>Q("about",p)},"About ",t.createElement("span",null,"关于我")),t.createElement("button",{className:"text-link",onClick:p=>Q("work",p)},"Experiment ",t.createElement("span",null,"正在尝试"))),t.createElement("section",{ref:V,className:"sound-player","aria-label":"湖畔配乐","aria-busy":g==="loading"},t.createElement("span",{className:`sound-bars ${A?"is-playing":""}`,"aria-hidden":"true"},t.createElement("i",null),t.createElement("i",null),t.createElement("i",null),t.createElement("i",null),t.createElement("i",null)),t.createElement("button",{className:"track-title",onClick:ce},le[R].title),t.createElement("span",{className:"track-subtitle","aria-live":"polite"},g==="loading"?"音乐加载中…":le[R].subtitle),t.createElement("div",{className:"player-controls"},t.createElement("button",{onClick:()=>me(-1),"aria-label":"上一首音乐"},t.createElement(j,{name:"previous"})),t.createElement("button",{onClick:ce,"aria-label":C?"暂停音乐":"播放音乐","aria-pressed":C},t.createElement(j,{name:C?"pause":"play"})),t.createElement("button",{onClick:()=>me(1),"aria-label":"下一首音乐"},t.createElement(j,{name:"next"}))),t.createElement("label",{className:"volume-control"},t.createElement(j,{name:"volume"}),t.createElement("input",{type:"range",min:"0",max:"100",value:L,onChange:p=>X(Number(p.target.value)),"aria-label":"音乐音量","aria-valuetext":`${L}%`})),t.createElement("span",{className:"track-count eyebrow"},"0",R+1," / 01 · PREVIEW LOOP"),c&&t.createElement("span",{className:"audio-error",role:"status"},c)),t.createElement("footer",{className:"footer"},t.createElement("span",{className:"footer-note"},q.tagline),t.createElement("div",{className:"scene-caption"},t.createElement("span",{className:"eyebrow"},"STILLWATER"),t.createElement("span",{className:"scene-subtitle"},_e(P))),t.createElement("button",{className:"motion-button",onClick:()=>d(!h),"aria-label":h?"暂停水面动画":"开启水面动画","aria-pressed":h},t.createElement(j,{name:"waves"}),t.createElement("span",null,h?"In motion":"At rest"))),t.createElement("div",{className:"touch-hint"},"Touch the water. Leave a little ripple.")),i==="about"&&t.createElement(Ne,{type:"about-modal",onClose:G},t.createElement("span",{className:"eyebrow panel-kicker"},"A LITTLE ABOUT ME"),t.createElement("h1",{id:"panel-title"},"Hello, I’m ",t.createElement("em",null,q.name,".")),t.createElement("div",{className:"about-copy"},q.about.map(p=>t.createElement("p",{key:p},p))),t.createElement("p",{className:"signature"},q.signature),t.createElement("div",{className:"about-bottom"},t.createElement("button",{className:"underlined",onClick:()=>r("work")},"Explore the experiment ",t.createElement(j,{name:"arrow"})),q.email&&t.createElement("a",{className:"email-link",href:"mailto:"+q.email},q.email))),i==="work"&&t.createElement(Ne,{type:`work-modal ${l?"project-open":""}`,onClose:G},l?t.createElement(t.Fragment,null,t.createElement("button",{className:"back-link",onClick:()=>s(null)},"← Back to the experiment"),t.createElement("span",{className:"eyebrow panel-kicker"},l.type," / ",l.year),t.createElement("h1",{id:"panel-title"},l.name),t.createElement("div",{className:`project-art ${l.className}`,"aria-hidden":"true"},t.createElement("div",null),t.createElement("i",null),t.createElement("b",null)),t.createElement("span",{className:"project-label"},l.label),t.createElement("h2",null,l.caption),t.createElement("p",{className:"project-description"},l.description)):t.createElement(t.Fragment,null,t.createElement("span",{className:"eyebrow panel-kicker"},"LEARNING, IN PUBLIC"),t.createElement("h1",{id:"panel-title"},"One ongoing ",t.createElement("em",null,"experiment.")),t.createElement("p",{className:"work-intro"},q.workIntro),t.createElement("div",{className:"project-list"},q.projects.map(p=>t.createElement("button",{className:"project-row",key:p.id,onClick:()=>s(p)},t.createElement("span",{className:"project-number"},p.number),t.createElement("span",{className:`project-thumbnail ${p.className}`,"aria-hidden":"true"},t.createElement("i",null),t.createElement("b",null)),t.createElement("span",{className:"project-meta"},t.createElement("span",{className:"project-name"},p.name),t.createElement("span",{className:"eyebrow"},p.type)),t.createElement("span",{className:"project-year"},p.year),t.createElement(j,{name:"arrow"})))),t.createElement("span",{className:"work-footnote public-work-note"},q.workNote))),i==="time"&&t.createElement(Ne,{type:"time-modal",onClose:G},t.createElement("div",{className:"time-heading"},t.createElement("span",{className:"eyebrow panel-kicker"},"A DIFFERENT KIND OF TIME"),t.createElement("h1",{id:"panel-title"},"Chase the ",t.createElement("em",null,"light."))),t.createElement("div",{className:"time-instrument"},t.createElement("div",{className:"time-readout"},t.createElement("div",{className:"time-display"},Ce(P)),t.createElement("p",{className:"time-mood"},_e(P))),t.createElement(Ct,{minutes:P,target:M,travelTo:D,stop:ie,coast:oe,wheelBy:te,onManual:()=>{n(!1),O()}}),t.createElement("button",{className:`local-time ${a?"active":""}`,onClick:()=>n(!0)},t.createElement("span",{className:"live-dot"}),a?"Now":"Back to now")),t.createElement("div",{className:"time-presets"},[{name:"Dawn",value:390},{name:"Daylight",value:810},{name:"Golden hour",value:1050},{name:"Moonlight",value:1320}].map(p=>t.createElement("button",{key:p.name,onClick:()=>{n(!1),D(p.value)},"aria-pressed":!a&&Math.abs(ne(P)-p.value)<.5},p.name))),t.createElement("span",{className:"time-helper",id:"time-instructions"},"Drag or scroll. Let the hours drift.")))}it.createRoot(document.getElementById("root")).render(t.createElement(Ft,null));


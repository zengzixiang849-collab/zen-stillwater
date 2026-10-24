"""Run with Blender --background --python scripts/build_bridge.py. Metres, Z up."""
import bpy, math, random, json
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'models'
OUT.mkdir(parents=True, exist_ok=True)
BLEND = ROOT / 'blender'
BLEND.mkdir(exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
random.seed(22)

def mat(name, color, rough=.6, metal=0, emission=0):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
    p=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
    if p is None:
        p=m.node_tree.nodes.new('ShaderNodeBsdfPrincipled')
        output=m.node_tree.nodes.new('ShaderNodeOutputMaterial')
        m.node_tree.links.new(p.outputs['BSDF'],output.inputs['Surface'])
    p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Roughness'].default_value=rough
    p.inputs['Metallic'].default_value=metal
    if emission:
        p.inputs['Emission Color'].default_value=(*color,1)
        p.inputs['Emission Strength'].default_value=emission
    return m

class Mesh:
    def __init__(self,name,material): self.name=name; self.material=material; self.v=[]; self.f=[]
    def add(self,verts,faces):
        n=len(self.v); self.v.extend(verts); self.f.extend([tuple(n+i for i in face) for face in faces])
    def box(self,center,size):
        x,y,z=center; a,b,c=[s/2 for s in size]
        self.add([(x+i*a,y+j*b,z+k*c) for i,j,k in [(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),(-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]],[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)])
    def beam(self,a,b,width,depth=None):
        a,b=Vector(a),Vector(b); d=b-a; up=Vector((0,0,1))
        if abs(d.normalized().dot(up))>.99: up=Vector((0,1,0))
        u=d.cross(up).normalized()*width/2; v=d.normalized().cross(u.normalized())*(depth or width)/2
        verts=[tuple(p+u*i+v*j) for p in (a,b) for i,j in [(-1,-1),(1,-1),(1,1),(-1,1)]]
        self.add(verts,[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)])
    def cable(self,a,b,r=.135,sides=6):
        a,b=Vector(a),Vector(b); d=(b-a).normalized(); u=d.cross(Vector((0,0,1))).normalized(); v=d.cross(u)
        verts=[tuple(p+r*(math.cos(i*math.tau/sides)*u+math.sin(i*math.tau/sides)*v)) for p in (a,b) for i in range(sides)]
        self.add(verts,[(i,(i+1)%sides,(i+1)%sides+sides,i+sides) for i in range(sides)])
    def finish(self,bevel=0):
        mesh=bpy.data.meshes.new(self.name); mesh.from_pydata(self.v,[],self.f); mesh.update()
        o=bpy.data.objects.new(self.name,mesh); bpy.context.collection.objects.link(o); o.data.materials.append(self.material)
        if bevel:
            mod=o.modifiers.new('Soft concrete edges','BEVEL'); mod.width=bevel; mod.segments=2
            mod=o.modifiers.new('Weighted architectural normals','WEIGHTED_NORMAL')
        return o

ivory=mat('Tower | warm ivory concrete',(.69,.72,.70),.72)
concrete=mat('Structure | limestone grey',(.42,.48,.48),.8)
roadmat=mat('Asphalt',(.085,.105,.115),.95)
steel=mat('Stay cables | galvanized silver',(.48,.55,.58),.33,.55)
rails=mat('Railing | pale blue steel',(.26,.49,.52),.4,.45)
paint=mat('Road markings',(.74,.76,.69),.9)
warm=mat('Luminaires | amber', (1,.45,.14),.4,0,1)
red=mat('Navigation | red',(.75,.035,.018),.4,0,1)
tower=Mesh('01 Twin diamond pylons',ivory); cap=Mesh('02 Pier foundations',concrete)
deck=Mesh('03 Deck and crossbeams',concrete); road=Mesh('04 Road surface',roadmat)
cables=Mesh('05 176 stay cables',steel); rail=Mesh('06 Balustrades and lamp posts',rails)
marks=Mesh('07 Lane markings',paint); lamps=Mesh('08 Warm lighting',warm)
nav=Mesh('09 Aviation beacons',red)

for x in (-170,170):
    cap.box((x,0,1.7),(19,32,3.4)); cap.box((x,0,3.7),(14,27,1))
    for side in (-1,1):
        tower.beam((x,side*8.6,4),(x,side*18.2,29),6.8,4.8)
        tower.beam((x,side*18.2,29),(x,side*2.1,109.8),6.3,4.5)
        # Narrow inset stripe on the tower's outer faces.
        for face in (-1,1):
            rail.beam((x+face*3.22,side*18.1,29),(x+face*3.22,side*2.1,109.8),.18,.18)
        for direction in (-1,1):
            reach=163 if (x*direction<0) else 145
            for i in range(22):
                h=70+i*1.68
                top_y=side*(18.2-(h-29)*16.1/80.8)
                end_x=x+direction*(21+(reach-21)*i/21)
                cables.cable((x+direction*3.25,top_y,h),(end_x,side*14.05,33.2),.17)
    tower.box((x,0,28),(6.5,38,4.2))
    tower.box((x,0,100),(6.3,6.2,18.8))
    nav.box((x,0,110.5),(1.1,1.1,.7))
    for side in (-1,1):
        lamps.beam((x+3.4,side*17.9,30),(x+3.4,side*2.1,109),.1,.12)
        lamps.beam((x-3.4,side*17.9,30),(x-3.4,side*2.1,109),.1,.12)

def height(x): return 32.5-max(0,abs(x)-300)*.035
for i in range(86):
    x=-425+i*10
    z=height(x)
    deck.box((x,0,z-1),(10.03,29.8,2))
    road.box((x,0,z+.06),(10.03,23.8,.12))
    for side in (-1,1):
        deck.box((x,side*13.5,z+.12),(10.03,2.7,.24))
        deck.box((x,side*14.6,z+.4),(10.03,.35,.7))
        rail.box((x,side*14.62,z+1.5),(10.03,.12,.12))
        rail.box((x,side*14.62,z+1),(10.03,.08,.08))
        lamps.box((x,side*14.85,z+.32),(10.03,.10,.10))
        deck.box((x,side*13,z-2),(10.03,1.4,1.8))
        for k in range(5): rail.box((x-4+k*2,side*14.62,z+1),(.09,.09,1))
    deck.box((x,0,z-2),(1,27,.8))
    for y in (-8,-4,4,8): marks.box((x,y,z+.14),(3.9,.12,.04))
    marks.box((x,0,z+.15),(10.03,.25,.06))
for x in range(-420,421,28):
    z=height(x)
    for side in (-1,1):
        rail.beam((x,side*12.5,z),(x,side*12.5,z+6.5),.14)
        rail.beam((x,side*12.5,z+6.5),(x,side*10.5,z+7),.13)
        lamps.box((x,side*10.4,z+6.96),(.65,1.1,.12))
for x in (-420,-375,-330,330,375,420):
    cap.box((x,0,1),(11,26,2))
    for side in (-1,1): deck.box((x,side*9,(height(x)-2)/2),(3.5,3.5,height(x)-2))
    deck.box((x,0,height(x)-3.2),(5,26,2.3))

objects=[tower.finish(.18),cap.finish(.20),deck.finish(),road.finish(),cables.finish(),rail.finish(),marks.finish(),lamps.finish(),nav.finish()]
# Simple traffic helps communicate the physical scale without distracting motion.
for j,col in enumerate([(.63,.69,.68),(.11,.17,.20),(.35,.12,.08)]):
    cars=Mesh('Traffic %d'%j,mat('Vehicle %d'%j,col,.35,.3))
    for i in range(7):
        x=random.uniform(-380,380); y=random.choice([-6,-2,2,6]); z=height(x)
        cars.box((x,y,z+.65),(4.5,1.9,1)); cars.box((x-.15,y,z+1.3),(2.3,1.65,.7))
    objects.append(cars.finish(.15))

# Distant banks deliberately subdued; not a surveyed Haikou city model.
land=Mesh('Distant shore',mat('Shore',(.12,.19,.16),1))
# Curved estuary banks with water visible in the foreground.
for side in (-1,1):
    land.add([(side*435,-80,1),(side*850,-180,1),(side*2400,50,1),(side*2400,2500,1),(side*435,2500,1)],[(0,1,2,3,4)] if side>0 else [(4,3,2,1,0)])
shore_points=[(-2600+130*i,660+55*math.sin(i*.8)+20*math.sin(i*2.1),1.4) for i in range(41)]
land.add(shore_points+[(2600,3000,1.4),(-2600,3000,1.4)],[tuple(range(43))])
objects.append(land.finish())
for j in range(4):
    m=Mesh('Distant skyline %d'%j,mat('Haze building %d'%j,(.29+j*.035,.36+j*.033,.36+j*.035),.85))
    windows=Mesh('City windows %d'%j,warm)
    for side in (-1,1):
        for i in range(22):
            x=side*random.uniform(100,2100); y=random.uniform(760,1600); h=random.uniform(25,135)
            w=random.uniform(14,33); dep=random.uniform(15,35)
            m.box((x,y,h/2+2),(w,dep,h))
            if i%3==0: m.box((x,y,h+3),(w*.65,dep*.7,6))
            for row in range(2,int(h/4)):
                for column in (-.3,0,.3):
                    if random.random()>.5: windows.box((x+column*w,y-dep/2-.06,4*row),(1.5,.1,1.8))
    objects.extend([m.finish(),windows.finish()])

# Layered waterfront podiums and small palms break up the shoreline silhouette.
podium=Mesh('Distant waterfront plinths',mat('Waterfront stone',(.30,.35,.32),.9))
foliage=Mesh('Distant palm foliage',mat('Palm green',(.09,.19,.13),1))
trunks=Mesh('Distant palm trunks',mat('Palm bark',(.18,.17,.12),1))
for i in range(100):
    x=-1900+i*38+random.uniform(-12,12); y=710+random.uniform(-12,25); h=random.uniform(9,15)
    trunks.beam((x,y,1),(x+.8,y,h),.55)
    for k in range(7):
        a=k*math.tau/7;end=(x+math.cos(a)*5,y+math.sin(a)*5,h-1.5)
        foliage.beam((x+.8,y,h),end,1.0,.2)
    if i%5==0:podium.box((x,y+50,6),(60,40,12))
objects.extend([podium.finish(),foliage.finish(),trunks.finish()])

# Export only structural/context assets. Sea, lights and camera stay editable in .blend.
bpy.ops.object.select_all(action='DESELECT')
for o in objects: o.select_set(True)
bpy.context.view_layer.objects.active=objects[0]
bpy.ops.export_scene.gltf(filepath=str(OUT/'century-bridge.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True)

sea=mat('Blender sea preview',(.025,.12,.15),.22,.35)
nodes=sea.node_tree.nodes; links=sea.node_tree.links; bs=next(n for n in nodes if n.type=='BSDF_PRINCIPLED')
noise=nodes.new('ShaderNodeTexNoise'); noise.inputs['Scale'].default_value=1.3; noise.inputs['Detail'].default_value=4
bump=nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value=.3; bump.inputs['Distance'].default_value=.5
links.new(noise.outputs['Fac'],bump.inputs['Height']); links.new(bump.outputs['Normal'],bs.inputs['Normal'])
bpy.ops.mesh.primitive_plane_add(size=16000,location=(0,0,0)); bpy.context.object.name='Sea | web uses dynamic reflection shader'; bpy.context.object.data.materials.append(sea)
bpy.ops.object.camera_add(location=(390,-530,105)); camera=bpy.context.object; camera.name='Hero | view from estuary'
camera.rotation_euler=(Vector((10,0,35))-camera.location).to_track_quat('-Z','Y').to_euler(); camera.data.lens=38; camera.data.clip_end=20000
bpy.context.scene.camera=camera
bpy.ops.object.light_add(type='SUN',location=(0,-300,500)); sun=bpy.context.object; sun.name='Sun | late afternoon'; sun.data.energy=3; sun.data.angle=.035; sun.rotation_euler=(math.radians(65),math.radians(-25),math.radians(-45))
world=bpy.data.worlds.new('Estuary atmosphere'); world.use_nodes=True; bpy.context.scene.world=world
sky=world.node_tree.nodes.new('ShaderNodeTexSky'); sky.sky_type='PREETHAM'; sky.sun_direction=Vector((-.6,-.75,.2)).normalized()
bg=next((n for n in world.node_tree.nodes if n.type=='BACKGROUND'),None)
if bg is None:
    bg=world.node_tree.nodes.new('ShaderNodeBackground')
    wo=world.node_tree.nodes.new('ShaderNodeOutputWorld')
    world.node_tree.links.new(bg.outputs[0],wo.inputs['Surface'])
world.node_tree.links.new(sky.outputs['Color'],bg.inputs['Color'])
bpy.context.scene.render.engine='CYCLES'; bpy.context.scene.cycles.samples=48
bpy.context.scene.render.resolution_x=1600; bpy.context.scene.render.resolution_y=1000; bpy.context.scene.render.resolution_percentage=100
bpy.context.scene.unit_settings.system='METRIC'
bpy.context.scene['provenance']='Original reference-informed visual reconstruction by Zen. Not a surveyed model.'
bpy.context.scene['dimensions']='340m main span; 29.8m deck; 106.9m tower height above base; 176 stays.'
bpy.ops.wm.save_as_mainfile(filepath=str(BLEND/'century-bridge.blend'))
print(json.dumps({'objects':len(objects),'vertices':sum(len(o.data.vertices) for o in objects),'glb_bytes':(OUT/'century-bridge.glb').stat().st_size,'blend':str(BLEND/'century-bridge.blend')},ensure_ascii=True))

# Rapaxia Renderer
# Pass JSON to file

# Headers
import bpy
import struct
from bpy import context
from mathutils import Euler
import os
import math
import sys
import json
# Helper
dir_path = os.path.dirname(os.path.realpath(__file__))+'\\'
dir_path_public = dir_path+'..\\..\\public\\avatars\\'
# Get JSON from commandline
data = json.loads(sys.argv[-1])


def hex_to_rgb(value):
    gamma = 2.05
    value = value.lstrip('#')
    lv = len(value)
    fin = list(int(value[i:i + lv // 3], 16) for i in range(0, lv, lv // 3))
    r = pow(fin[0] / 255, gamma)
    g = pow(fin[1] / 255, gamma)
    b = pow(fin[2] / 255, gamma)
    fin.clear()
    fin.append(r)
    fin.append(g)
    fin.append(b)
    return [r, g, b, 1]

# Main Functions


def load(location):
    return bpy.data.images.load(filepath=location)


def color(material, color):
    bpy.data.materials[material].node_tree.nodes.get('Principled BSDF').inputs.get(
        'Base Color').default_value = color


def colors():
    color('Head', hex_to_rgb(data['colors']['face']))
    color('LArm', hex_to_rgb(data['colors']['left_arm']))
    color('RArm', hex_to_rgb(data['colors']['right_leg']))
    color('Torso', hex_to_rgb(data['colors']['torso']))
    color('LLeg', hex_to_rgb(data['colors']['left_leg']))
    color('RLeg', hex_to_rgb(data['colors']['right_leg']))


def texture(material, type, image):
    path = dir_path+'..\\shop\\'+type+'\\'+image+'.png'
    bpy.data.materials[material].node_tree.nodes.get(
        'Image Texture').image = load(path)


def textures():
    if data['images']['shirt'] != None:
        texture('LArm', 'shirts', data['images']['shirt'])
        texture('Torso', 'shirts', data['images']['shirt'])
        texture('RArm', 'shirts', data['images']['shirt'])
    if data['images']['pants'] != None:
        texture('LLeg', 'pants', data['images']['pants'])
        texture('RLeg', 'pants', data['images']['pants'])
    if data['images']['face'] != None:
        texture('Head', 'faces', data['images']['face'])
    else:
        texture('Head', 'faces', 'smile')


# Output


def focus(full=True):
    for obj in bpy.data.objects:
        obj.select_set(False)

    if full:
        bpy.ops.object.select_all(action='SELECT')
    else:
        bpy.data.objects['Head'].select_set(True)
    bpy.ops.view3d.camera_to_view_selected()


def resolution(x, y):
    scene = bpy.data.scenes['Scene']
    scene.render.resolution_x = 500
    scene.render.resolution_y = 500
    scene.render.resolution_percentage = 100


def export(location):
    scene = bpy.data.scenes['Scene']
    resolution(500, 500)
    # Full body
    focus()
    scene.render.filepath = dir_path_public+'body\\'+location
    bpy.ops.render.render(write_still=True)

    # Headshot
    focus(False)
    scene.render.filepath = dir_path_public+'headshots\\'+location
    bpy.ops.render.render(write_still=True)


# Import
bpy.ops.wm.open_mainfile(filepath=dir_path+"main.blend")

# Main Render
colors()
textures()
export(data['export'])

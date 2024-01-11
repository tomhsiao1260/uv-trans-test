import './style.css'
import * as THREE from 'three'
import { TextureLoader } from 'three'
import { TIFFLoader } from 'three/addons/loaders/TIFFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ArcballControls } from 'three/addons/controls/ArcballControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { Shader } from './Shader'

const xMax = 8096
const yMax = 7888
const zMax = 14370

const textureWidth = 1738
const textureHeight = 1351

const uv1Width = 191
const uv1Height = 1576

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene
const scene = new THREE.Scene()

// Camera
const aspect = sizes.width / sizes.height
const camera = new THREE.OrthographicCamera(-1 * aspect, 1 * aspect, 1, -1, 0.01, 100)
camera.up.set(0, -1, 0)
camera.position.z = -1.0
scene.add(camera)

window.addEventListener(
    'resize',
    () => {
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        const aspect = sizes.width / sizes.height
        camera.left = -1 * aspect
        camera.right = 1 * aspect
        camera.top = 1
        camera.bottom = -1
        camera.updateProjectionMatrix()
        renderer.setSize(sizes.width, sizes.height)
        render()
    },
    false
)

// Plane
const pSize = 1.5
const geometry = new THREE.PlaneGeometry(pSize * uv1Width / uv1Height, pSize , 100, 100)

const uv1Texture = new TextureLoader().load('20230702185753/20230702185753_l1_uv.png', render)
const surfTexture = await new TIFFLoader().load(`20230702185753/20230702185753_texture.tif`)

const m1 = setupMaterial(surfTexture, uv1Texture)
const p1 = new THREE.Mesh(geometry, m1)

const meshList = [ p1 ]
meshList.forEach((mesh) => scene.add(mesh))

// Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(sizes.width, sizes.height)

// Controls
const controls = new ArcballControls(camera, canvas, scene)
controls.addEventListener('change', render)

// Render
function render() {
    renderer.render(scene, camera)
}

function setupMaterial(surfTexture, uv3Texture) {
    const material = new Shader()

    surfTexture.minFilter = THREE.NearestFilter
    surfTexture.magFilter = THREE.NearestFilter
    material.uniforms.tSurface.value = surfTexture

    uv3Texture.minFilter = THREE.NearestFilter
    uv3Texture.magFilter = THREE.NearestFilter
    material.uniforms.tUV.value = uv3Texture

    return material
}


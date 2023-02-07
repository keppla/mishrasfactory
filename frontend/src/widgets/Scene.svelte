<script lang="ts">
import { onMount, setContext, createEventDispatcher } from 'svelte';

import * as THREE from 'three';
import { Scene, PerspectiveCamera, WebGLRenderer, Color, Vector2, Raycaster, Object3D } from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let div: HTMLDivElement;

let scene: Scene | null = null;
let camera: PerspectiveCamera | null = null;
let renderer: WebGLRenderer | null = null;

const hovered: Set<Object3D> = new Set();

const dispatch = createEventDispatcher();

setContext(THREE, { getScene: () => scene });

  function findMouseHits(evt: MouseEvent) {
    const mouse = new Vector2(
                        (evt.offsetX / window.innerWidth) * 2 - 1,
                        -(evt.offsetY / window.innerHeight) * 2 + 1);

    const raycaster = new Raycaster();
    raycaster.setFromCamera(mouse, camera!);
    
    return raycaster.intersectObjects(scene!.children);
  }


function init() {
  camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(200, 100, 200);

  scene = new Scene();
  scene.background = new Color(0x333333);

  renderer = new WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;

  div.appendChild( renderer.domElement );
  
  renderer.domElement.addEventListener("click", evt => {  
    for (let hit of findMouseHits(evt)) {
        const handler = hit.object.userData.onClick;
        if (handler) {
            handler(evt, hit);
        }
    }    
  });

  renderer.domElement.addEventListener("mousedown", evt => {  
    for (let hit of findMouseHits(evt)) {
        const handler = hit.object.userData.onMouseDown;
        if (handler) {
            handler(evt);
        }
    }    
  });

  renderer.domElement.addEventListener("mousemove", evt => {
    const hits = findMouseHits(evt);
    
    for (let hit of hits) {
      const handler = hit.object.userData.onMouseMove;
      if (!handler) {
        continue;
      }
      handler(hit);
    }

    for (let hit of hits) {
      const handler = hit.object.userData.onMouseEnter;
      if (!handler) {
        continue;
      }
      
      if (!hovered.has(hit.object)) {
        handler(evt);
        hovered.add(hit.object);
      }
    }

    const hitObjects = new Set(hits.map(hit => hit.object));

    for (let h of hovered) {
      const handler = h.userData.onMouseExit;

      if (!handler) {
        continue;
      }
      
      if (!hitObjects.has(h)) {
        handler(evt);
        hovered.delete(h);
      }
      
    }
  })
  
  const controls = new OrbitControls( camera, renderer.domElement );
  
  controls.mouseButtons = {
    LEFT: null,
    MIDDLE: THREE.MOUSE.PAN,
    RIGHT: THREE.MOUSE.ROTATE,
  };
  controls.target.set( 0, 25, 0 );
  controls.update();

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera!.aspect = window.innerWidth / window.innerHeight;
  camera!.updateProjectionMatrix();
  renderer!.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  requestAnimationFrame(animate);
  renderer!.render(scene!, camera!);
}

onMount(() => {
  init();
  animate();
})

</script>

<div bind:this={ div } >
  {#if scene}
    <slot/>
  {/if}
</div>

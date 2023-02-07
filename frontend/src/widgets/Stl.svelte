<script lang="ts">
  import { Mesh, MeshPhongMaterial } from "three";
  import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
  import SceneObject from "./SceneObject.svelte";

  export let x = 0;
  export let y = 0;
  export let z = 0;
  export let color = 0x333333;
  export let url: string;

  let mesh: Mesh | null = null;

  const loader = new STLLoader();

  loader.load(url, geometry => {
    const material = new MeshPhongMaterial({ color: color });
    
    mesh = new Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.rotation.x = - Math.PI / 2;
  });

  $: {
    if (mesh) {
      mesh.position.x = x;
      mesh.position.y = y;
      mesh.position.z = z;
    }
  }
</script>

{#if mesh}
  <SceneObject obj={ mesh }/>
{/if}

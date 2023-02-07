<script lang="ts">
  import * as THREE from "three";
  import SceneObject from './SceneObject.svelte';

  export let x = 100;
  export let y = 200;
  export let z = 0;

  const light = new THREE.HemisphereLight(0xffffff, 0x444444);

  $: {
    light.position.set(x, y, z);
  }
</script>

<SceneObject obj={ light } />
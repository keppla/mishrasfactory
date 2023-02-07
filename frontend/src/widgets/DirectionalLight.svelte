<script lang="ts">
  import { DirectionalLight } from "three";
  import SceneObject from './SceneObject.svelte';

  export let color = 0xffffff;
  export let x = 0;
  export let y = 200;
  export let z = 100;
  export let castShadow = true;

  const light = new DirectionalLight(color);
  light.shadow.camera.top = 180;
  light.shadow.camera.bottom = - 100;
  light.shadow.camera.left = - 120;
  light.shadow.camera.right = 120;
  light.castShadow = castShadow;
  
  $: {
    light.position.set(x, y, z);
  }
</script>
  
<SceneObject obj={ light } />
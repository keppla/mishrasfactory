<script lang="ts">
  import { Mesh, PlaneGeometry, ShadowMaterial } from 'three';
  import SceneObject from './SceneObject.svelte';

  export let x = 0;
  export let y = 0;
  export let z = 0;
  
  export let onMouseMove: ((evt: any) => any) = () => undefined;
  export let onClick: ((evt: any, hit: any) => any) = () => undefined;
  
  const ground = new Mesh(
                      new PlaneGeometry(2000, 2000),
                      new ShadowMaterial());

  ground.rotation.x = - Math.PI / 2;
  ground.receiveShadow = true;
  ground.name = "Ground";
  
  $: {
    ground.position.set(x, y, z);
    ground.userData = { onMouseMove, onClick };
  }
</script>
<SceneObject obj={ ground } />
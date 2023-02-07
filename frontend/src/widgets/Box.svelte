<script lang="ts">
    import { BoxGeometry, MeshPhongMaterial, Mesh } from 'three';
    import SceneObject from './SceneObject.svelte';

    export let x = 0;
    export let y = 0;
    export let z = 0;

    export let size = 50;
    export let color = 0x3366bb;
    
    export let castShadow = false;
    
    export let onClick: (() => void) = () => undefined;
    export let onMouseEnter: (() => void) = () => undefined;
    export let onMouseExit: (() => void) = () => undefined;

    const mesh = new Mesh(
                        new BoxGeometry(size, size, size),
                        new MeshPhongMaterial({ color }));

    $: {
        mesh.position.set(x, y, z);
        mesh.material.color.setHex(color);
        mesh.userData = { onClick, onMouseEnter, onMouseExit };
        mesh.castShadow = castShadow;
}
</script>
<SceneObject obj={ mesh } />
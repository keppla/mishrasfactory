<script lang="ts">
    import { BufferGeometry, Vector3, MeshPhongMaterial, Mesh, Line, LineBasicMaterial } from 'three';
    import SceneObject from './SceneObject.svelte';

    export let x1 = 0;
    export let y1 = 0;
    export let z1 = 0;

    export let x2 = 0;
    export let y2 = 0;
    export let z2 = 0;

    export let color = 0x3366bb;

    const mesh = new Line(
                        new BufferGeometry(),
                        new LineBasicMaterial({ color }));

    $: {
        mesh.material.color.setHex(color);
        mesh.geometry.setFromPoints([
            new Vector3(x1, y1, z1),
            new Vector3(x2, y2, z2),
        ]);
        
        console.log("linegeometry", mesh.geometry);
    }
</script>
<SceneObject obj={ mesh } />
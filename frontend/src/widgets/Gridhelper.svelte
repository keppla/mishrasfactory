<script lang="ts">
    import { GridHelper } from 'three';
    import SceneObject from './SceneObject.svelte';

    export let colorCenterLine = 0x444444;
    export let colorGrid = 0x888888;
    export let size = 10;
    export let divisions = 10;

    const obj = new GridHelper(size, divisions, colorCenterLine, colorGrid);

</script>
<SceneObject obj={ obj } />
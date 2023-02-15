<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import Scene from '../../../widgets/Scene.svelte';
    import Line from '../../../widgets/Line.svelte';
    import type { ExtrusionEditor } from '../../../model/api';

    export let editor: ExtrusionEditor;

    const dispatch = createEventDispatcher();

    let distance = editor.data.distance;

    let points = [...editor.shapeData.points];
    let lines = [...editor.shapeData.lines];
</script>

<input
    type="number"
    bind:value={ distance }
    on:change={ evt => {
        dispatch('change', { distance: evt.target.value });
    } }
/>

<Scene>
    {#each lines as line}
        <Line
            x1={ points[line.from].x }
            x2={ points[line.to].x }
            y1={ points[line.from].y }
            y2={ points[line.to].y }
            z1={ points[line.from].z }
            z2={ points[line.to].z }
        />

        <Line
            x1={ points[line.from].x }
            x2={ points[line.to].x }
            y1={ points[line.from].y + distance }
            y2={ points[line.to].y + distance }
            z1={ points[line.from].z }
            z2={ points[line.to].z }
        />
    {/each}

    {#each points as point}
        <Line
            x1={ point.x }
            x2={ point.x }
            y1={ point.y }
            y2={ point.y + distance }
            z1={ point.z }
            z2={ point.z }
        />
    {/each}
</Scene>

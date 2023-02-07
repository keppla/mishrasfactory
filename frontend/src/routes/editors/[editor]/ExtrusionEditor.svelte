<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    
    import Scene from '../../../widgets/Scene.svelte';
    import Line from '../../../widgets/Line.svelte';
    import type { ExtrusionEditor } from '../../../model/api';

    export let editor: ExtrusionEditor;
    
    let distance = editor.data.distance;
    
    let points = [...editor.shapeData.points];
    let lines = [...editor.shapeData.lines];

    console.log("distance", distance, lines.map(l => ({f: points[l.from].y, t: points[l.to].y})));
</script>

<input
    type="number"
    bind:value={ distance }
    on:change={ evt => {
        editor.update({ distance: evt.target.value }) 
        invalidateAll();
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

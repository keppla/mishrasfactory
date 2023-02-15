<script lang="ts">
    import type { Vector3 } from 'three';

    import Scene from '../widgets/Scene.svelte';
    import Box from '../widgets/Box.svelte';
    import DirectionalLight from '../widgets/DirectionalLight.svelte';
    import Ground from '../widgets/Ground.svelte';
    
    let items: Vector3[] = [];
    
    function handleClick(evt: CustomEvent<{ hits: { point: Vector3 }[] }>) {
        items = [ ...items, ...evt.detail.hits.map(h => h.point.clone()) ];
    }
</script>

<Scene on:click={ handleClick }>
    <DirectionalLight />

    <Box />
    
    {#each items as p}
        <Box x={ p.x } y={ p.y } z={ p.z } size={ 1 } />
    {/each}
    
    <Ground />
</Scene>

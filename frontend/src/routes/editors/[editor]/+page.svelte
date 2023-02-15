<script lang="ts">
    import { invalidateAll } from '$app/navigation'
    import type { PageData } from './$types'

    import ShapeEditor from "./ShapeEditor.svelte"
    import ExtrusionEditor from "./ExtrusionEditor.svelte"

    export let data: PageData;

    let component: ExtrusionEditor | ShapeEditor;
    
    function handleChange(evt: CustomEvent<{ data: any }>) {
        data.editor.update(evt.detail);
        invalidateAll();
    }

    $: {
        component = ({
            ExtrusionEditor,
            ShapeEditor,
        } as any)[data.editor.type];
    }
</script>

<svelte:component
    this={ component }
    editor={ data.editor }
    on:change={ handleChange }
/>
<script lang="ts">
    import type { PageData } from './$types'
    import ShapeEditor from "./ShapeEditor.svelte";
    import ExtrusionEditor from "./ExtrusionEditor.svelte";

    export let data: PageData;

    let component: ExtrusionEditor | ShapeEditor;
    
    $: {
        component = ({
            ExtrusionEditor,
            ShapeEditor,
        })[data.editor.type];
    }
</script>

<svelte:component
    this={ component }
    editor={ data.editor }
/>
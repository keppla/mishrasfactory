<script lang="ts">
    import { onMount, onDestroy, getContext } from "svelte";
    import * as THREE from "three";
    import type { Scene, Object3D } from "three";

    const { getScene } = getContext(THREE) as { getScene: () => Scene };

    export let obj: Object3D;

    onMount(() => {
        getScene().add(obj);
    });

    onDestroy(() => {
        getScene().remove(obj);
    })

  </script>

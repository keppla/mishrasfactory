<script lang="ts">
    import {
        CatmullRomCurve3,
        Vector3,
        TubeGeometry,
        Mesh,
        MeshLambertMaterial
      } from 'three';
    import SceneObject from './SceneObject.svelte';
 
    const curve = new CatmullRomCurve3([
        new Vector3(-10, 0, 10),
        new Vector3(-5, 5, 5),
        new Vector3(0, 0, 0),
        new Vector3(5, -5, 5),
        new Vector3(10, 0, 10)
    ]);

    // Define the tube
    const tube = new TubeGeometry(curve, 100, 2, 20, false);

    // Create a mesh from the tube
    const mesh = new Mesh(tube, new MeshLambertMaterial({
        color: 0xff0000
    }));
    
    
</script>
<SceneObject obj={ mesh } />
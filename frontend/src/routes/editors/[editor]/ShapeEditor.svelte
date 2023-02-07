<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import type { Vector3 } from 'three';

    import Scene from '../../../widgets/Scene.svelte';
    import Ground from '../../../widgets/Ground.svelte';
    import Sphere from '../../../widgets/Sphere.svelte';
    import Line from '../../../widgets/Line.svelte';
    import type { ShapeEditor } from '../../../model/api';

    export let editor: ShapeEditor;

    let points = [ ...editor.data.points ];
    let lines = [ ...editor.data.lines ];
    
    let helperLines: { from: Vector3, to: Vector3 }[] = [];

    let selected: number | null = null;
    let hovered: number | null = null;

    class NullGesture {
        handleMouseMove(point: Vector3) {}
    }
    
    class MoveGesture extends NullGesture {
        
        constructor(private pointIndex: number) { super(); }
        
        handleMouseMove(point: Vector3) {
        }
    }
    
    function handleMouseUp() {
    }

    let tool = 'move';

    let editMode: EditMode;
    
    
    class EditMode {
        pointMouseDown(index: number): void {}
        pointMouseEnter(index: number): void {}
        pointMouseExit(index: number): void {}
        groundMouseMove(hit: any): void {}
        groundClick(hit: any): void {}
        mouseUp(): void {}
    }
    
    
    class MoveEditMode extends EditMode {

        private dragging: number | null = null;

        pointMouseDown(index: number) {
            this.dragging = index;
        }

        groundMouseMove(hit: any) {
            if (this.dragging !== null) {
                points = [
                    ...points.slice(0, this.dragging),
                    hit.point.clone(),
                    ...points.slice(this.dragging + 1),
                ];
            }
        }

        mouseUp() {
            if (this.dragging !== null) {
                this.dragging = null;
                editor.update({ points, lines });
                invalidateAll();
            }
        }
    }
    
    class DrawPointMode extends EditMode {
        groundClick(hit: any) {
            points = [ ...points, hit.point.clone() ];
            editor.update({ points, lines });
            invalidateAll();
        }
    }
    
    class DrawLineMode extends EditMode {
        
        private from: number | null = null;
        private to: number | null = null;
        
        private point: Vector3 | null = null;

        pointMouseDown(index: number) {
            this.from = index;
            console.log("start")
        }
        
        pointMouseEnter(index: number): void {
            if (this.from !== null) {
                this.to = index
                this.updateHelperLines();
            }
        }
        
        pointMouseExit(index: number): void {
            if (this.from !== null) {
                this.to = null;
                this.updateHelperLines();
            }
        }
        
        groundMouseMove(hit: any): void {
            if (this.from !== null) {
                this.point = hit.point.clone();
                this.updateHelperLines();
            }
        }
        
        mouseUp() {
            if (this.from !== null && this.to !== null) {
                lines = [ ...lines, { from: this.from, to: this.to }];
            }
            
            this.from = null;
            this.to = null;
            this.updateHelperLines();

            editor.update({ points, lines });
            invalidateAll();
        }

        private updateHelperLines() {
            if (this.from === null) {
                helperLines = []
            }
            else if (this.to === null && this.point !== null) {
                helperLines = [{ from: points[this.from], to: this.point }]
            }
            else if (this.from !== null && this.to !== null) {
                helperLines = [{ from: points[this.from], to: points[this.to] }]
            }
            else {
                helperLines = []
            }
        }
    }
    
    
    const modes: { [name: string]: EditMode } = {
        move: new MoveEditMode(),
        drawpoints: new DrawPointMode(),
        drawlines: new DrawLineMode(),
    }
    
    $: {
        editMode = modes[tool]!;
    };

    
</script>

<svelte:window on:mouseup={ () => { editMode.mouseUp(); } } />


<label>
    Select/Move
    <input type="radio" name="tool" value="move" bind:group={ tool } />
</label>


<label>
    Draw Points
    <input type="radio" name="tool" value="drawpoints" bind:group={ tool } />
</label>


<label>
    Draw Lines
    <input type="radio" name="tool" value="drawlines" bind:group={ tool } />
</label>



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
    {/each}

    {#each helperLines as line }
        <Line
            x1={ line.from.x }
            x2={ line.to.x }
            y1={ line.from.y }
            y2={ line.to.y }
            z1={ line.from.z }
            z2={ line.to.z }
        />
    {/each}
    
    {#each points as h, index}
        <Sphere
            x={ h.x }
            y={ h.y }
            z={ h.z }
            color={ index === selected
                                ? 0xffffff
                                : (index === hovered ? 0x0099ff : 0x0033ff) }
            size={ 3 }
            onClick={ () => { selected = index; }}
            onMouseEnter={ () => {
                hovered = index; 
                editMode.pointMouseEnter(index);
            }}
            onMouseExit={ () => {
                hovered = null;
                editMode.pointMouseExit(index);
            }}
            onMouseDown={ () => { editMode.pointMouseDown(index); } }
        />
    {/each}
    
    <Ground
        onMouseMove={ hit => { editMode.groundMouseMove(hit); } }
        onClick={ (evt, hit) => { editMode.groundClick(hit); } }
    />
</Scene>

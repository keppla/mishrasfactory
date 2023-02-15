<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Vector3 } from 'three';

    import { invalidateAll } from '$app/navigation';

    import Scene from '../../../widgets/Scene.svelte';
    import Ground from '../../../widgets/Ground.svelte';
    import Sphere from '../../../widgets/Sphere.svelte';
    import Line from '../../../widgets/Line.svelte';
    import Gridhelper from '../../../widgets/Gridhelper.svelte';
    import type { ShapeEditor } from '../../../model/api';

    export let editor: ShapeEditor;

    const dispatch = createEventDispatcher();
    
    let points = [ ...editor.data.points ];
    let lines = [ ...editor.data.lines ];

    let helperLines: { from: Vector3, to: Vector3 }[] = [];

    let selected: number | null = null;
    let hovered: number | null = null;

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
            
            dispatch('change', { points, lines })
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
    
    function handleDelete() {
        if (selected === null) {
            return;
        }
        points = [
            ...points.slice(0, selected),
            ...points.slice(selected + 1)
        ];
        lines = lines.filter(line => line.from !== selected && line.to !== selected);
        lines = lines.map(line => ({
            from: line.from < selected! ? line.from : line.from - 1,
            to: line.to < selected! ? line.to : line.to - 1,
        }));
        selected = null;
        dispatch('change', { points, lines })
    }

</script>

<svelte:window on:mouseup={ () => { editMode.mouseUp(); } } />

<div class="editor">
    <nav>
        <div class="toolbar">
            <label class:selected={ tool == 'move' } class="mode">
                Select/Move
                <input type="radio" name="tool" value="move" bind:group={ tool } />
            </label
            ><label class:selected={ tool == 'drawpoints' } class="mode">
                Draw Points
                <input type="radio" name="tool" value="drawpoints" bind:group={ tool } />
            </label
            ><label class:selected={ tool == 'drawlines' } class="mode">
                Draw Lines
                <input type="radio" name="tool" value="drawlines" bind:group={ tool } />
            </label>
        </div>
        
        <div class="toolbar">
            <button
                class="action"
                on:click={ handleDelete }
                disabled={ selected === null }
            >
                Delete
            </button>
        </div>
    </nav>

    <div class="sceneview">
        <Scene>
            <Gridhelper
                colorCenterLine={ 0x2d3139 }
                colorGrid={ 0x282c34 }
                size={ 100 } />
    
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
    </div>

</div>


<style lang="scss">
    @import '../../../const.scss';
    
    .editor {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    
    .sceneview {
        flex-grow: 1;
    }

    .toolbar {
        display: inline-block;
        padding: calc($dist / 2) 0;
        padding-right: $dist;
    }
    
    .mode {
        display: inline-block;
        background-color: $slate_2;
        padding: $dist;
        cursor: pointer;

        &.selected {
            background-color: $slate_3;
        }
        
        &:hover {
            background-color: $slate_4;
        }
        
        input {
            display: none;
        }
    }
    
    .action {
        background-color: $slate_2;
        padding: $dist;
        border: 0 none transparent;
        color: $silver_1;
        cursor: pointer;
        font-size: unset;

        &:enabled:hover {
            background-color: $slate_4;
        }
        
        &:disabled {
            color: $slate_4;
            cursor: default;
        }
    }
</style>
import { Vector3 } from "three";




interface BaseEditor {
    id: string,
    title: string,
    update: (data: any) => void,
}


export interface ShapeEditor extends BaseEditor {
    type: "ShapeEditor",
    data: ShapeData,
    
}


export interface ExtrusionEditor extends BaseEditor {
    type: "ExtrusionEditor",

    shapeData: ShapeData;
    data: { distance: number };
}


export type Editor = ShapeEditor | ExtrusionEditor;


export class Storage {

    private data : { [id: string]: any } = {};
    
    store(id: string, value: any) {
        this.data[id] = value;
    }
    
    load(id: string): any {
        return this.data[id];
    }
}


export class Api {

    readonly editors : Editor[] = [];
    readonly storage : Storage;

    constructor(storage: Storage) {
        this.storage = storage;
    }

    designShape(name: string): Shape {
        
        const id = `shape-${ name }`;

        const data = this.storage.load(id) || {
            points: [
                new Vector3(-10, 0, -10),
                new Vector3(10, 0, -10),
                new Vector3(10, 0, 10),
                new Vector3(20, 0, 10),
                new Vector3(20, 0, 20),
                new Vector3(-10, 0, 20),
            ],
            lines: [
                { from: 0, to: 1 },
                { from: 1, to: 2 },
                { from: 2, to: 3 },
                { from: 3, to: 4 },
                { from: 4, to: 5 },
                { from: 5, to: 0 },
            ],
        };
        
        this.editors.push({
            type: "ShapeEditor",
            title: `Edit Shape "${ name }"`,
            id,
            data,
            update: data => { this.storage.store(id, data); }
        })

        return new Shape(this, data);
    }
}



interface ShapeData {
    points: Vector3[],
    lines: { from: number, to: number }[]
}


class Shape {
    constructor(private api: Api, private data: ShapeData) {}

    extrude(name: string): Body {
        const id = `extrude-${ name }`;
        
        const data = this.api.storage.load(id) || {
            distance: 5
        };

        this.api.editors.push({
            type: "ExtrusionEditor",
            title: `ExtrusionEditor Shape "${ name }"`,
            id,
            shapeData: this.data,
            data: data,
            update: data => { this.api.storage.store(id, data); }
        });

        return new Body(this.api, {});
    }
}


class Body {
    constructor(private api: Api, private data: any) {}
}


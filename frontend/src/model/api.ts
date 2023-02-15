import { Vector3 } from "three";


interface BaseEditor {
    id: string,
    title: string,
    update: (data: any) => void,
}


export interface ShapeDisplay extends BaseEditor {
    type: "ShapeDisplay",
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

    has(id: string): boolean {
        return this.data.hasOwnProperty(id);
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
    
    createShape(
            points: {x: number, y: number, z: number}[],
            lines: { from: number, to: number }[]): Shape {
        return new Shape(this, {
            lines,
            points: points.map(p => new Vector3(p.x, p.y, p.z))
        });
    }

    designShape(name: string): Shape {
        const id = `shape-${ name }`;

        const data = this.ensure(id, {
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
        });

        this.announceEditor('ShapeEditor', id, `Edit Shape "${ name }"`);

        return new Shape(this, data);
    }

    ensure(id: string, defaultData: any) {
        if (!this.storage.has(id)) {
            this.storage.store(id, defaultData);
            return defaultData;
        }
        else {
            return this.storage.load(id);
        }
    }

    announceEditor(type: Editor['type'], id: string, title: string, extra: any = {}) {
        this.editors.push({
            id,
            type,
            title,
            ...extra,
            data: this.storage.load(id),
            update: data => { this.storage.store(id, data); }
        });
        console.log("pushing editor", id, this.editors);
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
        const data = this.api.ensure(id, { distance: 5 });

        this.api.announceEditor(
                    "ExtrusionEditor",
                    id,
                    `ExtrusionEditor Shape "${ name }"`,
                    {
                        shapeData: this.data,
                    });

        return new Body(this.api, {});
    }
    
    show(name: string): Shape {
        const id = `extrude-${ name }`;
        this.api.announceEditor(
            "ShapeDisplay",
            id,
            `Display Shape "${ name }"`,
            {});
        return this;
    }
}


class Body {
    constructor(private api: Api, private data: any) {}
}


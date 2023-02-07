
import userscript from './userscript';
import { Api, Storage, type Editor } from './api';


const storage = new Storage()


export function getEditors(): Editor[] {
    const api = new Api(storage);
    userscript(api);
    return api.editors;
}


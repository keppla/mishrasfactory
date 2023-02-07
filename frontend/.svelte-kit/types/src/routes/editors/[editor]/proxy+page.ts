// @ts-nocheck
import type { PageLoad } from './$types'

import { getEditors } from '../../../model';
import type { Editor } from '../../../model/api';


interface OutputProps {
    editor: Editor
}


export const load = ({ params }: Parameters<PageLoad<OutputProps>>[0]) => {
    return {
        editor: getEditors().find(editor => editor.id === params.editor)!
    }
}
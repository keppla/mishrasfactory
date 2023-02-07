<script lang="ts">
    import { getEditors } from '../model';
    
    const editors = getEditors();
    
</script>
<p>Mishras Factory</p>


<ul>
    {#each editors as editor}
        <li>
            <a href={ `/editors/${ editor.id }` }>{ editor.title }</a>
        </li>
    {/each}
</ul>


<slot />
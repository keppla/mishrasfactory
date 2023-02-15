<script lang="ts">
    import { page } from '$app/stores';
    import { getEditors } from '../model';

    const editors = getEditors();
    
</script>

<div class="layout">
    <aside>
        {#each editors as editor}
            <a
                href={ `/editors/${ editor.id }` }
                class:active={ $page.url.pathname.includes(`/editors/${ editor.id }`) }
            >
                { editor.title }
            </a>
        {/each}
    </aside>
    <main>
        <slot />
    </main>
</div>

<style lang="scss">
    @import '../const.scss';
    
    :global(body) {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: $slate_1;
        color: $silver_1;
        padding: 0;
        margin: 0;
    }
    
    .layout {
        display: flex;
        height: 100vh;

        aside {
            padding: $dist;

            a {
                display: block;
                padding: 0.5 * $dist $dist;
                background-color: $slate_2;
                text-decoration: none;
                color: $silver_1;
                
                &.active {
                    background-color: $slate_3;
                }

                &:hover {
                    background-color: $slate_4;
                }
            }
        }
        
        main {
            flex-grow: 1;
        }
    }
    
</style>
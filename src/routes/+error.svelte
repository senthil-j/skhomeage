<script>
    import { page } from '$app/stores';
 </script>

<div>
    {#if $page?.error}
        <div class="flex flex-col items-center py-30">
            {#if $page?.status}
                <h3 class="font-bold text-5xl">{$page?.status}</h3>
            {/if}
            {#if $page?.error?.message}
                <h4 class="font-bold text-md mt-10">{$page?.error?.message}</h4>
            {/if}
            <p class="text-sm mb-15">Sorry! Can't seem to place your page! Try the below links or the search for better results.</p>
            <a href="/en-sa/" class="text-blue-200 font-medium text-xs">Go to homepage</a>
        </div>
    {/if}
</div>
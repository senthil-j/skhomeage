<script>
    import CMSExternalLinksComponent from '../../lib/components/CMSExternalLinksComponent.svelte';
    export let data;
    console.log(data, 'datadata');
</script>

<CMSExternalLinksComponent cmsLinksData={data.pageComponentData.component}/>
<script>
    let { children } = $props();
    import "../app.css";
    import Footer from "../lib/components/footer/footer.svelte";
    import Header from "../lib/components/header/header.svelte";
</script>
<div>
    <Header />
        <main class="min-h-screen px-12">
            {@render children()}
        </main>
    <Footer />
</div>
<script context="module">
    let swiper_count_id = 0;

    function getNextSwiperCount() {
        return ++swiper_count_id;
    }
</script>

<script>
    import { createEventDispatcher, setContext } from "svelte";
    import { writable } from "svelte/store";
    import { Swiper } from "swiper";
    import "swiper/css";
    import "swiper/css/navigation";
    import "swiper/css/pagination";
    import { Navigation, Pagination } from "swiper/modules";

    const _swiper_id = `extra_swiper_${getNextSwiperCount()}`;
    const _default_swiper_options = {
        modules: [],
    };
    const activeIndex = writable(0);
    const dispatcher = createEventDispatcher();

    export let slidesData = [];
    export let slideTemplate;
    export let swiperOptions = {};
    export let initialHeightForCLS = undefined;
    export let swiperClass = "";

    let swiperInstance;
    let swiperDOM;
    let navigationVisible = true;

    // initialize swiper whenever slidesData ref changes
    $: slidesData && slidesData?.length > 0 && initializeSwiper();

    function initializeSwiper() {
        setContext("activeIndex", activeIndex);
        const mergedSwiperOptions = Object.assign(
            {},
            _default_swiper_options,
            swiperOptions,
        );

        // adjust some properties to make them work
        if (!!mergedSwiperOptions.navigation) {
            mergedSwiperOptions.modules.push(Navigation);
            if (mergedSwiperOptions.navigation === true) {
                mergedSwiperOptions.navigation = {
                    enabled: true,
                    nextEl: `#${_swiper_id} .swiper-button-next`,
                    prevEl: `#${_swiper_id} .swiper-button-prev`,
                };
            }
        } else {
            navigationVisible = false;
        }
        if (!!mergedSwiperOptions.pagination) {
            mergedSwiperOptions.modules.push(Pagination);
            if (mergedSwiperOptions.pagination === true) {
                mergedSwiperOptions.pagination = {
                    enabled: true,
                    clickable: true,
                    el: `#${_swiper_id} .swiper-pagination`,
                };
            }
        }
        if (mergedSwiperOptions.autoplay === true) {
            mergedSwiperOptions.autoplay = {
                delay: 3000,
                pauseOnMouseEnter: true,
            };
        }

        setTimeout(() => {
            swiperInstance = new Swiper(swiperDOM, mergedSwiperOptions);
            if (!!mergedSwiperOptions.autoplay) {
                swiperInstance.autoplay.start();
            }
        });
    }
    function swiperSlideClick(data, index) {
        dispatcher("click", data);
        activeIndex.set(index);
    }
</script>

<!-- Slider main container -->
<div
    bind:this={swiperDOM}
    class="swiper extra-swiper-container {swiperClass}"
    id={_swiper_id}
    style:min-height={initialHeightForCLS}
>
    <div class="swiper-wrapper">
        {#if slidesData?.length > 0}
            {@const slidesLength = slidesData.length}
            {#each slidesData as data, index (index)}
                <div class="swiper-slide">
                    <svelte:component
                        this={slideTemplate}
                        {data}
                        {index}
                        {slidesLength}
                        on:click={(e) => swiperSlideClick(e.detail, index)}
                    />
                </div>
            {/each}
        {/if}
    </div>

    <div class="swiper-pagination"></div>

    {#if navigationVisible}
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
    {/if}

    <div class="swiper-scrollbar"></div>
</div>

<!-- Common styles required by the swiper -->
<style lang="scss">
    @import "../../lib/components/common/styles/colors.new.scss";

    .extra-swiper-container {
        --swiper-navigation-size: 20px;

        .swiper-pagination {
            width: 100%;
            bottom: 10px;
            display: flex;
            justify-content: center;

            :global(.swiper-pagination-bullet) {
                width: 8px;
                height: 8px;
                border: 1px solid $neutral-dark-04;
            }
            :global(.swiper-pagination-bullet-active) {
                border-color: $color-yellow;
                background-color: $color-yellow;
            }
        }
        .swiper-wrapper .swiper-slide {
            width: fit-content;
            display: inline-block;
            position: relative;
        }
        .swiper-button-next {
            transform: rotate(90deg);
            transform-origin: center center;
            position: absolute;
            top: 50%;
            translate: 0 -50%;
        }
        .swiper-button-prev {
            transform: rotate(-90deg);
            transform-origin: center center;
            position: absolute;
            top: 50%;
            translate: 0 -50%;
        }

        &.swiper-rtl .swiper-button-next {
            left: auto;
            right: var(--swiper-navigation-sides-offset, 10px);
        }
        .carousal-ver1-container .swiper-button-next {
            right: 4rem;
        }
        &.swiper-rtl .swiper-button-prev {
            right: auto;
            left: var(--swiper-navigation-sides-offset, 10px);
        }
        &.external-links-swiper {
            .swiper-button-next {
                transform: none;
            }
            .swiper-button-prev {
                transform: none;
            }
        }
    }
</style>

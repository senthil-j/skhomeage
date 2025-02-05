<script>
  import { fade } from 'svelte/transition';
  import { getAppConfig } from '../config/app-config';

  export let data;
  export let styleClasses; // headerTiles | policyLinks
  export function onLoad() {}
  const { encodedContextPath } = getAppConfig();

  $: isHeaderTile = styleClasses
    ? styleClasses?.indexOf('headerTiles') > -1
    : data?.styleClasses?.indexOf('headerTiles') > -1;
  $: isPolicyLink = styleClasses
    ? styleClasses?.indexOf('policyLinks') > -1
    : data?.styleClasses?.indexOf('policyLinks') > -1;
</script>

<a
  in:fade
  data-slick-index={data?.rank}
  data-name={data?.linkName}
  href={encodedContextPath + data.url}
  class:js-tag={data?.linkName !== null || data?.rank}
  class="link-component-container headerTiles {styleClasses ? styleClasses : data?.styleClasses}"
>
    {data.linkName}
</a>

<style lang="scss">
  @import '../../lib/components/common/styles/colors.new.scss';

  .headerTiles {
    display: inline-block;
    padding: 8px 12px;
    font-size: 12px;
    border-radius: 10px;
    font-weight: 500;
    line-height: 24px;
    background-color: $primary-white;
    border: 1px solid $secondary-gray-02;
    color: $neutral-dark-01;

    @include desktop-min-width {
      display: inline-block;
      border-radius: 100px;
      margin: 10px 0;
      padding: 10px 16px;
      font-size: 16px;
      font-weight: 700;
      line-height: 18px;
      background-color: $secondary-gray-02;
      border: 0;
    }

    &:hover {
      filter: brightness(0.8);
    }
  }
  .policyLinks {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    max-width: 165px;
    flex-basis: 40%;
    flex-shrink: 0;

    @include desktop-min-width {
      gap: 24px;
      width: 210px;
      flex-basis: unset;
      max-width: unset;
    }

    .content {
      text-align: center;
    }
    img {
      width: 64px;
      aspect-ratio: 1;
    }
    h2 {
      color: $neutral-dark-01;
      font-size: 16px;
      font-weight: 700;
      line-height: 18px;
      margin: 0;

      @include desktop-min-width {
        font-size: 20px;
        line-height: 22px;
      }
    }
    p {
      margin: 0;
      color: $neutral-dark-03;
      font-size: 16px;
      font-weight: 400;
      line-height: 18px;

      @include desktop-min-width {
        font-size: 16px;
        font-weight: 700;
        line-height: 18px;
      }
    }
  }
</style>

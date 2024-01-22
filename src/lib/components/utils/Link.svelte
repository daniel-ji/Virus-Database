<script lang="ts">
export let callback: () => void;
export let content: string = "";
export let style: string = "";
</script>

<span
  class={"pointer " + (style ?? "")}
  on:click={callback}
  on:keydown={callback}
  role="button"
  tabindex="0"
  >{content}
  <slot />
</span>

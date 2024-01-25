<script lang="ts">
export let callback: () => void;
export let content: string = "";
export let style: string = "";
</script>

<span class={"p-1 " + (style ?? "")} on:click={callback} on:keydown={() => {}} role="button" tabindex="0"
  >{content}
  <slot />
</span>

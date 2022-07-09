<script>
  import { onMount } from 'svelte';
  import { autoRefreshTokens } from '$lib/common/auth';

  let ok = false;

  onMount(async () => {
    await autoRefreshTokens();
    ok = localStorage.getItem('caJwtToken');
  });
</script>

{#if ok}
  <p>Login success!</p>
{:else}
  <p>Login failure.</p>
{/if}

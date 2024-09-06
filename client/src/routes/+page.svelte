<script lang="ts">
    import { goto } from '$app/navigation';
    import { socketStore } from '$lib/stores/socket';
    let overlayUrl = '';

    
    function updateOverlay() {
        const overlayData = {
           sourceName: 'streambud-overlay',
           url: 'http://localhost:5173/dragtest'
        }
        socketStore.update(socket => {
            socket.emit('overlayUpdate', overlayData);
            goto('/dragtest');
            return socket;
        })        
    }
</script>
<button on:click={updateOverlay}>Connect Overlay</button>
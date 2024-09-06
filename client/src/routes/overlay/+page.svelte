<script lang="ts">
    import { socketStore } from '$lib/stores/socket';

    
    interface Image {
        id: number;
        src: string;
        posX: number;
        posY: number;
    }

    let images: Image[] = [
        { id: 1, src: '/pedro.webp', posX: 0, posY: 0 }
    ];

    let containerRef: HTMLDivElement;


    let selectedImage: Image | null = null;

    function onMouseDown(image: Image) {
        selectedImage = image;
    }

    function onMouseMove(event: MouseEvent) {
        socketStore.update(socket => {
            if (selectedImage && containerRef) {
                const rect = containerRef.getBoundingClientRect();
                const newX = event.clientX - rect.left;
                const newY = event.clientY - rect.top;

                // Ensure the image stays within the container bounds
                selectedImage.posX = Math.max(0, Math.min(newX, rect.width - 150));
                selectedImage.posY = Math.max(0, Math.min(newY, rect.height - 150));
                // Emit new position to the backend for OBS update
                socket.emit('dragUpdate', {
                    id: selectedImage.id,
                    posX: selectedImage.posX,
                    posY: selectedImage.posY
                });
            }
            return socket;
        });
    }

    function onMouseUp() {
        selectedImage = null;
    }
</script>

<style>
    .container {
        width: 1920px;
        height: 1080px;
        border: 1px solid red;
    }
    .draggable {
        position: absolute;
        cursor: grab;
    }
</style>

<div bind:this={containerRef} class="container">
    <!-- svelte-ignore a11y-no-static-element-interactions -->

    <div 
        on:mousemove={onMouseMove} 
        on:mouseup={onMouseUp} 
        style="width: 100vw; height: 100vh; position: relative;">

        {#each images as image (image.id)}
            <div
                class="draggable"
                style="left: {image.posX}px; top: {image.posY}px; width: 150px; height: 150px;"
                on:mousedown={(e) => onMouseDown(image)}>
                <img src={image.src} alt="draggable" style="width: 100%; height: 100%;" />
            </div>
        {/each}
    </div>
</div>

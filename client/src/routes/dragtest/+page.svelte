<script lang="ts">
     import { socketStore } from "$lib/stores/socket";
    import { onMount } from 'svelte';
    
    let draggableRef: HTMLElement;
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    let posX = 0;
    let posY = 0;

    onMount(() => {
        socketStore.update(socket => {
            socket.on("boxMoved", (data) => {
                if (!isDragging) {
                    posX = data.posX;
                    posY = data.posY;
                    updatePosition();
                }
            });
            return socket;
        });
    });

    function onMouseDown(event: MouseEvent) {
        isDragging = true;
        offsetX = event.clientX - posX;
        offsetY = event.clientY - posY;
    }
    
    function onMouseMove(event: MouseEvent) {
        if (isDragging) {
            posX = event.clientX - offsetX;
            posY = event.clientY - offsetY;
            updatePosition();

            socketStore.update(socket => {
                socket.emit("dragUpdate", { posX, posY });
                return socket;
            });
        }
    }

    function onMouseUp() {
        isDragging = false;
    }

    function updatePosition() {
        if (draggableRef) {
            draggableRef.style.transform = `translate(${posX}px, ${posY}px)`;
        }
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container" on:mousemove={onMouseMove}>
    <div class="draggable" bind:this={draggableRef} on:mousedown={onMouseDown}  on:mouseup={onMouseUp}></div>
</div>

<style>
    .container {
        width: 1920px;
        height: 1080px;
        border: 1px solid black;
        position: relative;
    }

    .draggable {
        position: absolute;
        width: 100px;
        height: 100px;
        background-color: red;
    }
</style>
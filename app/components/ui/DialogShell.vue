<script setup lang="ts">
const props = withDefaults(defineProps<{
    open: boolean
    maxWidthClass?: string
}>(), {
    maxWidthClass: 'max-w-md',
})
</script>

<template>
    <Transition name="dialog-fade">
        <div
            v-if="open"
            class="absolute inset-0 z-40 flex items-end justify-center px-4 pb-6"
        >
            <div
                class="dialog-pop relative w-full bg-white shadow-xl px-6 py-8 space-y-4"
                :class="props.maxWidthClass"
            >
                <slot />
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.dialog-fade-enter-active,
.dialog-fade-leave-active {
    transition: opacity 0.22s ease-out, transform 0.22s ease-out;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
}

.dialog-fade-enter-to,
.dialog-fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}

@keyframes dialog-pop {
    0% { transform: translateY(6px) scale(0.96); opacity: 0; }
    60% { transform: translateY(0) scale(1.02); opacity: 1; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
}

.dialog-pop {
    animation: dialog-pop 0.24s ease-out;
    transform-origin: bottom center;
}
</style>
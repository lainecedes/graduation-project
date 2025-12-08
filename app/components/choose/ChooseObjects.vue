<script setup lang="ts">
const props = defineProps<{
    label: string
    image: string
    selected: boolean
}>()

const emit = defineEmits<{
    (e: 'toggle'): void
}>()
</script>

<template>
    <button
        type="button"
        class="relative flex flex-col-reverse items-center justify-between gap-3 px-4 py-3"
        @click="emit('toggle')"
    >
        <!-- checkmark overlay -->
        <div class="absolute top-1/2 right-2 -translate-y-1/2 w-16 h-16">
            <img
                src="/icons/checkmark.svg"
                alt="selected"
                class="w-full h-full drop-shadow-[0_0_10px_rgba(16,185,129,0.7)]
               transform transition-all duration-150 ease-out"
                :class="selected
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-0 pointer-events-none'"
            />
        </div>

        <span class="text-sm font-medium">
      {{ props.label }}
    </span>

        <img
            :src="props.image"
            alt=""
            class="w-40 h-40"
        />
    </button>
</template>
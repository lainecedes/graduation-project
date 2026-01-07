<script setup lang="ts">
import { computed } from 'vue'

type Placement = 'top' | 'bottom'
type Variant = 'primary' | 'white'

const props = withDefaults(
    defineProps<{
        label: string
        content: string
        placement?: Placement
        variant?: Variant
        widthClass?: string
    }>(),
    {
        placement: 'top',
        variant: 'white',
        widthClass: 'w-72',
    }
)

const tooltipId = `tooltip-${Math.random().toString(36).slice(2)}`

const sideClass = computed(() =>
    props.placement === 'top'
        ? 'bottom-full mb-2'
        : 'top-full mt-2'
)

const floatClass = computed(() =>
    props.placement === 'top'
        ? 'translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0'
        : '-translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0'
)

const bubbleClass = computed(() => {
    return props.variant === 'primary'
        ? 'bg-primary text-white'
        : 'bg-white text-text-main shadow-xl border border-primary/50'
})

const labelClass = computed(() => {
    return props.variant === 'primary'
        ? 'font-bold text-white'
        : 'font-semibold text-primary'
})
</script>

<template>
    <span class="relative inline-flex group">
        <!-- trigger -->
        <button
            type="button"
            class="inline-flex items-center gap-2 text-sm font-semibold
                   text-text-main hover:underline
                   focus-visible:outline focus-visible:outline-2
                   focus-visible:outline-primary focus-visible:outline-offset-2"
            aria-haspopup="true"
            :aria-describedby="tooltipId"
        >
            <span
                class="inline-flex h-6 w-6 items-center justify-center
                       rounded-full text-[16px] font-bold
                       bg-primary text-white"
                aria-hidden="true"
            >
                i
            </span>

            {{ label }}
        </button>

        <!-- tooltip -->
        <span
            class="pointer-events-none absolute left-1/2 -translate-x-1/2 z-50"
            :class="sideClass"
        >
            <span
                :id="tooltipId"
                role="tooltip"
                class="block rounded-xl px-4 py-3 text-sm leading-relaxed
                       opacity-0 transition-all duration-150 ease-out
                       group-hover:opacity-100
                       group-focus-within:opacity-100"
                :class="[bubbleClass, widthClass, floatClass]"
            >
                {{ content }}
            </span>
        </span>
    </span>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'

type LockyMood = 'neutral' | 'happy' | 'sad' | 'surprised'
type LockySize = 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(
    defineProps<{
        mood?: LockyMood
        size?: LockySize
        bounce?: boolean
        class?: string
    }>(),
    {
        mood: 'neutral',
        size: 'lg',
        bounce: false,
    }
)

const srcByMood: Record<LockyMood, string> = {
    neutral: '/mascotte/locky.svg',
    happy: '/mascotte/locky-happy.svg',
    sad: '/mascotte/locky-sad.svg',
    surprised: '/mascotte/locky-surprised.svg',
}

const resolvedSrc = computed(() => srcByMood[props.mood] ?? srcByMood.neutral)

const sizeClass = computed(() => {
    switch (props.size) {
        case 'sm': return 'w-14 h-14'
        case 'md': return 'w-24 h-24'
        case 'lg': return 'w-40 h-40'
        case 'xl': return 'w-64 h-64'
        default:   return 'w-40 h-40'
    }
})

const svg = ref('')
let controller: AbortController | null = null

const extractSvg = (raw: string) => {
    const idx = raw.indexOf('<svg')
    if (idx === -1) return ''
    return raw.slice(idx)
}

const loadSvgFrom = async (src: string) => {
    const res = await fetch(src, { signal: controller?.signal })
    if (!res.ok) return ''
    const raw = await res.text()
    return extractSvg(raw)
}

const load = async () => {
    if (controller) controller.abort()
    controller = new AbortController()

    svg.value = ''

    try {
        // probeer huidige mood
        const primary = await loadSvgFrom(resolvedSrc.value)
        if (primary) {
            svg.value = primary
            return
        }

        // fallback naar neutral (alleen als je niet al neutral bent)
        if (resolvedSrc.value !== srcByMood.neutral) {
            const fallback = await loadSvgFrom(srcByMood.neutral)
            if (fallback) svg.value = fallback
        }
    } catch (err: any) {
        if (err?.name === 'AbortError') return
        svg.value = ''
    }
}

watch(() => resolvedSrc.value, load, { immediate: true })
</script>

<template>
    <div
        v-if="svg"
        class="pointer-events-none select-none"
        :class="props.class"
        aria-hidden="true"
    >
        <div class="locky-float">
            <div :class="['locky-bounce', props.bounce && 'is-bouncing']">
                <div class="locky-svg" :class="sizeClass" v-html="svg" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.locky-svg {
    display: block;
}
.locky-svg :deep(svg) {
    width: 100%;
    height: 100%;
    display: block;
}

/* float */
.locky-float {
    transform-origin: 50% 100%;
    animation: locky-float 2.2s ease-in-out infinite;
    filter: drop-shadow(0 10px 16px rgba(0,0,0,0.18));
}
@keyframes locky-float {
    0%, 100% { transform: translateY(0) rotate(-2deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
}

/* bounce */
.locky-bounce.is-bouncing {
    animation: locky-bounce 0.48s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes locky-bounce {
    0%   { transform: translateY(0) rotate(0deg) scale(1); }
    35%  { transform: translateY(-18px) rotate(-2deg) scale(1.03); }
    65%  { transform: translateY(0) rotate(2deg) scale(0.99); }
    100% { transform: translateY(0) rotate(0deg) scale(1); }
}

/* SVG intern */
.locky-svg :deep(.eye) {
    animation: look 4s ease-in-out infinite;
    transform-origin: center;
}
@keyframes look {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(3px, 1px); }
    50% { transform: translate(-3px, 1px); }
    75% { transform: translate(0, -2px); }
}

.locky-svg :deep(.lock-arc) {
    animation: arc-bounce 2.5s ease-in-out infinite;
    transform-origin: center bottom;
}
@keyframes arc-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
}
</style>
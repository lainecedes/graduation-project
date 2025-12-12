<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useDialogLines } from '@/composables/useDialogLines'
import BaseButton from '~/components/ui/BaseButton.vue'

type Variant = 'full' | 'contained'

type Props = {
    open: boolean
    lines: string[]
    variant?: Variant

    primaryLastLabel?: string
    primaryNextLabel?: string

    showMascot?: boolean
    mascotSrc?: string

    useCountdown?: boolean
    countdownFrom?: number

    showClose?: boolean
    closeLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'full',
    primaryLastLabel: 'Verder',
    primaryNextLabel: 'Verder',
    showMascot: false,
    mascotSrc: '',
    useCountdown: false,
    countdownFrom: 3,
    showClose: true,
    closeLabel: 'Sluiten',
})

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'done'): void
}>()

const isCountingDown = ref(false)
const countdown = ref(props.countdownFrom)
let countdownTimer: number | null = null

const { step, currentLine, isLastLine, next, reset } = useDialogLines(props.lines)

const primaryLabel = computed(() =>
    isLastLine.value ? props.primaryLastLabel : props.primaryNextLabel,
)

// mascot inline svg
const mascotSvg = ref('')

const loadMascot = async () => {
    if (!props.showMascot || !props.mascotSrc) {
        mascotSvg.value = ''
        return
    }

    try {
        const res = await fetch(props.mascotSrc)
        mascotSvg.value = await res.text()
    } catch {
        mascotSvg.value = ''
    }
}

onMounted(loadMascot)

watch(
    () => props.open,
    (isOpen) => {
        if (!isOpen) return
        reset()
        isCountingDown.value = false
        countdown.value = props.countdownFrom

        if (countdownTimer !== null) {
            clearInterval(countdownTimer)
            countdownTimer = null
        }

        loadMascot()
    },
)

const startCountdown = () => {
    if (isCountingDown.value) return

    isCountingDown.value = true
    countdown.value = props.countdownFrom

    countdownTimer = window.setInterval(() => {
        countdown.value -= 1
        if (countdown.value <= 0) {
            if (countdownTimer !== null) {
                clearInterval(countdownTimer)
                countdownTimer = null
            }
            isCountingDown.value = false
            emit('done')
        }
    }, 1000)
}

const handlePrimaryClick = () => {
    if (!isLastLine.value) return next()
    if (props.useCountdown) return startCountdown()
    emit('done')
}

const handleClose = () => emit('close')

// ✅ altijd bottom. variant bepaalt alleen width/wrapper.
const wrapperClass = computed(() => {
    const base =
        'fixed bottom-0 left-0 z-40 w-full px-4 pb-6 pointer-events-none'

    return base
})

const innerWrapClass = computed(() => {
    // pointer-events terug aan binnenin
    const base = 'pointer-events-auto'

    return props.variant === 'contained'
        ? `${base} mx-auto w-full max-w-xl`
        : `${base} w-full`
})

const cardClass = computed(() => {
    // full width bar vibe
    return 'dialog-pop relative w-full bg-white shadow-xl border border-black/5 rounded-2xl px-6 py-5 space-y-4'
})

const mascotWrapClass = computed(() => {
    // mascotte “hangt” boven de bar, links
    return 'locky absolute bottom-[80%] left-4 w-36 h-36 pointer-events-none select-none'
})
</script>

<template>
    <Transition name="dialog-fade">
        <div v-if="open" :class="wrapperClass">
            <div :class="innerWrapClass">
                <div v-if="!isCountingDown" :key="step" :class="cardClass">
                    <!-- Mascot -->
                    <div v-if="mascotSvg" :class="mascotWrapClass" aria-hidden="true">
                        <div class="locky-svg" v-html="mascotSvg" />
                    </div>

                    <p class="text-text-main">
                        {{ currentLine }}
                    </p>

                    <div class="flex justify-end gap-2">
                        <button
                            v-if="showClose"
                            type="button"
                            class="rounded-full px-4 py-2 text-sm font-semibold text-text-main/70 hover:bg-black/5"
                            @click="handleClose"
                        >
                            {{ closeLabel }}
                        </button>

                        <BaseButton type="button" @click="handlePrimaryClick">
                            {{ primaryLabel }}
                        </BaseButton>
                    </div>
                </div>
            </div>

            <!-- Countdown overlay (mag wel fullscreen) -->
            <div
                v-else
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            >
                <div class="text-[120px] font-extrabold text-white drop-shadow-lg animate-countdown-scale">
                    {{ countdown }}
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
/* fade in/out van de hele bar */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
    transition: opacity 0.22s ease-out, transform 0.22s ease-out;
}
.dialog-fade-enter-from,
.dialog-fade-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
}
.dialog-fade-enter-to,
.dialog-fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}

/* pop per line */
@keyframes dialog-pop {
    0% { transform: translateY(6px) scale(0.98); opacity: 0; }
    60% { transform: translateY(0) scale(1.01); opacity: 1; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
}
.dialog-pop {
    animation: dialog-pop 0.24s ease-out;
    transform-origin: bottom center;
}

/* countdown anim */
@keyframes countdown-scale {
    0% { transform: scale(0.7); opacity: 0; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}
.animate-countdown-scale { animation: countdown-scale 0.4s ease-out; }

/* mascot float */
.locky {
    transform-origin: 50% 100%;
    animation: locky-float 2.2s ease-in-out infinite;
    filter: drop-shadow(0 10px 16px rgba(0,0,0,0.18));
}
@keyframes locky-float {
    0%, 100% { transform: translateY(0) rotate(-2deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
}

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
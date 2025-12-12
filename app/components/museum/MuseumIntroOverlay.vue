<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDialogLines } from '@/composables/useDialogLines'
import BaseButton from '~/components/ui/BaseButton.vue'

const props = defineProps<{
    playerName: string
}>()

const emit = defineEmits<{
    (e: 'opened'): void
}>()

const isCountingDown = ref(false)
const countdown = ref(3)
let countdownTimer: number | null = null

const {
    step,
    currentLine,
    isLastLine,
    next,
} = useDialogLines([
    'Goede keuzes! Dit zijn belangrijke spullen dat heel waardevol zijn!',
    'In jouw museum liggen ze netjes bij elkaar.',
    'Maar… niet iedereen gaat even voorzichtig om met spullen van anderen...',
    'Zullen we kijken wat er gebeurt als je het museum opent?',
])

const primaryLabel = computed(() => (isLastLine.value ? 'Ja, open mijn museum!' : 'Verder'))

const startCountdown = () => {
    if (isCountingDown.value) return

    isCountingDown.value = true
    countdown.value = 3

    countdownTimer = window.setInterval(() => {
        countdown.value -= 1

        if (countdown.value <= 0) {
            if (countdownTimer !== null) {
                clearInterval(countdownTimer)
                countdownTimer = null
            }
            isCountingDown.value = false
            emit('opened')
        }
    }, 1000)
}

const handlePrimaryClick = () => {
    if (!isLastLine.value) {
        next()
        return
    }
    startCountdown()
}

// Option 2: SVG uit /public ophalen en inline renderen
const lockySvg = ref('')

onMounted(async () => {
    try {
        const res = await fetch('/mascotte/locky.svg')
        lockySvg.value = await res.text()
    } catch {
        lockySvg.value = ''
    }
})
</script>

<template>
    <Transition name="dialog-fade">
        <div v-if="true" class="absolute inset-0 z-40 flex items-end justify-center px-4 pb-6">
            <!-- Dialog lines -->
            <div
                v-if="!isCountingDown"
                :key="step"
                class="dialog-pop relative w-full max-w-full bg-white shadow-xl px-6 py-8 space-y-4"
            >
                <!-- Mascotte -->
                <div
                    v-if="lockySvg"
                    class="locky absolute bottom-[80%] -left-6 w-40 h-40 pointer-events-none select-none"
                    aria-hidden="true"
                >
                    <div class="locky-svg" v-html="lockySvg" />
                </div>

                <h3 class="uppercase text-primary font-semibold">
                    Locky
                </h3>

                <p class="text-text-main text-xl">
                    {{ currentLine }}
                </p>

                <div class="flex justify-end">
                    <BaseButton type="button" @click="handlePrimaryClick">
                        {{ primaryLabel }}
                    </BaseButton>
                </div>
            </div>

            <!-- countdown -->
            <div
                v-else
                class="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
                <div class="text-[120px] font-extrabold text-white drop-shadow-lg animate-countdown-scale">
                    {{ countdown }}
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
@keyframes countdown-scale {
    0% { transform: scale(0.7); opacity: 0; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

.animate-countdown-scale {
    animation: countdown-scale 0.4s ease-out;
}

/* Mascotte: het hele ding zweeft */
.locky {
    transform-origin: 50% 100%;
    animation: locky-float 2.2s ease-in-out infinite;
    filter: drop-shadow(0 10px 16px rgba(0,0,0,0.18));
}

@keyframes locky-float {
    0%, 100% { transform: translateY(0) rotate(-2deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
}

/* Let op: scoped + v-html => gebruik :deep om de interne SVG classes te pakken */
.locky :deep(.eye) {
    animation: look 4s ease-in-out infinite;
    transform-origin: center;
}

@keyframes look {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(3px, 1px); }
    50% { transform: translate(-3px, 1px); }
    75% { transform: translate(0, -2px); }
}

.locky :deep(.lock-arc) {
    animation: arc-bounce 2.5s ease-in-out infinite;
    transform-origin: center bottom;
}

@keyframes arc-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
}
</style>
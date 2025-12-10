<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useDialogLines } from '@/composables/useDialogLines'
import BaseButton from "~/components/ui/BaseButton.vue";

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
    reset,
} = useDialogLines([
    // je kunt playerName er ook in interpoleren via computed, maar lekker simpel:
    'Je collectie staat klaar.',
    'Je hebt je spullen neergezet in je datamuseum. Klaar om het te openen en te zien hoe bezoekers reageren?',
])

const primaryLabel = computed(() =>
    isLastLine.value ? 'Open mijn museum' : 'Verder',
)

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

    // countdown starten op laatste regel
    startCountdown()
}

// als je deze overlay later ook wilt sluiten/heropenen:
// watch(() => props.somethingOpen, (val) => { if (val) reset() })
</script>

<template>
    <Transition name="dialog-fade">
        <div
            v-if="true"
            class="absolute inset-0 z-40 flex items-end justify-center px-4 pb-6"
        >
            <!-- Dialog lines -->
            <div
                v-if="!isCountingDown"
                :key="step"
                class="dialog-pop w-full max-w-full bg-white shadow-xl px-6 py-8 space-y-4"
            >
                <p class="text-text-main">
                    {{ currentLine }}
                </p>

                <BaseButton
                    type="button"
                    @click="handlePrimaryClick"
                >
                    {{ primaryLabel }}
                </BaseButton>
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
    0% {
        transform: scale(0.7);
        opacity: 0;
    }
    50% {
        transform: scale(1.1);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.animate-countdown-scale {
    animation: countdown-scale 0.4s ease-out;
}
</style>
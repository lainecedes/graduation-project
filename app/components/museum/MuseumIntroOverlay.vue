<!-- components/museum/MuseumIntroOverlay.vue -->
<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useDialogLines } from '@/composables/useDialogLines'
import { usePlayerProfile } from '@/composables/usePlayerProfile'
import BaseButton from '~/components/ui/BaseButton.vue'
import DialogHint from '~/components/ui/DialogHint.vue'
import Locky from '~/components/mascotte/Locky.vue'

type AgeGroup = '9-11' | '12-15' | 'adults'
type LockyMood = 'neutral' | 'happy' | 'sad' | 'surprised'

const { playerAgeGroup } = usePlayerProfile()

const ageGroup = computed<AgeGroup>(() => {
    const value = playerAgeGroup.value as AgeGroup | undefined
    return value ?? '9-11'
})

const introLinesByAge: Record<AgeGroup, string[]> = {
    '9-11': [
        'Goede keuzes! Deze spullen zijn super belangrijk voor jou.',
        'In jouw museum liggen ze veilig bij elkaar.',
        'Maar… niet iedereen online gaat voorzichtig om met spullen van anderen.',
        'Zullen we samen kijken wat er gebeurt als we jouw museum openen?',
    ],
    '12-15': [
        'Sterke keuzes. Dit zijn allemaal dingen die veel over jou zeggen.',
        'In jouw museum liggen ze nu netjes bij elkaar.',
        'Maar online gaat niet iedereen even zorgvuldig om met andermans gegevens…',
        'Zullen we kijken wat er gebeurt als je het museum opent?',
    ],
    adults: [
        'Mooi, dit zijn gevoelige onderdelen van iemands online leven.',
        'In het museum brengen we ze samen op één plek.',
        'Maar online worden dit soort gegevens lang niet altijd veilig behandeld.',
        'Laten we zien wat er gebeurt als het museum open gaat.',
    ],
}

const hintLinesByAge: Record<AgeGroup, string[]> = {
    '9-11': [
        'Tadaaaaa, je museum is open!',
        'Zie je dat sommige spullen een beetje wiebelen?',
        'Je kan dus op ze klikken!',
        'Klik er eentje aan om meer te ontdekken.',
    ],
    '12-15': [
        'Yes, je museum is open!',
        'Sommige objecten bewegen een beetje, zie je dat?',
        'Je kan dus op ze klikken!',
        'Klik op eentje om te zien wat er kan gebeuren.',
    ],
    adults: [
        'Het museum is nu open.',
        'Sommige objecten bewegen subtiel.',
        'Dat is een hint: ze zijn klikbaar.',
        'Klik op een object om details en risico’s te bekijken.',
    ],
}

const props = defineProps<{ playerName: string }>()
const emit = defineEmits<{ (e: 'opened'): void }>()

const phase = ref<'intro' | 'hint'>('intro')

const isCountingDown = ref(false)
const countdown = ref(3)
let countdownTimer: number | null = null

const showCurtain = ref(true)
const isCurtainOpening = ref(false)

const introLines = computed(() => introLinesByAge[ageGroup.value])
const hintLines = computed(() => hintLinesByAge[ageGroup.value])

// ✅ useDialogLines + reset bij ageGroup wijziging
const {
    step: introStep,
    currentLine: introCurrentLine,
    isLastLine: introIsLastLine,
    next: introNext,
    reset: introReset,
} = useDialogLines(introLines.value)

// moods
const introLockyMoodByStep: Record<number, LockyMood> = {
    0: 'happy',
    1: 'neutral',
    2: 'sad',
    3: 'surprised',
}

const hintLockyMoodByStep: Record<number, LockyMood> = {
    0: 'happy',
    1: 'surprised',
    2: 'neutral',
    3: 'neutral',
}

const introLockyMood = computed<LockyMood>(() => {
    return introLockyMoodByStep[introStep.value] ?? 'neutral'
})

const introPrimaryLabel = computed(() =>
    introIsLastLine.value ? 'Ja, open mijn museum!' : 'Verder'
)

const clearCountdown = () => {
    if (countdownTimer !== null) {
        clearInterval(countdownTimer)
        countdownTimer = null
    }
}

onBeforeUnmount(() => clearCountdown())

watch(ageGroup, () => {
    // reset dialog state als leeftijd wisselt
    introReset()
    phase.value = 'intro'
    isCountingDown.value = false
    countdown.value = 3
    showCurtain.value = true
    isCurtainOpening.value = false
    clearCountdown()
})

const handleHintDone = () => emit('opened')

const startCountdown = () => {
    if (isCountingDown.value) return

    isCountingDown.value = true
    countdown.value = 3
    clearCountdown()

    countdownTimer = window.setInterval(() => {
        countdown.value -= 1

        if (countdown.value <= 0) {
            clearCountdown()

            isCountingDown.value = false
            isCurtainOpening.value = true

            window.setTimeout(() => {
                showCurtain.value = false
                isCurtainOpening.value = false
                phase.value = 'hint'
            }, 900)
        }
    }, 1000)
}

const handleIntroClick = () => {
    if (!introIsLastLine.value) {
        introNext()
        return
    }
    startCountdown()
}
</script>

<template>
    <Transition name="dialog-fade">
        <div class="absolute inset-0 z-40 flex items-end justify-center px-4 pb-6">
            <!-- gordijn -->
            <div v-if="showCurtain" class="curtain-wrap pointer-events-none">
                <div
                    :class="[
            'curtain-panel curtain-left',
            isCurtainOpening && 'curtain-open-left',
          ]"
                />
                <div
                    :class="[
            'curtain-panel curtain-right',
            isCurtainOpening && 'curtain-open-right',
          ]"
                />
            </div>

            <!-- intro dialoog -->
            <div
                v-if="phase === 'intro' && !isCountingDown && !isCurtainOpening"
                :key="introStep"
                class="dialog-pop relative z-10 w-full max-w-xl bg-white shadow-xl px-6 py-8 space-y-4"
            >
                <div
                    class="locky absolute bottom-[80%] -left-2 w-40 h-40 pointer-events-none select-none"
                    aria-hidden="true"
                >
                    <Locky :mood="introLockyMood" size="lg" class="w-full h-full" />
                </div>

                <h3 class="uppercase text-primary font-semibold">Locky</h3>

                <p class="text-text-main text-xl">
                    {{ introCurrentLine }}
                </p>

                <div class="flex justify-end">
                    <BaseButton type="button" @click="handleIntroClick">
                        {{ introPrimaryLabel }}
                    </BaseButton>
                </div>
            </div>

            <!-- hint dialoog -->
            <DialogHint
                :visible="phase === 'hint' && !isCountingDown && !isCurtainOpening"
                :lines="hintLines"
                padding-class="pb-6"
                @close="handleHintDone"
            >
                <template #mascot="{ step }">
                    <div
                        class="locky absolute bottom-[80%] -left-2 w-40 h-40 pointer-events-none select-none"
                        aria-hidden="true"
                    >
                        <Locky :mood="hintLockyMoodByStep[step] ?? 'neutral'" size="lg" class="w-full h-full" />
                    </div>
                </template>
            </DialogHint>

            <!-- countdown -->
            <Teleport to="body">
                <div
                    v-if="isCountingDown && countdown > 0"
                    class="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
                >
                    <div class="text-[120px] font-extrabold text-white drop-shadow-lg animate-countdown-scale">
                        {{ countdown }}
                    </div>
                </div>
            </Teleport>
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

@keyframes countdown-scale {
    0% { transform: scale(0.7); opacity: 0; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}
.animate-countdown-scale { animation: countdown-scale 0.4s ease-out; }

.curtain-wrap {
    position: absolute;
    inset: 0;
    z-index: 0;
    display: flex;
    justify-content: space-between;
}
.curtain-panel {
    position: relative;
    width: 50%;
    height: 100%;
    background:
        linear-gradient(
            to right,
            rgba(0,0,0,0.20) 0%,
            rgba(0,0,0,0) 10%
        ),
        repeating-linear-gradient(
            to right,
            #6b6eff 0px,
            #5b5fff 24px,
            #4f53e6 48px,
            #5b5fff 72px
        );
    box-shadow: inset 0 0 40px rgba(0,0,0,0.2);
}

.curtain-left { transform: translateX(0%); }
.curtain-right { transform: translateX(0%); }
.curtain-open-left { animation: curtain-open-left 0.9s ease-in-out forwards; }
.curtain-open-right { animation: curtain-open-right 0.9s ease-in-out forwards; }
@keyframes curtain-open-left { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
@keyframes curtain-open-right { 0% { transform: translateX(0%); } 100% { transform: translateX(100%); } }

.locky {
    transform-origin: 50% 100%;
    animation: locky-float 2.2s ease-in-out infinite;
    filter: drop-shadow(0 10px 16px rgba(0,0,0,0.18));
}
@keyframes locky-float {
    0%, 100% { transform: translateY(0) rotate(-2deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
}
</style>
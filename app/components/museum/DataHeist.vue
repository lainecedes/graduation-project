<script setup lang="ts">
import { watch, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDialogLines } from '@/composables/useDialogLines'
import { usePlayerProfile } from '@/composables/usePlayerProfile'
import BaseButton from '~/components/ui/BaseButton.vue'
import Locky from '~/components/mascotte/Locky.vue'

const props = defineProps<{ open: boolean }>()

const emit = defineEmits<{
    (e: 'start'): void
    (e: 'finished'): void
    (e: 'close'): void
}>()

type AgeGroup = '9-11' | '12-15' | 'adults'
type LockyMood = 'neutral' | 'happy' | 'sad' | 'surprised'

const router = useRouter()
const { playerAgeGroup } = usePlayerProfile()

const ageGroup = computed<AgeGroup>(() => {
    const value = playerAgeGroup.value as AgeGroup | undefined
    return value ?? '9-11'
})

// ===== leeftijdsafhankelijke dialogen =====
const heistIntroLinesByAge: Record<AgeGroup, string[]> = {
    '9-11': [
        'Je hebt alles bekeken. Goed gedaan.',
        'Maar stel dat iemand stiekem met jouw spullen vandoor gaat…',
        'Zullen we dat even laten zien in jouw museum?',
    ],
    '12-15': [
        'Je hebt alles rustig doorgenomen. Nice.',
        'Maar wat als deze gegevens ineens “op straat” belanden?',
        'Zullen we samen zien wat er dan kan gebeuren in jouw museum?',
    ],
    adults: [
        'Je hebt de informatie bekeken.',
        'Maar wat als deze gegevens in verkeerde handen terechtkomen?',
        'Laten we kort laten zien wat er gebeurt als dit misgaat in het museum.',
    ],
}

const heistRecapLinesByAge: Record<AgeGroup, string[]> = {
    '9-11': [
        'Wat je net zag, was een dief die met jouw spullen uit het museum ging!',
        'Dat lijkt een grapje, maar online kan zoiets ook gebeuren met jouw gegevens.',
        'Straks zie je waarom dit zo gevaarlijk is en wat jij eraan kunt doen.',
    ],
    '12-15': [
        'Net zag je hoe iemand in één keer met jouw gegevens vertrok.',
        'Online voelt dat misschien minder zichtbaar, maar het effect is hetzelfde.',
        'Op de volgende pagina laten we zien waarom dit zo kwetsbaar is en wat jij kunt doen.',
    ],
    adults: [
        'De animatie liet een scenario zien waarin derden ongehinderd gegevens meenemen.',
        'In de praktijk gebeurt dit subtieler, maar de impact kan net zo groot zijn.',
        'Straks zie je een overzicht van de risico’s en mogelijke acties.',
    ],
}

const introLines = computed(() => heistIntroLinesByAge[ageGroup.value])
const recapLines = computed(() => heistRecapLinesByAge[ageGroup.value])

// ===== state =====
const isHeistActive = ref(false)
const hasHeistFinished = ref(false)
const showLoading = ref(false)
const isFadingOut = ref(false)

// intro dialoog
const {
    step,
    currentLine,
    isLastLine,
    next,
    reset,
} = useDialogLines(introLines.value)

// recap dialoog
const {
    step: recapStep,
    currentLine: recapLine,
    isLastLine: isLastRecapLine,
    next: nextRecap,
    reset: resetRecap,
} = useDialogLines(recapLines.value)

// ✅ als leeftijdsgroep wisselt: lines updaten + resets
watch(introLines, (lines) => {
    reset(lines)
})
watch(recapLines, (lines) => {
    resetRecap(lines)
})

const primaryLabel = computed(() =>
    isLastLine.value ? 'Ja, laat maar zien!' : 'Verder'
)

watch(
    () => props.open,
    (isOpen) => {
        if (!isOpen) return
        reset(introLines.value)
        resetRecap(recapLines.value)
        isHeistActive.value = false
        hasHeistFinished.value = false
        showLoading.value = false
        isFadingOut.value = false
    }
)

const handleClose = () => emit('close')

// start animatie, maar NIET meer auto-redirecten
const startHeist = () => {
    emit('start')
    isHeistActive.value = true

    window.setTimeout(() => {
        isHeistActive.value = false
        hasHeistFinished.value = true
    }, 3500)
}

const handlePrimaryClick = () => {
    if (!isLastLine.value) {
        next()
        return
    }
    startHeist()
}

const handleRecapPrimaryClick = () => {
    if (!isLastRecapLine.value) {
        nextRecap()
        return
    }

    isFadingOut.value = true

    window.setTimeout(() => {
        showLoading.value = true
        emit('close')

        window.setTimeout(() => {
            router.push('/results')
        }, 3000)
    }, 350)
}

// Locky emoties via component
const introLockyMoodByStep: Record<number, LockyMood> = {
    0: 'happy',
    1: 'surprised',
    2: 'neutral',
}

const recapLockyMoodByStep: Record<number, LockyMood> = {
    0: 'surprised',
    1: 'sad',
    2: 'neutral',
}

const introLockyMood = computed<LockyMood>(() => {
    return introLockyMoodByStep[step.value] ?? 'neutral'
})

const recapLockyMood = computed<LockyMood>(() => {
    return recapLockyMoodByStep[recapStep.value] ?? 'neutral'
})

const loadingLockyMood = computed<LockyMood>(() => 'neutral')
</script>

<template>
    <!-- dialoog -->
    <Transition name="dialog-fade">
        <div
            v-if="open"
            class="absolute inset-0 z-40 flex items-end justify-center px-4 pb-6"
        >
            <div class="dialog-wrap relative w-full">
                <!-- voor heist -->
                <div
                    v-if="!hasHeistFinished"
                    :key="step"
                    class="dialog-pop relative w-full max-w-xl mx-auto bg-white shadow-xl px-6 py-8 space-y-4"
                >
                    <!-- Locky -->
                    <div
                        class="locky absolute bottom-[80%] -left-2 w-40 h-40 pointer-events-none select-none"
                        aria-hidden="true"
                    >
                        <Locky :mood="introLockyMood" size="lg" class="w-full h-full" />
                    </div>

                    <h3 class="uppercase text-primary font-semibold">Locky</h3>

                    <p class="text-text-main text-xl">
                        {{ currentLine }}
                    </p>

                    <div class="flex justify-end gap-2">
                        <BaseButton type="button" @click="handlePrimaryClick">
                            {{ primaryLabel }}
                        </BaseButton>
                    </div>
                </div>

                <!-- na heist -->
                <div
                    v-else
                    :key="recapStep"
                    class="dialog-pop relative w-full max-w-xl mx-auto bg-white shadow-xl px-6 py-8 space-y-4"
                    :class="{ 'fade-out': isFadingOut }"
                >
                    <!-- Locky -->
                    <div
                        class="locky absolute bottom-[80%] -left-2 w-40 h-40 pointer-events-none select-none"
                        :class="{ 'fade-out': isFadingOut }"
                        aria-hidden="true"
                    >
                        <Locky :mood="recapLockyMood" size="lg" class="w-full h-full" />
                    </div>

                    <h3 class="uppercase text-primary font-semibold">Locky</h3>

                    <p class="text-text-main text-xl">
                        {{ recapLine }}
                    </p>

                    <div class="flex justify-end gap-2">
                        <BaseButton type="button" @click="handleRecapPrimaryClick">
                            Verder
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>
    </Transition>

    <!-- loading -->
    <Transition name="dialog-fade">
        <div
            v-if="showLoading"
            class="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-primary px-4"
        >
            <div class="flex flex-col items-center">
                <div class="mb-4 pointer-events-none select-none" aria-hidden="true">
                    <Locky :mood="loadingLockyMood" size="lg" />
                </div>

                <p class="text-text-on-dark text-xl text-center max-w-sm">
                    Locky opent de deuren naar je overzicht…
                </p>
            </div>
        </div>
    </Transition>

    <!-- crimineel -->
    <img
        v-if="isHeistActive"
        src="/characters/burglar.svg"
        alt="Dief"
        class="thief-sequence"
    />
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

/* pop per line */
@keyframes dialog-pop {
    0% { transform: translateY(6px) scale(0.96); opacity: 0; }
    60% { transform: translateY(0) scale(1.02); opacity: 1; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
}

.dialog-pop {
    animation: dialog-pop 0.24s ease-out;
    transform-origin: bottom center;
}

.dialog-wrap {
    padding-top: 3.25rem;
}

.locky {
    transform-origin: 50% 100%;
    animation: locky-float 2.2s ease-in-out infinite;
    filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.18));
}

@keyframes locky-float {
    0%, 100% { transform: translateY(0) rotate(-2deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
}

/* fade-out voor recap */
.fade-out {
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.35s ease-out, transform 0.35s ease-out;
}

/* ====== dief animaties ====== */
@keyframes thief-run {
    0% { transform: translateX(-120%); }
    100% { transform: translateX(200%); }
}

@keyframes thief-return {
    0% { transform: translateX(-150%); }
    100% { transform: translateX(-20%); }
}

@keyframes thief-idle-wiggle {
    0% { transform: translateX(-20%) translateY(0); }
    50% { transform: translateX(-21%) translateY(-2px); }
    100% { transform: translateX(-20%) translateY(0); }
}

.thief-sequence {
    position: relative;
    bottom: 0%;
    left: -20%;
    width: auto;
    z-index: 50;
    animation:
        thief-run 3s linear forwards,
        thief-return 0.6s ease-out forwards 3.3s,
        thief-idle-wiggle 1.2s ease-in-out infinite 3.9s;
}
</style>
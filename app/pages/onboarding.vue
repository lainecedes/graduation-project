<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDialogLines } from '@/composables/useDialogLines'
import BaseButton from '~/components/ui/BaseButton.vue'
import InfoTooltip from '~/components/ui/InfoTooltip.vue'
import Locky from "~/components/mascotte/Locky.vue";

type AgeGroup = '9-11' | '12-15' | 'adults'
type LockyMood = 'neutral' | 'happy' | 'sad' | 'surprised'

const router = useRouter()
const { playerName, playerAgeGroup } = usePlayerProfile()

// onboarding fases
const phase = ref<'intro' | 'name' | 'age'>('intro')

// intro dialog lines
const { step, currentLine, isLastLine, next } = useDialogLines([
    'Hey, ik ben Locky!',
    'Welkom in jouw eigen digitale museum.',
    'Hier verzamel je stukken over jouw online leven!',
    'Net zoals op je telefoon en laptop, maar dan op een plek die veilig is en alleen voor jou.',
    'Ik ben je digitale buddy, en ik zorg dat jouw spullen veilig blijven.',
    'Ik help je begrijpen wat er achter je online leven schuil gaat.',
    'Zeg eens, wie ben jij?',
])

const handleIntroNext = () => {
    if (!isLastLine.value) {
        next()
        return
    }
    phase.value = 'name'
}

// bounce trigger
const lockyBounce = ref(false)
const triggerLockyBounce = () => {
    lockyBounce.value = false
    requestAnimationFrame(() => {
        lockyBounce.value = true
        window.setTimeout(() => {
            lockyBounce.value = false
        }, 480)
    })
}

// name
const name = computed({
    get: () => playerName.value,
    set: (val: string) => (playerName.value = val),
})

const handleNameNext = () => {
    if (!name.value.trim()) return
    triggerLockyBounce()
    playerAgeGroup.value = null as any
    phase.value = 'age'
}

// age
const selectedAgeGroup = computed<AgeGroup | null>({
    get: () => (playerAgeGroup.value as AgeGroup | null) ?? null,
    set: (val) => {
        if (!val) return
        playerAgeGroup.value = val as any
    },
})

const handleSelectAge = (value: AgeGroup) => {
    selectedAgeGroup.value = value
    triggerLockyBounce()
}

const handleAgeNext = () => {
    if (!selectedAgeGroup.value) return
    triggerLockyBounce()
    window.setTimeout(() => {
        router.push('/choose')
    }, 140)
}

/**
 * Mood mapping
 * Pas dit aan naar jouw eigen smaak.
 */
const moodByStep: Record<number, LockyMood> = {
    0: 'surprised',
    1: 'happy',
    2: 'happy',
    3: 'neutral',
    4: 'happy',
    5: 'neutral',
    6: 'surprised',
}

const lockyMood = computed<LockyMood>(() => {
    if (phase.value !== 'intro') return 'neutral'
    return moodByStep[step.value] ?? 'neutral'
})
</script>

<template>
    <main class="relative min-h-screen bg-background-alt overflow-hidden">
        <div aria-hidden="true" class="bg-stripes-overlay" />

        <!-- Locky (via component) -->
        <Locky
            class="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 z-20"
            :mood="lockyMood"
            size="xl"
            :bounce="lockyBounce"
        />

        <!-- intro onboarding -->
        <Transition name="dialog-fade">
            <div
                v-if="phase === 'intro'"
                class="absolute inset-0 z-40 flex items-end justify-center px-4 pb-6"
            >
                <div
                    :key="step"
                    class="dialog-pop w-full max-w-xl bg-white shadow-xl px-6 py-8 space-y-4"
                >
                    <p class="text-text-main text-xl">
                        {{ currentLine }}
                    </p>

                    <div class="flex justify-end pt-2">
                        <BaseButton type="button" @click="handleIntroNext">
                            Verder
                        </BaseButton>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- naam invullen -->
        <div
            v-if="phase === 'name'"
            class="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
        >
            <h2 class="mb-[17rem] text-2xl md:text-3xl font-bold text-text-main text-center">
                Hoe wil je genoemd worden?
            </h2>

            <div class="w-full max-w-md space-y-4 mt-[4rem]">
                <div class="flex flex-col gap-4">
                    <InfoTooltip
                        label="Huh, waarom moet ik mijn naam typen?"
                        content="Zodat Locky weet hoe hij jou kan noemen. We onthouden je naam niet en delen ’m nergens. Liever niet? Dan mag je ook een verzonnen naam invullen!"
                        placement="bottom"
                        variant="white"
                    />

                    <label>
                        <input
                            v-model="name"
                            type="text"
                            class="w-full border border-primary px-4 py-2.5
                     outline-none focus:border-primary-focus focus:ring-1
                     focus:ring-primary-focus bg-slate-50"
                            placeholder="Klik hier om te typen!"
                        />
                    </label>
                </div>

                <div class="flex justify-end pt-2">
                    <BaseButton :disabled="!name.trim()" @click="handleNameNext">
                        Verder
                    </BaseButton>
                </div>
            </div>
        </div>

        <!-- leeftijdskeuze -->
        <div
            v-if="phase === 'age'"
            class="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
        >
            <h2 class="mb-[17rem] text-2xl md:text-3xl font-bold text-text-main text-center">
                Hoe oud ben je?
            </h2>

            <div class="w-full max-w-xl space-y-6 mt-[4rem]">
                <InfoTooltip
                    label="En nu ook mijn leeftijd?"
                    content="Zo kan Locky de uitleg precies aanpassen aan hoe oud jij bent. Het helpt alleen om het museum duidelijk en leuk te houden voor jou!"
                    placement="bottom"
                    variant="white"
                />

                <div class="grid gap-3 md:grid-cols-3">
                    <BaseButton
                        variant="secondary"
                        size="md"
                        fullWidth
                        :pressed="selectedAgeGroup === '9-11'"
                        @click="handleSelectAge('9-11')"
                    >
                        9–11 jaar
                    </BaseButton>

                    <BaseButton
                        variant="secondary"
                        size="md"
                        fullWidth
                        :pressed="selectedAgeGroup === '12-15'"
                        @click="handleSelectAge('12-15')"
                    >
                        12–15 jaar
                    </BaseButton>

                    <BaseButton
                        variant="secondary"
                        size="md"
                        fullWidth
                        :pressed="selectedAgeGroup === 'adults'"
                        @click="handleSelectAge('adults')"
                    >
                        Ouder / begeleider
                    </BaseButton>
                </div>

                <BaseButton type="button" :disabled="!selectedAgeGroup" @click="handleAgeNext">
                    Verder
                </BaseButton>
            </div>
        </div>

        <!-- animated pattern background -->
        <div aria-hidden="true" class="bg-stripes" />
    </main>
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
    0% {
        transform: translateY(6px) scale(0.96);
        opacity: 0;
    }
    60% {
        transform: translateY(0) scale(1.02);
        opacity: 1;
    }
    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}
.dialog-pop {
    animation: dialog-pop 0.24s ease-out;
    transform-origin: bottom center;
}

.bg-stripes-overlay {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0.18;

    background-image: linear-gradient(
        -45deg,
        rgba(91, 95, 255, 0.35) 25%,
        rgba(91, 95, 255, 0) 25%,
        rgba(91, 95, 255, 0) 50%,
        rgba(91, 95, 255, 0.35) 50%,
        rgba(91, 95, 255, 0.35) 75%,
        rgba(91, 95, 255, 0) 75%,
        rgba(91, 95, 255, 0) 100%
    );

    background-size: 300px 300px;
    background-position: 0 0;
    animation: stripes-move 10s linear infinite;

    transform: translateZ(0);
    will-change: background-position;
}

@keyframes stripes-move {
    to { background-position: 300px 0; }
}

@media (prefers-reduced-motion: reduce) {
    .bg-stripes-overlay { animation: none; }
}
</style>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDialogLines } from '@/composables/useDialogLines'
import BaseButton from '~/components/ui/BaseButton.vue'

type AgeGroup = '9-11' | '12-15' | 'adults'

const router = useRouter()
const { playerName, playerAgeGroup } = usePlayerProfile()

// onboarding fases
const phase = ref<'intro' | 'name' | 'age'>('intro')

// intro dialog lines
const { step, currentLine, isLastLine, next } = useDialogLines([
    'Psst… ik ben Locky.',
    'Ik pas op jouw spullen in dit datamuseum.',
    'Eerst jouw naam, dan gaan we beginnen.',
])

const handleIntroNext = () => {
    if (!isLastLine.value) {
        next()
        return
    }
    phase.value = 'name'
}

// name (samengevoegd)
const name = computed({
    get: () => playerName.value,
    set: (val: string) => (playerName.value = val),
})

const handleNameNext = () => {
    if (!name.value.trim()) return
    phase.value = 'age'
}

// age (samengevoegd)
const selectedAgeGroup = computed<AgeGroup | null>({
    get: () => (playerAgeGroup.value as AgeGroup | null) ?? null,
    set: (val) => {
        if (!val) return
        playerAgeGroup.value = val as any
    },
})

const handleSelectAge = (value: AgeGroup) => {
    selectedAgeGroup.value = value
}

const handleAgeNext = () => {
    if (!selectedAgeGroup.value) return
    router.push('/choose')
}

// locky svg inline
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
    <main class="relative min-h-screen bg-background-alt overflow-hidden">
        <!-- LOCKY (gecentreerd, responsive) -->
        <div
            v-if="lockySvg"
            class="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2
             pointer-events-none select-none z-20"
            aria-hidden="true"
        >
            <div class="locky-float">
                <div
                    class="locky-svg
                 w-56 h-56
                 sm:w-64 sm:h-64
                 md:w-72 md:h-72
                 lg:w-80 lg:h-80"
                    v-html="lockySvg"
                />
            </div>
        </div>

        <!-- ===== INTRO DIALOOG ===== -->
        <Transition name="dialog-fade">
            <div
                v-if="phase === 'intro'"
                class="absolute inset-0 z-40 flex items-end justify-center px-4 pb-6"
            >
                <div
                    :key="step"
                    class="dialog-pop w-full max-w-xl bg-white shadow-xl px-6 py-8 space-y-4"
                >
                    <p class="text-text-main">
                        {{ currentLine }}
                    </p>

                    <BaseButton type="button" @click="handleIntroNext">
                        Verder
                    </BaseButton>
                </div>
            </div>
        </Transition>

        <!-- ===== NAAM ===== -->
        <div
            v-if="phase === 'name'"
            class="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
        >
            <!-- boven locky -->
            <h2 class="mb-[17rem] text-2xl md:text-3xl font-bold text-text-main text-center">
                Wat is je naam?
            </h2>

            <!-- onder locky -->
            <div class="w-full max-w-md space-y-4">
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-800">
                        Jouw naam
                    </label>

                    <input
                        v-model="name"
                        type="text"
                        class="w-full rounded-full border border-slate-300 px-4 py-2.5
                   text-sm outline-none focus:border-slate-900 focus:ring-1
                   focus:ring-slate-900 bg-slate-50"
                        placeholder="Typ hier je naam"
                    />
                </div>

                <BaseButton
                    type="button"
                    :disabled="!name.trim()"
                    @click="handleNameNext"
                >
                    Verder
                </BaseButton>
            </div>
        </div>

        <!-- ===== LEEFTIJD ===== -->
        <div
            v-if="phase === 'age'"
            class="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
        >
            <!-- boven locky -->
            <h2 class="mb-[17rem] text-2xl md:text-3xl font-bold text-text-main text-center">
                Hoe oud ben je?
            </h2>

            <!-- onder locky -->
            <div class="w-full max-w-xl space-y-4">
                <p class="text-text-main/80 text-center">
                    Zo kunnen we het museum beter laten aansluiten bij jouw leeftijd.
                </p>

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

                <BaseButton
                    type="button"
                    :disabled="!selectedAgeGroup"
                    @click="handleAgeNext"
                >
                    Verder
                </BaseButton>
            </div>
        </div>
    </main>
</template>

<style scoped>
/* fade in/out van dialog */
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

/* locky float (inner wrapper, geen conflict met translate) */
.locky-float {
    transform-origin: 50% 100%;
    animation: locky-float 2.2s ease-in-out infinite;
    filter: drop-shadow(0 10px 16px rgba(0,0,0,0.18));
}

@keyframes locky-float {
    0%, 100% { transform: translateY(0) rotate(-2deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
}

/* svg intern */
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
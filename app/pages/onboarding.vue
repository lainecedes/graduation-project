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
    'Dit is jouw datamuseum.',
    'Hier zie je hoe persoonlijke gegevens online worden gebruikt.',
    'Je ontdekt wat de gevolgen daarvan kunnen zijn.',
    'We beginnen met je naam, zodat dit museum echt van jou is.',
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
</script>

<template>
    <main class="relative min-h-screen bg-primary overflow-hidden">

        <!-- ===== INTRO DIALOOG ===== -->
        <Transition name="dialog-fade">
            <div
                v-if="phase === 'intro'"
                class="absolute inset-0 z-40 flex items-center justify-center px-4"
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
            <h2 class="mb-6 text-3xl md:text-3xl font-bold text-white text-center">
                Wat is je naam?
            </h2>

            <div class="w-full max-w-md space-y-4">
                <div class="space-y-2">
                    <label class="block font-medium text-white">
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
                    variant="secondary"
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
            <h2 class="mb-6 text-3xl md:text-4xl font-bold text-white text-center">
                Hoe oud ben je?
            </h2>

            <div class="w-full max-w-xl space-y-4">
                <p class="text-white text-center">
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
                    variant="secondary"
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
</style>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMuseumSelection } from '@/composables/useMuseumSelection'
import { useDialogLines } from '@/composables/useDialogLines'
import { usePlayerProfile } from '@/composables/usePlayerProfile'
import type { MuseumObjectId } from '~/components/museum/types/museumObjects'
import { objectLabels } from '~/components/museum/types/museumObjects'

import BaseButton from '~/components/ui/BaseButton.vue'
import TooltipDictionary from '~/components/ui/TooltipDictionary.vue'
import DialogHint from '~/components/ui/DialogHint.vue'
import ResultDetailModal from '~/components/museum/ResultDetailModal.vue'
import Locky from '~/components/mascotte/Locky.vue'

// JSON data
import rawObjectInfo from '@/data/objectInfo.json'
import rawObjectSteps from '@/data/objectSteps.json'

// extracted types + constants
import type { AgeGroup, ObjectInfo, ObjectStep } from '~/components/museum/types/resultTypes'
import { imageMap, hintLinesByAge } from '~/components/museum/types/resultConstants'
import { privacyDictionary } from '~/components/museum/types/privacyDictionary'

type LockyMood = 'neutral' | 'happy' | 'sad' | 'surprised'

const mounted = ref(false)
onMounted(() => { mounted.value = true })


const objectInfo = rawObjectInfo as Record<MuseumObjectId, ObjectInfo>
const objectSteps = rawObjectSteps as Record<MuseumObjectId, ObjectStep[]>

const { selectedObjects } = useMuseumSelection()
const { playerAgeGroup, playerName } = usePlayerProfile()

const hasObjects = computed(() => mounted.value && selectedObjects.value.length > 0)

type Phase = 'intro' | 'objects'
const phase = ref<Phase>('intro')

// hint overlay bovenop objects
const showHintDialog = ref(false)
let hintOpenTimer: number | null = null

// leeftijd
const ageGroup = computed<AgeGroup>(() => {
    const value = playerAgeGroup.value as AgeGroup | undefined
    return value ?? '9-11'
})

// Locky intro (na heist)
const {
    step,
    currentLine,
    isLastLine,
    next,
} = useDialogLines([
    'Wow… dat was best wel eng.',
    'De dief is langs geweest, maar ik heb je spullen weer teruggevonden.',
    'Zullen we kijken wat er uit jouw collectie is meegenomen?',
])

// hint dialoog (leeftijd afhankelijk)
const hintLines = computed(() => hintLinesByAge[ageGroup.value])

// hint state (zonder useDialogLines)
const hintIndex = ref(0)

watch(hintLines, () => {
    hintIndex.value = 0
})

const hintStep = computed(() => hintIndex.value)
const hintCurrentLine = computed(() => hintLines.value[hintIndex.value] ?? '')
const hintIsLastLine = computed(() => hintIndex.value >= hintLines.value.length - 1)

const hintNext = () => {
    if (!hintIsLastLine.value) hintIndex.value += 1
}

// hint flow
const handleHintClick = () => {
    if (!hintIsLastLine.value) {
        hintNext()
        return
    }
    showHintDialog.value = false
}

// Locky bounce
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

const handleNext = () => {
    if (!isLastLine.value) {
        next()
        return
    }

    phase.value = 'objects'
    triggerLockyBounce()

    if (hintOpenTimer) {
        clearTimeout(hintOpenTimer)
        hintOpenTimer = null
    }

    showHintDialog.value = false

    hintOpenTimer = window.setTimeout(() => {
        if (!activeId.value) {
            showHintDialog.value = true
            triggerLockyBounce()
        }
    }, 900)
}

// vaste slots voor cirkel
const ringSlots = [
    { id: 'slot1', pos: 'top-[6rem] left-[40%] -translate-x-1/2' },
    { id: 'slot2', pos: 'top-[20rem] left-[32%] -translate-x-1/2' },
    { id: 'slot3', pos: 'top-[6rem] left-[60%] -translate-x-1/2' },
    { id: 'slot4', pos: 'top-[27rem] left-[50%] -translate-x-1/2' },
    { id: 'slot5', pos: 'top-[20rem] left-[68%] -translate-x-1/2' },
] as const

// welke objecten al in detail zijn bekeken (voor wiggle)
const viewedResultObjects = ref<MuseumObjectId[]>([])
const isViewed = (id: MuseumObjectId) => viewedResultObjects.value.includes(id)

// details selection
const activeId = ref<MuseumObjectId | null>(null)

// detail fases 1 = over en risico's 2 = tips en stappen
type DetailPhase = 'about' | 'tips'
const detailPhase = ref<DetailPhase>('about')
const showSteps = ref(false)

// stappenplan state
const currentStepIndex = ref(0)

const activeInfo = computed(() => {
    if (!activeId.value) return null
    return objectInfo[activeId.value]
})

// leeftijds afhankelijke content uit JSON
const activeContent = computed(() => {
    if (!activeInfo.value) return null
    const ag = ageGroup.value
    return {
        title: activeInfo.value.title,
        summary: activeInfo.value.summary[ag],
        risks: activeInfo.value.risks[ag],
        tips: activeInfo.value.tips[ag],
    }
})

const activeSteps = computed<ObjectStep[]>(() => {
    if (!activeId.value) return []
    return objectSteps[activeId.value] ?? []
})

const openObject = (id: MuseumObjectId) => {
    activeId.value = id
    detailPhase.value = 'about'
    showSteps.value = false
    currentStepIndex.value = 0

    showHintDialog.value = false

    if (!viewedResultObjects.value.includes(id)) {
        viewedResultObjects.value.push(id)
    }
}

const closeObject = () => {
    activeId.value = null
    showSteps.value = false
}

// woordenboek voor uitleg hovers
const dictionary = privacyDictionary

const summaryText = computed(() => activeContent.value?.summary ?? '')
const risksText = computed(() => activeContent.value?.risks ?? [])
const tipsText = computed(() => activeContent.value?.tips ?? [])

// ===== Locky moods =====
const introLockyMoodByStep: Record<number, LockyMood> = {
    0: 'surprised',
    1: 'neutral',
    2: 'happy',
}

const hintLockyMoodByStep: Record<number, LockyMood> = {
    0: 'happy',
    1: 'surprised',
    2: 'neutral',
    3: 'neutral',
}

const introLockyMood = computed<LockyMood>(() => {
    return introLockyMoodByStep[step.value] ?? 'neutral'
})

const hintLockyMood = computed<LockyMood>(() => {
    return hintLockyMoodByStep[hintStep.value] ?? 'neutral'
})
</script>

<template>
    <main class="relative min-h-screen bg-primary overflow-hidden px-4 py-4">
        <!-- locky centraal -->
        <div
            v-if="hasObjects && !activeId"
            :class="[
        'absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-20',
        phase === 'intro' ? 'top-[35%]' : 'top-[45%]',
      ]"
            aria-hidden="true"
        >
            <div :class="['locky-bounce', lockyBounce && 'is-bouncing']">
                <Locky
                    :mood="phase === 'intro' ? introLockyMood : hintLockyMood"
                    :size="phase === 'intro' ? 'xl' : 'lg'"
                    class="locky-center"
                />
            </div>
        </div>

        <!-- intro gedeelte -->
        <Transition name="dialog-fade" appear>
            <div
                v-if="phase === 'intro' && hasObjects"
                class="absolute inset-0 z-30 flex items-end justify-center px-4 py-6"
            >
                <div class="relative w-full max-w-xl">
                    <div :key="step" class="dialog-pop bg-white shadow-xl px-6 py-8 space-y-4">
                        <h3 class="uppercase text-primary font-semibold">
                            Locky
                        </h3>

                        <p class="text-text-main text-xl">
                            {{ currentLine }}
                        </p>

                        <div class="flex justify-end">
                            <BaseButton @click="handleNext">
                                {{ isLastLine ? 'Oké!' : 'Verder' }}
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- hint dialog (met Locky slot) -->
        <DialogHint
            :visible="phase === 'objects' && hasObjects && showHintDialog && !activeId"
            :lines="hintLines"
            :step="hintIndex"
            padding-class="pb-20"
            @next="hintNext"
            @close="handleHintClick"
        >
            <template #mascot></template>
        </DialogHint>

        <!-- titel -->
        <div
            v-if="hasObjects && phase === 'objects'"
            class="absolute top-8 left-1/2 -translate-x-1/2 z-30 w-full text-center px-4"
        >
            <h2 class="text-text-on-dark text-2xl md:text-4xl">
                De gestolen objecten van <span class="font-bold">{{ playerName }}</span>
            </h2>
        </div>

        <!-- objecten in een cirkel -->
        <div v-if="hasObjects && phase === 'objects'" class="relative min-h-screen">
            <TransitionGroup
                name="object-pop"
                tag="div"
                class="results-ring relative w-full h-full"
            >
                <button
                    v-for="(id, index) in selectedObjects"
                    :key="id"
                    type="button"
                    class="result-object focus:outline-none"
                    :class="ringSlots[index]?.pos"
                    @click="openObject(id as MuseumObjectId)"
                >
                    <div
                        class="flex flex-col items-center gap-1 cursor-pointer rounded-3xl px-2 py-2 transition-shadow"
                        :class="[
              !isViewed(id as MuseumObjectId) ? 'object-wiggle' : '',
              'hover:shadow-[0_0_22px_rgba(91,95,255,0.85)]',
            ]"
                    >
                        <img
                            :src="imageMap[id as MuseumObjectId]"
                            class="h-28 w-28 md:h-32 md:w-32 object-contain"
                        >
                        <p class="text-xs md:text-sm text-text-on-dark font-semibold text-center">
                            {{ objectLabels[id as MuseumObjectId] }}
                        </p>
                    </div>
                </button>
            </TransitionGroup>
        </div>

        <!-- gedetailleerde scherm -->
        <ResultDetailModal
            v-if="activeId && activeContent"
            :open="!!(activeId && activeContent)"
            :active-id="activeId"
            :object-label="objectLabels[activeId]"
            :object-image-src="imageMap[activeId]"
            :summary-text="summaryText"
            :risks-text="risksText"
            :tips-text="tipsText"
            :steps="activeSteps"
            :dictionary="dictionary"
            @close="closeObject"
        />

        <!-- fallback -->
        <div
            v-if="!hasObjects && phase !== 'objects'"
            class="flex items-center justify-center h-full text-text-main/70"
        >
            Geen objecten gevonden.
        </div>
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
    0% { transform: translateY(6px) scale(0.96); opacity: 0; }
    60% { transform: translateY(0) scale(1.02); opacity: 1; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
}

.dialog-pop {
    animation: dialog-pop 0.24s ease-out;
    transform-origin: bottom center;
}

/* "fake tooltip" look */
.tooltip-term {
    text-decoration: underline;
    text-decoration-style: dotted;
    text-underline-offset: 4px;
    font-weight: 600;
    color: #5b5fff;
    cursor: help;
}
.tooltip-term:focus {
    outline: 2px solid rgba(91, 95, 255, 0.55);
    outline-offset: 3px;
    border-radius: 6px;
}

/* Locky center sizing is handled by Locky component size prop.
   Deze wrapper is alleen voor bounce trigger. */
.locky-center {
    display: block;
}

/* bounce wrapper */
.locky-bounce.is-bouncing {
    animation: locky-bounce 0.48s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes locky-bounce {
    0%   { transform: translateY(0) rotate(0deg) scale(1); }
    35%  { transform: translateY(-18px) rotate(-2deg) scale(1.03); }
    65%  { transform: translateY(0) rotate(2deg) scale(0.99); }
    100% { transform: translateY(0) rotate(0deg) scale(1); }
}

/* ring layout */
.results-ring {
    position: relative;
}

.result-object {
    position: absolute;
    transform-origin: center;
    cursor: pointer;
}

/* pop-in animatie */
.object-pop-enter-active {
    transition: opacity 0.25s ease-out, transform 0.25s ease-out;
}

.object-pop-enter-from {
    opacity: 0;
    transform: scale(0.9) translateY(8px);
}

.object-pop-enter-to {
    opacity: 1;
    transform: scale(1) translateY(0);
}

/* wiggle animatie voor klikbare objecten */
@keyframes object-wiggle {
    0%   { transform: translateY(0) rotate(0deg); }
    25%  { transform: translateY(-3px) rotate(-2deg); }
    50%  { transform: translateY(0) rotate(0deg); }
    75%  { transform: translateY(-3px) rotate(2deg); }
    100% { transform: translateY(0) rotate(0deg); }
}

.object-wiggle {
    animation: object-wiggle 0.5s ease-in-out infinite;
    transform-origin: center bottom;
}
</style>
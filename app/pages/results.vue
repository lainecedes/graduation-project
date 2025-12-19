<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useMuseumSelection } from '@/composables/useMuseumSelection'
import { useDialogLines } from '@/composables/useDialogLines'
import { usePlayerProfile } from '@/composables/usePlayerProfile'
import type { MuseumObjectId } from '~/components/museum/types/museumObjects'
import { objectLabels } from '~/components/museum/types/museumObjects'
import BaseButton from '~/components/ui/BaseButton.vue'

// JSON data voor inhoud
import rawObjectInfo from '@/data/objectInfo.json'
import rawObjectSteps from '@/data/objectSteps.json'

// leeftijdsgroepen
type AgeGroup = '9-11' | '12-15' | 'adults'

type ObjectInfo = {
    title: string
    summary: Record<AgeGroup, string>
    risks: Record<AgeGroup, string[]>
    tips: Record<AgeGroup, string[]>
}

type StepMediaType = 'image' | 'video' | 'icon'

type ObjectStep = {
    title: string
    description: string
    mediaType: StepMediaType
    mediaSrc: string
}

const objectInfo = rawObjectInfo as Record<MuseumObjectId, ObjectInfo>
const objectSteps = rawObjectSteps as Record<MuseumObjectId, ObjectStep[]>

const { selectedObjects } = useMuseumSelection()
const { playerAgeGroup, playerName } = usePlayerProfile()

const hasObjects = computed(() => selectedObjects.value.length > 0)

const imageMap: Record<MuseumObjectId, string> = {
    chat: '/objects/chat.svg',
    passport: '/objects/passport.svg',
    photo: '/objects/privefoto.svg',
    geotag: '/objects/geotag.svg',
    profile: '/objects/interesse-profiel.svg',
}

type Phase = 'intro' | 'objects'
const phase = ref<Phase>('intro')

// leeftijd afleiden
const ageGroup = computed<AgeGroup>(() => {
    const value = playerAgeGroup.value as AgeGroup | undefined
    return value ?? '9-11'
})

// Locky intro (na heist)
const { step, currentLine, isLastLine, next } = useDialogLines([
    'Wow… dat was best wel eng.',
    'De dief is langs geweest, maar ik heb je spullen weer teruggevonden.',
    'Zullen we kijken wat er uit jouw collectie is meegenomen?',
])

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
}

// locky svg
const lockySvg = ref('')
onMounted(async () => {
    try {
        const res = await fetch('/mascotte/locky.svg')
        lockySvg.value = await res.text()
    } catch {
        lockySvg.value = ''
    }
})

// vaste slots voor cirkel
const ringSlots = [
    { id: 'slot1', pos: 'top-[6rem] left-[40%] -translate-x-1/2' },
    { id: 'slot2', pos: 'top-[20rem] left-[32%] -translate-x-1/2' },
    { id: 'slot3', pos: 'top-[6rem] left-[60%] -translate-x-1/2' },
    { id: 'slot4', pos: 'top-[27rem] left-[50%] -translate-x-1/2' },
    { id: 'slot5', pos: 'top-[20rem] left-[68%] -translate-x-1/2' },
]

// welke objecten al in detail zijn bekeken (voor wiggle)
const viewedResultObjects = ref<MuseumObjectId[]>([])

const isViewed = (id: MuseumObjectId) =>
    viewedResultObjects.value.includes(id)

// details selection
const activeId = ref<MuseumObjectId | null>(null)

// detail fases 1 = over en risico's, 2 = tips en stappen
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

const currentStep = computed<ObjectStep | null>(() => {
    return activeSteps.value[currentStepIndex.value] ?? null
})

const canPrevStep = computed(() => currentStepIndex.value > 0)
const canNextStep = computed(
    () => currentStepIndex.value < activeSteps.value.length - 1,
)

const goPrevStep = () => {
    if (canPrevStep.value) currentStepIndex.value -= 1
}

const goNextStep = () => {
    if (canNextStep.value) currentStepIndex.value += 1
}

const openObject = (id: MuseumObjectId) => {
    activeId.value = id
    detailPhase.value = 'about'
    showSteps.value = false
    currentStepIndex.value = 0

    if (!viewedResultObjects.value.includes(id)) {
        viewedResultObjects.value.push(id)
    }
}

const closeObject = () => {
    activeId.value = null
    showSteps.value = false
}

// detail knoppen
const primaryDetailLabel = computed(() => {
    return detailPhase.value === 'about' ? 'Verder' : 'Klaar'
})

const handleDetailNext = () => {
    if (detailPhase.value === 'about') {
        detailPhase.value = 'tips'
        return
    }
    closeObject()
}

const handleDetailBack = () => {
    if (detailPhase.value === 'tips') {
        detailPhase.value = 'about'
        showSteps.value = false
        return
    }
    closeObject()
}

const toggleSteps = () => {
    showSteps.value = !showSteps.value
}
</script>

<template>
    <main class="relative min-h-screen bg-primary overflow-hidden px-4 py-4">
        <!-- locky intro -->
        <div
            v-if="lockySvg && hasObjects && !activeId"
            :class="[
        'absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-20',
        phase === 'intro' ? 'top-[35%]' : 'top-[45%]',
      ]"
            aria-hidden="true"
        >
            <div class="locky-float">
                <div
                    :class="[
            'locky-bounce',
            lockyBounce && 'is-bouncing',
            phase === 'objects' ? 'locky-small' : 'locky-large',
          ]"
                >
                    <div class="locky-svg" v-html="lockySvg" />
                </div>
            </div>
        </div>

        <!-- intro gedeelte -->
        <Transition name="fade">
            <div
                v-if="phase === 'intro' && hasObjects"
                class="absolute inset-0 z-30 flex items-end justify-center px-4 py-6"
            >
                <div class="relative w-full max-w-xl">
                    <div
                        :key="step"
                        class="bg-white shadow-xl px-6 py-8 space-y-4"
                    >
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
        <div
            v-if="hasObjects && phase === 'objects'"
            class="relative min-h-screen"
        >
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
                        class="flex flex-col items-center gap-1 cursor-pointer
                   rounded-3xl px-2 py-2
                   transition-shadow"
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
        <Transition name="fade">
            <div
                v-if="activeId && activeContent"
                class="absolute inset-0 z-40 flex items-center justify-center px-4 bg-black/35 backdrop-blur-[0.1rem]"
            >
                <div
                    class="max-w-4xl w-full bg-white shadow-xl px-5 pb-6 pt-10 md:px-8 md:py-7"
                >
                    <div
                        class="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-8"
                    >
                        <div
                            v-if="lockySvg"
                            class="flex-shrink-0 flex items-start justify-center"
                        >
                            <div class="locky-float-left w-28 h-28 md:w-32 md:h-32">
                                <div class="locky-svg" v-html="lockySvg" />
                            </div>
                        </div>

                        <div class="flex-1 flex flex-col gap-4">
                            <div
                                v-if="detailPhase === 'about'"
                                class="space-y-4 text-left"
                            >
                                <h2 class="text-primary font-bold">Locky zegt....</h2>
                                <div class="space-y-2">
                                    <h3 class="text-xl font-bold uppercase tracking-[0.16em] text-primary">
                                        Wat zegt dit {{ objectLabels[activeId] }} over jou?
                                    </h3>
                                    <p class="text-text-main leading-relaxed">
                                        {{ activeContent.summary }}
                                    </p>
                                </div>

                                <div class="space-y-2">
                                    <h3 class="font-bold uppercase tracking-[0.16em] text-text-main">
                                        Waarom kan dit kwetsbaar zijn?
                                    </h3>
                                    <ul class="space-y-2 text-text-main">
                                        <li
                                            v-for="risk in activeContent.risks"
                                            :key="risk"
                                            class="flex gap-2"
                                        >
                                            <span class="mt-[0.2rem] h-2 w-2 rounded-full bg-primary" />
                                            <span>{{ risk }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div
                                v-else
                                class="space-y-4 text-left"
                            >
                                <h2 class="text-primary font-bold">Locky zegt....</h2>
                                <div class="space-y-4">
                                    <h3 class="text-xl font-bold uppercase tracking-[0.18em] text-primary">
                                        Wat kun je slimmer doen?
                                    </h3>
                                    <ul class="space-y-1.5 text-text-main">
                                        <li
                                            v-for="tip in activeContent.tips"
                                            :key="tip"
                                            class="flex gap-2"
                                        >
                                            <span class="mt-[0.2rem] h-2 w-2 rounded-full bg-emerald-500" />
                                            <span>{{ tip }}</span>
                                        </li>
                                    </ul>
                                </div>

                                <div class="space-y-4">
                                    <BaseButton
                                        variant="primary"
                                        type="button"
                                        @click="toggleSteps"
                                    >
                                        {{ showSteps ? 'Verberg stappenplan' : 'Toon stappenplan' }}
                                    </BaseButton>

                                    <div
                                        v-if="showSteps && currentStep"
                                        class="mt-6 bg-primary-100/40 px-4 py-3 md:px-5 md:py-4 space-y-4"
                                    >
                                        <div class="flex items-center justify-between gap-2">
                                            <div class="font-bold uppercase tracking-[0.16em] text-primary">
                                                Stappenplan
                                            </div>
                                            <div class="text-text-main">
                                                Stap {{ currentStepIndex + 1 }} van {{ activeSteps.length }}
                                            </div>
                                        </div>

                                        <div class="flex flex-col gap-3 md:flex-row md:items-center">
                                            <!-- MEDIA -->
                                            <div class="flex items-center justify-center md:w-1/3">
                                                <img
                                                    v-if="currentStep.mediaType === 'image'"
                                                    :src="currentStep.mediaSrc"
                                                    :alt="currentStep.title"
                                                    class="max-h-32 max-w-full rounded-xl border border-black/5 bg-white object-contain"
                                                >
                                                <div
                                                    v-else
                                                    class="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow"
                                                >
                                                    <span class="text-2xl">📱</span>
                                                </div>
                                            </div>

                                            <!-- TEKST -->
                                            <div class="md:w-2/3 space-y-2">
                                                <h4 class="text-sm font-semibold text-text-main">
                                                    {{ currentStep.title }}
                                                </h4>
                                                <p class="text-sm text-text-main/85">
                                                    {{ currentStep.description }}
                                                </p>
                                            </div>
                                        </div>

                                        <!-- NAV -->
                                        <div class="flex justify-between pt-1">
                                            <button
                                                type="button"
                                                class="rounded-full px-3 py-1.5 text-xs font-semibold text-text-main/80 bg-white hover:bg-black/5 disabled:opacity-40"
                                                :disabled="!canPrevStep"
                                                @click="goPrevStep"
                                            >
                                                Vorige stap
                                            </button>

                                            <button
                                                type="button"
                                                class="rounded-full px-3 py-1.5 text-xs font-semibold text-white bg-primary hover:opacity-90 disabled:opacity-40"
                                                :disabled="!canNextStep"
                                                @click="goNextStep"
                                            >
                                                Volgende stap
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col items-center justify-center gap-2">
                            <img
                                :src="imageMap[activeId as MuseumObjectId]"
                                :alt="objectLabels[activeId as MuseumObjectId]"
                                class="h-24 w-24 md:h-28 md:w-28 object-contain"
                            >
                            <p class="text-xs md:text-sm font-semibold text-text-main text-center">
                                {{ objectLabels[activeId as MuseumObjectId] }}
                            </p>
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 pt-6">
                        <BaseButton
                            variant="secondary"
                            type="button"
                            @click="handleDetailBack"
                        >
                            Terug
                        </BaseButton>

                        <BaseButton
                            type="button"
                            @click="handleDetailNext"
                        >
                            {{ primaryDetailLabel }}
                        </BaseButton>
                    </div>
                </div>
            </div>
        </Transition>

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
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Locky grootte */
.locky-svg {
    transition: width 0.35s ease-out, height 0.35s ease-out, transform 0.35s ease-out;
}

.locky-large .locky-svg {
    width: 18rem;
    height: 18rem;
}

.locky-small .locky-svg {
    width: 10rem;
    height: 10rem;
    transform: translateY(4px) scale(0.95);
}

/* centrale float */
.locky-float {
    transform-origin: 50% 100%;
    animation: locky-float 2.2s ease-in-out infinite;
    filter: drop-shadow(0 10px 16px rgba(0,0,0,0.18));
}

@keyframes locky-float {
    0%, 100% { transform: translateY(0) rotate(-2deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
}

/* kleine float links in detail-view */
.locky-float-left {
    transform-origin: 50% 100%;
    animation: locky-float-left 2.2s ease-in-out infinite;
    filter: drop-shadow(0 8px 14px rgba(0,0,0,0.16));
}

@keyframes locky-float-left {
    0%, 100% { transform: translateY(0) rotate(-1deg); }
    50% { transform: translateY(-6px) rotate(1deg); }
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

/* wiggle animatie voor klikbare objecten (inner wrapper) */
@keyframes object-wiggle {
    0%   { transform: translateY(0) rotate(0deg); }
    25%  { transform: translateY(-3px) rotate(-2deg); }
    50%  { transform: translateY(0) rotate(0deg); }
    75%  { transform: translateY(-3px) rotate(2deg); }
    100% { transform: translateY(0) rotate(0deg); }
}

.object-wiggle {
    animation: object-wiggle 1.4s ease-in-out infinite;
    transform-origin: center bottom;
}
</style>
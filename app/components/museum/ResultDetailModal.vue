<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { MuseumObjectId } from '~/components/museum/types/museumObjects'
import BaseButton from '~/components/ui/BaseButton.vue'
import TooltipDictionary from '~/components/ui/TooltipDictionary.vue'

type StepMediaType = 'image' | 'video' | 'icon'

export type ObjectStep = {
    title: string
    description: string
    mediaType: StepMediaType
    mediaSrc: string
}

type DetailPhase = 'about' | 'tips'

const props = defineProps<{
    open: boolean
    activeId: MuseumObjectId
    lockySvg?: string
    objectLabel: string
    objectImageSrc: string

    summaryText: string
    risksText: string[]
    tipsText: string[]

    steps: ObjectStep[]

    dictionary: Record<string, { label: string; description: string }>
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

const detailPhase = ref<DetailPhase>('about')
const showSteps = ref(false)
const currentStepIndex = ref(0)

watch(
    () => props.open,
    (isOpen) => {
        if (!isOpen) return
        detailPhase.value = 'about'
        showSteps.value = false
        currentStepIndex.value = 0
    }
)

const primaryDetailLabel = computed(() => (detailPhase.value === 'about' ? 'Verder' : 'Klaar'))

const currentStep = computed(() => props.steps[currentStepIndex.value] ?? null)
const canPrevStep = computed(() => currentStepIndex.value > 0)
const canNextStep = computed(() => currentStepIndex.value < props.steps.length - 1)

const goPrevStep = () => {
    if (canPrevStep.value) currentStepIndex.value -= 1
}
const goNextStep = () => {
    if (canNextStep.value) currentStepIndex.value += 1
}

const handleDetailNext = () => {
    if (detailPhase.value === 'about') {
        detailPhase.value = 'tips'
        return
    }
    emit('close')
}

const handleDetailBack = () => {
    if (detailPhase.value === 'tips') {
        detailPhase.value = 'about'
        showSteps.value = false
        return
    }
    emit('close')
}

const toggleSteps = () => {
    showSteps.value = !showSteps.value
}
</script>

<template>
    <Transition name="fade">
        <div
            v-if="open"
            class="absolute inset-0 z-40 flex items-center justify-center px-4 bg-black/35 backdrop-blur-[0.1rem]"
        >
            <div class="max-w-4xl w-full bg-white shadow-xl px-5 pb-6 pt-10 md:px-8 md:py-7">
                <div class="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-8">
                    <div v-if="lockySvg" class="flex-shrink-0 flex items-start justify-center">
                        <div class="locky-float-left w-28 h-28 md:w-32 md:h-32">
                            <div class="locky-svg" v-html="lockySvg" />
                        </div>
                    </div>

                    <div class="flex-1 flex flex-col gap-4">
                        <div v-if="detailPhase === 'about'" class="space-y-4 text-left">
                            <h2 class="text-primary font-bold">Locky zegt....</h2>

                            <div class="space-y-2">
                                <h3 class="text-xl font-bold uppercase tracking-[0.16em] text-primary">
                                    Wat zegt dit {{ objectLabel }} over jou?
                                </h3>

                                <TooltipDictionary
                                    :text="summaryText"
                                    :dictionary="dictionary"
                                    as="p"
                                    class="text-text-main leading-relaxed"
                                />
                            </div>

                            <div class="space-y-2">
                                <h3 class="font-bold uppercase tracking-[0.16em] text-text-main">
                                    Waarom kan dit kwetsbaar zijn?
                                </h3>

                                <ul class="space-y-2 text-text-main">
                                    <li v-for="risk in risksText" :key="risk" class="flex gap-2">
                                        <span class="mt-[0.2rem] h-2 w-2 rounded-full bg-primary" />
                                        <TooltipDictionary :text="risk" :dictionary="dictionary" as="span" />
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div v-else class="space-y-4 text-left">
                            <h2 class="text-primary font-bold">Locky zegt....</h2>

                            <div class="space-y-4">
                                <h3 class="text-xl font-bold uppercase tracking-[0.18em] text-primary">
                                    Wat kun je slimmer doen?
                                </h3>

                                <ul class="space-y-1.5 text-text-main">
                                    <li v-for="tip in tipsText" :key="tip" class="flex gap-2">
                                        <span class="mt-[0.2rem] h-2 w-2 rounded-full bg-emerald-500" />
                                        <TooltipDictionary :text="tip" :dictionary="dictionary" as="span" />
                                    </li>
                                </ul>
                            </div>

                            <div class="space-y-4">
                                <BaseButton variant="primary" type="button" @click="toggleSteps">
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
                                            Stap {{ currentStepIndex + 1 }} van {{ steps.length }}
                                        </div>
                                    </div>

                                    <div class="flex flex-col gap-3 md:flex-row md:items-center">
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

                                        <div class="md:w-2/3 space-y-2">
                                            <h4 class="text-sm font-semibold text-text-main">
                                                {{ currentStep.title }}
                                            </h4>
                                            <p class="text-sm text-text-main/85">
                                                {{ currentStep.description }}
                                            </p>
                                        </div>
                                    </div>

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
                            :src="objectImageSrc"
                            :alt="objectLabel"
                            class="h-24 w-24 md:h-28 md:w-28 object-contain"
                        >
                        <p class="text-xs md:text-sm font-semibold text-text-main text-center">
                            {{ objectLabel }}
                        </p>
                    </div>
                </div>

                <div class="flex justify-end gap-2 pt-6">
                    <BaseButton variant="secondary" type="button" @click="handleDetailBack">
                        Terug
                    </BaseButton>

                    <BaseButton type="button" @click="handleDetailNext">
                        {{ primaryDetailLabel }}
                    </BaseButton>
                </div>
            </div>
        </div>
    </Transition>
</template>

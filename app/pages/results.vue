<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMuseumSelection } from '@/composables/useMuseumSelection'
import { usePlayerProfile } from '@/composables/usePlayerProfile'
import type { MuseumObjectId } from '~/components/museum/types/museumObjects'
import { objectLabels } from '~/components/museum/types/museumObjects'
import BaseButton from '~/components/ui/BaseButton.vue'

// JSON data
import rawObjectInfo from '@/data/objectInfo.json'
import rawObjectSteps from '@/data/objectSteps.json'

const { selectedObjects } = useMuseumSelection()
const { playerName } = usePlayerProfile()

// types
type ObjectInfo = {
    title: string
    summary: string
    risks: string[]
    tips: string[]
}

type StepMediaType = 'image' | 'video' | 'icon'

type ObjectStep = {
    title: string
    description: string
    mediaType: StepMediaType
    mediaSrc: string
}

// JSON data types
const objectInfo = rawObjectInfo as Record<MuseumObjectId, ObjectInfo>
const objectSteps = rawObjectSteps as Record<MuseumObjectId, ObjectStep[]>

// mapping voor visuals
const imageMap: Record<MuseumObjectId, string> = {
    chat: '/objects/chat.svg',
    passport: '/objects/passport.svg',
    photo: '/objects/privefoto.svg',
    geotag: '/objects/geotag.svg',
    profile: '/objects/interesse-profiel.svg',
}

// active object
const activeId = ref<MuseumObjectId | null>(
    (selectedObjects.value[0] as MuseumObjectId) ?? null,
)

const activeInfo = computed(() => {
    if (!activeId.value) return null
    return objectInfo[activeId.value]
})

const hasSelection = computed(() => selectedObjects.value.length > 0)

const handleSelect = (id: MuseumObjectId) => {
    activeId.value = id
}

// stappen state
const currentStepIndex = ref(0)

const activeSteps = computed(() =>
    activeId.value ? objectSteps[activeId.value] ?? [] : [],
)

const currentStep = computed(() =>
    activeSteps.value[currentStepIndex.value] ?? null,
)

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

// reset stappen bij ander object
watch(activeId, () => {
    currentStepIndex.value = 0
})
</script>

<template>
    <main class="min-h-screen bg-background px-4 py-8">
        <div class="mx-auto max-w-6xl space-y-6">
            <header class="space-y-2">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-text-main/60">
                    Resultaten van het datalek
                </p>
                <h1 class="text-2xl md:text-3xl font-bold text-text-main">
                    De gestolen persoonlijke gegevens van {{ playerName }}
                </h1>
                <p class="max-w-2xl text-text-main/80 text-sm">
                    Dit is wat er uit jouw collectie is meegenomen. Klik op een object om te zien
                    welke data erin zit, waarom dat gevoelig is en wat je in het echt slimmer kunt doen.
                </p>
            </header>

            <section
                v-if="hasSelection"
                class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"
            >
                <!-- Links: objectenlijst -->
                <div class="w-full lg:w-[32%] space-y-3">
                    <h2 class="text-sm font-semibold text-text-main">
                        Gestolen objecten
                    </h2>

                    <div class="flex flex-col gap-3">
                        <button
                            v-for="id in selectedObjects"
                            :key="id"
                            type="button"
                            class="group flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition hover:border-primary/50 hover:bg-primary-100/60"
                            :class="activeId === (id as MuseumObjectId)
                ? 'border-primary bg-primary-100/80'
                : 'border-black/5 bg-white/70'"
                            @click="handleSelect(id as MuseumObjectId)"
                        >
                            <div
                                class="flex h-20 w-20 items-center justify-center rounded-xl bg-white shadow-sm overflow-hidden"
                            >
                                <img
                                    v-if="imageMap[id as MuseumObjectId]"
                                    :src="imageMap[id as MuseumObjectId]"
                                    :alt="objectLabels[id as MuseumObjectId]"
                                    class="max-h-16 max-w-16"
                                >
                            </div>

                            <div class="flex flex-col">
                <span class="text-sm font-semibold text-text-main">
                  {{ objectLabels[id as MuseumObjectId] }}
                </span>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- detailpaneel -->
                <div
                    class="relative w-full lg:w-[68%] rounded-3xl border border-black/5 bg-white/90 p-5 md:p-6 shadow-sm"
                >
                    <div
                        v-if="activeInfo"
                        class="space-y-4"
                    >
                        <div class="space-y-1">
                            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
                                {{ activeInfo.title }}
                            </p>
                            <h2 class="text-lg md:text-xl font-bold text-text-main">
                                Wat zegt dit object over jou?
                            </h2>
                        </div>

                        <p class="text-sm leading-relaxed text-text-main/85">
                            {{ activeInfo.summary }}
                        </p>

                        <div class="grid gap-4 md:grid-cols-2">
                            <div class="space-y-2">
                                <h3 class="text-xs font-semibold uppercase tracking-[0.16em] text-text-main/70">
                                    Waarom is dit gevoelig?
                                </h3>
                                <ul class="space-y-1.5 text-sm text-text-main">
                                    <li
                                        v-for="risk in activeInfo.risks"
                                        :key="risk"
                                        class="flex gap-2"
                                    >
                                        <span class="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary" />
                                        <span>{{ risk }}</span>
                                    </li>
                                </ul>
                            </div>

                            <div class="space-y-2">
                                <h3 class="text-xs font-semibold uppercase tracking-[0.16em] text-text-main/70">
                                    Wat kun je slimmer doen?
                                </h3>
                                <ul class="space-y-1.5 text-sm text-text-main">
                                    <li
                                        v-for="tip in activeInfo.tips"
                                        :key="tip"
                                        class="flex gap-2"
                                    >
                                        <span class="mt-[6px] h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        <span>{{ tip }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- Stappenplan -->
                        <div
                            v-if="currentStep"
                            class="mt-4 rounded-2xl bg-primary-100/40 px-4 py-3 md:px-5 md:py-4 space-y-3"
                        >
                            <div class="flex items-center justify-between gap-2">
                                <div class="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
                                    Stappenplan
                                </div>
                                <div class="text-xs text-text-main/70">
                                    Stap {{ currentStepIndex + 1 }} van {{ activeSteps.length }}
                                </div>
                            </div>

                            <div class="flex flex-col gap-3 md:flex-row md:items-center">
                                <!-- Media -->
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

                                <!-- Tekst -->
                                <div class="md:w-2/3 space-y-1">
                                    <h4 class="text-sm font-semibold text-text-main">
                                        {{ currentStep.title }}
                                    </h4>
                                    <p class="text-sm text-text-main/85">
                                        {{ currentStep.description }}
                                    </p>
                                </div>
                            </div>

                            <!-- Navigatie -->
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

                        <div class="pt-2">
                            <BaseButton>
                                reflectie
                            </BaseButton>
                        </div>
                    </div>

                    <div
                        v-else
                        class="flex items-center justify-center text-text-main"
                    >
                        Kies een object hier
                    </div>
                </div>
            </section>

            <section
                v-else
                class="flex flex-row gap-6 justify-center items-center text-sm text-text-main/70"
            >
                Ga eerst door het museum om je
                collectie op te bouwen!
            </section>
        </div>
    </main>
</template>
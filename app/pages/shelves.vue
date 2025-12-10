<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMuseumSelection } from '@/composables/useMuseumSelection'
import { usePlayerProfile } from '@/composables/usePlayerProfile'
import type { MuseumObjectId } from '~/components/museum/types/museumObjects'
import { objectLabels } from '~/components/museum/types/museumObjects'

import ShelvesGrid from '~/components/museum/ShelvesGrid.vue'
import VisitorPhotographer from '~/components/museum/VisitorPhotographer.vue'
import ObjectInfoDialog from '~/components/museum/ObjectInfoDialog.vue'
import MuseumIntroOverlay from '~/components/museum/MuseumIntroOverlay.vue'
import DataHeist from '~/components/museum/DataHeist.vue'
import BaseButton from "~/components/ui/BaseButton.vue";

const { selectedObjects } = useMuseumSelection()
const { playerName } = usePlayerProfile()

const showIntroOverlay = ref(true)

const showVisitor = ref(false)
const showVisitorBubble = ref(false)

const showObjectDialog = ref(false)
const activeObjectId = ref<MuseumObjectId | null>(null)
const clickedObjects = ref<MuseumObjectId[]>([])

const isHeistActive = ref(false)
const isHeistFinished = ref(false)
const showHeistDialog = ref(false)

const visitorObjectId = computed<MuseumObjectId | null>(
    () => (selectedObjects.value[0] as MuseumObjectId | undefined) ?? null,
)

const handleMuseumOpened = () => {
    showIntroOverlay.value = false

    if (!visitorObjectId.value) return

    showVisitor.value = true
    showVisitorBubble.value = true

    window.setTimeout(() => {
        showVisitorBubble.value = false
    }, 3000)
}

const handleObjectClick = (id: MuseumObjectId) => {
    activeObjectId.value = id
    showObjectDialog.value = true

    if (!clickedObjects.value.includes(id)) {
        clickedObjects.value.push(id)
    }
}

const handleCloseDialog = () => {
    showObjectDialog.value = false
}

const viewedCount = computed(() =>
    selectedObjects.value.filter((id) =>
        clickedObjects.value.includes(id as MuseumObjectId),
    ).length,
)

const totalCount = computed(() => selectedObjects.value.length)

const progressPercent = computed(() =>
    totalCount.value === 0 ? 0 : (viewedCount.value / totalCount.value) * 100,
)

const allObjectsViewed = computed(() =>
    selectedObjects.value.length > 0 &&
    selectedObjects.value.every((id) =>
        clickedObjects.value.includes(id as MuseumObjectId),
    ),
)

// ✅ Verder-knop: opent alleen de DataHeist dialoog
const handleNextClick = () => {
    if (!allObjectsViewed.value) return
    showHeistDialog.value = true
}

const handleHeistStart = () => {
    isHeistActive.value = true
}

const handleHeistFinished = () => {
    isHeistFinished.value = true
    // later: router.push('/whatever')
    console.log('Dataheist klaar -> naar eindscene')
}

const handleHeistClose = () => {
    showHeistDialog.value = false
}
</script>

<template>
    <section
        class="relative w-full h-screen overflow-hidden
           bg-[linear-gradient(to_top,#cfe7f5_0_35%,#f5f1e6_35%_100%)]
           p-5"
    >
        <!-- Voortgangsbalk -->
        <div class="relative z-30 mb-4 max-w-xl">
            <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-semibold text-text-main">
                    Objecten bekeken
                </p>
                <p class="text-sm font-semibold text-text-main">
                    {{ viewedCount }} / {{ totalCount }}
                </p>
            </div>

            <div class="h-2 w-full rounded-full bg-white/60 overflow-hidden">
                <div
                    class="h-full rounded-full bg-primary transition-[width] duration-300"
                    :style="{ width: progressPercent + '%' }"
                />
            </div>

            <p class="mt-1 text-xs text-text-main/70">
                Klik alle objecten aan om verder te gaan.
            </p>
        </div>

        <ShelvesGrid
            @object-click="handleObjectClick"
            :is-heist-active="isHeistActive"
            :is-heist-finished="isHeistFinished"
        />

        <div class="relative z-30 mt-4">
            <h2 class="mb-4 text-3xl text-primary font-bold">
                De collectie van {{ playerName }}
            </h2>
        </div>

        <!-- trigger datalek dialoog -->
        <div class="fixed bottom-4 right-4 z-30 ">
        <BaseButton
            v-if="!showHeistDialog && !isHeistActive"
            type="button"
            :disabled="!allObjectsViewed"
            @click="handleNextClick"
        >
            Verder
        </BaseButton>
        </div>

        <MuseumIntroOverlay
            v-if="showIntroOverlay"
            :player-name="playerName"
            @opened="handleMuseumOpened"
        />

        <ObjectInfoDialog
            v-if="showObjectDialog && activeObjectId"
            :id="activeObjectId"
            @close="handleCloseDialog"
        />

        <VisitorPhotographer
            v-if="showVisitor && visitorObjectId"
            :player-name="playerName"
            :object-name="objectLabels[visitorObjectId]"
            :show-bubble="showVisitorBubble"
        />

        <DataHeist
            :open="showHeistDialog"
            @start="handleHeistStart"
            @finished="handleHeistFinished"
            @close="handleHeistClose"
        />
    </section>
</template>

<style scoped>
@keyframes visitor-walk {
    from {
        transform: translateX(120%);
        opacity: 0;
    }
    to {
        transform: translateX(0%);
        opacity: 1;
    }
}

.animate-visitor-walk {
    animation: visitor-walk 0.7s ease-out forwards;
}
</style>
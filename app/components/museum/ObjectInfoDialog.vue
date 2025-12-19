<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { MuseumObjectId } from '~/components/museum/types/museumObjects'
import {
    objectLabels,
    objectDetails,
    type AgeGroup,
} from '~/components/museum/types/museumObjects'
import { usePlayerProfile } from '@/composables/usePlayerProfile'
import BaseButton from '~/components/ui/BaseButton.vue'

const props = defineProps<{
    id: MuseumObjectId
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

const handleClose = () => emit('close')

// leeftijd interface taal

const { playerAgeGroup } = usePlayerProfile()

const ageGroup = computed<AgeGroup>(() => {
    const value = playerAgeGroup.value as AgeGroup | undefined
    return value ?? '9-11'
})

const activeDetails = computed(() => {
    return objectDetails[props.id][ageGroup.value]
})

// Geotag logica met video

const isGeotag = computed(() => props.id === 'geotag')

const geoLines = [
    'Dit is een geotag.',
    'Een geotag kan jouw (bijna) precieze locatie koppelen aan een foto, post of snap.',
    'Zo kunnen anderen zien waar je bent, waar je vaak komt of zelfs waar je woont.',
    'Dit zie je bijvoorbeeld bij apps als Snapchat (Snap Map).',
    'Hier is een korte video die laat zien hoe dat werkt.',
]

// 0..geoLines.length-1 = tekst
// geoLines.length = video
const step = ref(0)
const isVideoStep = computed(() => isGeotag.value && step.value === geoLines.length)

// Locky svg

const lockySvg = ref('')

const loadLocky = async () => {
    try {
        const res = await fetch('/mascotte/locky.svg')
        lockySvg.value = await res.text()
    } catch {
        lockySvg.value = ''
    }
}

onMounted(() => {
    if (isGeotag.value) loadLocky()
})

watch(isGeotag, (val) => {
    if (val) loadLocky()
    else lockySvg.value = ''
})

/* =========================
   YOUTUBE PLAYER
========================= */

const videoId = '24SZovokTQ0'
const playerId = 'yt-geotag-player'
let player: any = null

const loadYouTubeApi = () =>
    new Promise<void>((resolve) => {
        if ((window as any).YT?.Player) return resolve()

            ;(window as any).onYouTubeIframeAPIReady = () => resolve()

        if (document.querySelector('script[data-yt-api]')) return

        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        tag.async = true
        tag.setAttribute('data-yt-api', 'true')
        document.body.appendChild(tag)
    })

const initYouTube = async () => {
    await loadYouTubeApi()
    if (player) return

    const el = document.getElementById(playerId)
    if (!el) return

    player = new (window as any).YT.Player(playerId, {
        videoId,
        playerVars: {
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
        },
    })
}

const destroyPlayer = () => {
    if (player?.destroy) player.destroy()
    player = null
}

// flow geotag
const next = () => {
    if (!isGeotag.value) {
        handleClose()
        return
    }

    if (step.value < geoLines.length) {
        step.value += 1
        return
    }

    // video-stap sluiten
    handleClose()
}

const back = () => {
    if (!isGeotag.value) return
    if (step.value === 0) return

    step.value -= 1

    if (step.value < geoLines.length) {
        destroyPlayer()
    }
}

/* =========================
   WATCHERS / CLEANUP
========================= */

watch(
    () => props.id,
    () => {
        step.value = 0
        destroyPlayer()
    },
)

watch(isVideoStep, async (val) => {
    if (!val) return
    await nextTick()
    await initYouTube()
})

onBeforeUnmount(() => {
    destroyPlayer()
})
</script>

<template>
    <div class="absolute inset-0 z-40 flex items-end justify-center px-4 pb-6">
        <!-- wrapper relatief zodat Locky erboven kan hangen -->
        <div class="dialog-wrap relative w-full max-w-md">
            <!-- locky de mascotte -->
            <div
                v-if="isGeotag && lockySvg"
                class="locky relative -bottom-[5rem] -right-[20rem] w-40 h-40 pointer-events-none select-none"
                aria-hidden="true"
            >
                <div class="locky-float locky-svg w-28 h-28" v-html="lockySvg" />
            </div>

            <div class="dialog-pop w-full bg-white shadow-xl px-6 py-7 space-y-4">
                <h2 class="text-lg font-bold">
                    {{ objectLabels[id] }}
                </h2>

                <!-- =========================
                     GEOTAG: TEKST
                ========================= -->
                <template v-if="isGeotag && !isVideoStep">
                    <p class="text-xl text-slate-700">
                        {{ geoLines[step] }}
                    </p>

                    <div class="flex justify-end pt-2">
                        <BaseButton type="button" @click="next">
                            Verder
                        </BaseButton>
                    </div>
                </template>

                <!-- =========================
                     GEOTAG: VIDEO
                ========================= -->
                <template v-else-if="isGeotag && isVideoStep">
                    <div class="relative overflow-hidden rounded-xl">
                        <div class="absolute inset-0 bg-black/10 backdrop-blur-sm pointer-events-none" />
                        <div class="relative aspect-video w-full bg-black">
                            <div :id="playerId" class="w-full h-full" />
                        </div>
                    </div>

                    <div class="flex items-center justify-between pt-2">
                        <BaseButton variant="secondary" type="button" @click="back">
                            Terug
                        </BaseButton>

                        <BaseButton type="button" @click="handleClose">
                            Ga verder
                        </BaseButton>
                    </div>
                </template>

                <template v-else>
                    <p class="text-xl text-slate-700">
                        {{ activeDetails.line1 }}
                    </p>
                    <p class="text-xl text-slate-700">
                        {{ activeDetails.line2 }}
                    </p>

                    <div class="flex justify-end pt-2">
                        <BaseButton type="button" @click="handleClose">
                            Ik begrijp het
                        </BaseButton>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dialog-wrap {
    padding-top: 3.25rem;
}

.locky-over {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -55%);
    z-index: 10;
    filter: drop-shadow(0 10px 16px rgba(0,0,0,0.18));
}

/* pop animatie */
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

.locky-float {
    transform-origin: 50% 100%;
    animation: locky-float 2.2s ease-in-out infinite;
}
@keyframes locky-float {
    0%,
    100% {
        transform: translateY(0) rotate(-2deg);
    }
    50% {
        transform: translateY(-10px) rotate(2deg);
    }
}

/* scoped + v-html => deep */
.locky-svg :deep(.eye) {
    animation: look 4s ease-in-out infinite;
    transform-origin: center;
}
@keyframes look {
    0%,
    100% {
        transform: translate(0, 0);
    }
    25% {
        transform: translate(3px, 1px);
    }
    50% {
        transform: translate(-3px, 1px);
    }
    75% {
        transform: translate(0, -2px);
    }
}
.locky-svg :deep(.lock-arc) {
    animation: arc-bounce 2.5s ease-in-out infinite;
    transform-origin: center bottom;
}
@keyframes arc-bounce {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-8px);
    }
}
</style>
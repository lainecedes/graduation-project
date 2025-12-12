<script setup lang="ts">
import { useMuseumSelection } from '@/composables/useMuseumSelection'
import type { MuseumObjectId } from '~/components/museum/types/museumObjects'
import { objectLabels } from '~/components/museum/types/museumObjects'

const props = defineProps<{
    isHeistActive?: boolean
    isHeistFinished?: boolean
}>()

const emit = defineEmits<{
    (e: 'object-click', id: MuseumObjectId): void
}>()

const { selectedObjects } = useMuseumSelection()

const shelves = [
    { id: 's1', pos: 'top-[37%] left-[70%]' },
    { id: 's2', pos: 'top-[50%] right-[60%]', z: 'z-20' },
    { id: 's3', pos: 'top-[37%] left-[35%]' },
    { id: 's4', pos: 'top-[50%] right-[18%]', z: 'z-20' },
    { id: 's5', pos: 'top-[37%] left-[15%] -translate-x-1/2' },
]

const objectConfig: Record<MuseumObjectId, { scale: string }> = {
    chat: { scale: 'w-[50%]' },
    passport: { scale: 'w-[40%]' },
    photo: { scale: 'w-[55%]' },
    geotag: { scale: 'w-[45%]' },
    profile: { scale: 'w-[52%]' },
}

const imageMap: Record<MuseumObjectId, string> = {
    chat: '/objects/chat.svg',
    passport: '/objects/passport.svg',
    photo: '/objects/privefoto.svg',
    geotag: '/objects/geotag.svg',
    profile: '/objects/interesse-profiel.svg',
}

const handleClick = (id: MuseumObjectId) => {
    emit('object-click', id)
}
</script>

<template>
    <div>
        <div
            v-for="(shelf, index) in shelves"
            :key="shelf.id"
            :class="[
        'absolute w-[180px] md:w-[220px] lg:w-[260px]',
        shelf.pos,
        shelf.z,
      ]"
        >
            <div class="relative w-full h-full">
                <img
                    src="/objects/stand.svg"
                    alt=""
                    class="w-full h-auto"
                />

                <div
                    v-if="selectedObjects[index] && !isHeistFinished"
                    class="absolute inset-0 flex items-center justify-center"
                >
                    <button
                        type="button"
                        class="relative group flex items-center justify-center transition-transform transition-opacity"
                        :class="{
              'dataheist-steal': isHeistActive,
            }"
                        @click="handleClick(selectedObjects[index] as MuseumObjectId)"
                    >
                        <img
                            :src="imageMap[selectedObjects[index] as MuseumObjectId]"
                            alt=""
                            class="h-auto translate-y-[-100%]"
                            :class="objectConfig[selectedObjects[index] as MuseumObjectId]?.scale || 'w-[55%]'"
                        />

                        <div
                            class="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full
                     rounded-xl bg-primary/80 px-3 py-1 text-sm text-white
                     opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            {{ objectLabels[selectedObjects[index] as MuseumObjectId] }}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes dataheist-steal {
    0% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    40% {
        transform: translateY(-8px) scale(1.05);
    }
    100% {
        transform: translateY(-60px) scale(0.4);
        opacity: 0;
    }
}

.dataheist-steal {
    animation: dataheist-steal 0.5s ease-in-out forwards;
    animation-delay: 1s;
}
</style>
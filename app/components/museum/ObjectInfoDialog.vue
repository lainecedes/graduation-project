<script setup lang="ts">
import type { MuseumObjectId } from '~/components/museum/types/museumObjects'
import { objectLabels, objectDetails } from '~/components/museum/types/museumObjects'
import BaseButton from "~/components/ui/BaseButton.vue";

const props = defineProps<{
    id: MuseumObjectId
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

const handleClose = () => emit('close')

const image = computed(() => objectDetails[props.id].image)
</script>

<template>
    <div class="absolute inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
        <div class="w-full max-w-md rounded-2xl bg-white px-6 py-7 space-y-4 text-left shadow-2xl">
            <h2 class="text-lg font-bold">
                {{ objectLabels[id] }}
            </h2>

            <p class="text-sm text-slate-700">
                {{ objectDetails[id].line1 }}
            </p>
            <p class="text-sm text-slate-700">
                {{ objectDetails[id].line2 }}
            </p>

            <img
                v-if="image"
                :src="image.src"
                :alt="image.alt"
                class="w-full rounded-xl mt-3"
            />

            <div class="flex flex-wrap gap-2 pt-2">
                <BaseButton
                    type="button"
                    @click="handleClose"
                >
                    Ik begrijp het
                </BaseButton>
            </div>
        </div>
    </div>
</template>
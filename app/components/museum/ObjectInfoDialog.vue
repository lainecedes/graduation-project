<script setup lang="ts">
import type { MuseumObjectId } from '~/components/museum/types/museumObjects'
import { objectLabels, objectDetails } from '~/components/museum/types/museumObjects'

const props = defineProps<{
    id: MuseumObjectId
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

const handleClose = () => emit('close')
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

            <div class="flex flex-wrap gap-2 pt-2">
                <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-bold bg-slate-900 text-white hover:opacity-90 active:translate-y-px transition"
                    @click="handleClose"
                >
                    Ik begrijp het
                </button>
                <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 active:translate-y-px transition"
                    @click="handleClose"
                >
                    Oh, zo…
                </button>
            </div>
        </div>
    </div>
</template>
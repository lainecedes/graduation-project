<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    modelValue: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'next'): void
}>()

const name = computed({
    get: () => props.modelValue,
    set: (val: string) => emit('update:modelValue', val),
})

const handleNext = () => {
    if (!name.value.trim()) return
    emit('next')
}
</script>

<template>
    <section
        class="relative flex items-center justify-center w-full h-screen overflow-hidden"
    >
        <img
            src="/characters/photographer.svg"
            alt="Fotograaf"
            class="absolute right-0 top-[-1rem] w-[70%] h-auto pointer-events-none"
        />

        <div class="relative w-full max-w-xl">
            <div class="bg-white bg-opacity-75 rounded-2xl shadow-xl px-6 py-8 space-y-4">
                <h2 class="text-2xl font-bold tracking-tight">Wat is je naam?</h2>

                <p class="text-sm md:text-base text-slate-700 leading-relaxed">
                    Dit museum draait helemaal om jou. Vul je naam in zodat we trots jouw coole
                    collectie kunnen laten zien!
                </p>

                <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-800">Jouw naam</label>
                    <input
                        v-model="name"
                        type="text"
                        class="w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-slate-50"
                        placeholder="Typ hier je naam"
                    />
                </div>

                <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold bg-slate-900 text-white hover:opacity-90 active:translate-y-px transition disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
                    :disabled="!name.trim()"
                    @click="handleNext"
                >
                    Ik ben klaar om mijn collectie te maken
                </button>
            </div>
        </div>
    </section>
</template>
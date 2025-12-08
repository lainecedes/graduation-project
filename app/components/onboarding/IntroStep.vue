<script setup lang="ts">
const emit = defineEmits<{
    (e: 'next'): void
}>()

const goNext = () => {
    emit('next')
}
</script>

<template>
    <section
        class="relative flex items-center justify-center w-full h-screen overflow-hidden"
    >
        <div class="px-6 py-8 space-y-4">
            <h1 class="text-5xl text-primary font-heading">
                Beyond the Screen
            </h1>

            <img
                src="/characters/burglar.svg"
                alt="Crimineel"
                class="absolute right-0 top-[-1rem] w-[70%] h-auto pointer-events-none"
            />

            <p class="font-body text-md w-1/2">
                Je staat op het punt een bijzonder museum binnen te stappen.. Jouw museum.
                Met elke keuze bepaal jij wat er verschijnt.
            </p>
            <p class="font-body text-md w-1/2">
                Jij hebt de controle, maar pas binnenin ontdek je wat die keuzes echt losmaken.
            </p>

            <button
                type="button"
                class="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold bg-primary text-white hover:bg-primary-soft active:translate-y-px transition"
                @click="goNext"
            >
                Start!
            </button>
        </div>
    </section>
</template>
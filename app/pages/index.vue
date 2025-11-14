<script setup lang="ts">
const currentStep = ref<'intro' | 'name'>('intro')
const { playerName } = usePlayerProfile()
const router = useRouter()

const goToNameScreen = () => {
    currentStep.value = 'name'
}

const startMuseum = () => {
    if (!playerName.value.trim()) return
    router.push('/choose')
}

</script>

<template>
    <main
        class="min-h-screen flex items-center justify-center px-4 bg-background-alt"
    >
        <!-- Intro scherm -->
        <section
            v-if="currentStep === 'intro'"
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
                <p class="font-body text-md w-1/2">Jij hebt de controle,
                    maar pas binnenin ontdek je wat die keuzes echt losmaken.</p>

                <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold bg-primary text-white hover:bg-primary-soft active:translate-y-px transition"
                    @click="goToNameScreen"
                >
                    Start!
                </button>
            </div>
        </section>

        <!-- Naam -->
        <section
            v-else
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
                            v-model="playerName"
                            type="text"
                            class="w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-slate-50"
                            placeholder="Typ hier je naam"
                        />
                    </div>

                    <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold bg-slate-900 text-white hover:opacity-90 active:translate-y-px transition disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
                        :disabled="!playerName.trim()"
                        @click="startMuseum"
                    >
                        Ik ben klaar om mijn collectie te maken
                    </button>
                </div>
            </div>
        </section>
    </main>
</template>

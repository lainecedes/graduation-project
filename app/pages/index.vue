<script setup lang="ts">
const router = useRouter()

const goStart = () => {
    router.push('/onboarding')
}
</script>

<template>
    <main class="min-h-screen flex items-center justify-center px-4 bg-background-alt">
        <section class="relative w-full max-w-xl text-center space-y-6">
            <img
                src="/characters/burglar.svg"
                alt=""
                class="absolute right-[-10%] top-[-1rem] w-[70%] h-auto pointer-events-none opacity-30"
            />

            <h1 class="pt-24 text-5xl text-primary font-heading">
                De Digitale Schatkist
            </h1>

            <p class="text-text-main/80">
                Stap jouw datamuseum binnen en ontdek wat jouw keuzes losmaken.
            </p>

            <button
                type="button"
                class="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-primary text-white hover:opacity-90 active:translate-y-px transition"
                @click="goStart"
            >
                Start
            </button>
        </section>
    </main>
</template>
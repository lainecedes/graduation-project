<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'

const router = useRouter()

const goStart = () => {
    router.push('/onboarding')
}

const lockySvg = ref('')

onMounted(async () => {
    try {
        const res = await fetch('/mascotte/locky.svg')
        lockySvg.value = await res.text()
    } catch {
        lockySvg.value = ''
    }
})
</script>

<template>
    <main class="min-h-screen flex items-center justify-center px-4 ">
        <section class="relative w-full max-w-xl text-center space-y-6">
            <img
                src="/characters/burglar.svg"
                alt=""
                class="absolute right-[-10%] top-[-1rem] w-[70%] h-auto pointer-events-none opacity-30 -z-20"
            />

            <!-- Locky boven titel -->
            <div
                v-if="lockySvg"
                class="mx-auto mt-6 mb-2 w-60 h-60 pointer-events-none select-none locky-hero"
                aria-hidden="true"
            >
                <div class="locky-svg" v-html="lockySvg" />
            </div>

            <h1 class="pt-10 text-5xl text-primary font-heading">
                De Digitale Schatkist
            </h1>

            <p class="text-primary">
                Stap jouw datamuseum binnen en ontdek wat jouw keuzes losmaken.
            </p>

            <BaseButton
                variant="secondary"
                type="button"
                @click="goStart"
            >
                Start
            </BaseButton>
        </section>
    </main>
</template>

<style scoped>
.locky-hero {
    transform-origin: 50% 100%;
    animation: locky-float 2.2s ease-in-out infinite;
    filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.18));
}

@keyframes locky-float {
    0%, 100% {
        transform: translateY(0) rotate(-2deg);
    }
    50% {
        transform: translateY(-10px) rotate(2deg);
    }
}

/* klein beetje leven in de SVG zelf (optioneel, zelfde classes als elders) */
.locky-svg :deep(.eye) {
    animation: look 4s ease-in-out infinite;
    transform-origin: center;
}

@keyframes look {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(3px, 1px); }
    50% { transform: translate(-3px, 1px); }
    75% { transform: translate(0, -2px); }
}

.locky-svg :deep(.lock-arc) {
    animation: arc-bounce 2.5s ease-in-out infinite;
    transform-origin: center bottom;
}

@keyframes arc-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
}
</style>
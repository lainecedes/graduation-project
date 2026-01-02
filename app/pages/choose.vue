<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'

const router = useRouter()

const { resetPlayer, playerName } = usePlayerProfile()
const { resetSelection, selectedObjects, toggleObject } = useMuseumSelection()

const endSession = () => {
    resetPlayer()
    resetSelection()
    router.push('/')
}

const imageMap: Record<string, string> = {
    chat: '/objects/chat.svg',
    passport: '/objects/passport.svg',
    photo: '/objects/privefoto.svg',
    geotag: '/objects/geotag.svg',
    profile: '/objects/interesse-profiel.svg',
}

const objects = [
    { id: 'chat', label: 'Persoonlijke chatbubbel' },
    { id: 'passport', label: 'Paspoort' },
    { id: 'photo', label: 'Privefoto' },
    { id: 'geotag', label: 'Locatiepin' },
    { id: 'profile', label: 'Interesse profiel' },
] as const

const entered = ref(false)
onMounted(() => requestAnimationFrame(() => (entered.value = true)))

const selectedCount = computed(() => selectedObjects.value.length)
const canContinue = computed(() => selectedCount.value > 0)

const goToShelves = () => router.push('/shelves')
</script>

<template>
    <section
        class="bg-primary flex w-full h-screen flex-col items-center justify-center py-8 px-4 text-text-on-dark gap-4 overflow-hidden"
    >
        <!-- Titel + uitleg -->
        <div
            class="w-full max-w-5xl text-center"
            :class="entered ? 'hero-in' : 'hero-start'"
        >
            <h1 class="text-5xl text-text-on-dark mb-3">
                Kies wat je wilt laten zien in je collectie,
                <span class="font-bold">{{ playerName }}</span>!
            </h1>

            <p class="text-lg text-text-on-dark/90">
                Je kunt op de objecten klikken. Kies er een paar om verder te gaan.
            </p>
        </div>

        <!-- Objecten -->
        <TransitionGroup
            name="obj"
            tag="div"
            class="flex flex-row flex-wrap justify-center gap-4 mt-4"
        >
            <div
                v-for="(obj, index) in objects"
                :key="obj.id"
                :style="{ transitionDelay: `${140 + index * 90}ms` }"
                v-show="entered"
                class="obj-wrap"
            >
                <ChooseObjects
                    :label="obj.label"
                    :image="imageMap[obj.id]"
                    :selected="selectedObjects.includes(obj.id)"
                    @toggle="toggleObject(obj.id)"
                />
            </div>
        </TransitionGroup>

        <!-- CTA -->
        <div
            class="flex flex-row gap-4 mt-6"
            :class="entered ? 'cta-in' : 'cta-start'"
        >
            <BaseButton
                type="button"
                variant="secondary"
                :disabled="!canContinue"
                @click="goToShelves"
            >
                Maak je collectie!
            </BaseButton>

            <BaseButton
                type="button"
                variant="danger"
                @click="endSession"
            >
                Opnieuw beginnen
            </BaseButton>
        </div>
    </section>
</template>

<style scoped>
/* Titel + uitleg */
.hero-start {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
}
.hero-in {
    opacity: 1;
    transform: translateY(0) scale(1);
    transition: opacity 260ms ease-out, transform 260ms ease-out;
}

/* CTA */
.cta-start {
    opacity: 0;
    transform: translateY(10px);
}
.cta-in {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 260ms ease-out 420ms, transform 260ms ease-out 420ms;
}

/* Object stagger enter */
.obj-enter-active,
.obj-leave-active {
    transition: opacity 260ms ease-out, transform 260ms ease-out;
}
.obj-enter-from,
.obj-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.96);
}
.obj-enter-to,
.obj-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}

/* wrapper zodat delay op het element werkt */
.obj-wrap {
    will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
    .hero-in,
    .cta-in,
    .obj-enter-active,
    .obj-leave-active {
        transition: none !important;
    }
}
</style>
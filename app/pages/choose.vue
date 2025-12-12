<script setup lang="ts">
import BaseButton from "~/components/ui/BaseButton.vue";

const router = useRouter()

const { resetPlayer, playerName } = usePlayerProfile()
const { resetSelection, selectedObjects, toggleObject } = useMuseumSelection()

const endSession = () => {
    resetPlayer()
    resetSelection()
    router.push('/') // terug naar start
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
    { id: 'geotag', label: 'Geotag' },
    { id: 'profile', label: 'Interesse profiel' },
]

const goToShelves = () => {
    router.push('/shelves')
}
</script>

<template>
    <section
        class="bg-primary flex w-full h-screen flex-col items-center justify-center py-8 px-4 text-text-on-dark gap-4"
    >
        <h1 class="text-5xl text-text-on-dark text-center mb-4">
            Kies wat je wilt laten zien in je collectie,
            <span class="font-bold">{{ playerName }}</span>!
        </h1>

        <div class="flex flex-row">
            <ChooseObjects
                v-for="obj in objects"
                :key="obj.id"
                :label="obj.label"
                :image="imageMap[obj.id]"
                :selected="selectedObjects.includes(obj.id)"
                @toggle="toggleObject(obj.id)"
            />
        </div>

        <div class="flex flex-row gap-4">
            <BaseButton
                type="button"
                variant="secondary"
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
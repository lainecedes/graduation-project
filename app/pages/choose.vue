<script setup lang="ts">
const router = useRouter()

const { resetPlayer, playerName } = usePlayerProfile()
const { resetSelection, selectedObjects, toggleObject } = useMuseumSelection()

const endSession = () => {
    resetPlayer()
    resetSelection()
    router.push('/') // terug naar start
}

const imageMap: Record<string, string> = {
    key: '/objects/key.svg',
    passport: '/objects/passport.svg',
    photo: '/objects/key.svg',
    schoolCard: '/objects/key.svg',
    calendar: '/objects/key.svg',
}

const objects = [
    { id: 'key', label: 'Sleutel met adres' },
    { id: 'passport', label: 'Mini paspoort' },
    { id: 'photo', label: 'Foto met locatie' },
    { id: 'schoolCard', label: 'Schoolkaart' },
    { id: 'calendar', label: 'Kalender' },
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

        <button
            class="text-xl text-primary p-4 rounded-xl bg-background"
            type="button"
            @click="goToShelves"
        >
            Naar stellingen
        </button>

        <button
            type="button"
            @click="endSession"
        >
            Sessie afsluiten en opnieuw beginnen
        </button>
    </section>
</template>
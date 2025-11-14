<script setup lang="ts">
const router = useRouter()

// sessie eindigen
const { resetPlayer } = usePlayerProfile()
const { resetSelection } = useMuseumSelection()

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


const { playerName } = usePlayerProfile()

const objects = [
    { id: 'key', label: 'Sleutel met adres' },
    { id: 'passport', label: 'Mini paspoort' },
    { id: 'photo', label: 'Foto met locatie' },
    { id: 'schoolCard', label: 'Schoolkaart' },
    { id: 'calendar', label: 'Kalender' },
]

const { selectedObjects, toggleObject } = useMuseumSelection()

const goToShelves = () => {
    router.push('/shelves')
}
</script>

<template>
    <section class="bg-primary flex w-full h-screen flex-col items-center justify-center py-8 px-4 text-text-on-dark gap-4">
        <h1 class="text-5xl text-text-on-dark text-center mb-4">
            Kies wat je wilt laten zien in je collectie, <span class="font-bold">{{ playerName }}</span>!
        </h1>

            <div class="flex flex-row">
                <button
                    v-for="obj in objects"
                    :key="obj.id"
                    type="button"
                    class="relative flex flex-col-reverse items-center justify-between gap-3 px-4 py-3"
                    @click="toggleObject(obj.id)">

                    <div class="absolute top-1/2 right-2 -translate-y-1/2 w-16 h-16">
                        <img
                            src="/icons/checkmark.svg"
                            alt="selected"
                            class="w-full h-full drop-shadow-[0_0_10px_rgba(16,185,129,0.7)]
                                transform transition-all duration-150 ease-out"
                            :class="selectedObjects.includes(obj.id)
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-0 pointer-events-none'"
                        />
                    </div>

                    <span class="text-sm font-medium">
                      {{ obj.label }}
                    </span>

                    <!-- SVG-->
                    <img
                        v-if="imageMap[obj.id]"
                        :src="imageMap[obj.id]"
                        alt=""
                        class="w-40 h-40"
                    />
                </button>
            </div>

            <button class="text-xl text-primary p-4 rounded-xl bg-background-alt" type="button" @click="goToShelves">
                Naar stellingen
            </button>
            <button
                type="button"
                class=""
                @click="endSession"
            >
                Sessie afsluiten en opnieuw beginnen
            </button>
    </section>
</template>


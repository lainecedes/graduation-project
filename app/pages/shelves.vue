<script setup lang="ts">

const { selectedObjects } = useMuseumSelection()
const { playerName } = usePlayerProfile()

const showIntroOverlay = ref(true)
const isCountingDown = ref(false)
const countdown = ref(3)
const showVisitor = ref(false)
const showVisitorBubble = ref(false)

let visitorTimer: number | null = null
let bubbleTimer: number | null = null


let countdownTimer: number | null = null

const openMuseum = () => {
    if (isCountingDown.value) return

    isCountingDown.value = true
    countdown.value = 3

    countdownTimer = window.setInterval(() => {
        countdown.value -= 1

        if (countdown.value <= 0) {
            if (countdownTimer !== null) {
                clearInterval(countdownTimer)
                countdownTimer = null
            }

            isCountingDown.value = false
            showIntroOverlay.value = false

            // character delay
            visitorTimer = window.setTimeout(() => {
                showVisitor.value = true
                showVisitorBubble.value = true

                // speech bubble dissapears
                bubbleTimer = window.setTimeout(() => {
                    showVisitorBubble.value = false
                }, 3000) // 3 sec
            }, 2000) // 1 sec delay
        }
    }, 1000)
}


// DIALOGS
const objectDetails: Record<string, { line1: string; line2: string }> = {
    key: {
        line1: 'Dit is een sleutel met jouw adres. Online kan dit laten zien waar je woont.',
        line2: 'Als je foto’s of locatie deelt, kunnen vreemde accounts zien waar je huis is.',
    },
    passport: {
        line1: 'Dit mini-paspoort staat voor info zoals je naam en leeftijd.',
        line2: 'Als je social media profiel openbaar is, kunnen onbekenden deze info gebruiken of zich voordoen als jij.',
    },
    photo: {
        line1: 'Deze foto laat je locatie zien. Dat gebeurt ook als je locatie delen aan staat op bijv Tiktok of Snapchat.',
        line2: 'Mensen kunnen dan zien waar je bent en waar je vaak komt.',
    },
    schoolCard: {
        line1: 'Deze schoolkaart laat zien op welke school je zit.',
        line2: 'Als je dat online deelt, weten onbekenden waar je elke dag bent.',
    },
    calendar: {
        line1: 'Deze kalender laat zien wat je planning is.',
        line2: 'Als je online vertelt wanneer je weg bent, kunnen onbekenden je routines zien.',
    },

}

// kies 1 object waar de fotograaf over praat (eerste geselecteerde)
const visitorObjectId = computed(() => selectedObjects.value[0] ?? null)

// progress per object
const showObjectDialog = ref(false)
const activeObjectId = ref<string | null>(null)
const clickedObjects = ref<string[]>([])

const openObjectDialog = (id: string) => {
    activeObjectId.value = id
    showObjectDialog.value = true

    if (!clickedObjects.value.includes(id)) {
        clickedObjects.value.push(id)
    }
}

const closeObjectDialog = () => {
    showObjectDialog.value = false
}

const allObjectsViewed = computed(() =>
    selectedObjects.value.length > 0 &&
    selectedObjects.value.every((id) => clickedObjects.value.includes(id)),
)

// go to next screen when done
const goNext = () => {
    if (!allObjectsViewed.value) return
    console.log('Alles gezien -> daarna naar eind scene')
}

const shelves = [
    { id: 's1', pos: 'top-[37%] left-[70%]' },
    { id: 's2', pos: 'top-[50%] right-[60%]', z: 'z-20' },
    { id: 's3', pos: 'top-[37%] left-[35%]' },
    { id: 's4', pos: 'top-[50%] right-[18%]', z: 'z-20' },
    { id: 's5', pos: 'top-[37%] left-[15%] -translate-x-1/2' },
]

// different configs per object
const objectConfig: Record<string, { scale: string }> = {
    key:        { scale: 'w-[50%]' },
    passport:   { scale: 'w-[40%]' },
    photo:      { scale: 'w-[55%]' },
    schoolCard: { scale: 'w-[45%]' },
    calendar:   { scale: 'w-[52%]' },
}

const objectMap: Record<string, string> = {
    key: 'Sleutel met adres',
    passport: 'Mini paspoort',
    photo: 'Foto met locatie',
    schoolCard: 'Schoolkaart',
    calendar: 'Kalender',
}

const imageMap: Record<string, string> = {
    key: '/objects/key.svg',
    passport: '/objects/passport.svg',
    photo: '/objects/key.svg',
    schoolCard: '/objects/key.svg',
    calendar: '/objects/key.svg',
}
</script>

<template>
    <section
        class="relative w-full h-screen overflow-hidden
           bg-[linear-gradient(to_top,#cfe7f5_0_35%,#f5f1e6_35%_100%)]
           p-5"
    >
        <!-- stellingen en objecten -->
        <div
            v-for="(shelf, index) in shelves"
            :key="shelf.id"
            :class="[
        'absolute w-[180px] md:w-[220px] lg:w-[260px]',
        shelf.pos,
        shelf.z,
      ]"
        >
            <div class="relative w-full h-full">
                <img
                    src="/objects/stand.svg"
                    alt=""
                    class="w-full h-auto"
                />
                <div
                    v-if="selectedObjects[index]"
                    class="absolute inset-0 flex items-center justify-center"
                >
                    <button
                        type="button"
                        class="relative group flex items-center justify-center"
                        @click="openObjectDialog(selectedObjects[index] as string)"
                    >
                        <img
                            :src="imageMap[selectedObjects[index] as string]"
                            alt=""
                            class="h-auto translate-y-[-100%]"
                            :class="objectConfig[selectedObjects[index] as string]?.scale || 'w-[55%]'"
                        />

                        <!-- hover label -->
                        <div
                            class="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full
                     rounded-xl bg-primary/80 px-3 py-1 text-sm text-white
                     opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            {{ objectMap[selectedObjects[index] as string] }}
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <div class="relative z-30 mt-4">
            <h2 class="mb-4 text-3xl text-primary font-bold">
                De collectie van {{ playerName }}
            </h2>
        </div>

        <!-- knop om door te gaan (pas actief na alle objecten) -->
        <button
            type="button"
            class="fixed bottom-4 right-4 z-30 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 active:translate-y-px transition disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
            :disabled="!allObjectsViewed"
            @click="goNext"
        >
            Verder
        </button>

        <!-- overlay: museum openen + countdown -->
        <div
            v-if="showIntroOverlay"
            class="absolute inset-0 z-40 flex items-center justify-center bg-black/60"
        >
            <div
                class="w-full max-w-md rounded-2xl bg-white/95 shadow-2xl px-6 py-8 space-y-4 text-center"
            >
                <template v-if="!isCountingDown">
                    <h2 class="text-2xl font-bold">
                        Je collectie staat klaar, {{ playerName }}!
                    </h2>

                    <p class="text-sm text-main">
                        Je hebt je spullen neergezet in je data museum.
                        Ben je klaar om het museum te openen en te zien hoe bezoekers
                        op jouw collectie reageren?
                    </p>

                    <button
                        type="button"
                        class="mt-4 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold bg-slate-900 text-white hover:opacity-90 active:translate-y-px transition"
                        @click="openMuseum"
                    >
                        Open mijn museum
                    </button>
                </template>

                <template v-else>
                    <p class="text-sm text-main mb-2">
                        Het museum opent in…
                    </p>
                    <div class="text-6xl font-bold tracking-tight text-main">
                        {{ countdown }}
                    </div>
                </template>
            </div>
        </div>

        <!-- dialoog per object (alleen info-kaart) -->
        <div
            v-if="showObjectDialog && activeObjectId"
            class="absolute inset-0 z-40 flex items-center justify-center bg-black/60 px-4"
        >
            <div class="w-full max-w-md rounded-2xl bg-white px-6 py-7 space-y-4 text-left shadow-2xl">
                <h2 class="text-lg font-bold">
                    {{ objectMap[activeObjectId] }}
                </h2>

                <p class="text-sm text-slate-700">
                    {{ objectDetails[activeObjectId].line1 }}
                </p>
                <p class="text-sm text-slate-700">
                    {{ objectDetails[activeObjectId].line2 }}
                </p>

                <div class="flex flex-wrap gap-2 pt-2">
                    <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-bold bg-slate-900 text-white hover:opacity-90 active:translate-y-px transition"
                        @click="closeObjectDialog"
                    >
                        Ik begrijp het
                    </button>
                    <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 active:translate-y-px transition"
                        @click="closeObjectDialog"
                    >
                        Oh, zo…
                    </button>
                </div>
            </div>
        </div>

        <!-- character, speech bubble, -->
        <div
            v-if="showVisitor && visitorObjectId"
            class="pointer-events-none absolute top-[60%] right-[50%] md:top-[55%] md:right-[45%] z-30 animate-visitor-walk"
        >
            <div class="relative w-[140px] md:w-[180px] lg:w-[200px]">
                <img
                    src="/characters/photographer.svg"
                    alt="Bezoeker"
                    class="w-full h-auto drop-shadow-xl"
                />

                <!-- speech bubble, alleen even zichtbaar -->
                <div
                    v-if="showVisitorBubble"
                    class="absolute -top-3 right-full mr-3 max-w-[220px]
             rounded-2xl bg-primary px-4 py-3 text-xs md:text-sm text-text-on-dark shadow-lg
             after:absolute after:top-1/2 after:left-full after:-translate-y-1/2
             after:border-8 after:border-transparent after:border-l-white"
                >
                    <p>
                        Dit is de {{ objectMap[visitorObjectId] }} van
                        <span class="font-semibold">
                      {{ playerName || 'deze bezoeker' }}
                    </span>.
                        Even een foto maken, dan kan ik deze informatie later goed gebruiken!
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>


<style scoped>
@keyframes visitor-walk {
    from {
        transform: translateX(120%);
        opacity: 0;
    }
    to {
        transform: translateX(0%);
        opacity: 1;
    }
}

.animate-visitor-walk {
    animation: visitor-walk 0.7s ease-out forwards;
}
</style>



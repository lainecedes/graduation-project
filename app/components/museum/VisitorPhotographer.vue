<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDialogLines } from '@/composables/useDialogLines'
import { usePlayerProfile } from '@/composables/usePlayerProfile'
import BaseButton from '~/components/ui/BaseButton.vue'

type AgeGroup = '9-11' | '12-15' | 'adults'

const props = defineProps<{
    playerName: string
    objectName: string
    showBubble: boolean
}>()

const { playerAgeGroup } = usePlayerProfile()

const ageGroup = computed<AgeGroup>(() => {
    const value = playerAgeGroup.value as AgeGroup | undefined
    return value ?? '9-11'
})

const dialogLinesByAge: Record<AgeGroup, string[]> = {
    '9-11': [
        `Oeh, dit is de ${props.objectName} van ${props.playerName}!`,
        'Als ik hier een foto van maak, kan ik later precies terug kijken wat ik allemaal over jou kan zien.',
        'Best handig voor mij… maar misschien niet altijd even fijn voor jou..'
    ],
    '12-15': [
        `Jouw ${props.objectName} zegt stiekem best veel over je, ${props.playerName}.`,
        'Met 1 goede foto online kan ik dit bewaren en later terug zoeken wat ik hier allemaal uit kan halen.',
        'Handig voor mij, ook spannend als de verkeerde persoon dit doet..'
    ],
    adults: [
        `De ${props.objectName} van ${props.playerName} is erg interessant om vast te leggen.`,
        'Door hier een foto van te maken, kan ik later rustig bekijken wat er allemaal over jou te zien is.',
        'Dat laat zien hoe snel online informatie bewaard en opnieuw gebruikt kan worden, zonder dat jij daar controle over hebt.'
    ]
}

const isDialogOpen = ref(false)

const {
    step,
    currentLine,
    isLastLine,
    next,
} = useDialogLines(dialogLinesByAge[ageGroup.value])

const handleNext = () => {
    if (!isLastLine.value) {
        next()
        return
    }
    isDialogOpen.value = false
}
</script>

<template>
    <!-- fotograaf -->
    <div
        class="pointer-events-auto absolute top-[60%] right-[50%] md:top-[55%] md:right-[45%] z-30 animate-visitor-walk"
    >
        <button
            type="button"
            class="relative w-[140px] md:w-[180px] lg:w-[200px] focus:outline-none photographer-wiggle"
            @click="isDialogOpen = true"
        >
            <img
                src="/characters/photographer.svg"
                alt="Bezoeker"
                class="w-full h-auto drop-shadow-xl"
            />
        </button>
    </div>

    <!-- dialoog -->
    <Transition name="dialog-fade">
        <div
            v-if="isDialogOpen"
            class="fixed inset-0 z-40 flex items-end justify-center px-4 pb-6"
        >
            <div class="dialog-wrap relative w-full max-w-xl">
                <div
                    :key="step"
                    class="dialog-pop w-full bg-white shadow-xl px-6 py-7 space-y-4"
                >
                    <h3 class="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        Bezoeker met camera
                    </h3>

                    <p class="text-text-main text-xl">
                        {{ currentLine }}
                    </p>

                    <div class="flex justify-end pt-2">
                        <BaseButton type="button" @click="handleNext">
                            {{ isLastLine ? 'Verder' : 'Verder' }}
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.dialog-wrap {
    padding-top: 3.25rem;
}

@keyframes dialog-pop {
    0% { transform: translateY(6px) scale(0.96); opacity: 0; }
    60% { transform: translateY(0) scale(1.02); opacity: 1; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
}
.dialog-pop {
    animation: dialog-pop 0.24s ease-out;
    transform-origin: bottom center;
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
    transition: opacity 0.22s ease-out, transform 0.22s ease-out;
}
.dialog-fade-enter-from,
.dialog-fade-leave-to {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
}

/* wiggle voor fotograaf */
@keyframes photographer-wiggle {
    0%, 100% { transform: rotate(0deg) translateY(0); }
    20% { transform: rotate(-3deg) translateY(-3px); }
    40% { transform: rotate(2deg) translateY(2px); }
    60% { transform: rotate(-2deg) translateY(-2px); }
    80% { transform: rotate(1deg) translateY(1px); }
}

.photographer-wiggle {
    animation: photographer-wiggle 1s ease-in-out infinite;
    transform-origin: bottom center;
}

/* binnenwandeling van rechts */
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
    animation: visitor-walk 1s ease-in-out forwards;
}
</style>
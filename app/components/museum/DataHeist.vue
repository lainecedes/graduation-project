<script setup lang="ts">
import { watch, computed, ref } from 'vue'
import { useDialogLines } from '@/composables/useDialogLines'
import BaseButton from '~/components/ui/BaseButton.vue'

const props = defineProps<{ open: boolean }>()

const emit = defineEmits<{
    (e: 'start'): void
    (e: 'finished'): void
    (e: 'close'): void
}>()

//internal state
const isHeistActive = ref(false)

const {
    step,
    currentLine,
    isLastLine,
    next,
    reset,
} = useDialogLines([
    'Je hebt alle objecten bekeken.',
    'Klaar om te zien wat er gebeurt bij een datalek? Je museum wordt zo meteen overvallen...',
])

const primaryLabel = computed(() =>
    isLastLine.value ? 'Wat gaat er gebeuren?' : 'Verder',
)

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            reset()
            // als je wil dat de dief pas bij heist zichtbaar wordt:
            isHeistActive.value = false
        }
    },
)

const handleClose = () => {
    emit('close')
}

const startHeist = () => {
    emit('start')
    emit('close')

    // dief laten verschijnen + animatie starten
    isHeistActive.value = true

    // optioneel: na X seconden eindscene triggeren
    setTimeout(() => {
        emit('finished')
    }, 3500)
}

const handlePrimaryClick = () => {
    if (!isLastLine.value) {
        next()
        return
    }

    startHeist()
}
</script>

<template>
    <!-- animations voor venster fade in out per line -->
    <Transition name="dialog-fade">
        <div
            v-if="open"
            class="absolute inset-0 z-40 flex items-end justify-center px-4 pb-6"
        >
            <div
                :key="step"
                class="dialog-pop relative w-full max-w-full bg-white p-5 shadow-xl border border-black/5"
            >
                <h3 class="uppercase text-primary">
                    Gids
                </h3>

                <p class="mb-4  text-text-main">
                    {{ currentLine }}
                </p>

                <div class="flex justify-end gap-2">
                    <BaseButton
                        type="button"
                        @click="handlePrimaryClick"
                    >
                        {{ primaryLabel }}
                    </BaseButton>
                </div>
            </div>
        </div>
    </Transition>

    <!-- crimineel -->
    <img
        v-if="isHeistActive"
        src="/characters/burglar.svg"
        alt="Dief"
        class="thief-sequence"
    />
</template>

<style scoped>
@keyframes thief-run {
    0% {
        transform: translateX(-120%);
    }
    100% {
        transform: translateX(200%);
    }
}

@keyframes thief-return {
    0% {
        transform: translateX(-150%);
    }
    100% {
        transform: translateX(-20%);
    }
}

@keyframes thief-idle-wiggle {
    0% {
        transform: translateX(-20%) translateY(0);
    }
    50% {
        transform: translateX(-21%) translateY(-2px);
    }
    100% {
        transform: translateX(-20%) translateY(0);
    }
}

.thief-sequence {
    position: relative;
    bottom: 0%;
    left: -20%;
    width: auto;
    z-index: 50;
    animation:
        thief-run 3s linear forwards,
        thief-return 0.6s ease-out forwards 3.3s,
        thief-idle-wiggle 1.2s ease-in-out infinite 3.9s;
}
</style>
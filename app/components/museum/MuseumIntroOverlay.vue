<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    playerName: string
}>()

const emit = defineEmits<{
    (e: 'opened'): void
}>()

const isCountingDown = ref(false)
const countdown = ref(3)
let countdownTimer: number | null = null

const startCountdown = () => {
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
            emit('opened')
        }
    }, 1000)
}
</script>

<template>
    <div class="absolute inset-0 z-40 flex items-center justify-center bg-black/60">
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
                    @click="startCountdown"
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
</template>
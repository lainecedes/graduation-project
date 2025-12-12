<script setup lang="ts">
import { watch, computed, ref, onMounted } from 'vue'
import { useDialogLines } from '@/composables/useDialogLines'
import BaseButton from '~/components/ui/BaseButton.vue'

const props = defineProps<{ open: boolean }>()

const emit = defineEmits<{
    (e: 'start'): void
    (e: 'finished'): void
    (e: 'close'): void
}>()

// internal state
const isHeistActive = ref(false)

// locky svg inline
const lockySvg = ref('')

const loadLocky = async () => {
    try {
        const res = await fetch('/mascotte/locky.svg')
        lockySvg.value = await res.text()
    } catch {
        lockySvg.value = ''
    }
}

onMounted(() => {
    loadLocky()
})

const {
    step,
    currentLine,
    isLastLine,
    next,
    reset,
} = useDialogLines([
    'Je hebt alles bekeken. Nice.',
    'Maar heb je ooit gedacht wat er gebeurt als deze gegevens ineens op straat liggen?',
    'Zullen we dat even laten gebeuren in jouw museum?',
])

const primaryLabel = computed(() =>
    isLastLine.value ? 'Start dataheist' : 'Verder',
)

watch(
    () => props.open,
    (isOpen) => {
        if (!isOpen) return
        reset()
        isHeistActive.value = false
    },
)

const handleClose = () => {
    emit('close')
}

const startHeist = () => {
    emit('start')
    emit('close')

    isHeistActive.value = true

    window.setTimeout(() => {
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
    <!-- dialoog -->
    <Transition name="dialog-fade">
        <div
            v-if="open"
            class="absolute inset-0 z-40 flex items-end justify-center px-4 pb-6"
        >
            <!-- wrapper relatief zodat Locky erboven kan hangen -->
            <div class="dialog-wrap relative w-full">
                <!-- LOCKY bovenop -->
                <div
                    v-if="lockySvg"
                    class="locky absolute bottom-[65%] z-30 -left-6 w-40 h-40 pointer-events-none select-none"
                    aria-hidden="true"
                >
                    <div class="locky-float locky-svg w-40 h-40" v-html="lockySvg" />
                </div>

                <!-- card -->
                <div
                    :key="step"
                    class="dialog-pop relative w-full max-w-full bg-white shadow-xl px-6 py-8 space-y-4"
                >
                    <h3 class="uppercase text-primary text-xs tracking-[0.18em] font-semibold">
                        Locky
                    </h3>

                    <p class="text-text-main text-base">
                        {{ currentLine }}
                    </p>

                    <div class="flex justify-end gap-2">
                        <BaseButton type="button" @click="handlePrimaryClick">
                            {{ primaryLabel }}
                        </BaseButton>
                    </div>
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
/* fade in/out van dialog */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
    transition: opacity 0.22s ease-out, transform 0.22s ease-out;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
}

.dialog-fade-enter-to,
.dialog-fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}

/* pop per line */
@keyframes dialog-pop {
    0% { transform: translateY(6px) scale(0.96); opacity: 0; }
    60% { transform: translateY(0) scale(1.02); opacity: 1; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
}

.dialog-pop {
    animation: dialog-pop 0.24s ease-out;
    transform-origin: bottom center;
}

/* ruimte boven de card zodat Locky niet clipped */
.dialog-wrap {
    padding-top: 3.25rem;
}

/* locky hangt bovenop */
.locky-over {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -55%);
    z-index: 10;
    filter: drop-shadow(0 10px 16px rgba(0,0,0,0.18));
}

/* locky float */
.locky-float {
    transform-origin: 50% 100%;
    animation: locky-float 2.2s ease-in-out infinite;
}

@keyframes locky-float {
    0%, 100% { transform: translateY(0) rotate(-2deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
}

/* svg intern */
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

/* ====== dief animaties ====== */
@keyframes thief-run {
    0% { transform: translateX(-120%); }
    100% { transform: translateX(200%); }
}

@keyframes thief-return {
    0% { transform: translateX(-150%); }
    100% { transform: translateX(-20%); }
}

@keyframes thief-idle-wiggle {
    0% { transform: translateX(-20%) translateY(0); }
    50% { transform: translateX(-21%) translateY(-2px); }
    100% { transform: translateX(-20%) translateY(0); }
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
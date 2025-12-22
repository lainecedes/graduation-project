<script setup lang="ts">
import { computed } from 'vue'
import { useDialogLines } from '@/composables/useDialogLines'
import BaseButton from '~/components/ui/BaseButton.vue'

const props = withDefaults(
    defineProps<{
        lines: string[]
        title?: string
        visible: boolean
        paddingClass?: string // bv "pb-20" of "pb-6"
        maxWidthClass?: string // bv "max-w-xl"
        lastLabel?: string // bv "Oké"
        nextLabel?: string // bv "Verder"
    }>(),
    {
        title: 'Locky',
        paddingClass: 'pb-20',
        maxWidthClass: 'max-w-xl',
        lastLabel: 'Oké',
        nextLabel: 'Verder',
    }
)

const emit = defineEmits<{
    (e: 'close'): void
}>()

const { step, currentLine, isLastLine, next } = useDialogLines(props.lines)

const buttonLabel = computed(() =>
    isLastLine.value ? props.lastLabel : props.nextLabel
)

const handleClick = () => {
    if (!isLastLine.value) {
        next()
        return
    }
    emit('close')
}
</script>

<template>
    <Transition name="dialog-fade" appear>
        <div
            v-if="visible"
            class="absolute inset-0 z-30 flex items-end justify-center px-4"
            :class="paddingClass"
        >
            <div class="relative w-full" :class="maxWidthClass">
                <div :key="step" class="dialog-pop bg-white shadow-xl px-6 py-8 space-y-4">
                    <slot name="mascot" />

                    <h3 class="uppercase text-primary font-semibold">
                        {{ title }}
                    </h3>

                    <p class="text-text-main text-xl">
                        {{ currentLine }}
                    </p>

                    <div class="flex justify-end">
                        <BaseButton type="button" @click="handleClick">
                            {{ buttonLabel }}
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
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

@keyframes dialog-pop {
    0% {
        transform: translateY(6px) scale(0.96);
        opacity: 0;
    }
    60% {
        transform: translateY(0) scale(1.02);
        opacity: 1;
    }
    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

.dialog-pop {
    animation: dialog-pop 0.24s ease-out;
    transform-origin: bottom center;
}
</style>
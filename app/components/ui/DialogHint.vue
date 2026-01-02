<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'

const props = withDefaults(
    defineProps<{
        lines: string[]
        title?: string
        visible: boolean
        paddingClass?: string
        maxWidthClass?: string
        lastLabel?: string
        nextLabel?: string
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

// ✅ eigen step state (no composable)
const index = ref(0)

const safeLines = computed(() => props.lines ?? [])
const step = computed(() => index.value)
const currentLine = computed(() => safeLines.value[index.value] ?? '')
const isLastLine = computed(() => index.value >= safeLines.value.length - 1)

const buttonLabel = computed(() =>
    isLastLine.value ? props.lastLabel : props.nextLabel
)

// reset als dialog opent of lines veranderen
watch(
    () => props.visible,
    (v) => {
        if (v) index.value = 0
    }
)

watch(
    () => props.lines,
    () => {
        index.value = 0
    },
    { deep: false }
)

const handleClick = () => {
    if (!isLastLine.value) {
        index.value += 1
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
                    <!-- ✅ slot-props step -->
                    <slot name="mascot" :step="step" />

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
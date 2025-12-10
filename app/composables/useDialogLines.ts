// /composables/useDialogLines.ts
import { ref, computed } from 'vue'

export function useDialogLines(lines: string[]) {
    const step = ref(0)

    const currentLine = computed(() => lines[step.value] ?? '')
    const isLastLine = computed(() => step.value === lines.length - 1)

    const next = () => {
        if (!isLastLine.value) {
            step.value++
        }
    }

    const reset = () => {
        step.value = 0
    }

    return {
        step,
        currentLine,
        isLastLine,
        next,
        reset,
    }
}
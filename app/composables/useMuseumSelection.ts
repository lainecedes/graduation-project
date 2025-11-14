// composables/useMuseumSelection.ts
export const useMuseumSelection = () => {
    const selectedObjects = useState<string[]>('museum-selection', () => [])
    const visitedObjects = useState<string[]>('museum-visited', () => [])

    if (import.meta.client) {
        if (!selectedObjects.value.length) {
            const raw = localStorage.getItem('museum-selection')
            if (raw) {
                try {
                    selectedObjects.value = JSON.parse(raw) as string[]
                } catch {
                    selectedObjects.value = []
                }
            }
        }

        if (!visitedObjects.value.length) {
            const raw = localStorage.getItem('museum-visited')
            if (raw) {
                try {
                    visitedObjects.value = JSON.parse(raw) as string[]
                } catch {
                    visitedObjects.value = []
                }
            }
        }

        // changes → localStorage
        watch(
            selectedObjects,
            (val) => {
                localStorage.setItem('museum-selection', JSON.stringify(val))
            },
            { deep: true, immediate: true },
        )

        watch(
            visitedObjects,
            (val) => {
                localStorage.setItem('museum-visited', JSON.stringify(val))
            },
            { deep: true, immediate: true },
        )
    }

    const toggleObject = (id: string) => {
        if (selectedObjects.value.includes(id)) {
            selectedObjects.value = selectedObjects.value.filter((item) => item !== id)
            visitedObjects.value = visitedObjects.value.filter((item) => item !== id)
        } else {
            selectedObjects.value.push(id)
        }
    }

    const markVisited = (id: string) => {
        if (!visitedObjects.value.includes(id)) {
            visitedObjects.value.push(id)
        }
    }

    const resetSelection = () => {
        selectedObjects.value = []
        visitedObjects.value = []

        if (import.meta.client) {
            localStorage.removeItem('museum-selection')
            localStorage.removeItem('museum-visited')
        }
    }

    return {
        selectedObjects,
        visitedObjects,
        toggleObject,
        markVisited,
        resetSelection,
    }
}

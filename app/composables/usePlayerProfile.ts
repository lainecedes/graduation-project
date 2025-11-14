// composables/usePlayerProfile.ts
export const usePlayerProfile = () => {
    const playerName = useState<string>('player-name', () => '')

    // naam uit localStorage
    if (import.meta.client) {

        if (!playerName.value) {
            const saved = localStorage.getItem('player-name')
            if (saved) {
                playerName.value = saved
            }
        }

        // elke verandering opslaan
        watch(
            playerName,
            (val) => {
                localStorage.setItem('player-name', val ?? '')
            },
            { immediate: true },
        )
    }

    const resetPlayer = () => {
        playerName.value = ''
        if (import.meta.client) {
            localStorage.removeItem('player-name')
        }
    }

    return {
        playerName,
        resetPlayer,
    }
}


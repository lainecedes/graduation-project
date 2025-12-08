// composables/usePlayerProfile.ts
import { watch } from 'vue'

export type AgeGroup = '9-11' | '12-15' | 'adults'

export const usePlayerProfile = () => {
    const playerName = useState<string>('player-name', () => '')
    const playerAgeGroup = useState<AgeGroup | null>('player-age-group', () => null)

    if (import.meta.client) {
        // naam uit localStorage
        if (!playerName.value) {
            const savedName = localStorage.getItem('player-name')
            if (savedName) {
                playerName.value = savedName
            }
        }

        // leeftijd uit localStorage
        if (!playerAgeGroup.value) {
            const savedAgeGroup = localStorage.getItem('player-age-group') as AgeGroup | null
            if (savedAgeGroup) {
                playerAgeGroup.value = savedAgeGroup
            }
        }

        // naam opslaan
        watch(
            playerName,
            (val) => {
                localStorage.setItem('player-name', val ?? '')
            },
            { immediate: true },
        )

        // leeftijdsgroep opslaan
        watch(
            playerAgeGroup,
            (val) => {
                if (!val) {
                    localStorage.removeItem('player-age-group')
                } else {
                    localStorage.setItem('player-age-group', val)
                }
            },
            { immediate: true },
        )
    }

    const resetPlayer = () => {
        playerName.value = ''
        playerAgeGroup.value = null

        if (import.meta.client) {
            localStorage.removeItem('player-name')
            localStorage.removeItem('player-age-group')
        }
    }

    return {
        playerName,
        playerAgeGroup,
        resetPlayer,
    }
}


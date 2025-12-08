<script setup lang="ts">
import IntroStep from '~/components/onboarding/IntroStep.vue'
import NameStep from '~/components/onboarding/NameStep.vue'
import AgeStep from '~/components/onboarding/AgeStep.vue'

const currentStep = ref<'intro' | 'name' | 'age' >('intro')
const { playerName, playerAgeGroup } = usePlayerProfile()

const router = useRouter()

const goToNameScreen = () => {
    currentStep.value = 'name'
}

const startMuseum = () => {
    if (!playerName.value.trim()) return
    router.push('/choose')
}
</script>

<template>
    <main
        class="min-h-screen flex items-center justify-center px-4 bg-background-alt"
    >
        <IntroStep
            v-if="currentStep === 'intro'"
            @next="currentStep = 'name'"
        />

        <NameStep
            v-else-if="currentStep === 'name'"
            v-model="playerName"
            @next="currentStep = 'age'"
        />

        <AgeStep
            v-else-if="currentStep === 'age'"
            v-model="playerAgeGroup"
            @start="startMuseum"
        />
    </main>
</template>
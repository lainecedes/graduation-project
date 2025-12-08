<script setup lang="ts">
    import BaseButton from "~/components/ui/BaseButton.vue";

    type AgeGroup = '9-11' | '12-15' | 'adults';

    const props = defineProps<{
        modelValue: AgeGroup | null
    }>()

    const emit = defineEmits<{
        (e: 'update:modelValue', value: AgeGroup): void
        (e: 'start'): void
    }>()

    const selectedAgeGroup = computed({
        get: () => props.modelValue,
        set: (val: AgeGroup | null) => {
            if (!val) return
            emit('update:modelValue', val)
        },
    })

    const handleSelect = (value: AgeGroup) => {
        selectedAgeGroup.value = value
    }

    const handleStart = () => {
        if (!selectedAgeGroup.value) return
        emit('start')
    }
</script>

<template>
    <section
        class="relative flex items-center justify-center w-full h-screen overflow-hidden"
    >
        <div class="relative w-full max-w-xl">
            <div class="bg-white bg-opacity-75 rounded-2xl shadow-xl space-y-6">
                <h2 class="text-2xl font-bold tracking-tight">
                    Hoe oud ben je?
                </h2>

                <p class="">
                    Zo kunnen we het museum beter laten aansluiten bij jouw leeftijd.
                </p>

                <div class="grid gap-3 md:grid-cols-3">
                        <BaseButton
                            variant="secondary"
                            size="md"
                            fullWidth
                            :pressed="selectedAgeGroup === '9-11'"
                            @click="handleSelect('9-11')"
                        >
                            9–11 jaar
                        </BaseButton>

                        <BaseButton
                            variant="secondary"
                            size="md"
                            fullWidth
                            :pressed="selectedAgeGroup === '12-15'"
                            @click="handleSelect('12-15')"
                        >
                            12–15 jaar
                        </BaseButton>

                        <BaseButton
                            variant="secondary"
                            size="md"
                            fullWidth
                            :pressed="selectedAgeGroup === 'adults'"
                            @click="handleSelect('adults')"
                        >
                            Ouder / begeleider
                        </BaseButton>
                </div>

                <button
                    type="button"
                    class="inline-flex items-center justify-center transition disabled:cursor-not-allowed"
                    :disabled="!selectedAgeGroup"
                    @click="handleStart"
                >
                    Verder
                </button>

                <BaseButton>
                    Primair
                </BaseButton>

                <BaseButton variant="secondary">
                    Secundair
                </BaseButton>

                <BaseButton variant="secondary" size="sm">
                    Secundair small
                </BaseButton>

                <BaseButton variant="danger" type="submit">
                    Verwijderen
                </BaseButton>

                <BaseButton fullWidth>
                    Volle breedte
                </BaseButton>
            </div>
        </div>
    </section>
</template>


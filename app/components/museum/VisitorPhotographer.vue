<script setup lang="ts">
const props = defineProps<{
    playerName: string
    objectName: string
    showBubble: boolean
}>()
</script>

<template>
    <div
        class="pointer-events-none absolute top-[60%] right-[50%] md:top-[55%] md:right-[45%] z-30 animate-visitor-walk"
    >
        <div class="relative w-[140px] md:w-[180px] lg:w-[200px]">
            <img
                src="/characters/photographer.svg"
                alt="Bezoeker"
                class="w-full h-auto drop-shadow-xl"
            />

            <div
                v-if="showBubble"
                class="absolute -top-3 right-full mr-3
         w-64 sm:w-72 md:w-80
         rounded-2xl bg-primary px-4 pl-6 py-3
         text-xs md:text-sm text-text-on-dark shadow-lg
         after:absolute after:top-1/2 after:left-full after:-translate-y-1/2
         after:border-8 after:border-transparent after:border-l-primary"
            >
                <p>
                    Dit is de {{ objectName }} van
                    <span class="font-semibold">
            {{ playerName }}
          </span>.
                    Even een foto maken, dan kan ik deze informatie later goed gebruiken!
                </p>
            </div>
        </div>
    </div>
</template>
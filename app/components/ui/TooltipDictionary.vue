<script setup lang="ts">
import { computed } from 'vue'

export type DictionaryItem = {
    label: string
    description: string
}

type TextToken =
    | { type: 'text'; value: string }
    | { type: 'term'; value: string; tip: DictionaryItem }

const props = defineProps<{
    text?: string
    lines?: string[]
    dictionary: Record<string, DictionaryItem>
    as?: 'span' | 'p' | 'div'
    class?: string
}>()

const tag = computed(() => props.as ?? 'span')
const hasText = computed(() => props.text !== undefined)

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const tokenize = (text: string): TextToken[] => {
    if (!text) return [{ type: 'text', value: '' }]

    const keys = Object.keys(props.dictionary)
        .filter(Boolean)
        .sort((a, b) => b.length - a.length)

    if (!keys.length) return [{ type: 'text', value: text }]

    const pattern = new RegExp(`(${keys.map(escapeRegExp).join('|')})`, 'gi')
    const parts = text.split(pattern).filter(Boolean)

    return parts.map((part): TextToken => {
        const matchKey = keys.find((k) => k.toLowerCase() === part.toLowerCase())
        if (!matchKey) return { type: 'text', value: part }

        const tip = props.dictionary[matchKey]
        if (!tip) return { type: 'text', value: part }

        return { type: 'term', value: part, tip }
    })
}

const textTokens = computed(() => tokenize(props.text ?? ''))
const linesTokens = computed(() => (props.lines ?? []).map((l) => tokenize(l)))
</script>

<template>
    <!-- single text -->
    <component v-if="hasText" :is="tag" :class="props.class">
        <template v-for="(token, i) in textTokens" :key="i">
            <span v-if="token.type === 'text'">{{ token.value }}</span>

            <span v-else class="dict-word" tabindex="0">
        {{ token.value }}
        <span class="dict-popup" role="tooltip">
          <strong>{{ token.tip.label }}</strong>
          <span>{{ token.tip.description }}</span>
        </span>
      </span>
        </template>
    </component>

    <!-- lines -->
    <div v-else :class="props.class">
        <div v-for="(tokens, idx) in linesTokens" :key="idx">
            <template v-for="(token, i) in tokens" :key="i">
                <span v-if="token.type === 'text'">{{ token.value }}</span>

                <span v-else class="dict-word" tabindex="0">
          {{ token.value }}
          <span class="dict-popup" role="tooltip">
            <strong>{{ token.tip.label }}</strong>
            <span>{{ token.tip.description }}</span>
          </span>
        </span>
            </template>
        </div>
    </div>
</template>

<style scoped>
.dict-word {
    position: relative;
    font-weight: 600;
    color: #5b5fff;
    cursor: help;
    text-decoration: underline;
    text-decoration-style: dotted;
    text-underline-offset: 4px;
}

.dict-popup {
    position: absolute;
    left: 50%;
    bottom: 120%;
    transform: translateX(-50%);
    z-index: 50;

    width: max-content;
    max-width: 260px;

    background: white;
    color: #111;
    padding: 10px 12px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);

    font-size: 0.85rem;
    line-height: 1.35;

    opacity: 0;
    pointer-events: none;
    transition: opacity 0.18s ease, transform 0.18s ease;
}

.dict-popup strong {
    display: block;
    font-weight: 700;
    margin-bottom: 4px;
}

.dict-word:hover .dict-popup,
.dict-word:focus .dict-popup {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(-50%) translateY(-4px);
}
</style>
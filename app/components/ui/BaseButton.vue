<!-- components/ui/BaseButton.vue -->
<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'link'
        size?: 'sm' | 'md' | 'lg'
        type?: 'button' | 'submit' | 'reset'
        fullWidth?: boolean
        disabled?: boolean
        pressed?: boolean
    }>(),
    {
        variant: 'primary',
        size: 'md',
        type: 'button',
        fullWidth: false,
        disabled: false,
        pressed: false,
    }
)

const baseClasses =
    'inline-flex items-center justify-center rounded-xl font-medium ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

const disabledClasses =
    'bg-[#C7C7C7] text-[#555] border-none cursor-not-allowed translate-y-0 !shadow-none'

const variantClasses: Record<string, string> = {
    primary: `
      bg-primary text-white
      hover:bg-primary-hover active:bg-primary-active
  `,
    secondary: `
      bg-white text-text-main border-[0.1rem] border-[#3B3BDB]
      hover:bg-primary-100
  `,
    outline: `
      border border-text-main text-text-main
      hover:bg-primary-100
  `,
    danger: `
      bg-red-500 text-white
      hover:bg-red-600 active:bg-red-700
  `,
    link: `
      bg-transparent text-primary p-0 h-auto
  `,
}

const shadowClasses: Record<string, string> = {
    primary: 'bg-[#3B3BDB]',
    secondary: 'bg-[#3B3BDB]',
    outline: 'bg-[#A0A0A0]',
    ghost: 'bg-[#C5C5C5]',
    danger: 'bg-[#9D1C1C]',
    link: 'bg-transparent',
}

const sizeClasses: Record<string, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-6 text-base',
}
</script>

<template>
    <div
        :class="[
      'relative inline-block',
      fullWidth && 'w-full',
    ]"
    >
        <!-- shadow weg bij disabled -->
        <div
            v-if="variant !== 'link' && !disabled"
            :class="[
        'absolute inset-x-0 top-1 h-full rounded-xl',
        shadowClasses[variant],
      ]"
        />

        <button
            :type="type"
            :disabled="disabled"
            :class="[
        baseClasses,
        sizeClasses[size],
        fullWidth && 'w-full',

        disabled
          ? disabledClasses
          : [
              variantClasses[variant],
              'relative z-10 transition-transform',
              pressed
                ? 'translate-y-1'
                : '-translate-y-1 hover:translate-y-0 active:translate-y-1'
            ]
      ]"
        >
            <slot />
        </button>
    </div>
</template>
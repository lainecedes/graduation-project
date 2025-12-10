import { defineNuxtPlugin } from '#app'
import gsap from 'gsap'
import SplitText from 'gsap/SplitText'

export default defineNuxtPlugin(() => {
    gsap.registerPlugin(SplitText)

    return {
        provide: {
            gsap,
            SplitText,
        },
    }
})
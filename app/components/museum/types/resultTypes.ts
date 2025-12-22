import type { MuseumObjectId } from './museumObjects'

export type AgeGroup = '9-11' | '12-15' | 'adults'

export type ObjectInfo = {
    title: string
    summary: Record<AgeGroup, string>
    risks: Record<AgeGroup, string[]>
    tips: Record<AgeGroup, string[]>
}

export type StepMediaType = 'image' | 'video' | 'icon'

export type ObjectStep = {
    title: string
    description: string
    mediaType: StepMediaType
    mediaSrc: string
}

export type ImageMap = Record<MuseumObjectId, string>
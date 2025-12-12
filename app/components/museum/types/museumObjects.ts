// app/components/museum/types/museumObjects.ts

export type MuseumObjectId = 'chat' | 'passport' | 'photo' | 'geotag' | 'profile'

export const objectLabels: Record<MuseumObjectId, string> = {
    chat: 'Persoonlijke chatbubbel',
    passport: 'Paspoort',
    photo: 'Privefoto',
    geotag: 'Geotag',
    profile: 'Interesse profiel',
}

export const objectDetails: Record<MuseumObjectId, { line1: string; line2: string }> = {
    chat: {
        line1: 'Dit is een sleutel met jouw adres. Online kan dit laten zien waar je woont.',
        line2: 'Als je foto’s of locatie deelt, kunnen vreemde accounts zien waar je huis is.',
    },
    passport: {
        line1: 'Dit mini-paspoort staat voor info zoals je naam en leeftijd.',
        line2: 'Als je social media profiel openbaar is, kunnen onbekenden deze info gebruiken of zich voordoen als jij.',
    },
    photo: {
        line1: 'Deze foto laat je locatie zien. Dat gebeurt ook als je locatie delen aan staat op bijv Tiktok of Snapchat.',
        line2: 'Mensen kunnen dan zien waar je bent en waar je vaak komt.',
    },
    geotag: {
        line1: 'Deze schoolkaart laat zien op welke school je zit.',
        line2: 'Als je dat online deelt, weten onbekenden waar je elke dag bent.',
    },
    profile: {
        line1: 'Deze kalender laat zien wat je planning is.',
        line2: 'Als je online vertelt wanneer je weg bent, kunnen onbekenden je routines zien.',
    },
}
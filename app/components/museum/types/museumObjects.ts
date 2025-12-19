// app/components/museum/types/museumObjects.ts

export type MuseumObjectId = 'chat' | 'passport' | 'photo' | 'geotag' | 'profile'
export type AgeGroup = '9-11' | '12-15' | 'adults'

type ObjectDetail = {
    line1: string
    line2: string
}

export const objectLabels: Record<MuseumObjectId, string> = {
    chat: 'Persoonlijke chatbubbel',
    passport: 'Identiteitsgegevens',
    photo: 'Privéfoto',
    geotag: 'Locatiepin',
    profile: 'Interesseprofiel',
}

export const objectDetails: Record<MuseumObjectId, Record<AgeGroup, ObjectDetail>> = {
    chat: {
        '9-11': {
            line1: 'In chatjes vertel je hoe jij je voelt en wat je denkt.',
            line2: 'Als iemand dat doorstuurt zonder te vragen, kun je je heel rot voelen.',
        },
        '12-15': {
            line1: 'In chats deel je gevoelens, geheimen en grenzen.',
            line2: 'Als iemand screenshots maakt en rondstuurt, kan dat tegen je gebruikt worden.',
        },
        adults: {
            line1: 'Chats laten veel zien over relaties, emoties en grenzen van de jongere.',
            line2: 'Gelekte gesprekken kunnen langdurige sociale en emotionele schade veroorzaken.',
        },
    },

    passport: {
        '9-11': {
            line1: 'Dit staat voor dingen zoals je naam, leeftijd en waar je vandaan komt.',
            line2: 'Als onbekenden dat weten, kunnen ze doen alsof ze jou zijn.',
        },
        '12-15': {
            line1: 'Dit gaat over identiteitsgegevens zoals naam, geboortedatum en woonplaats.',
            line2: 'Als dit wordt gedeeld, kan iemand zich online voordoen als jou.',
        },
        adults: {
            line1: 'Identiteitsgegevens kunnen worden gekoppeld aan andere online sporen.',
            line2: 'Dit vergroot het risico op misbruik, imitatie of identiteitsfraude.',
        },
    },

    photo: {
        '9-11': {
            line1: 'Op foto’s zien mensen jouw gezicht en soms je kamer of omgeving.',
            line2: 'Als iemand die zonder toestemming deelt, kun je ermee gepest worden.',
        },
        '12-15': {
            line1: 'Dit gaat om kwetsbare foto’s, maar ook gewone foto’s waar jij herkenbaar op staat.',
            line2: 'Als zulke beelden rondgaan, raak je snel de controle kwijt over wie ze ziet.',
        },
        adults: {
            line1: 'Zowel intieme beelden als gewone portretfoto’s maken de jongere herkenbaar.',
            line2: 'Verspreide beelden kunnen leiden tot schaamte, chantage of blijvende reputatieschade.',
        },
    },

    geotag: {
        '9-11': {
            line1: 'Een geotag laat zien waar jij bent of was toen je iets plaatste.',
            line2: 'Mensen kunnen zo zien waar je vaak komt, zoals je huis of school.',
        },
        '12-15': {
            line1: 'Locatiepins en kaartfuncties koppelen plekken aan jouw foto’s en posts.',
            line2: 'Daardoor wordt het makkelijker om je routes en vaste plekken te volgen.',
        },
        adults: {
            line1: 'Locatiegegevens laten patronen zien, zoals huis, school en vaste routes.',
            line2: 'Dit kan gebruikt worden voor ongewenst volgen, profileren of contact leggen.',
        },
    },

    profile: {
        '9-11': {
            line1: 'Apps onthouden wat jij leuk vindt en waar je vaak op klikt.',
            line2: 'Zo kunnen ze je steeds meer van hetzelfde laten zien en reclames op jou richten.',
        },
        '12-15': {
            line1: 'Platforms bouwen een profiel van jouw interesses, zoekgedrag en kijktijd.',
            line2: 'Je komt snel in een bubbel terecht waarin je vooral één soort content ziet.',
        },
        adults: {
            line1: 'Interesseprofielen onthullen gedrag, voorkeuren en kwetsbaarheden van jongeren.',
            line2: 'Gerichte content en advertenties kunnen hier slim op inspelen en onzekerheden uitbuiten.',
        },
    },
}
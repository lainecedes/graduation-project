// app/components/museum/types/museumObjects.ts
type ObjectDetail = {
    line1: string
    line2: string
    image?: {
        src: string
        alt: string
    }
}
export type MuseumObjectId = 'chat' | 'passport' | 'photo' | 'geotag' | 'profile'

export const objectLabels: Record<MuseumObjectId, string> = {
    chat: 'Persoonlijke chatbubbel',
    passport: 'Paspoort',
    photo: 'Privefoto',
    geotag: 'Geotag',
    profile: 'Interesse profiel',
}

export const objectDetails: Record<MuseumObjectId, ObjectDetail> = {
    chat: {
        line1: 'Dit object staat voor privéberichten die je stuurt, zoals chats en DM’s.',
        line2: 'Ook al voelt een chat privé, berichten kunnen worden doorgestuurd of opgeslagen zonder dat jij dat ziet.',
    },

    passport: {
        line1: 'Dit object staat voor gegevens zoals je naam, leeftijd of geboortedatum.',
        line2: 'Als deze informatie openbaar is, kunnen anderen doen alsof zij jou zijn of jouw gegevens verkeerd gebruiken.',
    },

    photo: {
        line1: 'Dit object staat voor foto’s die je online deelt.',
        line2: 'Foto’s kunnen meer laten zien dan je denkt, zoals waar je bent of wie er bij je is.',
    },

    geotag: {
        line1: 'Een geotag is een tag met je locatie die aan een foto, post of snap zit.',
        line2: 'Hierdoor kunnen anderen zien waar je bent of waar je vaak komt.',
        image: {
            src: '/content/snapchat-location.png',
            alt: 'Voorbeeld van een locatie-tag op een foto',
        },
    },

    profile: {
        line1: 'Dit object staat voor het beeld dat apps van jou maken.',
        line2: 'Wat je liket, zoekt of bekijkt, helpt apps bepalen wat ze jou laten zien.',
    },
}
import type { AgeGroup, ImageMap } from '../types/resultTypes'

export const imageMap: ImageMap = {
    chat: '/objects/chat.svg',
    passport: '/objects/passport.svg',
    photo: '/objects/privefoto.svg',
    geotag: '/objects/geotag.svg',
    profile: '/objects/interesse-profiel.svg',
}

export const hintLinesByAge: Record<AgeGroup, string[]> = {
    '9-11': [
        'Nog één ding!',
        'Net zoals aan het begin zie je sommige spullen wiebelen.',
        'Dat betekent dat je erop kunt klikken.',
        'Klik op eentje om te ontdekken wat ermee kan gebeuren.',
    ],
    '12-15': [
        'Wacht nog even.',
        'Net zoals aan het begin bewegen sommige objecten een beetje.',
        'Dat betekent dat ze klikbaar zijn.',
        'Klik op een object om te zien wat er met jouw data kan gebeuren.',
    ],
    adults: [
        'Nog één korte uitleg.',
        'Net zoals aan het begin bewegen sommige objecten subtiel.',
        'Dat geeft aan dat je ze kunt aanklikken.',
        'Klik op een object om meer te zien over risico’s en tips.',
    ],
}
export const VIDEO_CATEGORIES = [
    'Action',
    'Drama',
    'Copmedy',
    'Sci-fi',
    'Thriller',
    'Documentry',
    'Horror',
    'Romance',
    'Adventure',
    'Fantasy'

];
export const RATINGS = [
    'G','PG', 'PG-13', 'R', 'NC-13'
];

export const DIALOG_CONFIG ={
    VIDEO_PLAYER:{
        width: '100vw',
        height: '100vh',
        maxwidth: '100vw',
        maxheight: '100vh',
        panelClass: 'video-player-dialog',
        hasBackdrop: true,
        disableClose: false,
    },
    CHANGE_PASSWORD: {
        width: '600px',
        maxwidth: '90vw', 
        panelClass: 'user-dialog',
         hasBackdrop: true,
        disableClose: false

    },
    CONFIRM: {
        width: '500px',
        panelClass: 'custom-dialog-container',
         hasBackdrop: true,
        disableClose: false

    },
    MANAGE_USER: {
        width: '600px',
        maxwidth: '90vw',
        panelClass:'user-dialog',
        hasBackdrop: true,
        disableClose: false
    },
    VIDEO_FROM: {
        width: '95vw',
         maxwidth: '1400px',
         heigth: 'auto',
         maxHeight: '95vh',
        panelClass:'video-form-dialog',
        hasBackdrop: true,
        disableClose: false
    }
}
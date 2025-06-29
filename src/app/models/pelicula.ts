export class Pelicula {
    _id?: string;
    originalTitle: string;
    description: string;
    releaseDate: string;
    trailer: string;
    primaryImage: string;
    
    constructor() {
        this.originalTitle = '';
        this.description = '';
        this.releaseDate = '';
        this.trailer = '';
        this.primaryImage = '';
    }
}
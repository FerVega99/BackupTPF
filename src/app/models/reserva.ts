import { Funcion } from "./funcion";

export class Reserva {
    _id?: string;
    usuario: string;
    funcion: Funcion;
    cantidadReservas: number;
    fecha: Date;
    precioFinal: number;
    butacasReservadas: string[];
    qr: string;

    constructor() {
        this.usuario = '';
        this.funcion = new Funcion();
        this.cantidadReservas = 0;
        this.fecha = new Date();
        this.precioFinal = 0;
        this.butacasReservadas = [];
        this.qr = '';
    }
}

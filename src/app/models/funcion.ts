import { Pelicula } from "./pelicula";

export class Funcion {
    _id?: string;
    hora: string;
    sala: string;
    fecha: Date;
    numeroButacas: number;
    butacasOcupadas: string[];
    precio: number;
    pelicula: Pelicula;

    constructor() {
        this.hora = '';
        this.sala = '';
        this.fecha = new Date();
        this.numeroButacas = 50;
        this.butacasOcupadas = [];
        this.precio = 5000;
        this.pelicula = new Pelicula();
    }
}
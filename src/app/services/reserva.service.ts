// src/app/services/reservas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  apiUrl: string = 'http://localhost:3000/api';

  constructor(private _http: HttpClient) { 

  }

  public getReservas(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders()
    };
    return this._http.get(`${this.apiUrl}/reserva`, httpOptions);
  }

  public getReserva(id: string): Observable<any> { 
    const httpOptions = {
      headers: new HttpHeaders()
    };
    return this._http.get(`${this.apiUrl}/reserva/${id}`, httpOptions);
  }


  public createReserva(reserva: Reserva): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this._http.post(`${this.apiUrl}/reserva/`, JSON.stringify(reserva), httpOptions);
  }


  public editReserva(id: string, reserva: Reserva): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this._http.put(`${this.apiUrl}/reserva/${id}`, JSON.stringify(reserva), httpOptions);
  }


  public deleteReserva(id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders() 
    };
    return this._http.delete(`${this.apiUrl}/reserva/${id}`, httpOptions);
  }
}
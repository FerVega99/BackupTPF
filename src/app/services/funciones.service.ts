import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcion } from '../models/funcion';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  apiUrl: string = 'http://localhost:3000/api';

  constructor(private _http: HttpClient) {

  }

  public getFunciones(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders()
    };
    return this._http.get(`${this.apiUrl}/funcion/`, httpOptions);
  }

  public postFuncion(funcion: Funcion): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this._http.post(`${this.apiUrl}/funcion/`, JSON.stringify(funcion), httpOptions);
  }

  public getFuncion(funcionId: any): Observable<any> {
     const httpOptions = {
      headers: new HttpHeaders()
    };
    return this._http.get(`${this.apiUrl}/funcion/` + funcionId, httpOptions);
  }
}

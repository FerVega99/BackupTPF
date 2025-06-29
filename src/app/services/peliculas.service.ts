import { Injectable } from '@angular/core';
import { Pelicula } from '../models/pelicula';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  peliculasAgregadas: Pelicula[] = [];
  apiUrl: string = 'http://localhost:3000/api';

  constructor(private _http: HttpClient) { }

  postMovie(pelicula: Pelicula): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let body: any = JSON.stringify(pelicula);
    return this._http.post(`${this.apiUrl}/pelicula/`, body, httpOptions);
  }

  getPeliculas(): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders()
    }
    return this._http.get(`${this.apiUrl}/pelicula/`, httpOptions);
  }

  deletePelicula(id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this._http.delete(`${this.apiUrl}/pelicula/${id}`, httpOptions);
  }

  public getMovies(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'X-RapidAPI-Key': 'f7ac652b81msh31de2978fe077e9p130f83jsne6b600a1a991',
        'X-RapidAPI-Host': 'imdb236.p.rapidapi.com'
      })
    };
    return this._http.get("https://imdb236.p.rapidapi.com/api/imdb/top-box-office", httpOptions);
  }

  public postMovieTranslate(description: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-rapidapi-key': '464cbdd516msh188ba69cecd6233p1f9d05jsnac4f9d82c946',
        'x-rapidapi-host': 'google-translate113.p.rapidapi.com',
        'Content-Type': 'application/json'
      }),
    };

    const data = {
      from: "en",
      to: "es",
      json: {
        text: description
      }
    };

    return this._http.post("https://google-translate113.p.rapidapi.com/api/v1/translator/json", data, httpOptions);
  }
}
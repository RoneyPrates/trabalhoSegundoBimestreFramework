import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl = 'https://www.omdbapi.com/';
  private apiKey = 'df385698';

  constructor(private http: HttpClient) {}

  searchMovies(query: string, page: number = 1): Observable<any> {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 3) {
      return of({ Search: [] });
    }

    const params = new HttpParams()
      .set('s', trimmedQuery)
      .set('page', page.toString())
      .set('apikey', this.apiKey);

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      tap((response) => {
        if (response.Search) {
          console.log('Filmes encontrados:', response.Search);
        }
      }),
      catchError((error) => {
        console.error('Erro ao buscar filmes:', error);
        return of({ Search: [] });
      })
    );
  }

  getMovieDetails(imdbID: string): Observable<any> {
    const params = new HttpParams()
      .set('i', imdbID)
      .set('apikey', this.apiKey);

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      tap((response) => {
        console.log('Detalhes completos do filme:', response);
      }),
      catchError((error) => {
        console.error('Erro ao buscar detalhes do filme:', error);
        return of(null);
      })
    );
  }
}

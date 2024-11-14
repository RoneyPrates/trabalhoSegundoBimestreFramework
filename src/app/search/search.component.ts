import { Component } from '@angular/core';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  query: string = '';
  movies: any[] = [];
  favoriteMovies: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private movieService: MovieService) {
    this.loadFavorites();
  }

  loadFavorites(): void {
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
      try {
        this.favoriteMovies = JSON.parse(favorites) || [];
      } catch (error) {
        console.error('Erro ao carregar favoritos', error);
        this.favoriteMovies = [];
      }
    }
  }

  isFavorite(movie: any): boolean {
    return this.favoriteMovies.some((f) => f.imdbID === movie.imdbID);
  }

  getFavoriteButtonLabel(movie: any): string {
    return this.isFavorite(movie)
      ? 'Remover dos Favoritos'
      : 'Adicionar aos Favoritos';
  }

  onSearch(): void {
    if (this.query.trim().length < 3) {
      this.movies = [];
      this.errorMessage = 'Por favor, insira pelo menos 3 caracteres para buscar filmes.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.movieService.searchMovies(this.query).subscribe(
      (response) => {
        if (response && response.Search && response.Search.length > 0) {
          this.movies = response.Search;
          this.movies.forEach((movie) => {
            this.movieService.getMovieDetails(movie.imdbID).subscribe(
              (details) => {
                if (details) {
                  Object.assign(movie, details);
                }
              },
              (error) => {
                console.error('Erro ao obter detalhes do filme:', error);
              }
            );
          });
        } else {
          this.movies = [];
          this.errorMessage = 'Nenhum filme ou série encontrado.';
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Erro ao buscar filmes.';
      }
    );
  }


  toggleFavorite(movie: any): void {
    if (!movie || !movie.imdbID) {
      console.error('Filme inválido:', movie);
      return;
    }

    const index = this.favoriteMovies.findIndex((f) => f.imdbID === movie.imdbID);

    if (index === -1) {
      this.favoriteMovies.push(movie);
    } else {
      this.favoriteMovies.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(this.favoriteMovies));
  }
}

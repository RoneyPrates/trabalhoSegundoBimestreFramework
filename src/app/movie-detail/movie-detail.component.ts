import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  movie: any;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {
  }

  ngOnInit(): void {
    const imdbID = this.route.snapshot.paramMap.get('id');
    if (imdbID) {
      this.loading = true;
      this.movieService.getMovieDetails(imdbID).subscribe(
        (response) => {
          if (response) {
            this.movie = response;
          } else {
            console.error('Detalhes do filme não encontrados.');
            this.movie = null;
          }
          this.loading = false;
        },
        (error) => {
          console.error('Erro ao obter detalhes do filme:', error);
          this.loading = false;
        }
      );
    }
  }
}

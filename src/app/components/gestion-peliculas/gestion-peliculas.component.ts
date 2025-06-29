import { Component } from '@angular/core';
import { Pelicula } from '../../models/pelicula';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeliculasService } from '../../services/peliculas.service';

@Component({
  selector: 'app-gestion-peliculas',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-peliculas.component.html',
  styleUrl: './gestion-peliculas.component.css'
})
export class GestionPeliculasComponent {

  peliculas: Pelicula[] = []; 
  peliculasAgregadas: Pelicula[] = []; 

  constructor(private peliculaService: PeliculasService) { }

  ngOnInit() {
    this.mostrarPeliculasBD();
  }

  obtenerPeliculas() {
    this.peliculaService.getMovies().subscribe(
      result => {
        this.peliculas = result.map((item: any) => {
          const peli = new Pelicula();
          peli.originalTitle = item.originalTitle;
          peli.description = item.description;
          peli.releaseDate = item.releaseDate;
          peli.trailer = item.trailer;
          peli.primaryImage = item.primaryImage;
          return peli;
        });

        this.peliculas.forEach((peli) => {
          this.peliculaService.postMovieTranslate(peli.description).subscribe(
            result => {
              peli.description = result.trans.text;
            },
            error => {
              console.error('Error al traducir:', peli.originalTitle, error);
              peli.description = 'Descripción no disponible.';
            }
          );
        });
        console.log('Películas obtenidas de la API externa:', this.peliculas);
      },
      error => {
        console.error('Error al obtener películas de la API externa:', error);
      }
    );
  }

  mostrarPeliculasBD() {
    this.peliculaService.getPeliculas().subscribe(
      result => {
        this.peliculasAgregadas = result.map((item: any) => {
          const peli = new Pelicula();
          peli._id = item._id;
          peli.originalTitle = item.originalTitle;
          peli.description = item.description;
          peli.releaseDate = item.releaseDate;
          peli.trailer = item.trailer;
          peli.primaryImage = item.primaryImage;
          return peli;
        });
        console.log('Películas obtenidas de la BD:', this.peliculasAgregadas);
      },
      error => {
        console.error('Error al obtener películas de la BD:', error);
      }
    );
  }

  agregarPelicula(pelicula: Pelicula) {
    this.peliculaService.postMovie(pelicula).subscribe({
      next: (result) => {
        console.log('Respuesta del servidor al agregar película:', result);
        if (result.status === '1') {
          alert('¡Película agregada con éxito!');
          this.mostrarPeliculasBD(); 
          console.log('Película agregada:', pelicula);
        } else {
          alert('Algo salió mal al agregar la película. Por favor, inténtelo de nuevo.');
        }
      },
      error: (err) => {
        console.error('Error al agregar película:', err);
        if (err.status === 409) {
          alert('Error: ¡Esta película ya está agregada en la base de datos!');
        } else if (err.status === 400) {
            alert('Error al agregar la película. Verifique los datos enviados.');
        }
        else {
          alert('Error inesperado al intentar agregar la película. Por favor, intente más tarde.');
        }
      },
      complete: () => {
        console.log('Operación de agregar película completada.');
      }
    });
  }

  eliminarPelicula(pelicula: Pelicula) {
    if (pelicula._id) {
      this.peliculaService.deletePelicula(pelicula._id).subscribe({
        next: () => {
          alert('Película eliminada con éxito.');
          this.mostrarPeliculasBD();
        },
        error: (err) => {
          console.error('Error al eliminar película:', err);
        }
      });
    } else {
      alert('Error: ID de la película no disponible.');
      console.error('No se puede eliminar la película porque _id es undefined:', pelicula);
    }
  }
}
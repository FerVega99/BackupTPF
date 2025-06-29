import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Pelicula } from '../../models/pelicula';
import { PeliculasService } from '../../services/peliculas.service';

@Component({
  selector: 'app-cartelera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cartelera.component.html',
  styleUrl: './cartelera.component.css'
})
export class CarteleraComponent implements OnInit {
  peliculas: Pelicula[] = [];
  trailerEmbedUrl: SafeResourceUrl | null = null;
  mostrado: boolean = false;


  constructor(
    private router: Router,
    private peliculaService: PeliculasService,
    private sanitizer: DomSanitizer
  ) { }


  ngOnInit(): void {
    this.mostrarCartelera();
  }

  mostrarCartelera() {
    this.peliculaService.getPeliculas().subscribe(
      result => {
        this.peliculas = result;
      },
      error => {
        console.error('Error al obtener películas:', error);
      }
    );
  }

  verFunciones() {
    this.router.navigate(['funciones']);
  }

  verTrailer(trailerUrl: string) {
    const embedUrl = this.convertirYoutubeEmbed(trailerUrl); // Convierte la URL regular de YouTube a una URL de incrustación
    // Marca la URL como segura para omitir las comprobaciones de seguridad de Angular para iframes
    this.trailerEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  cerrarModal() {
    this.trailerEmbedUrl = null;
  }

  @HostListener('document:keydown.escape', ['$event'])
  cerrarConEsc() {
    this.cerrarModal(); // Llama a cerrarModal cuando se presiona la tecla escape
  }

  // Convierte una URL estándar de YouTube a una URL incrustable de YouTube
  convertirYoutubeEmbed(url: string): string {
    // Expresión regular para extraer el ID de video de varios formatos de URL de YouTube
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/);
    const videoId = match && match[1] ? match[1] : ''; // Extrae el ID del video
    // Construye la URL de incrustación. Nota: Hay un error tipográfico en el código original, '0{videoId}' debería ser `${videoId}`
    // La línea corregida debería ser: return `https://www.youtube.com/embed/${videoId}`;
    return `https://www.youtube.com/embed/${videoId}`;
  }
}
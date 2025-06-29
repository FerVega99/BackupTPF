import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Necesario para CommonModule
import { Funcion } from '../../models/funcion';
import { PeliculasService } from '../../services/peliculas.service';
import { Pelicula } from '../../models/pelicula';
import { FuncionesService } from '../../services/funciones.service';

@Component({
  selector: 'app-gestion-funciones',
  imports: [FormsModule, CommonModule], // Asegúrate de que CommonModule esté importado
  templateUrl: './gestion-funciones.component.html',
  styleUrl: './gestion-funciones.component.css'
})
export class GestionFuncionesComponent implements OnInit {
  nuevaFuncion: Funcion = new Funcion();
  peliculas: Pelicula[] = [];
  horariosDisponibles: string[] = [
    '14:00', '16:00', '18:00', '20:00', '22:00'
  ];
  salasDisponibles: string[] = [
    'Sala 1', 'Sala 2', 'Sala 3', 'Sala 4'
  ];

  selectedStartDate: string = '';
  selectedEndDate: string = '';
  selectedSingleDate: string = ''; // Nueva propiedad para la fecha de función única
  isSingleFunctionMode: boolean = true; // Controla si se crea una función única o un rango

  constructor(private peliculasService: PeliculasService, private funcionService: FuncionesService) { }

  ngOnInit(): void {
    this.obtenerPeliculas();
  }

  obtenerPeliculas() {
    this.peliculasService.getPeliculas().subscribe(
      result => {
        this.peliculas = result.map((item: any) => {
          const peli = new Pelicula();
          peli._id = item._id;
          peli.originalTitle = item.originalTitle;
          peli.description = item.description;
          peli.releaseDate = item.releaseDate;
          peli.trailer = item.trailer;
          peli.primaryImage = item.primaryImage;
          return peli;
        });
        console.log('Películas obtenidas de la BD:', this.peliculas);
      },
      error => {
        console.error('Error al obtener películas de la BD:', error);
      }
    );
  }

  /**
   * Alterna entre el modo de creación de función única y rango semanal.
   * @param isSingle true para modo de función única, false para modo semanal.
   */
  toggleFunctionMode(isSingle: boolean) {
    this.isSingleFunctionMode = isSingle;
    this.limpiarFormularioFechas(); // Limpia solo los campos de fecha al cambiar de modo
  }

  /**
   * Prepara y envía las funciones a la API, ya sea una sola o un rango semanal.
   */
  crearFuncion() {
    // Validaciones de campos comunes
    if (!this.nuevaFuncion.pelicula || !this.nuevaFuncion.hora || !this.nuevaFuncion.sala) {
      alert('Por favor, complete los campos de película, hora y sala.');
      return;
    }

    const funcionesACrear: Funcion[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normaliza la fecha actual a medianoche para comparación

    if (this.isSingleFunctionMode) {
      // --- Lógica para FUNCIÓN ÚNICA ---
      if (!this.selectedSingleDate) {
        alert('Por favor, seleccione una fecha para la función única.');
        return;
      }

      const singleDate = new Date(this.selectedSingleDate);
      singleDate.setHours(0, 0, 0, 0); // Normaliza la fecha seleccionada

      if (singleDate < today) {
        alert('La fecha de la función no puede ser anterior a la fecha actual.');
        return;
      }
      funcionesACrear.push(this.prepararFuncion(singleDate));

    } else {
      // --- Lógica para FUNCIONES SEMANALES ---
      if (!this.selectedStartDate || !this.selectedEndDate) {
        alert('Por favor, complete el rango de fechas para las funciones semanales.');
        return;
      }

      const startDate = new Date(this.selectedStartDate);
      const endDate = new Date(this.selectedEndDate);
      startDate.setHours(0, 0, 0, 0); // Normaliza fecha de inicio
      endDate.setHours(0, 0, 0, 0);   // Normaliza fecha de fin

      if (startDate < today) {
        alert('La fecha de inicio no puede ser anterior a la fecha actual.');
        return;
      }
      if (startDate > endDate) {
        alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
        return;
      }

      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        funcionesACrear.push(this.prepararFuncion(new Date(currentDate))); // Clona la fecha para evitar mutaciones
        currentDate.setDate(currentDate.getDate() + 1); // Avanza un día
      }
    }

    // Enviar las funciones preparadas a la API
    funcionesACrear.forEach(funcion => {
      console.log('Intentando crear función para:', funcion.fecha.toISOString().split('T')[0]);
      this.funcionService.postFuncion(funcion).subscribe(
        response => {
          console.log('Función creada exitosamente:', response);
          alert(`Función para ${funcion.fecha.toLocaleDateString()} a las ${funcion.hora} en ${funcion.sala} creada.`);
          // Puedes añadir lógica para recargar la lista de funciones después de la creación
        },
        error => {
          console.error('Error al crear la función:', error);
          if (error.error && error.error.msg) {
            alert(`Error: ${error.error.msg}`);
          } else {
            alert('Error al crear una función. Consulte la consola para más detalles.');
          }
        }
      );
    });

    this.limpiarFormularioCompleto(); // Limpia todo el formulario después de la operación
  }

  /**
   * Método auxiliar para preparar un objeto Funcion con los datos comunes.
   * @param date La fecha específica para esta función.
   */
  private prepararFuncion(date: Date): Funcion {
    const funcion = new Funcion();
    funcion.pelicula = this.nuevaFuncion.pelicula;
    funcion.hora = this.nuevaFuncion.hora;
    funcion.sala = this.nuevaFuncion.sala;
    funcion.butacasOcupadas = []; // Inicializa butacas ocupadas
    funcion.fecha = date; // Asigna la fecha generada
    return funcion;
  }

  /**
   * Limpia solo los campos de fecha cuando se cambia de modo (single/weekly).
   */
  limpiarFormularioFechas() {
    this.selectedStartDate = '';
    this.selectedEndDate = '';
    this.selectedSingleDate = '';
  }

  /**
   * Limpia todo el formulario después de enviar.
   */
  limpiarFormularioCompleto() {
    this.nuevaFuncion = new Funcion();
    // Reinicia los selectores para evitar problemas con [ngValue]="null"
    this.nuevaFuncion.pelicula = new Pelicula(); // O ajusta si tu modelo Pelicula permite null o necesita un objeto vacío
    this.nuevaFuncion.hora = '';
    this.nuevaFuncion.sala = '';
    this.limpiarFormularioFechas(); // Llama a limpiar las fechas también
  }
}
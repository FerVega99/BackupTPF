import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionesService } from '../../services/funciones.service';
import { Funcion } from '../../models/funcion';
import { Reserva } from '../../models/reserva';
import { ReservasService } from '../../services/reserva.service';

interface ButacaUI {
  id: string;
  status: 'available' | 'selected' | 'occupied';
}

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  funcionId: string | null = null;
  funcionSeleccionada: Funcion = new Funcion();

  rows: string[] = ['A', 'B', 'C', 'D', 'E'];
  cols: number = 10; // Cambiado de colsPerRow a cols
  butacas: ButacaUI[] = [];
  butacaSeleccionada: Set<string> = new Set(); // Cambiado de selectedSeats a butacaSeleccionada

  // --- Propiedades para el selector de fechas ---
  availableDates: { value: string, display: string }[] = []; // Para las opciones del select
  selectedDate: string = ''; // Para la fecha seleccionada por el usuario (YYYY-MM-DD)

  constructor(
    private route: ActivatedRoute,
    private funcionService: FuncionesService,
    private reservaService: ReservasService, // Cambiado de reservasService a reservaService
    private router: Router
  ) { }

  ngOnInit(): void {
    // Genera las opciones de fecha primero
    this.generateDateOptions();

    this.route.paramMap.subscribe(params => {
      this.funcionId = params.get('_id'); // O 'id' si tu ruta es ':id'
      if (this.funcionId) {
        console.log('ID de la función recibido:', this.funcionId);
        this.obtenerFuncion(); // Llama a obtenerFuncion una vez que tienes el ID
      } else {
        console.error('No se recibió ID de función en la ruta.');
        // Opcional: Redirigir o mostrar un mensaje de error
      }
    });
  }

  obtenerFuncion(): void {
    if (!this.funcionId) return; // Asegurarse de tener un ID

    this.funcionService.getFuncion(this.funcionId).subscribe(
      result => {
        this.funcionSeleccionada = result;
        console.log('Función seleccionada cargada:', this.funcionSeleccionada);
        this.generateSeats(this.funcionSeleccionada.butacasOcupadas || []);
      },
      error => {
        console.error('Error al obtener la función:', error);
        alert('No se pudo cargar la información de la función. Inténtalo de nuevo.');
      }
    );
  }

  /**
   * Genera las opciones de fecha para el selector (hoy + 6 días).
   */
  generateDateOptions(): void {
    const today = new Date();
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    this.availableDates = []; // Limpiar antes de generar

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i); // Añade 'i' días a la fecha actual

      // Formato para el valor que se enviará (YYYY-MM-DD)
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses de 0-11
      const day = date.getDate().toString().padStart(2, '0');
      const value = `${year}-${month}-${day}`;

      // Formato para mostrar en el select (Ej: "Jueves, 27/06/2025")
      const dayOfWeek = dayNames[date.getDay()];
      const displayMonth = monthNames[date.getMonth()];
      const display = `${dayOfWeek}, ${day.padStart(2, '0')} de ${displayMonth} de ${year}`;

      this.availableDates.push({ value: value, display: display });
    }

    // Establece la primera fecha como seleccionada por defecto
    if (this.availableDates.length > 0) {
      this.selectedDate = this.availableDates[0].value;
    }
  }

  generateSeats(occupiedSeatsIds: string[]): void {
    this.butacas = [];
    this.butacaSeleccionada.clear(); // Usar butacaSeleccionada

    this.rows.forEach(rowLetter => {
      for (let i = 1; i <= this.cols; i++) { // Usar cols
        const seatId = `${rowLetter}${i}`;
        const status = occupiedSeatsIds.includes(seatId) ? 'occupied' : 'available';
        this.butacas.push({ id: seatId, status: status });
      }
    });
  }

  handleSeatClick(seat: ButacaUI): void {
    if (seat.status === 'available') {
      seat.status = 'selected';
      this.butacaSeleccionada.add(seat.id); // Usar butacaSeleccionada
    } else if (seat.status === 'selected') {
      seat.status = 'available';
      this.butacaSeleccionada.delete(seat.id); // Usar butacaSeleccionada
    }
    console.log('Butacas seleccionadas actualmente:', Array.from(this.butacaSeleccionada));
  }

  reservarButacas(): void {
    if (this.butacaSeleccionada.size === 0) { // Usar butacaSeleccionada
      alert('Por favor, selecciona al menos una butaca para reservar.');
      return;
    }

    if (!this.funcionId || !this.funcionSeleccionada) {
      alert('Error: No se ha cargado la información de la función.');
      return;
    }

    if (!this.selectedDate) { // Validar que se haya seleccionado una fecha
      alert('Por favor, selecciona una fecha para la reserva.');
      return;
    }

    const seatsToReserveArray = Array.from(this.butacaSeleccionada); // Usar butacaSeleccionada

    const nuevaReserva = new Reserva();
    nuevaReserva.usuario = ''; // <-- ¡Reemplaza con el ID de usuario real!
    nuevaReserva.funcion = this.funcionSeleccionada || ''; // Usa el ID de la función seleccionada
    nuevaReserva.cantidadReservas = seatsToReserveArray.length;

    // Construir la fecha y hora completa para la reserva
    const [hours, minutes] = this.funcionSeleccionada.hora.split(':').map(Number);
    const reservationDateTime = new Date(this.selectedDate); // Inicia con la fecha seleccionada (YYYY-MM-DD)
    reservationDateTime.setHours(hours); // Establece la hora de la función
    reservationDateTime.setMinutes(minutes); // Establece los minutos de la función
    reservationDateTime.setSeconds(0);
    reservationDateTime.setMilliseconds(0);

    nuevaReserva.fecha = reservationDateTime; // Ya es un objeto Date

    nuevaReserva.precioFinal = seatsToReserveArray.length * this.funcionSeleccionada.precio;
    nuevaReserva.butacasReservadas = seatsToReserveArray;
    nuevaReserva.qr = 'QR_GENERADO_EN_BACKEND_O_PLACEHOLDER'; // El QR probablemente lo genera el backend

    console.log('Objeto Reserva a enviar:', nuevaReserva);

    // Llama al método del nuevo servicio de reservas
    this.reservaService.createReserva(nuevaReserva).subscribe( // Usar reservaService
      response => {
        alert('¡Reserva realizada con éxito!');
        console.log('Respuesta de la reserva:', response);

        // Recargar la función para actualizar el estado de las butacas en la UI
        this.obtenerFuncion();
        this.butacaSeleccionada.clear(); // Limpia las selecciones en el front después de una reserva exitosa
      },
      error => {
        console.error('Error al realizar la reserva:', error);
        let errorMessage = 'No se pudo completar la reserva. Inténtalo de nuevo.';
        if (error.error && error.error.msg) {
          errorMessage = error.error.msg;
        } else if (error.message) {
          errorMessage = error.message;
        }
        alert(errorMessage);
      }
    );
  }

  pagarReserva(){
    
  }
}
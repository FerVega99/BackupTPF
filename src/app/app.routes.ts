import { Routes } from '@angular/router';
import { CarteleraComponent } from './components/cartelera/cartelera.component';
import { GestionPeliculasComponent } from './components/gestion-peliculas/gestion-peliculas.component';
import { GestionFuncionesComponent } from './components/gestion-funciones/gestion-funciones.component';
import { FuncionesComponent } from './components/funciones/funciones.component';
import { ReservasComponent } from './components/reservas/reservas.component';

export const routes: Routes = [
    {path: '', redirectTo: 'cartelera', pathMatch: 'full' },
    {path: 'cartelera',component: CarteleraComponent},
    {path: 'gestion-peliculas',component: GestionPeliculasComponent},
    {path: 'gestion-funciones',component: GestionFuncionesComponent},
    {path: 'funciones',component: FuncionesComponent},
    {path: 'reservas',component: ReservasComponent},
    {path: 'reservas/:id',component: ReservasComponent},

];

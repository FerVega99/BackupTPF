import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionFuncionesComponent } from './gestion-funciones.component';

describe('GestionFuncionesComponent', () => {
  let component: GestionFuncionesComponent;
  let fixture: ComponentFixture<GestionFuncionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionFuncionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionFuncionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

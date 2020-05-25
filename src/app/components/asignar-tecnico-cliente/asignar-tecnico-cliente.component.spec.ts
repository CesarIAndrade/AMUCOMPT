import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarTecnicoClienteComponent } from './asignar-tecnico-cliente.component';

describe('AsignarTecnicoClienteComponent', () => {
  let component: AsignarTecnicoClienteComponent;
  let fixture: ComponentFixture<AsignarTecnicoClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarTecnicoClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarTecnicoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

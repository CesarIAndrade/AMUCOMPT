import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsignacionConfiguracionProductoComponent } from './modal-asignacion-configuracion-producto.component';

describe('ModalAsignacionConfiguracionProductoComponent', () => {
  let component: ModalAsignacionConfiguracionProductoComponent;
  let fixture: ComponentFixture<ModalAsignacionConfiguracionProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAsignacionConfiguracionProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAsignacionConfiguracionProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

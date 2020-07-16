import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalModificarDatosTicketVentaComponent } from './modal-modificar-datos-ticket-venta.component';

describe('ModalModificarDatosTicketVentaComponent', () => {
  let component: ModalModificarDatosTicketVentaComponent;
  let fixture: ComponentFixture<ModalModificarDatosTicketVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalModificarDatosTicketVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalModificarDatosTicketVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

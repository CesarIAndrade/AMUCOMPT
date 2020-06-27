import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTicketFinalizadoComponent } from './modal-ticket-finalizado.component';

describe('ModalTicketFinalizadoComponent', () => {
  let component: ModalTicketFinalizadoComponent;
  let fixture: ComponentFixture<ModalTicketFinalizadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTicketFinalizadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTicketFinalizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

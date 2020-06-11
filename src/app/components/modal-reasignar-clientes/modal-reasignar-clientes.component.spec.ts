import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReasignarClientesComponent } from './modal-reasignar-clientes.component';

describe('ModalReasignarClientesComponent', () => {
  let component: ModalReasignarClientesComponent;
  let fixture: ComponentFixture<ModalReasignarClientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalReasignarClientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReasignarClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

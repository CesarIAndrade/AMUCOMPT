import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleUsuarioComponent } from './modal-detalle-usuario.component';

describe('ModalDetalleUsuarioComponent', () => {
  let component: ModalDetalleUsuarioComponent;
  let fixture: ComponentFixture<ModalDetalleUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetalleUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetalleUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetallePersonaComponent } from './modal-detalle-persona.component';

describe('ModelDetallePersonaComponent', () => {
  let component: ModalDetallePersonaComponent;
  let fixture: ComponentFixture<ModalDetallePersonaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetallePersonaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetallePersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

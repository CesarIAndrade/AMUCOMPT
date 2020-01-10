import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsignacionUsuarioPersonaComponent } from './modal-asignacion-usuario-persona.component';

describe('ModalAsignacionUsuarioPersonaComponent', () => {
  let component: ModalAsignacionUsuarioPersonaComponent;
  let fixture: ComponentFixture<ModalAsignacionUsuarioPersonaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAsignacionUsuarioPersonaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAsignacionUsuarioPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsignacionUsuarioTiposUsuarioComponent } from './modal-asignacion-usuario-tipos-usuario.component';

describe('ModalAsignacionUsuarioTiposUsuarioComponent', () => {
  let component: ModalAsignacionUsuarioTiposUsuarioComponent;
  let fixture: ComponentFixture<ModalAsignacionUsuarioTiposUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAsignacionUsuarioTiposUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAsignacionUsuarioTiposUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

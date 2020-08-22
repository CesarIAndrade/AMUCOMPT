import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfigurarReporteComponent } from './modal-configurar-reporte.component';

describe('ModalConfigurarReporteComponent', () => {
  let component: ModalConfigurarReporteComponent;
  let fixture: ComponentFixture<ModalConfigurarReporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfigurarReporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfigurarReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

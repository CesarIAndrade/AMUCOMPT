import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaRubrosEntradaComponent } from './venta-rubros-entrada.component';

describe('VentaRubrosEntradaComponent', () => {
  let component: VentaRubrosEntradaComponent;
  let fixture: ComponentFixture<VentaRubrosEntradaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentaRubrosEntradaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaRubrosEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

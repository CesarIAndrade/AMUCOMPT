import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaRubrosSalidaComponent } from './venta-rubros-salida.component';

describe('VentaRubrosSalidaComponent', () => {
  let component: VentaRubrosSalidaComponent;
  let fixture: ComponentFixture<VentaRubrosSalidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentaRubrosSalidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaRubrosSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraRubrosSalidaComponent } from './compra-rubros-salida.component';

describe('CompraRubrosSalidaComponent', () => {
  let component: CompraRubrosSalidaComponent;
  let fixture: ComponentFixture<CompraRubrosSalidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompraRubrosSalidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraRubrosSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

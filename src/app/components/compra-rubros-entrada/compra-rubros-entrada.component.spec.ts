import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraRubrosEntradaComponent } from './compra-rubros-entrada.component';

describe('CompraRubrosEntradaComponent', () => {
  let component: CompraRubrosEntradaComponent;
  let fixture: ComponentFixture<CompraRubrosEntradaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompraRubrosEntradaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraRubrosEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

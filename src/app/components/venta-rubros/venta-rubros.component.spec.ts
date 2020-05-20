import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaRubrosComponent } from './venta-rubros.component';

describe('VentaRubrosComponent', () => {
  let component: VentaRubrosComponent;
  let fixture: ComponentFixture<VentaRubrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentaRubrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaRubrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

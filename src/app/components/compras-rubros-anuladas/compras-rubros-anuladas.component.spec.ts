import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasRubrosAnuladasComponent } from './compras-rubros-anuladas.component';

describe('ComprasRubrosAnuladasComponent', () => {
  let component: ComprasRubrosAnuladasComponent;
  let fixture: ComponentFixture<ComprasRubrosAnuladasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasRubrosAnuladasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasRubrosAnuladasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

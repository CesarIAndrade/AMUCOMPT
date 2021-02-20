import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraRubrosComponent } from './compra-rubros.component';

describe('CompraRubrosComponent', () => {
  let component: CompraRubrosComponent;
  let fixture: ComponentFixture<CompraRubrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompraRubrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraRubrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

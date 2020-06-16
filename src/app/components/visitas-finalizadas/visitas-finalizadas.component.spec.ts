import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitasFinalizadasComponent } from './visitas-finalizadas.component';

describe('VisitasFinalizadasComponent', () => {
  let component: VisitasFinalizadasComponent;
  let fixture: ComponentFixture<VisitasFinalizadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitasFinalizadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitasFinalizadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLocalidadSuperiorComponent } from './modal-localidad-superior.component';

describe('ModalLocalidadSuperiorComponent', () => {
  let component: ModalLocalidadSuperiorComponent;
  let fixture: ComponentFixture<ModalLocalidadSuperiorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLocalidadSuperiorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLocalidadSuperiorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

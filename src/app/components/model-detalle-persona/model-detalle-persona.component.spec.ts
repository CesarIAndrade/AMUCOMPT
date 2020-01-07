import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDetallePersonaComponent } from './model-detalle-persona.component';

describe('ModelDetallePersonaComponent', () => {
  let component: ModelDetallePersonaComponent;
  let fixture: ComponentFixture<ModelDetallePersonaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelDetallePersonaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDetallePersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

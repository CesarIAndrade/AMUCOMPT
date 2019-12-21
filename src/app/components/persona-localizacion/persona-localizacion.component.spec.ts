import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaLocalizacionComponent } from './persona-localizacion.component';

describe('PersonaLocalizacionComponent', () => {
  let component: PersonaLocalizacionComponent;
  let fixture: ComponentFixture<PersonaLocalizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonaLocalizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonaLocalizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

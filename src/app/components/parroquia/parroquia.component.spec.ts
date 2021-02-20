import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParroquiaComponent } from './parroquia.component';

describe('ParroquiaComponent', () => {
  let component: ParroquiaComponent;
  let fixture: ComponentFixture<ParroquiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParroquiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParroquiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

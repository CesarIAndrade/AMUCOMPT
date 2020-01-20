import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SembrioComponent } from './sembrio.component';

describe('SembrioComponent', () => {
  let component: SembrioComponent;
  let fixture: ComponentFixture<SembrioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SembrioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SembrioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

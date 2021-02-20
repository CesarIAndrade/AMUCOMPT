import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmarKitComponent } from './armar-kit.component';

describe('ArmarKitComponent', () => {
  let component: ArmarKitComponent;
  let fixture: ComponentFixture<ArmarKitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArmarKitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmarKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

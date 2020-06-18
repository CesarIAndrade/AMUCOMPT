import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizarAbonoComponent } from './realizar-abono.component';

describe('RealizarAbonoComponent', () => {
  let component: RealizarAbonoComponent;
  let fixture: ComponentFixture<RealizarAbonoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealizarAbonoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealizarAbonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditosAbonosComponent } from './creditos-abonos.component';

describe('CreditosAbonosComponent', () => {
  let component: CreditosAbonosComponent;
  let fixture: ComponentFixture<CreditosAbonosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditosAbonosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditosAbonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsUsuarioComponent } from './tabs-usuario.component';

describe('TabsUsuarioComponent', () => {
  let component: TabsUsuarioComponent;
  let fixture: ComponentFixture<TabsUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

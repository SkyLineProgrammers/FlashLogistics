import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiperFormComponent } from './shiper-form.component';

describe('ShiperFormComponent', () => {
  let component: ShiperFormComponent;
  let fixture: ComponentFixture<ShiperFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiperFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiperFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

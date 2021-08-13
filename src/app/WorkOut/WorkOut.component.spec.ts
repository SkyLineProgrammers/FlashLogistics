import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiperListComponent } from './shiper-list.component';

describe('ShiperListComponent', () => {
  let component: ShiperListComponent;
  let fixture: ComponentFixture<ShiperListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiperListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiperListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

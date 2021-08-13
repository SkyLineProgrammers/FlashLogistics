import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackIdComponent } from './track-id.component';

describe('TrackIdComponent', () => {
  let component: TrackIdComponent;
  let fixture: ComponentFixture<TrackIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

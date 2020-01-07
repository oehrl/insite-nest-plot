import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsiteNestPlotComponent } from './insite-nest-plot.component';

describe('InsiteNestPlotComponent', () => {
  let component: InsiteNestPlotComponent;
  let fixture: ComponentFixture<InsiteNestPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsiteNestPlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsiteNestPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

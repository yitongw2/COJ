import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionResultComponent } from './execution-result.component';

describe('ExecutionResultComponent', () => {
  let component: ExecutionResultComponent;
  let fixture: ComponentFixture<ExecutionResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutionResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

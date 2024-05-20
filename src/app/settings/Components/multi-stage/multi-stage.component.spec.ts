import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiStageComponent } from './multi-stage.component';

describe('MultiStageComponent', () => {
  let component: MultiStageComponent;
  let fixture: ComponentFixture<MultiStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiStageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

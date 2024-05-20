import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialGroupMergeComponent } from './material-group-merge.component';

describe('MaterialGroupMergeComponent', () => {
  let component: MaterialGroupMergeComponent;
  let fixture: ComponentFixture<MaterialGroupMergeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialGroupMergeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialGroupMergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

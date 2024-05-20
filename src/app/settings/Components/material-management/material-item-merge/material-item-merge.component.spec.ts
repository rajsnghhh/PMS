import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialItemMergeComponent } from './material-item-merge.component';

describe('MaterialItemMergeComponent', () => {
  let component: MaterialItemMergeComponent;
  let fixture: ComponentFixture<MaterialItemMergeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialItemMergeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialItemMergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

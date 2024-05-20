import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderMergeComponent } from './vender-merge.component';

describe('VenderMergeComponent', () => {
  let component: VenderMergeComponent;
  let fixture: ComponentFixture<VenderMergeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VenderMergeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenderMergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FortnightPreviewComponent } from './fortnight-preview.component';

describe('FortnightPreviewComponent', () => {
  let component: FortnightPreviewComponent;
  let fixture: ComponentFixture<FortnightPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FortnightPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FortnightPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

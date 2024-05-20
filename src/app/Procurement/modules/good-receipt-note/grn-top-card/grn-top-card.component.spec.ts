import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnTopCardComponent } from './grn-top-card.component';

describe('GrnTopCardComponent', () => {
  let component: GrnTopCardComponent;
  let fixture: ComponentFixture<GrnTopCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnTopCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnTopCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

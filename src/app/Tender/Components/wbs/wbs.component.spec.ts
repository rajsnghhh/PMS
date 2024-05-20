import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WBSComponent } from './wbs.component';

describe('WBSComponent', () => {
  let component: WBSComponent;
  let fixture: ComponentFixture<WBSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WBSComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WBSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyStripComponent } from './modify-strip.component';

describe('ModifyStripComponent', () => {
  let component: ModifyStripComponent;
  let fixture: ComponentFixture<ModifyStripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyStripComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

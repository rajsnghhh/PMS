import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrTopCardComponent } from './mr-top-card.component';

describe('MrTopCardComponent', () => {
  let component: MrTopCardComponent;
  let fixture: ComponentFixture<MrTopCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrTopCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrTopCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

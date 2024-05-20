import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoTopCardComponent } from './po-top-card.component';

describe('PoTopCardComponent', () => {
  let component: PoTopCardComponent;
  let fixture: ComponentFixture<PoTopCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoTopCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoTopCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

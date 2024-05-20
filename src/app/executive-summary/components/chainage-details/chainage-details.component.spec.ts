import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainageDetailsComponent } from './chainage-details.component';

describe('ChainageDetailsComponent', () => {
  let component: ChainageDetailsComponent;
  let fixture: ComponentFixture<ChainageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChainageDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChainageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

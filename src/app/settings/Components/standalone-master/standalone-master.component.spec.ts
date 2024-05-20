import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandaloneMasterComponent } from './standalone-master.component';

describe('StandaloneMasterComponent', () => {
  let component: StandaloneMasterComponent;
  let fixture: ComponentFixture<StandaloneMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandaloneMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandaloneMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

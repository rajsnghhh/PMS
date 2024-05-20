import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMrComponent } from './create-mr.component';

describe('CreateMrComponent', () => {
  let component: CreateMrComponent;
  let fixture: ComponentFixture<CreateMrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

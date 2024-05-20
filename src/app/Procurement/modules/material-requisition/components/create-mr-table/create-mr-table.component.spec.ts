import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMrTableComponent } from './create-mr-table.component';

describe('CreateMrTableComponent', () => {
  let component: CreateMrTableComponent;
  let fixture: ComponentFixture<CreateMrTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMrTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMrTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

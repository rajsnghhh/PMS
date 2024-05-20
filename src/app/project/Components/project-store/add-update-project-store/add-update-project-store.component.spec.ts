import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateProjectStoreComponent } from './add-update-project-store.component';

describe('AddUpdateProjectStoreComponent', () => {
  let component: AddUpdateProjectStoreComponent;
  let fixture: ComponentFixture<AddUpdateProjectStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateProjectStoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateProjectStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

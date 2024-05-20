import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedUserComponent } from './archived-user.component';

describe('ArchivedUserComponent', () => {
  let component: ArchivedUserComponent;
  let fixture: ComponentFixture<ArchivedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

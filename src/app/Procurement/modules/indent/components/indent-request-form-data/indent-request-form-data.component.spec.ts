import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentRequestFormDataComponent } from './indent-request-form-data.component';

describe('IndentRequestFormDataComponent', () => {
  let component: IndentRequestFormDataComponent;
  let fixture: ComponentFixture<IndentRequestFormDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndentRequestFormDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentRequestFormDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

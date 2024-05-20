import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTypesComponent } from './material-types.component';

describe('MaterialTypesComponent', () => {
  let component: MaterialTypesComponent;
  let fixture: ComponentFixture<MaterialTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialTypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

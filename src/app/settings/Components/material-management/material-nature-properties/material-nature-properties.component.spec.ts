import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialNaturePropertiesComponent } from './material-nature-properties.component';

describe('MaterialNaturePropertiesComponent', () => {
  let component: MaterialNaturePropertiesComponent;
  let fixture: ComponentFixture<MaterialNaturePropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialNaturePropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialNaturePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

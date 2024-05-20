import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialSubGroupComponent } from './material-sub-group.component';

describe('MaterialSubGroupComponent', () => {
  let component: MaterialSubGroupComponent;
  let fixture: ComponentFixture<MaterialSubGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialSubGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialSubGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

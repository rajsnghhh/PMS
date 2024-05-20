import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialWastageComponent } from './material-wastage.component';

describe('MaterialWastageComponent', () => {
  let component: MaterialWastageComponent;
  let fixture: ComponentFixture<MaterialWastageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialWastageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialWastageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

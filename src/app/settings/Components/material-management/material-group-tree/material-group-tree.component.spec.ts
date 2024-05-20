import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialGroupTreeComponent } from './material-group-tree.component';

describe('MaterialGroupTreeComponent', () => {
  let component: MaterialGroupTreeComponent;
  let fixture: ComponentFixture<MaterialGroupTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialGroupTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialGroupTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

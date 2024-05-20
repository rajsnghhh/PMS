import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportGrnComponent } from './import-grn.component';

describe('ImportGrnComponent', () => {
  let component: ImportGrnComponent;
  let fixture: ComponentFixture<ImportGrnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportGrnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportGrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

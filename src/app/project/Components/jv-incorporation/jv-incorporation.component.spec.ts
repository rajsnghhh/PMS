import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JvIncorporationComponent } from './jv-incorporation.component';

describe('JvIncorporationComponent', () => {
  let component: JvIncorporationComponent;
  let fixture: ComponentFixture<JvIncorporationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JvIncorporationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JvIncorporationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

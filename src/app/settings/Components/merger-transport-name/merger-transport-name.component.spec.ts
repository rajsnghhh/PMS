import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergerTransportNameComponent } from './merger-transport-name.component';

describe('MergerTransportNameComponent', () => {
  let component: MergerTransportNameComponent;
  let fixture: ComponentFixture<MergerTransportNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergerTransportNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergerTransportNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTaskComponent } from './group-task.component';

describe('GroupTaskComponent', () => {
  let component: GroupTaskComponent;
  let fixture: ComponentFixture<GroupTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

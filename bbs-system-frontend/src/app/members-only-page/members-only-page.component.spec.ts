import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersOnlyPageComponent } from './members-only-page.component';

describe('MembersOnlyPageComponent', () => {
  let component: MembersOnlyPageComponent;
  let fixture: ComponentFixture<MembersOnlyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembersOnlyPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersOnlyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

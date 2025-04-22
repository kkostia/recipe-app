import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeResultPage } from './recipe-result.page';

describe('RecipeResultPage', () => {
  let component: RecipeResultPage;
  let fixture: ComponentFixture<RecipeResultPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

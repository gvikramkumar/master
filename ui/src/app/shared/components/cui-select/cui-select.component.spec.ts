import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { CuiSelectComponent } from './cui-select.component';
import { CuiSelectModule } from './cui-select.module';
import { CommonModule } from '@angular/common';

xdescribe('CuiSelectComponent', () => {
	let component: CuiSelectComponent;
	let fixture: ComponentFixture<CuiSelectComponent>;
	let de: DebugElement;
	let el: HTMLElement;

	let items: any[];

	const stringItems: string[] = [
		'One',
		'Two',
		'Three',
	];

	let groupedItems: any[];

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [CommonModule, FormsModule, CuiSelectModule],
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CuiSelectComponent);
		component = fixture.componentInstance;
	});

	beforeEach(() => {
		items = [
			{
				name: 'Item One',
				value: 1,
			},
			{
				name: 'Item Two',
				value: 2,
			},
			{
				name: 'Item Three',
				value: 3,
			},
			{
				name: 'Item Four',
				value: 4,
			},
			{
				name: 'Item Five',
				value: 5,
			},
			{
				name: 'Item Six',
				value: 6,
			},
			{
				name: 'Item Seven',
				value: 7,
			},
			{
				name: 'Item Eight',
				value: 8,
			},
		];

		groupedItems = [
			{
				name: 'Group 1',
				items: [
					{
						name: 'Item One',
						value: 1,
					},
					{
						name: 'Item Two',
						value: 2,
					},
					{
						name: 'Item Three',
						value: 3,
					},
				],
			},
			{
				name: 'Group 2',
				items: [
					{
						name: 'Item Four',
						value: 4,
					},
					{
						name: 'Item Five',
						value: 5,
					},
				],
			},
			{
				name: 'Group 3',
				items: [
					{
						name: 'Item Six',
						value: 6,
					},
					{
						name: 'Item Seven',
						value: 7,
					},
					{
						name: 'Item Eight',
						value: 8,
					},
				],
			},
		];
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should display the dropdown only if items are provided', () => {
		component.active = true;
		fixture.detectChanges();
		de = fixture.debugElement.query(By.css('.dropdown__option span:last-child'));
		expect(de).toBeFalsy();
	});

	it('should display items', fakeAsync(() => {
		component.items = items;
		fixture.detectChanges();
		// the following section opens dropdown and triggers change detection
		de = fixture.debugElement.query(By.css('input'));
		el = de.nativeElement;
		el.dispatchEvent(new Event('input'));
		finishInit(fixture);
		// end section
		de = fixture.debugElement.query(By.css('a'));
		el = de.nativeElement;
		expect(el.innerText).toEqual('Item One');
	}));

	it('should select items', fakeAsync(done => {
		component.items = items;
		fixture.detectChanges();
		// the following section opens dropdown and triggers change detection
		de = fixture.debugElement.query(By.css('input'));
		el = de.nativeElement;
		el.dispatchEvent(new Event('input'));
		finishInit(fixture);
		de = fixture.debugElement.query(By.css('a'));
		el = de.nativeElement;
		event = document.createEvent('Events');
		event.initEvent('mousedown', true, false);
		el.dispatchEvent(event);
		fixture.detectChanges();
		flush();
		expect(component.model).toEqual(1);
	}));

	it('should filter items by search', fakeAsync(() => {
		component.items = items;
		finishInit(fixture);
		de = fixture.debugElement.query(By.css('input'));
		el = de.nativeElement;
		el['value'] = 'One';
		el.dispatchEvent(new Event('input'));
		expect(component.flatItems.length).toEqual(1);
	}));


	it('should clear the search', () => {
		component.items = items;
		component.empty = true;
		component.model = items[0].value;
		event = document.createEvent('Events');
		fixture.detectChanges();
		expect(component.searchText).toEqual('Item One');

		de = fixture.debugElement.query(By.css('.icon-close'));
		el = de.nativeElement;
		event.initEvent('mousedown', true, false);
		el.dispatchEvent(event);
		fixture.detectChanges();
		expect(component.searchText).toEqual('');
	});

	it('should toggle the dropdown', () => {
		let event: Event;
		component.items = items;
		component.active = true;
		component.model = items[0];
		fixture.detectChanges();
		de = fixture.debugElement.query(By.css('input'));
		el = de.nativeElement;
		event = document.createEvent('Events');
		event.initEvent('mouseover', true, false);
		el.dispatchEvent(event);
		fixture.detectChanges();
		event.initEvent('mousedown', true, false);
		el.dispatchEvent(event);
		fixture.detectChanges();
		expect(component.active).toEqual(false);
		event.initEvent('mousedown', true, false);
		el.dispatchEvent(event);
		fixture.detectChanges();
		expect(component.active).toEqual(true);

		// mouse hover coverage
		event = document.createEvent('Events');
		event.initEvent('mouseleave', true, false);
		el.dispatchEvent(event);
		fixture.detectChanges();

		de = fixture.debugElement.query(By.css('.dropdown__menu'));
		el = de.nativeElement;
		event = document.createEvent('Events');
		event.initEvent('mouseover', true, false);
		el.dispatchEvent(event);
		fixture.detectChanges();

		event = document.createEvent('Events');
		event.initEvent('mouseleave', true, false);
		el.dispatchEvent(event);
		fixture.detectChanges();
	});
});

/** Finish initializing the virtual scroll component at the beginning of a test. */
function finishInit (fixture: ComponentFixture<any>) {
  // On the first cycle we render and measure the viewport.
  fixture.detectChanges();
  flush();

  // On the second cycle we render the items.
  fixture.detectChanges();
  flush();
}

import {
	Component,
	DoCheck,
	OnInit,
	OnChanges,
	OnDestroy,
	Input,
	IterableDiffer,
	IterableDiffers,
	Injector,
	Output,
	EventEmitter,
	forwardRef,
	Renderer2,
	SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

import _ from 'lodash';

import { Guid } from '@cisco-ngx/cui-utils';

const ROW_SIZE = 35;
const PADDING = 2;
const DYNAMIC_DROPDOWN_MAX_HEIGHT_KEY = 'initial';

@Component({
	selector: 'cui-multiselect',
	templateUrl: './cui-multiselect.component.html',
	styleUrls: ['./cui-multiselect.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CuiMultiselectComponent),
			multi: true,
		},
	],
})
export class CuiMultiselectComponent implements DoCheck, OnInit, OnChanges, OnDestroy,
ControlValueAccessor {
	/** The currently selected values */
	@Input() model: any[] = [];
	/** All options, unfiltered */
	@Input() allItems: any[] = [];
	/** The currently displayed options */
	@Input() items: any[] = [];
	/** The names of the optional groups */
	@Input() groupNames: string[];
	/** The input label */
	@Input() label: string;
	/** Whether the select is compressed */
	@Input() compressed = false;
	/** Search input value */
	@Input() searchText: string;
	/** Search input placeholder */
	@Input() placeholder = '';
	/** Component tab index */
	@Input() tabindex = -1;
	/** Whether to display an empty selection button */
	@Input() empty = true;
	/** Whether the component is disabled */
	@Input() disabled = false;
	/** Whether the input is required */
	@Input() required = false;
	/** The key in items that holds the display name */
	@Input() optionsKey = 'name';
	/** The key in items that holds the value */
	@Input() optionsValue = 'value';
	/** Set the max-height of the dropdown */
	@Input() dropdownMaxHeight = '170px';
	/** The property in the items used for the title attribute */
	@Input() titleKey = 'title';
	/** Allow for assignment of the data-auto-id attribute */
	@Input() dataAutoId = 'cui-multiselect';

	active = false;
	over = false;
	hoverIndex = 0;
	allFlatItems: any[];
	flatItems: any[];
	guid = Guid.generate();
	private globalClick: any;
	private selectedItems: any[] = [];
	private modelDiffer: IterableDiffer<any[]>;
	private ngControl: NgControl;

	/**
	 * Event emitted when the input's value is changed
	 * @Deprecated use ngModelChange
	 */
	@Output() modelChange: EventEmitter<any> = new EventEmitter();

	constructor (
		private renderer: Renderer2,
		private injector: Injector,
		private iterableDiffer: IterableDiffers,
	) {
		this.modelDiffer = iterableDiffer.find([]).create();
	}

	ngDoCheck () {
		if (this.ngControl) {
			if (this.modelDiffer.diff(this.ngControl.value)) {
				this.writeValue(this.ngControl.value);
				this.formatItems();
			}
		} else if (this.modelDiffer.diff(this.model)) {
			this.formatItems();
		}
	}

	ngOnInit () {
		if (isFinite(Number(this.dropdownMaxHeight))) {
			this.dropdownMaxHeight = `${this.dropdownMaxHeight}px`;
		} else if (
			this.dropdownMaxHeight !== DYNAMIC_DROPDOWN_MAX_HEIGHT_KEY
			&& isNaN(parseInt(this.dropdownMaxHeight, 10))
		) {
			this.dropdownMaxHeight = '170px';
		}

		try {
			this.ngControl = this.injector.get(NgControl);
		} catch (e) {}
		this.formatItems();

		this.globalClick = this.renderer.listen('document', 'click', () => {
			if (!this.over) {
				this.active = false;
				this.searchText = _.map(this.selectedItems, this.optionsKey).join(', ');
			}
		});
	}

	ngOnChanges (changes: SimpleChanges) {
		if (changes.items) {
			this.formatItems();
		}
	}

	ngOnDestroy () {
		if (this.globalClick) {
			this.globalClick();
		}
	}

	propagateChange: Function = (change: any) => {};
	writeValue (value: any) {
		this.model = value;
	}
	registerOnChange (fn: Function) {
		this.propagateChange = fn;
	}
	registerOnTouched () {}

	/**
	 * Formats items when initialized or updated
	 */
	formatItems () {
		this.items = _.cloneDeep(this.items);
		this.allItems = _.cloneDeep(this.items);
		this.parseGroups();
		this.selectedItems = [];
		if (this.model) {
			this.model = _.castArray(this.model);
			_.each(this.model, (value: any) => {
				const foundItem: any = _.find(this.flatItems, item => {
					return this.optionsValue
						? item[this.optionsValue] === value
						: _.isEqual(item, value);
				});
				if (foundItem) {
					foundItem.selected = true;
					this.toggleSelectItem(foundItem);
				}
			});
			this.searchText = _.map(this.selectedItems, this.optionsKey).join(', ');
		}
		if (this.dropdownMaxHeight === DYNAMIC_DROPDOWN_MAX_HEIGHT_KEY) {
			this.dropdownMaxHeight = `${(this.allFlatItems.length) * ROW_SIZE + PADDING}px`;
		}
	}

	/**
	 * Called when an item is selected
	 */
	toggleSelectItem (item: any) {
		const originalValue = _.cloneDeep(this.model);

		if (item.selected) {
			if (!this.findItem(this.selectedItems, item)) {
				this.selectedItems = [...(this.selectedItems || []), item];
			}
		} else {
			// find and remove the item using isEqual comparison, omitting 'selected' key
			_.remove(this.selectedItems, si => _.isEqual(
				_.omit(si, 'selected'),
				_.omit(item, 'selected'),
			));
		}
		if (this.optionsValue) {
			this.model = _.map(this.selectedItems, this.optionsValue);
		} else {
			this.model = _.cloneDeep(this.selectedItems);
		}
		if (this.modelDiffer.diff(this.model)) {
			this.modelChange.emit(this.model);
			this.propagateChange(this.model);
		}
	}

	/**
	 * finds an item in a given array
	 */
	findItem (array: any[], item: any) {
		return _.find(array, i => {
			return this.optionsKey
				? item[this.optionsKey] === i[this.optionsKey]
				: _.isEqual(item, i);
		});
	}

	/**
	 * Moves the keyboard controlled hover index
	 * @param amount The amount to move
	 */
	moveHoverIndex (amount: number) {
		if (!this.active) {
			this.active = true;

			return;
		}
		this.hoverIndex += amount;
		if (this.hoverIndex < 0) {
			this.hoverIndex = 0;
		}
		if (_.get(this.flatItems[this.hoverIndex], 'groupName')) {
			// if landed on a group header, move one more
			if (amount < 0) {
				this.hoverIndex -= 1;
			} else {
				this.hoverIndex += 1;
			}
		}
		if (this.hoverIndex > this.flatItems.length) {
			this.hoverIndex = 0;
		} else if (this.hoverIndex < 0) {
			this.hoverIndex = this.flatItems.length - 1;
		}

		for (let ii = 0; ii < this.flatItems.length; ii += 1) {
			this.flatItems[ii].hovered = ii === this.hoverIndex;
		}
	}

	/**
	 * Handles keyboard input
	 * @param event The keyboard event
	 */
	onKeydown (event: KeyboardEvent) {
		switch (event.key) {
		case 'ArrowDown':
			this.moveHoverIndex(1);
			break;
		case 'ArrowUp':
			this.moveHoverIndex(-1);
			break;
		case 'Enter':
			if (this.active) {
				const item: any = this.flatItems[this.hoverIndex];
				item.selected = !item.selected;
				this.toggleSelectItem(item);
			} else {
				this.active = true;
			}
			event.stopPropagation();
			break;
		case 'Escape':
			this.active = false;
			this.searchText = _.map(this.model, this.optionsKey).join(', ');
			break;
		default:
			break;
		}
	}

	/**
	 * Toggles active state
	 */
	toggleActive () {
		if (!this.disabled) {
			this.active = !this.active;
			this.flatItems = _.cloneDeep(this.allFlatItems);
			this.markItemsSelected();
			this.searchText = '';
		}
	}

	/**
	 * Triggered on search text change
	 */
	onSearch () {
		this.active = true;
		this.hoverIndex = 0;
		const lcSearch = this.searchText.replace(/[\s\u202F\u00A0]+/g, '').toLowerCase();
		if (_.isEmpty(lcSearch)) {
			// if search is empty, set back to all items
			this.flatItems = _.cloneDeep(this.allFlatItems);
		} else {
			// filter by search matches
			this.flatItems = _.filter(_.cloneDeep(this.allFlatItems), item => {
				return item.lcName.indexOf(lcSearch) !== -1;
			});
		}
		this.markItemsSelected();
	}

	markItemsSelected () {
		// set the selected items
		_.each(this.selectedItems, activeItem => {
			_.set(this.findItem(this.flatItems, activeItem), 'selected', true);
		});
	}

	/**
	 * Clears the selection
	 */
	clearModel () {
		if (this.disabled) {
			return;
		}

		this.model = [];
		this.selectedItems = [];
		this.searchText = '';
		this.flatItems = _.cloneDeep(this.allFlatItems);
		this.onSearch();
		this.modelChange.emit(this.model);
		this.propagateChange(this.model);
		this.active = false;
	}

	/**
	 * Parse groups to flat array
	 */
	parseGroups () {
		const itemsCopy = _.cloneDeep(this.items);
		if (this.groupNames && !_.find(this.items, item => _.has(item, 'groupName'))) {
			_.each(this.groupNames, (groupName, idx) => {
				itemsCopy.splice(idx * 2, 0, { groupName });
			});
		}
		_.each(itemsCopy, item => {
			item.lcName = _.get(item, this.optionsKey, '')
				.replace(/[\s\u202F\u00A0]+/g, '').toLowerCase();
		});
		this.allFlatItems = _.flatten(itemsCopy);
		this.flatItems = _.cloneDeep(this.allFlatItems);
	}

	getDropdownHeight () {
		const numItems = _.get(this, 'flatItems.length', 0);
		let height = this.dropdownMaxHeight;
		if (numItems * ROW_SIZE < _.parseInt(this.dropdownMaxHeight)) {
			height = `${numItems * ROW_SIZE + PADDING}px`;
		}

		return height;
	}
}

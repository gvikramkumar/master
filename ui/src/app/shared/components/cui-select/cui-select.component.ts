import { Component, OnInit, OnChanges, OnDestroy, Input,
  Output, EventEmitter, forwardRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as _ from 'lodash';

import { Guid } from '@cisco-ngx/cui-utils';

const ROW_SIZE = 35;
const PADDING = 2;
const DYNAMIC_DROPDOWN_MAX_HEIGHT_KEY = 'initial';

@Component({
  selector: 'cui-select',
  templateUrl: './cui-select.component.html',
  styleUrls: ['./cui-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CuiSelectComponent),
      multi: true,
    },
  ],
})
export class CuiSelectComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  /** The currently selected value */
  @Input() model: any;
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
  @Input() empty = false;
  /** Whether the component is disabled */
  @Input() disabled = false;
  /** Error message to display on the component */
  @Input() errorMessage: string;
  /** Whether the input is required */
  @Input() required = false;
  /** The key in items that holds the display name */
  @Input() optionsKey = 'name';
  /** The key in items that holds the value */
  @Input() optionsValue = 'value';
  /** The property in the items used for the title attribute */
  @Input() titleKey = 'title';
  /** Set the max-height of the dropdown */
  @Input() dropdownMaxHeight = '170px';
  /** Allow for assignment of the data-auto-id attribute */
  @Input() dataAutoId = 'cui-select';
  /** Allow for optionsValue to be null so that the model will be the item Object */
  @Input() modelAsObject: boolean;

  active = false;
  over = false;
  hoverIndex = 0;
  allFlatItems: any[];
  flatItems: any[];
  guid = Guid.generate();
  private globalClick: any;

  /**
   * Event emitted when the input's value is changed
   * @Deprecated use ngModelChange
   */
  @Output() modelChange: EventEmitter<any> = new EventEmitter();

  constructor (private renderer: Renderer2) {
  }

  ngOnInit () {
/*
    if (this.label === 'test') {
      console.log('guid', this.guid);
    }
*/
    if (this.modelAsObject) {
      this.optionsValue = null;
    }
    if (isFinite(Number(this.dropdownMaxHeight))) {
      this.dropdownMaxHeight = `${this.dropdownMaxHeight}px`;
    } else if (
      this.dropdownMaxHeight !== DYNAMIC_DROPDOWN_MAX_HEIGHT_KEY
      && isNaN(parseInt(this.dropdownMaxHeight, 10))
    ) {
      this.dropdownMaxHeight = '170px';
    }

    this.formatItems();

    this.globalClick = this.renderer.listen('document', 'click', () => {
      if (!this.over) {
        this.active = false;
        const selectedItem = _.find(this.flatItems, { selected: true });
        this.searchText = _.get(selectedItem, this.optionsKey, '');
      }
    });
  }

  ngOnChanges (changes) {
    this.formatItems();
  }

  ngOnDestroy () {
    if (this.globalClick) {
      this.globalClick();
    }
  }

  propagateChange: Function = (changes: any) => {};
  writeValue (value: any) {
    this.model = value;
    this.selectItem(this.model);
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
    this.selectItem(this.model);
    if (this.dropdownMaxHeight === DYNAMIC_DROPDOWN_MAX_HEIGHT_KEY) {
      this.dropdownMaxHeight = `${(this.allFlatItems.length) * ROW_SIZE + PADDING}px`;
    }
  }

  /**
   * Selects an item
   * @param selection The selected value
   */
  selectItem (selection: any) {
    const originalValue = _.cloneDeep(this.model);
    this.model = _.reduce(this.flatItems, (memo, item: any) => {
      const omitFields = ['hidden', 'hovered', 'lcName', 'selected'];
      item.selected = this.optionsValue
        ? _.isEqual(item[this.optionsValue], selection)
        : _.isEqual(_.omit(item, omitFields), _.omit(selection, omitFields));
      item.hovered = false;
      item.hidden = false;

      if (item.selected) {
        return this.optionsValue ? item[this.optionsValue] : _.omit(item, omitFields);
      }

      return memo;
    }, null);

    const selectedItem = _.find(this.flatItems, { selected: true });
    this.searchText = _.get(selectedItem, this.optionsKey, '');
    this.hoverIndex = _.indexOf(this.flatItems, selectedItem);
    if (this.model && !_.isEqual(this.model, originalValue)) {
      this.modelChange.emit(this.model);
      this.propagateChange(this.model);
      this.active = false;
      this.focusOnInput();
    }
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
          const itemToSelect = this.optionsValue
            ? this.flatItems[this.hoverIndex][this.optionsValue]
            : this.flatItems[this.hoverIndex];
          this.selectItem(itemToSelect);
          this.active = false;
          this.focusOnInput();
        } else {
          this.active = true;
        }
        event.stopPropagation();
        break;
      case 'Escape':
        this.active = false;
        const selectedItem = _.find(this.flatItems, { selected: true });
        this.searchText = _.get(selectedItem, this.optionsKey, '');
        this.focusOnInput();
        break;
      default:
        break;
    }
  }

  /**
   * Triggered on search text change
   */
  onSearch () {
    this.active = true;
    this.hoverIndex = 0;
    const lcSearch = this.searchText.replace(/[\s\u202F\u00A0]+/g, '').toLowerCase();
    const activeItem = _.find(this.flatItems, { selected: true });
    if (activeItem) {
      // set selected on the active item in allFlatItems
      _.set(_.find(
        this.allFlatItems,
        { [this.optionsKey]: activeItem[this.optionsKey] },
      ), 'selected', true);
    }
    if (_.isEmpty(lcSearch)) {
      // if search is empty, set back to all items
      this.flatItems = _.cloneDeep(this.allFlatItems);
    } else {
      // filter by search matches
      this.flatItems = _.filter(_.cloneDeep(this.allFlatItems), item => {
        return item.lcName.indexOf(lcSearch) !== -1;
      });
    }
  }

  /**
   * Toggles active state
   */
  toggleActive () {
    if (!this.disabled) {
      this.active = !this.active;
      this.focusOnInput();
    }
    if (this.active) {
      this.searchText = '';
    }
  }

  /**
   * Focuses on the input element
   */
  focusOnInput () {
    try {
      setTimeout(() => {
        const element = this.renderer.selectRootElement(`#select-${this.guid}`);
        element.focus();
      }, 5);
    } catch (err) {}
  }

  /**
   * Clears the selection
   */
  clearModel () {
    if (this.disabled) {
      return;
    }

    this.model = null,
      this.searchText = '';
    _.each(this.flatItems, (item: any) => {
      item.selected = false;
    });
    this.onSearch();
    this.modelChange.emit(this.model);
    this.propagateChange(this.model);
    this.active = false;
    this.focusOnInput();
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
    this.allFlatItems = _.flatten(itemsCopy);
    _.each(this.allFlatItems, item => {
      item.lcName = _.get(item, this.optionsKey, '')
        .replace(/[\s\u202F\u00A0]+/g, '').toLowerCase();
    });
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

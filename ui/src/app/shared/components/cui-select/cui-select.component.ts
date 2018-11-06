import {
  Component, OnInit, OnDestroy, Input,
  Output, EventEmitter, forwardRef, Renderer2, OnChanges, ChangeDetectorRef, SimpleChanges
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import * as _ from 'lodash';

import {Guid} from '@cisco-ngx/cui-utils';

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
export class CuiSelectComponent implements OnChanges, OnDestroy, ControlValueAccessor {
  /** The currently selected value */
  @Input() model: any;
  /** All options, unfiltered */
  @Input() allItems: any[] = [];
  /** The currently displayed options */
  @Input() items: any[] = [];
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

  active = false;
  over = false;
  hoverIndex = 0;
  guid = Guid.generate();
  private globalClick: any;
  private selectItemCalled = false;

  /**
   * Event emitted when the input's value is changed
   * @Deprecated use ngModelChange
   */
  @Output() modelChange: EventEmitter<any> = new EventEmitter();

  constructor(private renderer: Renderer2) {
  }

  init() {
    this.globalClick = this.renderer.listen('document', 'click', () => {
      if (!this.over) {
        this.active = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const itemsChange = changes.items && !_.isEqual(changes.items.previousValue, changes.items.currentValue && changes.items.currentValue.length);
    if (itemsChange) {
      this.items = _.cloneDeep(this.items);
      if (!_.isArray(_.head(this.items))) {
        this.items = [this.items];
      }
      this.allItems = _.cloneDeep(this.items);
      // we need to reselect things once we have new items
      if (this.model) {
        this.selectItem(this.model);
      }
    }

    if (!itemsChange && changes.model && !_.isEqual(changes.model.previousValue, changes.model.currentValue) &&
      this.items && this.items.length && this.items[0].length && this.model && !this.selectItemCalled) {
        this.selectItem(this.model);
    }
  }

  ngOnDestroy() {
    if (this.globalClick) {
      this.globalClick();
    }
  }

  propagateChange: Function = (changes: any) => {
  };

  writeValue(value: any) {
    this.model = value;
  }

  registerOnChange(fn: Function) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
  }

  /**
   * Selects an item
   * @param selection The selected value
   */
  selectItem(selection: any) {
    const originalValue = _.cloneDeep(this.model);
    this.model = _.reduce(_.flatten(this.items), (memo, item: any) => {
      item.selected = _.isEqual(item[this.optionsValue], selection);
      item.hovered = false;
      item.hidden = false;

      return item.selected ? item[this.optionsValue] : memo;
    }, null);

    const selectedItem = _.find(_.flatten(this.items), {selected: true});
    this.searchText = _.get(selectedItem, this.optionsKey, '');
    this.hoverIndex = _.indexOf(_.flatten(this.items), selectedItem);
    if (this.model && this.model !== originalValue) {
      this.modelChange.emit(this.model);
      this.active = false;
      this.focusOnInput();
    }
  }

  selectItemOnClick(selection) {
    this.selectItemCalled = true;
    this.selectItem(selection);
  }

  /**
   * Moves the keyboard controlled hover index
   * @param amount The amount to move
   */
  moveHoverIndex(amount: number) {
    if (!this.active) {
      this.active = true;

      return;
    }

    const flatItems: any[] = _.flatten(this.items);
    this.hoverIndex += amount;
    if (this.hoverIndex > flatItems.length) {
      this.hoverIndex = 0;
    } else if (this.hoverIndex < 0) {
      this.hoverIndex = flatItems.length - 1;
    }

    for (let ii = 0; ii < flatItems.length; ii += 1) {
      flatItems[ii].hovered = ii === this.hoverIndex;
    }
  }

  /**
   * Handles keyboard input
   * @param event The keyboard event
   */
  onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        this.moveHoverIndex(1);
        break;
      case 'ArrowUp':
        this.moveHoverIndex(-1);
        break;
      case 'Enter':
        if (this.active) {
          this.selectItem(_.flatten(this.items)[this.hoverIndex][this.optionsValue]);
          this.active = false;
          this.focusOnInput();
        } else {
          this.active = true;
        }
        event.stopPropagation();
        break;
      case 'Escape':
        this.active = false;
        const selectedItem = _.find(_.flatten(this.items), {selected: true});
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
  onSearch() {
    this.active = true;
    const lcSearch = this.searchText.replace(/[\s\u202F\u00A0]+/g, '').toLowerCase();
    _.each(_.flatten(this.allItems), (item: any) => {
      const activeItem = _.find(_.flatten(this.items), (testItem: any) => {
        return testItem[this.optionsKey] === item[this.optionsKey];
      });
      item.selected = activeItem && activeItem.selected;

      if (_.isEmpty(lcSearch)) {
        item.hidden = false;

        return;
      }

      const lcName = _.get(item, this.optionsKey, '')
        .replace(/[\s\u202F\u00A0]+/g, '').toLowerCase();
      item.hidden = lcName.indexOf(lcSearch) === -1;
    });

    this.items = _.reduce(_.cloneDeep(this.allItems), (memo: any, group: any[]) => {
      memo.push(_.filter(group, {hidden: false}));

      return memo;
    }, []);
  }

  /**
   * Toggles active state
   */
  toggleActive() {
    if (!this.disabled) {
      this.active = !this.active;
      this.focusOnInput();
    }
  }

  /**
   * Focuses on the input element
   */
  focusOnInput() {
      setTimeout(() => {
        try {
          const element = this.renderer.selectRootElement(`#select-${this.guid}`);
          element.focus();
        } catch (err) {
        }
      }, 5);
  }

  /**
   * Clears the selection
   */
  clearModel() {
    if (this.disabled) {
      return;
    }

    this.model = null,
      this.searchText = '';
    _.each(_.flatten(this.items), (item: any) => {
      item.selected = false;
    });
    this.onSearch();
    this.modelChange.emit(this.model);
    this.active = false;
    this.focusOnInput();
  }
}

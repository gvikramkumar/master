import {StoreBase} from './store-base';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Store} from './store';
import {FlexLayoutModule, ObservableMedia} from '@angular/flex-layout';
import {Subscription} from 'rxjs/Subscription';
import {TestBed} from '@angular/core/testing';
import {StoreModule} from './store.module';
import * as _ from 'lodash';

class MediaChange {
  constructor(public mqAlias: string) {}
}

describe('Store tests', () => {
  let store: Store;
  let observableMedia: ObservableMedia;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule, FlexLayoutModule]
    });
    observableMedia = TestBed.get(ObservableMedia);
    store = new Store(observableMedia);
  })

  it('should set initial breakpoint', () => {
    // it's dependent on the browser width, but shoudl be one of hte breakpoint values
    expect(['xs', 'sm', 'md', 'lg', 'xl']).toContain(store.initialBreakpoint);
  });

  it('should pub store', () => {
    const subs = store.sub(x => {
      expect(x).toBe(store);
    });
    store.pub();
    subs.unsubscribe();
  });

  // all substore pubs need to pub store as well
  it('should pub leftNavClosed (false)', () => {
    const val = false;
    let storeVal: boolean;
    let substoreVal: boolean;
    store.sub(x => storeVal = x.leftNavClosed);
    store.subLeftNavClosed(x => substoreVal = x);
    store.pubLeftNavClosed(val);
    expect(storeVal).toBe(val);
    expect(substoreVal).toBe(val);
  });

  it('should pub leftNavClosed (true)', () => {
    const val = true;
    let storeVal: boolean;
    let substoreVal: boolean;
    store.sub(x => storeVal = x.leftNavClosed);
    store.subLeftNavClosed(x => substoreVal = x);
    store.pubLeftNavClosed(val);
    expect(storeVal).toBe(val);
    expect(substoreVal).toBe(val);
  });

  it('should pub updateLabelCounts', () => {
    let storeCount = 0;
    let updateCount = 0;
    store.sub(() => storeCount++);
    store.subUpdateLabelCounts(() => updateCount++);
    store.pubUpdateLabelCounts();
    expect(storeCount).toBe(1);
    expect(updateCount).toBe(1);
  });

  it('should pub authenticated', () => {
    const val = true;
    let storeVal: boolean;
    let substoreVal: boolean;
    store.sub(x => storeVal = x.authenticated);
    store.subAuthenticated(x => substoreVal = x);
    store.pubAuthenticated(val);
    expect(storeVal).toBe(val);
    expect(substoreVal).toBe(val);
  });

  it('should pub initialized', () => {
    const val = true;
    let storeVal: boolean;
    let substoreVal: boolean;
    store.sub(x => storeVal = x.initialized);
    store.subInitialized(x => substoreVal = x);
    store.pubInitialized(val);
    expect(storeVal).toBe(val);
    expect(substoreVal).toBe(val);
  });

  it('should pub selectedLabel', () => {
    const val = {name: 'my label'};
    let storeVal;
    let substoreVal;
    store.sub(x => storeVal = x.selectedLabel);
    store.subSelectedLabel(x => substoreVal = x);
    store.pubSelectedLabel(val);
    expect(storeVal).toBe(val);
    expect(substoreVal).toBe(val);
  });

  it('should have usr substore', () => {
    expect(store.usr).toBeDefined();
    const usr = store.usr;
    usr.sub(x => expect(x).toBe(usr));
    usr.pub();
  });

  it('should have con substore', () => {
    expect(store.con).toBeDefined();
    const con = store.con;
    con.sub(x => expect(x).toBe(con));
    con.pub();
  });

  it('getVal, setVal, deleteVal', () => {
    const val = 'lala';
    store.setVal('one.two.three', val);
    expect(_.get(store, 'one.two.three')).toBe(val);
    expect(store.getVal('one.two.three')).toBe(val);
    store.deleteVal('one.two.three');
    expect(_.get(store, 'one.two.three')).toBeUndefined();
    expect(store.getVal('one.two.three')).toBeUndefined();
  });

  it('getPropertiesOnly', () => {
    expect(store.getPropertiesOnly).toBeDefined();
    expect(store.usr).toBeDefined();
    const obj = store.getPropertiesOnly(store);
    expect(obj.getPropertiesOnly).toBeUndefined();
    expect(obj.usr).toBeDefined();
  });


})











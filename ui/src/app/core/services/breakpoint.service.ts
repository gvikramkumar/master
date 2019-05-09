import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';
import _ from 'lodash';

export enum BreakpointDirection {
  initial = 1,
  fromBelow,
  fromAbove
}

export class BreakpointChange {
  constructor(
    public breakpoint: string,
    public lastBreakpoint: string,
    public direction: BreakpointDirection) {}
}

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  breakpoints$ = new BehaviorSubject<BreakpointChange|null>(null);
  subscribe = this.breakpoints$.subscribe.bind(this.breakpoints$);
  lastBreakpoint = '';
  initialBreakpoint;
  initialized = false;

  constructor() {
    // MediaObserver calls us 10 times initially, which breaks out handleBreakpoints as it only expects to be
    // called once initially. We have to do some gymnastics to get it down to one...
/*
    mediaObserver.media$
      .subscribe(change => {
        // console.log('breakpoint', change.mqAlias);
        if (!this.initialBreakpoint) {
          this.initialBreakpoint = change.mqAlias;
          this.handleBreakpoints(change.mqAlias);
        }
        if (!this.initialized) {
          if (change.mqAlias !== this.initialBreakpoint) {
            this.initialized = true;
          } else {
            return;
          }
        }
        this.handleBreakpoints(change.mqAlias);
      });
*/
  }

  isActive(val) {
    // return this.mediaObserver.isActive(val);
  }

  /**
   * handleBreakpoints
   * @desc - this function is broken for repeated initial calls, which is what MediaObserver does to us and why
   * we throttle that down to one (instead of 10) initial calls, say lg >> lg >> lg, then the directions will be:
   * initial, above, above, etc, which isn't true at all, but with our throttling all will work fine, why we do it.
   * @param breakpoint
   */
  handleBreakpoints(breakpoint) {
    let direction: BreakpointDirection;
    // console.log(`${this.lastBreakpoint} >> ${breakpoint}`);

    if (!this.lastBreakpoint) {
      this.breakpoints$.next(new BreakpointChange(breakpoint, '', BreakpointDirection.initial));
    } else {
      switch (breakpoint) {
        case 'xs':
            direction = BreakpointDirection.fromAbove;
          break;
        case 'sm':
          if (_.includes(['xs'], this.lastBreakpoint)) {
            direction = BreakpointDirection.fromBelow;
          } else {
            direction = BreakpointDirection.fromAbove;
          }
          break;
        case 'md':
          if (_.includes(['xs', 'sm'], this.lastBreakpoint)) {
            direction = BreakpointDirection.fromBelow;
          } else {
            direction = BreakpointDirection.fromAbove;
          }
          break;
        case 'lg':
          if (_.includes(['xs', 'sm', 'md'], this.lastBreakpoint)) {
            direction = BreakpointDirection.fromBelow;
          } else {
            direction = BreakpointDirection.fromAbove;
          }
          break;
        case 'xl':
          if (_.includes(['xs', 'sm', 'md', 'lg'], this.lastBreakpoint)) {
            direction = BreakpointDirection.fromBelow;
          } else {
            direction = BreakpointDirection.fromAbove;
          }
          break;
        case 'xxl':
            direction = BreakpointDirection.fromBelow;
          break;
      }
      this.breakpoints$.next(new BreakpointChange(breakpoint, this.lastBreakpoint, direction));
        // console.log(`breakpoint: ${breakpoint} ${BreakpointDirection[direction]}`);
    }

    this.lastBreakpoint = breakpoint;

  }

}

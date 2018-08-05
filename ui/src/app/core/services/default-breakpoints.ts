import {BreakPoint} from '@angular/flex-layout';

/*
bootstrap breakpoints:
xs: 0,
sm: 576px,
md: 768px,
lg: 992px,
xl: 1200px

flexlayout breakpoints:
xs: 0
sm: 600
md: 960
lg: 1280
xl: 1920
 */
// cui is using bootstrap for their grid, so set defaults to bootstrap breakpoints
export const FIN_DEFAULT_BREAKPOINTS: BreakPoint[] = [
  {
    alias: 'xs',
    mediaQuery: '(min-width: 0px) and (max-width: 575px)'
  },
  {
    alias: 'gt-xs',
    overlapping: true,
    mediaQuery: '(min-width: 576px)'
  },
  {
    alias: 'lt-sm',
    overlapping: true,
    mediaQuery: '(max-width: 575px)'
  },
  {
    alias: 'sm',
    mediaQuery: '(min-width: 576px) and (max-width: 767px)'
  },
  {
    alias: 'gt-sm',
    overlapping: true,
    mediaQuery: '(min-width: 768px)'
  },
  {
    alias: 'lt-md',
    overlapping: true,
    mediaQuery: '(max-width: 767px)'
  },
  {
    alias: 'md',
    mediaQuery: '(min-width: 768px) and (max-width: 991px)'
  },
  {
    alias: 'gt-md',
    overlapping: true,
    mediaQuery: '(min-width: 992px)'
  },
  {
    alias: 'lt-lg',
    overlapping: true,
    mediaQuery: '(max-width: 991px)'
  },
  {
    alias: 'lg',
    mediaQuery: '(min-width: 992px) and (max-width: 1199px)'
  },
  {
    alias: 'gt-lg',
    overlapping: true,
    mediaQuery: '(min-width: 1200px)'
  },
  {
    alias: 'lt-xl',
    overlapping: true,
    mediaQuery: '(max-width: 1199px)'
  },
  {
    alias: 'xl',
    mediaQuery: '(min-width: 1200px) and (max-width: 1499px)'
  },
  {
    alias: 'gt-xl',
    overlapping: true,
    mediaQuery: '(min-width: 1500px)'
  },
  {
    alias: 'lt-xxl',
    overlapping: true,
    mediaQuery: '(max-width: 1499px)'
  },
  {
    alias: 'xxl',
    mediaQuery: '(min-width: 1500px) and (max-width: 5000px)'
  }
];

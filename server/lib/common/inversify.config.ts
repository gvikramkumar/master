import {Container} from 'inversify';
import 'reflect-metadata';
import getDecorators from 'inversify-inject-decorators';

export const injector = new Container({
  autoBindInjectable: true,
  skipBaseClassChecks: true
});

export const {
  lazyInject,
} = getDecorators(injector);


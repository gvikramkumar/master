import {Container} from 'inversify';
import 'reflect-metadata';
import getDecorators from 'inversify-inject-decorators';

export const injector = new Container({
  autoBindInjectable: true,
  skipBaseClassChecks: true
});

const decorators = getDecorators(injector);
export const lazyInject = decorators.lazyInject;


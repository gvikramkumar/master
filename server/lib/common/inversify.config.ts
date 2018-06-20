import {Container} from 'inversify';
import 'reflect-metadata';

export const injector = new Container({
  autoBindInjectable: true,
  skipBaseClassChecks: true
});


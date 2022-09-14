import { Nullable } from './types';
import { Container } from 'inversify';

export abstract class Di {
  protected container: Nullable<Container> = null;

  get isContainerCreated() {
    return !!this.container;
  }

  getContainer() {
    if (!this.container) {
      this.container = this.createContainer();
    }
    return this.container;
  }

  protected abstract createContainer(): Container;
}

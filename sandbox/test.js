const _ = require('lodash'),
  Q = require('q');




class Test {

constructor() {
  this.validators = [
    [this.one.bind(this), this.two.bind(this)],
    [this.three.bind(this), this.four.bind(this)]
  ];
  this.getValidatorChain()
    .then(() => console.log('done'));

/*
  Promise.resolve()
    .then(() => Promise.resolve().then(() => this.one()).then(() => this.two()))
  .then(() => Promise.resolve().then(() => this.three()).then(() => this.four()))
*/

}

  one() {
    console.log('one');
    return Promise.resolve();
  }

  two() {
    console.log('two');
    return Promise.resolve();
  }

  three() {
    console.log('three');
    return Promise.resolve();
  }

  four() {
    console.log('four');
    return Promise.resolve();
  }


  getValidatorChain() {
    let chainOuter = Promise.resolve();
    this.validators.forEach(arr => {
      let chainInner = Promise.resolve();
      arr.forEach(validator => {
        console.log('binding', validator.name);
        chainInner = chainInner.then(() => validator());
      });
      chainInner = chainInner.then(() => this.lookForErrors());
      chainOuter = chainOuter.then(() => chainInner);
    });
    return chainOuter;
  }

  lookForErrors() {
    console.log('lookforerrors');
    return Promise.resolve()
  }



}

new Test();




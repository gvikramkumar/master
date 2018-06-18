



class Base1 {
  eat (val) {
    return val + 'eatbase';
  }

  walk(val) {
    return val + 'walkbase';
  }
}

class Sub extends Base1 {
  eat(val) {
    return super.eat(val);
  }

  run(val) {
    return val + 'run';
  }
}

describe('base1 tests', () {
  let sut;
  beforeAll() {
    sut = new Base1();
  }

  it('should eat', () => {
    expect(sut.eat('food')).toBe('foodeatbase');
  })
})




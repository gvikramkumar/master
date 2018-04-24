



class TestBase {
  constructor(name) {
    this.name = 'dank';
  }

  print() {
    console.log('this.name:', this.name);
  }
}

class Test extends TestBase {
  constructor(name) {
    super(name)
  }
}

new Test().print();













// let obj: {[key: string]: any};
import {Request} from 'express';
interface MyRequest extends Request {
  [key: string]: any;
}
interface AnyObj extends Object {
  [key: string]: any;
}

const obj: AnyObj = {};
obj.name = 'dank2';
obj.age = 5;

console.log(obj);

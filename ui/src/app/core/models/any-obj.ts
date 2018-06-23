

// we have to watch these server/ui types, if one looks to the other, pathing will fail in dist directories
export default interface AnyObj extends Object {
  [key: string]: any;
}



export class Address {
  address: string;
  label: string;

  constructor(address?, label?) {
    this.address = address || '';
    this.label = label || '';
  }
}

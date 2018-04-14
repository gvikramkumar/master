

export class Phone {
  prefix: string;
  phone: string;
  label: string;

  constructor(prefix?, phone?, label?) {
    this.prefix = prefix || '';
    this.phone = phone || '';
    this.label = label || '';
  }
}


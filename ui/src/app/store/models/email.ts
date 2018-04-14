

export class Email {
  email: string;
  label: string;

  constructor(email?, label?) {
    this.email = email || '';
    this.label = label || '';
  }
}



export class Website {
  website: string;
  label: string;

  constructor(website?, label?) {
    this.website = website || '';
    this.label = label || '';
  }
}

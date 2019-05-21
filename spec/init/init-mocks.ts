import {injector} from '../../server/lib/common/inversify.config';
import {mail} from '../../server/lib/common/mail';


const inj = injector;

describe('init-mocks.ts', () => {

  beforeAll(() => {
    mail.sendTextMail = jasmine.createSpy();
    mail.sendHtmlMail = jasmine.createSpy();
  });

  it('init-mocks complete', () => {

  });


});

import {injector} from '../../server/lib/common/inversify.config';
import {mail} from '../../server/lib/common/mail';


const inj = injector;

beforeAll(() => {
  mail.sendTextMail = jasmine.createSpy().and.returnValue(Promise.resolve());
  mail.sendHtmlMail = jasmine.createSpy().and.returnValue(Promise.resolve());
});




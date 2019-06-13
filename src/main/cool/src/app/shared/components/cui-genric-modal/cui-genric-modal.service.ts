import { ModalSize } from './modal-size.enum';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
import { IModalMessage } from './modal-message.interface';

@Injectable()
export class CuiGenericModalService {
  private static subject = new BehaviorSubject<IModalMessage>({
    title: `Warning`,
    subTitle: ``,
    message: ``,
    isHidden: false,
    modelSize: ModalSize.ModalSmall
  });

  constructor() {
    console.log(`CuiGenericModalService created`);
  }

  showModal(modalMessage: IModalMessage) {
    console.log('test  sds');
    CuiGenericModalService.subject.next(modalMessage);
  }

  hideModal() {
    CuiGenericModalService.subject.next(null);
  }

  getMessage(): Observable<any> {
    return CuiGenericModalService.subject;
  }
}

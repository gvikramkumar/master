import { Component, OnInit, OnDestroy } from '@angular/core';
import { CuiGenericModalService } from './cui-genric-modal.service';
import { Subscription } from 'rxjs';
import { ModalSize } from './modal-size.enum';
import { IModalMessage } from './modal-message.interface';

@Component({
  selector: 'app-cui-genric-modal',
  templateUrl: './cui-genric-modal.component.html',
  styleUrls: ['./cui-genric-modal.component.css']
})
export class CuiGenericModalComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  modalComponentValue: IModalMessage;
  constructor(private genricModalService: CuiGenericModalService) {
    console.log('CuiGenricModalComponent test');
    this.subscription = this.genricModalService.getMessage().subscribe((value: IModalMessage) => {
      console.log('CuiGenricModalComponent', value);
      this.modalComponentValue = value;
      // this.isHidden = value.isHidden;
    });
  }

  ngOnInit() {

  }

  closeModal() {
    this.genricModalService.hideModal();
    this.genricModalService.showModal({
      title: `Warning`,
      subTitle: ``,
      message: ``,
      isHidden: true,
      modelSize: ModalSize.ModalSmall
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

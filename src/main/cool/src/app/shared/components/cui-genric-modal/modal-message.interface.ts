import { ModalSize } from './modal-size.enum';
export interface IModalMessage {
  title: string;
  subTitle: string;
  message: string;
  isHidden: boolean;
  modelSize: ModalSize;
}

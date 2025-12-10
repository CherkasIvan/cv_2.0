import { Subject } from 'rxjs';

import { EModalDialogConditions } from '@cv_2.0/shared/enum/modal-dialog-conditions.enum';

export abstract class ModalDialogBaseClass {
    public abstract getDialogState(): Subject<EModalDialogConditions>;
}

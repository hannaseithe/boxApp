import { of } from 'rxjs';

export class MatDialogMock {
  open = jasmine.createSpy('open').and.returnValue({
    afterClosed: () => of(null),
  });
}

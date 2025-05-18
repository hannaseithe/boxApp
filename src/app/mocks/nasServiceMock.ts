import { of } from 'rxjs';

export class NasServiceMock {
  loggedIn = jasmine.createSpy().and.returnValue(true);
  fetchThumbnail = jasmine.createSpy().and.returnValue(
    of(
      new Blob([new Uint8Array([1, 2, 3, 4, 5])], {
        type: 'application/octet-stream',
      })
    )
  );
  uploadFile = jasmine.createSpy('uploadFile').and.returnValue(
    of({ status: 1, name: 'uploaded-file.jpg' }) // simulate success
  );
}

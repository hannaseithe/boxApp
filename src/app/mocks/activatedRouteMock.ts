import { of, BehaviorSubject } from 'rxjs';

export class ActivatedRouteMock {
  params = of({});
  queryParams = of({});
  snapshot = { data: {}, params: {}, queryParams: {} };

  setParams = jasmine.createSpy('setParams').and.callFake((params: any) => {
    this.params = of(params);
    this.snapshot.params = params;
  });

  setQueryParams = jasmine
    .createSpy('setQueryParams')
    .and.callFake((queryParams: any) => {
      this.queryParams = of(queryParams);
      this.snapshot.queryParams = queryParams;
    });

  paramMap = of({});

  constructor(initialParams: any = {}, queryParams: any = {}) {
    this.setParams(initialParams);
    this.setQueryParams(queryParams);
  }
}

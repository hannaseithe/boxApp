import { of } from 'rxjs';

export class ActivatedRouteMock {
  params = of({});
  queryParams = of({});
  snapshot = { data: {}, params: {}, queryParams: {} };

  setParams(params: any) {
    this.params = of(params);       // Simulate params being an observable
    this.snapshot.params = params;  // Update the snapshot
  }

  setQueryParams(queryParams: any) {
    this.queryParams = of(queryParams);        // Simulate queryParams being an observable
    this.snapshot.queryParams = queryParams;   // Update the snapshot
  }

  paramMap = of({});

  constructor(initialParams: any = {}, queryParams: any = {}) {
    this.setParams(initialParams);
    this.setQueryParams(queryParams);
  }
}

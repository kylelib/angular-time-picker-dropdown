import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SubscriptionComponent implements OnDestroy {
  ngUnsubscribe: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/operator/do";
import "rxjs/add/operator/first";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/observeOn";
import "rxjs/add/operator/publishReplay";
import "rxjs/add/operator/scan";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/withLatestFrom";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/takeUntil";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { queue } from "rxjs/scheduler/queue";
import {
  Store, Action, Reducer, StateUpdate,
  Dispatcher, StoreMiddleware, EmptyActionDescription,
} from "./interfaces";

const scheduler = queue;

export const startEffectsOn =
  (dispatch: Dispatcher | Observable<Dispatcher>) =>
    (...effects: Observable<Action>[]) => {
      const dispatch$ = typeof dispatch === "function"
        ? Observable.of(dispatch)
        : dispatch;
      effects.forEach(effect => {
        effect
          .observeOn(scheduler)
          .withLatestFrom(dispatch$.observeOn(scheduler), (a, d) => [a, d] as ([Action, Dispatcher]))
          .do<[Action, Dispatcher]>(([a, d]) => d(a))
          .subscribe();
      });
    };

export const startEffects = (
  dispatch: Dispatcher | Observable<Dispatcher>,
  ...effects: Observable<Action>[]
) => startEffectsOn(dispatch)(...effects);

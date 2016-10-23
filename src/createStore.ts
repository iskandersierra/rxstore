import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/do";
import "rxjs/add/operator/first";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/observeOn";
import "rxjs/add/operator/publishReplay";
import "rxjs/add/operator/scan";
import "rxjs/add/operator/startWith";
// import "rxjs/add/operator/subscribeOn";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/takeUntil";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { queue } from "rxjs/scheduler/queue";
import {
  Store, Action, Reducer, StateUpdate,
  Dispatcher, StoreMiddleware, EmptyActionDescription,
} from "./interfaces";
import { actionCreator } from "./actionCreator";

const newAction = actionCreator("RxStore@STORE@");

export const StoreActions = {
  init: newAction("INIT"),
  finish: newAction("FINISH"),
};

const scheduler = queue;

export function applyMiddlewares<TState, TStore extends Store<TState>>(
  ...middlewares: StoreMiddleware<TStore>[]) {
  return (store: TStore) => middlewares.reduce((s, m) => m(s), store);
}

export const createStore =
  <TState, TStore extends Store<TState>>(
    reducer: Reducer<TState>,
    initialState: TState,
    ...middlewares: StoreMiddleware<Store<TState>>[]
  ): TStore => {
    const actionSubject$ = new Subject<Action>();
    const action$ = actionSubject$
      .asObservable()
      .observeOn(scheduler)
      ;

    const connectableState$ = action$
      .scan((s, a) => reducer(s, a), initialState)
      .startWith(initialState)
      .publishReplay(1);
    connectableState$.connect();

    const state$ = connectableState$
      .observeOn(scheduler)
      ;

    const update$ = action$.switchMap(action =>
      state$
        .first()
        .map(state => ({ action, state } as StateUpdate<TState>)));

    const dispatch = (action: Action) => {
      actionSubject$.next(action);
      if (action.type === StoreActions.finish.type) {
        actionSubject$.complete();
      }
    };
    const finish = () => StoreActions.finish.dispatchOn(dispatch);

    return applyMiddlewares<TState, Store<TState>>
      (...middlewares, (s => { StoreActions.init.dispatchOn(s.dispatch); return s; }))
      ({ action$, state$, update$, dispatch, finish }) as TStore;
  };

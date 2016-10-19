import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/first";
import "rxjs/add/operator/map";
import "rxjs/add/operator/publishReplay";
import "rxjs/add/operator/scan";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/subscribeOn";
import "rxjs/add/operator/switchMap";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { queue } from "rxjs/scheduler/queue";
import {
  Store, Action, Reducer, StateUpdate, StoreActionsMap,
  EffectsDisposer,
} from "./interfaces";
import "object-assign";
import objectAssign = require("object-assign");

const scheduler = queue;

export const createStoreExtensions =
  (map: StoreActionsMap) =>
    <TState>(store: Store<TState>) => {
      const result: any = {};
      for (const key in map) {
        if (map.hasOwnProperty(key)) {
          const action = map[key];
          if (typeof action === "function") {
            const func = (arg: any) =>
              store.dispatch((action as ((payload: any) => Action))(arg));
            result[key] = func;
          } else {
            const func = (arg: any) =>
              store.dispatch(action as Action);
            result[key] = func;
          }
        }
      }
      return result;
    };

export interface CreateStoreOptions<TState, TStore extends Store<TState>> {
  extendWith?: (store: Store<TState>) => Object;
  effects?: (store: TStore) => EffectsDisposer;
}

export const createStore =
  <TState, TStore extends Store<TState>>(
    reducer: Reducer<TState>,
    initialState: TState,
    options?: CreateStoreOptions<TState, TStore>
  ): TStore => {
    const { extendWith = undefined, effects = undefined } = options || {};
    const actionSubject$ = new Subject<Action>();
    const action$ = actionSubject$.asObservable().subscribeOn(scheduler);
    const connectableState$ = action$
      .scan((s, a) => reducer(s, a), initialState)
      .startWith(initialState)
      .publishReplay(1);
    connectableState$.connect();
    const state$ = connectableState$ as Observable<TState>;

    const update$ = action$.switchMap(action =>
      state$.first()
        .map(state => ({ action, state } as StateUpdate<TState>)));
    const dispatch = (action: Action) => actionSubject$.next(action);

    let store: TStore = {
      action$,
      state$,
      update$,
      dispatch,
    } as TStore;

    if (extendWith) {
      store = objectAssign(store, extendWith(store)) as TStore;
    }

    if (effects) {
      effects(store);
    }

    return store;
  };

export default createStore;

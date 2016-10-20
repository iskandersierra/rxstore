import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/do";
import "rxjs/add/operator/first";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/publishReplay";
import "rxjs/add/operator/scan";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/subscribeOn";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/takeUntil";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { queue } from "rxjs/scheduler/queue";
import {
  Store, Action, Reducer, StateUpdate, StoreActionsMap,
  Dispatcher, CreateStoreOptions,
} from "./interfaces";
import "object-assign";
import objectAssign = require("object-assign");

export const STORE_ACTIONS = {
  INIT: "RxStore@STORE@INIT",
  FINISH: "RxStore@STORE@FINISH",
};

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

export const createStore =
  <TState, TStore extends Store<TState>>(
    reducer: Reducer<TState>,
    initialState: TState,
    options?: CreateStoreOptions<TState, TStore>
  ): TStore => {
    const {
      extendWith = undefined,
      effects = undefined,
      tunnel = undefined,
    } = options || {};
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
    const dispatch = (action: Action) => {
      actionSubject$.next(action);
      if (action.type === STORE_ACTIONS.FINISH) {
        actionSubject$.complete();
      }
    };

    let store: TStore = {
      action$,
      state$,
      update$,
      dispatch,
    } as TStore;

    if (extendWith) {
      const array = Array.isArray(extendWith) ? extendWith : [extendWith];
      array.forEach(ext => {
        store = objectAssign(store, ext(store)) as TStore;
      });
    }

    if (effects) {
      const array = Array.isArray(effects) ? effects : [effects];
      array.forEach(eff => { eff(store); });
    }

    if (tunnel) {
      const tunnels = Array.isArray(tunnel) ? tunnel : [tunnel];
      tunnels.forEach(({ dispatch: disp, actions }) => {

        if (actions === "all") {
          store.action$.subscribe(disp);
        } else if (Array.isArray(actions)) {
          store.action$
            .filter(a => actions.indexOf(a.type) >= 0)
            .subscribe(disp);
        } else if (typeof actions === "function") {
          store.action$
            .map(actions)
            .subscribe(disp);
        } else {
          const filter = (a: Action) =>
            (actions as Object).hasOwnProperty(a.type) &&
            !!actions[a.type];
          const map = (a: Action) => {
            const act = actions[a.type];
            if (typeof act === "function") {
              return (act(a));
            } else {
              return a;
            }
          };
          store.action$
            .filter(filter)
            .map(map)
            .subscribe(disp);
        }
      });
    }

    return store;
  };

export default createStore;

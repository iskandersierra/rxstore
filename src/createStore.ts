import "rxjs/add/operator/subscribeOn";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { queue } from "rxjs/scheduler/queue";
import {
  Store, Action, Reducer, StateUpdate, StoreActionsMap,
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
}

export const createStore =
  <TState, TStore extends Store<TState>>(
    reducer: Reducer<TState>,
    initialState: TState,
    options?: CreateStoreOptions<TState, TStore>
  ): TStore => {
    const { extendWith = undefined } = options || {};
    const stateSubject$ = new BehaviorSubject<TState>(initialState);
    const actionSubject$ = new Subject<Action>();
    const updateSubject$ = new Subject<StateUpdate<TState>>();
    const state$ = stateSubject$.asObservable().subscribeOn(scheduler);
    const action$ = actionSubject$.asObservable().subscribeOn(scheduler);
    const update$ = updateSubject$.asObservable().subscribeOn(scheduler);
    const getState = stateSubject$.getValue.bind(stateSubject$);
    const dispatch = (action: Action) => {
      const previousState = getState();
      const state = reducer(previousState, action);
      const update = { state, action, previousState };
      actionSubject$.next(action);
      stateSubject$.next(state);
      updateSubject$.next(update);
    };

    const basicStore: Store<TState> = {
      action$,
      state$,
      update$,
      dispatch,
      getState,
    };

    if (!extendWith) {
      return basicStore as TStore;
    }
    const store = objectAssign(basicStore, extendWith(basicStore)) as TStore;
    return store;
  };

export default createStore;

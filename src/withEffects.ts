import { Observable } from "rxjs/Observable";
import { StoreMiddleware, Action, Store, Dispatcher } from "./interfaces";
import { startEffectsOn } from "./startEffects";

export const withEffectsOn =
  <TStore extends Store<any>>(
    getDispatch: (store: TStore) => (Dispatcher | Observable<Dispatcher>),
    ...effects: ((store: TStore) => Observable<Action>)[]): StoreMiddleware<TStore> =>
    store => {
      startEffectsOn
        (getDispatch(store))
        (...(effects.map(e => e(store))));
      return store;
    };

export const withEffects =
  <TStore extends Store<any>>(...effects: ((store: TStore) => Observable<Action>)[]): StoreMiddleware<TStore> =>
    withEffectsOn(s => s.dispatch, ...effects);
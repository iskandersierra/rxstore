import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/operator/do";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/withLatestFrom";
import {
  Dispatcher, ActionTunnel, Store, Action, StoreMiddleware,
} from "./interfaces";

export const tunnelActions =
  (tunnel: ActionTunnel): StoreMiddleware<Store<any>> =>
    store => {
      const { dispatch, dispatchFactory, actions } = tunnel;
      const toDispatchStream = (disp: Dispatcher | Observable<Dispatcher>) =>
        typeof disp === "function" ? Observable.of(disp) : disp;

      if (!!dispatch && !!dispatchFactory) {
        throw Error("Must supply dispatch or dispatchFactory");
      }
      const dispatch$ =
        !!dispatch
          ? toDispatchStream(dispatch)
          : toDispatchStream(dispatchFactory!(store));

      const subscribe = (a$: Observable<Action>) => a$
        .withLatestFrom(dispatch$, (a, d) => [a, d])
        .filter<[Action, Dispatcher]>(([a, d]) => !!d)
        .do<[Action, Dispatcher]>(([a, d]) => d(a))
        .subscribe();

      if (actions === "all") {
        subscribe(store.action$);
      } else if (Array.isArray(actions)) {
        subscribe(store.action$.filter(a => actions.indexOf(a.type) >= 0));
      } else if (typeof actions === "function") {
        subscribe(store.action$.map(actions));
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
        subscribe(store.action$.filter(filter).map(map));
      }
      return store;
    };

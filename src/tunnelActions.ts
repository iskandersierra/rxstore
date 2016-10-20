import {
  Dispatcher, ActionTunnel, Store, Action, StoreMiddleware,
} from "./interfaces";

export const tunnelActions =
  (tunnel: ActionTunnel): StoreMiddleware<Store<any>> =>
    store => {
      const { dispatch: disp, actions } = tunnel;
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
      return store;
    };

export default tunnelActions;

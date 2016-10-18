import "rxjs/add/operator/delay";
import "rxjs/add/operator/do";
import "rxjs/add/operator/subscribeOn";
import { queue } from "rxjs/scheduler/queue";
import { Dispatcher, Effect, EffectsDisposer } from "./interfaces";

const scheduler = queue;

export const EFFECTS_ACTIONS = {
  END_STORE_EFFECTS: "END_STORE_EFFECTS",
  INIT_STORE_EFFECTS: "INIT_STORE_EFFECTS",
};

// export const logUpdatesEffect = (store: Store<any>) => store.update$
//   .do(up => console.log("UPDATE: " + up.action.type, up));

export const createEffects =
  (dispatch: Dispatcher, ...effects: (Effect | EffectsDisposer)[])
    : EffectsDisposer => {
    let disposers = effects
      .map(e => {
        if (typeof e === "function") {
          return e;
        } else {
          const subscription = e.subscribeOn(scheduler).subscribe(dispatch);
          return () => subscription.unsubscribe();
        }
      });
    let isDisposed = false;

    const unlisten = () => {
      if (isDisposed) { return; }
      isDisposed = true;
      dispatch({ type: EFFECTS_ACTIONS.END_STORE_EFFECTS });
      disposers.forEach(s => s());
      disposers = [];
    };

    dispatch({ type: EFFECTS_ACTIONS.INIT_STORE_EFFECTS });
    return unlisten;
  };

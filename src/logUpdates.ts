import { Observable } from "rxjs/Observable";
import { queue } from "rxjs/scheduler/queue";
import "rxjs/add/operator/do";
import { StoreMiddleware, Action, Store, StateUpdate } from "./interfaces";
import { startEffectsOn } from "./startEffects";

const scheduler = queue;

export interface ILogUpdatesOptions<TState, TStore extends Store<TState>> {
  logger: (message: any, ...args: any[]) => void;
  title?: string | ((store: TStore) => string) | undefined;
  caption?: string | ((update: StateUpdate<TState>, store: TStore) => string) | undefined;
  captionError?: string | ((err: any, store: TStore) => string) | undefined;
  captionComplete?: string | ((store: TStore) => string) | undefined;
  mapper?: ((update: StateUpdate<TState>, store: TStore) => any) | undefined;
}

export const logUpdates =
  <TState, TStore extends Store<TState>>(
    options: ILogUpdatesOptions<TState, TStore>
  ): StoreMiddleware<TStore> =>
    (store: TStore) => {
      const {
        logger,
        title = "",
        caption = "[UPDATE]",
        captionError = "[ERROR]",
        captionComplete = "[COMPLETE]",
        mapper = ((u: StateUpdate<TState>) => u),
      } = options;

      const theTitle = typeof title === "function"
        ? () => title(store)
        : () => title;

      const theCaption = typeof caption === "function"
        ? caption
        : () => caption;

      const theCaptionError = typeof captionError === "function"
        ? captionError
        : () => captionError;

      const theCaptionComplete = typeof captionComplete === "function"
        ? captionComplete
        : () => captionComplete;

      const theMapper = typeof mapper === "function"
        ? mapper
        : (update: StateUpdate<TState>) => update;

      const asMessage = (title: string, caption: string) => !!title
        ? (!!caption ? title + " " + caption : caption) + ": "
        : !!caption ? caption + ": " : "";

      const onNext = (up: StateUpdate<TState>) =>
        logger(asMessage(theTitle(), theCaption(up, store)), theMapper(up, store));

      const onError = (err: any) =>
        logger(asMessage(theTitle(), theCaptionError(err, store)), err);

      const onComplete = () =>
        logger(asMessage(theTitle(), theCaptionComplete(store)));

      store.update$
        .subscribe(onNext, onError, onComplete);
      return store;
    };

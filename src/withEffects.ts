import { StoreMiddleware } from "./interfaces";

export const withEffects =
  <TStore>(effects: (store: TStore) => void): StoreMiddleware<TStore> =>
    store => {
      effects(store);
      return store;
    };

export default withEffects;

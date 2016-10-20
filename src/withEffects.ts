import { EffectsFactory, StoreMiddleware } from "./interfaces";

export const withEffects =
  <TStore>(effects: EffectsFactory<TStore>): StoreMiddleware<TStore> =>
    store => {
      effects(store);
      return store;
    };

export default withEffects;

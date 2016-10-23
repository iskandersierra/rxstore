import "object-assign";
import objectAssign = require("object-assign");
import { Store, StoreMiddleware } from "./interfaces";

export const extendWith =
  <TState>(extender: (store: Store<TState>) => Object
  ): StoreMiddleware<Store<TState>> =>
    store => objectAssign(store, extender(store));

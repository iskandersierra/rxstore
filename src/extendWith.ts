import "object-assign";
import objectAssign = require("object-assign");
import { StoreExtension, Store, StoreMiddleware } from "./interfaces";

export const extendWith =
  <TState>(extender: StoreExtension<TState>
  ): StoreMiddleware<Store<TState>> =>
    store => objectAssign(store, extender(store));

export default extendWith;

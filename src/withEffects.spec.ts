/// <reference path="../typefix/jest.d.ts" />
"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/empty";
import "rxjs/add/observable/of";
import { Action, StateUpdate, createStore, withEffects } from "./index";

describe("withEffects", () => {
  describe("Sanity checks", () => {
    it("should be a function", () =>
      expect(typeof withEffects).toBe("function"));
  }); // describe Sanity checks

  describe("Given a store", () => {
    const store = {
      action$: Observable.empty<Action>(),
      state$: Observable.empty<{}>(),
      update$: Observable.empty<StateUpdate<{}>>(),
      dispatch: jest.fn(),
    };

    describe("When the store is extended", () => {
      const effects = jest.fn();
      const middleware = withEffects(effects);
      it("middleware should be a function", () =>
        expect(typeof middleware).toBe("function"));
      const newStore = middleware(store);
      it("it should not be null", () =>
        expect(newStore).toBeTruthy());
      it("it should be the same store than before",
        () => expect(newStore).toBe(store));
      it("the effects function should have been called",
        () => expect(effects).toBeCalledWith(store));
    }); // describe When the store is extended
  });
}); // describe extendWith

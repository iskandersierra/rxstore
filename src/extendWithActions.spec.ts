/// <reference path="../typefix/jest.d.ts" />
"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/empty";
import "rxjs/add/observable/of";
import { reassign, reassignif } from "./utils";
import { actionCreator } from "./actionCreator";
import { Action, StateUpdate, Store } from "./interfaces";
import { createStore, createStoreExtensions } from "./createStore";
import { extendWithActions } from "./extendWithActions";

interface TestModel {
  value: string;
  checked: boolean;
}

interface TestStore extends Store<TestModel> {
  changed(value: string): void;
  checked(): void;
  command(): void;
}

describe("extendWithActions", () => {
  describe("Sanity checks", () => {
    it("should be a function", () =>
      expect(typeof extendWithActions).toBe("function"));
  }); // describe Sanity checks

  describe("Given an action creator for a namespace", () => {
    const event = actionCreator<TestModel>("");
    const state: TestModel = { value: "", checked: false };
    const Events = {
      changed: event.of<string>("CHANGED", (s, value) => reassign(s, { value })),
      checked: event("CHECKED", s => reassign(s, { checked: true })),
      command: event("COMMAND"),
    };
    const store = {
      action$: Observable.empty<Action>(),
      state$: Observable.empty<{}>(),
      update$: Observable.empty<StateUpdate<{}>>(),
      dispatch: jest.fn(),
    };

    describe("When the store is extended", () => {
      const middleware = extendWithActions(Events);
      it("middleware should be a function", () =>
        expect(typeof middleware).toBe("function"));
      const newStore = middleware(store) as TestStore;
      it("it should not be null", () =>
        expect(newStore).toBeTruthy());
      it("it should be the same store than before",
        () => expect(newStore).toBe(store));
      it("it should own a new changed property",
        () => expect((newStore as Object).hasOwnProperty("changed")).toBeTruthy());
      it("when changed function is called the dispatch function should have been called",
        () => {
          newStore.changed("hello");
          expect(newStore.dispatch).toBeCalledWith({ type: "CHANGED", payload: "hello" });
        });
      it("it should own a new checked property",
        () => expect((newStore as Object).hasOwnProperty("checked")).toBeTruthy());
      it("when checked function is called the dispatch function should have been called",
        () => {
          newStore.checked();
          expect(newStore.dispatch).toBeCalledWith({ type: "CHECKED" });
        });
      it("it should own a new command property",
        () => expect((newStore as Object).hasOwnProperty("command")).toBeTruthy());
      it("when command function is called the dispatch function should have been called",
        () => {
          newStore.command();
          expect(newStore.dispatch).toBeCalledWith({ type: "COMMAND" });
        });
    }); // describe When the store is extended
  });
}); // describe extendWith

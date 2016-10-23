/// <reference path="../typefix/jest.d.ts" />
"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");
import {
  Action, Dispatcher, Reducer, ActionCreator,
  EmptyActionDescription, TypedActionDescription,
  reassign, reassignif, actionCreator, reducerFromActions,
} from "./index";

interface TestModel {
  value: string;
  checked: boolean;
}

describe("reducerFromActions", () => {
  describe("Sanity checks", () => {
    it("it should be a function",
      () => expect(typeof reducerFromActions).toBe("function"));
  }); //    Sanity checks

  describe("Given an action creator for a namespace", () => {
    const event = actionCreator<TestModel>("A_NAMESPACE");
    describe("And an actions mapping", () => {
      const state: TestModel = { value: "", checked: false };
      const Events = {
        changed: event.of<string>("CHANGED", (s, value) => reassign(s, { value })),
        checked: event("CHECKED", s => reassign(s, { checked: true })),
        command: event("COMMAND"),
      };

      describe("When a reducer is derived from the actions", () => {
        const reducer = reducerFromActions(Events);
        const changedState = reducer(state, Events.changed.create("hello"));
        const checkedState = reducer(state, Events.checked.create());
        it("it should be a function",
          () => expect(typeof reducer).toBe("function"));
        it("changedState should not be the same as original state",
          () => expect(changedState).not.toBe(state));
        it("it should reduce action changed correctly",
          () => expect(changedState).toEqual({ value: "hello", checked: false }));
        it("checkedState should not be the same as original state",
          () => expect(checkedState).not.toBe(state));
        it("it should reduce action checked correctly",
          () => expect(checkedState).toEqual({ value: "", checked: true }));
        it("commandState should be the same as original state",
          () => expect(reducer(state, Events.command.create())).toBe(state));
        it("unknownState should be the same as original state",
          () => expect(reducer(state, { type: "UNKNOWN" })).toBe(state));
      }); //    When a reducer is derived from the actions
    }); //    And an actions mapping
  }); //    Given an action creator for a namespace
}); //    reducerFromActions

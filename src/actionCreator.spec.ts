/// <reference path="../typefix/jest.d.ts" />
"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");
import {
  Action, Dispatcher, Reducer, ActionCreator,
  EmptyActionDescription, TypedActionDescription,
  actionCreator,
} from "./index";

describe("actionCreator", () => {
  describe("Sanity checks", () => {
    it("it should be a function",
      () => expect(typeof actionCreator).toBe("function"));
  }); //    Sanity checks

  describe("Given an action creator for a namespace", () => {
    const events = actionCreator("A_NAMESPACE::");
    it("it should be a function",
      () => expect(typeof events).toBe("function"));
    describe("When an empty action is created", () => {
      const action = events("EMPTY_ACTION");
      const dispatch = jest.fn();
      it("it should not be null",
        () => expect(action).toBeTruthy());
      it("it should be a function",
        () => expect(typeof action).toBe("function"));
      it("its kind should be empty",
        () => expect(action.kind).toBe("empty"));
      it("its type should be A_NAMESPACE::EMPTY_ACTION",
        () => expect(action.type).toBe("A_NAMESPACE::EMPTY_ACTION"));
      it("its create should be a function",
        () => expect(typeof action.create).toBe("function"));
      it("its create should to return an action",
        () => expect(action.create()).toEqual({ type: "A_NAMESPACE::EMPTY_ACTION" }));
      it("it should to return an action",
        () => expect(action()).toEqual({ type: "A_NAMESPACE::EMPTY_ACTION" }));
      it("its dispatchOn should be a function",
        () => expect(typeof action.dispatchOn).toBe("function"));
      it("its dispatchOn should to return an action",
        () => {
          action.dispatchOn(dispatch);
          expect(dispatch).toBeCalledWith({ type: "A_NAMESPACE::EMPTY_ACTION" });
        });
      it("its isA should be a function",
        () => expect(typeof action.isA).toBe("function"));
      it("its isA should to return true for a corresponding action",
        () => expect(action.isA({ type: "A_NAMESPACE::EMPTY_ACTION" })).toBeTruthy());
      it("its isA should to return false for a non-corresponding action",
        () => expect(action.isA({ type: "A_NAMESPACE::OTHER_ACTION" })).toBeFalsy());
    }); //    When an empty action is created

    describe("When a typed action is created", () => {
      const action = events.of<string>("TYPED_ACTION");
      const dispatch = jest.fn();
      it("it should not be null",
        () => expect(action).toBeTruthy());
      it("it should be a function",
        () => expect(typeof action).toBe("function"));
      it("its kind should be typed",
        () => expect(action.kind).toBe("typed"));
      it("its type should be A_NAMESPACE::TYPED_ACTION",
        () => expect(action.type).toBe("A_NAMESPACE::TYPED_ACTION"));
      it("its create should be a function",
        () => expect(typeof action.create).toBe("function"));
      it("its create should to return an action",
        () => expect(action.create("hello")).toEqual({ type: "A_NAMESPACE::TYPED_ACTION", payload: "hello" }));
      it("it should to return an action",
        () => expect(action("hello")).toEqual({ type: "A_NAMESPACE::TYPED_ACTION", payload: "hello" }));
      it("its dispatchOn should be a function",
        () => expect(typeof action.dispatchOn).toBe("function"));
      it("its dispatchOn should to return an action",
        () => {
          action.dispatchOn("hello", dispatch);
          expect(dispatch).toBeCalledWith({ type: "A_NAMESPACE::TYPED_ACTION", payload: "hello" });
        });
      it("its isA should be a function",
        () => expect(typeof action.isA).toBe("function"));
      it("its isA should to return true for a corresponding action",
        () => expect(action.isA({ type: "A_NAMESPACE::TYPED_ACTION" })).toBeTruthy());
      it("its isA should to return false for a non-corresponding action",
        () => expect(action.isA({ type: "A_NAMESPACE::OTHER_ACTION" })).toBeFalsy());
    }); //    When a typed action is created
  }); //    Given an action creator for a namespace
}); //    actionCreator

/// <reference path="../typefix/jest.d.ts" />
"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/empty";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/first";
import "rxjs/add/operator/last";
import "rxjs/add/operator/take";
import "rxjs/add/operator/timeout";
import "rxjs/add/operator/toArray";
import "rxjs/add/operator/toPromise";

import {
  Action, StateUpdate, createStore, StoreActions,
  defineStore, actionCreator, reducerFromActions, withEffects, Store, logUpdates,
} from "./index";

describe("logUpdates", () => {
  describe("Sanity checks", () => {
    it("logUpdates should be a function", () =>
      expect(typeof logUpdates).toBe("function"));
  });    // Sanity checks

  describe("Given a logger", () => {
    const logger = jest.fn();
    it("the logger should receive default ", () => {
      const store = createStore((s, a) => a.type, "", logUpdates({ logger }));
      expect(logger).toBeCalledWith("[UPDATE]: ", { action: StoreActions.init(), state: StoreActions.init.type });
    });
  });    // Given a logger

  describe("Given a logger and a caption", () => {
    const logger = jest.fn();
    const caption = "CAPTION";
    it("the logger should receive default ", () => {
      const store = createStore((s, a) => a.type, "", logUpdates({ logger, caption }));
      expect(logger).toBeCalledWith(caption + ": ", { action: StoreActions.init(), state: StoreActions.init.type });
    });
  });    // Given a logger and a caption

  describe("Given a logger and a caption function", () => {
    const logger = jest.fn();
    it("the logger should receive default ", () => {
      const store = createStore((s, a) => a.type, "", logUpdates({ logger, caption: up => up.action.type }));
      expect(logger).toBeCalledWith(StoreActions.init.type + ": ",
        { action: StoreActions.init(), state: StoreActions.init.type });
    });
  });    // Given a logger and a caption function

  describe("Given a logger and a mapper", () => {
    const logger = jest.fn();
    it("the logger should receive default ", () => {
      const store = createStore((s, a) => a.type, "", logUpdates({ logger, mapper: up => up.action.type }));
      expect(logger).toBeCalledWith("[UPDATE]: ", StoreActions.init.type);
    });
  });    // Given a logger and a caption function
});    // logUpdates/logUpdatesOn

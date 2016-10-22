/// <reference path="../typefix/jest.d.ts" />
"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");
import { reassign, reassignif } from "./utils";

describe("reassign", () => {
  describe("Given a single object and a true condition", () => {
    const obj1 = { a1: "obj1.a1", a: "obj1.a" };
    describe("When the single object is reassigned", () => {
      const r = reassign(obj1);
      it("it should be equal to original object",
        () => expect(r).toEqual(obj1));
      it("it should not be the original object",
        () => expect(r).not.toBe(obj1));
      it("the original object should not change",
        () => expect(r).toEqual({ a1: "obj1.a1", a: "obj1.a" }));
    }); // describe When the single object is reassigned
  }); // describe Given a single object

  describe("Given two object with no common props", () => {
    const obj1 = { a1: "obj1.a1", a: "obj1.a" };
    const obj2 = { a2: "obj2.a2", b: "obj2.b" };
    describe("When the two objects are reassigned", () => {
      const r = reassign(obj1, obj2);
      it("it should not be the original object",
        () => expect(r).not.toBe(obj1));
      it("it should be equal to both objects merged",
        () => expect(r).toEqual({
          a1: "obj1.a1", a: "obj1.a",
          a2: "obj2.a2", b: "obj2.b",
        }));
      it("the original objects should not change",
        () => {
          expect(obj1).toEqual({ a1: "obj1.a1", a: "obj1.a" });
          expect(obj2).toEqual({ a2: "obj2.a2", b: "obj2.b" });
        });
    }); // describe When the single object is reassigned
  }); // describe Given a single object

  describe("Given two object with common props", () => {
    const obj1 = { a1: "obj1.a1", a: "obj1.a" };
    const obj2 = { a2: "obj2.a2", a: "obj2.a" };
    describe("When the two objects are reassigned", () => {
      const r = reassign(obj1, obj2);
      it("it should not be the original object",
        () => expect(r).not.toBe(obj1));
      it("it should be equal to both objects merged",
        () => expect(r).toEqual({
          a1: "obj1.a1",
          a2: "obj2.a2", a: "obj2.a",
        }));
      it("the original objects should not change",
        () => {
          expect(obj1).toEqual({ a1: "obj1.a1", a: "obj1.a" });
          expect(obj2).toEqual({ a2: "obj2.a2", a: "obj2.a" });
        });
    }); // describe When the single object is reassigned
  }); // describe Given a single object

  describe("Given three object with no common props", () => {
    const obj1 = { a1: "obj1.a1", a: "obj1.a" };
    const obj2 = { a2: "obj2.a2", b: "obj2.b" };
    const obj3 = { a3: "obj3.a3", c: "obj3.c" };
    describe("When the three objects are reassigned", () => {
      const r = reassign(obj1, obj2, obj3);
      it("it should not be the original object",
        () => expect(r).not.toBe(obj1));
      it("it should be equal to both objects merged",
        () => expect(r).toEqual({
          a1: "obj1.a1", a: "obj1.a",
          a2: "obj2.a2", b: "obj2.b",
          a3: "obj3.a3", c: "obj3.c",
        }));
      it("the original objects should not change",
        () => {
          expect(obj1).toEqual({ a1: "obj1.a1", a: "obj1.a" });
          expect(obj2).toEqual({ a2: "obj2.a2", b: "obj2.b" });
          expect(obj3).toEqual({ a3: "obj3.a3", c: "obj3.c" });
        });
    }); // describe When the single object is reassigned
  }); // describe Given a single object
}); // describe reassign

describe("reassignif", () => {
  describe("Given a single object", () => {
    const obj1 = { a1: "obj1.a1", a: "obj1.a" };
    describe("When the single object is reassigned", () => {
      const r = reassignif(true, obj1);
      it("it should be equal to original object",
        () => expect(r).toEqual(obj1));
      it("it should not be the original object",
        () => expect(r).not.toBe(obj1));
      it("the original object should not change",
        () => expect(r).toEqual({ a1: "obj1.a1", a: "obj1.a" }));
    }); // describe When the single object is reassigned
  }); // describe Given a single object

  describe("Given a single object and a false condition", () => {
    const obj1 = { a1: "obj1.a1", a: "obj1.a" };
    describe("When the single object is reassigned", () => {
      const r = reassignif(false, obj1);
      it("it should be the original object",
        () => expect(r).toBe(obj1));
      it("the original object should not change",
        () => expect(r).toEqual({ a1: "obj1.a1", a: "obj1.a" }));
    }); // describe When the single object is reassigned
  }); // describe Given a single object

  describe("Given two object with no common props", () => {
    const obj1 = { a1: "obj1.a1", a: "obj1.a" };
    const obj2 = { a2: "obj2.a2", b: "obj2.b" };
    describe("When the two objects are reassigned", () => {
      const r = reassignif(true, obj1, obj2);
      it("it should not be the original object",
        () => expect(r).not.toBe(obj1));
      it("it should be equal to both objects merged",
        () => expect(r).toEqual({
          a1: "obj1.a1", a: "obj1.a",
          a2: "obj2.a2", b: "obj2.b",
        }));
      it("the original objects should not change",
        () => {
          expect(obj1).toEqual({ a1: "obj1.a1", a: "obj1.a" });
          expect(obj2).toEqual({ a2: "obj2.a2", b: "obj2.b" });
        });
    }); // describe When the single object is reassigned
  }); // describe Given a single object

  describe("Given two object with no common props and a false condition", () => {
    const obj1 = { a1: "obj1.a1", a: "obj1.a" };
    const obj2 = { a2: "obj2.a2", b: "obj2.b" };
    describe("When the two objects are reassigned", () => {
      const r = reassignif(false, obj1, obj2);
      it("it should be the original object",
        () => expect(r).toBe(obj1));
      it("the original objects should not change",
        () => {
          expect(obj1).toEqual({ a1: "obj1.a1", a: "obj1.a" });
          expect(obj2).toEqual({ a2: "obj2.a2", b: "obj2.b" });
        });
    }); // describe When the single object is reassigned
  }); // describe Given a single object

  describe("Given two object with common props", () => {
    const obj1 = { a1: "obj1.a1", a: "obj1.a" };
    const obj2 = { a2: "obj2.a2", a: "obj2.a" };
    describe("When the two objects are reassigned", () => {
      const r = reassignif(true, obj1, obj2);
      it("it should not be the original object",
        () => expect(r).not.toBe(obj1));
      it("it should be equal to both objects merged",
        () => expect(r).toEqual({
          a1: "obj1.a1",
          a2: "obj2.a2", a: "obj2.a",
        }));
      it("the original objects should not change",
        () => {
          expect(obj1).toEqual({ a1: "obj1.a1", a: "obj1.a" });
          expect(obj2).toEqual({ a2: "obj2.a2", a: "obj2.a" });
        });
    }); // describe When the single object is reassigned
  }); // describe Given a single object

  describe("Given two object with common prop and a false conditions", () => {
    const obj1 = { a1: "obj1.a1", a: "obj1.a" };
    const obj2 = { a2: "obj2.a2", a: "obj2.a" };
    const obj3 = { a3: "obj3.a3", a: "obj3.a" };
    describe("When the two objects are reassigned", () => {
      const r = reassignif(false, obj1, obj2, obj3);
      it("it should be the original object",
        () => expect(r).toBe(obj1));
      it("the original objects should not change",
        () => {
          expect(obj1).toEqual({ a1: "obj1.a1", a: "obj1.a" });
          expect(obj2).toEqual({ a2: "obj2.a2", a: "obj2.a" });
          expect(obj3).toEqual({ a3: "obj3.a3", a: "obj3.a" });
        });
    }); // describe When the single object is reassigned
  }); // describe Given a single object

  describe("Given three object with common props", () => {
    const obj1 = { a1: "obj1.a1", a: "obj1.a" };
    const obj2 = { a2: "obj2.a2", a: "obj2.a" };
    const obj3 = { a3: "obj3.a3", a: "obj3.a" };
    describe("When the three objects are reassigned", () => {
      const r = reassignif(true, obj1, obj2, obj3);
      it("it should not be the original object",
        () => expect(r).not.toBe(obj1));
      it("it should be equal to both objects merged",
        () => expect(r).toEqual({
          a1: "obj1.a1",
          a2: "obj2.a2",
          a3: "obj3.a3", a: "obj3.a",
        }));
      it("the original objects should not change",
        () => {
          expect(obj1).toEqual({ a1: "obj1.a1", a: "obj1.a" });
          expect(obj2).toEqual({ a2: "obj2.a2", a: "obj2.a" });
          expect(obj3).toEqual({ a3: "obj3.a3", a: "obj3.a" });
        });
    }); // describe When the single object is reassigned
  }); // describe Given a single object

  describe("Given three object with common prop and a false conditions", () => {
    const obj1 = { a1: "obj1.a1", a: "obj1.a" };
    const obj2 = { a2: "obj2.a2", a: "obj2.a" };
    describe("When the three objects are reassigned", () => {
      const r = reassignif(false, obj1, obj2);
      it("it should be the original object",
        () => expect(r).toBe(obj1));
      it("the original objects should not change",
        () => {
          expect(obj1).toEqual({ a1: "obj1.a1", a: "obj1.a" });
          expect(obj2).toEqual({ a2: "obj2.a2", a: "obj2.a" });
        });
    }); // describe When the single object is reassigned
  }); // describe Given a single object
}); // describe reassign

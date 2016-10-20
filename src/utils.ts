import "object-assign";
import objectAssign = require("object-assign");

export function reassign<U>(s: U): U;
export function reassign<U, V>(s1: U, s2: V): U & V;
export function reassign<U, V, W>(s1: U, s2: V, s3: W): U & V & W;
export function reassign<U, V, W, Q>(s1: U, s2: V, s3: W, s4: Q): U & V & W & Q;
export function reassign<U, V, W, Q, R>(s1: U, s2: V, s3: W, s4: Q, s5: R): U & V & W & Q & R;
export function reassign(s1: any, ...rest: any[]): any;

export function reassign(s1: any, ...rest: any[]) {
  return objectAssign({}, s1, ...rest);
}

export function reassignif<U>(cond: boolean, s: U): U;
export function reassignif<U, V>(cond: boolean, s1: U, s2: V): U & V;
export function reassignif<U, V, W>(cond: boolean, s1: U, s2: V, s3: W): U & V & W;
export function reassignif<U, V, W, Q>(cond: boolean, s1: U, s2: V, s3: W, s4: Q): U & V & W & Q;
export function reassignif<U, V, W, Q, R>(cond: boolean, s1: U, s2: V, s3: W, s4: Q, s5: R): U & V & W & Q & R;
export function reassignif(cond: boolean, s1: any, ...rest: any[]): any;

export function reassignif(cond: boolean, s1: any, ...rest: any[]) {
  return cond ? reassign(s1, ...rest) : s1;
}

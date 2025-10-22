/*
 * Result.ts Tests
 * Comprehensive tests for type-safe error handling utility
 */

import { describe, test, expect } from 'vitest';
import {
  Ok,
  Err,
  ok,
  err,
  isOk,
  isErr,
  unwrap,
  unwrapOr,
  map,
  mapErr,
  andThen,
  combine,
  type Result,
} from '../../src/utils/Result.js';

describe('Result', () => {
  describe('Construction', () => {
    test('Ok creates success result', () => {
      const result = Ok(42);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(42);
      }
    });

    test('Err creates error result', () => {
      const result = Err('error message');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('error message');
      }
    });

    test('Ok result has ok=true', () => {
      const result = Ok('success');
      expect(result.ok).toBe(true);
    });

    test('Err result has ok=false', () => {
      const result = Err(new Error('failure'));
      expect(result.ok).toBe(false);
    });

    test('lowercase ok alias works', () => {
      const result = ok(123);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(123);
      }
    });

    test('lowercase err alias works', () => {
      const result = err('error');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('error');
      }
    });
  });

  describe('Type Guards', () => {
    test('isOk returns true for Ok result', () => {
      const result: Result<number, string> = Ok(42);
      expect(isOk(result)).toBe(true);
    });

    test('isOk returns false for Err result', () => {
      const result: Result<number, string> = Err('error');
      expect(isOk(result)).toBe(false);
    });

    test('isErr returns true for Err result', () => {
      const result: Result<number, string> = Err('error');
      expect(isErr(result)).toBe(true);
    });

    test('isErr returns false for Ok result', () => {
      const result: Result<number, string> = Ok(42);
      expect(isErr(result)).toBe(false);
    });

    test('isOk narrows type correctly', () => {
      const result: Result<number, string> = Ok(42);
      if (isOk(result)) {
        // Type should be narrowed to { ok: true; value: number }
        const value: number = result.value;
        expect(value).toBe(42);
      }
    });

    test('isErr narrows type correctly', () => {
      const result: Result<number, string> = Err('error');
      if (isErr(result)) {
        // Type should be narrowed to { ok: false; error: string }
        const error: string = result.error;
        expect(error).toBe('error');
      }
    });
  });

  describe('Unwrap', () => {
    test('unwrap returns value for Ok', () => {
      const result = Ok(42);
      expect(unwrap(result)).toBe(42);
    });

    test('unwrap throws for Err', () => {
      const result = Err(new Error('failure'));
      expect(() => unwrap(result)).toThrow('failure');
    });

    test('unwrap throws Error instance for Err', () => {
      const error = new Error('custom error');
      const result = Err(error);
      expect(() => unwrap(result)).toThrow(error);
    });

    test('unwrapOr returns value for Ok', () => {
      const result = Ok(42);
      expect(unwrapOr(result, 0)).toBe(42);
    });

    test('unwrapOr returns default for Err', () => {
      const result = Err('error');
      expect(unwrapOr(result, 0)).toBe(0);
    });

    test('unwrapOr works with complex types', () => {
      const result: Result<{ x: number }, string> = Err('error');
      const defaultValue = { x: 10 };
      expect(unwrapOr(result, defaultValue)).toEqual({ x: 10 });
    });
  });

  describe('Map', () => {
    test('map transforms Ok value', () => {
      const result = Ok(42);
      const mapped = map(result, (x) => x * 2);
      
      expect(mapped.ok).toBe(true);
      if (mapped.ok) {
        expect(mapped.value).toBe(84);
      }
    });

    test('map leaves Err unchanged', () => {
      const result: Result<number, string> = Err('error');
      const mapped = map(result, (x) => x * 2);
      
      expect(mapped.ok).toBe(false);
      if (!mapped.ok) {
        expect(mapped.error).toBe('error');
      }
    });

    test('map can change value type', () => {
      const result = Ok(42);
      const mapped = map(result, (x) => `Number: ${x}`);
      
      expect(mapped.ok).toBe(true);
      if (mapped.ok) {
        expect(mapped.value).toBe('Number: 42');
      }
    });

    test('map preserves error type', () => {
      const result: Result<number, Error> = Err(new Error('failure'));
      const mapped = map(result, (x) => x.toString());
      
      expect(mapped.ok).toBe(false);
      if (!mapped.ok) {
        expect(mapped.error.message).toBe('failure');
      }
    });
  });

  describe('MapErr', () => {
    test('mapErr transforms Err value', () => {
      const result: Result<number, string> = Err('error');
      const mapped = mapErr(result, (e) => `Error: ${e}`);
      
      expect(mapped.ok).toBe(false);
      if (!mapped.ok) {
        expect(mapped.error).toBe('Error: error');
      }
    });

    test('mapErr leaves Ok unchanged', () => {
      const result: Result<number, string> = Ok(42);
      const mapped = mapErr(result, (e) => `Error: ${e}`);
      
      expect(mapped.ok).toBe(true);
      if (mapped.ok) {
        expect(mapped.value).toBe(42);
      }
    });

    test('mapErr can change error type', () => {
      const result: Result<number, string> = Err('error');
      const mapped = mapErr(result, (e) => new Error(e));
      
      expect(mapped.ok).toBe(false);
      if (!mapped.ok) {
        expect(mapped.error).toBeInstanceOf(Error);
        expect(mapped.error.message).toBe('error');
      }
    });

    test('mapErr preserves value type', () => {
      const result: Result<{ x: number }, string> = Ok({ x: 42 });
      const mapped = mapErr(result, (e) => new Error(e));
      
      expect(mapped.ok).toBe(true);
      if (mapped.ok) {
        expect(mapped.value).toEqual({ x: 42 });
      }
    });
  });

  describe('AndThen (Chain)', () => {
    test('andThen chains Ok results', () => {
      const result = Ok(42);
      const chained = andThen(result, (x) => Ok(x * 2));
      
      expect(chained.ok).toBe(true);
      if (chained.ok) {
        expect(chained.value).toBe(84);
      }
    });

    test('andThen short-circuits on Err', () => {
      const result: Result<number, string> = Err('error');
      const chained = andThen(result, (x) => Ok(x * 2));
      
      expect(chained.ok).toBe(false);
      if (!chained.ok) {
        expect(chained.error).toBe('error');
      }
    });

    test('andThen propagates errors from chained function', () => {
      const result = Ok(42);
      const chained = andThen(result, () => Err('chained error'));
      
      expect(chained.ok).toBe(false);
      if (!chained.ok) {
        expect(chained.error).toBe('chained error');
      }
    });

    test('andThen can change value type', () => {
      const result = Ok(42);
      const chained = andThen(result, (x) => Ok(`Number: ${x}`));
      
      expect(chained.ok).toBe(true);
      if (chained.ok) {
        expect(chained.value).toBe('Number: 42');
      }
    });

    test('andThen works for multiple chains', () => {
      const result = Ok(10);
      const chained = andThen(
        andThen(result, (x) => Ok(x * 2)),
        (x) => Ok(x + 5)
      );
      
      expect(chained.ok).toBe(true);
      if (chained.ok) {
        expect(chained.value).toBe(25); // (10 * 2) + 5
      }
    });

    test('andThen stops at first error in chain', () => {
      const result = Ok(10);
      const chained = andThen(
        andThen(result, () => Err('first error')),
        () => Ok(100) // This should not execute
      );
      
      expect(chained.ok).toBe(false);
      if (!chained.ok) {
        expect(chained.error).toBe('first error');
      }
    });
  });

  describe('Combine', () => {
    test('combine returns Ok with all values when all Ok', () => {
      const results = [Ok(1), Ok(2), Ok(3)];
      const combined = combine(results);
      
      expect(combined.ok).toBe(true);
      if (combined.ok) {
        expect(combined.value).toEqual([1, 2, 3]);
      }
    });

    test('combine returns first Err when any Err', () => {
      const results: Result<number, string>[] = [
        Ok(1),
        Err('error 1'),
        Ok(3),
        Err('error 2'),
      ];
      const combined = combine(results);
      
      expect(combined.ok).toBe(false);
      if (!combined.ok) {
        expect(combined.error).toBe('error 1');
      }
    });

    test('combine handles empty array', () => {
      const results: Result<number, string>[] = [];
      const combined = combine(results);
      
      expect(combined.ok).toBe(true);
      if (combined.ok) {
        expect(combined.value).toEqual([]);
      }
    });

    test('combine handles single Ok', () => {
      const results = [Ok(42)];
      const combined = combine(results);
      
      expect(combined.ok).toBe(true);
      if (combined.ok) {
        expect(combined.value).toEqual([42]);
      }
    });

    test('combine handles single Err', () => {
      const results: Result<number, string>[] = [Err('error')];
      const combined = combine(results);
      
      expect(combined.ok).toBe(false);
      if (!combined.ok) {
        expect(combined.error).toBe('error');
      }
    });

    test('combine works with complex types', () => {
      const results = [
        Ok({ x: 1 }),
        Ok({ x: 2 }),
        Ok({ x: 3 }),
      ];
      const combined = combine(results);
      
      expect(combined.ok).toBe(true);
      if (combined.ok) {
        expect(combined.value).toEqual([{ x: 1 }, { x: 2 }, { x: 3 }]);
      }
    });
  });

  describe('Edge Cases', () => {
    test('handles null values in Ok', () => {
      const result = Ok(null);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(null);
      }
    });

    test('handles undefined values in Ok', () => {
      const result = Ok(undefined);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(undefined);
      }
    });

    test('handles null errors in Err', () => {
      const result = Err(null);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe(null);
      }
    });

    test('handles complex nested types', () => {
      type ComplexType = { a: { b: { c: number } } };
      const value: ComplexType = { a: { b: { c: 42 } } };
      const result = Ok(value);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.a.b.c).toBe(42);
      }
    });

    test('map with identity function', () => {
      const result = Ok(42);
      const mapped = map(result, (x) => x);
      
      expect(mapped.ok).toBe(true);
      if (mapped.ok) {
        expect(mapped.value).toBe(42);
      }
    });

    test('andThen with identity wrapping', () => {
      const result = Ok(42);
      const chained = andThen(result, (x) => Ok(x));
      
      expect(chained.ok).toBe(true);
      if (chained.ok) {
        expect(chained.value).toBe(42);
      }
    });
  });

  describe('Real-world Usage Patterns', () => {
    test('parse and validate pattern', () => {
      function parseNumber(input: string): Result<number, string> {
        const num = parseInt(input, 10);
        return isNaN(num) ? Err('Not a number') : Ok(num);
      }

      function validatePositive(num: number): Result<number, string> {
        return num > 0 ? Ok(num) : Err('Must be positive');
      }

      // Valid input
      const valid = andThen(parseNumber('42'), validatePositive);
      expect(valid.ok).toBe(true);
      if (valid.ok) {
        expect(valid.value).toBe(42);
      }

      // Invalid number
      const invalid1 = andThen(parseNumber('abc'), validatePositive);
      expect(invalid1.ok).toBe(false);

      // Negative number
      const invalid2 = andThen(parseNumber('-10'), validatePositive);
      expect(invalid2.ok).toBe(false);
    });

    test('combine multiple validations', () => {
      function validateName(name: string): Result<string, string> {
        return name.length > 0 ? Ok(name) : Err('Name required');
      }

      function validateAge(age: number): Result<number, string> {
        return age >= 0 ? Ok(age) : Err('Age must be non-negative');
      }

      const validations = [
        validateName('Alice'),
        map(validateAge(25), () => 'valid'),
      ];

      const combined = combine(validations);
      expect(combined.ok).toBe(true);
    });

    test('error recovery pattern', () => {
      function riskyOperation(): Result<number, string> {
        return Err('Operation failed');
      }

      const result = unwrapOr(riskyOperation(), 0);
      expect(result).toBe(0);
    });
  });
});

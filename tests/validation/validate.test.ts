/*
 * Tests for validation utilities (Valibot wrapper)
 * 
 * Coverage:
 * - validate() function with various schemas
 * - validateWith() custom error handling
 * - assert() throwing behavior
 * - Edge cases (null, undefined, nested validation)
 */

import { describe, test, expect } from 'vitest';
import * as v from 'valibot';
import { validate, validateWith, assert } from '../../src/validation/validate.js';
import { isOk, isErr } from '../../src/utils/Result.js';

describe('validate.ts', () => {
  describe('validate() - Successful Validation', () => {
    test('validates correct string data', () => {
      const schema = v.string();
      const result = validate(schema, 'hello');
      
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe('hello');
      }
    });

    test('validates correct number data', () => {
      const schema = v.number();
      const result = validate(schema, 42);
      
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe(42);
      }
    });

    test('validates correct object data', () => {
      const schema = v.object({
        name: v.string(),
        age: v.number(),
      });
      const data = { name: 'Alice', age: 30 };
      const result = validate(schema, data);
      
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toEqual({ name: 'Alice', age: 30 });
      }
    });

    test('validates array data', () => {
      const schema = v.array(v.string());
      const data = ['one', 'two', 'three'];
      const result = validate(schema, data);
      
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toEqual(['one', 'two', 'three']);
      }
    });

    test('validates nested objects', () => {
      const schema = v.object({
        user: v.object({
          name: v.string(),
          email: v.string(),
        }),
        metadata: v.object({
          created: v.number(),
        }),
      });
      const data = {
        user: { name: 'Bob', email: 'bob@test.com' },
        metadata: { created: 123456 },
      };
      const result = validate(schema, data);
      
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toEqual(data);
      }
    });

    test('validates optional fields', () => {
      const schema = v.object({
        required: v.string(),
        optional: v.optional(v.string()),
      });
      const data = { required: 'value' };
      const result = validate(schema, data);
      
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toEqual({ required: 'value' });
      }
    });
  });

  describe('validate() - Validation Failures', () => {
    test('returns error on type mismatch', () => {
      const schema = v.string();
      const result = validate(schema, 123);
      
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toContain('Validation failed');
      }
    });

    test('returns error on missing required field', () => {
      const schema = v.object({
        required: v.string(),
      });
      const result = validate(schema, {});
      
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error.message).toContain('Validation failed');
      }
    });

    test('returns error with field path for nested validation', () => {
      const schema = v.object({
        user: v.object({
          age: v.number(),
        }),
      });
      const result = validate(schema, { user: { age: 'not a number' } });
      
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error.message).toContain('Validation failed');
      }
    });

    test('includes validation message in error', () => {
      const schema = v.string();
      const result = validate(schema, null);
      
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error.message).toContain('Validation failed');
      }
    });

    test('handles multiple validation errors', () => {
      const schema = v.object({
        name: v.string(),
        age: v.number(),
        email: v.string(),
      });
      const result = validate(schema, {
        name: 123, // wrong type
        age: 'not a number', // wrong type
        // email missing
      });
      
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error.message).toContain('Validation failed');
      }
    });

    test('handles array validation errors', () => {
      const schema = v.array(v.number());
      const result = validate(schema, ['one', 'two', 'three']);
      
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error.message).toContain('Validation failed');
      }
    });
  });

  describe('validate() - Edge Cases', () => {
    test('handles null input', () => {
      const schema = v.string();
      const result = validate(schema, null);
      
      expect(isErr(result)).toBe(true);
    });

    test('handles undefined input', () => {
      const schema = v.string();
      const result = validate(schema, undefined);
      
      expect(isErr(result)).toBe(true);
    });

    test('handles empty object', () => {
      const schema = v.object({});
      const result = validate(schema, {});
      
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toEqual({});
      }
    });

    test('handles empty array', () => {
      const schema = v.array(v.string());
      const result = validate(schema, []);
      
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toEqual([]);
      }
    });

    test('handles deeply nested validation', () => {
      const schema = v.object({
        level1: v.object({
          level2: v.object({
            level3: v.object({
              value: v.string(),
            }),
          }),
        }),
      });
      const data = {
        level1: {
          level2: {
            level3: {
              value: 'deep',
            },
          },
        },
      };
      const result = validate(schema, data);
      
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toEqual(data);
      }
    });
  });

  describe('validateWith() - Custom Error Handling', () => {
    test('uses custom error function on failure', () => {
      const schema = v.string();
      const customError = 'CUSTOM_ERROR';
      const result = validateWith(
        schema,
        123,
        () => customError
      );
      
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe('CUSTOM_ERROR');
      }
    });

    test('passes issues to error function', () => {
      const schema = v.object({
        name: v.string(),
      });
      let capturedIssues: any[] = [];
      const result = validateWith(
        schema,
        { name: 123 },
        (issues) => {
          capturedIssues = issues;
          return 'ERROR';
        }
      );
      
      expect(isErr(result)).toBe(true);
      expect(capturedIssues.length).toBeGreaterThan(0);
    });

    test('returns Ok on successful validation', () => {
      const schema = v.string();
      const result = validateWith(
        schema,
        'valid',
        () => 'ERROR'
      );
      
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe('valid');
      }
    });

    test('allows custom error types', () => {
      interface CustomError {
        code: string;
        fields: string[];
      }
      
      const schema = v.object({
        name: v.string(),
        age: v.number(),
      });
      
      const result = validateWith(
        schema,
        { name: 'Alice' }, // missing age
        (issues): CustomError => ({
          code: 'VALIDATION_ERROR',
          fields: issues.map(i => i.path?.map(p => p.key).join('.') || 'root'),
        })
      );
      
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error.code).toBe('VALIDATION_ERROR');
        expect(result.error.fields).toContain('age');
      }
    });
  });

  describe('assert() - Throwing Behavior', () => {
    test('returns parsed value on success', () => {
      const schema = v.string();
      const result = assert(schema, 'hello');
      
      expect(result).toBe('hello');
    });

    test('throws on validation failure', () => {
      const schema = v.string();
      
      expect(() => {
        assert(schema, 123);
      }).toThrow();
    });

    test('throws with valibot error', () => {
      const schema = v.object({
        name: v.string(),
      });
      
      expect(() => {
        assert(schema, { name: 123 });
      }).toThrow(v.ValiError);
    });

    test('works with complex schemas', () => {
      const schema = v.object({
        id: v.string(),
        data: v.array(v.number()),
      });
      const data = { id: 'test', data: [1, 2, 3] };
      const result = assert(schema, data);
      
      expect(result).toEqual(data);
    });
  });

  describe('Integration - Real-world Schemas', () => {
    test('validates game save data structure', () => {
      const saveSchema = v.object({
        version: v.string(),
        timestamp: v.number(),
        battleIndex: v.number(),
        team: v.array(v.object({
          id: v.string(),
          name: v.string(),
          hp: v.number(),
        })),
      });
      
      const saveData = {
        version: '1.0',
        timestamp: Date.now(),
        battleIndex: 5,
        team: [
          { id: 'warrior1', name: 'Warrior', hp: 100 },
          { id: 'mage1', name: 'Mage', hp: 80 },
        ],
      };
      
      const result = validate(saveSchema, saveData);
      
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value.team).toHaveLength(2);
        expect(result.value.battleIndex).toBe(5);
      }
    });

    test('validates user input with constraints', () => {
      const inputSchema = v.object({
        username: v.pipe(v.string(), v.minLength(3), v.maxLength(20)),
        email: v.pipe(v.string(), v.email()),
        age: v.pipe(v.number(), v.minValue(13), v.maxValue(120)),
      });
      
      const validData = {
        username: 'player123',
        email: 'player@example.com',
        age: 25,
      };
      
      const result = validate(inputSchema, validData);
      
      expect(isOk(result)).toBe(true);
    });

    test('rejects invalid constrained input', () => {
      const inputSchema = v.object({
        username: v.pipe(v.string(), v.minLength(3)),
      });
      
      const invalidData = {
        username: 'ab', // too short
      };
      
      const result = validate(inputSchema, invalidData);
      
      expect(isErr(result)).toBe(true);
    });
  });
});

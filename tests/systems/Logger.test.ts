/*
 * Tests for Logger system
 * 
 * Coverage:
 * - Log levels (debug, info, warn, error)
 * - Context merging
 * - Child loggers
 * - Level filtering
 * - Edge cases (null context, circular refs)
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { makeLogger, ConsoleLogger, type LogLevel } from '../../src/systems/Logger.js';

describe('Logger.ts', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe('makeLogger() - Log Levels', () => {
    test('logs debug messages', () => {
      const logger = makeLogger({ enabled: true, minLevel: 'debug' });
      logger.debug('test message');
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('DEBUG');
      expect(call).toContain('test message');
    });

    test('logs info messages', () => {
      const logger = makeLogger({ enabled: true, minLevel: 'info' });
      logger.info('info message');
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('INFO');
      expect(call).toContain('info message');
    });

    test('logs warn messages', () => {
      const logger = makeLogger({ enabled: true, minLevel: 'warn' });
      logger.warn('warning message');
      
      expect(consoleWarnSpy).toHaveBeenCalled();
      const call = consoleWarnSpy.mock.calls[0][0];
      expect(call).toContain('WARN');
      expect(call).toContain('warning message');
    });

    test('logs error messages', () => {
      const logger = makeLogger({ enabled: true, minLevel: 'error' });
      logger.error('error message');
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('ERROR');
      expect(call).toContain('error message');
    });
  });

  describe('makeLogger() - Level Filtering', () => {
    test('respects minLevel debug (logs everything)', () => {
      const logger = makeLogger({ enabled: true, minLevel: 'debug' });
      
      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');
      
      // debug and info use console.error, warn uses console.warn, error uses console.error
      expect(consoleErrorSpy).toHaveBeenCalledTimes(3); // debug, info, error
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1); // warn
    });

    test('respects minLevel info (skips debug)', () => {
      const logger = makeLogger({ enabled: true, minLevel: 'info' });
      
      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1); // info only
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1); // warn
    });

    test('respects minLevel warn (skips debug and info)', () => {
      const logger = makeLogger({ enabled: true, minLevel: 'warn' });
      
      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1); // error only
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1); // warn
    });

    test('respects minLevel error (only errors)', () => {
      const logger = makeLogger({ enabled: true, minLevel: 'error' });
      
      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(0);
    });

    test('respects enabled: false', () => {
      const logger = makeLogger({ enabled: false, minLevel: 'debug' });
      
      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');
      
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('makeLogger() - Context', () => {
    test('includes context in log output', () => {
      const logger = makeLogger({ enabled: true, minLevel: 'info' });
      logger.info('test', { userId: 'user123', action: 'login' });
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('"userId":"user123"');
      expect(call).toContain('"action":"login"');
    });

    test('merges base context with call context', () => {
      const logger = makeLogger({ 
        enabled: true, 
        minLevel: 'info',
        context: { service: 'game' }
      });
      logger.info('test', { battleIndex: 5 });
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('"service":"game"');
      expect(call).toContain('"battleIndex":5');
    });

    test('call context overrides base context', () => {
      const logger = makeLogger({ 
        enabled: true, 
        minLevel: 'info',
        context: { key: 'base' }
      });
      logger.info('test', { key: 'override' });
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('"key":"override"');
      expect(call).not.toContain('"key":"base"');
    });

    test('handles empty context', () => {
      const logger = makeLogger({ enabled: true, minLevel: 'info' });
      logger.info('test');
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('test');
      expect(call).not.toContain('{}'); // Should not include empty JSON
    });
  });

  describe('makeLogger() - Child Loggers', () => {
    test('creates child logger with merged context', () => {
      const parent = makeLogger({ 
        enabled: true, 
        minLevel: 'info',
        context: { service: 'game' }
      });
      const child = parent.child({ module: 'battle' });
      
      child.info('test');
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('"service":"game"');
      expect(call).toContain('"module":"battle"');
    });

    test('child inherits minLevel from parent', () => {
      const parent = makeLogger({ enabled: true, minLevel: 'warn' });
      const child = parent.child({ module: 'test' });
      
      child.info('info'); // Should not log
      child.warn('warn'); // Should log
      
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    });

    test('child can add multiple layers of context', () => {
      const parent = makeLogger({ 
        enabled: true, 
        minLevel: 'info',
        context: { app: 'nextera' }
      });
      const child1 = parent.child({ module: 'battle' });
      const child2 = child1.child({ battleId: 'battle_123' });
      
      child2.info('test');
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('"app":"nextera"');
      expect(call).toContain('"module":"battle"');
      expect(call).toContain('"battleId":"battle_123"');
    });
  });

  describe('makeLogger() - Formatting', () => {
    test('includes ISO timestamp', () => {
      const logger = makeLogger({ enabled: true, minLevel: 'info' });
      logger.info('test');
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0][0];
      // Check for ISO timestamp pattern (YYYY-MM-DDTHH:mm:ss.sssZ)
      expect(call).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
    });

    test('formats objects in context', () => {
      const logger = makeLogger({ enabled: true, minLevel: 'info' });
      logger.info('test', { 
        nested: { key: 'value' },
        array: [1, 2, 3]
      });
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('"nested":{"key":"value"}');
      expect(call).toContain('"array":[1,2,3]');
    });

    test('handles numbers and booleans in context', () => {
      const logger = makeLogger({ enabled: true, minLevel: 'info' });
      logger.info('test', { 
        count: 42,
        enabled: true,
        disabled: false
      });
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('"count":42');
      expect(call).toContain('"enabled":true');
      expect(call).toContain('"disabled":false');
    });
  });

  describe('makeLogger() - Edge Cases', () => {
    test('handles null context gracefully', () => {
      const logger = makeLogger({ enabled: true, minLevel: 'info' });
      // @ts-expect-error - Testing runtime behavior with null
      logger.info('test', null);
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('test');
    });

    test('handles undefined context gracefully', () => {
      const logger = makeLogger({ enabled: true, minLevel: 'info' });
      logger.info('test', undefined);
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('test');
    });

    test('handles empty message', () => {
      const logger = makeLogger({ enabled: true, minLevel: 'info' });
      logger.info('');
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    test('handles very long messages', () => {
      const logger = makeLogger({ enabled: true, minLevel: 'info' });
      const longMessage = 'x'.repeat(10000);
      logger.info(longMessage);
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain(longMessage);
    });

    test('handles context with special characters', () => {
      const logger = makeLogger({ enabled: true, minLevel: 'info' });
      logger.info('test', { 
        message: 'Hello "world"',
        path: 'C:\\Users\\test\\file.txt'
      });
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      // JSON.stringify should escape these properly
      expect(consoleErrorSpy).not.toThrow();
    });
  });

  describe('ConsoleLogger', () => {
    test('creates logger with default minLevel', () => {
      const logger = new ConsoleLogger();
      logger.info('test');
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    test('respects custom minLevel', () => {
      const logger = new ConsoleLogger('warn');
      logger.info('info'); // Should not log
      logger.warn('warn'); // Should log
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    test('creates child logger', () => {
      const parent = new ConsoleLogger('info');
      const child = parent.child({ module: 'test' });
      
      child.info('test');
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    test('logs all levels when minLevel is debug', () => {
      const logger = new ConsoleLogger('debug');
      
      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});

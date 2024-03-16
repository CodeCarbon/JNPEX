const fs = require('fs');
const JNPEX = require('../index');
describe('JNPEX', () => {
  let db;

  beforeEach(() => {
    db = new JNPEX('test.json');
  });

  afterEach(() => {
    db.close();
    fs.unlinkSync('test.json');
  });

  describe('keyExists', () => {
    it('should return true if key exists', () => {
      db.cache = { name: 'John' };
      expect(db.keyExists('name')).toBe(true);
    });

    it('should return false if key does not exist', () => {
      db.cache = { name: 'John' };
      expect(db.keyExists('age')).toBe(false);
    });
  });

  describe('getAll', () => {
    it('should return all data', () => {
      db.cache = { name: 'John', age: 20 };
      expect(db.getAll()).toEqual({ name: 'John', age: 20 });
    });
  });

  describe('get', () => {
    it('should return value of the key', () => {
      db.cache = { name: 'John', age: 20 };
      expect(db.get('name')).toBe('John');
    });

    it('should return null if key does not exist', () => {
      db.cache = { name: 'John' };
      expect(db.get('age')).toBeNull();
    });
  });

  describe('erase', () => {
    it('should erase all data', () => {
      db.cache = { name: 'John', age: 20 };
      db.erase();
      expect(db.getAll()).toEqual({});
    });
  });

  describe('delete', () => {
    it('should delete key', () => {
      db.cache = { name: 'John', age: 20 };
      db.delete('name');
      expect(db.getAll()).toEqual({ age: 20 });
    });

    it('should throw error if key does not exist', () => {
      expect(() => db.delete('nonexistent')).toThrowError('Key does not exist.');
    });
  });

  describe('set', () => {
    it('should set key-value pair', () => {
      db.set('name', 'John');
      expect(db.getAll()).toEqual({ name: 'John' });
    });
  });

  describe('update', () => {
    it('should update key', () => {
      db.cache = { age: 20 };
      db.update('age', (val) => val + 1);
      expect(db.getAll()).toEqual({ age: 21 });
    });

    it('should throw error if key does not exist', () => {
      expect(() => db.update('nonexistent', () => {})).toThrowError('Key does not exist.');
    });
  });
});

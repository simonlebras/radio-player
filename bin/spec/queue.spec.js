'use strict';

var _queue = require('../queue');

var _queue2 = _interopRequireDefault(_queue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Queue', () => {
  beforeEach(function () {
    this.queue = new _queue2.default(new Array(20).fill({}));
  });

  it('should be able to set the initial index to -1', function () {
    expect(this.queue.currentIndex).toEqual(-1);
  });

  it('should be able to reset the current index to -1', function () {
    this.queue.currentIndex = 5;
    this.queue.reset();
    expect(this.queue.currentIndex).toEqual(-1);
  });

  it('should be able to validate an index', function () {
    expect(this.queue.isIndexValid(0)).toBeTruthy();
    expect(this.queue.isIndexValid(5)).toBeTruthy();
    expect(this.queue.isIndexValid(19)).toBeTruthy();
  });

  it('should not be able to validate an index', function () {
    expect(this.queue.isIndexValid(-1)).toBeFalsy();
    expect(this.queue.isIndexValid(20)).toBeFalsy();
  });

  it('should be able to return a radio', function () {
    expect(this.queue.getRadio(0)).toBeDefined();
    expect(this.queue.getRadio(19)).toBeDefined();
  });

  it('should not be able to return a radio', function () {
    expect(this.queue.getRadio(-1)).toBeUndefined();
    expect(this.queue.getRadio(20)).toBeUndefined();
  });

  it('should be able to return the current radio', function () {
    this.queue.currentIndex = 5;
    expect(this.queue.getCurrentRadio()).toBeDefined();
  });

  it('should not be able to return the current radio', function () {
    expect(this.queue.getCurrentRadio()).toBeUndefined();
  });

  it('should be able to move the current index backwards', function () {
    this.queue.prev();
    expect(this.queue.currentIndex).toEqual(0);

    this.queue.prev();
    expect(this.queue.currentIndex).toEqual(19);

    this.queue.currentIndex = 5;
    this.queue.prev();
    expect(this.queue.currentIndex).toEqual(4);
  });

  it('should be able to move the current index forwards', function () {
    this.queue.next();
    expect(this.queue.currentIndex).toEqual(0);

    this.queue.next();
    expect(this.queue.currentIndex).toEqual(1);

    this.queue.currentIndex = 19;
    this.queue.next();
    expect(this.queue.currentIndex).toEqual(0);
  });
});
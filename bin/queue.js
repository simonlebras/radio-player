"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** Default index. */
const defaultIndex = -1;

/**
 * Class representing the radio queue.
 */
class Queue {
  /**
   * Create a queue.
   * @param {Object[]} list of radios to add in the queue.
   */
  constructor(radios) {
    this.radios = radios;
    this.currentIndex = defaultIndex;
  }

  /**
   * Set the current index to the default value (-1).
   */
  reset() {
    this.currentIndex = defaultIndex;
  }

  /**
   * Check if the supplied index is within the queue range.
   * @param {number} index of the radio in the queue.
   * @returns {boolean} whether the index is valid or not.
   */
  isIndexValid(index) {
    return index >= 0 && index < this.radios.length;
  }

  /**
   * Get the radio corresponding to the supplied index.
   * @param {number} index of the radio in the queue.
   * @returns {Object} the radio in the queue.
   */
  getRadio(index) {
    return this.radios[index];
  }

  /**
   * Get the currently playing radio.
   * @returns {Object} the currently playing radio.
   */
  getCurrentRadio() {
    return this.getRadio(this.currentIndex);
  }

  /**
   * Increment the current index by 1.
   * If the new index is greater than the queue length, it is set to 0.
   */
  next() {
    if (this.isIndexValid(this.currentIndex)) {
      this.currentIndex = (this.currentIndex + 1) % this.radios.length;
    } else {
      this.currentIndex = 0;
    }
  }

  /**
   * Decrement the current index by 1.
   * If the new index is lower than 0, it is set to 0.
   */
  prev() {
    if (this.isIndexValid(this.currentIndex)) {
      this.currentIndex -= 1;
      if (this.currentIndex < 0) {
        this.currentIndex = this.radios.length - 1;
      }
    } else {
      this.currentIndex = 0;
    }
  }
}

exports.default = Queue;
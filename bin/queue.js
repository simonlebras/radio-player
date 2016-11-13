"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const invalidIndex = -1;

class Queue {
  constructor(radios) {
    this.radios = radios;
    this.currentIndex = invalidIndex;
  }

  reset() {
    this.currentIndex = invalidIndex;
  }

  isIndexValid(index) {
    return index >= 0 && index < this.radios.length;
  }

  getRadio(index) {
    return this.radios[index];
  }

  getCurrentRadio() {
    return this.getRadio(this.currentIndex);
  }

  next() {
    if (this.isIndexValid(this.currentIndex)) {
      this.currentIndex = (this.currentIndex + 1) % this.radios.length;
    } else {
      this.currentIndex = 0;
    }
  }

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
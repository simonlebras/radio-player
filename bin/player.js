'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _playSound = require('play-sound');

var _playSound2 = _interopRequireDefault(_playSound);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const baseDelimiter = 'radio-player';

class Player {
  constructor(queue, players, vorpal) {
    this.queue = queue;
    this.players = players;
    this.vorpal = vorpal;
    this.playing = false;
  }

  play(id, player) {
    if (typeof id !== 'undefined') {
      const index = this.extractIndexFromId(id);
      if (this.isPlayable(index)) {
        this.queue.currentIndex = index;
      } else {
        throw new Error('Invalid radio');
      }
    } else if (!this.isPlayable(this.queue.currentIndex)) {
      throw new Error('No radio playing');
    }

    if (typeof player !== 'undefined' && !this.isPlayerValid(player)) {
      throw new Error('Invalid player');
    }

    this.pause(false);

    const radioStream = this.getCurrentRadio().stream;
    this.audio = (0, _playSound2.default)({ players: this.players, player }).play(radioStream);

    this.playing = true;

    this.update();
  }

  resume() {
    if (!this.playing && this.queue.isIndexValid(this.queue.currentIndex)) {
      this.play();
    }
  }

  pause(update) {
    if (this.playing) {
      if (this.audio != null) {
        this.audio.kill();
      }
      this.audio = null;
      this.playing = false;
    }

    if (update) {
      this.update();
    }
  }

  stop() {
    this.queue.reset();
    this.pause(true);
  }

  reload() {
    if (this.queue.isIndexValid(this.queue.currentIndex)) {
      this.play();
    }
  }

  next() {
    this.queue.next();
    this.play();
  }

  prev() {
    this.queue.prev();
    this.play();
  }

  getCurrentRadio() {
    return this.queue.getCurrentRadio();
  }

  getRadioIds() {
    return this.queue.radios.map(radio => radio.id);
  }

  isPlayable(index) {
    return this.queue.isIndexValid(index);
  }

  isPlayerValid(player) {
    return this.players.indexOf(player) !== -1;
  }

  extractIndexFromId(id) {
    if (!isNaN(id)) {
      return parseInt(id, 10) - 1;
    }
    return this.queue.radios.findIndex(radio => radio.id.startsWith(id));
  }

  listRadios() {
    this.queue.radios.forEach((radio, index) => {
      const params = {
        index: _chalk2.default.white(index + 1),
        name: _chalk2.default.cyan(radio.name),
        id: _chalk2.default.gray(`${ radio.id }`),
        description: _chalk2.default.green(`   ${ radio.description }`)
      };

      this.vorpal.log(`${ params.index }. ${ params.name } [${ params.id }]`);
      this.vorpal.log(`${ params.description }`);
    });
  }

  listPlayers() {
    this.players.forEach((player, index) => {
      const params = {
        index: _chalk2.default.white(index + 1),
        player: _chalk2.default.cyan(player)
      };

      this.vorpal.log(`${ params.index }. ${ params.player } `);
    });
  }

  showInfo(id) {
    let index;
    if (typeof id !== 'undefined') {
      index = this.extractIndexFromId(id);
      if (!this.isPlayable(index)) {
        throw new Error('Invalid radio');
      }
    } else {
      throw new Error('Invalid argument: id');
    }

    this.showRadio(index);
  }

  showCurrent() {
    const radio = this.getCurrentRadio();
    if (typeof radio !== 'undefined') {
      this.showRadio(this.queue.currentIndex);
    } else {
      this.vorpal.log(_chalk2.default.red('No radio playing'));
    }
  }

  showRadio(index) {
    const radio = this.queue.getRadio(index);

    const params = {
      index: _chalk2.default.white(index + 1),
      name: _chalk2.default.cyan(radio.name),
      id: _chalk2.default.gray(`${ radio.id }`),
      description: `${ _chalk2.default.green('   Description:') } ${ _chalk2.default.grey(radio.description) }`,
      website: `${ _chalk2.default.green('   Website:') } ${ _chalk2.default.grey(radio.website) }`,
      facebook: `${ _chalk2.default.green('   Facebook:') } ${ _chalk2.default.grey(radio.facebook) }`,
      twitter: `${ _chalk2.default.green('   Twitter:') } ${ _chalk2.default.grey(radio.twitter) }`,
      stream: `${ _chalk2.default.green('   Stream:') } ${ _chalk2.default.grey(radio.stream) }`
    };

    this.vorpal.log(`${ params.index }. ${ params.name } [${ params.id }]`);
    this.vorpal.log(`${ params.description }`);
    this.vorpal.log(`${ params.website }`);
    this.vorpal.log(`${ params.facebook }`);
    this.vorpal.log(`${ params.twitter }`);
    this.vorpal.log(`${ params.stream }`);
  }

  show() {
    this.vorpal.delimiter(`${ baseDelimiter }$`).show();
  }

  update() {
    let delimiter;
    const radio = this.getCurrentRadio();
    if (typeof radio !== 'undefined') {
      let status;
      if (_os2.default.platform() === 'win32') {
        status = this.playing ? '>' : 'll';
      } else {
        status = this.playing ? '\u25B6' : '\u23F8';
      }

      const params = {
        radio: _chalk2.default.cyan(radio.name),
        status: _chalk2.default.green(status)
      };

      delimiter = `${ baseDelimiter }[${ params.radio } ${ params.status }]$`;
    } else {
      delimiter = `${ baseDelimiter }$`;
    }

    this.vorpal.delimiter(delimiter);
    this.vorpal.ui.refresh();
  }
}
exports.default = Player;
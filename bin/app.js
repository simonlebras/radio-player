'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.player = exports.vorpal = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _vorpal = require('vorpal');

var _vorpal2 = _interopRequireDefault(_vorpal);

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

var _queue = require('./queue');

var _queue2 = _interopRequireDefault(_queue);

var _radios = require('./radios.json');

var _radios2 = _interopRequireDefault(_radios);

var _players = require('./players.json');

var _players2 = _interopRequireDefault(_players);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const vorpal = (0, _vorpal2.default)();
const player = new _player2.default(new _queue2.default(_radios2.default), _players2.default, vorpal);

// Add 'play' command to Vorpal.
vorpal.command('play [radio]', 'Play radio in the queue').autocomplete({
  data: (input, callback) => {
    callback(player.getRadioIds());
  }
}).option('-p, --player <player>', 'Player to use', _players2.default).validate(args => {
  if (typeof args.radio !== 'undefined') {
    if (!player.isPlayable(player.extractIndexFromId(args.radio))) {
      return _chalk2.default.red('Invalid radio');
    }
  } else if (player.getCurrentRadio() == null) {
    return _chalk2.default.red('No radio playing');
  } else if (player.playing) {
    return false;
  }

  if (typeof args.options.player !== 'undefined' && !player.isPlayerValid(args.options.player)) {
    return _chalk2.default.red('Invalid player');
  }

  return true;
}).action((args, callback) => {
  player.play(args.radio, args.options.player);
  callback();
});

// Add 'pause' command to Vorpal.
vorpal.command('pause', 'Pause current radio').action((args, callback) => {
  player.pause(true);
  callback();
});

// Add 'resume' command to Vorpal.
vorpal.command('resume', 'Resume current radio').action((args, callback) => {
  player.resume();
  callback();
});

// Add 'stop' command to Vorpal.
vorpal.command('stop', 'Stop current radio').action((args, callback) => {
  player.stop();
  callback();
});

// Add 'reload' command to Vorpal.
vorpal.command('reload', 'Reload current radio').action((args, callback) => {
  player.reload();
  callback();
});

// Add 'prev' command to Vorpal.
vorpal.command('prev', 'Play previous radio in the queue').action((args, callback) => {
  player.prev();
  callback();
});

// Add 'next' command to Vorpal.
vorpal.command('next', 'Play next radio in the queue').action((args, callback) => {
  player.next();
  callback();
});

// Add 'current' command to Vorpal.
vorpal.command('current', 'Print currently playing radio').action((args, callback) => {
  player.showCurrent();
  callback();
});

// Add 'radios' command to Vorpal.
vorpal.command('radios', 'List radios').action((args, callback) => {
  player.listRadios();
  callback();
});

// Add 'players' command to Vorpal.
vorpal.command('players', 'List compatible players').action((args, callback) => {
  player.listPlayers();
  callback();
});

// Add 'info' command to Vorpal.
vorpal.command('info <radio>', 'Print radio info').autocomplete({
  data: (input, callback) => {
    callback(player.getRadioIds());
  }
}).validate(args => {
  if (!player.isPlayable(player.extractIndexFromId(args.radio))) {
    return _chalk2.default.red('Invalid radio');
  }
  return true;
}).action((args, callback) => {
  player.showInfo(args.radio);
  callback();
});

// Add 'version' command to Vorpal.
vorpal.command('version', 'Print Radio Player version').action((args, callback) => {
  vorpal.log(_chalk2.default.cyan(_package2.default.version));
  callback();
});

// Show prompt.
player.show();

exports.vorpal = vorpal;
exports.player = player;
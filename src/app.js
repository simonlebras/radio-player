import chalk from 'chalk';
import vorp from 'vorpal';
import Player from './player';
import Queue from './queue';
import radios from './radios.json';
import players from './players.json';
import packageJson from '../package.json';

const vorpal = vorp();
const player = new Player(new Queue(radios), players, vorpal);

// Add 'play' command to Vorpal.
vorpal.command('play [radio]', 'Play radio in the queue')
  .autocomplete({
    data: (input, callback) => {
      callback(player.getRadioIds());
    },
  })
  .option('-p, --player <player>', 'Player to use', players)
  .validate((args) => {
    if (typeof args.radio !== 'undefined') {
      if (!player.isPlayable(player.extractIndexFromId(args.radio))) {
        return chalk.red(('Invalid radio'));
      }
    } else if (player.getCurrentRadio() == null) {
      return chalk.red('No radio playing');
    } else if (player.playing) {
      return false;
    }

    if (typeof args.options.player !== 'undefined' && !player.isPlayerValid(args.options.player)) {
      return chalk.red('Invalid player');
    }

    return true;
  })
  .action((args, callback) => {
    player.play(args.radio, args.options.player);
    callback();
  });

// Add 'pause' command to Vorpal.
vorpal.command('pause', 'Pause current radio')
  .action((args, callback) => {
    player.pause(true);
    callback();
  });

// Add 'resume' command to Vorpal.
vorpal.command('resume', 'Resume current radio')
  .action((args, callback) => {
    player.resume();
    callback();
  });

// Add 'stop' command to Vorpal.
vorpal.command('stop', 'Stop current radio')
  .action((args, callback) => {
    player.stop();
    callback();
  });

// Add 'reload' command to Vorpal.
vorpal.command('reload', 'Reload current radio')
  .action((args, callback) => {
    player.reload();
    callback();
  });

// Add 'prev' command to Vorpal.
vorpal.command('prev', 'Play previous radio in the queue')
  .action((args, callback) => {
    player.prev();
    callback();
  });

// Add 'next' command to Vorpal.
vorpal.command('next', 'Play next radio in the queue')
  .action((args, callback) => {
    player.next();
    callback();
  });

// Add 'current' command to Vorpal.
vorpal.command('current', 'Print currently playing radio')
  .action((args, callback) => {
    player.showCurrent();
    callback();
  });

// Add 'radios' command to Vorpal.
vorpal.command('radios', 'List radios')
  .action((args, callback) => {
    player.listRadios();
    callback();
  });

// Add 'players' command to Vorpal.
vorpal.command('players', 'List compatible players')
  .action((args, callback) => {
    player.listPlayers();
    callback();
  });

// Add 'info' command to Vorpal.
vorpal.command('info <radio>', 'Print radio info')
  .autocomplete({
    data: (input, callback) => {
      callback(player.getRadioIds());
    },
  })
  .validate((args) => {
    if (!player.isPlayable(player.extractIndexFromId(args.radio))) {
      return chalk.red('Invalid radio');
    }
    return true;
  })
  .action((args, callback) => {
    player.showInfo(args.radio);
    callback();
  });

// Add 'version' command to Vorpal.
vorpal.command('version', 'Print Radio Player version')
  .action((args, callback) => {
    vorpal.log(chalk.cyan(packageJson.version));
    callback();
  });

// Show prompt.
player.show();

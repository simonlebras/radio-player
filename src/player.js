import os from 'os';
import chalk from 'chalk';
import playSound from 'play-sound';

const baseDelimiter = 'radio-player';

export default class Player {
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
    this.audio = playSound({ players: this.players, player }).play(radioStream);

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
        index: chalk.white(index + 1),
        name: chalk.cyan(radio.name),
        id: chalk.gray(`${radio.id}`),
        description: chalk.green(`   ${radio.description}`),
      };

      this.vorpal.log(`${params.index}. ${params.name} [${params.id}]`);
      this.vorpal.log(`${params.description}`);
    });
  }

  listPlayers() {
    this.players.forEach((player, index) => {
      const params = {
        index: chalk.white(index + 1),
        player: chalk.cyan(player),
      };

      this.vorpal.log(`${params.index}. ${params.player} `);
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
      this.vorpal.log(chalk.red('No radio playing'));
    }
  }

  showRadio(index) {
    const radio = this.queue.getRadio(index);

    const params = {
      index: chalk.white(index + 1),
      name: chalk.cyan(radio.name),
      id: chalk.gray(`${radio.id}`),
      description: `${chalk.green('   Description:')} ${chalk.grey(radio.description)}`,
      website: `${chalk.green('   Website:')} ${chalk.grey(radio.website)}`,
      facebook: `${chalk.green('   Facebook:')} ${chalk.grey(radio.facebook)}`,
      twitter: `${chalk.green('   Twitter:')} ${chalk.grey(radio.twitter)}`,
      stream: `${chalk.green('   Stream:')} ${chalk.grey(radio.stream)}`,
    };

    this.vorpal.log(`${params.index}. ${params.name} [${params.id}]`);
    this.vorpal.log(`${params.description}`);
    this.vorpal.log(`${params.website}`);
    this.vorpal.log(`${params.facebook}`);
    this.vorpal.log(`${params.twitter}`);
    this.vorpal.log(`${params.stream}`);
  }

  show() {
    this.vorpal.delimiter(`${baseDelimiter}$`).show();
  }

  update() {
    let delimiter;
    const radio = this.getCurrentRadio();
    if (typeof radio !== 'undefined') {
      let status;
      if (os.platform() === 'win32') {
        status = this.playing ? '>' : 'll';
      } else {
        status = this.playing ? '\u25B6' : '\u23F8';
      }

      const params = {
        radio: chalk.cyan(radio.name),
        status: chalk.green(status),
      };

      delimiter = `${baseDelimiter}[${params.radio} ${params.status}]$`;
    } else {
      delimiter = `${baseDelimiter}$`;
    }

    this.vorpal.delimiter(delimiter);
    this.vorpal.ui.refresh();
  }
}

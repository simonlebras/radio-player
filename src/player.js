import os from 'os';
import chalk from 'chalk';
import playSound from 'play-sound';

/** Default delimiter */
const baseDelimiter = 'radio-player';

/**
 * Class representing the audio player.
 */
class Player {
  /**
   * Create an audio player.
   * @param {Object} radio queue.
   * @param {string[]} list of compatible players.
   * @param {Object} Vorpal.
   */
  constructor(queue, players, vorpal) {
    this.queue = queue;
    this.players = players;
    this.vorpal = vorpal;
    this.playing = false;
  }

  /**
   * Play a radio with a player.
   * @param {string|number} id of the radio.
   * @param {string} player to use.
   * @throws Will throw an Error if the id is invalid or if the player is invalid.
   */
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

  /**
   * Resume the current radio.
   */
  resume() {
    if (!this.playing && this.queue.isIndexValid(this.queue.currentIndex)) {
      this.play();
    }
  }

  /**
   * Pause the current radio.
   * @param {boolean} whether the prompt should be updated or not.
   */
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

  /**
   * Stop the current radio.
   */
  stop() {
    this.queue.reset();
    this.pause(true);
  }

  /**
   * Reload the current radio.
   */
  reload() {
    if (this.queue.isIndexValid(this.queue.currentIndex)) {
      this.play();
    }
  }

  /**
   * Play the previous radio in the queue.
   */
  prev() {
    this.queue.prev();
    this.play();
  }

  /**
   * Play the next radio in the queue.
   */
  next() {
    this.queue.next();
    this.play();
  }

  /**
   * Get the currently playing radio.
   * @returns {Object} the currently playing radio.
   */
  getCurrentRadio() {
    return this.queue.getCurrentRadio();
  }

  /**
   * Get the list of radio ids in the queue.
   * @returns {string[]} list of radio ids in the queue.
   */
  getRadioIds() {
    return this.queue.radios.map(radio => radio.id);
  }

  /**
   * Check if the supplied index corresponds to a valid radio in the queue.
   * @param {number} index of the radio in the queue.
   * @returns {boolean} whether the index is valid or not.
  */
  isPlayable(index) {
    return this.queue.isIndexValid(index);
  }

  /**
   * Check if a player is compatible.
   * @param {string} name of the player.
   * @returns {boolean} whether the player is valid or not.
   */
  isPlayerValid(player) {
    return this.players.indexOf(player) !== -1;
  }

  /**
   * Get the index of a radio in queue.
   * @param {string|number} id of the radio.
   * @returns {number} index of the radio in the queue (-1 if the id is invalid).
   */
  extractIndexFromId(id) {
    if (!isNaN(id)) {
      return parseInt(id, 10) - 1;
    }
    return this.queue.radios.findIndex(radio => radio.id.startsWith(id));
  }

  /**
   * Print the list of radios in the queue.
   */
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

  /**
   * Print the list of compatible players.
   */
  listPlayers() {
    this.players.forEach((player, index) => {
      const params = {
        index: chalk.white(index + 1),
        player: chalk.cyan(player),
      };

      this.vorpal.log(`${params.index}. ${params.player} `);
    });
  }

  /**
   * Print the info of a radio.
   * @param {string|number} id of the radio.
   * @throws Will throw an Error if the id is invalid.
   */
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

  /**
   * Print the info of the currently playing radio.
   */
  showCurrent() {
    const radio = this.getCurrentRadio();
    if (typeof radio !== 'undefined') {
      this.showRadio(this.queue.currentIndex);
    } else {
      this.vorpal.log(chalk.red('No radio playing'));
    }
  }

  /**
   * Print the info of a radio.
   * @param {number} index of the radio in the queue.
   */
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

  /**
   * Print the default prompt.
   */
  show() {
    this.vorpal.delimiter(`${baseDelimiter}$`).show();
  }

  /**
   * Update the prompt.
   */
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

export default Player;

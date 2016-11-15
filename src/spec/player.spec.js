import Player from '../player';
import Queue from '../queue';

describe('Player', () => {
  beforeEach(function () {
    const radios = Array(...Array(20)).map(() => ({}));
    const players = new Array(20).fill('');
    this.player = new Player(new Queue(radios), players, jasmine.createSpyObj('vorpal', ['log']));
  });

  it('should be able to play with a valid index', function () {
    spyOn(this.player, 'pause');
    spyOn(this.player, 'update');
    this.player.play(5);
    expect(this.player.pause).toHaveBeenCalledWith(false);
    expect(this.player.playing).toBeTruthy();
    expect(this.player.update).toHaveBeenCalled();
  });

  it('should be able to play with a valid id', function () {
    spyOn(this.player, 'pause');
    spyOn(this.player, 'update');
    this.player.queue.radios = Array(...Array(20)).map(() => ({ id: '' }));
    this.player.queue.radios[5].id = 'rmc';
    this.player.play('rmc');
    expect(this.player.pause).toHaveBeenCalledWith(false);
    expect(this.player.playing).toBeTruthy();
    expect(this.player.update).toHaveBeenCalled();
  });

  it('should be able to play without an index', function () {
    spyOn(this.player, 'pause');
    spyOn(this.player, 'update');
    this.player.queue.currentIndex = 5;
    this.player.play();
    expect(this.player.pause).toHaveBeenCalledWith(false);
    expect(this.player.playing).toBeTruthy();
    expect(this.player.update).toHaveBeenCalled();
  });

  it('should be able to play with a valid player', function () {
    spyOn(this.player, 'pause');
    spyOn(this.player, 'update');
    this.player.players[5] = 'mplayer';
    this.player.queue.currentIndex = 5;
    this.player.play(undefined, 'mplayer');
    expect(this.player.pause).toHaveBeenCalledWith(false);
    expect(this.player.playing).toBeTruthy();
    expect(this.player.update).toHaveBeenCalled();
  });

  it('should be able to play with both a valid index and a valid player', function () {
    spyOn(this.player, 'pause');
    spyOn(this.player, 'update');
    this.player.players[5] = 'mplayer';
    this.player.play(5, 'mplayer');
    expect(this.player.pause).toHaveBeenCalledWith(false);
    expect(this.player.playing).toBeTruthy();
    expect(this.player.update).toHaveBeenCalled();
  });

  it('should be able to play with both a valid id and a valid player', function () {
    spyOn(this.player, 'pause');
    spyOn(this.player, 'update');
    this.player.players[5] = 'mplayer';
    this.player.queue.radios = Array(...Array(20)).map(() => ({ id: '' }));
    this.player.queue.radios[5].id = 'rmc';
    this.player.play('rmc', 'mplayer');
    expect(this.player.pause).toHaveBeenCalledWith(false);
    expect(this.player.playing).toBeTruthy();
    expect(this.player.update).toHaveBeenCalled();
  });

  it('should not be able to play with an invalid index', function () {
    expect(this.player.play.bind(this.player, -1)).toThrowError(Error);
    expect(this.player.play.bind(this.player, 21)).toThrowError(Error);
  });

  it('should not be able to play with an invalid id', function () {
    expect(this.player.play.bind(this.player, '')).toThrowError(Error);
    expect(this.player.play.bind(this.player, 'rmc')).toThrowError(Error);
  });

  it('should not be able to play without an index', function () {
    expect(this.player.play.bind(this.player)).toThrowError(Error);
  });

  it('should not be able to play with an invalid player', function () {
    this.player.queue.radios = Array(...Array(20)).map(() => ({ id: '' }));
    this.player.queue.radios[5].id = 'rmc';
    expect(this.player.play.bind(this.player, 'rmc', 'mplayer')).toThrowError(Error);
  });

  it('should not be able to play with both an invalid index and an invalid player', function () {
    expect(this.player.play.bind(this.player, -1, 'mplayer')).toThrowError(Error);
    expect(this.player.play.bind(this.player, 21, 'mplayer')).toThrowError(Error);
  });

  it('should not be able to play with both an invalid id and an invalid player', function () {
    expect(this.player.play.bind(this.player, 'rmc', 'mplayer')).toThrowError(Error);
  });

  it('should be able to resume the current radio', function () {
    spyOn(this.player, 'play');
    this.player.playing = false;
    this.player.queue.currentIndex = 5;
    this.player.resume();
    expect(this.player.play).toHaveBeenCalled();
  });

  it('should not be to resume the current radio if it is already playing', function () {
    spyOn(this.player, 'play');
    this.player.queue.currentIndex = 5;
    this.player.playing = true;
    this.player.resume();
    expect(this.player.play).not.toHaveBeenCalled();
  });

  it('should not be to resume the current radio if there is no current radio', function () {
    spyOn(this.player, 'play');
    this.player.queue.currentIndex = -1;
    this.player.playing = false;
    this.player.resume();
    expect(this.player.play).not.toHaveBeenCalled();
  });

  it('should be able to pause the current radio and update the prompt', function () {
    spyOn(this.player, 'update');
    this.player.playing = true;
    this.player.pause(true);
    expect(this.player.audio).toBeUndefined();
    expect(this.player.playing).toBeFalsy();
    expect(this.player.update).toHaveBeenCalled();
  });

  it('should be able to pause the current radio and kill audio', function () {
    spyOn(this.player, 'update');
    const audioSpy = jasmine.createSpyObj('audio', ['kill']);
    this.player.audio = audioSpy;
    this.player.playing = true;
    this.player.pause(true);
    expect(audioSpy.kill).toHaveBeenCalled();
    expect(this.player.audio).toBeUndefined();
    expect(this.player.playing).toBeFalsy();
    expect(this.player.update).toHaveBeenCalled();
  });

  it('should be able to pause the current radio without updating the prompt', function () {
    spyOn(this.player, 'update');
    this.player.playing = true;
    this.player.pause(false);
    expect(this.player.audio).toBeUndefined();
    expect(this.player.playing).toBeFalsy();
    expect(this.player.update).not.toHaveBeenCalled();
  });

  it('should not be able to pause the current radio but to update the prompt', function () {
    spyOn(this.player, 'update');
    const audioSpy = jasmine.createSpyObj('audio', ['kill']);
    this.player.audio = audioSpy;
    this.player.pause(false);
    expect(audioSpy.kill).not.toHaveBeenCalled();
    expect(this.player.update).not.toHaveBeenCalled();
  });

  it('should not be able to pause the current radio and update the prompt', function () {
    spyOn(this.player, 'update');
    const audioSpy = jasmine.createSpyObj('audio', ['kill']);
    this.player.audio = audioSpy;
    this.player.pause(true);
    expect(audioSpy.kill).not.toHaveBeenCalled();
    expect(this.player.update).toHaveBeenCalled();
  });

  it('should be able to stop the current radio', function () {
    spyOn(this.player, 'pause');
    this.player.stop();
    expect(this.player.queue.currentIndex).toEqual(-1);
    expect(this.player.pause).toHaveBeenCalledWith(true);
  });

  it('should be able to reload the current radio', function () {
    spyOn(this.player, 'play');
    this.player.queue.currentIndex = 5;
    this.player.reload();
    expect(this.player.play).toHaveBeenCalled();
  });

  it('should not be able to reload the current radio', function () {
    spyOn(this.player, 'play');
    this.player.reload();
    expect(this.player.play).not.toHaveBeenCalled();
  });

  it('should be able to play the previous radio in the queue', function () {
    spyOn(this.player, 'play');
    spyOn(this.player.queue, 'prev').and.callThrough();

    this.player.prev();
    expect(this.player.queue.prev).toHaveBeenCalled();
    expect(this.player.queue.currentIndex).toEqual(0);

    this.player.prev();
    expect(this.player.queue.currentIndex).toEqual(19);

    expect(this.player.play.calls.count()).toEqual(2);
  });

  it('should be able to play the next radio in the queue', function () {
    spyOn(this.player, 'play');
    spyOn(this.player.queue, 'next').and.callThrough();

    this.player.next();
    expect(this.player.queue.next).toHaveBeenCalled();
    expect(this.player.queue.currentIndex).toEqual(0);

    this.player.next();
    expect(this.player.queue.currentIndex).toEqual(1);

    expect(this.player.play.calls.count()).toEqual(2);
  });

  it('should be able to get the current radio', function () {
    this.player.queue.currentIndex = 5;
    expect(this.player.getCurrentRadio()).toBeDefined();
  });

  it('should be not able to get the current radio', function () {
    expect(this.player.getCurrentRadio()).toBeUndefined();
  });

  it('should be not able to get the list of radio ids', function () {
    this.player.queue.radios[5].id = 'rmc';
    expect(this.player.getRadioIds()).toEqual(jasmine.any(Array));
    expect(this.player.getRadioIds()).toContain('rmc');
  });

  it('should be able to validate an index', function () {
    expect(this.player.isPlayable(0)).toBeTruthy();
    expect(this.player.isPlayable(5)).toBeTruthy();
    expect(this.player.isPlayable(19)).toBeTruthy();
  });

  it('should not be able to validate an index', function () {
    expect(this.player.isPlayable(-1)).toBeFalsy();
    expect(this.player.isPlayable(20)).toBeFalsy();
    expect(this.player.isPlayable(undefined)).toBeFalsy();
    expect(this.player.isPlayable('rmc')).toBeFalsy();
  });

  it('should be able to validate a player', function () {
    this.player.players[5] = 'mplayer';
    expect(this.player.isPlayerValid('mplayer')).toBeTruthy();
  });

  it('should not be able to validate a player', function () {
    expect(this.player.isPlayerValid('mplayer')).toBeFalsy();
    expect(this.player.isPlayerValid(undefined)).toBeFalsy();
  });

  it('should be able to extract an index', function () {
    expect(this.player.extractIndexFromId(20)).toEqual(19);

    this.player.queue.radios = Array(...Array(20)).map(() => ({ id: '' }));
    this.player.queue.radios[5].id = 'rmc';
    expect(this.player.extractIndexFromId('rmc')).toEqual(5);
  });

  it('should not be able to extract an index', function () {
    this.player.queue.radios = Array(...Array(20)).map(() => ({ id: '' }));
    expect(this.player.extractIndexFromId('rmc')).toEqual(-1);
    expect(this.player.extractIndexFromId(undefined)).toEqual(-1);
  });

  it('should be able to show the radio list', function () {
    this.player.listRadios();
    expect(this.player.vorpal.log).toHaveBeenCalled();
  });

  it('should not be able to show the radio list', function () {
    this.player.queue.radios = [];
    this.player.listRadios();
    expect(this.player.vorpal.log).not.toHaveBeenCalled();
  });

  it('should be able to show the player list', function () {
    this.player.listPlayers();
    expect(this.player.vorpal.log).toHaveBeenCalled();
  });

  it('should not be able to show the player list', function () {
    this.player.players = [];
    this.player.listPlayers();
    expect(this.player.vorpal.log).not.toHaveBeenCalled();
  });

  it('should be able to show the info of a radio with a valid index', function () {
    spyOn(this.player, 'showRadio');
    this.player.showInfo(5);
    expect(this.player.showRadio).toHaveBeenCalledWith(4);
  });

  it('should be able to show the info of a radio with a valid id', function () {
    spyOn(this.player, 'showRadio');
    this.player.queue.radios = Array(...Array(20)).map(() => ({ id: '' }));
    this.player.queue.radios[5].id = 'rmc';
    this.player.showInfo('rmc');
    expect(this.player.showRadio).toHaveBeenCalledWith(5);
  });

  it('should not be able to show the info of a radio without an index', function () {
    expect(this.player.showInfo).toThrowError(Error);
  });

  it('should not be able to show the info of a radio with an invalid index', function () {
    expect(this.player.showInfo.bind(this.player, -1)).toThrowError(Error);
    expect(this.player.showInfo.bind(this.player, 21)).toThrowError(Error);
    expect(this.player.showInfo.bind(this.player, undefined)).toThrowError(Error);
  });

  it('should not be able to show the info of a radio with an invalid id', function () {
    expect(this.player.showInfo.bind(this.player, 'rmc')).toThrowError(Error);
    expect(this.player.showInfo.bind(this.player, undefined)).toThrowError(Error);
  });

  it('should be able to show the info of the current radio', function () {
    spyOn(this.player, 'showRadio');
    this.player.queue.currentIndex = 5;
    expect(this.player.getCurrentRadio()).toBeDefined();
    this.player.showCurrent();
    expect(this.player.showRadio).toHaveBeenCalled();
  });

  it('should not be able to show the info of the current radio', function () {
    spyOn(this.player, 'showRadio');
    expect(this.player.getCurrentRadio()).toBeUndefined();
    this.player.showCurrent();
    expect(this.player.showRadio).not.toHaveBeenCalled();
    expect(this.player.vorpal.log).toHaveBeenCalled();
  });

  it('should be able to show a radio with a valid index', function () {
    this.player.showRadio(5);
    expect(this.player.vorpal.log).toHaveBeenCalled();
  });

  it('should not be able to show a radio with an invalid index', function () {
    this.player.showRadio(-1);
    this.player.showRadio(20);
    this.player.showRadio(undefined);
    expect(this.player.vorpal.log).not.toHaveBeenCalled();
  });
});

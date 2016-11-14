'use strict';

var _app = require('../app');

var _queue = require('../queue');

var _queue2 = _interopRequireDefault(_queue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Radio Player', () => {
  beforeEach(function () {
    _app.player.queue = new _queue2.default(new Array(20).fill({}));
    _app.player.players = new Array(20).fill('');
    _app.player.playing = false;
  });

  it('should be able to play a radio with a valid index', function (done) {
    spyOn(_app.player, 'play');
    _app.vorpal.exec('play 5', err => {
      expect(err).toBeUndefined();
      expect(_app.player.play).toHaveBeenCalledWith(5, undefined);
      done();
    });
  });

  it('should be able to play a radio without an index', function (done) {
    spyOn(_app.player, 'play');
    _app.player.queue.currentIndex = 5;
    _app.vorpal.exec('play ', err => {
      expect(err).toBeUndefined();
      expect(_app.player.play).toHaveBeenCalledWith(undefined, undefined);
      done();
    });
  });

  it('should be able to play a radio with a valid player', function (done) {
    spyOn(_app.player, 'play');
    _app.player.queue.currentIndex = 5;
    _app.player.players = ['mplayer'];
    _app.vorpal.exec('play -p mplayer', err => {
      expect(err).toBeUndefined();
      expect(_app.player.play).toHaveBeenCalledWith(undefined, 'mplayer');
      done();
    });
  });

  it('should be able to play a radio with both a valid index and a valid player', function (done) {
    spyOn(_app.player, 'play');
    _app.player.players = ['mplayer'];
    _app.vorpal.exec('play 5 -p mplayer', err => {
      expect(err).toBeUndefined();
      expect(_app.player.play).toHaveBeenCalledWith(5, 'mplayer');
      done();
    });
  });

  it('should not be able to play a radio with an invalid index', function (done) {
    spyOn(_app.player, 'play');
    _app.vorpal.exec('play 21', err => {
      expect(err).toBeDefined();
      expect(_app.player.play).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not be able to play a radio without an index', function (done) {
    spyOn(_app.player, 'play');
    _app.vorpal.exec('play', err => {
      expect(err).toBeDefined();
      expect(_app.player.play).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not be able to play a radio without an index if a radio is already playing', function (done) {
    spyOn(_app.player, 'play');
    spyOn(_app.player, 'getCurrentRadio').and.returnValue({});
    _app.player.queue.currentIndex = 5;
    _app.player.playing = true;
    _app.vorpal.exec('play', () => {
      expect(_app.player.play).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not be able to play a radio with an invalid player', function (done) {
    spyOn(_app.player, 'play');
    _app.vorpal.exec('play -p mplayer', err => {
      expect(err).toBeDefined();
      expect(_app.player.play).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not be able to play a radio without both an invalid player and an invalid index', function (done) {
    spyOn(_app.player, 'play');
    _app.vorpal.exec('play 21 -p mplayer', err => {
      expect(err).toBeDefined();
      expect(_app.player.play).not.toHaveBeenCalled();
      done();
    });
  });

  it('should be able to pause the current radio', function (done) {
    spyOn(_app.player, 'pause');
    _app.vorpal.exec('pause', err => {
      expect(err).toBeUndefined();
      expect(_app.player.pause).toHaveBeenCalledWith(true);
      done();
    });
  });

  it('should be able to resume the current radio', function (done) {
    spyOn(_app.player, 'resume');
    _app.vorpal.exec('resume', err => {
      expect(err).toBeUndefined();
      expect(_app.player.resume).toHaveBeenCalled();
      done();
    });
  });

  it('should be able to stop the current radio', function (done) {
    spyOn(_app.player, 'stop');
    _app.vorpal.exec('stop', err => {
      expect(err).toBeUndefined();
      expect(_app.player.stop).toHaveBeenCalled();
      done();
    });
  });

  it('should be able to reload the current radio', function (done) {
    spyOn(_app.player, 'reload');
    _app.vorpal.exec('reload', err => {
      expect(err).toBeUndefined();
      expect(_app.player.reload).toHaveBeenCalled();
      done();
    });
  });

  it('should be able to play the previous radio in the queue', function (done) {
    spyOn(_app.player, 'prev');
    _app.vorpal.exec('prev', err => {
      expect(err).toBeUndefined();
      expect(_app.player.prev).toHaveBeenCalled();
      done();
    });
  });

  it('should be able to play the next radio in the queue', function (done) {
    spyOn(_app.player, 'next');
    _app.vorpal.exec('next', err => {
      expect(err).toBeUndefined();
      expect(_app.player.next).toHaveBeenCalled();
      done();
    });
  });

  it('should be able to show the currently playing radio', function (done) {
    spyOn(_app.player, 'showCurrent');
    _app.vorpal.exec('current', err => {
      expect(err).toBeUndefined();
      expect(_app.player.showCurrent).toHaveBeenCalled();
      done();
    });
  });

  it('should be able to show the radio list', function (done) {
    spyOn(_app.player, 'listRadios');
    _app.vorpal.exec('radios', err => {
      expect(err).toBeUndefined();
      expect(_app.player.listRadios).toHaveBeenCalled();
      done();
    });
  });

  it('should be able to show the player list', function (done) {
    spyOn(_app.player, 'listPlayers');
    _app.vorpal.exec('players', err => {
      expect(err).toBeUndefined();
      expect(_app.player.listPlayers).toHaveBeenCalled();
      done();
    });
  });

  it('should be able to show the info of a radio', function (done) {
    spyOn(_app.player, 'showInfo');
    _app.vorpal.exec('info 5', err => {
      expect(err).toBeUndefined();
      expect(_app.player.showInfo).toHaveBeenCalledWith(5);
      done();
    });
  });

  it('should not be able to show the info of a radio without an index', function (done) {
    spyOn(_app.player, 'showInfo');
    _app.vorpal.exec('info', () => {
      expect(_app.player.showInfo).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not be able to show the info of a radio with an invalid index', function (done) {
    spyOn(_app.player, 'showInfo');
    _app.vorpal.exec('info 21', err => {
      expect(err).toBeDefined();
      expect(_app.player.showInfo).not.toHaveBeenCalled();
      done();
    });
  });
});
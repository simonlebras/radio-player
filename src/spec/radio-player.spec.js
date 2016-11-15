import { vorpal, player } from '../app';
import Queue from '../queue';

describe('Radio Player', () => {
  beforeEach(function () {
    player.queue = new Queue(Array(...Array(20)).map(() => ({})));
    player.players = new Array(20).fill('');
    player.playing = false;
  });

  it('should be able to play a radio with a valid index', function (done) {
    spyOn(player, 'play');
    vorpal.exec('play 5', (err) => {
      expect(err).toBeUndefined();
      expect(player.play).toHaveBeenCalledWith(5, undefined);
      done();
    });
  });

  it('should be able to play a radio with a valid id', function (done) {
    spyOn(player, 'play');
    player.queue.radios = Array(...Array(20)).map(() => ({ id: '' }));
    player.queue.radios[5].id = 'rmc';
    vorpal.exec('play rmc', (err) => {
      expect(err).toBeUndefined();
      expect(player.play).toHaveBeenCalledWith('rmc', undefined);
      done();
    });
  });

  it('should be able to play a radio without an index', function (done) {
    spyOn(player, 'play');
    player.queue.currentIndex = 5;
    vorpal.exec('play ', (err) => {
      expect(err).toBeUndefined();
      expect(player.play).toHaveBeenCalledWith(undefined, undefined);
      done();
    });
  });

  it('should be able to play a radio with a valid player', function (done) {
    spyOn(player, 'play');
    player.queue.currentIndex = 5;
    player.players = ['mplayer'];
    vorpal.exec('play -p mplayer', (err) => {
      expect(err).toBeUndefined();
      expect(player.play).toHaveBeenCalledWith(undefined, 'mplayer');
      done();
    });
  });

  it('should be able to play a radio with both a valid index and a valid player', function (done) {
    spyOn(player, 'play');
    player.players = ['mplayer'];
    vorpal.exec('play 5 -p mplayer', (err) => {
      expect(err).toBeUndefined();
      expect(player.play).toHaveBeenCalledWith(5, 'mplayer');
      done();
    });
  });

  it('should be able to play a radio with both a valid id and a valid player', function (done) {
    spyOn(player, 'play');
    player.queue.radios = Array(...Array(20)).map(() => ({ id: '' }));
    player.queue.radios[5].id = 'rmc';
    player.players = ['mplayer'];
    vorpal.exec('play rmc -p mplayer', (err) => {
      expect(err).toBeUndefined();
      expect(player.play).toHaveBeenCalledWith('rmc', 'mplayer');
      done();
    });
  });

  it('should not be able to play a radio with an invalid index', function (done) {
    spyOn(player, 'play');
    vorpal.exec('play 21', (err) => {
      expect(err).toBeDefined();
      expect(player.play).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not be able to play a radio with an invalid id', function (done) {
    spyOn(player, 'play');
    vorpal.exec('play rmc', (err) => {
      expect(err).toBeDefined();
      expect(player.play).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not be able to play a radio without an index', function (done) {
    spyOn(player, 'play');
    vorpal.exec('play', (err) => {
      expect(err).toBeDefined();
      expect(player.play).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not be able to play a radio without an index if a radio is already playing', function (done) {
    spyOn(player, 'play');
    spyOn(player, 'getCurrentRadio').and.returnValue({});
    player.queue.currentIndex = 5;
    player.playing = true;
    vorpal.exec('play', () => {
      expect(player.play).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not be able to play a radio with an invalid player', function (done) {
    spyOn(player, 'play');
    vorpal.exec('play -p mplayer', (err) => {
      expect(err).toBeDefined();
      expect(player.play).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not be able to play a radio with both an invalid player and an invalid index', function (done) {
    spyOn(player, 'play');
    vorpal.exec('play 21 -p mplayer', (err) => {
      expect(err).toBeDefined();
      expect(player.play).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not be able to play a radio with both an invalid player and an invalid id', function (done) {
    spyOn(player, 'play');
    vorpal.exec('play rmc -p mplayer', (err) => {
      expect(err).toBeDefined();
      expect(player.play).not.toHaveBeenCalled();
      done();
    });
  });

  it('should be able to pause the current radio', function (done) {
    spyOn(player, 'pause');
    vorpal.exec('pause', (err) => {
      expect(err).toBeUndefined();
      expect(player.pause).toHaveBeenCalledWith(true);
      done();
    });
  });

  it('should be able to resume the current radio', function (done) {
    spyOn(player, 'resume');
    vorpal.exec('resume', (err) => {
      expect(err).toBeUndefined();
      expect(player.resume).toHaveBeenCalled();
      done();
    });
  });

  it('should be able to stop the current radio', function (done) {
    spyOn(player, 'stop');
    vorpal.exec('stop', (err) => {
      expect(err).toBeUndefined();
      expect(player.stop).toHaveBeenCalled();
      done();
    });
  });

  it('should be able to reload the current radio', function (done) {
    spyOn(player, 'reload');
    vorpal.exec('reload', (err) => {
      expect(err).toBeUndefined();
      expect(player.reload).toHaveBeenCalled();
      done();
    });
  });

  it('should be able to play the previous radio in the queue', function (done) {
    spyOn(player, 'prev');
    vorpal.exec('prev', (err) => {
      expect(err).toBeUndefined();
      expect(player.prev).toHaveBeenCalled();
      done();
    });
  });

  it('should be able to play the next radio in the queue', function (done) {
    spyOn(player, 'next');
    vorpal.exec('next', (err) => {
      expect(err).toBeUndefined();
      expect(player.next).toHaveBeenCalled();
      done();
    });
  });

  it('should be able to show the currently playing radio', function (done) {
    spyOn(player, 'showCurrent');
    vorpal.exec('current', (err) => {
      expect(err).toBeUndefined();
      expect(player.showCurrent).toHaveBeenCalled();
      done();
    });
  });

  it('should be able to show the radio list', function (done) {
    spyOn(player, 'listRadios');
    vorpal.exec('radios', (err) => {
      expect(err).toBeUndefined();
      expect(player.listRadios).toHaveBeenCalled();
      done();
    });
  });

  it('should be able to show the player list', function (done) {
    spyOn(player, 'listPlayers');
    vorpal.exec('players', (err) => {
      expect(err).toBeUndefined();
      expect(player.listPlayers).toHaveBeenCalled();
      done();
    });
  });

  it('should be able to show the info of a radio', function (done) {
    spyOn(player, 'showInfo');
    vorpal.exec('info 5', (err) => {
      expect(err).toBeUndefined();
      expect(player.showInfo).toHaveBeenCalledWith(5);
      done();
    });
  });

  it('should not be able to show the info of a radio without an index', function (done) {
    spyOn(player, 'showInfo');
    vorpal.exec('info', () => {
      expect(player.showInfo).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not be able to show the info of a radio with an invalid index', function (done) {
    spyOn(player, 'showInfo');
    vorpal.exec('info 21', (err) => {
      expect(err).toBeDefined();
      expect(player.showInfo).not.toHaveBeenCalled();
      done();
    });
  });
});

#Radio Player

##Description

A command line tool to play french radios in the terminal.

##Download

```
git clone https://github.com/simonlebras/radio-player && cd radio-player && npm install -g
```

##Usage

The global installation will symlink an executable script and place it in your *PATH*. To use **Radio Player**, simply type :

```
radio-player
```

Commands :

```
    help [command...]       Provides help for a given command.
    exit                    Exits application.
    play [options] [radio]  Play radio in the queue
    pause                   Pause current radio
    resume                  Resume current radio
    stop                    Stop current radio
    reload                  Reload current radio
    prev                    Play previous radio in the queue
    next                    Play next radio in the queue
    current                 Print currently playing radio
    radios                  List radios
    players                 List compatible players
    info <radio>            Print radio info
    version                 Print Radio Player version
```

##Requirements

* Node.js >= 4.0
* At least one of the following players must be installed and available in your *PATH* :
  * mplayer
  * afplay
  * mpg123
  * mpg321
  * play
  * omxplayer
  * aplay
  * cmdmp3

##License

MIT License

Copyright (c) 2016 Simon Le Bras

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

(function() {
  /*

  voicetext
  https://github.com/pchw/node-voicetext

  Copyright (c) 2014 pchw
  Licensed under the MIT license.

  */
  'use strict';
  var VoiceText, debug, request;

  request = require('superagent');

  debug = require('debug')('voicetext');

  module.exports = VoiceText = (function() {
    class VoiceText {
      constructor(api_key) {
        this.api_key = api_key;
        this._pitch = 100;
        this._speed = 100;
        this._volume = 100;
        this._speaker = this.SPEAKER.SHOW;
        this._emotion = void 0;
        this._emotion_level = void 0;
        this._format = this.FORMAT.WAV;
        this;
      }

      speaker(speaker) {
        var k, ref, v;
        ref = this.SPEAKER;
        for (k in ref) {
          v = ref[k];
          if (speaker === v) {
            this._speaker = v;
          }
        }
        return this;
      }

      emotion(cat) {
        var k, ref, v;
        // can not change emotion when speaker is SHOW
        if (this._speaker === this.SPEAKER.SHOW) {
          return this;
        }
        ref = this.EMOTION;
        for (k in ref) {
          v = ref[k];
          if (cat === v) {
            this._emotion = v;
          }
        }
        return this;
      }

      emotion_level(lvl) {
        var k, ref, v;
        if (this._speaker === this.SPEAKER.SHOW) {
          return this;
        }
        ref = this.EMOTION_LEVEL;
        for (k in ref) {
          v = ref[k];
          if (lvl === v) {
            this._emotion_level = v;
          }
        }
        return this;
      }

      pitch(lvl) {
        if ((50 <= lvl && lvl <= 200)) {
          this._pitch = lvl;
        }
        return this;
      }

      speed(lvl) {
        if ((50 <= lvl && lvl <= 400)) {
          this._speed = lvl;
        }
        return this;
      }

      volume(lvl) {
        if ((50 <= lvl && lvl <= 200)) {
          this._volume = lvl;
        }
        return this;
      }

      format(format) {
        var k, ref, v;
        ref = this.FORMAT;
        for (k in ref) {
          v = ref[k];
          if (format === v) {
            this._format = v;
          }
        }
        return this;
      }

      build_params(text) {
        var params;
        return params = {
          volume: this._volume,
          speed: this._speed,
          pitch: this._pitch,
          emotion_level: this._emotion_level,
          emotion: this._emotion,
          speaker: this._speaker,
          format: this._format,
          text: text
        };
      }

      speak(text, callback) {
        if (!text) {
          return callback(new Error('invalid argument. text: null'));
        }
        // maximum text size is 200
        text = text.slice(0, 200);
        debug(`params: ${JSON.stringify(this.build_params(text))}`);
        debug(`access to ${this.API_URL}`);
        debug(`api_key is ${this.api_key}`);
        return request.post(this.API_URL).type('form').auth(this.api_key, '').buffer(true).send(this.build_params(text)).parse(function(res, done) {
          res.setEncoding('binary');
          res.data = '';
          res.on('data', function(chunk) {
            return res.data += chunk;
          });
          return res.on('end', function() {
            return done(null, new Buffer(res.data, 'binary'));
          });
        }).end(function(e, res) {
          var ref;
          debug(`response status: ${res.status}`);
          debug(`response statusType: ${res.statusType}`);
          if (res.status === 200) {
            // res.body is binary
            return callback(null, res.body);
          } else if ((ref = res.statusType) === 4 || ref === 5) {
            return callback(new Error(JSON.stringify(res.body.toString())));
          }
        });
      }

    };

    VoiceText.prototype.API_URL = 'https://api.voicetext.jp/v1/tts';

    VoiceText.prototype.EMOTION = {
      NONE: void 0,
      HAPPINESS: 'happiness',
      ANGER: 'anger',
      SADNESS: 'sadness'
    };

    VoiceText.prototype.EMOTION_LEVEL = {
      NONE: void 0,
      EXTREME: '4',
      SUPER: '3',
      HIGH: '2',
      NORMAL: '1'
    };

    VoiceText.prototype.SPEAKER = {
      SHOW: 'show',
      HARUKA: 'haruka',
      HIKARI: 'hikari',
      TAKERU: 'takeru',
      SANTA: 'santa',
      BEAR: 'bear'
    };

    VoiceText.prototype.FORMAT = {
      OGG: 'ogg',
      WAV: 'wav',
      MP3: 'mp3'
    };

    return VoiceText;

  }).call(this);

}).call(this);

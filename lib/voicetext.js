
/*

voicetext
https://github.com/pchw/node-voicetext

Copyright (c) 2014 pchw
Licensed under the MIT license.
 */

(function() {
  'use strict';
  var VoiceText, debug, request;

  request = require('superagent');

  debug = require('debug')('voicetext');

  module.exports = VoiceText = (function() {
    VoiceText.prototype.API_URL = 'https://api.voicetext.jp/v1/tts';

    VoiceText.prototype.EMOTION = {
      NONE: void 0,
      HAPPINESS: 'happiness',
      ANGER: 'anger',
      SADNESS: 'sadness'
    };

    VoiceText.prototype.EMOTION_LEVEL = {
      NONE: void 0,
      HIGH: '2',
      NORMAL: '1'
    };

    VoiceText.prototype.SPEAKER = {
      SHOW: 'show',
      HARUKA: 'haruka',
      HIKARI: 'hikari',
      TAKERU: 'takeru'
    };

    function VoiceText(api_key) {
      this.api_key = api_key;
      this._pitch = 100;
      this._speed = 100;
      this._volume = 100;
      this._speaker = this.SPEAKER.SHOW;
      this._emotion = void 0;
      this._emotion_level = void 0;
      this;
    }

    VoiceText.prototype.speaker = function(speaker) {
      var k, v, _ref;
      _ref = this.SPEAKER;
      for (k in _ref) {
        v = _ref[k];
        if (speaker === v) {
          this._speaker = v;
        }
      }
      return this;
    };

    VoiceText.prototype.emotion = function(cat) {
      var k, v, _ref;
      if (this._speaker === this.SPEAKER.SHOW) {
        return this;
      }
      _ref = this.EMOTION;
      for (k in _ref) {
        v = _ref[k];
        if (cat === v) {
          this._emotion = v;
        }
      }
      return this;
    };

    VoiceText.prototype.emotion_level = function(lvl) {
      var k, v, _ref;
      _ref = this.EMOTION_LEVEL;
      for (k in _ref) {
        v = _ref[k];
        if (this.emotion_level === v) {
          this._emotion_level = v;
        }
      }
      return this;
    };

    VoiceText.prototype.pitch = function(lvl) {
      if ((50 <= lvl && lvl <= 200)) {
        this._pitch = lvl;
      }
      return this;
    };

    VoiceText.prototype.speed = function(lvl) {
      if ((50 <= lvl && lvl <= 400)) {
        this._speed = lvl;
      }
      return this;
    };

    VoiceText.prototype.volume = function(lvl) {
      if ((50 <= lvl && lvl <= 200)) {
        this._volume = lvl;
      }
      return this;
    };

    VoiceText.prototype.build_params = function(text) {
      var params;
      return params = {
        volume: this._volume,
        speed: this._speed,
        pitch: this._pitch,
        emotion_level: this._emotion_level,
        emotion: this._emotion,
        speaker: this._speaker,
        text: text
      };
    };

    VoiceText.prototype.speak = function(text, callback) {
      if (!text) {
        return callback(new Error('invalid argument. text: null'));
      }
      text = text.slice(0, 200);
      debug("params: " + (JSON.stringify(this.build_params(text))));
      debug("access to " + this.API_URL);
      debug("api_key is " + this.api_key);
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
        var _ref;
        debug("response status: " + res.status);
        debug("response statusType: " + res.statusType);
        if (res.status === 200) {
          return callback(null, res.body);
        } else if ((_ref = res.statusType) === 4 || _ref === 5) {
          return callback(new Error(JSON.stringify(res.body)));
        }
      });
    };

    return VoiceText;

  })();

}).call(this);

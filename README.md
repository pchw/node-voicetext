# voicetext [![Build Status](https://secure.travis-ci.org/pchw/voicetext.png?branch=master)](http://travis-ci.org/pchw/voicetext)

[VoiceText Web API beta](https://cloud.voicetext.jp/) client for node.js

## Getting Started
Install the module with: `npm install voicetext`

## Documentation
See [official api doc](https://cloud.voicetext.jp/webapi/docs/api)

```
voice
.speaker(voice.SPEAKER.HIKARI)
.emotion(voice.EMOTION.HAPPINESS)
.emotion_level(voice.EMOTION_LEVEL.HIGH)
.pitch(200)
.speed(400)
.volume(200)
.speak('きょうもいちにちがんばるぞい')
```

## Examples
```coffee-script
VoiceText = require 'voicetext'

voice = new VoiceText('<your api key>')
voice
.speaker(voice.SPEAKER.HIKARI)
.speak 'おはようございます', './test.wav', (e)->
  # ./text.wav file generated when callback
```

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 pchw. Licensed under the MIT license.
require('coffee-script/register')
fs = require 'fs'
VoiceText = require '../src/lib/voicetext'

voice = new VoiceText('<your api key>')

voice
.speaker(voice.SPEAKER.HIKARI)
.speak 'おはようございます', (e, buf)->
  console.error e if e
  fs.writeFile './test.wav', buf, 'binary', (e)->
    console.error e if e
    # ./test.wav file generated
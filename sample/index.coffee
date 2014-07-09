require('coffee-script/register')
VoiceText = require '../src/lib/voicetext'

voice = new VoiceText('<your api key>')

voice
.speaker(voice.SPEAKER.HIKARI)
.speak 'おはようございます', './test.wav', (e)->
  console.log e.stack if e
  console.log 'output file: ./test.wav'
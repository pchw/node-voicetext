###

voicetext
https://github.com/pchw/node-voicetext

Copyright (c) 2014 pchw
Licensed under the MIT license.

###

'use strict'

request = require 'superagent'
debug = require('debug')('voicetext')

module.exports = class VoiceText
  API_URL: 'https://api.voicetext.jp/v1/tts'
  EMOTION:
    NONE: undefined
    HAPPINESS: 'happiness'
    ANGER: 'anger'
    SADNESS :'sadness'
  EMOTION_LEVEL:
    NONE: undefined
    HIGH: '2'
    NORMAL: '1'
  SPEAKER:
    SHOW: 'show'
    HARUKA: 'haruka'
    HIKARI: 'hikari'
    TAKERU: 'takeru'

  constructor: (@api_key)->
    @_pitch = 100
    @_speed = 100
    @_volume = 100
    @_speaker = @SPEAKER.SHOW
    @_emotion = undefined
    @_emotion_level = undefined
    @

  speaker: (speaker)->
    for k,v of @SPEAKER
      if speaker is v
        @_speaker = v
    @

  emotion: (cat)->
    # can not change emotion when speaker is SHOW
    if @_speaker is @SPEAKER.SHOW
      return @

    for k,v of @EMOTION
      if cat is v
        @_emotion = v
    @

  emotion_level: (lvl)->
    for k,v of @EMOTION_LEVEL
      if @emotion_level is v
        @_emotion_level = v
    @

  pitch: (lvl)->
    if  50 <= lvl <= 200
      @_pitch = lvl
    @

  speed: (lvl)->
    if  50 <= lvl <= 400
      @_speed = lvl
    @

  volume: (lvl)->
    if  50 <= lvl <= 200
      @_volume = lvl
    @

  build_params: (text)->
    params =
      volume: @_volume
      speed: @_speed
      pitch: @_pitch
      emotion_level: @_emotion_level
      emotion: @_emotion
      speaker: @_speaker
      text: text

  speak: (text, callback)->
    return callback new Error 'invalid argument. text: null' unless text

    # maximum text size is 200
    text = text.slice(0,200)

    debug "params: #{JSON.stringify(@build_params text)}"
    debug "access to #{@API_URL}"
    debug "api_key is #{@api_key}"

    request
    .post(@API_URL)
    .type('form')
    .auth(@api_key, '')
    .buffer(true)
    .send(@build_params text)
    .parse(
      (res,done)->
        res.setEncoding 'binary'
        res.data = ''
        res.on 'data', (chunk)->
          res.data += chunk
        res.on 'end', ->
          done null, new Buffer(res.data, 'binary')
      )
    .end (e, res)->
      debug "response status: #{res.status}"
      debug "response statusType: #{res.statusType}"
      if res.status is 200
        # res.body is binary
        callback null, res.body
      else if res.statusType in [4, 5]
        callback new Error(JSON.stringify res.body)
      

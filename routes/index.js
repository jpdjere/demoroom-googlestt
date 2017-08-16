
/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This application demonstrates how to perform basic recognize operations with
 * with the Google Cloud Speech API.
 *
 * For more information, see the README.md under /speech and the documentation
 * at https://cloud.google.com/speech/docs.
 */

'use strict';


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  streamingMicRecognize (encoding, sampleRateHertz, languageCode, res);
});
/*
let encoding = {
  alias: 'e',
  default: 'LINEAR16',
  global: true,
  requiresArg: true,
  type: 'string'
};
let sampleRateHertz =  {
  alias: 'r',
  default: 16000,
  global: true,
  requiresArg: true,
  type: 'number'
};
let languageCode = {
  alias: 'l',
  default: 'en-EN',
  global: true,
  requiresArg: true,
  type: 'string'
}
*/
let encoding = 'LINEAR16';
let sampleRateHertz =  16000;
let languageCode = 'es-AR';

function streamingMicRecognize (encoding, sampleRateHertz, languageCode, res) {
  // [START speech_streaming_mic_recognize]
  const record = require('node-record-lpcm16');

  // Imports the Google Cloud client library
  const Speech = require('@google-cloud/speech');

  // Instantiates a client
  const speech = Speech();

  // The encoding of the audio file, e.g. 'LINEAR16'
  // const encoding = 'LINEAR16';

  // The sample rate of the audio file in hertz, e.g. 16000
  // const sampleRateHertz = 16000;

  // The BCP-47 language code to use, e.g. 'en-US'
  // const languageCode = 'en-US';

  const request = {
    config: {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode
    },
    interimResults: false // If you want interim results, set this to true
  };

  // Create a recognize stream
  const recognizeStream = speech.streamingRecognize(request)
    .on('error', console.error)
    .on('data', (data) => {
        process.stdout.write(
          (data.results[0] && data.results[0].alternatives[0])
            ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
            : `\n\nReached transcription time limit, press Ctrl+C\n`)
            console.log(data);
            res.render('index', { title: JSON.stringify(data) });
            //res.send(data);
            // res.send(data.results[0].alternatives[0].transcript);

    });


  // Start recording and send the microphone input to the Speech API
  record
    .start({
      sampleRateHertz: sampleRateHertz,
      threshold: 0,
      // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
      verbose: false,
      recordProgram: 'rec', // Try also "arecord" or "sox"
      silence: '3.0'
    })
    .on('error', console.error)
    .pipe(recognizeStream);

  console.log('Listening, press Ctrl+C to stop.');
  // [END speech_streaming_mic_recognize]
}

module.exports = router;

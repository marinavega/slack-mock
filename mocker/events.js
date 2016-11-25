'use strict'

const events = module.exports
const request = require('request')
const logger = require('../lib/logger')
let commandNumber = 0

events.calls = []

events.send = function (target, data) {
  data.response_url = `https://slack-mock/events-api/${++commandNumber}`

  // the events api uses content-type application/json
  request({
    uri: target,
    method: 'POST',
    json: true,
    body: data
  }, (err, res, body) => {
    if (err) {
      return logger.error(`error receiving response to events api ${target}`, err)
    }

    events.calls.push({
      url: target,
      body: body,
      headers: res.headers,
      statusCode: res.statusCode
    })
  })
}

events.reset = function () {
  events.calls.splice(0, events.calls.length)
}

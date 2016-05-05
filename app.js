'use strict'

const http = require('http')
const Bot = require('messenger-bot')
const express = require('express')
var bodyParser = require('body-parser')

var survey_id_index = 0;
var surveys = [
    {
        "questions": [
            {
                "title": "title",
                "subtitle": "description",
                "image_url": "http://test",
                "responses": [
                    "a",
                    "b",
                    "c"
                ]
            }
        ]
    }
]


var user_id_index = 0;
var users = [
    {
        "phone_number": "555555555",
        "current_survey": "sid",
        "current_question": "qid",
        "completed": [

        ]
    }
]

function sendQuestions(user_id, survey_id, question_id) {
    var buttons = []
    for (var i = 0; i < survey[survey_id]["questions"]["responses"].length; i++) {
        var option = survey[survey_id]["questions"]["responses"][i]

        var button = {
            "type": "postback",
            "title": option
        }
        buttons.push(button);
    }

    var payload = {
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"generic",
                "elements":[
                    {
                        "title": surveys[survey_id]["questions"]["title"],
                        "image_url": surveys[survey_id]["questions"]["image_url"],
                        "subtitle": surveys[survey_id]["questions"]["subtitle"],
                        "buttons": buttons
                    }
                ]
            }
        }
    }

    bot.sendMessage(users["phone_number"], payload, (err, info) => {
        console.log(err.message);
        console.log(info.message);
    })
}

function startSurvey(user_id) {
    for (var i = 0; i < surveys.length; i++) {
        var survey = surveys[i]
        if (! users[user_id]["completed_surveys"].includes(i)) {
            users[user_id]["current_survey"] = i;
            users[user_id]["current_question"] = 0;

            sendMessage(user_id, i, 0);
        }
    }
}


let bot = new Bot({
    token: 'EAAIzysRlmd8BAFqRNVecDRr8qbzjihWZAMBzSlzXfmF2jQ9KJ90jzeumkBqh4xCWXXVqgc9tm5IAhHZBo16cVw9iHxEXcZBZC0ZC893UkDCuGzqDfS9GRsgtMNlQCiqXJch3T016t3Cwy1icU1LhWRfdTpYlYLnnhZBGwP01E82QZDZD',
    verify: 'awesome_token',
    app_secret: '03d7b9ef8961c51cbf90c1c7516ddeff'
})

bot.on('error', (err) => {
    console.log(err.message)
})

bot.on('postback', (payload, reply) => {
    // update response = payload where user_id = payload.sender.id && question_number = current_question

    reply({ text: 'Thanks for the response!'}, (err, info) => {})
})

let app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/messenger/status', (req, res) => {
    return res.end(JSON.stringify({status: 'ok'}))
})

app.get('/messenger', (req, res) => {
    return bot._verify(req, res)
})

app.post('/messenger', (req, res) => {
    bot._handleMessage(req.body)
    res.end(JSON.stringify({status: 'ok'}))
})

app.post('/new_survey', (req, res) => {
    console.log("creating a new survey!")
    var responses = []
    for (var i = 0; i < req.body["message"]["attachment"]["payload"]["elements"][0]["buttons"].length; i++) {
        responses.push(req.body["message"]["attachment"]["payload"]["elements"][0]["buttons"][i]["title"]);
    }

    var questions = [
        {
            "title": req.body["message"]["attachment"]["payload"]["elements"][0]["title"],
            "subtitle": req.body["message"]["attachment"]["payload"]["elements"][0]["subtitle"],
            "image_url": req.body["message"]["attachment"]["payload"]["elements"][0]["image_url"],
            "responses": responses
        }
    ]

    var survey = {
        "questions": questions
    }

    surveys.push(survey);

    console.log("Assigning any users who dont have a survey a survey!")
    for (var user in users) {
        if (users["current_survey"] === null) {
            startSurvey()
        }
    }

    res.send(JSON.stringify(surveys));
})

http.createServer(app).listen(3000)

console.log('Echo bot server running at port 3000.')

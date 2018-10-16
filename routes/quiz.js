'use strict';

const express = require('express');
const mongoose = require('mongoose');
const questionList = require('../utils/create-linked-list')
const passport = require('passport')
const QuizStat = require('../models/quizStat')

const router = express.Router();



router.get('/quiz',(req,res,next)=>{
    res.json(questionList.head.value.question)
})



router.post('/submit',(req,res,next)=>{

    let {answer} = req.body
    const userId = req.user._id
    let data;
    let lastNode = questionList.findLast()

    answer = answer.toLowerCase().trim(' ')

    if(questionList.head.value.answer === answer){

        QuizStat.findOne({userId})
        .then((stats)=>{
            data = stats
            data.recurringCorrect++
            data.totalQuestions++
            data.totalRight++
            return QuizStat.findOneAndUpdate({userId},data)
        })
        .then((result)=>{
            lastNode.next = questionList.head
            questionList.head = questionList.head.next
            lastNode.next = null

            res.json({
                result,
                answer:'correct',
                correctAnswer: lastNode.value.answer})
        })
    }else{
        QuizStat.findOne({userId})
        .then((stats)=>{
            data = stats
            data.recurringCorrect = 0
            data.totalQuestions++
            return QuizStat.findOneAndUpdate({userId},data)
        })
        .then((result)=>{
            lastNode.next = questionList.head
            questionList.head = questionList.head.next
            lastNode.next = null
        res.json({
            result,
            answer:'incorrect',
            correctAnswer: lastNode.value.answer})
        })
    }


});

router.get('/stats',(req,res,next)=>{
    const userId = req.user._id
    QuizStat.findOne({userId})
    .then(stats =>{
        console.log(stats)
        res.json({recurringCorrect: stats.recurringCorrect, totalQuestions:stats.totalQuestions,totalRight:stats.totalRight})
    })

})
module.exports = router
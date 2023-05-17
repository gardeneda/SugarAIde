const express = require(`express`);

const validation = require(`${__dirname}/../utils/validation`);
const todoController = require(`${__dirname}/../controllers/todoController`);

const router = express.Router();

router.route('/')
    .get(validation.checkValidSession);
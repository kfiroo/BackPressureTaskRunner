const _ = require('lodash');
const taskRunner = require('./BackPressureTaskRunner');

const createTaskCreator = n => () => {
    console.log(`${Date.now()} - started ${n}`);
    return new Promise(resolve => setTimeout(() => {
        console.log(`${Date.now()} - done ${n}`);
        resolve(n);
    }, 1000))
};

const taskCreators = _.times(100, createTaskCreator);

taskRunner.runTasks(taskCreators, 50)
    .then(() => console.log('all done'));
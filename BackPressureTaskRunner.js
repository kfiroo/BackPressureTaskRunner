'use strict';

const _ = require('lodash');

function createTaskRunner(tasksCreators) {
    let queue = _.clone(tasksCreators);
    return {
        hasNext() {
            return queue.length > 0;
        },
        getNext() {
            if (!this.hasNext()) {
                return null;
            }
            const ret = _.head(queue);
            queue = _.tail(queue);
            return ret;
        }
    };
}

function executeTask(taskRunner) {
    if (!taskRunner.hasNext()) {
        return Promise.resolve();
    }
    const taskCreator = taskRunner.getNext();
    return Promise.resolve(taskCreator())
        .then(() => executeTask(taskRunner));
}

module.exports = {
    runTasks(tasksCreators, concurrent) {
        const taskRunner = createTaskRunner(tasksCreators);
        return Promise.all(_.times(concurrent, _.partial(executeTask, taskRunner)))
    }
};

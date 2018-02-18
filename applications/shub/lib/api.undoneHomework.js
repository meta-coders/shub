api.undoneHomework = function(homeworkId, sessionId, callback) {
  api.checkAvailability(sessionId, (err, classId) => {
    if (err) {
      application.log.error(err);
      return;
    }

    if (!classId) {
      callback(new Error('Not authorized'));
      return;
    }

    const options = {
      method: (homeworkId) ? 'DELETE' : 'SELECT',
      columns: (homeworkId) ? null : ['*'],
      table: 'done_homework',
      filter: (homeworkId) ? `homework_id = ${homeworkId}` : null
    };

    api.db.mysql.query(options, (err) => {
      if (err) {
        application.log.error(err);
        return;
      }

      api.getHomework(classId, sessionId, callback);
    });
  });
};

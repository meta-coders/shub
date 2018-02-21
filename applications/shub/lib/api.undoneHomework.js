api.undoneHomework = function(homeworkId, sessionId, callback) {
  api.checkAvailability(sessionId, (err, classId) => {
    if (err) {
      application.log.error(err);
      return;
    }

    if (!classId) {
      callback('Not authorized');
      return;
    }

    const options = {
      method: (homeworkId) ? 'delete' : 'select',
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

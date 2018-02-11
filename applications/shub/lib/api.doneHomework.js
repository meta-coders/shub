api.doneHomework = function(homeworkId, sessionId, callback) {
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
      method: 'INSERT INTO',
      table: 'done_homework',
      insert: `VALUES (null, ${homeworkId}, (select ` +
        `user_id from sessions where session_id = '${sessionId}'))`,
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

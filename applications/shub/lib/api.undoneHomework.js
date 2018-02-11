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

    const method = (homeworkId) ? 'DELETE' : 'SELECT';
    const query = (homeworkId) ? null : '*';
    const search = (homeworkId) ? `homework_id = ${homeworkId}` : null;

    const options = {
      method,
      query,
      table: 'done_homework',
      search,
      from: true
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

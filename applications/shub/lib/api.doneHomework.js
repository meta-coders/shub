api.doneHomework = function(homeworkId, sessionId, callback) {
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
      method: 'select',
      table: 'homework',
      filter: `id = ${homeworkId}`
    };

    api.db.mysql.query(options, (err, result) => {
      if (err) {
        application.log.error(err);
        return;
      }

      if (!result[0]) {
        callback('No such homework');
        return;
      }

      const options = {
        method: 'insert into',
        table: 'done_homework',
        values: [
          null,
          homeworkId,
          '(select user_id from sessions ' +
          `where session_id = "${sessionId}")`
        ]
      };

      api.db.mysql.query(options, (err) => {
        if (err) {
          application.log.error(err);
          return;
        }

        api.getHomework(classId, sessionId, callback);
      });
    });
  });
};

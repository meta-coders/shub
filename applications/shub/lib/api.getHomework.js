api.getHomework = function(homeworkId, sessionId, callback) {
  api.checkAvailability(sessionId, (err, classId) => {
    if (err) {
      application.log.error(err);
      return;
    }

    if (!classId) {
      callback(new Error('Not authorized'));
      return;
    }

    const method = (homeworkId) ? 'INSERT INTO' : 'SELECT';
    const query = (homeworkId) ? null : '*';
    const insert = (homeworkId) ? `VALUES (null, ${homeworkId}, (select ` +
      `user_id from sessions where session_id = '${sessionId}'))` : null;
    const from = (homeworkId) ? null : true;

    const options = {
      method,
      query,
      table: 'done_homework',
      insert,
      from
    };

    api.db.mysql.query(options, (err) => {
      if (err) {
        application.log.error(err);
        return;
      }

      const options = {
        table: 'homework',
        query: 'homework.id, homework.description, lessons.date AS date,' +
          ' schedule.subject AS subject',
        join: 'LEFT JOIN lessons ON lessons.id = homework.lesson_id ' +
          'LEFT JOIN schedule ON lessons.schedule_id = schedule.id',
        search: `homework.class_id = ${classId}`,
        from: true
      };

      api.db.mysql.query(options, (err, result) => {
        if (err) {
          application.log.error(err);
          return;
        }

        const homework = result.map(item => (
          Object.assign(
            { done: false },
            item,
            { date: item.date.toISOString().split('T')[0] }
          )
        ));

        const options = {
          table: 'done_homework',
          query: '*',
          search: 'user_id = ' +
          `(select user_id from sessions where session_id = '${sessionId}')`,
          from: true
        };

        api.db.mysql.query(options, (err, result) => {
          if (err) {
            application.log.error(err);
            return;
          }

          homework.forEach((item) => {
            for (const i in result) {
              if (!item.done && item.id === result[i].homework_id) {
                item.done = true;
              }
            }
          });

          callback(null, homework);
        });
      });
    });
  });
};

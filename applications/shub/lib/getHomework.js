api.getHomework = function(classId, sessionId, callback) {
  const options = {
    method: 'select',
    table: 'homework',
    columns: [
      'homework.id',
      'homework.description',
      'lessons.date AS date',
      'schedule.subject AS subject'
    ],
    join: 'left join lessons ON lessons.id = homework.lesson_id ' +
      'left join schedule ON lessons.schedule_id = schedule.id',
    filter: `homework.class_id = ${classId}`,
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
      method: 'select',
      table: 'done_homework',
      filter: 'user_id = ' +
      `(select user_id from sessions where session_id = "${sessionId}")`,
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
};

api.getHomework = function(classId, sessionId, callback) {
  const options = {
    method: 'select',
    table: 'homework',
    columns: [
      'homework.id',
      'homework.description',
      'lessons.date as date',
      'schedule.subject as subject'
    ],
    join: 'left join lessons on homework.lesson_id = lessons.id \
      left join schedule on lessons.schedule_id = schedule.id ',
    filter: `homework.class_id = ${classId}`,
  };

  api.db.mysql.query(options, (err, result) => {
    if (err) {
      application.log.error(err);
      return;
    }

    const homework = result.map(item => (
      Object.assign(
        item,
        {
          done: false,
          date: item.date.toISOString().split('T')[0]
        }
      )
    ));

    const options = {
      method: 'select',
      table: 'done_homework',
      filter: `user_id = (select user_id from \
        sessions where session_id = "${sessionId}")`,
    };

    api.db.mysql.query(options, (err, result) => {
      if (err) {
        application.log.error(err);
        return;
      }

      const processHomework = (item) => {
        const has = result.some(el => el.homework_id === item.id);
        if (has) item.done = true;
      };

      homework.forEach(processHomework);

      callback(null, homework);
    });
  });
};

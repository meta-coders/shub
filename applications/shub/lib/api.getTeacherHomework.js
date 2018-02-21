api.getTeacherHomework = function(sessionId, callback) {
  api.checkAvailability(sessionId, (err, teacherId) => {
    if (err) {
      application.log.error(err);
      return;
    }

    if (!teacherId) {
      callback('Not authorized');
      return;
    }

    const options = {
      method: 'select',
      table: 'homework',
      columns: [
        'lessons.date as date',
        'homework.description',
        'classes.name as class',
        'classes.id as classId'
      ],
      join: 'join lessons on homework.lesson_id = lessons.id join \
       classes on homework.class_id = classes.id join schedule on \
       lessons.schedule_id = schedule.id join teachers on \
       schedule.teacher_id = teachers.id',
      filter: `teachers.id = ${teacherId}`
    };

    api.db.mysql.query(options, (err, result) => {
      if (err) {
        application.log.error(err);
        return;
      }

      const homework = result.map(item =>
        Object.assign(
          item,
          { date: item.date.toISOString().split('T')[0] }
        )
      );

      const options = {
        method: 'select',
        table: 'schedule',
        columns: ['distinct classes.id as id', 'classes.name as class'],
        join: 'join classes on schedule.class_id = classes.id',
        filter: `teacher_id = ${teacherId}`
      };

      api.db.mysql.query(options, (err, classes) => {
        if (err) {
          application.log.error(err);
          return;
        }

        callback(null, { classes, homework });
      });
    });
  });
};

api.getSchedule = function(sessionId, callback) {
  api.checkAvailability(sessionId, (err, classId) => {
    if (err) {
      application.log.error(err);
      return;
    }

    if (!classId) {
      callback('Not Authorized');
      return;
    }

    const options = {
      method: 'select',
      table: 'schedule',
      columns: [
        'schedule.weekday',
        'schedule.lesson',
        'schedule.subject',
        'schedule.cabinet',
        'teachers.name AS teacher_name'
      ],
      join: 'left join teachers ON teachers.id=schedule.teacher_id',
      filter: `class_id = ${classId}`
    };


    api.db.mysql.query(options, (err, schedule) => {
      if (err) {
        application.log.error(err);
        return;
      }

      api.getTimetable((timetable) => {
        callback(null, { schedule, timetable });
      });
    });
  });
};

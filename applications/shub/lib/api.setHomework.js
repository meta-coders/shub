api.setHomework = function(sessionId, homework, callback) {
  api.checkAvailability(sessionId, (err, teacherId) => {
    if (err) {
      application.log.error(err);
      return;
    }

    if (!teacherId) {
      callback('Not authorized');
      return;
    }

    const classes = homework.classes;
    const parallel = [[]];

    classes.forEach((classObj) => {
      const options = {
        method: 'insert into',
        table: 'homework',
        values: [
          null,
          `(select distinct lessons.id from lessons join \
          schedule on lessons.schedule_id = schedule.id \
          where date = "${homework.date}" and teacher_id = ${teacherId})`,
          classObj.id,
          `"${homework.description}"`
        ]
      };

      parallel[0].push((data, cb) =>
        api.db.mysql.query(options, (err) => {
          if (err) {
            application.log.error(err);
            return;
          }

          cb(null);
        })
      );
    });

    api.metasync(parallel)({}, (err) => {
      if (err) {
        application.log.error(err);
        return;
      }

      callback();
    });
  });
};

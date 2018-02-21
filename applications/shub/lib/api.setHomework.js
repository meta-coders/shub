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

    const processClasses = (item, cb) => {
      const options = {
        method: 'insert into',
        table: 'homework',
        values: [
          null,
          `(select distinct lessons.id from lessons join \
            schedule on lessons.schedule_id = schedule.id \
            where date = "${homework.date}" and teacher_id = ${teacherId})`,
          item.id,
          `"${homework.description}"`
        ]
      };

      api.db.mysql.query(
        options,
        (err) => {
          if (err) {
            application.log.error(err);
            return;
          }

          cb(null);
        }
      );
    };

    api.metasync.each(
      homework.classes,
      processClasses,
      () => callback()
    );
  });
};

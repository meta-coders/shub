api.getTimetable = function(callback) {
  const start = 'TIME_FORMAT(start, "%H:%i") AS start';
  const end = 'TIME_FORMAT(end, "%H:%i") AS end';

  const options = {
    method: 'select',
    columns: ['id', start, end],
    table: 'timetable',
  };

  api.db.mysql.query(options, (err, result) => {
    if (err) {
      application.log.error(err);
      return;
    }

    callback(result);
  });
};

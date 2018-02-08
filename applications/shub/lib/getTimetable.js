api.getTimetable = function(callback) {
  const start = 'TIME_FORMAT(start, "%H:%i") AS start';
  const end = 'TIME_FORMAT(end, "%H:%i") AS end';

  const options = {
    query: `id, ${start}, ${end}`,
    table: 'timetable',
    from: true
  };

  api.db.mysql.query(options, (err, result) => {
    if (err) {
      application.log.error(err);
      return;
    }

    callback(result);
  });
};

api.getEvents = function(data, callback) {
  api.checkAvailability(data.sessionId, (err, result) => {
    if (err) {
      application.log.error(err);
      return;
    }

    if (!result[0]) {
      callback(new Error('Not authorized'));
      return;
    }

    const options = {
      query: '*',
      table: 'events',
      search: `class_id=${data.classId}`,
      from: true
    };

    this.db.mysql.query(options, (err, result) => {
      if (err) {
        application.log.error(err);
        return;
      }

      callback(result);
    });
  });
};

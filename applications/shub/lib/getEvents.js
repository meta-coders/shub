api.getEvents = function(data, callback) {
  api.checkAvailability(data.sessionId, (err, classId) => {
    if (err) {
      application.log.error(err);
      return;
    }

    if (!classId) {
      callback(new Error('Not authorized'));
      return;
    }

    const options = {
      query: '*',
      table: 'events',
      search: `class_id=${classId}`,
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

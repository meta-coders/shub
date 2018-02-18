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
      method: 'select',
      table: 'events',
      filter: 'YEAR(date) = YEAR(CURRENT_DATE()) AND ' +
        `MONTH(date) = MONTH(CURRENT_DATE()) AND class_id = ${classId}`
    };

    this.db.mysql.query(options, (err, result) => {
      if (err) {
        application.log.error(err);
        return;
      }

      const events = result.map(item => (
        Object.assign(
          {},
          item,
          { date: item.date.toISOString().split('T')[0] }
        )
      ));

      callback(null, events);
    });
  });
};

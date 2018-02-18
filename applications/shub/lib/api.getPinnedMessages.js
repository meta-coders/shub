api.getPinnedMessages = function(sessionId, callback) {
  api.checkAvailability(sessionId, (err, classId) => {
    if (err) {
      application.log.error(err);
      return;
    }

    if (!classId) {
      callback('Not authorized');
      return;
    }

    const options = {
      method: 'select',
      table: 'pinned_messages',
      columns: ['message', 'date'],
      filter: `class_id = ${classId}`
    };

    api.db.mysql.query(options, (err, result) => {
      if (err) {
        application.log.error(err);
        return;
      }

      const pinned = result.map(item => (
        Object.assign(
          { date: item.date.toISOString().split('T')[0] },
          item
        )
      ));

      callback(null, pinned);
    });
  });
};

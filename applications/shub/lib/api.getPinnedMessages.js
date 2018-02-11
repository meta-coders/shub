api.getPinnedMessages = function(sessionId, callback) {
  api.checkAvailability(sessionId, (err, classId) => {
    if (err) {
      application.log.error(err);
      return;
    }

    if (!classId) {
      callback(new Error('Not authorized'));
      return;
    }

    const options = {
      table: 'pinned_messages',
      query: 'message, date',
      search: `class_id = ${classId}`,
      from: true
    };

    api.db.mysql.query(options, (err, result) => {
      if (err) {
        application.log.error(err);
        return;
      }

      const pinned = result.map(item => (
        Object.assign(
          {},
          item,
          { date: item.date.toISOString().split('T')[0] }
        )
      ));

      callback(null, pinned);
    });
  });
};

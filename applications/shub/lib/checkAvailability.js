api.checkAvailability = function(sessionId, callback) {
  const options = {
    method: 'select',
    table: 'sessions',
    filter: `session_id = "${sessionId}"`
  };

  this.db.mysql.query(options, (err, result) => {
    if (!result[0]) {
      callback(err);
      return;
    }

    const uid = result[0].user_id;

    const options = {
      method: 'select',
      table: 'students',
      filter: `id = (select profile_id from users where id = ${uid})`
    };

    this.db.mysql.query(options, (err, result) =>
      callback(err, result[0].class_id));
  });
};

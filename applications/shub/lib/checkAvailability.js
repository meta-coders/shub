api.checkAvailability = function(sessionId, callback) {
  const options = {
    method: 'select',
    columns: [
      'profile_id',
      'role'
    ],
    table: 'sessions',
    join: 'join users on sessions.user_id = users.id',
    filter: `session_id = "${sessionId}"`
  };

  this.db.mysql.query(options, (err, result) => {
    if (err || !result[0]) {
      callback(err);
      return;
    }

    const pid = result[0].profile_id;
    const table = result[0].role;

    const options = {
      method: 'select',
      table,
      filter: `id = ${pid}`
    };

    this.db.mysql.query(options, (err, result) => {
      if (table === 'students') callback(err, result[0].class_id);
      else callback(err, result[0].id);
    });
  });
};

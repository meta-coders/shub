api.checkAvailability = function(sessionId, callback) {
  const options = {
    query: '*',
    table: 'sessions',
    search: `session_id="${sessionId}"`,
    from: true
  };

  this.db.mysql.query(options, (err, result) => {
    if (!result[0]) {
      callback(err);
      return;
    }

    const uid = result[0].user_id;

    const options = {
      query: '*',
      table: 'students',
      search: `(select profile_id from users where id=${uid})`,
      from: true
    };

    this.db.mysql.query(options, (err, result) => callback(err, result[0].class_id));
  });
};

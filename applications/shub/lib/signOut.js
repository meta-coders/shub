api.signOut = function(sessionId, callback) {
  const options = {
    method: 'DELETE',
    table: 'sessions',
    search: `session_id="${sessionId}"`,
    from: true
  };

  this.db.mysql.query(options, (err, result) => {
    if (err) {
      application.log.error(err);
      return;
    }

    if (result.affectedRows === 0) callback(new Error('Wrong session'));
    else callback();
  });
};

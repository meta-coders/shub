api.signOut = function(sessionId, callback) {
  const options = {
    method: 'delete',
    table: 'sessions',
    filter: `session_id = "${sessionId}"`
  };

  this.db.mysql.query(options, (err, result) => {
    if (err) {
      application.log.error(err);
      return;
    }

    if (result.affectedRows === 0) callback('Wrong session');
    else callback();
  });
};

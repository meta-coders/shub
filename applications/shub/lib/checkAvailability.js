api.checkAvailability = function(sessionId, callback) {
  const options = {
    query: '*',
    table: 'sessions',
    search: `session_id="${sessionId}"`,
    from: true
  };

  this.db.mysql.query(options, callback);
};

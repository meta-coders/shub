api.db.mysql = {
  connection: api.mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'shub'
  })
};

api.db.mysql.connection.connect(function(err) {
  if (err) {
    application.log.error(err);
    return;
  }

  application.log.debug('Connected to db');
});

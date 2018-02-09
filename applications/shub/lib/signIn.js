api.signIn = function(login, password, callback) {
  const pass = api.crypto.createHmac('md5', login)
    .update(password)
    .digest('hex');

  const options = {
    query: 'id, password, role',
    table: 'users',
    search: `login="${login}"`,
    from: true
  };

  this.db.mysql.query(options, (err, result) => {
    if (err) {
      application.log.error(err);
      return;
    }

    const id = result[0].id;
    const role = result[0].role;

    const salt = `${new Date().getTime()}`;
    const sid = api.crypto.createHmac('md5', salt)
      .update(`${id}`)
      .digest('hex');

    const options = {
      method: 'INSERT INTO',
      table: 'sessions',
      insert: `VALUES (null, ${id}, "${sid}")`
    };

    if (result[0].password === pass) {
      this.db.mysql.query(options, (err) => {
        if (err) {
          application.log.error(err);
          return;
        }

        callback(null, { sessionId: sid, role });
      });
    } else {
      callback(new Error('Not authotized'));
    }
  });
};

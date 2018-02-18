api.signIn = function(login, password, callback) {
  const pass = api.crypto.createHmac('md5', login)
    .update(password)
    .digest('hex');

  const options = {
    method: 'select',
    columns: ['id', 'password', 'role'],
    table: 'users',
    filter: `login = "${login}"`
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
      method: 'insert into',
      table: 'sessions',
      values: [null, id, `"${sid}"`]
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

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

    const user = result[0];

    if (!user) {
      callback('Not signed up');
      return;
    }

    if (user.password === pass) {
      const id = user.id;
      const role = user.role;

      const salt = `${new Date().getTime()}`;
      const sid = api.crypto.createHmac('md5', salt)
        .update(`${id}`)
        .digest('hex');

      const options = {
        method: 'insert into',
        table: 'sessions',
        values: [null, id, `"${sid}"`]
      };

      this.db.mysql.query(options, (err) => {
        if (err) {
          application.log.error(err);
          return;
        }

        callback(null, { sessionId: sid, role });
      });
    } else {
      callback('Not authotized');
    }
  });
};

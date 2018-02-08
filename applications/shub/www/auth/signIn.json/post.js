(client, callback) => {
  const data = JSON.parse(client.data);
  const login = data.login;
  const password = data.password;

  api.signIn(login, password, (err, result) => {
    if (err) {
      client.res.statusCode = 403;
      callback(err.message);
      return;
    }

    callback({
      sessionId: result.sessionId,
      role: result.role
    });
  });
}

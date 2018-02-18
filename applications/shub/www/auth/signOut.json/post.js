(client, callback) => {
  const data = JSON.parse(client.data);
  const sessionId = data.sessionId;

  api.signOut(sessionId, (err) => {
    if (err) {
      client.res.statusCode = 403;
      callback(err);
      return;
    }

    client.res.statusCode = 200;
    callback('Signed out successfully');
  });
}

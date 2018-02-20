(client, callback) => {
  const data = JSON.parse(client.data);
  const sessionId = data.sessionId;

  if (!sessionId) {
    client.res.statusCode = 400;
    callback();
    return;
  }

  api.getSchedule(sessionId, (err, data) => {
    if (err) {
      client.res.statusCode = 403;
      callback(err);
      return;
    }

    callback(data);
  });
}

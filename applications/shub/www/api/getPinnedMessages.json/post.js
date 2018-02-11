(client, callback) => {
  const data = JSON.parse(client.data);
  const sessionId = data.sessionId;

  api.getPinnedMessages(sessionId, (err, data) => {
    if (err) {
      client.res.statusCode = 403;
      callback(err.message);
      return;
    }

    callback(data);
  });
}

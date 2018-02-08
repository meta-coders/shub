(client, callback) => {
  const data = JSON.parse(client.data);
  api.getEvents(data, (err, data) => {
    if (err) {
      client.res.statusCode = 403;
      callback(err);
      return;
    }

    callback(null, data);
  });
}

(client, callback) => {
  const data = JSON.parse(client.data);
  const homeworkId = data.homeworkId;
  const sessionId = data.sessionId;
  const done = data.done;

  if (done) {
    api.doneHomework(homeworkId, sessionId, (err, data) => {
      if (err) {
        client.res.statusCode = 403;
        callback(err);
        return;
      }

      callback(data);
    });
  } else {
    api.undoneHomework(homeworkId, sessionId, (err, data) => {
      if (err) {
        client.res.statusCode = 403;
        callback(err);
        return;
      }

      callback(data);
    });
  }
}

(client, callback) => {
  const data = JSON.parse(client.data);
  const sessionId = data.sessionId;
  const method = data.method;
  const homework = data.homework;

  if (!sessionId) {
    client.res.statusCode = 400;
    callback();
    return;
  }

  const sendHomework = () => api.getTeacherHomework(
    sessionId,
    (err, data) => {
      if (err) {
        client.res.statusCode = 403;
        callback(err);
        return;
      }

      callback(data);
    }
  );


  if (!homework) {
    sendHomework();
  } else if (method === 'add') {
    if (
      !homework.classes ||
      !homework.date ||
      !homework.description
    ) {
      client.statusCode = 400;
      callback('Bad request');
      return;
    }

    api.setHomework(
      sessionId,
      homework,
      (err) => {
        if (err) {
          client.res.statusCode = 403;
          callback(err);
          return;
        }

        sendHomework();
      }
    );
  } else if (method === 'delete') {
    api.deleteHomework(
      sessionId,
      homework.id,
      (err) => {
        if (err) {
          client.res.statusCode = 403;
          callback(err);
          return;
        }

        sendHomework();
      }
    );
  } else {
    callback('Oops... somethig went wrong');
  }
}

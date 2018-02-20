api.db.mysql.query = function(options, callback) {
  const method = options.method.toLowerCase();
  const table = options.table;
  const query = {};

  if (method === 'create table') {
    const columns = options.columns.join(',');
    query.sql = `${method} ${table} ${columns}`;

  } else if (method === 'insert into') {
    const metadata = options.metadata ?
      `(${options.metadata.join(',')})` : '';
    options.values = options.values.map(item => (item || `${item}`));
    const values = options.values.join(',');
    query.sql = `${method} ${table} ${metadata} values (${values})`;

  } else if (method === 'select') {
    const columns = options.columns ? options.columns.join(',') : '*';
    const join = options.join || '';
    const filter = options.filter ? `where ${options.filter}` : '';
    query.sql = `${method} ${columns} from ${table} ${join} ${filter}`;

  } else if (method === 'delete') {
    const filter = options.filter ? `where ${options.filter}` : '';
    query.sql = `${method} from ${table} ${filter}`;

  } else if (method === 'update') {
    const set = options.set.join(',');
    const filter = options.filter ? `where ${options.filter}` : '';
    query.sql = `${method} ${table} set ${set} ${filter}`;

  }
  console.log(query);
  this.connection.query(query.sql, callback);
};

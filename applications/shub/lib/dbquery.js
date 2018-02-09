api.db.mysql.query = function(options, callback) {
  const query = `${options.method || 'SELECT'} ` +
                `${options.query || ''} ` +
                `${options.from ? 'FROM' : ''} ` +
                `${options.table} ` +
                `${options.join || ''} ` +
                `${options.insert || ''} ` +
                `${options.search ? 'WHERE ' + options.search : ''}`;
  this.connection.query(query, callback);
};

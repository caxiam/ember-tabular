export default function() {
  this.namespace = '';

  /*
    Routes
  */
    this.get('/users', function(db) {
      return {
        data: db.users.map(attrs => (
          {
            type: 'users',
            id: attrs.id,
            attributes: attrs
          }
        )),
        meta: {
          total: db.users.length
        }
      };
    });
    this.get('/users/:id', function(db, request) {
      let id = request.params.id;
      return {
        data: {
          type: 'users',
          id: id,
          attributes: db.users.find(id)
        }
      };
    });
}

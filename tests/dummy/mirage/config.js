export default function() {
  this.namespace = '';

  /*
    Routes
  */
    this.get('/users');
    this.get('/users/:id');
}

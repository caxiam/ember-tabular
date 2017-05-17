import Ember from 'ember';

export default function destroyApp(application) {
  // ensure mirage server is properly shutdown
  server.shutdown();
  Ember.run(application, 'destroy');
}

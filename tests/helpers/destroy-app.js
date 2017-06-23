import Ember from 'ember';

export default function destroyApp(application) {
  Ember.run(application, 'destroy');
  // ensure mirage server is properly shutdown
  if (window.server) {
    window.server.shutdown();
  }
}

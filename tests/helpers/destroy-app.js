import { run } from '@ember/runloop';

export default function destroyApp(application) {
  run(application, 'destroy');
  // ensure mirage server is properly shutdown
  if (window.server) {
    window.server.shutdown();
  }
}

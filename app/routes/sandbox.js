import Route from '@ember/routing/route';

export default class SandboxRoute extends Route {
  model() {
    return {
      now: new Date(),
      projects: [],
    }
  }
}
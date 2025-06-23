class Container {
  constructor() {
    this.services = {};
  }

  register(name, service) {
    this.services[name] = service;
  }

  get(name) {
    if (!this.services[name]) {
      throw new Error(`Service ${name} not found`);
    }
    return this.services[name];
  }
}

const container = new Container();

container.register("db", require("./db"));
container.register("validators", require("./valid"));
container.register("auth", require("./auth"));
container.register("imageUploader", require("./imageUploader"));
container.register("logger", require("./logger"));

module.exports = container;

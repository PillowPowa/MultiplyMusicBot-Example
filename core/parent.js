const childProc = require('node:child_process');
const { setTimeout } = require("node:timers");

const keys = require("./tokens.json")
const twins = Array.from({ length: keys.length }, () => childProc.fork(`./core/children.js`));

class Core {
    constructor() {
        this.requests = [],
        this.sended = false,
        this.busy = []
    }
    busyAdd(id) {
        core.sended = true
        setTimeout(() => { core.sended = false }, 1000)
        this.busy.push(id)
    }
}
const core = new Core()

for (let i = 0; i < keys.length; i++) {
 twins[i]
  .on('message', (message) => {
    if(!core.sended) {
        if(!core.busy.includes(message.channel)) {
            twins[message.id].send({type: "play"})
            core.busyAdd(message.channel)
        }
    }
  })
  .send({ type: "create", id: i, token: keys[i] });
}
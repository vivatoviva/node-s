const net = require('net');
class OfflineSate {
  constructor(failSafeSocket) {
    this.failSafeSocket = failSafeSocket;
  }

  send(data) {
    this.failSafeSocket.queue.push(data);
  }

  activate() {
    const retry = () => {
      setTimeout(() => {
        this.activate();
      }, 5000);
    }
    this.failSafeSocket.socket = net.createConnection(this.failSafeSocket.options, () => {
      this.failSafeSocket.changState('online')
    });
    this.failSafeSocket.socket.once('error', retry);
  }
}

class OnlineState {
  constructor(failSafeSocket) {
    this.failSafeSocket = failSafeSocket;
  }
  
  send(data) {
    this.failSafeSocket.socket.push(data);
  }

  activate() {
    this.failSafeSocket.queue.forEach(data => {
      this.send(data);
    })
    this.failSafeSocket.queue = [];
    const hiddenError  = () => {
      this.changState('offline');
    }
    this.failSafeSocket.once('error', hiddenError);
  }
}

class FailSafeSocket {
  constructor(options) {
    this.options = options;
    this.queue = [];
    this.currentState = null;
    this.socket = null;
    this.states = {
      offline: new OfflineSate(this),
      online: new OnlineState(this),
    }
    this.changState('offline')
  }
  send(data) {
    this.currentState.send(data)
  }

  changState(state) {
    this.currentState = this.states[state];
    this.currentState.activate();
  }
}
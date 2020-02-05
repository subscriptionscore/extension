/**
 * Subscription Score patch script
 * More info: https://github.com/subscriptionscore/extension
 */
EventTarget.prototype._addEventListener =
  EventTarget.prototype.addEventListener;

EventTarget.prototype.addEventListener = function(type, listener, ...args) {
  if (type === 'submit') {
    if (typeof listener === 'function') {
      this._onsubmit = listener.bind(this);
    } else if (typeof listener.handleEvent === 'function') {
      this._onsubmit = listener.handleEvent.bind(this);
    }
  } else {
    return EventTarget.prototype._addEventListener.apply(this, [
      type,
      listener,
      ...args
    ]);
  }
};

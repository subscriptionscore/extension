(() => {
  Element.prototype._addEventListener = Element.prototype.addEventListener;
  Element.prototype.onsubmit = () => {
    console.log('hijacked all onsubmits');
  };
  Element.prototype.addEventListener = function(eventName, ...args) {
    if (eventName === 'onsubmit' || eventName === 'submit') {
      console.log(
        `[subscriptionscore]: monkey patching event listener ${eventName} on element ${this}`
      );
    }

    Element.prototype._addEventListener.call(this, eventName, ...args);
  };
  const $script = document.createElement('script');
  $script.src = path;
  $script.type = 'text/javascript';
  $script.async = 'true';
  document.addEventListener('DOMContentLoaded', () =>
    document.head.appendChild($script)
  );
})();

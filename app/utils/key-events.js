var keyCode = {
  8: 'Backspace',
  9: 'Tab',
  13: 'Enter',
  16: 'Shift',
  17: 'Control',
  18: 'Alt',
  20: 'CapsLock',
  27: 'Esc',
  32: 'Space',
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'Left',
  38: 'Up',
  39: 'Right',
  40: 'Down',
  45: 'Insert',
  46: 'Delete',
  144: 'NumLock'
};

export function getKey(ev) {
  if (ev.key) return ev.key;
  if (_.isNull(ev.which)) return String.fromCharCode(ev.keyCode);
  if (keyCode[ev.which]) return keyCode[ev.which];

  var letter = String.fromCharCode(ev.which);
  return (ev.shiftKey) ? letter.toUpperCase() : letter.toLowerCase();
}

export function isModPress(ev) {
  return ev.ctrlKey || ev.shiftKey || ev.altKey || ev.metaKey;
}

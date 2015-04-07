var format = function(date, pattern) {
  if (pattern === undefined) {
    pattern = date;
    date = new Date();
  }
  var map = {
    "M": date.getMonth() + 1,
    "d": date.getDay(),
    "h": date.getHours(),
    "m": date.getMinutes(),
    "s": date.getSeconds()
  };

  pattern = pattern.replace(/([yMdhms])+/g, function(match, current) {
    var t = map[current];
    if (t !== undefined) {
      if (match.length > 1) {
        t = '0' + t;
        t = t.substr(t.length - 2);
      }
      return t;
    }
    else if (current === 'y') {
      return (date.getFullYear() + '').substr(4 - match.length);
    }
    return match;
  });

  return pattern;
};

module.exports.format = format;

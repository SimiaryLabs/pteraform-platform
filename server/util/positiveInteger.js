PositiveInteger = Match.Where(function (x) {
  check(x, Match.Integer);
  return x > 0;
});

type anyOf = Buffer &
  string &
  object &
  symbol &
  null &
  undefined &
  Record<string, any> &
  (() => any) &
  boolean &
  boolean[] &
  keyof [false];

/** Commands sent to the Racing+ mod from the client. */
export type SocketCommandIn = "set" | "reset" | "chat";

/** Commands sent to the Racing+ client from the mod. */
export type SocketCommandOut =
  | "connected"
  | "disconnected"
  | "ping"
  | "info"
  | "mainMenu"
  | "seed"
  | "runMatchesRuleset"
  | "level"
  | "room"
  | "item"
  | "finish"
  | "chat"
  | "error";

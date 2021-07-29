import { log } from "isaacscript-common";

const DEBUG = false;

// merge takes the values from a new table and merges them into an old table
// It will only copy over values that are present in the old table
// In other words, it will ignore extraneous values in the new table
export function merge(oldTable: LuaTable, newTable: LuaTable): void {
  if (type(oldTable) !== "table" || type(newTable) !== "table") {
    error("merge is comparing a value that is not a table.");
  }

  if (DEBUG) {
    log("Beginning iterating over a table.");
  }

  // Go through the old table, merging every found value
  for (const [key, oldValue] of pairs(oldTable)) {
    if (DEBUG) {
      log(`Found key: ${key}`);
    }

    const newValue = newTable.get(key) as unknown;
    const oldType = type(oldValue);
    const newType = type(newValue);

    // Do nothing if a property on the incoming table either does not exist or is a mismatched type
    if (oldType !== newType) {
      continue;
    }

    // Recursively handle sub-tables
    if (oldType === "table") {
      merge(oldValue, newValue as LuaTable);
      continue;
    }

    // Base case - copy the value
    oldTable.set(key, newValue);
  }

  // We also need to iterate through the new table in case it is:
  // 1) an "array" (i.e. indexed by "1", "2", and so on)
  // 2) a key-value object indexed by a number coerced to a string (i.e. indexed by "2182363682")
  // In both of these cases, we always want to copy the values,
  // since they indicate state data that will be independent of mod version
  for (const [key, newValue] of pairs(newTable)) {
    const num = tonumber(key);
    if (num !== undefined) {
      oldTable.set(key, newValue);
    }
  }

  if (DEBUG) {
    log("Finished iterating over a table.");
  }
}

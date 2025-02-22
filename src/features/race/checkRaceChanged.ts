import {
  arrayEquals,
  inStartingRoom,
  isArray,
  isTable,
  log,
  onFirstFloor,
} from "isaacscript-common";
import type { RaceData, RaceDataType } from "../../classes/RaceData";
import {
  restartOnNextFrame,
  setRestartSeed,
} from "../../classes/features/mandatory/misc/RestartOnNextFrame";
import { RaceFormat } from "../../enums/RaceFormat";
import { RaceStatus } from "../../enums/RaceStatus";
import { g } from "../../globals";
import * as placeLeft from "./placeLeft";
import * as raceRoom from "./raceRoom";
import { raceStart } from "./raceStart";
import * as sprites from "./sprites";
import * as topSprite from "./topSprite";

export function checkRaceChanged(
  oldRaceData: RaceData,
  newRaceData: RaceData,
): void {
  const keys = Object.keys(oldRaceData);
  keys.sort(); // The keys will be in a random order because of Lua's `pairs`.

  for (const key of keys) {
    const property = key as keyof RaceData;

    const oldValue = oldRaceData[property];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (oldValue === undefined) {
      error(`The previous value for "${key}" does not exist.`);
    }

    const newValue = newRaceData[property];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (newValue === undefined) {
      error(`The new value for "${key}" does not exist.`);
    }

    if (isTable(oldValue)) {
      const oldArray = oldValue as int[];
      const newArray = newValue as int[];
      if (!arrayEquals(oldArray, newArray)) {
        raceValueChanged(property, oldArray, newArray);
      }
    } else if (oldValue !== newValue) {
      raceValueChanged(property, oldValue, newValue);
    }
  }
}

function raceValueChanged(
  property: keyof RaceData,
  oldValue: RaceDataType,
  newValue: RaceDataType,
) {
  log(`Race value "${property}" changed: ${oldValue} --> ${newValue}`);

  if (type(oldValue) === "table") {
    if (!isArray(oldValue)) {
      error("The old race value was not an array.");
    }

    for (const [i, element] of oldValue.entries()) {
      log(`Old array: ${i}) - ${element}`);
    }
  }

  if (type(newValue) === "table") {
    if (!isArray(newValue)) {
      error("The new race value was not an array.");
    }

    for (const [i, element] of newValue.entries()) {
      log(`New array: ${i}) - ${element}`);
    }
  }

  const changedFunction = functionMap.get(property);
  if (changedFunction !== undefined) {
    changedFunction(oldValue, newValue);
  }
}

const functionMap = new Map<
  keyof RaceData,
  (oldValue: RaceDataType, newValue: RaceDataType) => void
>();

functionMap.set("status", (_oldValue: RaceDataType, newValue: RaceDataType) => {
  const newStatus = newValue as RaceStatus;

  switch (newStatus) {
    case RaceStatus.NONE: {
      if (raceRoom.inRaceRoom()) {
        restartOnNextFrame();
        log("Restarting because we want to exit the race room.");
      }

      sprites.resetAll();
      break;
    }

    case RaceStatus.OPEN: {
      // If we are in the first room of a run, go to the race room.
      if (onFirstFloor() && inStartingRoom()) {
        restartOnNextFrame();
        log("Restarting to go to the race room.");
      }

      placeLeft.statusOrMyStatusChanged();
      topSprite.statusChanged();
      break;
    }

    case RaceStatus.STARTING: {
      raceRoom.statusChanged();
      placeLeft.statusOrMyStatusChanged();
      topSprite.statusChanged();
      break;
    }

    case RaceStatus.IN_PROGRESS: {
      restartOnNextFrame();
      if (g.race.format === RaceFormat.SEEDED) {
        setRestartSeed(g.race.seed);
      }
      log("Restarting because the run has now started.");

      raceStart();
      break;
    }
  }
});

functionMap.set(
  "myStatus",
  (_oldValue: RaceDataType, _newValue: RaceDataType) => {
    // It is possible for "myStatus" to flip between "racing" and "ready" during the middle of a
    // seeded run. Thus, since we cannot rely on the variable, we cannot automatically reset the
    // game status to that of an unseeded run after a seeded race is finished.

    raceRoom.myStatusChanged();
    placeLeft.statusOrMyStatusChanged();
  },
);

functionMap.set(
  "countdown",
  (_oldValue: RaceDataType, _newValue: RaceDataType) => {
    topSprite.countdownChanged();
  },
);

functionMap.set("place", (_oldValue: RaceDataType, _newValue: RaceDataType) => {
  placeLeft.placeChanged();
  topSprite.placeChanged();
});

functionMap.set(
  "placeMid",
  (_oldValue: RaceDataType, _newValue: RaceDataType) => {
    placeLeft.placeMidChanged();
  },
);

functionMap.set(
  "numReady",
  (_oldValue: RaceDataType, _newValue: RaceDataType) => {
    raceRoom.numReadyChanged();
  },
);

functionMap.set(
  "numEntrants",
  (_oldValue: RaceDataType, _newValue: RaceDataType) => {
    raceRoom.numEntrantsChanged();
  },
);

functionMap.set(
  "message",
  (_oldValue: RaceDataType, newValue: RaceDataType) => {
    if (typeof newValue !== "string") {
      return;
    }

    if (newValue === "") {
      return;
    }

    const renderFrameCount = Isaac.GetFrameCount();
    g.renderFrameLastClientMessageReceived = renderFrameCount;
  },
);

import {
  DEADLINE_DURATION,
  EPOCH_DURATION,
  ROUND_DURATION,
  VOTIUM_GENESIS_ROUND,
} from "./constants";
import { BigInt } from "@graphprotocol/graph-ts";

export function getCurrentEpoch(timestamp: BigInt): number {
  return (timestamp.toI32() / EPOCH_DURATION) * EPOCH_DURATION;
}

export function getRoundNumber(eventTimestamp: BigInt): number {
  if (
    eventTimestamp.toI32() <
    getCurrentEpoch(eventTimestamp) + ROUND_DURATION - DEADLINE_DURATION
  ) {
    return (
      getCurrentEpoch(eventTimestamp) / EPOCH_DURATION - VOTIUM_GENESIS_ROUND
    );
  } else {
    return getCurrentEpoch(eventTimestamp) / EPOCH_DURATION - 1347;
  }
}

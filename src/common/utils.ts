import {
  DEADLINE_DURATION,
  EPOCH_DURATION,
  ROUND_DURATION,
  VOTIUM_GENESIS_ROUND,
  DENOMINATOR,
  CONVEX_FEES,
  CURVE_FEES,
} from "./constants";
import { BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";

export function getCurrentEpoch(timestamp: BigInt): BigInt {
  return timestamp
    .div(BigInt.fromI32(EPOCH_DURATION))
    .times(BigInt.fromI32(EPOCH_DURATION));
}

export function getRoundNumber(eventTimestamp: BigInt): BigInt {
  if (
    eventTimestamp <
    getCurrentEpoch(eventTimestamp)
      .plus(BigInt.fromI32(ROUND_DURATION))
      .minus(BigInt.fromI32(DEADLINE_DURATION))
  ) {
    return getCurrentEpoch(eventTimestamp)
      .div(BigInt.fromI32(EPOCH_DURATION))
      .minus(BigInt.fromI32(VOTIUM_GENESIS_ROUND));
  } else {
    return getCurrentEpoch(eventTimestamp)
      .div(BigInt.fromI32(EPOCH_DURATION))
      .minus(BigInt.fromI32(1347));
  }
}

export function readValue<T>(
  callResult: ethereum.CallResult<T>,
  defaultValue: T
): T {
  return callResult.reverted ? defaultValue : callResult.value;
}

export function calculateRevenue(amount: BigInt, fees: BigInt): BigDecimal {
  const totalAmount = amount
    .toBigDecimal()
    .times(DENOMINATOR)
    .div(DENOMINATOR.minus(fees.toBigDecimal()));
  const revenue = totalAmount.minus(
    totalAmount.times(fees.toBigDecimal()).div(DENOMINATOR)
  );
  return revenue;
}

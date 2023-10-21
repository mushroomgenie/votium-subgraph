import { Address, BigInt } from "@graphprotocol/graph-ts";

export const GAUGE_CONTROLLER_ADDRESS = Address.fromString(
  "0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
);

export const EPOCH_DURATION = 86400 * 14;

export const ROUND_DURATION = 86400 * 5;

export const DEADLINE_DURATION = 60 * 60 * 6;

export const VOTIUM_GENESIS_ROUND = 1348;

export const BIGINT_ZERO = BigInt.fromI32(0);

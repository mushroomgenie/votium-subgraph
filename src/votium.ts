import { log, BigInt, dataSource } from "@graphprotocol/graph-ts";
import { NewIncentive as NewIncentiveEvent } from "../generated/Votium/Votium";
import { NewReward as NewRewardEvent } from "../generated/VotiumVeCRV/VotiumVeCRV";
import { Incentive, Round } from "../generated/schema";
import { getOrCreateRound, getOrCreateToken } from "./common/initializers";
import { calculateRevenue } from "./common/utils";
import * as constants from "./common/constants";

export function handleNewIncentive(event: NewIncentiveEvent): void {
  const round = getOrCreateRound(event.block.timestamp);
  if (!round.gauges.includes(event.params._gauge.toHexString())) {
    let gauges = round.gauges;
    round.gaugesCount = round.gaugesCount.plus(BigInt.fromI32(1));
    round.gauges = gauges;
    round.save();
  }
  const tokenEntity = getOrCreateToken(
    BigInt.fromString(round.roundNumber),
    event.params._token.toHexString()
  );
  const tokens = round.tokens;
  if (!round.tokens.includes(tokenEntity.id)) {
    tokenEntity.amount = tokenEntity.amount.plus(event.params._amount);
    tokenEntity.save();
    tokens.push(tokenEntity.id);
    round.tokens = tokens;
    round.save();
  } else {
    tokenEntity.amount = tokenEntity.amount.plus(event.params._amount);
    tokenEntity.save();
  }
  round.convexRevenue = round.convexRevenue.plus(
    calculateRevenue(event.params._amount, constants.CONVEX_FEES)
  );
  round.save();
  let testEntityId =
    event.transaction.hash.toString() + "-" + event.params._round.toString();
  let testEntity = Incentive.load(testEntityId);
  if (!testEntity) {
    testEntity = new Incentive(testEntityId);

    testEntity.token = event.params._token.toHexString();
    testEntity.amount = event.params._amount;
    testEntity.round = event.params._round.toI32();
    testEntity.gauge = event.params._gauge.toHexString();
    testEntity.maxPerVote = event.params._maxPerVote;
    testEntity.depositor = event.params._depositor.toHexString();
    // testEntity.excluded = event.params._excluded.map<Bytes>(
    //   (_excluded: Bytes) => _excluded
    // );
    testEntity.recycled = event.params._recycled;
    log.warning(
      "[NewIncentive]: Details Token:{} Amount:{} Round: {} maxPerVote:{} Depositor: {}",
      [
        event.params._token.toString(),
        event.params._amount.toString(),
        event.params._round.toString(),
        event.params._gauge.toString(),
        event.params._maxPerVote.toString(),
        event.params._depositor.toString(),
      ]
    );
    testEntity.save();
  }
}

export function handleNewReward(event: NewRewardEvent): void {
  const round = getOrCreateRound(event.block.timestamp);
  if (!round.gauges.includes(event.params._gauge.toHexString())) {
    let gauges = round.gauges;
    gauges.push(event.params._gauge.toHexString());
    round.gaugesCount = round.gaugesCount.plus(BigInt.fromI32(1));
    round.gauges = gauges;
    round.save();
  }
  const tokenEntity = getOrCreateToken(
    BigInt.fromString(round.roundNumber),
    event.params._token.toHexString()
  );
  const tokens = round.tokens;
  if (!round.tokens.includes(tokenEntity.id)) {
    tokenEntity.amount = tokenEntity.amount.plus(event.params._amount);
    tokenEntity.save();
    tokens.push(tokenEntity.id);
    round.tokens = tokens;
    round.save();
  } else {
    tokenEntity.amount = tokenEntity.amount.plus(event.params._amount);
    tokenEntity.save();
  }
  round.curveRevenue = round.curveRevenue.plus(
    calculateRevenue(event.params._amount, constants.CURVE_FEES)
  );
  round.save();
}

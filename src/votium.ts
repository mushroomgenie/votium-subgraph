import { Bytes, log, BigInt } from "@graphprotocol/graph-ts";
import { NewIncentive as NewIncentiveEvent } from "../generated/Votium/Votium";
import { NewReward as NewRewardEvent } from "../generated/VotiumVeCRV/VotiumVeCRV";
import { Incentive, Round } from "../generated/schema";
import * as utils from "./common/utils";
import * as constants from "./common/constants";

export function handleNewIncentive(event: NewIncentiveEvent): void {
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
  let roundNumber = utils.getRoundNumber(event.block.timestamp);
  let roundEntity = Round.load(roundNumber.toString());
  log.warning("[New Reward] Round Number", [roundNumber.toString()]);
  if (!roundEntity) {
    roundEntity = new Round(roundNumber.toString());
    roundEntity.roundNumber = roundNumber.toString();
    roundEntity.gauges = constants.BIGINT_ZERO;
    roundEntity.gauges = roundEntity.gauges.plus(BigInt.fromI32(1));
    roundEntity.save();
    log.warning("[ New Round ]: Round Number : {}", [roundNumber.toString()]);
  }
  roundEntity.gauges = roundEntity.gauges.plus(BigInt.fromI32(1));
  log.warning("[Gauge Added]: Gauge Address", [
    event.params._gauge.toHexString(),
  ]);
  roundEntity.save();
}

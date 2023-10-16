import { Bytes, log } from "@graphprotocol/graph-ts";
import { NewIncentive as NewIncentiveEvent } from "../generated/Votium/Votium";
import { Incentive } from "../generated/schema";
import { NewIncentive } from "../generated/Votium/Votium";
export function handleNewIncentive(event: NewIncentiveEvent): void {
  let testEntityId =
    event.transaction.hash.toString() + "-" + event.params._round.toString();
  let testEntity = Incentive.load(testEntityId);
  if (!testEntity) {
    testEntity = new Incentive(testEntityId);

    testEntity.token = event.params._token.toString();
    testEntity.amount = event.params._amount;
    testEntity.round = event.params._round.toI32();
    testEntity.gauge = event.params._gauge.toString();
    testEntity.maxPerVote = event.params._maxPerVote;
    testEntity.depositor = event.params._depositor.toString();
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

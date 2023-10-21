import { Bribed as BribeEvent } from "../generated/Bribe/Bribe";
import { Bribe } from "../generated/schema";

export function handleBribed(event: BribeEvent): void {
  let testEntityId =
    event.transaction.hash.toString() + "-" + event.params._proposal.toString();
  let testEntity = Bribe.load(testEntityId);
  if (!testEntity) {
    testEntity = new Bribe(testEntityId);

    testEntity.token = event.params._token.toHexString();
    testEntity.amount = event.params._amount;
    testEntity.proposal = event.params._proposal.toHexString();
    testEntity.choiceIndex = event.params._choiceIndex;
    testEntity.save();
  }
}

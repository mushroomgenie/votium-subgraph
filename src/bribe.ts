import { BigInt, log } from "@graphprotocol/graph-ts";
import { Bribed as BribeEvent } from "../generated/Bribe/Bribe";
import { ERC20 as ERC20Contract } from "../generated/Votium/ERC20";
import { Bribe } from "../generated/schema";
import { getOrCreateRound, getOrCreateToken } from "./common/initializers";
import { readValue } from "./common/utils";

export function handleBribed(event: BribeEvent): void {
  const round = getOrCreateRound(event.block.timestamp);
  if (!round.gauges.includes(event.params._proposal.toHexString())) {
    log.warning("[New Proposal] : base58 : {} hexString: {}", [
      event.params._proposal.toBase58(),
      event.params._proposal.toHexString(),
    ]);
    let gauges = round.gauges;
    gauges.push(event.params._proposal.toHexString());
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
  // const token = ERC20Contract.bind(event.params._token);
  // const symbol = readValue<String>(token.try_symbol(), "");
  // if (!round.tokens.includes(symbol.toString())) {
  //   let tokens = round.tokens;
  //   tokens.push(symbol.toString());
  //   round.tokens = tokens;
  //   round.save();
  // }
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

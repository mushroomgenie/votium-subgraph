import { BigInt, log } from "@graphprotocol/graph-ts";
import { Round } from "../../generated/schema";
import * as utils from "./utils";
import * as constants from "./constants";

export function getOrCreateRound(timestamp: BigInt): Round {
  let roundNumber = utils.getRoundNumber(timestamp);
  let roundEntity = Round.load(roundNumber.toString());
  if (!roundEntity) {
    roundEntity = new Round(roundNumber.toString());
    roundEntity.roundNumber = roundNumber.toString();
    roundEntity.gaugesCount = constants.BIGINT_ZERO;
    roundEntity.gaugesCount = roundEntity.gaugesCount.plus(BigInt.fromI32(1));
    roundEntity.save();
    log.warning("[ New Round ]: Round Number : {}", [roundNumber.toString()]);
  }
  return roundEntity;
}

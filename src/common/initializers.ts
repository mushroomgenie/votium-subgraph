import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Round, Token } from "../../generated/schema";
import { ERC20 as ERC20Contract } from "../../generated/Votium/ERC20";
import * as utils from "./utils";
import * as constants from "./constants";

export function getOrCreateRound(timestamp: BigInt): Round {
  let roundNumber = utils.getRoundNumber(timestamp);
  let roundEntity = Round.load(roundNumber.toString());
  if (!roundEntity) {
    roundEntity = new Round(roundNumber.toString());
    roundEntity.roundNumber = roundNumber.toString();
    roundEntity.gaugesCount = constants.BIGINT_ZERO;
    roundEntity.gauges = [];
    roundEntity.tokens = [];
    roundEntity.save();
    log.warning("[ New Round ]: Round Number : {}", [roundNumber.toString()]);
  }
  return roundEntity;
}

export function getOrCreateToken(
  roundNumber: BigInt,
  tokenAddress: string
): Token {
  let tokenId = tokenAddress.concat("-").concat(roundNumber.toString());
  let tokenEntity = Token.load(tokenId);
  const token = ERC20Contract.bind(Address.fromString(tokenAddress));
  const symbol = utils.readValue<String>(token.try_symbol(), "");
  if (!tokenEntity) {
    tokenEntity = new Token(tokenId);
    tokenEntity.symbol = symbol.toString();
    tokenEntity.amount = constants.BIGINT_ZERO;
    tokenEntity.save();
  }
  return tokenEntity;
}

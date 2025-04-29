use aiken/hash.{Blake2b_224, Hash}
use aiken/list
use aiken/transaction.{ScriptContext, Transaction}
use aiken/transaction/credential.{Address, VerificationKey}

type SupplyChainStatus {
  Harvested
  Processing
  Distribution
  Retail
  Sold
}

type HistoryEntry {
  status: SupplyChainStatus,
  location: ByteArray,
  handler: Address,
  timestamp: Int,
}

type SupplyChainDatum {
  product_id: ByteArray,
  current_status: SupplyChainStatus,
  current_location: ByteArray,
  current_handler: Address,
  history: List<HistoryEntry>,
  last_updated: Int,
}

type Action {
  Update
  Transfer
  Complete
}

type SupplyChainRedeemer {
  action: Action,
  new_status: Option<SupplyChainStatus>,
  new_location: Option<ByteArray>,
  new_handler: Option<Address>,
}

validator {
  fn supply_chain(datum: SupplyChainDatum, redeemer: SupplyChainRedeemer, context: ScriptContext) -> Bool {
    let Transaction { inputs, outputs, .. } = context.transaction
    
    when redeemer.action is {
      Update -> {
        // For update, ensure the current handler is the signer
        let signer_hash = transaction.find_first_signer(context)
        expect Some(signer) = signer_hash
        
        // Check if the signer is the current handler
        credential.from_verification_key(signer) == datum.current_handler
      }
      
      Transfer -> {
        // For transfer, ensure the current handler is the signer and new handler is provided
        let signer_hash = transaction.find_first_signer(context)
        expect Some(signer) = signer_hash
        expect Some(new_handler) = redeemer.new_handler
        
        // Check if the signer is the current handler
        credential.from_verification_key(signer) == datum.current_handler
      }
      
      Complete -> {
        // For completing the supply chain, ensure the current handler is the signer
        // and the current status is not already Sold
        let signer_hash = transaction.find_first_signer(context)
        expect Some(signer) = signer_hash
        
        // Check if the signer is the current handler and status is not Sold
        credential.from_verification_key(signer) == datum.current_handler && 
        datum.current_status != Sold
      }
    }
  }
}

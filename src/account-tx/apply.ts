/**
 * Account Transaction Dispatcher
 * Routes AccountTx to appropriate handlers (like entity-tx/apply.ts pattern)
 */

import { AccountMachine, AccountTx } from '../types';
import { handleAddDelta } from './handlers/add-delta';
import { handleSetCreditLimit } from './handlers/set-credit-limit';
import { handleDirectPayment } from './handlers/direct-payment';

/**
 * Process single AccountTx through bilateral consensus
 * @param accountMachine - The account machine state
 * @param accountTx - The transaction to process
 * @param isOurFrame - Whether we're processing our own frame (vs counterparty's)
 * @returns Result with success, events, and optional error
 */
export function processAccountTx(
  accountMachine: AccountMachine,
  accountTx: AccountTx,
  isOurFrame: boolean = true
): { success: boolean; events: string[]; error?: string } {
  console.log(`🔄 Processing ${accountTx.type} for ${accountMachine.counterpartyEntityId.slice(-4)} (ourFrame: ${isOurFrame})`);

  // Route to appropriate handler based on transaction type
  switch (accountTx.type) {
    case 'add_delta':
      return handleAddDelta(accountMachine, accountTx, isOurFrame);

    case 'set_credit_limit':
      return handleSetCreditLimit(accountMachine, accountTx, isOurFrame);

    case 'direct_payment':
      return handleDirectPayment(accountMachine, accountTx, isOurFrame);

    case 'account_payment':
      // Legacy type - not used in new implementation
      console.warn(`⚠️ account_payment type is deprecated`);
      return { success: true, events: [] };

    case 'account_settle':
      // Blockchain settlement - handled separately in entity-tx/handlers/account.ts
      console.log(`💰 account_settle processed externally`);
      return { success: true, events: [`⚖️ Settlement processed`] };

    case 'account_frame':
      // This should never be called - frames are handled by frame-level consensus
      console.error(`❌ FATAL: account_frame should not be in accountTxs array!`);
      return { success: false, error: 'account_frame is not a transaction type', events: [] };

    default:
      // Type-safe error handling for unknown AccountTx types
      return { success: false, error: `Unknown accountTx type`, events: [] };
  }
}

/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function __wbg_wasmblockchain_free(a: number): void;
export function wasmblockchain_new(a: number, b: number, c: number, d: number): number;
export function wasmblockchain_fullSync(a: number, b: number): number;
export function wasmblockchain_getFeesEstimation(a: number): number;
export function wasmblockchain_broadcastPsbt(a: number, b: number): number;
export function __wbg_wasmmnemonic_free(a: number): void;
export function wasmmnemonic_new(a: number, b: number): void;
export function wasmmnemonic_fromString(a: number, b: number, c: number): void;
export function wasmmnemonic_asString(a: number, b: number): void;
export function wasmmnemonic_asWords(a: number, b: number): void;
export function getWordsAutocomplete(a: number, b: number, c: number): void;
export function __wbg_wasmtxbuilder_free(a: number): void;
export function __wbg_wasmrecipient_free(a: number): void;
export function __wbg_get_wasmrecipient_0(a: number, b: number): void;
export function __wbg_set_wasmrecipient_0(a: number, b: number, c: number): void;
export function __wbg_get_wasmrecipient_1(a: number, b: number): void;
export function __wbg_set_wasmrecipient_1(a: number, b: number, c: number): void;
export function __wbg_get_wasmrecipient_2(a: number): number;
export function __wbg_set_wasmrecipient_2(a: number, b: number): void;
export function __wbg_get_wasmrecipient_3(a: number): number;
export function __wbg_set_wasmrecipient_3(a: number, b: number): void;
export function wasmtxbuilder_new(): number;
export function wasmtxbuilder_setAccount(a: number, b: number): number;
export function wasmtxbuilder_clearRecipients(a: number): number;
export function wasmtxbuilder_addRecipient(a: number): number;
export function wasmtxbuilder_removeRecipient(a: number, b: number): number;
export function wasmtxbuilder_updateRecipient(a: number, b: number, c: number, d: number, e: number, f: number, g: number): number;
export function wasmtxbuilder_updateRecipientAmountToMax(a: number, b: number): number;
export function wasmtxbuilder_getRecipients(a: number, b: number): void;
export function wasmtxbuilder_addUtxoToSpend(a: number, b: number, c: number): void;
export function wasmtxbuilder_removeUtxoToSpend(a: number, b: number, c: number): void;
export function wasmtxbuilder_clearUtxosToSpend(a: number): number;
export function wasmtxbuilder_getUtxosToSpend(a: number, b: number): void;
export function wasmtxbuilder_setCoinSelection(a: number, b: number): number;
export function wasmtxbuilder_getCoinSelection(a: number): number;
export function wasmtxbuilder_enableRbf(a: number): number;
export function wasmtxbuilder_disableRbf(a: number): number;
export function wasmtxbuilder_getRbfEnabled(a: number): number;
export function wasmtxbuilder_setChangePolicy(a: number, b: number): number;
export function wasmtxbuilder_getChangePolicy(a: number): number;
export function wasmtxbuilder_setFeeRate(a: number, b: number): number;
export function wasmtxbuilder_getFeeRate(a: number, b: number): void;
export function wasmtxbuilder_addLocktime(a: number, b: number): number;
export function wasmtxbuilder_removeLocktime(a: number): number;
export function wasmtxbuilder_getLocktime(a: number): number;
export function wasmtxbuilder_createPsbt(a: number, b: number): number;
export function __wbg_detailledwasmerror_free(a: number): void;
export function __wbg_get_detailledwasmerror_kind(a: number): number;
export function __wbg_set_detailledwasmerror_kind(a: number, b: number): void;
export function __wbg_get_detailledwasmerror_details(a: number): number;
export function __wbg_set_detailledwasmerror_details(a: number, b: number): void;
export function __wbg_wasmusersettings_free(a: number): void;
export function __wbg_get_wasmusersettings_BitcoinUnit(a: number): number;
export function __wbg_set_wasmusersettings_BitcoinUnit(a: number, b: number): void;
export function __wbg_get_wasmusersettings_FiatCurrency(a: number): number;
export function __wbg_set_wasmusersettings_FiatCurrency(a: number, b: number): void;
export function __wbg_get_wasmusersettings_HideEmptyUsedAddresses(a: number): number;
export function __wbg_set_wasmusersettings_HideEmptyUsedAddresses(a: number, b: number): void;
export function __wbg_get_wasmusersettings_ShowWalletRecovery(a: number): number;
export function __wbg_set_wasmusersettings_ShowWalletRecovery(a: number, b: number): void;
export function __wbg_get_wasmusersettings_TwoFactorAmountThreshold(a: number, b: number): void;
export function __wbg_set_wasmusersettings_TwoFactorAmountThreshold(a: number, b: number, c: number): void;
export function __wbg_wasmsettingsclient_free(a: number): void;
export function wasmsettingsclient_getUserSettings(a: number): number;
export function wasmsettingsclient_setBitcoinUnit(a: number, b: number): number;
export function wasmsettingsclient_setFiatCurrency(a: number, b: number): number;
export function wasmsettingsclient_setTwoFaThreshold(a: number, b: number): number;
export function wasmsettingsclient_setHideEmptyUsedAddresses(a: number, b: number): number;
export function __wbg_wasmlocktime_free(a: number): void;
export function wasmlocktime_fromHeight(a: number): number;
export function wasmlocktime_fromSeconds(a: number): number;
export function wasmlocktime_isBlockHeight(a: number): number;
export function wasmlocktime_isBlockTime(a: number): number;
export function wasmlocktime_toConsensusU32(a: number): number;
export function __wbg_get_wasmpagination_skip(a: number): number;
export function __wbg_set_wasmpagination_skip(a: number, b: number): void;
export function __wbg_get_wasmpagination_take(a: number): number;
export function __wbg_set_wasmpagination_take(a: number, b: number): void;
export function wasmpagination_new(a: number, b: number): number;
export function __wbg_wasmutxo_free(a: number): void;
export function __wbg_get_wasmutxo_value(a: number): number;
export function __wbg_set_wasmutxo_value(a: number, b: number): void;
export function __wbg_get_wasmutxo_outpoint(a: number): number;
export function __wbg_set_wasmutxo_outpoint(a: number, b: number): void;
export function __wbg_get_wasmutxo_script_pubkey(a: number): number;
export function __wbg_set_wasmutxo_script_pubkey(a: number, b: number): void;
export function __wbg_get_wasmutxo_keychain(a: number): number;
export function __wbg_set_wasmutxo_keychain(a: number, b: number): void;
export function __wbg_get_wasmutxo_is_spent(a: number): number;
export function __wbg_set_wasmutxo_is_spent(a: number, b: number): void;
export function __wbg_wasmpagination_free(a: number): void;
export function __wbg_wasmnetworkclient_free(a: number): void;
export function wasmnetworkclient_getNetwork(a: number): number;
export function __wbg_wasmauthdata_free(a: number): void;
export function __wbg_get_wasmauthdata_uid(a: number, b: number): void;
export function __wbg_set_wasmauthdata_uid(a: number, b: number, c: number): void;
export function __wbg_get_wasmauthdata_access(a: number, b: number): void;
export function __wbg_set_wasmauthdata_access(a: number, b: number, c: number): void;
export function __wbg_get_wasmauthdata_refresh(a: number, b: number): void;
export function __wbg_set_wasmauthdata_refresh(a: number, b: number, c: number): void;
export function __wbg_get_wasmauthdata_scopes(a: number, b: number): void;
export function __wbg_set_wasmauthdata_scopes(a: number, b: number, c: number): void;
export function wasmauthdata_new(a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number): number;
export function __wbg_wasmprotonwalletapiclient_free(a: number): void;
export function wasmprotonwalletapiclient_new(a: number, b: number): void;
export function wasmprotonwalletapiclient_login(a: number): number;
export function wasmprotonwalletapiclient_settings(a: number): number;
export function wasmprotonwalletapiclient_network(a: number): number;
export function wasmprotonwalletapiclient_wallet(a: number): number;
export function __wbg_wasmpsbtrecipient_free(a: number): void;
export function __wbg_get_wasmpsbtrecipient_0(a: number, b: number): void;
export function __wbg_set_wasmpsbtrecipient_0(a: number, b: number, c: number): void;
export function __wbg_wasmpartiallysignedtransaction_free(a: number): void;
export function __wbg_get_wasmpartiallysignedtransaction_recipients(a: number, b: number): void;
export function __wbg_set_wasmpartiallysignedtransaction_recipients(a: number, b: number, c: number): void;
export function wasmpartiallysignedtransaction_sign(a: number, b: number, c: number, d: number): void;
export function __wbg_wasmbalance_free(a: number): void;
export function __wbg_get_wasmbalance_immature(a: number): number;
export function __wbg_set_wasmbalance_immature(a: number, b: number): void;
export function __wbg_get_wasmbalance_trusted_pending(a: number): number;
export function __wbg_set_wasmbalance_trusted_pending(a: number, b: number): void;
export function __wbg_get_wasmbalance_untrusted_pending(a: number): number;
export function __wbg_set_wasmbalance_untrusted_pending(a: number, b: number): void;
export function __wbg_get_wasmbalance_confirmed(a: number): number;
export function __wbg_set_wasmbalance_confirmed(a: number, b: number): void;
export function __wbg_wasmderivationpath_free(a: number): void;
export function wasmderivationpath_new(a: number, b: number, c: number): void;
export function wasmderivationpath_fromRawTs(a: number): number;
export function wasmderivationpath_fromParts(a: number, b: number, c: number): number;
export function wasmderivationpath_fromString(a: number, b: number, c: number): void;
export function setPanicHook(): void;
export function __wbg_set_wasmpsbtrecipient_1(a: number, b: number): void;
export function __wbg_set_wasmpartiallysignedtransaction_total_fees(a: number, b: number): void;
export function __wbg_get_wasmpsbtrecipient_1(a: number): number;
export function __wbg_get_wasmpartiallysignedtransaction_total_fees(a: number): number;
export function __wbg_wasmwalletclient_free(a: number): void;
export function __wbg_wasmwalletdata_free(a: number): void;
export function __wbg_get_wasmwalletdata_Wallet(a: number): number;
export function __wbg_set_wasmwalletdata_Wallet(a: number, b: number): void;
export function __wbg_get_wasmwalletdata_WalletKey(a: number): number;
export function __wbg_set_wasmwalletdata_WalletKey(a: number, b: number): void;
export function __wbg_get_wasmwalletdata_WalletSettings(a: number): number;
export function __wbg_set_wasmwalletdata_WalletSettings(a: number, b: number): void;
export function wasmwalletdata_from_parts(a: number, b: number, c: number): number;
export function __wbg_wasmwalletaccountdata_free(a: number): void;
export function __wbg_get_wasmwalletaccountdata_Account(a: number): number;
export function __wbg_set_wasmwalletaccountdata_Account(a: number, b: number): void;
export function __wbg_wasmwallettransaction_free(a: number): void;
export function __wbg_get_wasmwallettransaction_WalletID(a: number, b: number): void;
export function __wbg_set_wasmwallettransaction_WalletID(a: number, b: number, c: number): void;
export function __wbg_get_wasmwallettransaction_Label(a: number, b: number): void;
export function __wbg_set_wasmwallettransaction_Label(a: number, b: number, c: number): void;
export function __wbg_get_wasmwallettransaction_TransactionID(a: number, b: number): void;
export function __wbg_set_wasmwallettransaction_TransactionID(a: number, b: number, c: number): void;
export function __wbg_wasmwalletdataarray_free(a: number): void;
export function __wbg_get_wasmwalletdataarray_0(a: number, b: number): void;
export function __wbg_set_wasmwalletdataarray_0(a: number, b: number, c: number): void;
export function __wbg_wasmwalletaccountarray_free(a: number): void;
export function __wbg_get_wasmwalletaccountarray_0(a: number, b: number): void;
export function __wbg_set_wasmwalletaccountarray_0(a: number, b: number, c: number): void;
export function __wbg_wasmwallettransactionarray_free(a: number): void;
export function __wbg_get_wasmwallettransactionarray_0(a: number, b: number): void;
export function __wbg_set_wasmwallettransactionarray_0(a: number, b: number, c: number): void;
export function wasmwalletclient_getWallets(a: number): number;
export function wasmwalletclient_createWallet(a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number): number;
export function wasmwalletclient_getWalletAccounts(a: number, b: number, c: number): number;
export function wasmwalletclient_createWalletAccount(a: number, b: number, c: number, d: number, e: number, f: number, g: number): number;
export function wasmwalletclient_updateWalletAccountLabel(a: number, b: number, c: number, d: number, e: number, f: number, g: number): number;
export function wasmwalletclient_deleteWalletAccount(a: number, b: number, c: number, d: number, e: number): number;
export function wasmwalletclient_getWalletTransactions(a: number, b: number, c: number): number;
export function wasmwalletclient_createWalletTransaction(a: number, b: number, c: number, d: number, e: number, f: number, g: number): number;
export function wasmwalletclient_updateWalletTransactionLabel(a: number, b: number, c: number, d: number, e: number, f: number, g: number): number;
export function wasmwalletclient_deleteWalletTransaction(a: number, b: number, c: number, d: number, e: number): number;
export function __wbg_wasmaccount_free(a: number): void;
export function wasmaccount_getBitcoinUri(a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number): void;
export function wasmaccount_owns(a: number, b: number, c: number): void;
export function wasmaccount_getBalance(a: number, b: number): void;
export function wasmaccount_getDerivationPath(a: number, b: number): void;
export function wasmaccount_getUtxos(a: number, b: number): void;
export function wasmaccount_getTransactions(a: number, b: number, c: number): void;
export function wasmaccount_getTransaction(a: number, b: number, c: number, d: number): void;
export function __wbg_wasmpaymentlink_free(a: number): void;
export function __wbg_wasmonchainpaymentlink_free(a: number): void;
export function __wbg_get_wasmonchainpaymentlink_address(a: number, b: number): void;
export function __wbg_set_wasmonchainpaymentlink_address(a: number, b: number, c: number): void;
export function __wbg_get_wasmonchainpaymentlink_amount(a: number, b: number): void;
export function __wbg_set_wasmonchainpaymentlink_amount(a: number, b: number, c: number): void;
export function __wbg_get_wasmonchainpaymentlink_message(a: number, b: number): void;
export function __wbg_set_wasmonchainpaymentlink_message(a: number, b: number, c: number): void;
export function __wbg_get_wasmonchainpaymentlink_label(a: number, b: number): void;
export function __wbg_set_wasmonchainpaymentlink_label(a: number, b: number, c: number): void;
export function wasmpaymentlink_toString(a: number, b: number): void;
export function wasmpaymentlink_toUri(a: number, b: number): void;
export function wasmpaymentlink_tryParse(a: number, b: number, c: number, d: number): void;
export function wasmpaymentlink_getKind(a: number): number;
export function wasmpaymentlink_assumeOnchain(a: number): number;
export function __wbg_wasmaddress_free(a: number): void;
export function wasmaddress_new(a: number, b: number, c: number, d: number): void;
export function wasmaddress_fromScript(a: number, b: number, c: number): void;
export function wasmaddress_toString(a: number, b: number): void;
export function wasmaddress_intoScript(a: number): number;
export function __wbg_wasmaddressinfo_free(a: number): void;
export function wasmaddressinfo_index(a: number): number;
export function wasmaddressinfo_to_string(a: number, b: number): void;
export function __wbg_wasmscript_free(a: number): void;
export function __wbg_get_wasmscript_0(a: number, b: number): void;
export function wasmscript_toAddress(a: number, b: number, c: number): void;
export function __wbg_wasmoutpoint_free(a: number): void;
export function __wbg_get_wasmoutpoint_0(a: number, b: number): void;
export function __wbg_set_wasmoutpoint_0(a: number, b: number, c: number): void;
export function wasmoutpoint_fromRawTs(a: number): number;
export function __wbg_wasmsequence_free(a: number): void;
export function __wbg_get_wasmsequence_0(a: number): number;
export function __wbg_set_wasmsequence_0(a: number, b: number): void;
export function __wbg_wasmtxin_free(a: number): void;
export function __wbg_get_wasmtxin_previous_output(a: number): number;
export function __wbg_set_wasmtxin_previous_output(a: number, b: number): void;
export function __wbg_get_wasmtxin_script_sig(a: number): number;
export function __wbg_set_wasmtxin_script_sig(a: number, b: number): void;
export function __wbg_get_wasmtxin_sequence(a: number): number;
export function __wbg_set_wasmtxin_sequence(a: number, b: number): void;
export function __wbg_wasmtxout_free(a: number): void;
export function __wbg_get_wasmtxout_script_pubkey(a: number): number;
export function __wbg_set_wasmtxout_script_pubkey(a: number, b: number): void;
export function __wbg_get_wasmtxout_address(a: number): number;
export function __wbg_set_wasmtxout_address(a: number, b: number): void;
export function __wbg_get_wasmtxout_is_mine(a: number): number;
export function __wbg_set_wasmtxout_is_mine(a: number, b: number): void;
export function __wbg_wasmtransactiondetails_free(a: number): void;
export function __wbg_get_wasmtransactiondetails_inputs(a: number, b: number): void;
export function __wbg_set_wasmtransactiondetails_inputs(a: number, b: number, c: number): void;
export function __wbg_get_wasmtransactiondetails_outputs(a: number, b: number): void;
export function __wbg_set_wasmtransactiondetails_outputs(a: number, b: number, c: number): void;
export function wasmtransactiondetails_fromPsbt(a: number, b: number): number;
export function __wbg_wasmblocktime_free(a: number): void;
export function __wbg_get_wasmblocktime_height(a: number): number;
export function __wbg_set_wasmblocktime_height(a: number, b: number): void;
export function __wbg_get_wasmblocktime_timestamp(a: number): number;
export function __wbg_set_wasmblocktime_timestamp(a: number, b: number): void;
export function __wbg_wasmsimpletransaction_free(a: number): void;
export function __wbg_get_wasmsimpletransaction_txid(a: number, b: number): void;
export function __wbg_set_wasmsimpletransaction_txid(a: number, b: number, c: number): void;
export function __wbg_get_wasmsimpletransaction_received(a: number): number;
export function __wbg_set_wasmsimpletransaction_received(a: number, b: number): void;
export function __wbg_get_wasmsimpletransaction_sent(a: number): number;
export function __wbg_set_wasmsimpletransaction_sent(a: number, b: number): void;
export function __wbg_get_wasmsimpletransaction_confirmation_time(a: number): number;
export function __wbg_set_wasmsimpletransaction_confirmation_time(a: number, b: number): void;
export function __wbg_get_wasmsimpletransaction_account_key(a: number): number;
export function __wbg_set_wasmsimpletransaction_account_key(a: number, b: number): void;
export function __wbg_wasmwallet_free(a: number): void;
export function wasmwallet_new(a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number): void;
export function wasmwallet_addAccount(a: number, b: number, c: number, d: number): void;
export function wasmwallet_getAccount(a: number, b: number): number;
export function wasmwallet_getBalance(a: number): number;
export function wasmwallet_getTransactions(a: number, b: number): number;
export function wasmwallet_getTransaction(a: number, b: number, c: number, d: number): number;
export function wasmwallet_getFingerprint(a: number, b: number): void;
export function __wbg_set_wasmtxout_value(a: number, b: number): void;
export function __wbg_set_wasmtransactiondetails_received(a: number, b: number): void;
export function __wbg_set_wasmtransactiondetails_sent(a: number, b: number): void;
export function __wbg_set_wasmtransactiondetails_fee(a: number, b: number, c: number): void;
export function __wbg_set_wasmsimpletransaction_fees(a: number, b: number, c: number): void;
export function __wbg_get_wasmtxout_value(a: number): number;
export function __wbg_get_wasmtransactiondetails_received(a: number): number;
export function __wbg_get_wasmtransactiondetails_sent(a: number): number;
export function __wbg_set_wasmtransactiondetails_confirmation_time(a: number, b: number): void;
export function __wbg_get_wasmwallettransaction_ID(a: number, b: number): void;
export function __wbg_get_wasmtransactiondetails_txid(a: number, b: number): void;
export function __wbg_get_wasmtransactiondetails_confirmation_time(a: number): number;
export function __wbg_set_wasmwallettransaction_ID(a: number, b: number, c: number): void;
export function __wbg_set_wasmscript_0(a: number, b: number, c: number): void;
export function __wbg_set_wasmtransactiondetails_txid(a: number, b: number, c: number): void;
export function __wbg_get_wasmtransactiondetails_fee(a: number, b: number): void;
export function __wbg_get_wasmsimpletransaction_fees(a: number, b: number): void;
export function rustsecp256k1_v0_8_1_context_create(a: number): number;
export function rustsecp256k1_v0_8_1_context_destroy(a: number): void;
export function rustsecp256k1_v0_8_1_default_illegal_callback_fn(a: number, b: number): void;
export function rustsecp256k1_v0_8_1_default_error_callback_fn(a: number, b: number): void;
export function __wbindgen_malloc(a: number, b: number): number;
export function __wbindgen_realloc(a: number, b: number, c: number, d: number): number;
export const __wbindgen_export_2: WebAssembly.Table;
export function wasm_bindgen__convert__closures__invoke1_mut__h7fd1822e72fd5537(a: number, b: number, c: number): void;
export function __wbindgen_add_to_stack_pointer(a: number): number;
export function __wbindgen_free(a: number, b: number, c: number): void;
export function __wbindgen_exn_store(a: number): void;
export function wasm_bindgen__convert__closures__invoke2_mut__hd329ec3002bd13ed(a: number, b: number, c: number, d: number): void;

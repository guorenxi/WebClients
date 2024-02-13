import { ChallengeResult } from '@proton/components';
import { VerificationModel } from '@proton/components/containers/api/humanVerification/interface';
import { AddressGeneration, AppIntent, AuthSession } from '@proton/components/containers/login/interface';
import { SelectedProductPlans } from '@proton/components/containers/payments/subscription/PlanSelection';
import { PAYMENT_METHOD_TYPES, SavedPaymentMethod } from '@proton/components/payments/core';
import { BillingAddress, TokenPaymentWithPaymentsVersion } from '@proton/components/payments/core/interface';
import { ProductParam } from '@proton/shared/lib/apps/product';
import { AuthResponse } from '@proton/shared/lib/authentication/interface';
import { APPS, APP_NAMES, CLIENT_TYPES } from '@proton/shared/lib/constants';
import {
    Address,
    Api,
    Currency,
    Cycle,
    FreePlanDefault,
    HumanVerificationMethodType,
    KeyTransparencyActivation,
    Organization,
    Plan,
    PlansMap,
    Subscription,
    SubscriptionCheckResponse,
    User,
    VPNServersCountData,
} from '@proton/shared/lib/interfaces';

export enum SignupSteps {
    NoSignup = 'no-signup',
    AccountCreationUsername = 'account-creation-username',
    SaveRecovery = 'save-recovery',
    Congratulations = 'congratulations',
    Upsell = 'plans',
    Payment = 'payment',
    HumanVerification = 'human-verification',
    CreatingAccount = 'creating-account',
    TrialPlan = 'trial-plan',
    Explore = 'explore',
    Done = 'done',
    SetupAddress = 'setup-address',
}

export const SERVICES: { [key: string]: APP_NAMES } = {
    mail: APPS.PROTONMAIL,
    calendar: APPS.PROTONCALENDAR,
    drive: APPS.PROTONDRIVE,
    vpn: APPS.PROTONVPN_SETTINGS,
    pass: APPS.PROTONPASS,
};

export interface PlanIDs {
    [planID: string]: number;
}

export interface SessionData {
    UID: string;
    localID: number;
    user: User;
    keyPassword?: string;
    persistent: boolean;
    trusted: boolean;
    clientKey: string;
    paymentMethods: SavedPaymentMethod[] | undefined;
    defaultPaymentMethod: PAYMENT_METHOD_TYPES | undefined;
    subscription: Subscription | undefined;
    organization: Organization | undefined;
    state: {
        payable: boolean;
        admin: boolean;
        subscribed: boolean;
        access: boolean;
    };
}

export interface SubscriptionData {
    currency: Currency;
    cycle: Cycle;
    minimumCycle?: Cycle;
    skipUpsell?: boolean;
    planIDs: PlanIDs;
    checkResult: SubscriptionCheckResponse;
    payment?: TokenPaymentWithPaymentsVersion;
    type?: 'cc' | 'pp' | 'btc';
    billingAddress: BillingAddress;
}

export interface ReferralData {
    invite: string;
    referrer: string;
}

export enum SignupType {
    Email = 1,
    Username,
}

export interface SignupModel {
    freePlan: FreePlanDefault;
    inviteData: InviteData | undefined;
    referralData: ReferralData | undefined;
    subscriptionData: SubscriptionData;
    domains: string[];
    plans: Plan[];
    plansMap: PlansMap;
    humanVerificationMethods: HumanVerificationMethodType[];
    humanVerificationToken: string;
    selectedProductPlans: SelectedProductPlans;
    vpnServersCountData: VPNServersCountData;
}

export class HumanVerificationError extends Error {
    methods: HumanVerificationMethodType[];

    token: string;

    constructor(methods: HumanVerificationMethodType[], token: string) {
        super('HumanVerificationError');
        this.methods = methods;
        this.token = token;
        Object.setPrototypeOf(this, HumanVerificationError.prototype);
    }
}

export interface InviteData {
    selector: string;
    token: string;
}

interface BaseAccountData {
    username: string;
    domain: string;
    email: string;
    password: string;
    payload: ChallengeResult;
}

export type AccountData = BaseAccountData & {
    signupType: SignupType;
};

export enum HumanVerificationTrigger {
    ExternalCheck,
    UserCreation,
}

export interface HumanVerificationData {
    title: string;
    methods: HumanVerificationMethodType[];
    token: string;
    trigger: HumanVerificationTrigger;
}

export interface MnemonicData {
    mnemonic: string;
    blob: Blob;
}

export interface SetupData {
    user: User;
    addresses: Address[];
    keyPassword: string | undefined;
    clientKey: string;
    authResponse: AuthResponse;
    api: Api;
    mnemonicData?: MnemonicData;
}

export interface UserData {
    User: User;
}

export interface UserCacheResult {
    type: 'user';
    setupData?: {
        mnemonicData?: MnemonicData;
    };
    subscriptionData: SubscriptionData;
    session: SessionData;
}

export interface SignupCacheResult {
    type: 'signup';
    appIntent?: AppIntent;
    productParam: ProductParam;
    userData?: UserData;
    setupData?: SetupData;
    accountData: AccountData;
    subscriptionData: SubscriptionData;
    ktActivation: KeyTransparencyActivation;
    appName: APP_NAMES;
    inviteData: InviteData | undefined;
    referralData: ReferralData | undefined;
    addressGeneration?: AddressGeneration;
    persistent: boolean;
    trusted: boolean;
    clientType: CLIENT_TYPES;
    ignoreExplore: boolean;
    humanVerificationData?: HumanVerificationData;
    humanVerificationResult?: {
        tokenType: HumanVerificationMethodType;
        token: string;
        verificationModel?: VerificationModel;
    };
}

export interface SignupActionContinueResponse {
    cache: SignupCacheResult;
    to: Exclude<SignupSteps, SignupSteps.Done>;
}

export interface SignupActionDoneResponse {
    cache: SignupCacheResult;
    to: SignupSteps.Done;
    session: AuthSession;
}

export type SignupActionResponse = SignupActionDoneResponse | SignupActionContinueResponse;

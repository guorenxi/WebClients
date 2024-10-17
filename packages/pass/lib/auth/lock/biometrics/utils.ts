import { BIOMETRICS_KEY } from '@proton/pass/constants';
import type { AuthStore } from '@proton/pass/lib/auth/store';

export const BIOMETRICS_KEY_VERSION = 2;
export const BIOMETRICS_KEY_VERSION_PREFIX = `BIOMETRICS::V${BIOMETRICS_KEY_VERSION}::`;
export const BIOMETRICS_KEY_RE = /BIOMETRICS::V(\d+)::(.+)/;

type BiometricEncryptedOfflineKD = { key: string; version: number };

export const intoBiometricsEncryptedOfflineKD = (encryptedOfflineKD: string) =>
    `${BIOMETRICS_KEY_VERSION_PREFIX}${encryptedOfflineKD}`;

/** Extracts the version and key from a biometric encrypted offline key. */
export const fromBiometricsEncryptedOfflineKD = (encryptedOfflineKD: string): BiometricEncryptedOfflineKD => {
    const match = encryptedOfflineKD.match(BIOMETRICS_KEY_RE);
    return match ? { key: match[2], version: parseInt(match[1], 10) } : { key: encryptedOfflineKD, version: 1 };
};

/** Starting from >= 1.24.0 */
export const getBiometricsStorageKey = (localID: number) => `${BIOMETRICS_KEY}::${localID}`;

/** Resolves the biometric storage key based on the encrypted offline key.
 * For encrypted offline keys created before account switching (< v1.24.0),
 * the keys are not prefixed and are detected as version 1. In such cases,
 * it uses the non-indexed BIOMETRICS_KEY. Starting from v1.24.0, the function
 * parses and extracts the encrypted key, appending the localID. */
export const inferBiometricsStorageKey = (authStore: AuthStore): string => {
    const localID = authStore.getLocalID();
    if (localID === undefined) throw new Error('Missing LocalID');

    const encryptedOfflineKD = authStore.getEncryptedOfflineKD();
    if (!encryptedOfflineKD) throw new Error('Missing encrypted offline key');

    const { version } = fromBiometricsEncryptedOfflineKD(encryptedOfflineKD);
    if (version === 1) return BIOMETRICS_KEY;
    else return getBiometricsStorageKey(localID);
};

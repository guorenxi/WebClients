/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Drive decryption issues
 */
export interface HttpsProtonMeDriveIntegrityDecryptionErrorsTotalV1SchemaJson {
  Labels: {
    entity: "share" | "node";
    shareType: "main" | "device" | "photo" | "shared" | "shared_public";
    fromBefore2024: "yes" | "no" | "unknown";
  };
  Value: number;
}

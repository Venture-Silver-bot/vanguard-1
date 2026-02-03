export interface EvidenceInput {
    name: string;
    value: any;
    citation: {
        source: string;
        location: string;
        rawString: string;
    };
}

export interface EvidenceBundle {
    header: {
        bundleId: string;
        timestamp: string;
        schemaVersion: string;
        integrityMode: "Passive-Recorder" | "Active-Enforcer";
    };
    deterministicLayer: {
        logicBlock: {
            id: string;
            version: string;
            hash: string;
            blessedBy: string;
            blessedAt: string;
        };
        inputs: EvidenceInput[];
        executionResult: {
            output: any;
            sandboxSignature: string;
        };
    };
    interpretiveLayer: {
        summary: string;
        disclaimer: string;
    };
}

export class EvidenceBundler {
    /**
     * Generates a unique bundle ID.
     */
    generateBundleId(): string {
        const date = new Date().toISOString().split('T')[0]?.replace(/-/g, '') || "00000000";
        const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        return `SAAE-${date}-${random}`;
    }

    /**
     * Creates an evidence bundle.
     */
    createBundle(
        logicBlock: any,
        inputs: EvidenceInput[],
        result: any,
        signature: string,
        summary: string
    ): EvidenceBundle {
        return {
            header: {
                bundleId: this.generateBundleId(),
                timestamp: new Date().toISOString(),
                schemaVersion: "1.0",
                integrityMode: "Passive-Recorder"
            },
            deterministicLayer: {
                logicBlock: {
                    id: logicBlock.id,
                    version: logicBlock.version,
                    hash: logicBlock.hash,
                    blessedBy: logicBlock.metadata.owner || "Vanguard-1",
                    blessedAt: logicBlock.approval_history?.[0]?.timestamp || new Date().toISOString()
                },
                inputs,
                executionResult: {
                    output: result,
                    sandboxSignature: signature
                }
            },
            interpretiveLayer: {
                summary,
                disclaimer: "CRITICAL: This summary is AI-generated for convenience. The underlying Logic Block Hash is the sole source of truth."
            }
        };
    }
}

export type FormInformationTable = {
    id: number;
    totalFacts: number;
    version: string;

    primary: {
        standard: number;
        standardPerc: string;
        custom: number;
        customPerc: string;
        total: number;
    };
    axis: {
        standard: number;
        standardPerc: string;
        custom: number;
        customPerc: string;
        total: number;
    };
    member: {
        standard: number;
        standardPerc: string;
        custom: number;
        customPerc: string;
        total: number;
    };

    total: {
        standard: number;
        stardardPerc: string;
        custom: number;
        customPerc: string;
        total: number;
    };

    inlineDocument: Array<string>;

    schema: Array<string>;

    label: Array<string>;

    calculation: Array<string>;

    presentation: Array<string>;

    definition: Array<string>;

    taxonomy: {
        [key: string]: string;
    }
};

type ValidatorHandler<T> = (host: T) => boolean;
type ValidatorMessageFormat<T> = (host: T) => string;
/** @ignore */
export interface Validator<T = any> {
    key: keyof ValidityStateFlags;
    message: string | ValidatorMessageFormat<T>;
    isValid: ValidatorHandler<T>;
}
export declare const requiredValidator: Validator<{
    required: boolean;
    value?: unknown;
}>;
export declare const requiredBooleanValidator: Validator<{
    required: boolean;
    checked: boolean;
}>;
export declare const minLengthValidator: Validator<{
    minLength?: number;
    value: string;
}>;
export declare const maxLengthValidator: Validator<{
    maxLength?: number;
    value: string;
}>;
export declare const patternValidator: Validator<{
    pattern?: string;
    value: string;
}>;
export declare const minValidator: Validator<{
    min?: number;
    value: number | string;
}>;
export declare const maxValidator: Validator<{
    max?: number;
    value: number | string;
}>;
export declare const stepValidator: Validator<{
    min?: number;
    step?: number;
    value: number | string;
}>;
export declare const emailValidator: Validator<{
    value: string;
}>;
export declare const urlValidator: Validator<{
    value: string;
}>;
export declare const minDateValidator: Validator<{
    value?: Date | null;
    min?: Date | null;
}>;
export declare const maxDateValidator: Validator<{
    value?: Date | null;
    max?: Date | null;
}>;
export {};

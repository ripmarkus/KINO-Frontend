import type { DateRangeDescriptor } from '../calendar/types.js';
import type { Validator } from '../common/validators.js';
import type IgcDateRangePickerComponent from './date-range-picker.js';
import type { DateRangeValue } from './date-range-picker.js';
export declare const minDateRangeValidator: Validator<{
    value?: DateRangeValue | null;
    min?: Date | null;
}>;
export declare const maxDateRangeValidator: Validator<{
    value?: DateRangeValue | null;
    max?: Date | null;
}>;
export declare const requiredDateRangeValidator: Validator<{
    required: boolean;
    value: DateRangeValue | null;
}>;
export declare const badInputDateRangeValidator: Validator<{
    required: boolean;
    value: DateRangeValue | null;
    disabledDates?: DateRangeDescriptor[];
}>;
export declare const dateRangeValidators: Validator<IgcDateRangePickerComponent>[];
export declare function isCompleteDateRange(value: DateRangeValue | null): value is {
    start: Date;
    end: Date;
};

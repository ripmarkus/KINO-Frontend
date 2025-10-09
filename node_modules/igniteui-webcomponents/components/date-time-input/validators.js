import { maxDateValidator, minDateValidator, requiredValidator, } from '../common/validators.js';
import { DateTimeUtil } from './date-util.js';
export const dateTimeInputValidators = [
    requiredValidator,
    {
        ...minDateValidator,
        isValid: (host) => host.value && host.min
            ? !DateTimeUtil.lessThanMinValue(host.value || new Date(), host.min, host.hasTimeParts, host.hasDateParts)
            : true,
    },
    {
        ...maxDateValidator,
        isValid: (host) => host.value && host.max
            ? !DateTimeUtil.greaterThanMaxValue(host.value || new Date(), host.max, host.hasTimeParts, host.hasDateParts)
            : true,
    },
];
//# sourceMappingURL=validators.js.map
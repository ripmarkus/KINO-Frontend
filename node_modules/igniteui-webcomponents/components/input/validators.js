import { emailValidator, maxLengthValidator, maxValidator, minLengthValidator, minValidator, patternValidator, requiredValidator, stepValidator, urlValidator, } from '../common/validators.js';
export const stringValidators = [
    requiredValidator,
    minLengthValidator,
    maxLengthValidator,
    patternValidator,
    {
        key: 'typeMismatch',
        isValid: (host) => {
            switch (host.type) {
                case 'email':
                    return emailValidator.isValid(host);
                case 'url':
                    return urlValidator.isValid(host);
                default:
                    return true;
            }
        },
        message: (host) => (host.type === 'email'
            ? emailValidator.message
            : urlValidator.message),
    },
];
export const numberValidators = [
    requiredValidator,
    minValidator,
    maxValidator,
    stepValidator,
];
//# sourceMappingURL=validators.js.map
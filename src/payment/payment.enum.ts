
export enum InstallmentType {
    Month_12 = '12 month',
    Month_18 = '18 month',
    Month_24 = '24 month',
}

export enum PaymentTypes {
    CASH = 'cash',
    INSTALLMENT = 'installment',
}

export enum PaymentMethods {
    VODAFONE_CASH = 'vodafone cash',
    INSTA_PAY = "insta pay",
    BANK_TRANSFER = 'bank transfer',
}

export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}
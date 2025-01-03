
export enum InstallmentType {
    Month_12 = 'month_12',
    Month_18 = 'month_18',
    Month_24 = 'month_24',
}

export enum PaymentTypes {
    CASH = 'cash',
    INSTALLMENT = 'installment',
}

export enum PaymentMethods {
    VODAFONE_CASH = 'vodafone_cash',
    INSTA_PAY = "insta_pay",
    BANK_TRANSFER = 'bank_transfer',
}

export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}
interface Date {
    addHours: (h: number) => Date;
    addHours2: (h: number) => Date;

    toGMTString(): string;

    /**
     * Check if Date is `n` hour ago
     * @param source number of hours
     */
    isHourAgo(source: number): boolean;
}
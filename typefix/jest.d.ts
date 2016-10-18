declare namespace jest {
    interface Matchers {
        toHaveBeenCalledTimes(times: number): boolean;
    }
}
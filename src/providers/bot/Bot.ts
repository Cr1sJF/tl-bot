
export default abstract class BotProvider<T> {
    abstract getBot():T

    abstract login(): Promise<boolean>;
    abstract request(): Promise<boolean>;
    abstract report(): Promise<boolean>;
    abstract whereToWatch(): Promise<boolean>;

    abstract send(message: string, chatId: string): Promise<boolean>;

    // abstract settings(): Promise<boolean>;
}
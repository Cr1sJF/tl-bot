

export default abstract class NotificationProvider{
    abstract notifyNewMovie(message: string): Promise<boolean>;
}
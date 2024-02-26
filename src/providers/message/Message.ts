export default abstract class MessageProvider {
  abstract sendToChannel(
    message: string,
    channelId: string | number
  ): Promise<boolean>;
  abstract sendToUser(
    message: string,
    chatId: string | number
  ): Promise<boolean>;
}

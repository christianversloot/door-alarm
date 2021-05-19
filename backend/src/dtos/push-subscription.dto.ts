import { IsNotEmpty, IsString, IsUrl } from "class-validator";
import PushSubscription from "../interfaces/push-subscription";

export class PushSubscriptionDto implements PushSubscription {

  @IsUrl()
  @IsNotEmpty()
  endpoint: string;

  @IsString()
  @IsNotEmpty()
  authKey: string;

  @IsString()
  @IsNotEmpty()
  p256dhKey: string;

}
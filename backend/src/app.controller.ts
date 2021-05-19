import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PushSubscriptionDto } from './dtos/push-subscription.dto';
import Utils from './utils';

@Controller()
export class AppController {

  /** Private variables */
  private readonly logger = new Logger();
  private readonly className = Utils.getClassName(this.constructor);

  /** Constructor */
  constructor(private readonly appService: AppService) {}

  /**
   * Register new PushSubscription
   */
  @Post('push-subscription')
  registerNewPushSubscription(
    @Body() subscription: PushSubscriptionDto
  ): Promise<PushSubscriptionDto> {
    this.logger.log(`POST /push-subscription`, this.className)
    return this.appService._addSubscriptionToDatabase(subscription)
      .then((postResponse) => postResponse);
  }


}

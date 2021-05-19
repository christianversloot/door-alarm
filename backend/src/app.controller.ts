import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { PushSubscriptionDto } from './dtos/push-subscription.dto';
import { AuthGuard } from './guards/authguard';
import DatabasePushSubscription from './interfaces/database-push-subscription';
import Utils from './utils';

@Controller()
export class AppController {

  /** Private variables */
  private readonly logger = new Logger();
  private readonly className = Utils.getClassName(this.constructor);

  /** Constructor */
  constructor(private readonly appService: AppService) {}

  /**
   * Register push subscription.
   */
  @Post('push-subscription')
  @UseGuards(AuthGuard)
  registerNewPushSubscription(
    @Body() subscription: PushSubscriptionDto
  ): Promise<PushSubscriptionDto> {
    this.logger.log(`POST /push-subscription`, this.className);
    return this.appService._addSubscriptionToDatabase(subscription)
      .then((postResponse) => postResponse);
  }


  /**
   * Get all registered push subscriptions.
   */
  @Get('push-subscription')
  @UseGuards(AuthGuard)
  getPushSubscriptions(): Promise<DatabasePushSubscription[]> {
    this.logger.log(`GET /push-subscription`, this.className);
    return this.appService._getPushSubscriptionsFromDatabase().then(sub => sub)
  }


}

import { Body, Controller, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { AvitoWebhookDto } from './dto/avitoWebhook.dto';

@Controller()
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('avito')
  @AllowAnonymous()
  avito(
    @Body()
    avitoWebhookDto: AvitoWebhookDto,
  ) {
    return this.webhookService.avito(avitoWebhookDto);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import {
  avitoWebhookPayloadSchema,
  type AvitoWebhookPayloadDto,
} from './dto/avitoWebhookPayload.dto';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';

@Controller('api/webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('avito')
  avito(
    @Body(new ZodValidationPipe(avitoWebhookPayloadSchema))
    body: AvitoWebhookPayloadDto,
  ) {
    return this.webhookService.avito(body);
  }
}

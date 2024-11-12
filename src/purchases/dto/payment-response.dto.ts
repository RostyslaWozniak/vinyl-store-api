import { ApiProperty } from '@nestjs/swagger';
import Stripe from 'stripe';

class Metadata {
  @ApiProperty({
    description: 'The ID of the user who is making the purchase.',
    type: String,
  })
  userId: string;

  @ApiProperty({
    description: 'The ID of the vinyl record being purchased.',
    type: String,
  })
  vinylId: string;
}

export class PaymentResponseDto {
  @ApiProperty({
    description:
      'The client secret for the payment session, required for completing the payment.',
    example: 'client_secret_example',
    type: String,
  })
  clientSecret: string;

  @ApiProperty({
    description:
      'Metadata associated with the payment, such as custom information about the transaction.',
    type: Metadata,
  })
  metadata: Stripe.Metadata;
}

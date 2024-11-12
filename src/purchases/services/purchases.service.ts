import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { stripeConfig } from '../../configs';
import { EmailService } from '../../email/services';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../../users/services';
import { VinylsService } from '../../vinyls/services';
import Stripe from 'stripe';
import { PaymentResponseDto } from '../dto/payment-response.dto';
import { PurchaseResponseDto } from '../dto';

const PAYMENT_CURRENCY = 'usd';

@Injectable()
export class PurchasesService {
  private stripe: Stripe;
  constructor(
    @Inject(stripeConfig.KEY)
    private paymentConfigKeys: ConfigType<typeof stripeConfig>,
    private readonly vinylsService: VinylsService,
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {
    this.stripe = new Stripe(paymentConfigKeys.stripeApiKey, {
      apiVersion: '2024-10-28.acacia',
    });
  }

  async getUserPurchases({
    userId,
  }: {
    userId: string;
  }): Promise<PurchaseResponseDto[]> {
    return await this.prisma.purchase.findMany({
      select: {
        vinyl: {
          select: {
            name: true,
            authorName: true,
            description: true,
            price: true,
          },
        },
      },
      where: { userId },
    });
  }

  async buyProduct({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }): Promise<PaymentResponseDto> {
    const product = await this.vinylsService.getVinylById({
      vinylId: productId,
    });
    if (!product) {
      throw new NotFoundException('Vinyl not found');
    }
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: this.convertPrice({ price: product.price.toString() }),
      currency: PAYMENT_CURRENCY,
      payment_method_types: ['card'],
      metadata: {
        productId,
        userId,
      },
    });
    return {
      clientSecret: paymentIntent.client_secret,
      metadata: paymentIntent.metadata,
    };
  }

  async checkDataFromStripe(req: Request): Promise<void> {
    const signature = req.header('Stripe-Signature');
    const rawBody = req['rawBody'];
    try {
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.paymentConfigKeys.stripeWebhookSecret,
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          // console.log('PaymentIntent was successful:', event.data.object);
          break;
        case 'payment_intent.created':
          const { userId, productId } = event.data.object.metadata;
          await this.completePurchase({ userId, productId });
          // console.log('PaymentIntent was created:', event.data.object);
          break;
        case 'payment_intent.payment_failed':
          // console.log('PaymentIntent failed:', event.data.object);
          break;

        default:
        // console.log(`Unhandled event type ${event.type}`);
      }
    } catch (err) {
      console.error('Webhook Error:', err.message);
    }
  }

  private async completePurchase({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }): Promise<void> {
    const product = await this.vinylsService.getVinylById({
      vinylId: productId,
    });
    if (!product) {
      throw new BadRequestException('Vinyl not found');
    }

    const user = await this.usersService.findUniqueById({ userId });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    try {
      await this.prisma.purchase.create({
        data: {
          userId,
          vinylId: productId,
        },
      });
      await this.emailService.sendTextEmail({
        to: user.email,
        subject: 'Vinyl Purchased',
        text: `You have successfully purchased ${product.name} by ${product.authorName} for $${product.price}.`,
      });
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  private convertPrice({ price }: { price: string }) {
    return Number(price) * 100;
  }
}

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import Decimal from 'decimal.js';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  private data;

  async getInfo() {
    return this.data;
  }

  @Cron(`*/${process.env.PRICE_UPDATE_FREQUENCY} * * * * *`)
  handleCron() {
    this.updateData();
  }

  onModuleInit() {
    this.updateData();
  }

  async updateData() {
    const apiResponse = await axios(process.env.BINANCE_API_URL);

    const midPrice = apiResponse.data.map(item => new Decimal(item.bidPrice)).reduce((accumulator, currentValue) => {
      return accumulator.plus(currentValue);
    }, new Decimal(0)).dividedBy(new Decimal(apiResponse.data.length)).toFixed(8).toString();

    this.data = {
      symbols: apiResponse.data.map((item) => {
        return {
          bidPrice: new Decimal(item.bidPrice).times(new Decimal(1 + Number(process.env.SERVICE_COMMISSION))).toFixed(8).toString(),
          askPrice: new Decimal(item.askPrice).times(new Decimal(1 + Number(process.env.SERVICE_COMMISSION))).toFixed(8).toString(),
          symbol: item.symbol,
        }
      }),
      midPrice,
    }
  }
}

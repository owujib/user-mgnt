import 'dotenv/config';
import Axios from 'axios';
import References from '../helpers/Reference';
import Helper from '../helpers';

interface paystackBody {
  authUrl: string | null;
  amount: number;
  email: string;
  reference: string;
  charge: number;
  channels: any;
}

class Paystack {
  /* Make An HTTP Call To Paystack API */
  async initializePayment(payload: any) {
    const body: paystackBody = {
      authUrl: null,
      amount: payload.amount * 100,
      email: payload.email,
      reference: `${References.walletFunding}-${Helper.randomStringGenerator(
        6,
      )}`,
      charge: Paystack.calculatePaystackCharge(payload.amount),
      channels: [payload.channels],
    };

    return new Promise(async (resolve, reject) => {
      try {
        const response = await Axios.post(
          `${process.env.PAYSTACK_URL}transaction/initialize`,
          { ...body, metadata: { email: payload.email } },
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            },
          },
        );

        return resolve({
          status: response.status,
          statusText: response.statusText,
          data: { ...response.data, body },
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  async tokinzeCard(payload: any) {}

  static calculatePaystackCharge(amount: number) {
    let paystackChargePercentage = 1.5 / 100;
    let paystackExtraCharge = 100;
    let paystackMaxCharge = 2000;

    if (amount < 2500) {
      return paystackChargePercentage * amount;
    }

    /* Calculate The Max Charge */
    let isMaxCapped = paystackChargePercentage * amount + paystackExtraCharge;
    if (isMaxCapped >= paystackMaxCharge) {
      return paystackMaxCharge;
    }

    /* Extract The Actual Charge */
    return paystackChargePercentage * amount + paystackExtraCharge;
  }

  async processInitialCardCharge(chargeResult: any) {
    if (chargeResult.data.status === 'success') {
      return {
        success: true,
        message: chargeResult.data.status,
        data: {
          shouldCreditAccount: true,
          reference: chargeResult.data.reference,
        },
      };
    }

    return {
      success: true,
      message: chargeResult.data.status,
      data: {
        shouldCreditAccount: false,
        reference: chargeResult.data.reference,
      },
    };
  }
}

export default new Paystack();

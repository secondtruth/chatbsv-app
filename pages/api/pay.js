// pages/api/pay.js

import AuthTokenRepository from "../../src/repositories/AuthTokenRepository";
import HandCashService from "../../src/services/HandCashService";
import SessionTokenRepository from "../../src/repositories/SessionTokenRepository";
import getErrorMessage from '../../src/lib/getErrorMessage';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    const { authorization, requesttype, model } = req.headers;

    // Log the request type and model
    console.log('Request Type:', requesttype);
    console.log('Model:', model);

    if (!authorization) {
      return res.status(401).json({ error: getErrorMessage(new Error('Missing authorization. Please reconnect to Handcash.')) });
    }

    const sessionToken = authorization.split(' ')[1];
    if (!sessionToken) {
      return res.status(401).json({ error: getErrorMessage(new Error('Missing session token. Please reconnect to Handcash.')) });
    }

    const { sessionId, user } = SessionTokenRepository.verify(sessionToken);
    const authToken = AuthTokenRepository.getById(sessionId);
    if (!authToken) {
      return res.status(401).json({ error: 'Expired authorization. Please reconnect to Handcash.', redirectUrl: new HandCashService().getRedirectionUrl() });
    }

    let paymentAmount;
    switch (requesttype) {
      case 'image':
        paymentAmount = model === 'dall-e-2' ? process.env.DALLE2_AMOUNT : process.env.DALLE3_AMOUNT;
        break;
      case 'meme':
        paymentAmount = process.env.MEME_AMOUNT;
        break;
      case 'text':
        paymentAmount = model === 'gpt-4' ? process.env.GPT4_AMOUNT : process.env.GPT3_AMOUNT;
        break;
      default:
        paymentAmount = process.env.CHAT_AMOUNT;
    }

    // Log the processed payment amount
    console.log('Processed Payment Amount:', paymentAmount);

    const paymentResult = await new HandCashService(authToken).pay({
      destination: process.env.DEST,
      amount: paymentAmount,
      currencyCode: process.env.CURRENCY,
      description: 'ChatBSV payment'
    });

    return res.status(200).json({ status: 'sent', transactionId: paymentResult.transactionId });
  } catch (error) {
    console.error(error);
    const errorMessage = getErrorMessage(error);
    const statusCode = error.statusCode || error.status || 500;
    return res.status(statusCode).json({ status: 'error', error: errorMessage });
  }
}

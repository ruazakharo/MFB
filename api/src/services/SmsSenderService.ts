import * as Log4js from 'log4js';
import * as Config from 'config';
import * as Twilio from 'twilio';

const logger = Log4js.getLogger('services.sender.sms');

interface SmsConfig {
    enabled: boolean;
    senderPhoneNumber?: string;
    apikey?: {
        SID: string,
        Token: string
    };
}

const serviceConfig = Config.get<SmsConfig>('sms');

let serviceEnabled = false;

let twilioClient: Twilio.RestClient = null;

if (serviceConfig.enabled === true) {
    logger.info('Initializing sms sender service');

    twilioClient = Twilio(serviceConfig.apikey.SID, serviceConfig.apikey.Token);
    serviceEnabled = true;
} else {
    logger.info('Sms sender service is disabled');
    serviceEnabled = false;
}

export async function sendMessage(phoneNumber: string, text: string): Promise<void> {
    if (!serviceEnabled) {
        logger.debug('Send sms request, but service is disabled');
        return;
    }

    logger.info(`Sending sms to ${phoneNumber}, text: ${text}`);

    await twilioClient.messages.create({
        to: phoneNumber,
        from: serviceConfig.senderPhoneNumber,
        body: text
    });

    logger.info('Sms successfully sent');
}
import sharedContact from './contact.cjs';

export const CONTACT = sharedContact.CONTACT;
export const normalizeIndianPhone = sharedContact.normalizeIndianPhone;
export const normalizeToE164 = sharedContact.normalizeToE164;
export const getWhatsAppNumberDigits = sharedContact.getWhatsAppNumberDigits;
export const getCallTelHref = sharedContact.getCallTelHref;
export const getWhatsAppUrl = sharedContact.getWhatsAppUrl;
export const normalizeContactContent = sharedContact.normalizeContactContent;
export const normalizeContactData = sharedContact.normalizeContactData;

export default sharedContact;

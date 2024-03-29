import { DID } from '@elastosfoundation/did-js-sdk';
import { config } from '../config';

export const isInAppBrowser = () =>
  window.elastos !== undefined && window.elastos.name === 'essentialsiab';

export const isSupportedNetwork = (chainId) =>
  (config.IsProductEnv && chainId === 20) || (!config.IsProductEnv && chainId === 21);

// Get time from timestamp // yyyy/MM/dd hh:mm
export const getTime = (timestamp) => {
  const date = new Date(parseInt(timestamp, 10));
  const dateString = date.toLocaleDateString('en-US');
  const dateStrs = dateString.split('/');
  const dateStr = `${dateStrs[2]}-${dateStrs[0]}-${dateStrs[1]}`;
  const hours = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const timeStr = [hours, min, seconds].join(':');
  return { date: dateStr, time: timeStr };
};

export const getCredentialsFromDIDDoc = (didDoc) => {
  if (!didDoc || !Object.keys(didDoc).length) return undefined;
  try {
    const credentials = didDoc.getCredentials();
    const properties = credentials.reduce((props, c) => {
      props[c.id.fragment] = c.subject.properties[c.id.fragment];
      return props;
    }, {});
    return properties;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const getServiceEndPointFromDIDDoc = (didDoc) => {
  const services = didDoc.getServices();
  if (!services.length) return '';
  return services[0].serviceEndpoint;
};

export const reduceHexAddress = (strAddress, nDigits) =>
  strAddress
    ? `${strAddress.substring(0, 2 + nDigits)}...${strAddress.substring(
        strAddress.length - nDigits,
        strAddress.length
      )}`
    : '';

export const resolveNameByDidStr = async (did) => {
  try {
    const doc = await DID.from(did).resolve();
    const credential = doc.getCredential('name');
    if (!credential) return did;

    const name = credential.getSubject()?.getProperty('name');
    return !name ? did : name;
  } catch (e) {
    console.error(`Get an error when resolve did ${did}`);
    return did;
  }
};

export const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const checkIfValidIP = (str) => {
  // Regular expression to check if string is a IP address
  const regexExp =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  return regexExp.test(str);
};

export const getVaultPricingPlanBadge = (str) => {
  switch (str) {
    case 'Free':
      return 'Basic';
    case 'Rookie':
      return 'Standard';
    case 'Advanced':
      return 'Pro';
    default:
      return '';
  }
};

export const dedicatedDappList = [
  {
    name: '???',
    appDid: '---',
    avatar: '/static/dapp/ic_unknown.svg'
  },
  {
    name: 'HiveHub',
    appDid: 'did:elastos:ik3ngW1tRxzTtwRstgkCWuv4SmUQ6nGcML',
    avatar: '/static/dapp/ic_hivehub.svg'
  },
  {
    name: 'Pasar',
    appDid: 'did:elastos:iZvAak2SUHaKwBHmPFsgtVVMGtTpi4r2kY',
    avatar: '/static/dapp/ic_pasar.svg'
  },
  {
    name: 'Feeds',
    appDid: 'did:elastos:iqtWRVjz7gsYhyuQEb1hYNNmWQt1Z9geXg',
    avatar: '/static/dapp/ic_feeds.svg'
  }
];

export const getImageFromIPFS = (url) => {
  // pasar:image:xxx
  // no data
  if (!url) return '';
  const segments = url.split(':').filter((item) => item);
  if (segments.length === 3 && segments[2] && segments[2] !== 'undefined')
    return `${config.IPFSUploadUrl}/ipfs/${segments[2]}`;
  return '';
};

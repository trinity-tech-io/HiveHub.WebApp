import { create } from 'ipfs-http-client';
import { config } from '../config';

const client = create({ url: config.IPFSUploadUrl });

export const uploadAvatar2Ipfs = (avatar) =>
  new Promise((resolve, reject) => {
    if (!avatar) resolve('empty data');
    else {
      const avatarBase64 = avatar.replace('data:image/png;base64,', '');
      const binaryString = window.atob(avatarBase64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i += 1) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      try {
        const added = Promise.resolve(client.add(bytes.buffer));
        resolve(added);
      } catch (error) {
        reject(error);
      }
    }
  });

export const uploadNode2Ipfs = (
  name,
  ownerDid,
  description,
  avatar,
  email,
  endpoint,
  signature,
  createdAt
) =>
  new Promise((resolve, reject) => {
    // create the metadata object we'll be storing
    const metaObj = {
      version: '2',
      type: 'HiveNode',
      name,
      creator: {
        did: ownerDid
      },
      data: {
        description,
        avatar,
        email,
        endpoint,
        createdAt,
        signature
      }
    };
    try {
      const jsonMetaObj = JSON.stringify(metaObj);
      // add the metadata itself as well
      const metaRecv = Promise.resolve(client.add(jsonMetaObj));
      resolve(metaRecv);
    } catch (error) {
      reject(error);
    }
  });

export const getDataFromIpfs = async (url) => {
  if (!url) return '';
  if (typeof url !== 'string') return '';
  const prefixLen = url.split(':', 2).join(':').length;
  if (prefixLen >= url.length) return '';
  const uri = url.substring(prefixLen + 1);
  const fetchUrl = `${config.IPFSUploadUrl}/ipfs/${uri}`;
  try {
    const res = await fetch(fetchUrl, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

import { create } from 'ipfs-http-client';
import { config } from '../config';

const client = create({ url: config.IPFSUploadUrl });

export const uploadNode2Ipfs = (name, created, ip, ownerDid, area, email, url, remark) =>
  new Promise((resolve, reject) => {
    // create the metadata object we'll be storing
    const metaObj = {
      version: '1',
      name,
      created,
      ip,
      owner_did: ownerDid,
      area,
      email,
      url,
      remark
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

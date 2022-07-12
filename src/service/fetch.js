import {
  VaultSubscription,
  AboutService,
  ServiceEndpoint,
  HttpClient,
  AuthService,
  BackupSubscription,
  Provider,
  SubscriptionService,
  AlreadyExistsException,
  Vault,
  NotFoundException,
  InsertOptions,
  BackupResultResult
} from '@elastosfoundation/hive-js-sdk';
import { DID, DIDBackend, DefaultDIDAdapter } from '@elastosfoundation/did-js-sdk';
import HiveHubServer from './HiveHubServer';
// import { creatAppContext, getAppInstanceDIDDoc } from './HiveService';
// import devConfig from './hivejs/config/developing.json';
import { BrowserConnectivitySDKHiveAuthHelper } from './BrowserConnectivitySDKHiveAuthHelper';
import config from '../config';
import { getTime, reduceHexAddress, sleep } from './common';

export const getHiveNodesList = async (nid, did, withName) => {
  const nodes = await HiveHubServer.getHiveNodes(nid, did);
  const nodeList = await Promise.all(
    nodes.map(async (item) => {
      const node = { ...item };
      // node.url = config.NodeProviderUrl;
      try {
        if (withName) {
          const credentials = await getCredentialsFromDID(node.owner_did);
          node.ownerName = credentials.name
            ? credentials.name
            : reduceHexAddress(node.owner_did, 4);
        } else {
          node.ownerName = reduceHexAddress(node.owner_did, 4);
        }
        node.status = await HiveHubServer.isOnline(node.url);
      } catch (e) {
        node.status = false;
        node.ownerName = reduceHexAddress(node.owner_did, 4);
      }
      return node;
    })
  );
  return nodeList;
};

export const getHiveVaultInfo = async (did, nodeProvider, type) => {
  try {
    const vaultSubscription =
      type === 1
        ? await getVaultSubscription(did, nodeProvider)
        : await getBackupSubscription(did, nodeProvider);
    const vaultInfo = await vaultSubscription.checkSubscription();
    console.log(vaultInfo);
    if (!vaultInfo) return undefined;
    const name = `${type === 1 ? 'Vault' : 'Backup'} Service-0 (${vaultInfo.getPricePlan()})`;
    const total = parseInt(vaultInfo.getStorageQuota() / 1024 / 1024, 10);
    const used = parseInt(vaultInfo.getStorageUsed() / 1024 / 1024, 10);
    const created = getTime(new Date(vaultInfo.getCreated().toString()).getTime());
    const time = `${created.date} ${created.time}`;
    const id = 0;
    const serviceDid = vaultInfo.getServiceDid();
    const credentials = await getCredentialsFromDID(did);
    const ownerName = credentials.name ? credentials.name : reduceHexAddress(did, 4);
    return { id, name, total, used, time, ownerName, serviceDid };
  } catch (e) {
    return undefined;
  }
};

export const getDIDDocumentFromDID = (did) =>
  new Promise((resolve, reject) => {
    DIDBackend.initialize(new DefaultDIDAdapter(config.DIDResolverUrl));
    const didObj = new DID(did);
    didObj
      .resolve(true)
      .then((didDoc) => {
        if (!didDoc) resolve({});
        resolve(didDoc);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getCredentialsFromDID = (did) =>
  new Promise((resolve, reject) => {
    DIDBackend.initialize(new DefaultDIDAdapter(config.DIDResolverUrl));
    const didObj = new DID(did);
    didObj
      .resolve(true)
      .then((didDoc) => {
        if (!didDoc) resolve({});
        const credentials = didDoc.getCredentials();
        const properties = credentials.reduce((props, c) => {
          props[c.id.fragment] = c.subject.properties[c.id.fragment];
          return props;
        }, {});
        resolve(properties);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getActiveHiveNodeUrl = async () => {
  const nodes = await HiveHubServer.getHiveNodes();
  const activeNodes = [];
  await Promise.all(
    nodes.map(async (item) => {
      const node = { ...item };
      try {
        node.status = await HiveHubServer.isOnline(node.url);
        if (node.status && !activeNodes.includes(node.url)) activeNodes.push(node.url);
      } catch (e) {
        node.status = false;
      }
      return node;
    })
  );
  return activeNodes;
};
// ******************************************************************** //

export const getAppContext = async (did) => {
  const instBCSHAH = new BrowserConnectivitySDKHiveAuthHelper(config.DIDResolverUrl);
  const appContext = await instBCSHAH.getAppContext(did);
  return appContext;
};

export const getRestService = async (did) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  const serviceEndpoint = new ServiceEndpoint(appContext, nodeProvider);
  const httpClient = new HttpClient(
    serviceEndpoint,
    HttpClient.WITH_AUTHORIZATION,
    HttpClient.DEFAULT_OPTIONS
  );
  return { serviceEndpoint, httpClient };
};

export const getVaultSubscription = async (did, nodeProviderUrl) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  return new VaultSubscription(appContext, nodeProviderUrl || nodeProvider);
};

export const getBackupSubscription = async (did, nodeProviderUrl) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  return new BackupSubscription(appContext, nodeProviderUrl || nodeProvider);
};

export const getSubscriptionService = async (did) => {
  const restService = await getRestService(did);
  return new SubscriptionService(restService.serviceEndpoint, restService.httpClient);
};

export const createVault = (did, nodeProvider) =>
  new Promise((resolve, reject) => {
    getVaultSubscription(did, nodeProvider)
      .then((subscription) => subscription.subscribe())
      .then((res) => resolve(true))
      .catch((e) => {
        if (e instanceof AlreadyExistsException) {
          resolve(false);
        } else {
          reject(e);
        }
      });
  });

export const isDIDPublished = async (did) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  return nodeProvider !== undefined && nodeProvider !== null && nodeProvider !== '';
};

export const getNodeProviderUrl = async (did) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  return nodeProvider;
};

export const getValidNodeProviderUrl = async (appContext, did) => {
  const nodeProvider = await appContext.getProviderAddress(did);
  // console.log("original: ", nodeProvider)
  const activeNodes = await getActiveHiveNodeUrl();
  // console.log(activeNodes)
  if (!activeNodes.length) return '';
  if (activeNodes.includes(nodeProvider)) return nodeProvider;
  // console.log("updated: ", activeNodes[activeNodes.length - 1])
  return activeNodes[activeNodes.length - 1];
};

export const migrate = async (did) => {
  const COLLECTION_NAME = 'test_collection';
  const FILE_NAME = 'test_file.txt';
  const FILE_CONTENT = 'This is the file content: abcdefghijklmnopqrstuvwxyz';
  const SCRIPT_NAME = 'test_script';
  const EXECUTABLE_NAME = 'test_executable';

  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  const vault = new Vault(appContext, nodeProvider);
  const subscription = new VaultSubscription(appContext, nodeProvider);
  const subscriptionBackup = new BackupSubscription(appContext, nodeProvider);

  // try to remove the exist vault and backup service, clean start.
  try {
    await subscription.unsubscribe();
  } catch (e) {
    if (!(e instanceof NotFoundException)) {
      throw e;
    }
  }
  try {
    await subscriptionBackup.unsubscribe();
  } catch (e) {
    if (!(e instanceof NotFoundException)) {
      throw e;
    }
  }

  // 1. create a new vault as the source of the migration operation.
  await subscription.subscribe();
  console.log('a clean vault created.');

  // insert document
  const databaseService = vault.getDatabaseService();
  try {
    await databaseService.createCollection(COLLECTION_NAME);
  } catch (e) {
    console.log(e);
  }
  const doc = { author: 'john doe1', title: 'Eve for Dummies1' };
  await databaseService.insertOne(COLLECTION_NAME, doc, new InsertOptions(false, false));
  console.log('a new document is been inserted.');

  // upload file
  const filesService = vault.getFilesService();
  const buffer = Buffer.from(FILE_CONTENT, 'utf8');
  await filesService.upload(FILE_NAME, buffer);
  console.log('a new file is been uploaded.');

  // 2. subscribe the backup service
  await subscriptionBackup.subscribe();
  console.log('subscribe a backup service.');

  // 3. deactivate the vault to a void data changes in the backup process.
  await subscription.deactivate();
  console.log('deactivate the source vault.');

  // 4. backup the vault data.
  const backupService = vault.getBackupService(vault);
  await backupService.startBackup();

  // wait backup end.
  // const nodeList = await Promise.all(
  //   nodes.map(async (item) => {
  //     const node = { ...item };
  //     // node.url = config.NodeProviderUrl;
  //     try {
  //       if (withName) {
  //         const credentials = await getCredentialsFromDID(node.owner_did);
  //         node.ownerName = credentials.name
  //           ? credentials.name
  //           : reduceHexAddress(node.owner_did, 4);
  //       } else {
  //         node.ownerName = reduceHexAddress(node.owner_did, 4);
  //       }
  //       node.status = await HiveHubServer.isOnline(node.url);
  //     } catch (e) {
  //       node.status = false;
  //       node.ownerName = reduceHexAddress(node.owner_did, 4);
  //     }
  //     return node;
  //   })
  // );
  
  // let count = 0;
  // while (count < 30) {
  //   const info = await backupService.checkResult();
  //   if (info.getResult() === BackupResultResult.RESULT_PROCESS) {
  //     // go on.
  //   } else if (info.getResult() === BackupResultResult.RESULT_SUCCESS) {
  //     break;
  //   } else {
  //     throw new Error(`failed to backup: ${info.getMessage()}`);
  //   }
  //   count++;
  //   console.log('backup in process, try to wait.');
  //   sleep(1000);
  // }
  console.log('backup done.');

  // 5. promotion, same vault, so need remove vault first.
  await subscription.unsubscribe();

  // promote
  const backup = await vault.createBackup();
  await backup.getPromotionService().promote();
  console.log('promotion over from backup data to a new vault.');

  console.log('TODO: public user DID with backup node url here');
  console.log('remove the vault on vault node here, same node, skip');

  // check the data of the new vault.
  const obj = await databaseService.findOne(COLLECTION_NAME, doc);
  console.log(`find doc: ${JSON.stringify(obj)}`);

  // check the file
  const content = await filesService.download(FILE_NAME);
  console.log(`Get the content of the file '${FILE_NAME}': ${content.toString()}`);

  console.log('migration is done !!!');
};

// ******************************************************************** //

export const getHiveNodeInfo = async (did) => {
  const restService = await getRestService(did);
  const aboutService = new AboutService(restService.serviceEndpoint, restService.httpClient);
  const nodeInfo = await aboutService.getInfo();
  return nodeInfo;
};

export const getProvider = async (did) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  return new Provider(appContext, nodeProvider);
};

export const getAuthService = async (did) => {
  const restService = await getRestService(did);
  return new AuthService(restService.serviceEndpoint, restService.httpClient);
};

export const getVault = async (did) => {
  const instBCSHAH = new BrowserConnectivitySDKHiveAuthHelper(config.DIDResolverUrl);
  const vault = await instBCSHAH.getVaultServices(did);
  return vault;
};

import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import {initReactI18next} from "react-i18next"

let en = {
    "search-placeholder": "search",
    "nav-square": "Square",
    "did-login": "DID Login",
    "title": "Elastos Hive",
    "subtitle": "This utility can make sure that your online DID document is in a correct status. Your mnemonic and passphrase remain in the browser",
    "node-list": "Node List",
    "starter": "Instruction",
    "functions": "Functions",
    "loading": "Loading...",

    "download": "Download",
    "did-repair": "DID Repair",
    "repair-tips": "This utility can make sure that your online DID document is in a correct status. Your mnemonic and passphrase remain in the browser, they are not sent anywhere.",
    "mnemonic": "Input your mnemonic here",
    "passphrase": "Mnemonic passphrase",
    "check": "Check Status",
    "recovery": "Recovery",
    "product": "Product",
    "did": "Currently at the forefront of the digital identity space, Elastos’ open source, DIF- and W3C-compliant identity solution is compatible with dApps, projects, and services throughout the Elastos ecosystem, and to any project that wants to explore a decentralized identity solution. Elastos DID runs on the Elastos Identity Chain (EID) and issues DIDs to any device and individual that needs a trust-based system, which is exactly what the SmartWeb is designed for.",
    "hive": "A flexible, decentralized storage solution with swappable storage constructs that allow for private storage and public decentralized storage behind robust Swift/Java SDKs for mobile and JS SDKs for the web. Elastos Hive is a decentralized storage infrastructure where the nodes could be deployed and run by anyone in the world. These nodes could be utilized for storing any kind of data and also as a database layer that could be utilized by any applications on the web or mobile apps. Users are in full control of their own data at all times.",
    "carrier": "In place of outdated IP addresses, Elastos’ Peer-to-Peer Carrier Network generates unique identifiers called Carrier IDs. Decentralized, fully encrypted, and peer-to-peer, Carrier takes over all network traffic and transmits information on behalf of dApps.",
    "did-title": "Decentralized Identity(DID)",
    "hive-title": "Decentralized Storage(Hive)",
    "carrier-title": "Peer-to-Peer Network(Carrier)",
    "release": "Last Release",
}

let zh = {
    "search-placeholder": "搜索",
    "nav-square": "广场",
    "did-login": "DID登陆",
    "title": "亦来云Hive",
    "subtitle": "提供安全可靠、稳定可信、可持续创新的去中心化数据存储方案 赋能应用、使能数据、做数字世界的“私权捍卫者",
    "node-list": "节点列表",
    "starter": "新手引导",
    "functions": "功能介绍",
    "loading": "正在加载中...",

    "download": "直接下载",
    "did-repair": "DID修复",
    "repair-tips": "使用这个工具可以让你的DID文档恢复到正确的状态。你的助记词和密码只是存储在你的浏览器临时文件中，它们不会被发往任何地方",
    "mnemonic": "在这里输入你的助记词",
    "passphrase": "助记词密钥",
    "check": "检查状态",
    "recovery": "恢复",
    "product": "产品介绍",
    "did": "DIF 和 W3C 兼容身份解决方案，支持智能合约，在侧链架构上运行；DIF 和 W3C 兼容身份解决方案，支持智能合约，在侧链架构上运行；DIF 和 W3C 兼容身份解决方案，支持智能合约，在侧链架构上运行；DIF 和 W3C 兼容身份解决方案，支持智能合约，在侧链架构上运行；DIF 和 W3C 兼容身份解决方案，支持智能合约，在侧链架构上运行。",
    "hive": "一个灵活的、分散的存储解决方案，具有可交换的存储结构，支持私有存储和公共去中心化存储，支持强大的Swift/Java sdk(用于移动)和JS SDK(用于Web)。Elastos Hive 是一个去中心化的存储基础设施，世界上任何人都可以在其中部署和运行节点。 这些节点可用于存储任何类型的数据，也可用作数据库层，可供网络或移动应用程序上的任何应用程序使用。 用户在任何时候都可以完全控制自己的数据。",
    "carrier": "代替过时的 IP 地址，Elastos的点对点Carrier网络生成称为Carrier ID 的唯一标识符。 去中心化、完全加密和点对点，Carrier接管所有网络流量并代表 dApp 传输信息。",
    "did-title": "去中心化身份(DID)",
    "hive-title": "去中心化存储 (Hive)",
    "carrier-title": "点对点网络（Carrier）",
    "release": "最近更新",
}


i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
    resources: {
        en: { translation: en },
        zh: { translation: zh }
    },
    fallbackLng: "en",
    debug: false,
    interpolation: {
        escapeValue: false,
    },
}).catch(console.log)

export default i18n;

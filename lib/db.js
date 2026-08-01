import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./database.json');

if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ groups: {}, global: { prefix: ".", botMode: "public" } }, null, 2));
}

function readDB() {
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function writeDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export const db = {
    getGroup: (jid) => {
        const data = readDB();
        if (!data.groups[jid]) {
            data.groups[jid] = {
                antilink: false,
                antimedia: false,
                antitag: false,
                mode: "public"
            };
            writeDB(data);
        }
        return data.groups[jid];
    },
    
    updateGroup: (jid, key, value) => {
        const data = readDB();
        if (!data.groups[jid]) data.groups[jid] = {};
        data.groups[jid][key] = value;
        writeDB(data);
    },
    
    getPrefix: () => {
        const data = readDB();
        return data.global?.prefix || ".";
    },
    
    setPrefix: (newPrefix) => {
        const data = readDB();
        if (!data.global) data.global = {};
        data.global.prefix = newPrefix;
        writeDB(data);
    },

    getMode: () => {
        const data = readDB();
        return data.global?.botMode || "public";
    },

    setMode: (newMode) => {
        const data = readDB();
        if (!data.global) data.global = {};
        data.global.botMode = newMode;
        writeDB(data);
    }
};

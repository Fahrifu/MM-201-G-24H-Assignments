import fs from 'fs';

const SETTINGS_FILE = './settings.json';


const loadSettings = () => {
    if (fs.existsSync(SETTINGS_FILE)) {
        const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
        return JSON.parse(data);
    }
    return {};  
};


const saveSettings = (settings) => {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
};

export { loadSettings, saveSettings };

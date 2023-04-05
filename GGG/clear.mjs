import fs from 'fs';
import path from 'path';

const getAllFiles = dir =>
    fs.readdirSync(dir).reduce((files, file) => {
        const name = path.join(dir, file);
        const isDirectory = fs.statSync(name).isDirectory();
        return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
    }, []);

const files = getAllFiles('./').filter(f => ['.mdx', '.blp','.mp3','.wav'].indexOf(path.extname(f).toLowerCase()) >= 0);

for (const f of files) {
    fs.unlinkSync(f);
}

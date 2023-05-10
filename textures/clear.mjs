import fileListDir from '../utils/file-list-dir.mjs';
import fileNameExtension from '../utils/file-name-extension.mjs';
import fs from 'fs';
import path from 'node:path';

import dirRemoveEmpty from '../utils/dir-remove-empty.mjs';

const dir = './';

const list = fileListDir(dir);

// file
for (const f of list) {
    const ext = fileNameExtension(f);
    if (['blp', 'tga', 'mjs'].indexOf(ext) >= 0) continue;
    fs.unlinkSync(f);
}

// folder
dirRemoveEmpty(dir);

// rename
function renameContentsToLowerCase(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const stat = fs.statSync(path.join(dir, f));
        if (stat.isDirectory()) {
            fs.renameSync(path.join(dir, f), f.toLowerCase());
            //renameContentsToLowerCase(path.join(dir, f.toLowerCase()));
        } else {
            fs.renameSync(path.join(dir, f), f.toLowerCase());
        }
    }
}

//renameContentsToLowerCase(dir);

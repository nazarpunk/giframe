import fileListDir from '../utils/file-list-dir.mjs';
import fileNameExtension from '../utils/file-name-extension.mjs';
import fs from 'fs';
import path from 'node:path';

import dirRemoveEmpty from '../utils/dir-remove-empty.mjs';

const dir = './data';

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
const renameContentsToLowerCase = dir => {
    for (const f of fs.readdirSync(dir)) {
        if (fs.statSync(path.join(dir, f)).isDirectory()) {
            console.log(path.join(dir, f))
            //fs.renameSync(path.join(dir, f), f.toLowerCase());
            renameContentsToLowerCase(path.join(dir, f));
        } else {
            fs.renameSync(path.join(dir, f), path.join(dir, f.toLowerCase()));
        }
    }
};

//renameContentsToLowerCase(dir);

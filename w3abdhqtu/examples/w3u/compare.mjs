import * as fs from 'fs';
import * as chip from 'child_process';
import {W3U} from '../../W3U.mjs';

const ext = 'w3u';
const name = [
    'war3map',
    'bundle',
][0];

const f1 = `${name}.${ext}`;

console.log(`🏁 ${ext}: start`);
const w3i = new W3U(fs.readFileSync(f1));
w3i.read();
if (w3i.errors.length) {
    console.log('⚠️', w3i.errors);
} else {
    console.log(`🏆 ${ext}: read end`);

    const b = w3i.write();
    console.log(`🏆 ${ext}: write end`);

    const f2 = `${name}.test.${ext}`;
    fs.writeFileSync(f2, '', {flag: 'w+'});
    fs.appendFileSync(f2, Buffer.from(b));

    const cwd = process.cwd();

    chip.exec(
        `osascript -e 'activate application "Terminal"' -e 'tell app "Terminal"
    do script "vbindiff ${cwd}/${f1} ${cwd}/${f2}"
end tell'`,
    );
}
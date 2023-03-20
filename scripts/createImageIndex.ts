import fs from 'node:fs/promises';
import path from 'node:path';

const repoEndPoint = 'https://api.github.com/repos/ash-chan-calendar/image/contents/';
const outputPath = path.resolve(__dirname, '..', 'dist', 'imageIndex.json');

interface repoContentItem {
  name: string,
  path: string,
  sha: string,
  size: number,
  url: string,
  html_url: string,
  git_url: string,
  download_url: string,
  type: string,
  _links: {
    self: string,
    git: string,
    html: string,
  },
}

const createImageIndex = async function(){
  const res = await fetch(repoEndPoint);

  if (!res.ok) {
    throw Error('Failed to get list of remote files.');
  }

  const index: Record<string, string> = {};
  const nameRegExp = /(?<date>\d\d\d\d\d\d\d\d)\.(png|jpg|jpeg|gif|svg)/;

  const text = await res.text()
  const items = JSON.parse(text) as repoContentItem[];
  for (const item of items) {
    const nameMatch = item.name.match(nameRegExp);
    if (!nameMatch) {
      continue;
    }

    const { date } = nameMatch.groups as { date: string };
    index[date] = item.download_url;
  }

  return index;
}

createImageIndex().then((index) => fs.writeFile(outputPath, JSON.stringify(index)));

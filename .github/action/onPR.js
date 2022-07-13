const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_KEY });

const databaseId = process.env.TEAM_TASK_NOTION_DB_ID;

const updateNotion = async () => {
  const GITHUB_BRANCH_NAME = process.env.GITHUB_HEAD_REF;
  const getId = (branchName) => {
    const id = branchName.split('-');
    let result = '';
    for (let i = 0; i < 2; i++) result += id[i] + '.';
    result += id[2];
    return result;
  };
  const resp = await notion.databases.query({ database_id: databaseId });
  const pages = resp.results.filter((item) =>
    item.properties.Name.title[0]?.text.content.startsWith(
      getId(GITHUB_BRANCH_NAME),
    ),
  );

  pages.forEach(async (page) => {
    const pageId = page.id;
    await notion.pages.update({
      page_id: pageId,
      properties: {
        Status: {
          select: {
            name: 'To Review',
          },
        },
      },
    });
  });
};
updateNotion();

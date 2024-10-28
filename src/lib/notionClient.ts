import { Client } from "@notionhq/client";

// const { Client } = require("@notionhq/client");
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export default notion;

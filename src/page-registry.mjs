import {pages,searchPage} from './pages.mjs';
import {moneyPage} from './money-page.mjs';
import {v4Page} from './v4-page.mjs';
import {publicAppsPage} from './public-apps-page.mjs';

export const standalone=process.env.KASPA_RELEASE==='v1';
const contentPages=[...pages,moneyPage,...(standalone?[]:[publicAppsPage,v4Page])];
export const documents=[...contentPages,searchPage(contentPages)];

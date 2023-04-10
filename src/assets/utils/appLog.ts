import getDateTime from '@/assets/utils/getDateTime';

require('dotenv').config();
import * as clc from 'cli-color';

const logTime = (): string => {
  return clc.blueBright(`[${getDateTime()}]`);
};

const appLog = (prefix?: string, message?: string) => {
  console.log(`${prefix} ${logTime()} ${message}`);
};

export default appLog;

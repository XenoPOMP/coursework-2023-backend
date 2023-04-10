import { clc } from '@nestjs/common/utils/cli-colors.util';
const cliColors = require('cli-color');

const appPrefixes = {
  mssql: cliColors.blueBright('[MSSQL]'),
  auth: clc.magentaBright(' [AUTH]'),
  webSocket: cliColors.green('   [WS]'),
  error: cliColors.red('  [ERR]'),
};

export default appPrefixes;

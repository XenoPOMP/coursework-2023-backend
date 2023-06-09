import MsSqlManager from '@/assets/sql/MsSqlManager';
import appLog from '@/assets/utils/appLog';
import appPrefixes from '@/assets/utils/appPrefixes';

const findOne = async (token: string): Promise<boolean> => {
  const sqlManager: MsSqlManager = new MsSqlManager();
  const prefix = appPrefixes.auth;

  appLog(prefix, `UUID: ${token}`);

  return await sqlManager
    .execQuery<{ admin_uuid }[][]>(
      `
    SELECT admin_uuid
    FROM [smartace.admins]
    WHERE admin_uuid LIKE '${token}'
  `,
    )
    .then((res) => res[0].length === 1);
};

export default findOne;

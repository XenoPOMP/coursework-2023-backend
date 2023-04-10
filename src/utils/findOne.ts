import MsSqlManager from '../sql/MsSqlManager';

const findOne = async (token: string): Promise<boolean> => {
  const sqlManager: MsSqlManager = new MsSqlManager();

  return await sqlManager
    .execQuery<{ admin_uuid }[][]>(
      `
    SELECT admin_uuid
    FROM [smartace.admins]
    WHERE admin_uuid = '${token}'
  `,
    )
    .then((res) => res[0].length === 1);
};

export default findOne;

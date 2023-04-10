import { Body, Injectable } from '@nestjs/common';
import { LoginResponse } from '@type/LoginResponse';
import MsSqlManager from '@sql/MsSqlManager';
import LoginDto from '@/login/login.dto';

@Injectable()
export class LoginService {
  private sqlManager: MsSqlManager = new MsSqlManager();

  async findOne(@Body() dto: LoginDto): Promise<{
    uuid: string;
    matches: number;
  }> {
    const { login, password } = dto;

    return await this.sqlManager
      .execQuery<{ admin_uuid }[][]>(
        `
      SELECT admin_uuid
      FROM [smartace.admins]
      WHERE
        admin_login = '${login}'
        AND
        admin_password = '${password}'
    `,
      )
      .then((res) => {
        if (res[0].length === 0) {
          return {
            uuid: null,
            matches: 0,
          };
        }

        return {
          uuid: res[0][0].admin_uuid,
          matches: 1,
        };
      });
  }
}

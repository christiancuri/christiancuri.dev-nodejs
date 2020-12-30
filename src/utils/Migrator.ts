import { User } from "@models";

import { logger } from "./logger";
import * as PasswordHelper from "./PasswordHelper";

export async function migrate(): Promise<void> {
  await Promise.all([migrateAdminUsers()]);
}

const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL;
const DEFAULT_ADMIN_PASSWD = process.env.DEFAULT_ADMIN_PASSWD;

async function migrateAdminUsers() {
  const defaultAdminUser = await User.countDocuments({
    email: DEFAULT_ADMIN_EMAIL,
  });
  if (!defaultAdminUser) {
    User.create({
      email: DEFAULT_ADMIN_EMAIL,
      name: "Default Admin",
      hash: await PasswordHelper.hash(DEFAULT_ADMIN_PASSWD),
    }).then(() =>
      logger.info(
        `Default admin user (${DEFAULT_ADMIN_EMAIL}) created with success`,
      ),
    );
  }
}

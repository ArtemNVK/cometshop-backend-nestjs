import { User } from 'src/users/user.entity';

export interface IConfirmationData {
  readonly user: User;
  readonly confirmationToken: string;
}

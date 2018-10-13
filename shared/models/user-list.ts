

export class UserList {

  constructor(
    public userId: string,
    public fullName: string,
    public email: string,
    public roles: string[],
    public updatedDate: Date) {
  }

}


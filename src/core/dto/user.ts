export class User {
  uid: string;
  email?: string;

  constructor(data: User) {
    this.uid = data.uid;
    this.email = data.email;
  }
}
import * as bcrypt from 'bcrypt';
import * as sql from 'sequelize';

import db from './db';


export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function testPassword(hash, password) {
  return bcrypt.compareSync(password, hash);
}


export interface UserCreateAttributes {
  email: string;

  password?: string;
  firstName?: string;
  lastName?: string;
}


export interface User extends
  sql.Instance<UserCreateAttributes>,
  UserCreateAttributes
{
  id: number;

  password: string | null;
  passwordHash: string | null;

  firstName: string;
  lastName: string;
  fullName: string;

  testPassword(password: string): boolean;
}


export const UserModel = db.define<User, UserCreateAttributes>('User', {
  id: {
    type: sql.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: sql.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
    set(this: User, val: string) {
      this.setDataValue('email', val.toLowerCase());
    }
  },
  password: {
    type: sql.VIRTUAL,
    set(this: User, val: string) {
      this.setDataValue('password', val);
      this.setDataValue('passwordHash', val ? hashPassword(val) : null);
    },
  },
  passwordHash: {
    type: sql.STRING,
    validate: {
      notEmpty: true,
    },
  },
  firstName: {
    type: sql.STRING,
    defaultValue: '',
  },
  lastName: {
    type: sql.STRING,
    defaultValue: '',
  },
}, {
  indexes: [
    {fields: ['email'], unique: true},
  ],
  getterMethods: {
    fullName(this: User) { return `${this.firstName} ${this.lastName}`.trim() },
  },
  instanceMethods: {
    testPassword(this: User, password: string) {
      return (
        this.passwordHash ?
        testPassword(this.passwordHash, password) :
        false
      );
    },
  },
});

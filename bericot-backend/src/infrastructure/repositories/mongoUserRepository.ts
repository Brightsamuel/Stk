import mongoose, { Schema, Document } from 'mongoose';

import { UserRepository } from '../../domain/interfaces/userRepository';
import { User } from '../../domain/entities/user';

interface UserDocument extends Document, User {}

const UserSchema = new Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model<UserDocument>('User', UserSchema);

export class MongoUserRepository implements UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    return UserModel.findOne({ username });
  }

  async create(user: User): Promise<void> {
    await UserModel.create(user);
  }
}
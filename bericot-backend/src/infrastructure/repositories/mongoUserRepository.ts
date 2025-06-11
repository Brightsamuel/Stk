import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../../domain/entities/user';
import { UserRepository } from '../../domain/interfaces/userRepository';
import { injectable } from 'inversify';

interface UserDocument extends Document {
  _id: string;
  username: string;
  password: string;
}

const UserSchema = new Schema({
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model<UserDocument>('User', UserSchema);

@injectable()
export class MongoUserRepository implements UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ username });
    if (!userDoc) return null;
    return {
      id: userDoc._id, // Map _id to id
      username: userDoc.username,
      password: userDoc.password,
    };
  }

  async create(user: User): Promise<void> {
    await UserModel.create({ _id: user.id, username: user.username, password: user.password });
  }
}

// mongoose.connect(
//   process.env.MONGODB_URI || 'mongodb://localhost:27017/bericot',
//   { dbName: 'bericot' }
// );
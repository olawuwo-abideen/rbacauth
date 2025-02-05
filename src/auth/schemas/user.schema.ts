import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../enums/role.enum';

@Schema({
timestamps: true,
})
export class User extends Document {
@Prop()
firstname: string;

@Prop()
lastname: string;

@Prop({ unique: [true, 'This email exist in the database'] })
email: string;

@Prop()
password: string;

@Prop()
confirmpassword: string;

@Prop({
type: [{ type: String, enum: Role }],
})

role: Role;

@Prop({ unique: [true, 'This phonenumber exist in the database'] })
phonenumber:string


}

export const UserSchema = SchemaFactory.createForClass(User);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';



@Schema({
  timestamps: true,
})
export class Logistic {
  @Prop()
  itemname: string;

  @Prop()
  itemprice: number;

  @Prop()
  itemweight: number;

  @Prop()
  itemquantity: number;


}

export const LogisticSchema = SchemaFactory.createForClass(Logistic);

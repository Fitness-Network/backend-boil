import { Prop, Schema } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import moment from "moment";
import { Types } from "mongoose";

@Schema()
export class BaseSchema {
	@ApiProperty({ type: String })
	_id: Types.ObjectId;

	@ApiProperty({
		default: false,
	})
	@Prop({
		default: false,
	})
	isDeleted: boolean;

	@ApiProperty({ default: moment().toDate() })
	createdAt: Date;

	@ApiProperty({ default: moment().toDate() })
	updatedAt: Date;

	@ApiProperty()
	__v: number;
}

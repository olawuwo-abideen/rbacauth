import {
IsNotEmpty,
IsNumber,
IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateLogisticDto {
@ApiProperty({
required: true,
description: 'The item name ',
example: 'laptop',
})
@IsNotEmpty()
@IsString()
itemname: string;


@ApiProperty({
required: true,
description: 'The item price',
example: 2000000,
})
@IsNotEmpty()
@IsNumber()
itemprice: number;

@ApiProperty({
required: true,
description: 'The item weight',
example: 5,
})
@IsNotEmpty()
@IsNumber()
itemweight: number;


@ApiProperty({
required: true,
description: 'The quantity of item',
example: 5,
})
@IsNotEmpty()
@IsNumber()
itemquantity: number;


}




export class UpdateLogisticDto {
    @ApiProperty({
    required: true,
    description: 'The item name ',
    example: 'phone',
    })
    @IsNotEmpty()
    @IsString()
    itemname: string;
    
    
    @ApiProperty({
    required: true,
    description: 'The item price',
    example: 2000000,
    })
    @IsNotEmpty()
    @IsNumber()
    itemprice: number;
    
    @ApiProperty({
    required: true,
    description: 'The item weight',
    example: 5,
    })
    @IsNotEmpty()
    @IsNumber()
    itemweight: number;
    
    
    @ApiProperty({
    required: true,
    description: 'The quantity of item',
    example: 5,
    })
    @IsNotEmpty()
    @IsNumber()
    itemquantity: number;
    
    
    
    }
    
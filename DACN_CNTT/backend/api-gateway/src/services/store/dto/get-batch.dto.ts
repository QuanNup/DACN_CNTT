import { IsArray, IsOptional, IsObject, IsString } from "class-validator";

class storeId {
    @IsOptional()
    @IsString()
    store_id: string;
}

export class BatchStoreDetails {
    @IsOptional()
    @IsArray()
    @IsObject({ each: true })
    stores: storeId[];
}

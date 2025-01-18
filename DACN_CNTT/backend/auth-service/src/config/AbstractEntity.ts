import { plainToClass } from "class-transformer";

export class AbstractEntity{
    static plainToClass<T>(this: new (...args:any[])=> T,obj:T){
        return plainToClass(this,obj);
    }
}
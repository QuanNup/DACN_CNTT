import { Injectable } from "@nestjs/common";
import { randomBytes, scrypt as scryptAsync, scryptSync } from "crypto";

@Injectable()
export class EncryptService{
    private readonly saltLength = 16;
    private readonly keyLength = 64;

    async hash(password:string):Promise<string>{
        const salt = randomBytes(this.saltLength).toString('hex');
        const derivedKey = await scryptSync(password,salt,this.keyLength);
        return `${salt}:${derivedKey.toString('hex')}`;
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        const [salt, key] = hashedPassword.split(':');
        const derivedKey = await scryptSync(password, salt, this.keyLength);
        return derivedKey.toString('hex') === key;
    }
}
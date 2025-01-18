const bcrypt = require('bcrypt');
const saltRounds = 10;


export const hashPasswordHelper = async (plainPassword: string) => {
    try {
        return await bcrypt.hash(plainPassword, saltRounds)
    } catch (error) {
        console.log(error)
    }
}
export const comparePasswordHelper = async (plainPassword: string, hasdPassword: string) => {
    try {
        return await bcrypt.compare(plainPassword, hasdPassword)
    } catch (error) {
        console.log(error)
    }
}
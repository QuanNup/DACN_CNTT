

export class AuthDto {

    access_token: string;

    refresh_token: string;

    constructor(accessToken: string, refreshtoken: string) {
        this.access_token = accessToken,
            this.access_token = refreshtoken
    }
}
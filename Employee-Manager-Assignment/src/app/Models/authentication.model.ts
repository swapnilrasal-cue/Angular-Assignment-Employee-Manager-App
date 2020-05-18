export class Authentication {
    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _tokenExpirationDate: Date,
    ) { }

    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    }
}

export interface SignupResposeData{
    idToken:string;
    email:string;
    refreshToken:string;
    expiresIn:string;
    localId:string;
}

export interface SignupRequestData{
    email:string	
    password:string
    returnSecureToken:boolean;
}

export interface LoginRequestData{
    email:string;
    password:string
    returnSecureToken:boolean;
}

export interface LoginResponseData{
    idToken:string;
    email:string;
    refreshToken:string;
    expiresIn:string;
    localId:string;
    registered:boolean;
}


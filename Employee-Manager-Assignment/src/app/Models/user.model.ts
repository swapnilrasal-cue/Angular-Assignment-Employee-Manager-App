import { Role } from './role.model';

export class User {
    constructor(
        public name: string,
        public email: string,
        public disabled: string,
        public role: Role,
        public password: string,
        public date : Date,
        public gender: string,
        // public disabled : true,
        public loginStatus: boolean = false
    ) { }

    // get getPassword() {
    //     return this.password;
    // }
}

import { Resort } from "../models/Resort";

export class AppState {
        public isLoggedIn: boolean = false;
        public loggIn:string = "";
        public userName: string;
        public resorts: Resort[];
        public follow: Resort[];
        public refreshModal: boolean = false;
        public sendResort: Resort;
        
}
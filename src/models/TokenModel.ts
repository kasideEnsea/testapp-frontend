import {UserModel} from "@/models/UserModel";

export interface TokenModel {
    user: UserModel;
    tokenData: string;
}

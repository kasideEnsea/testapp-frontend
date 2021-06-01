import {UserModel} from "@/models/UserModel";

export interface TokenModel {
    tokenData: string;
    user: UserModel;
    authorities: string[];
    targetId: number | null;
}

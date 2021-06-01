import axios, {AxiosPromise} from 'axios';
import {root} from "@/api";
import {UserSummaryModel} from "@/models/UserSummaryModel";

export class UserSummaryService {
    private static base = `${root}/user/summary/`;

    public static getUserSummary(userId: number): AxiosPromise<UserSummaryModel[]> {
        return axios.get(`${this.base}/${userId}`);
    }

}

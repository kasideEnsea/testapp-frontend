import {root} from "@/api";
import axios from "axios";
import {EditUserModel} from "@/models/EditUserModel";

export class EditService {
    private static base = `${root}/edit`;

    public static async edit(options: EditUserModel): Promise<void> {
        try {
            return await axios.post(`${EditService.base}/`, options);
        }
        catch (reason) {
            return Promise.reject(reason);
        }
    }
}
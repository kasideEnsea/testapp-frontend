import {UserModel} from "@/models/UserModel";
import {EventModel} from "@/models/EventModel";

export interface ResolvedEventModel extends EventModel {
    user: UserModel;
}

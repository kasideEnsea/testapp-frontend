import {EventModel} from "@/models/EventModel";

export interface EventPage {
    page: number;
    totalPages: number;
    data: EventModel[];
}

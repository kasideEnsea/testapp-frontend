import axios, {AxiosPromise} from 'axios';
import {EventModel} from "@/models/EventModel";
import {root} from "@/api";
import {EventPage} from "@/models/EventPage";

export class EventService {
    private static base = `${root}/event`;

    public static getEventFromFeed(page: number): AxiosPromise<EventPage> {
        return axios.get(`${this.base}/?page=${page}`);
    }

    public static getEventById(id: number): AxiosPromise<EventModel> {
        return axios.get(`${this.base}/${id}`);
    }

    public static deleteById(id: number): AxiosPromise<void> {
        return axios.delete(`${this.base}/${id}`);
    }

}

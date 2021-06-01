import {Task} from "@/models/Task";
import axios from 'axios';
import {root} from "@/api";

export class TasksService {
    private static base = `${root}/tasks`;

    public static getTasks(userId?: number): Promise<Task[]> {
        const url = `${this.base}/` + (userId ? `?userId=${userId}` : '');
        return axios.get(url).then(value => value.data);
    }

    public static addNewTask(task: Task): Promise<Task> {
        return axios.post(`${this.base}/`, task).then(value => value.data);
    }

    public static updateTask(task: Task): Promise<Task> {
        return axios.put(`${this.base}/${task.id}`, task).then(value => value.data);
    }
}

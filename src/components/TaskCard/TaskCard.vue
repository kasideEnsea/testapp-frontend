<i18n src="./TaskCard.yaml"/>
<template>
    <li :key="key" v-if="!task.deleted">
        <div :key="smallKey">
            <template v-if="!editMode">
                <v-row>
                    <div class="text-row">{{task.description || null}}</div>
                    <v-btn :class="{'disable-events': !canBeEdited}" @click="checkboxClicked" color="white"
                           elevation="0"
                           small>
                        <v-checkbox :key="task.done" :label="task.done ? $t('done') : $t('not-done')"
                                    :readonly="true" v-model="task.done"/>
                    </v-btn>
                </v-row>
                <datetime :clock="true"
                          :defaultMessage="$t('no-deadline')" :time-str="task.deadline"/>
            </template>
            <template v-else>
                <v-container>
                    <v-col>
                        <v-row class="edit-row">
                            <v-text-field :label="$t(task.parentId?'task-description':'checklist-description')"
                                          autofocus style="max-width: 500px" v-model="task2edit.description"/>
                            <v-btn @click="save" primary>{{$t('save')}}</v-btn>
                        </v-row>
                        <v-row>
                            <date-editor :label="$t('deadline')" v-model="task2edit.deadline"/>
                        </v-row>
                    </v-col>
                </v-container>
                <datetime :clock="true" :time-str="task.deadline.toString()" v-if="task.deadline"/>
            </template>

            <div v-if="canBeEdited">
                <a @click="editMode=!editMode" class="action">{{$t('edit-task')}}</a>
                <a @click="deleteTask" class="action">{{$t('delete-task')}}</a>
                <a @click="addNewSubTask" class="action" v-if="canBeEdited && allowSubTask"> {{$t('add-subTask')}} </a>
            </div>
        </div>

        <ul>
            <task-card :key="subTask.id" :task="subTask" v-for="subTask in (task.tasks || [])"/>
        </ul>
    </li>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import LanguageSelector from "@/components/Header/LanguageSelector.vue";
    import {Task} from "@/models/Task";
    import Datetime from "@/components/Datetime.vue";
    import {SecurityService} from "@/security/SecurityService";
    import DateEditor from "@/components/DateEditor/DateEditor.vue";
    import {TasksService} from "@/services/TasksService";

    @Component({
        components: {DateEditor, Datetime, LanguageSelector}
    })
    export default class TaskCard extends Vue {
        @Prop() task!: Task;
        @Prop() isEditing: boolean | undefined;
        editMode = !!this.isEditing || !this.task.id;
        key = 0;
        smallKey = 0;

        task2edit: Task = Object.assign({}, this.task);

        get canBeEdited() {
            return this.task.userId === SecurityService.getUser()?.id || !this.task.userId;
        }

        private save(): void {
            if (!this.updateTask)
                return;
            this.updateTask(this.task2edit).then(value => {
                this.task = Object.assign(this.task, value);
                this.task2edit = Object.assign({}, this.task);
                this.editMode = false;
                this.smallKey++;
            });
        }

        private async deleteTask(): Promise<void> {
            if (!this.task.id) {
                this.task.deleted = true;
                this.key++;
                return;
            }
            this.task2edit.deleted = true;
            await this.save();
        }

        private addNewSubTask(): void {
            if (!this.task.tasks)
                this.task.tasks = [];
            this.task.tasks.push({parentId: this.task.id});
            this.key++;
        }

        private checkboxClicked(): void {
            if (!this.task || this.task.done !== this.task2edit.done || !this.canBeEdited) {
                return;
            }
            this.task2edit.done = !this.task.done;
            this.save();
        }

        private updateTask(task: Task) {
            task.comment = prompt(this.$t('comment-prompt').toString()) || undefined;
            if (task.id) {
                return TasksService.updateTask(task);
            } else {
                return TasksService.addNewTask(task);
            }
        }

        private allowSubTask(): boolean {
            if (this.task.id)
                return false;

            const tasks = this.task.tasks;
            if (!tasks)
                return true;

            const filtered = tasks.filter(value => !value.deleted);
            if (!filtered)
                return true;

            const last = filtered.pop();
            return !last || !!last.id;
        }
    }

</script>

<style scoped>
    a.action {
        margin-right: 10px;
        opacity: 0.5;
    }

    a:hover.action {
        opacity: 1;
        text-decoration: underline;
    }

    ul {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    li {
        margin-top: 10px;
        margin-bottom: 20px;
        padding-left: 10px;
        margin-left: 10px;
    }

    .text-row {
        width: 500px;
        padding-left: 10px;
    }

    .edit-row * {
        margin: 0 10px;
    }

    .disable-events {
        pointer-events: none
    }

</style>

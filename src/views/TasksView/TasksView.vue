<i18n src="./TasksView.yaml"/>
<template>
    <div class="mx-auto" style="max-width: 1000px;">
        <h1>{{title}}</h1>
        <span v-if="state === State.Loading">{{$t('loading')}}</span>
        <span v-else-if="state === State.Error">{{$t('error')}}</span>
        <ul v-else-if="state === State.Success">
            <task-card :key="task.id" :task="task" v-for="task in tasks"/>
            <li v-if="canBeEdited">
                <a @click="addNewTask" class="action" v-if="allowSubTask">{{$t('add-new-checklist')}}</a>
            </li>
        </ul>
        <br/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from "vue-property-decorator";
    import {TitleService} from "@/services/TitleService";
    import TaskCard from "@/components/TaskCard/TaskCard.vue";
    import {Task} from "@/models/Task";
    import {State} from "@/enum/State";
    import {TasksService} from "@/services/TasksService";
    import {UserService} from "@/services/UserService";
    import {UserModel} from "@/models/UserModel";
    import {SecurityService} from "@/security/SecurityService";

    @Component({
        components: {TaskCard}
    })
    export default class TasksView extends Vue {
        tasks: Task[] | null = null;
        state: State = State.None;
        State = State;
        user: UserModel | null = null;

        get title(): string {
            if (!this.$route.params.userId || +this.$route.params.userId == SecurityService.getUser()?.id)
                return this.$t("my-title").toString();
            return `${this.$t("alien-title")} ${(this.user && this.user.name) || ""}`;
        }

        get canBeEdited(): boolean {
            return +this.$route.params.userId == SecurityService.getUser()?.id
                || !this.$route.params.userId;
        }

        created() {
            this.setTitle();
            this.state = State.Loading;
            const userId = +this.$route.params.userId || undefined;
            TasksService.getTasks(userId).then(value => {
                this.tasks = value;
                this.state = State.Success;
            }).catch(reason => {
                console.error(reason);
                this.state = State.Error;
            })
            if (this.$route.params.userId) {
                UserService.getUserById(+this.$route.params.userId).then(value => {
                    this.user = value;
                }).catch(reason => {
                    console.error(reason);
                });
            }
        }

        @Watch("$i18n.locale")
        @Watch("user")
        private setTitle() {
            TitleService.setTitle(this.title);
        }

        private addNewTask() {
            if (!this.tasks)
                this.tasks = [];
            this.tasks.push({});
        }

        private allowSubTask(): boolean {
            if (!this.tasks)
                return true;

            const filtered = this.tasks.filter(value => !value.deleted);
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
</style>

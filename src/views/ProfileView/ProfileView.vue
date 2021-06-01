<i18n src="./ProfileView.yaml"/>
<template>
    <div class="mx-auto" style="max-width: 1000px;">
        <h1>{{title}}</h1>
        <div v-if="user">
            {{$t('name_text', {name: user.name || $t('stranger')})}}<br/>
            {{$t('login_text', {login: user.login || $t('stranger')})}}<br/>
            {{$t('about_text', {about: user.about || $t('emptyAbout')})}}<br/>
        </div>
        <template v-else>
            {{$t('loading')}}
        </template>
        <summary-card :key="$i18n.locale" :user-id="userId"/>
        <router-link :to="`/tasks/${userId}`" v-if="user">{{$t('user_tasks', {name: user.name})}}</router-link>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from "vue-property-decorator";
    import {TitleService} from "@/services/TitleService";
    import {UserModel} from "@/models/UserModel";
    import {UserService} from "@/services/UserService";
    import {SecurityService} from "@/security/SecurityService";
    import SummaryCard from "@/components/SummaryCard/SummaryCard.vue";

    @Component({
        components: {SummaryCard}
    })
    export default class ProfileView extends Vue {
        user: UserModel | null = null;

        get title(): string {
            if (!this.$route.params.userId || +this.$route.params.userId == SecurityService.getUser()?.id)
                return this.$t("my-title").toString();
            return `${this.$t("alien-title")} ${(this.user && this.user.name) || ""}`;
        }

        get canBeEdited(): boolean {
            return +this.$route.params.userId == SecurityService.getUser()?.id;
        }

        get userId(): number {
            return +this.$route.params.userId || SecurityService.getUser()?.id || 0;
        }

        created() {
            this.setTitle();
            if (this.userId) {
                UserService.getUserById(this.userId).then(value => {
                    this.user = value;
                }).catch(reason => {
                    console.error(reason);
                });
            }
        }

        @Watch("$i18n.locale")
        private setTitle() {
            TitleService.setTitle(this.title);
        }
    }
</script>

<style scoped>

</style>

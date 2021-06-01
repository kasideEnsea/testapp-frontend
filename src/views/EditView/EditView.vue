<i18n src="./EditView.yaml"/>
<template>
    <div class="mx-auto" style="max-width: 1000px;">
        <h1>{{$t('title')}}</h1>
        <v-card class="card my-4" style="max-width: 440px;">
            <v-card-text>
                <v-form
                        class="mx-auto"
                        ref="form"
                        v-model="valid"
                        :key="$i18n.locale"
                >
                    <v-text-field
                            @keydown.enter="edit"
                            :label="$t('form.label.name')"
                            required
                            type="name"
                            v-model="options.name"
                            :rules="[v => !!v || $t('form.error.name_required')]"
                    ></v-text-field>
                    <v-text-field
                            @keydown.enter="edit"
                            :label="$t('form.label.login')"
                            required
                            v-model="options.login"
                            :rules="[v => !!v || $t('form.error.login_required')]"
                    ></v-text-field>
                    <v-text-field
                            @keydown.enter="edit"
                            :label="$t('form.label.about')"
                            required
                            v-model="options.about"
                    ></v-text-field>
                    <v-text-field
                            :label="$t('form.label.old_password')"
                            v-model="options.oldPassword"
                            @keydown.enter="edit"
                            type="password"
                    ></v-text-field>
                    <v-text-field
                            :label="$t('form.label.new_password')"
                            v-model="options.newPassword"
                            @keydown.enter="edit"
                            type="password"
                    ></v-text-field>
                    <v-text-field
                            :label="$t('form.label.confirm_password')"
                            :rules="[v => v === options.newPassword || !v && !options.newPassword || $t('form.error.password_mismatch')]"
                            @keydown.enter="edit"
                            type="password"
                    ></v-text-field>
                    <v-btn :disabled="submitDisabled"
                           :loading="isLoading"
                           @click="edit"
                           class="white--text"
                           color="primary"
                           raised>
                        {{$t('form.button')}}
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
        <v-alert type="success" v-if="isSuccess">
            {{$t('success')}}
        </v-alert>
        <v-alert type="info" v-if="isLoading">
            {{$t('loading')}}
        </v-alert>
        <div :key="errCode">
            <v-alert type="error" v-if="isError">
                {{getErrorDescription}}
            </v-alert>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from "vue-property-decorator";
    import {State} from "@/enum/State";
    import {EditUserModel} from "@/models/EditUserModel";
    import {TitleService} from "@/services/TitleService";
    import {SecurityService} from "@/security/SecurityService";
    import {UserService} from "@/services/UserService";
    import {EditService} from "@/security/EditService";

    @Component({})
    export default class LoginView extends Vue {
        private state = State.None;
        private errCode = 0;
        private errorDict!: Record<number, string>;
        private valid = false;
        private options = new class implements EditUserModel {
            about = "";
            id = 0;
            name = "";
            login = "";
            newPassword = "";
            oldPassword = "";
        };

        created() {
            this.setTitle();
            const userId = +this.$route.params.userId || SecurityService.getUser()?.id;
            if (userId) {
                UserService.getUserById(userId).then(value => {
                    this.options.about = value.about;
                    this.options.id = value.id;
                    this.options.login = value.login;
                    this.options.name = value.name;
                }).catch(reason => {
                    console.error(reason);
                });
            }

            this.errorDict = {
                400: this.$t('error.400').toString(),
                409: this.$t('error.409').toString(),
            };
        }

        get getErrorDescription(): string {
            const error = this.errorDict[this.errCode];
            if (error)
                return error;
            else
                return this.$t('error.default', {errCode: this.errCode}).toString();
        }

        get isLoading(): boolean {
            return this.state == State.Loading;
        }

        get isSuccess(): boolean {
            return this.state == State.Success;
        }

        get isError(): boolean {
            return this.state == State.Error;
        }

        @Watch("$i18n.locale")
        private setTitle() {
            TitleService.setTitle(this.$t('title').toString());
        }

        get submitDisabled(): boolean {
            return this.isLoading || !this.valid;
        }

        private edit(): void {
            if (this.submitDisabled)
                return;
            this.state = State.Loading;
            EditService.edit(this.options).then(() => {
                this.state = State.Success;
            }).catch(reason => {
                console.error("Reason: " + reason);
                this.errCode = reason.response.status;
                this.state = State.Error;
            });
        }
    }
</script>

<style scoped>

</style>

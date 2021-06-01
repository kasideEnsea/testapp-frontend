<i18n src="./LoginView.yaml"/>
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
                            @keydown.enter="authorize"
                            autofocus
                            :label="$t('form.label.login')"
                            required
                            v-model="options.login"
                            :rules="[v => !!v || $t('form.error.login_required')]"
                    ></v-text-field>
                    <v-text-field
                            @keydown.enter="authorize"
                            :label="$t('form.label.password')"
                            required
                            type="password"
                            v-model="options.password"
                            :rules="[v => !!v || $t('form.error.password_required')]"
                    ></v-text-field>
                    <v-btn :disabled="submitDisabled"
                           :loading="isLoading"
                           @click="authorize"
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
    import {AuthService} from "@/security/AuthService";
    import {LoginOptions} from "@/models/LoginOptions";
    import {TitleService} from "@/services/TitleService";

    @Component({})
    export default class LoginView extends Vue {
        private state = State.None;
        private errCode = 0;
        private errorDict!: Record<number, string>
        private valid = false;
        private options = new class implements LoginOptions {
            login = "";
            password = "";
        };

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

        created() {
            this.setTitle();
            this.errorDict = {
                401: this.$t('error.401').toString(),
                403: this.$t('error.403').toString(),
            };
        }

        @Watch("$i18n.locale")
        private setTitle() {
            TitleService.setTitle(this.$t('title').toString());
        }

        get submitDisabled(): boolean {
            return this.isLoading || !this.valid;
        }

        private authorize(): void {
            if (this.submitDisabled)
                return;
            this.state = State.Loading;
            AuthService.authorize(this.options).then(() => {
                this.state = State.Success;
                this.$router.push("/");
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

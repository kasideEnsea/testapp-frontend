<i18n src="./Header.yaml"/>
<template>
    <v-app-bar app color="primary" dark>
        <router-link tag="span" to="/">
            <div class="myTitle">
                {{$t('title')}}
            </div>
        </router-link>
        <span class="right">
            <router-link  tag="span" to="/" v-if="isAuthorized">
                <v-btn  color="primary" dark depressed>{{$t('tests')}}</v-btn>
            </router-link>
            <router-link tag="span" to="/registration" v-if="!isAuthorized">
                <v-btn color="primary" dark depressed>{{$t('registration')}}</v-btn>
            </router-link>
            <router-link tag="span" to="/login" v-if="!isAuthorized">
                <v-btn color="primary" dark depressed>{{$t('login')}}</v-btn>
            </router-link>
            <span class="text-center" v-if="isAuthorized">
                <v-menu offset-y>
                    <template v-slot:activator="{on}">
                        <v-btn
                                color="primary" dark depressed large v-on="on">
                            <div class="ma-n2 text--white">
                                <!--suppress HtmlUnknownTarget -->
                                <img :src="'/nophoto.png'" alt="avatar" class="ava"/>
                                {{displayName}}
                                <v-icon>mdi-menu-down</v-icon>
                            </div>
                        </v-btn>
                    </template>
                    <v-list>
                        <router-link tag="span" to="/logout">
                            <v-list-item @click="() => true">
                                <v-list-item-title>{{$t('menu.logout')}}</v-list-item-title>
                            </v-list-item>
                        </router-link>
                    </v-list>
                </v-menu>
            </span>
        </span>
    </v-app-bar>
</template>

<script lang="ts">
    import {Mixins} from "vue-property-decorator";
    import SecurityMixin from "@/security/SecurityMixin";

    export default class Header extends Mixins(SecurityMixin) {
        get displayName(): string {
            return !!this.user && this.user.login || this.$t('default_name').toString();
        }
    }

</script>

<style scoped>
    .myTitle {
        font-size: 20pt;
    }

    .right {
        margin-left: auto;
    }

    .ava {
        width: 40px;
        height: 40px;
        border-radius: 100%;
        display: inline;
        vertical-align: middle;
        margin: 4px;
    }
</style>

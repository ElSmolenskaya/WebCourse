<template>
    <v-app id="app">
        <v-app-bar app shrink-on-scroll>

            <v-app-bar-nav-icon></v-app-bar-nav-icon>

            <v-toolbar-title class="pb-2">Movies</v-toolbar-title>

            <v-spacer></v-spacer>

        </v-app-bar>

        <v-main>
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>

export default {
    name: 'App',

    data: () => ({
        //
    }),
};
</script>

<template>
  <v-app>
    <v-main class="bg-grey-lighten-3">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center" class="fill-height">
          <v-col cols="12" sm="8" md="5" lg="4">
            <div class="text-center mb-6">
              <v-icon size="56" color="primary">mdi-package-variant-closed</v-icon>
              <div class="text-h5 font-weight-bold mt-2 text-primary">Software Management</div>
              <div class="text-caption text-medium-emphasis">SENA</div>
            </div>
            <slot />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<template>
  <v-app>
    <v-main class="auth-bg">
      <div class="hero-particles" />
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center" class="fill-height">
          <v-col cols="12" sm="8" md="5" lg="4">
            <div class="text-center mb-8 fade-in-up">
              <v-avatar color="white" size="72" rounded="xl" class="mb-4" style="box-shadow: 0 8px 32px rgba(57,169,0,0.3)">
                <v-icon size="40" color="primary">mdi-package-variant-closed</v-icon>
              </v-avatar>
              <div class="text-h4 font-weight-bold text-white">Software SENA</div>
              <div class="text-caption text-white" style="opacity: 0.7">Sistema de Gestión de Software</div>
            </div>
            <div class="fade-in-up delay-2">
              <slot />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.auth-bg {
  background: linear-gradient(135deg, #00324D 0%, #004A6E 40%, #2D8600 100%);
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;
  min-height: 100vh;
  position: relative;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>

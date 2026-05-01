<template>
  <div>
    <UiAppHeader @book="showForm = true" />
    <SectionsHero />
    <SectionsIntro />
    <UiEthnicDivider variant="light" />
    <SectionsRooms />
    <UiEthnicDivider variant="medium" />
    <SectionsServices />
    <UiEthnicDivider variant="light" />
    <SectionsUsp />
    <UiEthnicDivider variant="medium" />
    <SectionsReviews />
    <UiEthnicDivider variant="light" />
    <SectionsActivities />
    <UiEthnicDivider variant="medium" />
    <SectionsLocation />
    <UiEthnicDivider variant="light" />
    <SectionsGallery />
    <UiEthnicDivider variant="medium" />
    <SectionsFaq />
    <UiEthnicDivider variant="light" />
    <SectionsBlog />
    <SectionsContactFooter />

    <UiBookingModal v-model="showForm" />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Радде — Пансионат в горах Дагестана',
})

const showForm = ref(false)
</script>

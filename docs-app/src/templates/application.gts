import pageTitle from "ember-page-title/helpers/page-title";

import { Shell } from "@universal-ember/docs-support";

<template>
  <Shell>
    {{pageTitle "@universal-ember/table"}}

    {{outlet}}
  </Shell>
</template>

import { GitHubLink } from "#components/header.gts";
import { ExternalLink, service } from "ember-primitives";

import { OopsError, PageLayout } from "@universal-ember/docs-support";

<template>
  <PageLayout>
    <:logoLink>
      <span class="dark:text-sky-400">Table</span>
    </:logoLink>
    <:topRight>
      <GitHubLink />
    </:topRight>
    <:error as |error|>
      <OopsError @error={{error}}>
        If you have a GitHub account (and the time),
        <ReportingAnIssue />
        would be most helpful! 🎉
      </OopsError>
    </:error>
    <:editLink as |Link|>
      {{#let (service "kolay/docs") as |docs|}}
        <Link
          @href="https://github.com/universal-ember/table/edit/main/docs-app/public/docs{{docs.selected.path}}.md"
        >
          Edit this page
        </Link>
      {{/let}}
    </:editLink>
  </PageLayout>
</template>

const ReportingAnIssue = <template>
  <ExternalLink
    href="https://github.com/universal-ember/ember-primitives/issues/new"
  >
    reporting an issue
  </ExternalLink>
</template>;

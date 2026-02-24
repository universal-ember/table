import { ExternalLink } from "ember-primitives";

import { GitHub } from "@universal-ember/docs-support/icons";
import type { TOC } from "@ember/component/template-only";

export const APIReferenceLink = <template>
  <a
    href="/api"
    class="self-center text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
    ...attributes
  >
    API Reference
  </a>
</template> satisfies TOC<{ Element: HTMLAnchorElement }>;

export const GitHubLink = <template>
  <ExternalLink
    class="group text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
    href="https://github.com/universal-ember/table"
    aria-label="GitHub"
    ...attributes
  >
    <GitHub class="w-6 h-6 fill-current" />
  </ExternalLink>
</template> satisfies TOC<{ Element: HTMLAnchorElement }>;

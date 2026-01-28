import { ExternalLink } from "ember-primitives";

import { GitHub } from "@universal-ember/docs-support/icons";

export const APIReferenceLink = <template>
  <a
    href="/api"
    class="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
  >
    API Reference
  </a>
</template>;

export const GitHubLink = <template>
  <ExternalLink
    class="group"
    href="https://github.com/universal-ember/table"
    aria-label="GitHub"
  >
    <GitHub
      class="w-6 h-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300"
    />
  </ExternalLink>
</template>;

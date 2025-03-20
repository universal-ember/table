import { ExternalLink } from "ember-primitives";

import { GitHub } from "@universal-ember/docs-support/icons";

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

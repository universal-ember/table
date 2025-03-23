import { GitHubLink } from "#components/header.gts";
import { ExternalLink } from "ember-primitives/components/external-link";

import {
  Article,
  H2,
  IndexPage,
  InternalLink,
  Link,
  Text,
  TopRight,
} from "@universal-ember/docs-support";
import {
  BlueSky,
  Discord,
  GitHub,
  Mastodon,
  Threads,
  XTwitter,
} from "@universal-ember/docs-support/icons";

<template>
  <IndexPage>
    <:header>
      <TopRight>
        <GitHubLink />
      </TopRight>
    </:header>
    <:tagline>
      <h1 class="text-3xl mb-4">Table</h1>
      <p>
        A headless table implementation that supports all the major
        product-level features needed for feature-rich tables. Bring your own
        markup and styles without the need to implement any of the table
        behaviors.
      </p>

    </:tagline>
    <:callToAction>
      <InternalLink
        href="/1-get-started/index.md"
        style="color: white; text-shadow: 0px 2px 0px black; transform: scale(2.5);"
      >
        Get Started ➤
      </InternalLink>
    </:callToAction>
    <:content>
      <div class="text-2xl w-[50%] mx-auto p-8">
        The
        <em>headless or styleless</em>
        table is markup and style agostic, so you can use tailwind, bootstrap,
        MaterialUI, etc and bring your own DOM.
      </div>

      <br /><br />

      <div class="mx-auto" style="width: 66%">
        <Article class="flex flex-wrap gap-12 justify-around">

          <div class="max-w-[300px]">
            <H2>Plugin Architecture</H2><br />

            <Text>
              Pay for only what you use. With plugins, you only ship the bytes
              you import. Create your own plugins for features that aren't
              provided, or use the battled-tested defaults.
            </Text>
          </div>

          <div class="max-w-[300px]">
            <H2>Native preferences</H2><br />

            <Text>
              Every plugin has safe, namespaced, segmentation for persisting
              user-desires in either a local or remote storage.
            </Text>
          </div>

          <div class="max-w-[300px]">
            <H2>Reordering columns</H2><br />

            <Text>
              Change the order of columns.
            </Text>
          </div>

          <div class="max-w-[300px]">
            <H2>Resizable columns</H2><br />

            <Text>
              Accessibly change the width of columns with the mouse or keyboard.
            </Text>
          </div>
          <div class="max-w-[300px]">
            <H2>Data sorting</H2><br />

            <Text>
              Change the order of data. Integrate with your existing sorting
              APIs.
            </Text>
          </div>
          <div class="max-w-[300px]">
            <H2>Sticky columns</H2><br />

            <Text>
              Pin columns to the left or right side of the table so that they
              stick to that side.
            </Text>
          </div>

        </Article>
      </div>

      <br /><br />
      <br /><br />

    </:content>

    <:footer>

      <div>
        <Text>Dependencies / Projects used by @universal-ember/table that are
          worth looking at.</Text>
        <nav class="dark:text-white text:slate-900">
          <ul>
            <li>
              <Link href="https://github.com/universal-ember/reactiveweb">
                reactiveweb
              </Link><br />
              Reactive utilities used in some components.
            </li>
            <li>
              <Link href="https://github.com/nullVoxPopuli/form-data-utils">
                form-data-utils
              </Link><br />
              Utilities for working with
              <Link
                href="https://developer.mozilla.org/en-US/docs/Web/API/FormData"
              >FormData</Link>.
            </li>
            <li>
              <Link href="https://github.com/NullVoxPopuli/should-handle-link">
                should-handle-link
              </Link><br />
              Utilities for managing native link clicks in single-page-apps.
            </li>
            <li>
              <Link href="https://github.com/universal-ember/test-support">
                @universal-ember/test-support
              </Link><br />
              Extra helpers for testing.
            </li>
          </ul>
        </nav>
      </div>

      <div>
        <Socials />
      </div>
    </:footer>
  </IndexPage>
</template>

const Socials = <template>
  <div class="flex gap-3">
    <ExternalLink href="https://github.com/NullVoxPopuli/">
      <GitHub class="dark:fill-white fill-slate-900 h-6 w-6" />
    </ExternalLink>
    <ExternalLink href="http://discord.gg/cTvtmJhFNY">
      <Discord class="dark:fill-white fill-slate-900 h-6 w-6" />
    </ExternalLink>
    <ExternalLink href="https://x.com/nullvoxpopuli">
      <XTwitter class="dark:fill-white fill-slate-900 h-6 w-6" />
    </ExternalLink>
    <ExternalLink href="https://mastodon.coffee/@nullvoxpopuli">
      <Mastodon class="dark:fill-white fill-slate-900 h-6 w-6" />
    </ExternalLink>
    <ExternalLink href="https://bsky.app/profile/nullvoxpopuli.bsky.social">
      <BlueSky class="dark:fill-white fill-slate-900 h-6 w-6" />
    </ExternalLink>
    <ExternalLink href="https://www.threads.net/@nullvoxpopuli">
      <Threads class="dark:fill-white fill-slate-900 h-6 w-6" />
    </ExternalLink>
  </div>
</template>;

const GetStarted = <template>
  <InternalLink href="/1-get-started/index.md" style="transform: scale(2.5);">
    Get Started ➤
  </InternalLink>
</template>;

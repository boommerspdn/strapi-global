import type { Core } from '@strapi/strapi';

type DomainKey = 'fastontime' | 'bprservice' | 'bssupply';

type DomainConfig = {
  key: DomainKey;
  label: string;
  prefix: string;
  envName: string;
};

type PendingBuild = {
  actions: Set<string>;
  contentTypes: Set<string>;
};

const DOMAIN_CONFIGS: DomainConfig[] = [
  {
    key: 'fastontime',
    label: 'Fast On Time',
    prefix: 'api::fastontime-',
    envName: 'FASTONTIME_BUILD_WEBHOOK_URLS',
  },
  {
    key: 'bprservice',
    label: 'BPR Service',
    prefix: 'api::bprservice-',
    envName: 'BPRSERVICE_BUILD_WEBHOOK_URLS',
  },
  {
    key: 'bssupply',
    label: 'BS Supply',
    prefix: 'api::bssupply-',
    envName: 'BSSUPPLY_BUILD_WEBHOOK_URLS',
  },
];

const BUILD_TRIGGER_ACTIONS = new Set(['afterCreate', 'afterUpdate', 'afterDelete']);
const DEFAULT_DEBOUNCE_MS = 30_000;

export function registerDomainBuildWebhooks(strapi: Core.Strapi) {
  const targets = getBuildTargets();
  const configuredDomains = DOMAIN_CONFIGS.filter(({ key }) => targets[key].length > 0);

  if (configuredDomains.length === 0) {
    strapi.log.debug('[build-webhooks] No domain build webhook URLs configured.');
    return;
  }

  const modelDomains = getModelDomainMap(strapi, configuredDomains);
  const models = Array.from(modelDomains.keys());

  if (models.length === 0) {
    strapi.log.warn('[build-webhooks] Build webhook URLs are configured, but no matching domain content types were found.');
    return;
  }

  const debounceMs = getDebounceMs();
  const timers = new Map<DomainKey, NodeJS.Timeout>();
  const pendingBuilds = new Map<DomainKey, PendingBuild>();

  strapi.db.lifecycles.subscribe({
    models,
    afterCreate: (event) => scheduleDomainBuild(event),
    afterUpdate: (event) => scheduleDomainBuild(event),
    afterDelete: (event) => scheduleDomainBuild(event),
  });

  strapi.log.info(
    `[build-webhooks] Watching ${models.length} domain content type(s): ${configuredDomains
      .map(({ label }) => label)
      .join(', ')}`
  );

  function scheduleDomainBuild(event: any) {
    if (!BUILD_TRIGGER_ACTIONS.has(event.action)) return;

    const uid = event.model?.uid;
    const domain = typeof uid === 'string' ? modelDomains.get(uid) : undefined;

    if (!domain) return;

    const pending = pendingBuilds.get(domain) ?? {
      actions: new Set<string>(),
      contentTypes: new Set<string>(),
    };

    pending.actions.add(event.action);
    pending.contentTypes.add(uid);
    pendingBuilds.set(domain, pending);

    const existingTimer = timers.get(domain);
    if (existingTimer) clearTimeout(existingTimer);

    timers.set(
      domain,
      setTimeout(() => {
        timers.delete(domain);
        const build = pendingBuilds.get(domain);
        pendingBuilds.delete(domain);

        if (!build) return;

        void triggerDomainBuild(strapi, domain, targets[domain], {
          actions: Array.from(build.actions).sort(),
          contentTypes: Array.from(build.contentTypes).sort(),
        });
      }, debounceMs)
    );
  }
}

function getBuildTargets(): Record<DomainKey, string[]> {
  return DOMAIN_CONFIGS.reduce(
    (targets, { key, envName }) => {
      targets[key] = parseUrlList(process.env[envName]);
      return targets;
    },
    {
      fastontime: [],
      bprservice: [],
      bssupply: [],
    } as Record<DomainKey, string[]>
  );
}

function getModelDomainMap(strapi: Core.Strapi, configuredDomains: DomainConfig[]) {
  const modelDomains = new Map<string, DomainKey>();
  const uids = Object.keys(strapi.contentTypes);

  for (const uid of uids) {
    const domain = configuredDomains.find(({ prefix }) => uid.startsWith(prefix));

    if (domain) {
      modelDomains.set(uid, domain.key);
    }
  }

  return modelDomains;
}

function parseUrlList(value: string | undefined) {
  if (!value) return [];

  return value
    .split(/[\n,]+/)
    .map((url) => url.trim())
    .filter(Boolean);
}

function getDebounceMs() {
  const parsed = Number(process.env.DOMAIN_BUILD_WEBHOOK_DEBOUNCE_MS);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return DEFAULT_DEBOUNCE_MS;
  }

  return parsed;
}

async function triggerDomainBuild(
  strapi: Core.Strapi,
  domain: DomainKey,
  urls: string[],
  changed: { actions: string[]; contentTypes: string[] }
) {
  const payload = {
    domain,
    triggeredAt: new Date().toISOString(),
    changed,
  };

  const results = await Promise.allSettled(
    urls.map((url) =>
      fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    )
  );

  results.forEach((result, index) => {
    const url = urls[index];
    const target = formatWebhookTargetForLog(url);

    if (result.status === 'rejected') {
      strapi.log.error(`[build-webhooks] ${domain} build hook failed for ${target}: ${result.reason}`);
      return;
    }

    if (!result.value.ok) {
      strapi.log.error(
        `[build-webhooks] ${domain} build hook failed for ${target}: ${result.value.status} ${result.value.statusText}`
      );
      return;
    }

    strapi.log.info(`[build-webhooks] Triggered ${domain} build hook for ${target}`);
  });
}

function formatWebhookTargetForLog(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return 'configured URL';
  }
}

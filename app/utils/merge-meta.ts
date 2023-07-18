// Meta merging helper for overriding and appending meta tags
// https://gist.github.com/ryanflorence/ec1849c6d690cfbffcb408ecd633e069

import type { LoaderFunction, V2_HtmlMetaDescriptor, V2_MetaFunction } from '@remix-run/node';

export function mergeMeta<
  Loader extends LoaderFunction | unknown = unknown,
  ParentsLoaders extends Record<string, LoaderFunction> = {},
>(
  overrideFn: V2_MetaFunction<Loader, ParentsLoaders>,
  appendFn?: V2_MetaFunction<Loader, ParentsLoaders>,
): V2_MetaFunction<Loader, ParentsLoaders> {
  return (arg) => {
    // get meta and overwrite meta title, name, property from parent routes
    let mergedMeta = arg.matches.reduce<V2_HtmlMetaDescriptor[]>((acc, match) => {
      (match as { meta?: V2_HtmlMetaDescriptor[] }).meta?.forEach((meta) => {
        const index = acc.findIndex((m) => {
          return (
            ('name' in m && 'name' in meta && m.name === meta.name) ||
            ('property' in m && 'property' in meta && m.property === meta.property) ||
            ('title' in m && 'title' in meta)
          );
        });

        if (index > -1) {
          acc[index] = meta;
        } else {
          acc.push(meta);
        }
      });
      return acc;
    }, []);

    // replace any parent meta with the same name or property with the override
    const overrides = overrideFn(arg);

    overrides.forEach((override) => {
      const index = mergedMeta.findIndex((meta) => {
        return (
          ('name' in meta && 'name' in override && meta.name === override.name) ||
          ('property' in meta && 'property' in override && meta.property === override.property) ||
          ('title' in meta && 'title' in override)
        );
      });

      if (index > -1) {
        mergedMeta[index] = override;
      } else {
        mergedMeta.push(override);
      }
    });

    // append any additional meta
    if (appendFn) {
      mergedMeta = mergedMeta.concat(appendFn(arg));
    }

    return mergedMeta;
  };
}

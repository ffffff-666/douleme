(function (global) {
  const registry = {
    defaults: {
      'ai-generate': { seriesId: 'mard', variantId: '221' },
      'image-convert': { seriesId: 'mard', variantId: '221' }
    },
    series: {
      mard: {
        id: 'mard',
        label: 'MARD',
        description: 'MARD 系列拼豆色号体系',
        variants: {
          '221': {
            id: '221',
            label: '221色',
            displayLabel: 'MARD（221色）',
            enabled: true,
            available: true,
            channelSupport: ['ai-generate', 'image-convert']
          },
          '120': {
            id: '120',
            label: '120色',
            displayLabel: 'MARD（120色）',
            enabled: false,
            available: false,
            channelSupport: ['ai-generate', 'image-convert']
          }
        }
      }
    }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getDefault(channel) {
    const fallback = registry.defaults['image-convert'];
    const target = registry.defaults[channel] || fallback;
    return clone(target);
  }

  function getSeries(seriesId) {
    const series = registry.series[seriesId];
    return series ? clone(series) : null;
  }

  function getVariant(seriesId, variantId) {
    const series = registry.series[seriesId];
    if (!series) return null;
    const variant = series.variants[variantId];
    if (!variant) return null;
    return clone({
      ...variant,
      seriesId,
      seriesLabel: series.label,
      displayLabel: variant.displayLabel || `${series.label}（${variant.label}）`
    });
  }

  function getDisplayLabel(channel) {
    const current = getDefault(channel);
    return getVariant(current.seriesId, current.variantId)?.displayLabel || 'MARD（221色）';
  }

  global.GodDouBeadRegistry = {
    getRegistry() {
      return clone(registry);
    },
    getDefault,
    getSeries,
    getVariant,
    getDisplayLabel
  };
})(window);
